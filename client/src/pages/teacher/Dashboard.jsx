import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

// Mock data for teacher dashboard
const mockClasses = [
  { _id: '1', name: '10', section: 'A', studentsCount: 35 },
  { _id: '2', name: '9', section: 'B', studentsCount: 32 }
];

const mockTimetable = [
  { _id: '1', day: 'Monday', period: '1', time: '8:00 AM - 9:00 AM', subject: 'Mathematics', class: { name: '10', section: 'A' } },
  { _id: '2', day: 'Monday', period: '3', time: '10:30 AM - 11:30 AM', subject: 'Mathematics', class: { name: '9', section: 'B' } },
  { _id: '3', day: 'Tuesday', period: '2', time: '9:15 AM - 10:15 AM', subject: 'Mathematics', class: { name: '10', section: 'A' } },
  { _id: '4', day: 'Wednesday', period: '4', time: '11:45 AM - 12:45 PM', subject: 'Mathematics', class: { name: '9', section: 'B' } },
  { _id: '5', day: 'Friday', period: '1', time: '8:00 AM - 9:00 AM', subject: 'Mathematics', class: { name: '10', section: 'A' } }
];

const mockUpcomingExams = [
  { _id: '1', title: 'Mid-Term Exam', subject: 'Mathematics', date: '2023-07-10', class: { name: '10', section: 'A' } },
  { _id: '2', title: 'Mid-Term Exam', subject: 'Mathematics', date: '2023-07-12', class: { name: '9', section: 'B' } }
];

const mockRecentAttendance = [
  { _id: '1', date: '2023-06-05', class: { name: '10', section: 'A' }, present: 32, absent: 3 },
  { _id: '2', date: '2023-06-05', class: { name: '9', section: 'B' }, present: 30, absent: 2 }
];

// Icons (using emoji placeholders until lucide-react is fixed)
const Icons = {
  Classes: () => <span className="text-2xl">🏫</span>,
  Students: () => <span className="text-2xl">👨‍🎓</span>,
  Attendance: () => <span className="text-2xl">📋</span>,
  Exams: () => <span className="text-2xl">📝</span>,
  Assignments: () => <span className="text-2xl">📚</span>,
  Library: () => <span className="text-2xl">📖</span>,
  Circulars: () => <span className="text-2xl">📢</span>,
  Fees: () => <span className="text-2xl">💰</span>,
  Timetable: () => <span className="text-2xl">🕒</span>,
  Communication: () => <span className="text-2xl">💬</span>,
};

