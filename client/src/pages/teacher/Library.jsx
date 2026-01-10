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

// Mock data for library resources
const mockResources = [
  { 
    _id: '1', 
    title: 'Advanced Mathematics Textbook', 
    description: 'Comprehensive textbook covering advanced mathematics topics for high school students.', 
    resourceType: 'book',
    subject: 'Mathematics',
    author: 'John Smith',
    publisher: 'Education Press',
    publicationYear: 2021,
    isbn: '978-1234567890',
    totalCopies: 5,
    availableCopies: 3,
    forClasses: [{ _id: '1', name: '10', section: 'A' }],
    accessibleTo: ['admin', 'teacher', 'student']
  },
  { 
    _id: '2', 
    title: 'Introduction to Chemistry', 
    description: 'A beginner-friendly guide to chemistry concepts and experiments.', 
    resourceType: 'book',
    subject: 'Science',
    author: 'Emily Johnson',
    publisher: 'Science Publications',
    publicationYear: 2020,
    isbn: '978-0987654321',
    totalCopies: 8,
    availableCopies: 5,
    forClasses: [{ _id: '1', name: '10', section: 'A' }, { _id: '2', name: '9', section: 'B' }],
    accessibleTo: ['admin', 'teacher', 'student']
  },
  { 
    _id: '3', 
    title: 'English Grammar Guide', 
    description: 'Comprehensive guide to English grammar rules and usage.', 
    resourceType: 'ebook',
    subject: 'English',
    author: 'Robert Wilson',
    publisher: 'Language Learning Press',
    publicationYear: 2022,
    fileUrl: 'https://example.com/english-grammar-guide.pdf',
    fileType: 'PDF',
    fileSize: 15000000, // 15 MB
    forClasses: [{ _id: '2', name: '9', section: 'B' }],
    accessibleTo: ['admin', 'teacher', 'student']
  },
  { 
    _id: '4', 
    title: 'World History: Modern Era', 
    description: 'Detailed exploration of world history from the 16th century to present day.', 
    resourceType: 'book',
    subject: 'History',
    author: 'David Brown',
    publisher: 'Historical Press',
    publicationYear: 2019,
    isbn: '978-5678901234',
    totalCopies: 3,
    availableCopies: 1,
    forClasses: [{ _id: '1', name: '10', section: 'A' }],
    accessibleTo: ['admin', 'teacher', 'student']
  },
  { 
    _id: '5', 
    title: 'Physics Video Lectures', 
    description: 'Series of video lectures covering key physics concepts for high school students.', 
    resourceType: 'video',
    subject: 'Science',
    author: 'Prof. Michael Davis',
    fileUrl: 'https://example.com/physics-lectures',
    fileType: 'MP4',
    forClasses: [{ _id: '1', name: '10', section: 'A' }],
    accessibleTo: ['admin', 'teacher', 'student']
  },
];

