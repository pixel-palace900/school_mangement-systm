import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import * as studentApi from '../../api/student';

// Icons (using emoji placeholders until lucide-react is fixed)
const Icons = {
  Timetable: () => <span className="text-2xl">🕒</span>,
  Attendance: () => <span className="text-2xl">📋</span>,
  Assignments: () => <span className="text-2xl">📚</span>,
  Exams: () => <span className="text-2xl">📝</span>,
  Grades: () => <span className="text-2xl">🏆</span>,
  Fees: () => <span className="text-2xl">💰</span>,
  Library: () => <span className="text-2xl">📖</span>,
  Circulars: () => <span className="text-2xl">📢</span>,
};

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [timetable, setTimetable] = useState([]);
  const [attendance, setAttendance] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [exams, setExams] = useState([]);
  const [circulars, setCirculars] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get today's day name
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // In a production environment, we would use the API calls
        // For now, we'll use mock data
        const profileResponse = studentApi.getMockProfile();
        const timetableResponse = studentApi.getMockTimetable();
        const attendanceResponse = studentApi.getMockAttendance();
        const assignmentsResponse = studentApi.getMockAssignments();
        const examsResponse = studentApi.getMockExams();
        const circularsResponse = studentApi.getMockCirculars();
        
        setProfile(profileResponse.data);
        
        // Get today's timetable
        const todayTimetable = timetableResponse.data.timetable.find(
          day => day.day === today
        );
        setTimetable(todayTimetable ? todayTimetable.periods : []);
        
        setAttendance(attendanceResponse.data.summary);
        setAssignments(assignmentsResponse.data.pending);
        setExams(examsResponse.data.upcoming);
        setCirculars(circularsResponse.data.circulars.slice(0, 3));
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [today]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>
      
      {/* Welcome Card */}
      <Card className="mb-6 bg-indigo-50 border-indigo-200">
        <CardHeader>
          <CardTitle>Welcome, {user?.name}!</CardTitle>
          <CardDescription>
            {profile?.classId && `Class ${profile.classId.name} ${profile.classId.section}`} | Roll No: {profile?.rollNumber}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Here's an overview of your academic activities, schedule, and important updates. Use the navigation menu to access detailed information.
          </p>
        </CardContent>
      </Card>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Attendance</p>
                <p className={`text-2xl font-bold ${attendance?.percentage >= 90 ? 'text-green-600' : attendance?.percentage >= 75 ? 'text-amber-600' : 'text-red-600'}`}>
                  {attendance?.percentage}%
                </p>
                <p className="text-xs text-gray-500">Present: {attendance?.present} / {attendance?.total} days</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Icons.Attendance />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Pending Assignments</p>
                <p className="text-2xl font-bold text-amber-600">{assignments?.length || 0}</p>
                <p className="text-xs text-gray-500">
                  {assignments?.length > 0 
                    ? `Next due: ${new Date(assignments[0].dueDate).toLocaleDateString()}`
                    : 'No pending assignments'}
                </p>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <Icons.Assignments />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Upcoming Exams</p>
                <p className="text-2xl font-bold text-blue-600">{exams?.length || 0}</p>
                <p className="text-xs text-gray-500">
                  {exams?.length > 0 
                    ? `Next exam: ${new Date(exams[0].date).toLocaleDateString()}`
                    : 'No upcoming exams'}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Icons.Exams />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Quick Links */}
      <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Link to="/student/timetable">
          <Card className="h-full hover:bg-gray-50 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Icons.Timetable />
              <h3 className="mt-2 font-medium text-sm">Timetable</h3>
            </CardContent>
          </Card>
        </Link>
        <Link to="/student/assignments">
          <Card className="h-full hover:bg-gray-50 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Icons.Assignments />
              <h3 className="mt-2 font-medium text-sm">Assignments</h3>
            </CardContent>
          </Card>
        </Link>
        <Link to="/student/exams">
          <Card className="h-full hover:bg-gray-50 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Icons.Exams />
              <h3 className="mt-2 font-medium text-sm">Exams</h3>
            </CardContent>
          </Card>
        </Link>
        <Link to="/student/grades">
          <Card className="h-full hover:bg-gray-50 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Icons.Grades />
              <h3 className="mt-2 font-medium text-sm">Grades</h3>
            </CardContent>
          </Card>
        </Link>
      </div>
      
      {/* Today's Timetable */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Today's Timetable ({today})</h2>
          <Card>
            <CardContent className="p-4">
              {timetable.length > 0 ? (
                <div className="space-y-3">
                  {timetable.map((period, index) => (
                    <div key={index} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                      <div>
                        <h3 className="font-medium">{period.subject}</h3>
                        <p className="text-sm text-gray-500">{period.teacher}</p>
                      </div>
                      <div className="text-sm">
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                          {period.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">No classes scheduled for today.</p>
              )}
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" size="sm">
                <Link to="/student/timetable">View Full Timetable</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Upcoming Assignments */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Pending Assignments</h2>
          <Card>
            <CardContent className="p-4">
              {assignments.length > 0 ? (
                <div className="space-y-3">
                  {assignments.map((assignment) => (
                    <div key={assignment._id} className="border-b pb-2 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{assignment.title}</h3>
                        <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full">
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{assignment.subject}</p>
                      <p className="text-xs text-gray-600 mt-1">{assignment.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">No pending assignments.</p>
              )}
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" size="sm">
                <Link to="/student/assignments">View All Assignments</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* Upcoming Exams and Circulars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Upcoming Exams</h2>
          <Card>
            <CardContent className="p-4">
              {exams.length > 0 ? (
                <div className="space-y-3">
                  {exams.map((exam) => (
                    <div key={exam._id} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                      <div>
                        <h3 className="font-medium">{exam.title} - {exam.subject}</h3>
                        <p className="text-sm text-gray-500">
                          {exam.time} | {exam.venue}
                        </p>
                      </div>
                      <div className="text-sm">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                          {new Date(exam.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">No upcoming exams.</p>
              )}
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" size="sm">
                <Link to="/student/exams">View All Exams</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Circulars</h2>
          <Card>
            <CardContent className="p-4">
              {circulars.length > 0 ? (
                <div className="space-y-3">
                  {circulars.map((circular) => (
                    <div key={circular._id} className="border-b pb-2 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{circular.title}</h3>
                        <span className="text-xs text-gray-500">
                          {new Date(circular.issueDate).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{circular.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">No recent circulars.</p>
              )}
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" size="sm">
                <Link to="/student/circulars">View All Circulars</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