const Dashboard = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get today's day name
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  // Filter timetable for today
  const todaySchedule = timetable.filter(item => item.day === today);

  useEffect(() => {
    // In a real app, we would fetch data from the API
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setClasses(mockClasses);
      setTimetable(mockTimetable);
      setUpcomingExams(mockUpcomingExams);
      setRecentAttendance(mockRecentAttendance);
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
      <h1 className="text-2xl font-bold mb-6">Teacher Dashboard</h1>

      {/* Welcome Card */}
      <Card className="mb-6 bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle>Welcome, {user?.name}!</CardTitle>
          <CardDescription>
            {user?.subjectSpecialization} Teacher
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Here's an overview of your classes, schedule, and upcoming activities. Use the navigation menu to access detailed information and manage your teaching responsibilities.
          </p>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
        <Link to="/teacher/classes">
          <Card className="h-full hover:bg-gray-50 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-4">
              <Icons.Classes />
              <h3 className="mt-2 font-medium text-xs">Classes</h3>
            </CardContent>
          </Card>
        </Link>
        <Link to="/teacher/students">
          <Card className="h-full hover:bg-gray-50 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-4">
              <Icons.Students />
              <h3 className="mt-2 font-medium text-xs">Students</h3>
            </CardContent>
          </Card>
        </Link>
        <Link to="/teacher/attendance">
          <Card className="h-full hover:bg-gray-50 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-4">
              <Icons.Attendance />
              <h3 className="mt-2 font-medium text-xs">Attendance</h3>
            </CardContent>
          </Card>
        </Link>
        <Link to="/teacher/grades">
          <Card className="h-full hover:bg-gray-50 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-4">
              <Icons.Exams />
              <h3 className="mt-2 font-medium text-xs">Grades</h3>
            </CardContent>
          </Card>
        </Link>
        <Link to="/teacher/assignments">
          <Card className="h-full hover:bg-gray-50 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-4">
              <Icons.Assignments />
              <h3 className="mt-2 font-medium text-xs">Assignments</h3>
            </CardContent>
          </Card>
        </Link>
        <Link to="/teacher/library">
          <Card className="h-full hover:bg-gray-50 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-4">
              <Icons.Library />
              <h3 className="mt-2 font-medium text-xs">Library</h3>
            </CardContent>
          </Card>
        </Link>
        <Link to="/teacher/circulars">
          <Card className="h-full hover:bg-gray-50 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-4">
              <Icons.Circulars />
              <h3 className="mt-2 font-medium text-xs">Circulars</h3>
            </CardContent>
          </Card>
        </Link>
        <Link to="/teacher/fees">
          <Card className="h-full hover:bg-gray-50 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-4">
              <Icons.Fees />
              <h3 className="mt-2 font-medium text-xs">Fees</h3>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Today's Schedule */}
      <h2 className="text-xl font-semibold mb-4">Today's Schedule ({today})</h2>
      <Card className="mb-8">
        <CardContent className="p-6">
          {todaySchedule.length > 0 ? (
            <div className="space-y-4">
              {todaySchedule.map((item) => (
                <div key={item._id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <h3 className="font-medium">{item.subject}</h3>
                    <p className="text-sm text-gray-500">
                      Class {item.class.name} - {item.class.section}
                    </p>
                  </div>
                  <div className="text-sm">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                      {item.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">No classes scheduled for today.</p>
          )}
        </CardContent>
      </Card>

      {/* Classes Overview */}
      <h2 className="text-xl font-semibold mb-4">Your Classes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {classes.map((cls) => (
          <Card key={cls._id}>
            <CardHeader>
              <CardTitle>Class {cls.name} - {cls.section}</CardTitle>
              <CardDescription>
                {cls.studentsCount} Students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Recent Attendance:</span>
                  <span className="text-sm font-medium">
                    {recentAttendance.find(a => a.class.name === cls.name && a.class.section === cls.section)?.present || 0}/{cls.studentsCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Upcoming Exam:</span>
                  <span className="text-sm font-medium">
                    {upcomingExams.find(e => e.class.name === cls.name && e.class.section === cls.section) ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" size="sm">
                <Link to={`/teacher/classes/${cls._id}`}>View Class</Link>
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
                      Class {exam.class.name} - {exam.class.section}
                    </p>
                  </div>
                  <div className="text-sm">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {new Date(exam.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
              <Button asChild variant="outline" size="sm" className="mt-4">
                <Link to="/teacher/exams">View All Exams</Link>
              </Button>
            </div>
          ) : (
            <p className="text-gray-500 text-center">No upcoming exams.</p>
          )}
        </CardContent>
      </Card>

      {/* Recent Attendance */}
      <h2 className="text-xl font-semibold mb-4">Recent Attendance</h2>
      <Card>
        <CardContent className="p-6">
          {recentAttendance.length > 0 ? (
            <div className="space-y-4">
              {recentAttendance.map((attendance) => (
                <div key={attendance._id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <h3 className="font-medium">Class {attendance.class.name} - {attendance.class.section}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(attendance.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-sm">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full mr-2">
                      Present: {attendance.present}
                    </span>
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full">
                      Absent: {attendance.absent}
                    </span>
                  </div>
                </div>
              ))}
              <Button asChild variant="outline" size="sm" className="mt-4">
                <Link to="/teacher/attendance">View All Attendance</Link>
              </Button>
            </div>
          ) : (
            <p className="text-gray-500 text-center">No recent attendance records.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
