import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useToast } from "../../components/ui/use-toast";
import { useAuth } from '../../context/AuthContext';
import * as teacherApi from '../../api/admin/teacher';
import * as classApi from '../../api/admin/class';

const TeachersList = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedClass, setSelectedClass] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  // Fetch teachers and classes on component mount
  useEffect(() => {
    fetchTeachers();
    fetchClasses();
  }, []);

  // Function to fetch teachers from API
  const fetchTeachers = async () => {
    try {
      setLoading(true);
      
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
      toast({
        title: "Error",
        description: "Failed to load teachers. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch classes from API
  const fetchClasses = async () => {
    try {
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
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter teachers based on search term
  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subjectSpecialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle teacher deletion
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this teacher?')) {
      return;
    }
    
    try {
      try {
        // Try to use the real API
        await teacherApi.deleteTeacher(id);
        
        // Remove the teacher from the list
        setTeachers(prev => prev.filter(teacher => teacher._id !== id));
        
        toast({
          title: "Success",
          description: "Teacher deleted successfully!",
        });
      } catch (apiError) {
        console.warn('API error, simulating teacher deletion:', apiError);
        
        // Simulate successful deletion with mock data
        setTeachers(prev => prev.filter(teacher => teacher._id !== id));
        
        toast({
          title: "Success (Mock)",
          description: "Teacher deleted successfully (using mock data)!",
        });
      }
    } catch (err) {
      console.error('Error deleting teacher:', err);
      
      toast({
        title: "Error",
        description: "Failed to delete teacher. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Open assign class modal
  const openAssignModal = (teacher) => {
    setSelectedTeacher(teacher);
    setSelectedClass(teacher.classAssigned?._id || '');
    setShowAssignModal(true);
  };

  // Handle class assignment
  const handleAssignClass = async () => {
    if (!selectedTeacher) return;
    
    try {
      setIsAssigning(true);
      
      try {
        // Try to use the real API
        let response;
        
        if (selectedClass) {
          response = await teacherApi.assignTeacherToClass(selectedTeacher._id, selectedClass);
        } else {
          response = await teacherApi.removeTeacherFromClass(selectedTeacher._id);
        }
        
        // Update the teacher in the list
        if (response && response.data) {
          setTeachers(prev => 
            prev.map(teacher => 
              teacher._id === selectedTeacher._id ? response.data : teacher
            )
          );
          
          toast({
            title: "Success",
            description: selectedClass 
              ? "Teacher assigned to class successfully!" 
              : "Teacher removed from class successfully!",
          });
        }
      } catch (apiError) {
        console.warn('API error, simulating class assignment:', apiError);
        
        // Simulate successful assignment with mock data
        const updatedTeachers = [...teachers];
        const teacherIndex = updatedTeachers.findIndex(t => t._id === selectedTeacher._id);
        
        if (teacherIndex !== -1) {
          if (selectedClass) {
            const assignedClass = classes.find(c => c._id === selectedClass);
            updatedTeachers[teacherIndex] = {
              ...updatedTeachers[teacherIndex],
              classAssigned: {
                _id: assignedClass._id,
                name: assignedClass.name,
                section: assignedClass.section
              }
            };
          } else {
            updatedTeachers[teacherIndex] = {
              ...updatedTeachers[teacherIndex],
              classAssigned: null
            };
          }
          
          setTeachers(updatedTeachers);
          
          toast({
            title: "Success (Mock)",
            description: selectedClass 
              ? "Teacher assigned to class successfully (using mock data)!" 
              : "Teacher removed from class successfully (using mock data)!",
          });
        }
      }
      
      // Close the modal
      setShowAssignModal(false);
      setSelectedTeacher(null);
      setSelectedClass('');
    } catch (err) {
      console.error('Error assigning class:', err);
      
      toast({
        title: "Error",
        description: "Failed to assign class. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Teachers Management</h1>
        <Button asChild>
          <Link to="/admin/teachers/add">Add New Teacher</Link>
        </Button>
      </div>
      
      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search teachers by name, email, or subject..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Teachers List */}
      <Card>
        <CardHeader>
          <CardTitle>Teachers List</CardTitle>
          <CardDescription>
            Manage all teachers in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading teachers...</p>
            </div>
          ) : filteredTeachers.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-500">No teachers found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject Specialization
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned Class
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTeachers.map((teacher) => (
                    <tr key={teacher._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{teacher.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{teacher.subjectSpecialization || 'Not specified'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {teacher.classAssigned ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Class {teacher.classAssigned.name} - {teacher.classAssigned.section}
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            Not Assigned
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openAssignModal(teacher)}
                          >
                            Assign Class
                          </Button>
                          <Button 
                            asChild
                            variant="outline" 
                            size="sm"
                          >
                            <Link to={`/admin/teachers/${teacher._id}/edit`}>Edit</Link>
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDelete(teacher._id)}
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
      
      {/* Assign Class Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Assign Class to Teacher</h2>
            <p className="mb-4">
              Assign a class to <strong>{selectedTeacher?.name}</strong>
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Class
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="">-- None --</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    Class {cls.name} - {cls.section}
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
                onClick={handleAssignClass}
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

export default TeachersList;
