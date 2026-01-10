import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useToast } from "../../components/ui/use-toast";

// Mock data for circulars
const mockCirculars = [
  { 
    _id: '1', 
    title: 'Annual Sports Day', 
    content: 'The annual sports day will be held on July 15, 2023. All students are required to participate in at least one event.', 
    targetAudience: ['all'],
    publishedBy: { _id: '1', name: 'Admin User', role: 'admin' },
    publishedDate: '2023-06-01',
    attachments: []
  },
  { 
    _id: '2', 
    title: 'Parent-Teacher Meeting', 
    content: 'A parent-teacher meeting will be held on June 25, 2023, from 10:00 AM to 2:00 PM. Parents are requested to attend as per the schedule shared with their children.', 
    targetAudience: ['parent', 'teacher'],
    publishedBy: { _id: '1', name: 'Admin User', role: 'admin' },
    publishedDate: '2023-06-05',
    attachments: []
  },
  { 
    _id: '3', 
    title: 'Mathematics Assignment Submission', 
    content: 'All students of Class 10-A are required to submit their mathematics assignments by June 20, 2023. Late submissions will not be accepted.', 
    targetAudience: ['student'],
    targetClasses: [{ _id: '1', name: '10', section: 'A' }],
    publishedBy: { _id: '2', name: 'John Smith', role: 'teacher' },
    publishedDate: '2023-06-10',
    attachments: []
  },
];

// Mock data for classes
const mockClasses = [
  { _id: '1', name: '10', section: 'A' },
  { _id: '2', name: '9', section: 'B' },
];

