import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    qualification: '',
    experience: '',
    subjectSpecialization: '',
    joiningDate: '',
    emergencyContact: '',
    bio: ''
  });

  // Mock teacher data - in real app, this would come from API
  const mockTeacherData = {
    name: user?.name || 'John Doe',
    email: user?.email || 'john.doe@school.edu',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, City, State 12345',
    qualification: 'M.Sc. Mathematics, B.Ed.',
    experience: '8 years',
    subjectSpecialization: user?.subjectSpecialization || 'Mathematics',
    joiningDate: '2020-08-15',
    emergencyContact: '+1 (555) 987-6543',
    bio: 'Passionate mathematics teacher with 8 years of experience in secondary education. Specialized in making complex mathematical concepts accessible to students through innovative teaching methods.',
    employeeId: 'TCH001',
    department: 'Mathematics',
    classesAssigned: ['10-A', '9-B'],
    totalStudents: 67,
    weeklyHours: 24
  };

  useEffect(() => {
    // Initialize form data with mock data
    setFormData(mockTeacherData);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setIsEditing(false);
      // In real app, would update user context and show success message
      alert('Profile updated successfully!');
    }, 1000);
  };

  const handleCancel = () => {
    setFormData(mockTeacherData);
    setIsEditing(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button 
                variant="outline" 
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => setIsEditing(true)}
            >
              ✏️ Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👨‍🏫</span>
              </div>
              <CardTitle>{formData.name}</CardTitle>
              <CardDescription>{formData.subjectSpecialization} Teacher</CardDescription>
              <Badge className="bg-green-100 text-green-800 mt-2">
                Employee ID: {mockTeacherData.employeeId}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium">{mockTeacherData.department}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="font-medium">{formData.experience}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Joining Date</p>
                  <p className="font-medium">
                    {new Date(formData.joiningDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Teaching Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Classes Assigned</span>
                  <Badge variant="outline">{mockTeacherData.classesAssigned.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Total Students</span>
                  <Badge className="bg-blue-100 text-blue-800">{mockTeacherData.totalStudents}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Weekly Hours</span>
                  <Badge className="bg-purple-100 text-purple-800">{mockTeacherData.weeklyHours}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Classes</span>
                  <div className="flex gap-1">
                    {mockTeacherData.classesAssigned.map((cls, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {cls}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                {isEditing ? 'Edit your personal details below' : 'Your personal information'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input
                    id="emergencyContact"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="qualification">Qualification</Label>
                  <Input
                    id="qualification"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="experience">Experience</Label>
                  <Input
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="subjectSpecialization">Subject Specialization</Label>
                  <Input
                    id="subjectSpecialization"
                    name="subjectSpecialization"
                    value={formData.subjectSpecialization}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="joiningDate">Joining Date</Label>
                  <Input
                    id="joiningDate"
                    name="joiningDate"
                    type="date"
                    value={formData.joiningDate}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows={4}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button variant="outline" className="w-full sm:w-auto">
                  🔒 Change Password
                </Button>
                <Button variant="outline" className="w-full sm:w-auto ml-0 sm:ml-2">
                  📧 Update Email Preferences
                </Button>
                <Button variant="outline" className="w-full sm:w-auto ml-0 sm:ml-2">
                  🔔 Notification Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
