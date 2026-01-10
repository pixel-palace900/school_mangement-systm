import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { ResponsiveStatsGrid } from '../../components/ui/responsive-table';

// Icons (using emoji placeholders until lucide-react is fixed)
const Icons = {
  Students: () => <span className="text-2xl">👨‍🎓</span>,
  Parents: () => <span className="text-2xl">👨‍👩‍👧‍👦</span>,
  Teachers: () => <span className="text-2xl">👨‍🏫</span>,
  Classes: () => <span className="text-2xl">🏫</span>,
  Subjects: () => <span className="text-2xl">📚</span>,
  Exams: () => <span className="text-2xl">📝</span>,
  Fees: () => <span className="text-2xl">💰</span>,
  Attendance: () => <span className="text-2xl">📋</span>,
  Circulars: () => <span className="text-2xl">📢</span>,
};

// Mock data for dashboard stats
const mockStats = {
  students: 450,
  teachers: 35,
  parents: 380,
  classes: 15,
  subjects: 12,
  pendingFees: 25,
  absentToday: 18,
  upcomingExams: 3
};

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(mockStats);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In a real app, we would fetch dashboard stats from the API
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setStats(mockStats);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-responsive-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Welcome Card */}
      <Card className="mb-6 bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-responsive-lg">Welcome, {user?.name}!</CardTitle>
          <CardDescription className="text-responsive-sm">
            Here's an overview of your school management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-responsive-sm text-gray-600">
            Use the navigation menu to manage students, teachers, classes, and more. You can also view reports and analytics from this dashboard.
          </p>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <ResponsiveStatsGrid
        stats={[
          {
            label: "Total Students",
            value: stats.students,
            icon: <Icons.Students />,
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200",
            textColor: "text-blue-700",
            iconBgColor: "bg-blue-100"
          },
          {
            label: "Total Teachers",
            value: stats.teachers,
            icon: <Icons.Teachers />,
            bgColor: "bg-green-50",
            borderColor: "border-green-200",
            textColor: "text-green-700",
            iconBgColor: "bg-green-100"
          },
          {
            label: "Total Parents",
            value: stats.parents,
            icon: <Icons.Parents />,
            bgColor: "bg-purple-50",
            borderColor: "border-purple-200",
            textColor: "text-purple-700",
            iconBgColor: "bg-purple-100"
          },
          {
            label: "Total Classes",
            value: stats.classes,
            icon: <Icons.Classes />,
            bgColor: "bg-amber-50",
            borderColor: "border-amber-200",
            textColor: "text-amber-700",
            iconBgColor: "bg-amber-100"
          }
        ]}
        className="mb-8"
      />

      {/* Quick Links */}
      <h2 className="text-responsive-lg font-semibold mb-4">Quick Access</h2>
      <div className="grid-responsive-2-6 gap-3 sm:gap-4 mb-8">
        <Link to="/admin/students">
          <Card className="h-full hover:bg-gray-50 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6">
              <Icons.Students />
              <h3 className="mt-2 font-medium text-xs sm:text-sm text-center">Students</h3>
            </CardContent>
          </Card>
        </Link>
        <Link to="/admin/parents">
          <Card className="h-full hover:bg-gray-50 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6">
              <Icons.Parents />
              <h3 className="mt-2 font-medium text-xs sm:text-sm text-center">Parents</h3>
            </CardContent>
          </Card>
        </Link>
        <Link to="/admin/teachers">
          <Card className="h-full hover:bg-gray-50 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6">
              <Icons.Teachers />
              <h3 className="mt-2 font-medium text-xs sm:text-sm text-center">Teachers</h3>
            </CardContent>
          </Card>
        </Link>
        <Link to="/admin/classes">
          <Card className="h-full hover:bg-gray-50 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6">
              <Icons.Classes />
              <h3 className="mt-2 font-medium text-xs sm:text-sm text-center">Classes</h3>
            </CardContent>
          </Card>
        </Link>
        <Link to="/admin/subjects">
          <Card className="h-full hover:bg-gray-50 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6">
              <Icons.Subjects />
              <h3 className="mt-2 font-medium text-xs sm:text-sm text-center">Subjects</h3>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Alerts Section */}
      <h2 className="text-responsive-lg font-semibold mb-4">Alerts & Notifications</h2>
      <div className="grid-responsive-1-3 gap-4 sm:gap-6 mb-8">
        <Card className="border-red-200">
          <CardHeader className="bg-red-50 pb-2">
            <CardTitle className="text-lg text-red-700">Fee Payments</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-3xl font-bold text-red-600">{stats.pendingFees}</p>
            <p className="text-sm text-gray-500">Students with pending fees</p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button asChild variant="outline" size="sm">
              <Link to="/admin/fees">View Details</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-amber-200">
          <CardHeader className="bg-amber-50 pb-2">
            <CardTitle className="text-lg text-amber-700">Attendance</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-3xl font-bold text-amber-600">{stats.absentToday}</p>
            <p className="text-sm text-gray-500">Students absent today</p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button asChild variant="outline" size="sm">
              <Link to="/admin/attendance">View Details</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="bg-blue-50 pb-2">
            <CardTitle className="text-lg text-blue-700">Upcoming Exams</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-3xl font-bold text-blue-600">{stats.upcomingExams}</p>
            <p className="text-sm text-gray-500">Exams in the next 7 days</p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button asChild variant="outline" size="sm">
              <Link to="/admin/exams">View Details</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
