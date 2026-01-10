import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import * as studentApi from '../../api/student';

// Icons (using emoji placeholders)
const Icons = {
  User: () => <span className="text-2xl">👤</span>,
  Mail: () => <span className="text-xl">📧</span>,
  Phone: () => <span className="text-xl">📞</span>,
  Calendar: () => <span className="text-xl">📅</span>,
  MapPin: () => <span className="text-xl">📍</span>,
  Users: () => <span className="text-xl">👥</span>,
  GraduationCap: () => <span className="text-xl">🎓</span>,
  Edit: () => <span className="text-xl">✏️</span>,
  Save: () => <span className="text-xl">💾</span>,
  X: () => <span className="text-xl">❌</span>,
  Camera: () => <span className="text-xl">📷</span>,
};

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        // In a production environment, we would use the API call
        // For now, we'll use mock data
        const profileResponse = studentApi.getMockProfile();
        setProfile(profileResponse.data);
        setEditForm(profileResponse.data);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({ ...profile });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({ ...profile });
  };

  const handleSave = async () => {
    try {
      // In a production environment, we would send the updated data to the API
      console.log('Saving profile:', editForm);
      
      // Simulate API call
      setTimeout(() => {
        setProfile({ ...editForm });
        setIsEditing(false);
        // Show success message
      }, 500);
      
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Icons.User />
          <div className="ml-3">
            <h1 className="text-2xl font-bold">My Profile</h1>
            <p className="text-gray-600">View and update your personal information.</p>
          </div>
        </div>
        
        {!isEditing ? (
          <Button onClick={handleEdit} className="flex items-center">
            <Icons.Edit />
            <span className="ml-2">Edit Profile</span>
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button onClick={handleSave} className="flex items-center">
              <Icons.Save />
              <span className="ml-2">Save</span>
            </Button>
            <Button variant="outline" onClick={handleCancel} className="flex items-center">
              <Icons.X />
              <span className="ml-2">Cancel</span>
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture and Basic Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Icons.User />
                <span className="ml-2">Profile Picture</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl text-indigo-600">
                    {profile?.name?.charAt(0)?.toUpperCase() || 'S'}
                  </span>
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-indigo-500 text-white p-2 rounded-full hover:bg-indigo-600">
                    <Icons.Camera />
                  </button>
                )}
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 mb-1">{profile?.name}</h3>
              <p className="text-sm text-gray-500 mb-2">Student ID: {profile?.rollNumber}</p>
              <p className="text-sm text-indigo-600">
                {profile?.classId && `Class ${profile.classId.name} ${profile.classId.section}`}
              </p>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Icons.GraduationCap />
                <span className="ml-2">Academic Info</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Class</span>
                  <span className="text-sm font-medium">
                    {profile?.classId ? `${profile.classId.name} ${profile.classId.section}` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Roll Number</span>
                  <span className="text-sm font-medium">{profile?.rollNumber || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Academic Year</span>
                  <span className="text-sm font-medium">2023-2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Admission Date</span>
                  <span className="text-sm font-medium">April 2023</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Information */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Icons.User />
                <span className="ml-2">Personal Information</span>
              </CardTitle>
              <CardDescription>
                {isEditing ? 'Update your personal information below.' : 'Your personal details and contact information.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  {isEditing ? (
                    <Input
                      type="text"
                      value={editForm.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm text-gray-900 py-2">{profile?.name || 'N/A'}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Icons.Mail />
                    <span className="ml-1">Email Address</span>
                  </label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={editForm.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm text-gray-900 py-2">{profile?.email || 'N/A'}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Icons.Phone />
                    <span className="ml-1">Phone Number</span>
                  </label>
                  {isEditing ? (
                    <Input
                      type="tel"
                      value={editForm.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm text-gray-900 py-2">{profile?.phone || 'N/A'}</p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Icons.Calendar />
                    <span className="ml-1">Date of Birth</span>
                  </label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={editForm.dateOfBirth || ''}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    />
                  ) : (
                    <p className="text-sm text-gray-900 py-2">
                      {profile?.dateOfBirth ? formatDate(profile.dateOfBirth) : 'N/A'}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Icons.MapPin />
                    <span className="ml-1">Address</span>
                  </label>
                  {isEditing ? (
                    <textarea
                      rows={3}
                      value={editForm.address || ''}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                      placeholder="Enter your address"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 py-2">{profile?.address || 'N/A'}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Parent/Guardian Information */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Icons.Users />
                <span className="ml-2">Parent/Guardian Information</span>
              </CardTitle>
              <CardDescription>
                Contact details of your parent or guardian
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parent/Guardian Name
                  </label>
                  <p className="text-sm text-gray-900 py-2">{profile?.parentId?.name || 'N/A'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Icons.Mail />
                    <span className="ml-1">Email Address</span>
                  </label>
                  <p className="text-sm text-gray-900 py-2">{profile?.parentId?.email || 'N/A'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Icons.Phone />
                    <span className="ml-1">Phone Number</span>
                  </label>
                  <p className="text-sm text-gray-900 py-2">{profile?.parentId?.phone || 'N/A'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Icons.MapPin />
                    <span className="ml-1">Address</span>
                  </label>
                  <p className="text-sm text-gray-900 py-2">{profile?.parentId?.address || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
