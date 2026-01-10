import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import * as authApi from '../../api/auth';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

// Temporarily comment out lucide-react imports until dependencies are fixed
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
const Phone = ({className}) => <span className={className}>📞</span>;

const userTypes = [
  {
    id: 'admin',
    label: 'Administrator',
    icon: <User className="h-5 w-5 mr-2" />
  },
  {
    id: 'teacher',
    label: 'Teacher',
    icon: <Users className="h-5 w-5 mr-2" />
  },
  {
    id: 'student',
    label: 'Student',
    icon: <GraduationCap className="h-5 w-5 mr-2" />
  },
  {
    id: 'parent',
    label: 'Parent',
    icon: <UserRound className="h-5 w-5 mr-2" />
  }
];

const SignupForm = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('');
  const [showUserTypeSelection, setShowUserTypeSelection] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    setShowUserTypeSelection(false);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      console.log('Submitting registration data:', {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        userType,
      });

      const response = await authApi.register({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        userType,
      });

      console.log('Registration response:', response);

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error('Registration error:', err);
      // Show more detailed error information
      if (err.response) {
        setError(`Server error: ${err.response.data?.message || err.message || 'Registration failed'}`);
      } else if (err.request) {
        setError('Network error: Server not responding. Please check if the server is running.');
      } else {
        setError(`Error: ${err.message || 'Registration failed'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setShowUserTypeSelection(true);
  };

  if (success) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-md text-center">
        <h3 className="text-lg font-medium text-green-800 mb-2">Registration Successful!</h3>
        <p className="text-green-600 mb-4">Your account has been created successfully.</p>
        <p className="text-sm text-gray-600 mb-4">Redirecting to login page...</p>
        <Button
          variant="outline"
          className="text-sm"
          onClick={() => navigate('/login')}
        >
          Go to Login Now
        </Button>
      </div>
    );
  }

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
          {selectedUserType?.label} Registration
        </h3>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-md flex items-start text-sm">
          <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              className="pl-9"
              {...register('name', {
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
              })}
            />
          </div>
          {errors.name && (
            <p className="text-sm text-destructive flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              {errors.name.message}
            </p>
          )}
        </div>

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
          <Label htmlFor="phone">Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              placeholder="(123) 456-7890"
              className="pl-9"
              {...register('phone', {
                required: 'Phone number is required',
              })}
            />
          </div>
          {errors.phone && (
            <p className="text-sm text-destructive flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              {errors.phone.message}
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

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              className="pl-9"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === watch('password') || 'Passwords do not match',
              })}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-destructive flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>

        <div className="text-center text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
