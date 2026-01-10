import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { MobileNavigationDrawer, MobileHeader } from '../components/ui/mobile-navigation';

// Icons (using emoji placeholders until lucide-react is fixed)
const Icons = {
  Home: () => <span className="mr-2">🏠</span>,
  Children: () => <span className="mr-2">👨‍👩‍👧‍👦</span>,
  Attendance: () => <span className="mr-2">📋</span>,
  Fees: () => <span className="mr-2">💰</span>,
  Exams: () => <span className="mr-2">📝</span>,
  Circulars: () => <span className="mr-2">📢</span>,
  Communication: () => <span className="mr-2">💬</span>,
  Logout: () => <span className="mr-2">🚪</span>,
};

const ParentLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/parent/dashboard', icon: Icons.Home },
    { name: 'Children', href: '/parent/children', icon: Icons.Children },
    { name: 'Attendance', href: '/parent/attendance', icon: Icons.Attendance },
    { name: 'Fees', href: '/parent/fees', icon: Icons.Fees },
    { name: 'Exams', href: '/parent/exams', icon: Icons.Exams },
    { name: 'Circulars', href: '/parent/circulars', icon: Icons.Circulars },
    { name: 'Communication', href: '/parent/communication', icon: Icons.Communication },
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
          title="Parent Portal"
          onMenuClick={() => setIsMobileMenuOpen(true)}
          user={user}
          className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm"
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
        title="Parent Portal"
        className="lg:hidden"
      />

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex-1 flex flex-col min-h-0 bg-white shadow-sm">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-gray-900">Parent Portal</h1>
            </div>
            <div className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    location.pathname === item.href
                      ? 'bg-primary text-primary-foreground'
                      : 'text-gray-600 hover:bg-gray-100'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                >
                  <item.icon />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                  <p className="text-xs font-medium text-gray-500">{user?.email}</p>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="mt-2"
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

export default ParentLayout;
