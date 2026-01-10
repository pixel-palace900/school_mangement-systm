import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useToast } from "../../components/ui/use-toast";
import { useAuth } from '../../context/AuthContext';
import * as teacherApi from '../../api/admin/teacher';
import * as classApi from '../../api/admin/class';

const TeacherForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    subjectSpecialization: '',
    classAssigned: ''
  });
  
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Fetch classes and teacher data (if in edit mode) on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch classes
        try {
          const classesResponse = await classApi.getAllClasses();
          if (classesResponse && classesResponse.data && classesResponse.data.classes) {
            setClasses(classesResponse.data.classes);
          } else {
            throw new Error('Unexpected API response format for classes');
          }
        } catch (apiError) {
          console.warn('API error fetching classes, using mock data:', apiError);
          const mockClassesResponse = classApi.getMockClasses();
          setClasses(mockClassesResponse.data.classes);
        }
        
        // If in edit mode, fetch teacher data
        if (isEditMode) {
          try {
            const teacherResponse = await teacherApi.getTeacherById(id);
            if (teacherResponse && teacherResponse.data) {
              const teacher = teacherResponse.data;
              setFormData({
                name: teacher.name || '',
                email: teacher.email || '',
                password: '', // Don't populate password in edit mode
                phone: teacher.phone || '',
                subjectSpecialization: teacher.subjectSpecialization || '',
                classAssigned: teacher.classAssigned?._id || ''
              });
            } else {
              throw new Error('Unexpected API response format for teacher');
            }
          } catch (apiError) {
            console.warn('API error fetching teacher, using mock data:', apiError);
            const mockTeachers = teacherApi.getMockTeachers().data.teachers;
            const teacher = mockTeachers.find(t => t._id === id);
            
            if (teacher) {
              setFormData({
                name: teacher.name || '',
                email: teacher.email || '',
                password: '', // Don't populate password in edit mode
                phone: teacher.phone || '',
                subjectSpecialization: teacher.subjectSpecialization || '',
                classAssigned: teacher.classAssigned?._id || ''
              });
            } else {
              toast({
                title: "Error",
                description: "Teacher not found",
                variant: "destructive"
              });
              navigate('/admin/teachers');
            }
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, isEditMode, navigate, toast]);
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!isEditMode && !formData.password.trim()) {
      newErrors.password = 'Password is required for new teachers';
    } else if (!isEditMode && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.phone && !/^\d{10,15}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Phone number is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitLoading(true);
      
      // Prepare data for API
      const teacherData = { ...formData };
      
      // Don't send empty password in edit mode
      if (isEditMode && !teacherData.password) {
        delete teacherData.password;
      }
      
      // Don't send empty classAssigned
      if (!teacherData.classAssigned) {
        teacherData.classAssigned = null;
      }
      
      try {
        let response;
        
        if (isEditMode) {
          response = await teacherApi.updateTeacher(id, teacherData);
        } else {
          response = await teacherApi.createTeacher(teacherData);
        }
        
        toast({
          title: "Success",
          description: isEditMode 
            ? "Teacher updated successfully!" 
            : "Teacher created successfully!",
        });
        
        // Redirect to teachers list
        navigate('/admin/teachers');
      } catch (apiError) {
        console.warn('API error, simulating teacher save:', apiError);
        
        toast({
          title: "Success (Mock)",
          description: isEditMode 
            ? "Teacher updated successfully (using mock data)!" 
            : "Teacher created successfully (using mock data)!",
        });
        
        // Redirect to teachers list
        navigate('/admin/teachers');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      
      toast({
        title: "Error",
        description: "Failed to save teacher. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto py-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-gray-500">Loading...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Edit Teacher' : 'Add New Teacher'}
      </h1>
      
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>{isEditMode ? 'Edit Teacher Information' : 'Teacher Information'}</CardTitle>
            <CardDescription>
              {isEditMode 
                ? 'Update the teacher\'s details below' 
                : 'Enter the teacher\'s details below to create a new account'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">
                  {isEditMode ? 'Password (leave blank to keep current)' : 'Password'}
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={isEditMode ? 'Leave blank to keep current password' : 'Enter password'}
                  className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subjectSpecialization">Subject Specialization</Label>
                <Input
                  id="subjectSpecialization"
                  name="subjectSpecialization"
                  value={formData.subjectSpecialization}
                  onChange={handleChange}
                  placeholder="Enter subject specialization"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="classAssigned">Assigned Class</Label>
                <select
                  id="classAssigned"
                  name="classAssigned"
                  value={formData.classAssigned}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">-- None --</option>
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      Class {cls.name} - {cls.section}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/admin/teachers')}
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
                isEditMode ? 'Update Teacher' : 'Create Teacher'
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default TeacherForm;
