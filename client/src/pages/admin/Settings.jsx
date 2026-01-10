import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Switch } from "../../components/ui/switch";

const AdminSettings = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('school');

  // School Information State
  const [schoolInfo, setSchoolInfo] = useState({
    name: 'Springfield High School',
    address: '123 Education Street, Springfield, ST 12345',
    phone: '+1 (555) 123-4567',
    email: 'info@springfieldhigh.edu',
    website: 'www.springfieldhigh.edu',
    principal: 'Dr. Jane Smith',
    establishedYear: '1985',
    description: 'A premier educational institution committed to excellence in learning and character development.'
  });

  // System Configuration State
  const [systemConfig, setSystemConfig] = useState({
    academicYear: '2023-2024',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    language: 'English',
    enableNotifications: true,
    enableEmailAlerts: true,
    enableSMSAlerts: false,
    autoBackup: true,
    backupFrequency: 'daily'
  });

  // User Roles State
  const [userRoles, setUserRoles] = useState([
    {
      id: '1',
      name: 'Admin',
      permissions: ['all'],
      description: 'Full system access',
      userCount: 3
    },
    {
      id: '2',
      name: 'Teacher',
      permissions: ['view_students', 'manage_grades', 'manage_attendance', 'view_reports'],
      description: 'Teaching staff access',
      userCount: 25
    },
    {
      id: '3',
      name: 'Student',
      permissions: ['view_profile', 'view_grades', 'view_attendance', 'submit_assignments'],
      description: 'Student portal access',
      userCount: 450
    },
    {
      id: '4',
      name: 'Parent',
      permissions: ['view_child_profile', 'view_child_grades', 'view_child_attendance', 'communicate_teachers'],
      description: 'Parent portal access',
      userCount: 380
    }
  ]);

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
    passwordMinLength: 8,
    requireSpecialChars: true,
    requireNumbers: true,
    requireUppercase: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    enableTwoFactor: false,
    enableLoginNotifications: true
  });

  const handleSchoolInfoChange = (e) => {
    const { name, value } = e.target;
    setSchoolInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSystemConfigChange = (name, value) => {
    setSystemConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSecurityChange = (name, value) => {
    setSecuritySettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveSchoolInfo = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert('School information updated successfully!');
    }, 1000);
  };

  const handleSaveSystemConfig = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert('System configuration updated successfully!');
    }, 1000);
  };

  const handleSaveSecurity = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert('Security settings updated successfully!');
    }, 1000);
  };

  const tabs = [
    { id: 'school', label: '🏫 School Info', icon: '🏫' },
    { id: 'system', label: '⚙️ System Config', icon: '⚙️' },
    { id: 'roles', label: '👥 User Roles', icon: '👥' },
    { id: 'security', label: '🔒 Security', icon: '🔒' }
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">⚙️ Settings</h1>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* School Information Tab */}
      {activeTab === 'school' && (
        <Card>
          <CardHeader>
            <CardTitle>🏫 School Information</CardTitle>
            <CardDescription>
              Update your school's basic information and contact details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">School Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={schoolInfo.name}
                  onChange={handleSchoolInfoChange}
                />
              </div>
              <div>
                <Label htmlFor="principal">Principal</Label>
                <Input
                  id="principal"
                  name="principal"
                  value={schoolInfo.principal}
                  onChange={handleSchoolInfoChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                value={schoolInfo.address}
                onChange={handleSchoolInfoChange}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={schoolInfo.phone}
                  onChange={handleSchoolInfoChange}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={schoolInfo.email}
                  onChange={handleSchoolInfoChange}
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  value={schoolInfo.website}
                  onChange={handleSchoolInfoChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={schoolInfo.description}
                onChange={handleSchoolInfoChange}
                rows={3}
              />
            </div>

            <Button onClick={handleSaveSchoolInfo} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? 'Saving...' : 'Save School Information'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* System Configuration Tab */}
      {activeTab === 'system' && (
        <Card>
          <CardHeader>
            <CardTitle>⚙️ System Configuration</CardTitle>
            <CardDescription>
              Configure system-wide settings and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="academicYear">Academic Year</Label>
                <Select value={systemConfig.academicYear} onValueChange={(value) => handleSystemConfigChange('academicYear', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2023-2024">2023-2024</SelectItem>
                    <SelectItem value="2024-2025">2024-2025</SelectItem>
                    <SelectItem value="2025-2026">2025-2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={systemConfig.timezone} onValueChange={(value) => handleSystemConfigChange('timezone', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time</SelectItem>
                    <SelectItem value="America/Chicago">Central Time</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="dateFormat">Date Format</Label>
                <Select value={systemConfig.dateFormat} onValueChange={(value) => handleSystemConfigChange('dateFormat', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select value={systemConfig.currency} onValueChange={(value) => handleSystemConfigChange('currency', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="INR">INR (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="language">Language</Label>
                <Select value={systemConfig.language} onValueChange={(value) => handleSystemConfigChange('language', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="German">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Notifications</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableNotifications">Enable Notifications</Label>
                    <p className="text-sm text-gray-500">Allow system notifications</p>
                  </div>
                  <Switch
                    id="enableNotifications"
                    checked={systemConfig.enableNotifications}
                    onCheckedChange={(checked) => handleSystemConfigChange('enableNotifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableEmailAlerts">Email Alerts</Label>
                    <p className="text-sm text-gray-500">Send email notifications</p>
                  </div>
                  <Switch
                    id="enableEmailAlerts"
                    checked={systemConfig.enableEmailAlerts}
                    onCheckedChange={(checked) => handleSystemConfigChange('enableEmailAlerts', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableSMSAlerts">SMS Alerts</Label>
                    <p className="text-sm text-gray-500">Send SMS notifications</p>
                  </div>
                  <Switch
                    id="enableSMSAlerts"
                    checked={systemConfig.enableSMSAlerts}
                    onCheckedChange={(checked) => handleSystemConfigChange('enableSMSAlerts', checked)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Backup Settings</h3>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoBackup">Auto Backup</Label>
                  <p className="text-sm text-gray-500">Automatically backup system data</p>
                </div>
                <Switch
                  id="autoBackup"
                  checked={systemConfig.autoBackup}
                  onCheckedChange={(checked) => handleSystemConfigChange('autoBackup', checked)}
                />
              </div>
              {systemConfig.autoBackup && (
                <div>
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <Select value={systemConfig.backupFrequency} onValueChange={(value) => handleSystemConfigChange('backupFrequency', value)}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <Button onClick={handleSaveSystemConfig} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? 'Saving...' : 'Save System Configuration'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* User Roles Tab */}
      {activeTab === 'roles' && (
        <Card>
          <CardHeader>
            <CardTitle>👥 User Roles Management</CardTitle>
            <CardDescription>
              Manage user roles and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userRoles.map((role) => (
                <Card key={role.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">{role.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">{role.description}</p>
                        <p className="text-sm text-blue-600">{role.userCount} users</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          ✏️ Edit Permissions
                        </Button>
                        <Button variant="outline" size="sm">
                          👥 View Users
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-1">Permissions:</p>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.map((permission, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {permission.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
              ➕ Add New Role
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Security Settings Tab */}
      {activeTab === 'security' && (
        <Card>
          <CardHeader>
            <CardTitle>🔒 Security Settings</CardTitle>
            <CardDescription>
              Configure security policies and authentication settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Password Policy</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    min="6"
                    max="20"
                    value={securitySettings.passwordMinLength}
                    onChange={(e) => handleSecurityChange('passwordMinLength', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    min="3"
                    max="10"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => handleSecurityChange('maxLoginAttempts', parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="requireSpecialChars">Require Special Characters</Label>
                    <p className="text-sm text-gray-500">Password must contain special characters</p>
                  </div>
                  <Switch
                    id="requireSpecialChars"
                    checked={securitySettings.requireSpecialChars}
                    onCheckedChange={(checked) => handleSecurityChange('requireSpecialChars', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="requireNumbers">Require Numbers</Label>
                    <p className="text-sm text-gray-500">Password must contain numbers</p>
                  </div>
                  <Switch
                    id="requireNumbers"
                    checked={securitySettings.requireNumbers}
                    onCheckedChange={(checked) => handleSecurityChange('requireNumbers', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="requireUppercase">Require Uppercase Letters</Label>
                    <p className="text-sm text-gray-500">Password must contain uppercase letters</p>
                  </div>
                  <Switch
                    id="requireUppercase"
                    checked={securitySettings.requireUppercase}
                    onCheckedChange={(checked) => handleSecurityChange('requireUppercase', checked)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Session Management</h3>
              <div>
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  min="5"
                  max="120"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => handleSecurityChange('sessionTimeout', parseInt(e.target.value))}
                  className="w-48"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Authentication</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableTwoFactor">Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-500">Require 2FA for admin accounts</p>
                  </div>
                  <Switch
                    id="enableTwoFactor"
                    checked={securitySettings.enableTwoFactor}
                    onCheckedChange={(checked) => handleSecurityChange('enableTwoFactor', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableLoginNotifications">Login Notifications</Label>
                    <p className="text-sm text-gray-500">Notify users of login attempts</p>
                  </div>
                  <Switch
                    id="enableLoginNotifications"
                    checked={securitySettings.enableLoginNotifications}
                    onCheckedChange={(checked) => handleSecurityChange('enableLoginNotifications', checked)}
                  />
                </div>
              </div>
            </div>

            <Button onClick={handleSaveSecurity} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? 'Saving...' : 'Save Security Settings'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminSettings;
