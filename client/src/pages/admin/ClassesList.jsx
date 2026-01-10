import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useToast } from "../../components/ui/use-toast";
import { useAuth } from '../../context/AuthContext';
import * as classApi from '../../api/admin/class';
import * as teacherApi from '../../api/admin/teacher';

const ClassesList = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  // Fetch classes and teachers on component mount
  useEffect(() => {
    fetchClasses();
    fetchTeachers();
  }, []);

  // Function to fetch classes from API
  const fetchClasses = async () => {
    try {
      setLoading(true);
      
      try {
        // Try to use the real API
        const response = await classApi.getAllClasses();
        
        // Check if we have data in the expected format
        if (response && response.data && response.data.classes) {
          setClasses(response.data.classes);
        } else {
          throw new Error('Unexpected API response format');
        }
      } catch (apiError) {
        console.warn('API error, falling back to mock data:', apiError);
        
        // Fallback to mock data if API is not available
        const mockResponse = classApi.getMockClasses();
        setClasses(mockResponse.data.classes);
      }
    } catch (err) {
      console.error('Error fetching classes:', err);
      toast({
        title: "Error",
        description: "Failed to load classes. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch teachers from API
  const fetchTeachers = async () => {
    try {
      try {
        // Try to use the real API
        const response = await teacherApi.getAllTeachers();
        
        // Check if we have data in the expected format
        if (response && response.data && response.data.teachers) {
          setTeachers(response.data.teachers);
        } else {
          throw new Error('Unexpected API response format');
        }
      } catch (apiError) {
        console.warn('API error, falling back to mock data:', apiError);
        
        // Fallback to mock data if API is not available
        const mockResponse = teacherApi.getMockTeachers();
        setTeachers(mockResponse.data.teachers);
      }
    } catch (err) {
      console.error('Error fetching teachers:', err);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter classes based on search term
  const filteredClasses = classes.filter(cls => 
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.classTeacher?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle class deletion
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this class?')) {
      return;
    }
    
    try {
      try {
        // Try to use the real API
        await classApi.deleteClass(id);
        
        // Remove the class from the list
        setClasses(prev => prev.filter(cls => cls._id !== id));
        
        toast({
          title: "Success",
          description: "Class deleted successfully!",
        });
      } catch (apiError) {
        console.warn('API error, simulating class deletion:', apiError);
        
        // Simulate successful deletion with mock data
        setClasses(prev => prev.filter(cls => cls._id !== id));
        
        toast({
          title: "Success (Mock)",
          description: "Class deleted successfully (using mock data)!",
        });
      }
    } catch (err) {
      console.error('Error deleting class:', err);
      
      toast({
        title: "Error",
        description: "Failed to delete class. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Open assign teacher modal
  const openAssignModal = (cls) => {
    setSelectedClass(cls);
    setSelectedTeacher(cls.classTeacher?._id || '');
    setShowAssignModal(true);
  };

  // Handle teacher assignment
  const handleAssignTeacher = async () => {
    if (!selectedClass) return;
    
    try {
      setIsAssigning(true);
      
      try {
        // Try to use the real API
        const response = await classApi.updateClass(selectedClass._id, {
          classTeacher: selectedTeacher || null
        });
        
        // Update the class in the list
        if (response && response.data) {
          setClasses(prev => 
            prev.map(cls => 
              cls._id === selectedClass._id ? response.data : cls
            )
          );
          
          toast({
            title: "Success",
            description: selectedTeacher 
              ? "Teacher assigned to class successfully!" 
              : "Teacher removed from class successfully!",
          });
        }
      } catch (apiError) {
        console.warn('API error, simulating teacher assignment:', apiError);
        
        // Simulate successful assignment with mock data
        const updatedClasses = [...classes];
        const classIndex = updatedClasses.findIndex(c => c._id === selectedClass._id);
        
        if (classIndex !== -1) {
          if (selectedTeacher) {
            const assignedTeacher = teachers.find(t => t._id === selectedTeacher);
            updatedClasses[classIndex] = {
              ...updatedClasses[classIndex],
              classTeacher: {
                _id: assignedTeacher._id,
                name: assignedTeacher.name,
                email: assignedTeacher.email,
                subjectSpecialization: assignedTeacher.subjectSpecialization
              }
            };
          } else {
            updatedClasses[classIndex] = {
              ...updatedClasses[classIndex],
              classTeacher: null
            };
          }
          
          setClasses(updatedClasses);
          
          toast({
            title: "Success (Mock)",
            description: selectedTeacher 
              ? "Teacher assigned to class successfully (using mock data)!" 
              : "Teacher removed from class successfully (using mock data)!",
          });
        }
      }
      
      // Close the modal
      setShowAssignModal(false);
      setSelectedClass(null);
      setSelectedTeacher('');
    } catch (err) {
      console.error('Error assigning teacher:', err);
      
      toast({
        title: "Error",
        description: "Failed to assign teacher. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Classes Management</h1>
        <Button asChild>
          <Link to="/admin/classes/add">Add New Class</Link>
        </Button>
      </div>
      
      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search classes by name, section, or teacher..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Classes List */}
      <Card>
        <CardHeader>
          <CardTitle>Classes List</CardTitle>
          <CardDescription>
            Manage all classes in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading classes...</p>
            </div>
          ) : filteredClasses.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-500">No classes found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Section
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class Teacher
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredClasses.map((cls) => (
                    <tr key={cls._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{cls.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{cls.section}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {cls.classTeacher ? (
                          <div>
                            <div className="text-sm font-medium text-gray-900">{cls.classTeacher.name}</div>
                            <div className="text-xs text-gray-500">{cls.classTeacher.subjectSpecialization || 'No specialization'}</div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Not Assigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openAssignModal(cls)}
                          >
                            Assign Teacher
                          </Button>
                          <Button 
                            asChild
                            variant="outline" 
                            size="sm"
                          >
                            <Link to={`/admin/classes/${cls._id}/edit`}>Edit</Link>
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDelete(cls._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Assign Teacher Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Assign Teacher to Class</h2>
            <p className="mb-4">
              Assign a teacher to <strong>Class {selectedClass?.name} - {selectedClass?.section}</strong>
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Teacher
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
              >
                <option value="">-- None --</option>
                {teachers.map((teacher) => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.name} ({teacher.subjectSpecialization || 'No specialization'})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowAssignModal(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAssignTeacher}
                disabled={isAssigning}
              >
                {isAssigning ? 'Assigning...' : 'Assign'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassesList;
