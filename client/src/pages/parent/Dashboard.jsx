import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import * as parentApi from '../../api/parent';

// Icons (using emoji placeholders until lucide-react is fixed)
const Icons = {
  Children: () => <span className="text-2xl">👨‍👩‍👧‍👦</span>,
  Attendance: () => <span className="text-2xl">📋</span>,
  Fees: () => <span className="text-2xl">💰</span>,
  Exams: () => <span className="text-2xl">📝</span>,
  Circulars: () => <span className="text-2xl">📢</span>,
  Communication: () => <span className="text-2xl">💬</span>,
};

const Dashboard = () => {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [pendingFees, setPendingFees] = useState([]);
  const [recentCirculars, setRecentCirculars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // In a production environment, we would use the API calls
        // For now, we'll use mock data
        const childrenResponse = parentApi.getMockChildren();
        const examsResponse = parentApi.getMockExams();
        const feesResponse = parentApi.getMockFees();
        const circularsResponse = parentApi.getMockCirculars();
        
        setChildren(childrenResponse.data.children);
        setUpcomingExams(examsResponse.data.exams.slice(0, 3));
        setPendingFees(feesResponse.data.fees.filter(fee => fee.status === 'unpaid'));
        setRecentCirculars(circularsResponse.data.circulars.slice(0, 3));
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Parent Dashboard</h1>
      
      {/* Welcome Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Welcome, {user?.name}!</CardTitle>
          <CardDescription>
            Here's an overview of your children's school activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            You can view detailed information about your children, their attendance, fees, exams, and more from the navigation menu.
          </p>
        </CardContent>
      </Card>
      
      {/* Quick Links */}
      <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <Link to="/parent/children">
          <Card className="h-full hover:bg-gray-50 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Icons.Children />
              <h3 className="mt-2 font-medium text-sm">Children</h3>
            </CardContent>
          </Card>
        </Link>
        <Link to="/parent/attendance">
          <Card className="h-full hover:bg-gray-50 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Icons.Attendance />
              <h3 className="mt-2 font-medium text-sm">Attendance</h3>
            </CardContent>
          </Card>
        </Link>
        <Link to="/parent/fees">
          <Card className="h-full hover:bg-gray-50 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Icons.Fees />
              <h3 className="mt-2 font-medium text-sm">Fees</h3>
            </CardContent>
          </Card>
        </Link>
        <Link to="/parent/exams">
          <Card className="h-full hover:bg-gray-50 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Icons.Exams />
              <h3 className="mt-2 font-medium text-sm">Exams</h3>
            </CardContent>
          </Card>
        </Link>
        <Link to="/parent/circulars">
          <Card className="h-full hover:bg-gray-50 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Icons.Circulars />
              <h3 className="mt-2 font-medium text-sm">Circulars</h3>
            </CardContent>
          </Card>
        </Link>
        <Link to="/parent/communication">
          <Card className="h-full hover:bg-gray-50 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Icons.Communication />
              <h3 className="mt-2 font-medium text-sm">Communication</h3>
            </CardContent>
          </Card>
        </Link>
      </div>
      
      {/* Children Overview */}
      <h2 className="text-xl font-semibold mb-4">Your Children</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
              <Button asChild variant="outline" size="sm">
                <Link to={`/parent/children/${child._id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* Upcoming Exams */}
      <h2 className="text-xl font-semibold mb-4">Upcoming Exams</h2>
      <Card className="mb-8">
        <CardContent className="p-6">
          {upcomingExams.length > 0 ? (
            <div className="space-y-4">
              {upcomingExams.map((exam) => (
                <div key={exam._id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <h3 className="font-medium">{exam.title} - {exam.subject}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(exam.date).toLocaleDateString()} ({exam.startTime} - {exam.endTime})
                    </p>
                  </div>
                  <div className="text-sm">
                    Max Marks: {exam.maxMarks}
                  </div>
                </div>
              ))}
              <Button asChild variant="outline" size="sm" className="mt-4">
                <Link to="/parent/exams">View All Exams</Link>
              </Button>
            </div>
          ) : (
            <p className="text-gray-500">No upcoming exams</p>
          )}
        </CardContent>
      </Card>
      
      {/* Recent Circulars */}
      <h2 className="text-xl font-semibold mb-4">Recent Circulars</h2>
      <Card className="mb-8">
        <CardContent className="p-6">
          {recentCirculars.length > 0 ? (
            <div className="space-y-4">
              {recentCirculars.map((circular) => (
                <div key={circular._id} className="border-b pb-2">
                  <h3 className="font-medium">{circular.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(circular.issueDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm mt-1">{circular.content}</p>
                </div>
              ))}
              <Button asChild variant="outline" size="sm" className="mt-4">
                <Link to="/parent/circulars">View All Circulars</Link>
              </Button>
            </div>
          ) : (
            <p className="text-gray-500">No recent circulars</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
