// Note: You need to install axios with: npm install axios
import api from './axios';

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.name - User's full name
 * @param {string} userData.email - User email
 * @param {string} userData.password - User password
 * @param {string} userData.phone - User phone number
 * @param {string} userData.userType - User type (admin, teacher, student, parent)
 * @returns {Promise} - Promise with registration result
 */
export const register = async (userData) => {
  try {
    console.log('API call to register with data:', userData);

    // Check if server is available
    try {
      // Try to make the API call
      const response = await api.post('/user/register', userData);
      console.log('API response from register:', response);
      return response.data;
    } catch (serverError) {
      console.warn('Server error, using local registration fallback:', serverError);

      // Fallback to local registration if server is not available
      // Get existing users from localStorage or create empty array
      const existingUsers = JSON.parse(localStorage.getItem('localUsers') || '[]');

      // Check if email already exists
      const emailExists = existingUsers.some(user =>
        user.email === userData.email && user.userType === userData.userType
      );

      if (emailExists) {
        throw new Error(`${userData.userType.charAt(0).toUpperCase() + userData.userType.slice(1)} with this email already exists`);
      }

      // Create new user object
      const newUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        password: userData.password, // In a real app, this would be hashed
        phone: userData.phone,
        userType: userData.userType,
        createdAt: new Date().toISOString()
      };

      // Add to existing users
      existingUsers.push(newUser);

      // Save to localStorage
      localStorage.setItem('localUsers', JSON.stringify(existingUsers));

      // Return success response
      return {
        success: true,
        message: 'Registration successful',
        data: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          userType: newUser.userType
        }
      };
    }
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Login user
 * @param {Object} credentials - User credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @param {string} credentials.userType - User type (admin, teacher, student, parent)
 * @returns {Promise} - Promise with user data and token
 */
export const login = async (credentials) => {
  try {
    console.log('Attempting login with credentials:', credentials);

    // Try to login with server
    try {
      const response = await api.post('/user/login', credentials);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw { message: error.message || 'An error occurred during login' };
  }
};

/**
 * Get current user profile
 * @returns {Promise} - Promise with user data
 */
export const getCurrentUser = async () => {
  try {
    try {
      // Try to get user from server
      const response = await api.get('/user/me');
      return response.data;
    } catch (serverError) {
      console.warn('Server error, using local user data:', serverError);

      // Fallback to local storage if server is not available
      const storedUser = JSON.parse(localStorage.getItem('user'));

      if (!storedUser) {
        throw new Error('User not found');
      }

      // Return success response
      return {
        success: true,
        data: storedUser
      };
    }
  } catch (error) {
    console.error('Get current user error:', error);
    throw { message: error.message || 'Failed to get user profile' };
  }
};

/**
 * Request password reset
 * @param {Object} data - Password reset data
 * @param {string} data.email - User email
 * @param {string} data.userType - User type (admin, teacher, student, parent)
 * @returns {Promise} - Promise with reset token
 */
export const forgotPassword = async (data) => {
  try {
    const response = await api.post('/user/forgot-password', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to process forgot password request' };
  }
};

/**
 * Reset password
 * @param {Object} data - Password reset data
 * @param {string} data.token - Reset token
 * @param {string} data.password - New password
 * @returns {Promise} - Promise with success message
 */
export const resetPassword = async (data) => {
  try {
    const response = await api.post('/user/reset-password', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to reset password' };
  }
};

/**
 * Clear all local authentication data
 * This removes locally stored users, tokens, and user data
 * Useful for debugging or when you want to force server-only authentication
 */
export const clearLocalAuthData = () => {
  try {
    localStorage.removeItem('localUsers');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    console.log('Local authentication data cleared successfully');
    return true;
  } catch (error) {
    console.error('Error clearing local auth data:', error);
    return false;
  }
};

/**
 * Get locally stored users (for debugging)
 * @returns {Array} Array of locally stored users
 */
export const getLocalUsers = () => {
  try {
    return JSON.parse(localStorage.getItem('localUsers') || '[]');
  } catch (error) {
    console.error('Error getting local users:', error);
    return [];
  }
};

