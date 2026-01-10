import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";

const AdminSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    classes: [],
    teachers: [],
    creditHours: 1,
    isElective: false,
    category: ''
  });

  // Mock data - replace with API calls
  useEffect(() => {
    const mockSubjects = [
      {
        _id: '1',
        name: 'Mathematics',
        code: 'MATH101',
        description: 'Basic mathematics covering algebra, geometry, and calculus',
        classes: [
          { _id: '1', name: '10', section: 'A', studentsCount: 30 },
          { _id: '2', name: '10', section: 'B', studentsCount: 28 }
        ],
        teachers: [
          { _id: '1', name: 'Dr. Smith', email: 'smith@school.com' }
        ],
        creditHours: 4,
        isElective: false,
        category: 'Science'
      },
      {
        _id: '2',
        name: 'English Literature',
        code: 'ENG201',
        description: 'Study of classic and modern literature',
        classes: [
          { _id: '3', name: '11', section: 'A', studentsCount: 25 }
        ],
        teachers: [
          { _id: '2', name: 'Ms. Johnson', email: 'johnson@school.com' }
        ],
        creditHours: 3,
        isElective: false,
        category: 'Languages'
      },
      {
        _id: '3',
        name: 'Computer Science',
        code: 'CS301',
        description: 'Programming fundamentals and computer applications',
        classes: [
          { _id: '4', name: '12', section: 'A', studentsCount: 22 }
        ],
        teachers: [
          { _id: '3', name: 'Mr. Wilson', email: 'wilson@school.com' }
        ],
        creditHours: 4,
        isElective: true,
        category: 'Technology'
      }
    ];

    const mockClasses = [
      { _id: '1', name: '10', section: 'A' },
      { _id: '2', name: '10', section: 'B' },
      { _id: '3', name: '11', section: 'A' },
      { _id: '4', name: '12', section: 'A' }
    ];

    const mockTeachers = [
      { _id: '1', name: 'Dr. Smith', email: 'smith@school.com' },
      { _id: '2', name: 'Ms. Johnson', email: 'johnson@school.com' },
      { _id: '3', name: 'Mr. Wilson', email: 'wilson@school.com' },
      { _id: '4', name: 'Mrs. Brown', email: 'brown@school.com' }
    ];

    setSubjects(mockSubjects);
    setClasses(mockClasses);
    setTeachers(mockTeachers);
    setLoading(false);
  }, []);

  const categories = ['Science', 'Languages', 'Technology', 'Arts', 'Social Studies'];

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subject.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || subject.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingSubject) {
      // Update existing subject
      setSubjects(prev => prev.map(subject => 
        subject._id === editingSubject._id 
          ? { ...subject, ...formData, _id: editingSubject._id }
          : subject
      ));
    } else {
      // Add new subject
      const newSubject = {
        ...formData,
        _id: Date.now().toString(),
        classes: classes.filter(cls => formData.classes.includes(cls._id)),
        teachers: teachers.filter(teacher => formData.teachers.includes(teacher._id))
      };
      setSubjects(prev => [...prev, newSubject]);
    }
    
    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      classes: [],
      teachers: [],
      creditHours: 1,
      isElective: false,
      category: ''
    });
    setEditingSubject(null);
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      code: subject.code,
      description: subject.description,
      classes: subject.classes.map(cls => cls._id),
      teachers: subject.teachers.map(teacher => teacher._id),
      creditHours: subject.creditHours,
      isElective: subject.isElective,
      category: subject.category
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (subjectId) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      setSubjects(prev => prev.filter(subject => subject._id !== subjectId));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading subjects...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📚 Subjects Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-blue-600 hover:bg-blue-700">
              ➕ Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingSubject ? 'Edit Subject' : 'Add New Subject'}
              </DialogTitle>
              <DialogDescription>
                {editingSubject ? 'Update subject information' : 'Create a new subject for the school'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Subject Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="code">Subject Code</Label>
                  <Input
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="creditHours">Credit Hours</Label>
                  <Input
                    id="creditHours"
                    name="creditHours"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.creditHours}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isElective"
                  name="isElective"
                  checked={formData.isElective}
                  onChange={handleInputChange}
                  className="rounded"
                />
                <Label htmlFor="isElective">Elective Subject</Label>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingSubject ? 'Update Subject' : 'Add Subject'}
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
                placeholder="Search subjects by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subjects List */}
      <div className="space-y-4">
        {filteredSubjects.length > 0 ? (
          filteredSubjects.map((subject) => (
            <Card key={subject._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      📚 {subject.name}
                      {subject.isElective && (
                        <Badge variant="outline" className="text-xs">Elective</Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {subject.code} • {subject.creditHours} credit hours • {subject.category}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(subject)}>
                      ✏️ Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(subject._id)} className="text-red-600 hover:text-red-700">
                      🗑️ Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">{subject.description}</p>
                  
                  {/* Classes */}
                  <div>
                    <h4 className="font-medium mb-2">📚 Classes:</h4>
                    <div className="flex flex-wrap gap-2">
                      {subject.classes.map((cls) => (
                        <Badge key={cls._id} variant="outline" className="text-sm">
                          Class {cls.name}-{cls.section} ({cls.studentsCount} students)
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Teachers */}
                  <div>
                    <h4 className="font-medium mb-2">👨‍🏫 Teachers:</h4>
                    <div className="flex flex-wrap gap-2">
                      {subject.teachers.map((teacher) => (
                        <Badge key={teacher._id} className="bg-green-100 text-green-800">
                          {teacher.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-lg font-medium mb-2">No subjects found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterCategory !== 'all' 
                  ? "No subjects match your search criteria."
                  : "Start by adding your first subject."
                }
              </p>
              <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                📚 Add Subject
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminSubjects;
