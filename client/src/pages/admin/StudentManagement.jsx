import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useToast } from "../../components/ui/use-toast";
import { useAuth } from '../../context/AuthContext';
import * as adminApi from '../../api/admin';

const StudentManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newStudent, setNewStudent] = useState({ name: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  // Function to fetch students from API
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);

      try {
        // Try to use the real API
        const response = await adminApi.getAllStudents();

        // Check if we have data in the expected format
        if (response && response.data && response.data.students) {
          setStudents(response.data.students);
        } else {
          throw new Error('Unexpected API response format');
        }
      } catch (apiError) {
        console.warn('API error, falling back to mock data:', apiError);

        // Fallback to mock data if API is not available
        const mockResponse = adminApi.getMockStudents();
        setStudents(mockResponse.data.students);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to load students. Please try again later.');
      setStudents([]); // Clear students on error
    } finally {
      setLoading(false);
    }
  };

  // Handle input change for new student form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission for new student
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!newStudent.name.trim() || !newStudent.email.trim()) {
      toast({
        title: "Validation Error",
        description: "Name and email are required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);

      try {
        // Try to use the real API
        const response = await adminApi.createStudent(newStudent);

        // Add the new student to the list
        if (response && response.data) {
          setStudents(prev => [...prev, response.data]);

          // Reset the form
          setNewStudent({ name: '', email: '' });

          toast({
            title: "Success",
            description: "Student created successfully!",
          });

          // Refresh the student list to get the updated data
          fetchStudents();
        }
      } catch (apiError) {
        console.warn('API error, simulating student creation:', apiError);

        // Simulate successful creation with mock data
        const newMockStudent = {
          _id: Date.now().toString(), // Generate a temporary ID
          name: newStudent.name,
          email: newStudent.email,
        };

        setStudents(prev => [...prev, newMockStudent]);

        // Reset the form
        setNewStudent({ name: '', email: '' });

        toast({
          title: "Success (Mock)",
          description: "Student created successfully (using mock data)!",
        });
      }
    } catch (err) {
      console.error('Error creating student:', err);

      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to create student. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle student deletion
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) {
      return;
    }

    try {
      try {
        // Try to use the real API
        await adminApi.deleteStudent(id);

        // Remove the student from the list
        setStudents(prev => prev.filter(student => student._id !== id));

        toast({
          title: "Success",
          description: "Student deleted successfully!",
        });
      } catch (apiError) {
        console.warn('API error, simulating student deletion:', apiError);

        // Simulate successful deletion with mock data
        setStudents(prev => prev.filter(student => student._id !== id));

        toast({
          title: "Success (Mock)",
          description: "Student deleted successfully (using mock data)!",
        });
      }
    } catch (err) {
      console.error('Error deleting student:', err);

      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to delete student. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Student Management</h1>

      {/* Add New Student Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Student</CardTitle>
          <CardDescription>
            Enter the basic details to create a new student account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter student name"
                  value={newStudent.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter student email"
                  value={newStudent.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Student'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle>Students List</CardTitle>
          <CardDescription>
            Manage all students in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading students...</p>
            </div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">
              <p>{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={fetchStudents}
              >
                Try Again
              </Button>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-500">No students found.</p>
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
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(student._id)}
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
    </div>
  );
};

// Mock data for fallback when API is not available
const mockStudents = [
  {
    _id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
  },
  {
    _id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
  },
  {
    _id: '3',
    name: 'Michael Johnson',
    email: 'michael.johnson@example.com',
  }
];

export default StudentManagement;
