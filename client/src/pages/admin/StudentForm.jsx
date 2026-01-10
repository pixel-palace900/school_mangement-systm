import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

// Mock data for students
const mockStudents = [
  { 
    _id: '1', 
    name: 'John Doe', 
    rollNumber: '101', 
    email: 'john.doe@example.com',
    phone: '1234567890',
    dateOfBirth: '2005-05-15',
    classId: { _id: '1', name: '10', section: 'A' },
    parentId: { _id: '1', name: 'Robert Doe', email: 'robert.doe@example.com', phone: '9876543210' }
  },
  { 
    _id: '2', 
    name: 'Jane Smith', 
    rollNumber: '102', 
    email: 'jane.smith@example.com',
    phone: '2345678901',
    dateOfBirth: '2005-08-22',
    classId: { _id: '1', name: '10', section: 'A' },
    parentId: { _id: '2', name: 'Sarah Smith', email: 'sarah.smith@example.com', phone: '8765432109' }
  }
];

// Mock data for classes
const mockClasses = [
  { _id: '1', name: '10', section: 'A' },
  { _id: '2', name: '10', section: 'B' },
  { _id: '3', name: '9', section: 'A' },
  { _id: '4', name: '9', section: 'B' },
  { _id: '5', name: '8', section: 'A' }
];

// Mock data for parents
const mockParents = [
  { _id: '1', name: 'Robert Doe', email: 'robert.doe@example.com', phone: '9876543210' },
  { _id: '2', name: 'Sarah Smith', email: 'sarah.smith@example.com', phone: '8765432109' },
  { _id: '3', name: 'David Johnson', email: 'david.johnson@example.com', phone: '7654321098' },
  { _id: '4', name: 'James Brown', email: 'james.brown@example.com', phone: '6543210987' },
  { _id: '5', name: 'Richard Davis', email: 'richard.davis@example.com', phone: '5432109876' }
];

const StudentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    dateOfBirth: '',
    rollNumber: '',
    classId: '',
    parentId: ''
  });
  
  const [classes, setClasses] = useState([]);
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showParentForm, setShowParentForm] = useState(false);
  const [newParentData, setNewParentData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    // In a real app, we would fetch classes and parents from the API
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setClasses(mockClasses);
      setParents(mockParents);
      
      // If in edit mode, fetch student data
      if (isEditMode) {
        const student = mockStudents.find(s => s._id === id);
        if (student) {
          setFormData({
            name: student.name,
            email: student.email,
            password: '', // Don't populate password in edit mode
            phone: student.phone,
            dateOfBirth: student.dateOfBirth,
            rollNumber: student.rollNumber,
            classId: student.classId._id,
            parentId: student.parentId._id
          });
        }
      }
      
      setLoading(false);
    }, 500);
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleParentChange = (e) => {
    const { name, value } = e.target;
    setNewParentData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!isEditMode && !formData.password.trim()) newErrors.password = 'Password is required';
    if (!formData.rollNumber.trim()) newErrors.rollNumber = 'Roll Number is required';
    if (!formData.classId) newErrors.classId = 'Class is required';
    if (!formData.parentId && !showParentForm) newErrors.parentId = 'Parent is required';
    
    // Validate new parent data if adding a new parent
    if (showParentForm) {
      if (!newParentData.name.trim()) newErrors.parentName = 'Parent name is required';
      if (!newParentData.email.trim()) newErrors.parentEmail = 'Parent email is required';
      if (!newParentData.phone.trim()) newErrors.parentPhone = 'Parent phone is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitLoading(true);
    
    try {
      // In a real app, we would send the data to the API
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // If adding a new parent, we would first create the parent and get the ID
      if (showParentForm) {
        // Simulate creating a new parent
        console.log('Creating new parent:', newParentData);
        // In a real app, we would set formData.parentId to the new parent's ID
      }
      
      // Then create or update the student
      console.log('Submitting student data:', formData);
      
      // Redirect to students list after successful submission
      navigate('/admin/students');
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors(prev => ({ ...prev, submit: 'Failed to submit form. Please try again.' }));
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{isEditMode ? 'Edit Student' : 'Add New Student'}</h1>
        <Button asChild variant="outline">
          <Link to="/admin/students">Back to Students</Link>
        </Button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
            <CardDescription>
              Enter the student's personal and academic details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name" className={errors.name ? 'text-red-500' : ''}>
                  Full Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              
              <div>
                <Label htmlFor="email" className={errors.email ? 'text-red-500' : ''}>
                  Email Address *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              
              {!isEditMode && (
                <div>
                  <Label htmlFor="password" className={errors.password ? 'text-red-500' : ''}>
                    Password *
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? 'border-red-500' : ''}
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>
              )}
              
              <div>
                <Label htmlFor="phone">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <Label htmlFor="dateOfBirth">
                  Date of Birth
                </Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <Label htmlFor="rollNumber" className={errors.rollNumber ? 'text-red-500' : ''}>
                  Roll Number *
                </Label>
                <Input
                  id="rollNumber"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  className={errors.rollNumber ? 'border-red-500' : ''}
                />
                {errors.rollNumber && <p className="text-red-500 text-xs mt-1">{errors.rollNumber}</p>}
              </div>
              
              <div>
                <Label htmlFor="classId" className={errors.classId ? 'text-red-500' : ''}>
                  Class *
                </Label>
                <select
                  id="classId"
                  name="classId"
                  value={formData.classId}
                  onChange={handleChange}
                  className={`block w-full rounded-md border ${errors.classId ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
                >
                  <option value="">Select Class</option>
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      Class {cls.name} - {cls.section}
                    </option>
                  ))}
                </select>
                {errors.classId && <p className="text-red-500 text-xs mt-1">{errors.classId}</p>}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Parent Information</CardTitle>
            <CardDescription>
              Select an existing parent or add a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Button 
                type="button" 
                variant={showParentForm ? "default" : "outline"} 
                onClick={() => setShowParentForm(true)}
                className="mr-2"
              >
                Add New Parent
              </Button>
              <Button 
                type="button" 
                variant={!showParentForm ? "default" : "outline"} 
                onClick={() => setShowParentForm(false)}
              >
                Select Existing Parent
              </Button>
            </div>
            
            {!showParentForm ? (
              <div>
                <Label htmlFor="parentId" className={errors.parentId ? 'text-red-500' : ''}>
                  Parent *
                </Label>
                <select
                  id="parentId"
                  name="parentId"
                  value={formData.parentId}
                  onChange={handleChange}
                  className={`block w-full rounded-md border ${errors.parentId ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
                >
                  <option value="">Select Parent</option>
                  {parents.map((parent) => (
                    <option key={parent._id} value={parent._id}>
                      {parent.name} - {parent.email}
                    </option>
                  ))}
                </select>
                {errors.parentId && <p className="text-red-500 text-xs mt-1">{errors.parentId}</p>}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="parentName" className={errors.parentName ? 'text-red-500' : ''}>
                    Parent Name *
                  </Label>
                  <Input
                    id="parentName"
                    name="name"
                    value={newParentData.name}
                    onChange={handleParentChange}
                    className={errors.parentName ? 'border-red-500' : ''}
                  />
                  {errors.parentName && <p className="text-red-500 text-xs mt-1">{errors.parentName}</p>}
                </div>
                
                <div>
                  <Label htmlFor="parentEmail" className={errors.parentEmail ? 'text-red-500' : ''}>
                    Parent Email *
                  </Label>
                  <Input
                    id="parentEmail"
                    name="email"
                    type="email"
                    value={newParentData.email}
                    onChange={handleParentChange}
                    className={errors.parentEmail ? 'border-red-500' : ''}
                  />
                  {errors.parentEmail && <p className="text-red-500 text-xs mt-1">{errors.parentEmail}</p>}
                </div>
                
                <div>
                  <Label htmlFor="parentPhone" className={errors.parentPhone ? 'text-red-500' : ''}>
                    Parent Phone *
                  </Label>
                  <Input
                    id="parentPhone"
                    name="phone"
                    value={newParentData.phone}
                    onChange={handleParentChange}
                    className={errors.parentPhone ? 'border-red-500' : ''}
                  />
                  {errors.parentPhone && <p className="text-red-500 text-xs mt-1">{errors.parentPhone}</p>}
                </div>
                
                <div>
                  <Label htmlFor="parentAddress">
                    Parent Address
                  </Label>
                  <Input
                    id="parentAddress"
                    name="address"
                    value={newParentData.address}
                    onChange={handleParentChange}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <CardFooter className="flex justify-end space-x-4 px-0">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/admin/students')}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={submitLoading}
          >
            {submitLoading ? (
              <>
                <span className="mr-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                </span>
                {isEditMode ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              isEditMode ? 'Update Student' : 'Create Student'
            )}
          </Button>
        </CardFooter>
        
        {errors.submit && (
          <p className="text-red-500 text-sm mt-4">{errors.submit}</p>
        )}
      </form>
    </div>
  );
};

export default StudentForm;