const Circulars = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [circulars, setCirculars] = useState([]);
  const [classes, setClasses] = useState([]);
  const [filteredCirculars, setFilteredCirculars] = useState([]);
  const [selectedAudience, setSelectedAudience] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    targetAudience: ['all'],
    targetClasses: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Target audience options
  const audienceOptions = [
    { value: 'all', label: 'All' },
    { value: 'teacher', label: 'Teachers Only' },
    { value: 'student', label: 'Students Only' },
    { value: 'parent', label: 'Parents Only' },
    { value: 'class', label: 'Specific Classes' }
  ];

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // In a real app, we would fetch data from the API
        // Simulate API calls with setTimeout
        setTimeout(() => {
          setCirculars(mockCirculars);
          setFilteredCirculars(mockCirculars);
          setClasses(mockClasses);
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

  // Filter circulars when filters change
  useEffect(() => {
    let filtered = [...circulars];
    
    // Filter by audience
    if (selectedAudience) {
      if (selectedAudience === 'all') {
        filtered = filtered.filter(circular => 
          circular.targetAudience.includes('all')
        );
      } else {
        filtered = filtered.filter(circular => 
          circular.targetAudience.includes(selectedAudience) || 
          circular.targetAudience.includes('all')
        );
      }
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(circular => 
        circular.title.toLowerCase().includes(term) ||
        circular.content.toLowerCase().includes(term)
      );
    }
    
    // Sort by published date (newest first)
    filtered.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
    
    setFilteredCirculars(filtered);
  }, [selectedAudience, searchTerm, circulars]);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'targetAudience') {
      // Handle radio buttons for target audience
      if (value === 'class') {
        // If "Specific Classes" is selected, enable class selection
        setFormData(prev => ({
          ...prev,
          targetAudience: ['student'], // Target students in specific classes
          targetClasses: [] // Reset selected classes
        }));
      } else {
        // For other audience options, set the audience and clear target classes
        setFormData(prev => ({
          ...prev,
          targetAudience: [value],
          targetClasses: []
        }));
      }
    } else if (name === 'targetClasses') {
      // Handle multi-select for classes
      const classId = value;
      let updatedClasses = [...formData.targetClasses];
      
      if (checked) {
        updatedClasses.push(classId);
      } else {
        updatedClasses = updatedClasses.filter(id => id !== classId);
      }
      
      setFormData(prev => ({
        ...prev,
        targetClasses: updatedClasses
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Error",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Validate target audience
    if (formData.targetAudience.includes('student') && formData.targetAudience.length === 1 && formData.targetClasses.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one class for student circulars.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, we would send data to the API
      // Simulate API call with setTimeout
      setTimeout(() => {
        // Create new circular
        const newCircular = {
          _id: Date.now().toString(), // Generate a temporary ID
          title: formData.title,
          content: formData.content,
          targetAudience: formData.targetAudience,
          targetClasses: formData.targetClasses.length > 0 
            ? formData.targetClasses.map(classId => classes.find(cls => cls._id === classId))
            : undefined,
          publishedBy: {
            _id: user.id,
            name: user.name,
            role: user.role
          },
          publishedDate: new Date().toISOString().split('T')[0],
          attachments: []
        };
        
        // Update circulars state
        setCirculars(prev => [newCircular, ...prev]);
        
        // Reset form
        setFormData({
          title: '',
          content: '',
          targetAudience: ['all'],
          targetClasses: []
        });
        
        // Hide form
        setShowAddForm(false);
        
        toast({
          title: "Success",
          description: "Circular published successfully!",
        });
        
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      console.error('Error publishing circular:', error);
      toast({
        title: "Error",
        description: "Failed to publish circular. Please try again.",
        variant: "destructive"
      });
      setIsSubmitting(false);
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
        <h1 className="text-2xl font-bold">Circulars & Notices</h1>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Create New Circular'}
        </Button>
      </div>
      
      {/* Add Circular Form */}
      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Circular</CardTitle>
            <CardDescription>
              Fill in the details to publish a new circular or notice
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter circular title"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Enter circular content"
                  className="w-full p-2 border border-gray-300 rounded-md min-h-[150px]"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Target Audience</Label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {audienceOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={`audience-${option.value}`}
                        name="targetAudience"
                        value={option.value}
                        checked={
                          option.value === 'class' 
                            ? formData.targetAudience.includes('student') && formData.targetClasses.length > 0
                            : formData.targetAudience.includes(option.value)
                        }
                        onChange={handleInputChange}
                        className="rounded-full border-gray-300"
                      />
                      <Label htmlFor={`audience-${option.value}`} className="font-normal">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Show class selection if "Specific Classes" is selected */}
              {formData.targetAudience.includes('student') && formData.targetAudience.length === 1 && (
                <div className="space-y-2">
                  <Label>Select Classes</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {classes.map((cls) => (
                      <div key={cls._id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`class-${cls._id}`}
                          name="targetClasses"
                          value={cls._id}
                          checked={formData.targetClasses.includes(cls._id)}
                          onChange={handleInputChange}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor={`class-${cls._id}`} className="font-normal">
                          Class {cls.name} - {cls.section}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Publishing...' : 'Publish Circular'}
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
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title or content"
              />
            </div>
            <div>
              <Label htmlFor="filter-audience">Filter by Audience</Label>
              <select
                id="filter-audience"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedAudience}
                onChange={(e) => setSelectedAudience(e.target.value)}
              >
                <option value="">All Circulars</option>
                {audienceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Circulars List */}
      <Card>
        <CardHeader>
          <CardTitle>Circulars & Notices</CardTitle>
          <CardDescription>
            {filteredCirculars.length} circulars found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCirculars.length === 0 ? (
            <p className="text-center text-gray-500">No circulars found.</p>
          ) : (
            <div className="space-y-4">
              {filteredCirculars.map((circular) => (
                <Card key={circular._id} className="border-gray-200">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{circular.title}</CardTitle>
                        <CardDescription>
                          Published by {circular.publishedBy.name} on {new Date(circular.publishedDate).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      {circular.publishedBy.role === user.role && circular.publishedBy._id === user.id && (
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm">
                            Delete
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-gray-700 whitespace-pre-line">{circular.content}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      {circular.targetAudience.includes('all') ? (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                          All Users
                        </span>
                      ) : (
                        <>
                          {circular.targetAudience.includes('teacher') && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                              Teachers
                            </span>
                          )}
                          {circular.targetAudience.includes('student') && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                              Students
                            </span>
                          )}
                          {circular.targetAudience.includes('parent') && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full">
                              Parents
                            </span>
                          )}
                        </>
                      )}
                      
                      {circular.targetClasses && circular.targetClasses.map((cls) => (
                        <span key={cls._id} className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
                          Class {cls.name} - {cls.section}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Circulars;
