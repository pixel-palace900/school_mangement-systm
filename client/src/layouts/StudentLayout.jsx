import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { MobileNavigationDrawer, MobileHeader } from '../components/ui/mobile-navigation';

// Icons (using emoji placeholders until lucide-react is fixed)
const Icons = {
  Dashboard: () => <span className="mr-2">📊</span>,
  Timetable: () => <span className="mr-2">🕒</span>,
  Attendance: () => <span className="mr-2">📋</span>,
  Exams: () => <span className="mr-2">📝</span>,
  Assignments: () => <span className="mr-2">📚</span>,
  Grades: () => <span className="mr-2">🏆</span>,
  Fees: () => <span className="mr-2">💰</span>,
  Library: () => <span className="mr-2">📖</span>,
  Circulars: () => <span className="mr-2">📢</span>,
  Profile: () => <span className="mr-2">👤</span>,
  Logout: () => <span className="mr-2">🚪</span>,
};

const StudentLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/student/dashboard', icon: Icons.Dashboard },
    { name: 'Timetable', href: '/student/timetable', icon: Icons.Timetable },
    { name: 'Attendance', href: '/student/attendance', icon: Icons.Attendance },
    { name: 'Assignments', href: '/student/assignments', icon: Icons.Assignments },
    { name: 'Exams', href: '/student/exams', icon: Icons.Exams },
    { name: 'Grades', href: '/student/grades', icon: Icons.Grades },
    { name: 'Fees', href: '/student/fees', icon: Icons.Fees },
    { name: 'Library', href: '/student/library', icon: Icons.Library },
    { name: 'Circulars', href: '/student/circulars', icon: Icons.Circulars },
    { name: 'Profile', href: '/student/profile', icon: Icons.Profile },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="md:hidden">
        <MobileHeader
          title="Student Portal"
          onMenuClick={() => setIsMobileMenuOpen(true)}
          user={user}
          className="bg-indigo-700 text-white"
        />
      </div>

      {/* Desktop Top Navigation */}
      <div className="desktop-only bg-indigo-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold">Student Portal</h1>
            </div>
            <div className="flex items-center">
              <div className="text-sm text-white mr-4">
                <span className="font-medium">{user?.name}</span>
                {user?.classId && (
                  <span className="ml-2 text-indigo-200">
                    Class {user.classId.name} {user.classId.section}
                  </span>
                )}
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

      <div className="flex">
        {/* Sidebar (desktop) */}
        <div className="hidden md:block md:w-64 bg-white shadow-sm">
          <div className="h-full flex flex-col">
            <nav className="flex-1 py-4 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    location.pathname === item.href
                      ? 'bg-indigo-100 text-indigo-900'
                      : 'text-gray-600 hover:bg-gray-100'
                  } group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
                >
                  <item.icon />
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center">
                <div>
                  <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                  {user?.rollNumber && (
                    <p className="text-xs text-gray-500">Roll No: {user.rollNumber}</p>
                  )}
                </div>
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
          title="Student Portal"
          className="md:hidden"
        />

        {/* Main content */}
        <main className="flex-1 mobile-padding py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
