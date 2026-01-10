import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";

const AdminExams = () => {
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterClass, setFilterClass] = useState('all');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    classId: '',
    subject: '',
    date: '',
    startTime: '',
    endTime: '',
    maxMarks: 100,
    passMarks: 40
  });

  // Mock data
  useEffect(() => {
    const mockExams = [
      {
        _id: '1',
        title: 'Mid-term Mathematics Exam',
        classId: { _id: '1', name: '10', section: 'A' },
        subject: 'Mathematics',
        date: '2024-02-15',
        startTime: '09:00',
        endTime: '12:00',
        maxMarks: 100,
        passMarks: 40,
        status: 'upcoming'
      },
      {
        _id: '2',
        title: 'English Literature Quiz',
        classId: { _id: '2', name: '11', section: 'A' },
        subject: 'English Literature',
        date: '2024-01-20',
        startTime: '10:00',
        endTime: '11:30',
        maxMarks: 50,
        passMarks: 20,
        status: 'completed'
      },
      {
        _id: '3',
        title: 'Computer Science Practical',
        classId: { _id: '3', name: '12', section: 'A' },
        subject: 'Computer Science',
        date: '2024-02-10',
        startTime: '14:00',
        endTime: '16:00',
        maxMarks: 75,
        passMarks: 30,
        status: 'ongoing'
      }
    ];

    const mockClasses = [
      { _id: '1', name: '10', section: 'A' },
      { _id: '2', name: '10', section: 'B' },
      { _id: '3', name: '11', section: 'A' },
      { _id: '4', name: '12', section: 'A' }
    ];

    const mockSubjects = [
      'Mathematics', 'English Literature', 'Computer Science', 'Physics', 'Chemistry', 'Biology'
    ];

    setExams(mockExams);
    setClasses(mockClasses);
    setSubjects(mockSubjects);
    setLoading(false);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || exam.status === filterStatus;
    const matchesClass = filterClass === 'all' || exam.classId._id === filterClass;
    return matchesSearch && matchesStatus && matchesClass;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedClass = classes.find(cls => cls._id === formData.classId);
    
    if (editingExam) {
      // Update existing exam
      setExams(prev => prev.map(exam => 
        exam._id === editingExam._id 
          ? { ...exam, ...formData, classId: selectedClass, _id: editingExam._id }
          : exam
      ));
    } else {
      // Add new exam
      const newExam = {
        ...formData,
        _id: Date.now().toString(),
        classId: selectedClass,
        status: new Date(formData.date) > new Date() ? 'upcoming' : 'completed'
      };
      setExams(prev => [...prev, newExam]);
    }
    
    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      classId: '',
      subject: '',
      date: '',
      startTime: '',
      endTime: '',
      maxMarks: 100,
      passMarks: 40
    });
    setEditingExam(null);
  };

  const handleEdit = (exam) => {
    setEditingExam(exam);
    setFormData({
      title: exam.title,
      classId: exam.classId._id,
      subject: exam.subject,
      date: exam.date,
      startTime: exam.startTime,
      endTime: exam.endTime,
      maxMarks: exam.maxMarks,
      passMarks: exam.passMarks
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (examId) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      setExams(prev => prev.filter(exam => exam._id !== examId));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading exams...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📝 Exams Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-blue-600 hover:bg-blue-700">
              ➕ Schedule Exam
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingExam ? 'Edit Exam' : 'Schedule New Exam'}
              </DialogTitle>
              <DialogDescription>
                {editingExam ? 'Update exam details' : 'Create a new exam schedule'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Exam Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Mid-term Mathematics Exam"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="classId">Class</Label>
                  <Select value={formData.classId} onValueChange={(value) => setFormData(prev => ({ ...prev, classId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map(cls => (
                        <SelectItem key={cls._id} value={cls._id}>
                          Class {cls.name}-{cls.section}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={formData.subject} onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(subject => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    name="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    name="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxMarks">Maximum Marks</Label>
                  <Input
                    id="maxMarks"
                    name="maxMarks"
                    type="number"
                    min="1"
                    value={formData.maxMarks}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="passMarks">Passing Marks</Label>
                  <Input
                    id="passMarks"
                    name="passMarks"
                    type="number"
                    min="1"
                    value={formData.passMarks}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingExam ? 'Update Exam' : 'Schedule Exam'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search exams by title or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full md:w-40">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-40">
              <Select value={filterClass} onValueChange={setFilterClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classes.map(cls => (
                    <SelectItem key={cls._id} value={cls._id}>
                      Class {cls.name}-{cls.section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exams List */}
      <div className="space-y-4">
        {filteredExams.length > 0 ? (
          filteredExams.map((exam) => (
            <Card key={exam._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      📝 {exam.title}
                      <Badge className={getStatusColor(exam.status)}>
                        {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {exam.subject} • Class {exam.classId.name}-{exam.classId.section}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(exam)}>
                      ✏️ Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(exam._id)} className="text-red-600 hover:text-red-700">
                      🗑️ Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{formatDate(exam.date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium">{exam.startTime} - {exam.endTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Max Marks</p>
                    <p className="font-medium">{exam.maxMarks}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pass Marks</p>
                    <p className="font-medium">{exam.passMarks}</p>
                  </div>
                </div>
                
                <div className="flex space-x-2 mt-4">
                  {exam.status === 'completed' && (
                    <Button variant="outline" size="sm">
                      📊 View Results
                    </Button>
                  )}
                  {exam.status === 'upcoming' && (
                    <Button variant="outline" size="sm">
                      👥 View Students
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    📋 Exam Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-lg font-medium mb-2">No exams found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterStatus !== 'all' || filterClass !== 'all'
                  ? "No exams match your search criteria."
                  : "Start by scheduling your first exam."
                }
              </p>
              <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                📝 Schedule Exam
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminExams;
