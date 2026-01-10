import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const UnauthorizedPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Automatically redirect to the user's dashboard after 3 seconds
  useEffect(() => {
    if (user && user.role) {
      const dashboardPath = `/${user.role}/dashboard`;
      const timer = setTimeout(() => {
        console.log(`Auto-redirecting to ${dashboardPath}`);
        navigate(dashboardPath);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div className="text-center">
          <svg
            className="mx-auto h-16 w-16 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            ></path>
          </svg>

          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
            Access Denied
          </h2>

          <p className="mt-2 text-gray-600">
            You don't have permission to access this page.
          </p>

          {user && (
            <>
              <p className="mt-1 text-sm text-gray-500">
                Logged in as: {user.name} ({user.role})
              </p>
              <p className="mt-1 text-sm text-blue-500">
                Redirecting to your dashboard in 3 seconds...
              </p>
            </>
          )}
        </div>

        <div className="mt-8 flex flex-col space-y-3">
          <Link
            to={user ? `/${user.role}/dashboard` : '/'}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go to Dashboard
          </Link>

          <button
            onClick={logout}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
