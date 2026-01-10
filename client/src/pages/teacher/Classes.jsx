import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

// Mock data for classes
const mockClasses = [
  { _id: '1', name: '10', section: 'A', studentsCount: 35 },
  { _id: '2', name: '9', section: 'B', studentsCount: 32 }
];

const Classes = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we would fetch classes assigned to the teacher from the API
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setClasses(mockClasses);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Classes</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <Card key={cls._id}>
            <CardHeader>
              <CardTitle>Class {cls.name} - {cls.section}</CardTitle>
              <CardDescription>
                {cls.studentsCount} Students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                View and manage students, attendance, and academic performance for this class.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link to={`/teacher/classes/${cls._id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {classes.length === 0 && (
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold mb-2">No Classes Assigned</h2>
          <p className="text-gray-500">You don't have any classes assigned to you yet.</p>
        </div>
      )}
    </div>
  );
};

export default Classes;
