import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import * as parentApi from '../../api/parent';

const ChildDetail = ({ childId }) => {
  const [child, setChild] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChildData = async () => {
      try {
        setLoading(true);
        
        // In a production environment, we would use the API call
        // For now, we'll use mock data
        const childrenResponse = parentApi.getMockChildren();
        const foundChild = childrenResponse.data.children.find(c => c._id === childId);
        
        if (foundChild) {
          setChild(foundChild);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching child data:', error);
        setLoading(false);
      }
    };

    if (childId) {
      fetchChildData();
    }
  }, [childId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!child) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2">Child Not Found</h2>
        <p className="text-gray-500 mb-4">The child you're looking for doesn't exist or you don't have access.</p>
        <Button asChild variant="outline">
          <Link to="/parent/children">Back to Children List</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Child Details</h1>
        <Button asChild variant="outline">
          <Link to="/parent/children">Back to List</Link>
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{child.name}</CardTitle>
          <CardDescription>
            Roll Number: {child.rollNumber}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Class</h3>
              <p>{child.classId.name} {child.classId.section}</p>
            </div>
            {/* Additional details would be shown here */}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
          <Button asChild variant="outline" size="sm">
            <Link to={`/parent/attendance?childId=${child._id}`}>View Attendance</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to={`/parent/fees?childId=${child._id}`}>View Fees</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to={`/parent/exams?childId=${child._id}`}>View Exams</Link>
          </Button>
        </CardFooter>
      </Card>
      
      {/* Quick summary sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Attendance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">95%</p>
            <p className="text-sm text-gray-500">Present: 19 days</p>
            <p className="text-sm text-gray-500">Absent: 1 day</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" size="sm">
              <Link to={`/parent/attendance?childId=${child._id}`}>View Details</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Fee Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-600">₹4,000</p>
            <p className="text-sm text-gray-500">Pending payment</p>
            <p className="text-sm text-gray-500">Due: June 30, 2023</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" size="sm">
              <Link to={`/parent/fees?childId=${child._id}`}>View Details</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">3</p>
            <p className="text-sm text-gray-500">Next: Mathematics (July 10)</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" size="sm">
              <Link to={`/parent/exams?childId=${child._id}`}>View Details</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

const Children = () => {
  const { childId } = useParams();
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        setLoading(true);
        
        // In a production environment, we would use the API call
        // For now, we'll use mock data
        const response = parentApi.getMockChildren();
        setChildren(response.data.children);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching children:', error);
        setLoading(false);
      }
    };

    fetchChildren();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If childId is provided, show the child detail view
  if (childId) {
    return <ChildDetail childId={childId} />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Your Children</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children.map((child) => (
          <Card key={child._id}>
            <CardHeader>
              <CardTitle>{child.name}</CardTitle>
              <CardDescription>
                Roll Number: {child.rollNumber}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Class: {child.classId.name} {child.classId.section}
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link to={`/parent/children/${child._id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {children.length === 0 && (
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold mb-2">No Children Found</h2>
          <p className="text-gray-500">There are no children associated with your account.</p>
        </div>
      )}
    </div>
  );
};

export default Children;
