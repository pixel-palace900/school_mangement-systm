import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useToast } from "../../components/ui/use-toast";

// Mock data for classes
const mockClasses = [
  { _id: '1', name: '10', section: 'A' },
  { _id: '2', name: '9', section: 'B' },
];

// Mock data for subjects
const mockSubjects = [
  { _id: '1', name: 'Mathematics' },
  { _id: '2', name: 'Science' },
  { _id: '3', name: 'English' },
  { _id: '4', name: 'History' },
  { _id: '5', name: 'Geography' },
];

// Mock data for assignments
const mockAssignments = [
  { 
    _id: '1', 
    title: 'Quadratic Equations', 
    description: 'Solve the given quadratic equations and show your work.', 
    classId: { _id: '1', name: '10', section: 'A' },
    subject: 'Mathematics',
    assignedDate: '2023-06-10',
    dueDate: '2023-06-17',
    maxMarks: 10,
    attachments: []
  },
  { 
    _id: '2', 
    title: 'Chemical Reactions', 
    description: 'Write balanced chemical equations for the given reactions.', 
    classId: { _id: '1', name: '10', section: 'A' },
    subject: 'Science',
    assignedDate: '2023-06-12',
    dueDate: '2023-06-19',
    maxMarks: 10,
    attachments: []
  },
  { 
    _id: '3', 
    title: 'Essay Writing', 
    description: 'Write an essay on the topic "Environmental Conservation".', 
    classId: { _id: '2', name: '9', section: 'B' },
    subject: 'English',
    assignedDate: '2023-06-15',
    dueDate: '2023-06-22',
    maxMarks: 20,
    attachments: []
  },
];

const Assignments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    classId: '',
    subject: '',
    dueDate: '',
    maxMarks: 10
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // In a real app, we would fetch data from the API
        // Simulate API calls with setTimeout
        setTimeout(() => {
          setClasses(mockClasses);
          setSubjects(mockSubjects);
          setAssignments(mockAssignments);
          setFilteredAssignments(mockAssignments);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive"
        });
        setLoading(false);
      }
    };

    loadData();
  }, [toast]);

  // Filter assignments when class or subject changes
  useEffect(() => {
    let filtered = [...assignments];
    
    if (selectedClass) {
      filtered = filtered.filter(assignment => assignment.classId._id === selectedClass);
    }
    
    if (selectedSubject) {
      filtered = filtered.filter(assignment => assignment.subject === selectedSubject);
    }
    
    setFilteredAssignments(filtered);
  }, [selectedClass, selectedSubject, assignments]);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title.trim() || !formData.description.trim() || !formData.classId || !formData.subject || !formData.dueDate) {
      toast({
        title: "Error",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, we would send data to the API
      // Simulate API call with setTimeout
      setTimeout(() => {
        // Create new assignment
        const newAssignment = {
          _id: Date.now().toString(), // Generate a temporary ID
          title: formData.title,
          description: formData.description,
          classId: classes.find(cls => cls._id === formData.classId),
          subject: formData.subject,
          assignedDate: new Date().toISOString().split('T')[0],
          dueDate: formData.dueDate,
          maxMarks: Number(formData.maxMarks),
          attachments: []
        };
        
        // Update assignments state
        setAssignments(prev => [...prev, newAssignment]);
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          classId: '',
          subject: '',
          dueDate: '',
          maxMarks: 10
        });
        
        // Hide form
        setShowAddForm(false);
        
        toast({
          title: "Success",
          description: "Assignment created successfully!",
        });
        
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      console.error('Error creating assignment:', error);
      toast({
        title: "Error",
        description: "Failed to create assignment. Please try again.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  // Handle assignment deletion
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) {
      return;
    }
    
    try {
      // In a real app, we would send a delete request to the API
      // Simulate API call with setTimeout
      setTimeout(() => {
        // Update assignments state
        setAssignments(prev => prev.filter(assignment => assignment._id !== id));
        
        toast({
          title: "Success",
          description: "Assignment deleted successfully!",
        });
      }, 500);
    } catch (error) {
      console.error('Error deleting assignment:', error);
      toast({
        title: "Error",
        description: "Failed to delete assignment. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Assignments</h1>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add New Assignment'}
        </Button>
      </div>
      
      {/* Add Assignment Form */}
      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Assignment</CardTitle>
            <CardDescription>
              Fill in the details to create a new assignment
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter assignment title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="classId">Class</Label>
                  <select
                    id="classId"
                    name="classId"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={formData.classId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Class</option>
                    {classes.map((cls) => (
                      <option key={cls._id} value={cls._id}>
                        Class {cls.name} - {cls.section}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((subject) => (
                      <option key={subject._id} value={subject.name}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxMarks">Maximum Marks</Label>
                  <Input
                    id="maxMarks"
                    name="maxMarks"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.maxMarks}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter assignment description"
                  className="w-full p-2 border border-gray-300 rounded-md min-h-[100px]"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Assignment'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
      
      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="filter-class">Filter by Class</Label>
              <select
                id="filter-class"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="">All Classes</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    Class {cls.name} - {cls.section}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="filter-subject">Filter by Subject</Label>
              <select
                id="filter-subject"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="">All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject.name}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Assignments List */}
      <Card>
        <CardHeader>
          <CardTitle>Assignments</CardTitle>
          <CardDescription>
            Manage your class assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredAssignments.length === 0 ? (
            <p className="text-center text-gray-500">No assignments found.</p>
          ) : (
            <div className="space-y-4">
              {filteredAssignments.map((assignment) => (
                <Card key={assignment._id} className="border-gray-200">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{assignment.title}</CardTitle>
                        <CardDescription>
                          Class {assignment.classId.name} - {assignment.classId.section} | {assignment.subject}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDelete(assignment._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-gray-700 mb-2">{assignment.description}</p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        Assigned: {new Date(assignment.assignedDate).toLocaleDateString()}
                      </span>
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full">
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                        Max Marks: {assignment.maxMarks}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button variant="link" size="sm" className="p-0">
                      View Submissions
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Assignments;
