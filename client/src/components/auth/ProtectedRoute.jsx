// Note: You need to install react-router-dom with: npm install react-router-dom
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Protected Route component
 * @param {Object} props - Component props
 * @param {Array} props.allowedRoles - Array of roles allowed to access the route
 * @returns {JSX.Element} - Protected route component
 */
const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();

  console.log('ProtectedRoute:', {
    isAuthenticated,
    user,
    loading,
    allowedRoles,
    hasRequiredRole: user && allowedRoles.includes(user.role)
  });

  // Show loading state while checking authentication
  if (loading) {
    console.log('ProtectedRoute: Loading...');
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log('ProtectedRoute: Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // If roles are specified and user doesn't have the required role, redirect to unauthorized
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    console.log(`ProtectedRoute: User role "${user?.role}" not in allowed roles [${allowedRoles.join(', ')}], redirecting to unauthorized`);

    // Redirect to the user's dashboard instead of unauthorized page for better UX
    const dashboardPath = `/${user?.role}/dashboard`;
    console.log(`Redirecting to user's dashboard: ${dashboardPath}`);
    return <Navigate to={dashboardPath} replace />;
  }

  console.log('ProtectedRoute: User authorized, rendering content');
  // If authenticated and authorized, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
