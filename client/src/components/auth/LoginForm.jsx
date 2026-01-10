import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

// Temporarily comment out lucide-react imports until dependencies are fixed
// import {
//   User,
//   Users,
//   GraduationCap,
//   UserRound,
//   ChevronLeft,
//   Mail,
//   Lock,
//   AlertCircle,
//   Loader2
// } from "lucide-react";

// Using placeholder components instead
const User = ({className}) => <span className={className}>👤</span>;
const Users = ({className}) => <span className={className}>👥</span>;
const GraduationCap = ({className}) => <span className={className}>🎓</span>;
const UserRound = ({className}) => <span className={className}>👤</span>;
const ChevronLeft = ({className}) => <span className={className}>←</span>;
const Mail = ({className}) => <span className={className}>📧</span>;
const Lock = ({className}) => <span className={className}>🔒</span>;
const AlertCircle = ({className}) => <span className={className}>⚠️</span>;
const Loader2 = ({className}) => <span className={`${className}`}>⌛</span>;

const userTypes = [
  { id: 'admin', label: 'Administrator', icon: <User className="h-4 w-4 mr-2" /> },
  { id: 'teacher', label: 'Teacher', icon: <UserRound className="h-4 w-4 mr-2" /> },
  { id: 'student', label: 'Student', icon: <GraduationCap className="h-4 w-4 mr-2" /> },
  { id: 'parent', label: 'Parent', icon: <Users className="h-4 w-4 mr-2" /> },
];

const LoginForm = () => {
  const { login, loading, error } = useAuth();
  const [userType, setUserType] = useState('');
  const [showUserTypeSelection, setShowUserTypeSelection] = useState(true);
  const [loginError, setLoginError] = useState('');

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
    setLoginError('');
    try {
      console.log('Submitting login with:', {
        email: data.email,
        password: data.password,
        userType,
      });

      const result = await login({
        email: data.email,
        password: data.password,
        userType,
      });

      console.log('Login result:', result);

      if (!result.success) {
        setLoginError(result.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login form error:', err);
      setLoginError(err.message || 'An error occurred during login');
    }
  };

  const handleBack = () => {
    setShowUserTypeSelection(true);
  };

  if (showUserTypeSelection) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-center">Select User Type</h3>
        <div className="grid grid-cols-1 gap-2">
          {userTypes.map((type) => (
            <Button
              key={type.id}
              variant="outline"
              className="justify-start h-12"
              onClick={() => handleUserTypeSelect(type.id)}
            >
              {type.icon}
              {type.label}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  const selectedUserType = userTypes.find(type => type.id === userType);

  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        className="p-0 h-auto mb-2 text-muted-foreground"
        onClick={handleBack}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to user selection
      </Button>

      <div className="flex items-center justify-center mb-4">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
          {selectedUserType?.icon}
        </div>
        <h3 className="text-lg font-medium">
          {selectedUserType?.label} Login
        </h3>
      </div>

      {(loginError || error) && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-md flex items-start text-sm">
          <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
          <span>{loginError || error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="pl-9"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-destructive flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="pl-9"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
          </div>
          {errors.password && (
            <p className="text-sm text-destructive flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="remember-me" className="text-sm font-normal">
              Remember me
            </Label>
          </div>

          <Link to="/forgot-password" className="text-sm text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>

        <div className="text-center text-sm mt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
