import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { MobileNavigationDrawer, MobileHeader } from '../components/ui/mobile-navigation';

// Icons (using emoji placeholders until lucide-react is fixed)
const Icons = {
  Dashboard: () => <span className="mr-2">📊</span>,
  Students: () => <span className="mr-2">👨‍🎓</span>,
  Classes: () => <span className="mr-2">🏫</span>,
  Subjects: () => <span className="mr-2">📚</span>,
  Exams: () => <span className="mr-2">📝</span>,
  Assignments: () => <span className="mr-2">📋</span>,
  Attendance: () => <span className="mr-2">✅</span>,
  Timetable: () => <span className="mr-2">🕒</span>,
  Library: () => <span className="mr-2">📖</span>,
  Communication: () => <span className="mr-2">💬</span>,
  Circulars: () => <span className="mr-2">📢</span>,
  Fees: () => <span className="mr-2">💰</span>,
  Profile: () => <span className="mr-2">👤</span>,
  Logout: () => <span className="mr-2">🚪</span>,
};

const TeacherLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/teacher/dashboard', icon: Icons.Dashboard },
    { name: 'Students', href: '/teacher/students', icon: Icons.Students },
    { name: 'Classes', href: '/teacher/classes', icon: Icons.Classes },
    { name: 'Subjects', href: '/teacher/subjects', icon: Icons.Subjects },
    { name: 'Exams', href: '/teacher/exams', icon: Icons.Exams },
    { name: 'Grades', href: '/teacher/grades', icon: Icons.Exams },
    { name: 'Assignments', href: '/teacher/assignments', icon: Icons.Assignments },
    { name: 'Attendance', href: '/teacher/attendance', icon: Icons.Attendance },
    { name: 'Timetable', href: '/teacher/timetable', icon: Icons.Timetable },
    { name: 'Library', href: '/teacher/library', icon: Icons.Library },
    { name: 'Circulars', href: '/teacher/circulars', icon: Icons.Circulars },
    { name: 'Fees', href: '/teacher/fees', icon: Icons.Fees },
    { name: 'Communication', href: '/teacher/communication', icon: Icons.Communication },
    { name: 'Profile', href: '/teacher/profile', icon: Icons.Profile },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="lg:hidden">
        <MobileHeader
          title="Teacher Portal"
          onMenuClick={() => setIsMobileMenuOpen(true)}
          user={user}
          className="bg-green-700 text-white"
          actions={[
            <Button
              key="logout"
              variant="destructive"
              size="sm"
              className="bg-red-600 hover:bg-red-700 mobile-only"
              onClick={handleLogout}
            >
              <Icons.Logout />
            </Button>
          ]}
        />
      </div>

      {/* Desktop Top Navigation */}
      <div className="desktop-only bg-green-700 text-white shadow-md">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold">Teacher Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-white">
                <span className="font-medium">{user?.name}</span>
                <span className="ml-2 text-green-200">{user?.subjectSpecialization}</span>
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="bg-red-600 hover:bg-red-700"
                onClick={handleLogout}
              >
                <Icons.Logout />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <MobileNavigationDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navigation={navigation}
        user={user}
        onLogout={handleLogout}
        title="Teacher Portal"
        className="lg:hidden"
      />

      {/* Desktop layout with sidebar */}
      <div className="hidden lg:flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <nav className="mt-5 px-2">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    location.pathname === item.href
                      ? 'bg-green-100 text-green-900 border-r-2 border-green-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`}
                >
                  <item.icon />
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <main className="mobile-padding py-6">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile content */}
      <div className="lg:hidden">
        <main className="mobile-padding py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TeacherLayout;
