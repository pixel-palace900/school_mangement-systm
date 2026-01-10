import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { MobileNavigationDrawer, MobileHeader } from '../components/ui/mobile-navigation';

// Icons (using emoji placeholders until lucide-react is fixed)
const Icons = {
  Dashboard: () => <span className="mr-2">📊</span>,
  Students: () => <span className="mr-2">👨‍🎓</span>,
  Parents: () => <span className="mr-2">👨‍👩‍👧‍👦</span>,
  Teachers: () => <span className="mr-2">👨‍🏫</span>,
  Classes: () => <span className="mr-2">🏫</span>,
  Subjects: () => <span className="mr-2">📚</span>,
  Exams: () => <span className="mr-2">📝</span>,
  Fees: () => <span className="mr-2">💰</span>,
  Attendance: () => <span className="mr-2">📋</span>,
  Circulars: () => <span className="mr-2">📢</span>,
  Profile: () => <span className="mr-2">👤</span>,
  Settings: () => <span className="mr-2">⚙️</span>,
  Logout: () => <span className="mr-2">🚪</span>,
};

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Icons.Dashboard },
    { name: 'Students', href: '/admin/students', icon: Icons.Students },
    { name: 'Parents', href: '/admin/parents', icon: Icons.Parents },
    { name: 'Teachers', href: '/admin/teachers', icon: Icons.Teachers },
    { name: 'Classes', href: '/admin/classes', icon: Icons.Classes },
    { name: 'Subjects', href: '/admin/subjects', icon: Icons.Subjects },
    { name: 'Exams', href: '/admin/exams', icon: Icons.Exams },
    { name: 'Fees', href: '/admin/fees', icon: Icons.Fees },
    { name: 'Attendance', href: '/admin/attendance', icon: Icons.Attendance },
    { name: 'Circulars', href: '/admin/circulars', icon: Icons.Circulars },
    { name: 'Settings', href: '/admin/settings', icon: Icons.Settings },
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
          title="Admin Portal"
          onMenuClick={() => setIsMobileMenuOpen(true)}
          user={user}
          className="fixed top-0 left-0 right-0 z-50 bg-blue-700 text-white"
        />
        <div className="h-16"></div> {/* Spacer for fixed header */}
      </div>

      {/* Mobile Navigation Drawer */}
      <MobileNavigationDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navigation={navigation}
        user={user}
        onLogout={handleLogout}
        title="Admin Portal"
        className="lg:hidden"
      />

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex-1 flex flex-col min-h-0 bg-blue-700">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-white">Admin Portal</h1>
            </div>
            <div className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                // Add a check to ensure the icon exists
                const IconComponent = item.icon || (() => <span className="mr-2">📄</span>);

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${location.pathname === item.href
                        ? 'bg-blue-800 text-white'
                        : 'text-white hover:bg-blue-600'
                      } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    <IconComponent />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex-shrink-0 flex border-t border-blue-800 p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs font-medium text-blue-200">{user?.email}</p>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="mt-2 bg-red-600 hover:bg-red-700"
                    onClick={handleLogout}
                  >
                    <Icons.Logout />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <main className="flex-1 pb-8 pt-2 lg:pt-8">
          <div className="mt-14 lg:mt-0 mx-auto mobile-padding">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;




