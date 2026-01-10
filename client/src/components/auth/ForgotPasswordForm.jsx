// Note: You need to install react-hook-form with: npm install react-hook-form
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import * as authApi from '../../api/auth';

const userTypes = [
  { id: 'admin', label: 'Administrator' },
  { id: 'teacher', label: 'Teacher' },
  { id: 'student', label: 'Student' },
  { id: 'parent', label: 'Parent' },
];

const ForgotPasswordForm = () => {
  const [userType, setUserType] = useState('');
  const [showUserTypeSelection, setShowUserTypeSelection] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    setShowUserTypeSelection(false);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    
    try {
      await authApi.forgotPassword({
        email: data.email,
        userType,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to process request');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setShowUserTypeSelection(true);
    setSuccess(false);
  };

  if (showUserTypeSelection) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Select User Type
        </h2>
        <div className="space-y-4">
          {userTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => handleUserTypeSelect(type.id)}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200 flex items-center justify-center"
            >
              <span>{type.label}</span>
            </button>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link to="/login" className="text-blue-600 hover:text-blue-800">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <svg
            className="mx-auto h-12 w-12 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mt-4">Check Your Email</h2>
          <p className="text-gray-600 mt-2">
            If an account exists with the email you provided, we've sent instructions to reset your password.
          </p>
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={handleBack}
            className="text-blue-600 hover:text-blue-800 mr-4"
          >
            Try Another User Type
          </button>
          <Link to="/login" className="text-blue-600 hover:text-blue-800">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <button
        onClick={handleBack}
        className="mb-4 text-blue-600 hover:text-blue-800 flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Back
      </button>
      
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Reset {userTypes.find((type) => type.id === userType)?.label} Password
      </h2>
      
      <p className="text-gray-600 mb-6 text-center">
        Enter your email address and we'll send you instructions to reset your password.
      </p>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
        
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200 flex items-center justify-center"
          >
            {loading ? (
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : null}
            {loading ? 'Sending...' : 'Send Reset Instructions'}
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <Link to="/login" className="text-blue-600 hover:text-blue-800">
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