const Library = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    resourceType: 'book',
    subject: '',
    author: '',
    publisher: '',
    publicationYear: new Date().getFullYear(),
    isbn: '',
    totalCopies: 1,
    availableCopies: 1,
    fileUrl: '',
    fileType: '',
    forClasses: [],
    accessibleTo: ['admin', 'teacher', 'student']
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Resource types
  const resourceTypes = [
    { value: 'book', label: 'Physical Book' },
    { value: 'ebook', label: 'E-Book' },
    { value: 'article', label: 'Article' },
    { value: 'video', label: 'Video' },
    { value: 'audio', label: 'Audio' },
    { value: 'document', label: 'Document' },
    { value: 'other', label: 'Other' }
  ];

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
          setResources(mockResources);
          setFilteredResources(mockResources);
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

  // Filter resources when filters change
  useEffect(() => {
    let filtered = [...resources];
    
    // Filter by class
    if (selectedClass) {
      filtered = filtered.filter(resource => 
        resource.forClasses && resource.forClasses.some(cls => cls._id === selectedClass)
      );
    }
    
    // Filter by subject
    if (selectedSubject) {
      filtered = filtered.filter(resource => resource.subject === selectedSubject);
    }
    
    // Filter by resource type
    if (selectedType) {
      filtered = filtered.filter(resource => resource.resourceType === selectedType);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(resource => 
        resource.title.toLowerCase().includes(term) ||
        resource.description.toLowerCase().includes(term) ||
        resource.author.toLowerCase().includes(term)
      );
    }
    
    setFilteredResources(filtered);
  }, [selectedClass, selectedSubject, selectedType, searchTerm, resources]);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'forClasses') {
      // Handle multi-select for classes
      const classId = value;
      let updatedClasses = [...formData.forClasses];
      
      if (checked) {
        updatedClasses.push(classId);
      } else {
        updatedClasses = updatedClasses.filter(id => id !== classId);
      }
      
      setFormData(prev => ({
        ...prev,
        forClasses: updatedClasses
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
    if (!formData.title.trim() || !formData.description.trim() || !formData.subject || !formData.author.trim()) {
      toast({
        title: "Error",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Validate resource-specific fields
    if (formData.resourceType === 'book' && (!formData.totalCopies || formData.totalCopies < 1)) {
      toast({
        title: "Error",
        description: "Total copies must be at least 1 for physical books.",
        variant: "destructive"
      });
      return;
    }
    
    if (['ebook', 'video', 'audio', 'document'].includes(formData.resourceType) && !formData.fileUrl) {
      toast({
        title: "Error",
        description: "File URL is required for digital resources.",
        variant: "destructive"
      });
      return;
    }
    
    if (formData.forClasses.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one class.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, we would send data to the API
      // Simulate API call with setTimeout
      setTimeout(() => {
        // Create new resource
        const newResource = {
          _id: Date.now().toString(), // Generate a temporary ID
          ...formData,
          // Convert class IDs to class objects
          forClasses: formData.forClasses.map(classId => 
            classes.find(cls => cls._id === classId)
          ),
          // Set available copies equal to total copies for new resources
          availableCopies: formData.resourceType === 'book' ? formData.totalCopies : undefined
        };
        
        // Update resources state
        setResources(prev => [...prev, newResource]);
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          resourceType: 'book',
          subject: '',
          author: '',
          publisher: '',
          publicationYear: new Date().getFullYear(),
          isbn: '',
          totalCopies: 1,
          availableCopies: 1,
          fileUrl: '',
          fileType: '',
          forClasses: [],
          accessibleTo: ['admin', 'teacher', 'student']
        });
        
        // Hide form
        setShowAddForm(false);
        
        toast({
          title: "Success",
          description: "Library resource added successfully!",
        });
        
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      console.error('Error adding resource:', error);
      toast({
        title: "Error",
        description: "Failed to add resource. Please try again.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  // Handle resource deletion
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) {
      return;
    }
    
    try {
      // In a real app, we would send a delete request to the API
      // Simulate API call with setTimeout
      setTimeout(() => {
        // Update resources state
        setResources(prev => prev.filter(resource => resource._id !== id));
        
        toast({
          title: "Success",
          description: "Resource deleted successfully!",
        });
      }, 500);
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast({
        title: "Error",
        description: "Failed to delete resource. Please try again.",
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
        <h1 className="text-2xl font-bold">Library Resources</h1>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add New Resource'}
        </Button>
      </div>
      
      {/* Add Resource Form */}
      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Library Resource</CardTitle>
            <CardDescription>
              Fill in the details to add a new resource to the library
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
                    placeholder="Enter resource title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resourceType">Resource Type</Label>
                  <select
                    id="resourceType"
                    name="resourceType"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={formData.resourceType}
                    onChange={handleInputChange}
                    required
                  >
                    {resourceTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
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
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    placeholder="Enter author name"
                    required
                  />
                </div>
                
                {/* Conditional fields based on resource type */}
                {formData.resourceType === 'book' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="publisher">Publisher</Label>
                      <Input
                        id="publisher"
                        name="publisher"
                        value={formData.publisher}
                        onChange={handleInputChange}
                        placeholder="Enter publisher name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="publicationYear">Publication Year</Label>
                      <Input
                        id="publicationYear"
                        name="publicationYear"
                        type="number"
                        min="1900"
                        max={new Date().getFullYear()}
                        value={formData.publicationYear}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="isbn">ISBN</Label>
                      <Input
                        id="isbn"
                        name="isbn"
                        value={formData.isbn}
                        onChange={handleInputChange}
                        placeholder="Enter ISBN"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="totalCopies">Total Copies</Label>
                      <Input
                        id="totalCopies"
                        name="totalCopies"
                        type="number"
                        min="1"
                        value={formData.totalCopies}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </>
                )}
                
                {['ebook', 'video', 'audio', 'document'].includes(formData.resourceType) && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="fileUrl">File URL</Label>
                      <Input
                        id="fileUrl"
                        name="fileUrl"
                        value={formData.fileUrl}
                        onChange={handleInputChange}
                        placeholder="Enter file URL"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fileType">File Type</Label>
                      <Input
                        id="fileType"
                        name="fileType"
                        value={formData.fileType}
                        onChange={handleInputChange}
                        placeholder="e.g., PDF, MP4, MP3"
                      />
                    </div>
                  </>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter resource description"
                  className="w-full p-2 border border-gray-300 rounded-md min-h-[100px]"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Available For Classes</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {classes.map((cls) => (
                    <div key={cls._id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`class-${cls._id}`}
                        name="forClasses"
                        value={cls._id}
                        checked={formData.forClasses.includes(cls._id)}
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
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Resource'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
      
      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title, author, or description"
              />
            </div>
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
            <div>
              <Label htmlFor="filter-type">Filter by Type</Label>
              <select
                id="filter-type"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">All Types</option>
                {resourceTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Resources List */}
      <Card>
        <CardHeader>
          <CardTitle>Library Resources</CardTitle>
          <CardDescription>
            {filteredResources.length} resources found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredResources.length === 0 ? (
            <p className="text-center text-gray-500">No resources found.</p>
          ) : (
            <div className="space-y-4">
              {filteredResources.map((resource) => (
                <Card key={resource._id} className="border-gray-200">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{resource.title}</CardTitle>
                        <CardDescription>
                          {resource.subject} | {resourceTypes.find(t => t.value === resource.resourceType)?.label}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDelete(resource._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-gray-700 mb-2">{resource.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">Author:</span> {resource.author}
                      </div>
                      {resource.publisher && (
                        <div>
                          <span className="font-medium">Publisher:</span> {resource.publisher}
                        </div>
                      )}
                      {resource.publicationYear && (
                        <div>
                          <span className="font-medium">Year:</span> {resource.publicationYear}
                        </div>
                      )}
                      {resource.resourceType === 'book' && (
                        <div>
                          <span className="font-medium">Availability:</span> {resource.availableCopies}/{resource.totalCopies} copies
                        </div>
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      {resource.forClasses.map((cls) => (
                        <span key={cls._id} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                          Class {cls.name} - {cls.section}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    {resource.resourceType !== 'book' && resource.fileUrl && (
                      <Button variant="link" size="sm" className="p-0" asChild>
                        <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer">
                          View Resource
                        </a>
                      </Button>
                    )}
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

export default Library;
