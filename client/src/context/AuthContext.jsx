// Note: You need to install react-router-dom with: npm install react-router-dom
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authApi from '../api/auth';

// Create the auth context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          console.log('Checking authentication with token:', token);
          const storedUser = JSON.parse(localStorage.getItem('user'));
          if (storedUser) {
            console.log('Found stored user:', storedUser);
            setUser(storedUser);
          } else {
            // If no user in localStorage, fetch from API
            console.log('No stored user, fetching from API');
            try {
              const response = await authApi.getCurrentUser();
              console.log('API response for current user:', response);

              // Handle different response formats
              const userData = response.data || response;
              console.log('Extracted user data:', userData);

              setUser(userData);
              localStorage.setItem('user', JSON.stringify(userData));
            } catch (apiErr) {
              console.error('API error when fetching user:', apiErr);

              // Only logout if it's not a network error or server unavailable
              // This prevents logout when using local tokens and server is down
              if (apiErr.response && apiErr.response.status === 401) {
                console.log('401 error - invalid token, logging out');
                logout();
              } else {
                console.log('Network or server error, keeping user logged in with stored data');
                // Keep the stored user data if it's just a network issue
              }
            }
          }
        } catch (err) {
          console.error('Authentication check failed:', err);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  // Login function
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Attempting login with credentials:', credentials);
      const response = await authApi.login(credentials);
      console.log('Login response:', response);

      // Handle different response formats (server vs local)
      let token, user;

      if (response.data && response.data.token && response.data.user) {
        // Server response format
        token = response.data.token;
        user = response.data.user;
      } else if (response.data && response.data.token) {
        // Alternative server format
        token = response.data.token;
        user = response.data;
      } else if (response.success && response.data) {
        // Local storage format
        token = response.data.token;
        user = response.data.user;
      } else {
        console.error('Unexpected login response format:', response);
        throw new Error('Invalid response format from login');
      }

      console.log('Extracted token and user:', { token, user });

      // Save to state
      setToken(token);
      setUser(user);

      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect based on user role
      const homePage = getUserHomePage(user.role);
      console.log(`Redirecting to ${homePage} for role ${user.role}`);
      navigate(homePage);
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed');
      return { success: false, error: err.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // Clear state
    setToken(null);
    setUser(null);

    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Redirect to login
    navigate('/login');
  };

  // Update user function
  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem('user', JSON.stringify(updatedUserData));
  };

  // Get home page based on user role
  const getUserHomePage = (role) => {
    switch (role) {
      case 'admin':
        return '/admin/dashboard';
      case 'teacher':
        return '/teacher/dashboard';
      case 'student':
        return '/student/dashboard';
      case 'parent':
        return '/parent/dashboard';
      default:
        return '/';
    }
  };

  // Context value
  const value = {
    user,
    token,
    loading,
    error,
    login,
    logout,
    updateUser,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
