import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";

// Mock data for parents
const mockParents = [
  {
    _id: '1',
    name: 'Robert Smith',
    email: 'robert.smith@email.com',
    phone: '+1234567891',
    address: '123 Main Street, City, State',
    children: [
      { _id: 'st1', name: 'John Smith', class: '10-A', rollNumber: 'ST001' }
    ],
    emergencyContact: '+1234567892',
    occupation: 'Engineer',
    status: 'active'
  },
  {
    _id: '2',
    name: 'Michael Johnson',
    email: 'michael.johnson@email.com',
    phone: '+1234567893',
    address: '456 Oak Avenue, City, State',
    children: [
      { _id: 'st2', name: 'Emily Johnson', class: '10-A', rollNumber: 'ST002' }
    ],
    emergencyContact: '+1234567894',
    occupation: 'Doctor',
    status: 'active'
  },
  {
    _id: '3',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@email.com',
    phone: '+1234567895',
    address: '789 Pine Road, City, State',
    children: [
      { _id: 'st3', name: 'David Wilson', class: '9-B', rollNumber: 'ST003' }
    ],
    emergencyContact: '+1234567896',
    occupation: 'Teacher',
    status: 'active'
  },
  {
    _id: '4',
    name: 'James Brown',
    email: 'james.brown@email.com',
    phone: '+1234567897',
    address: '321 Elm Street, City, State',
    children: [
      { _id: 'st4', name: 'Lisa Brown', class: '9-B', rollNumber: 'ST004' }
    ],
    emergencyContact: '+1234567898',
    occupation: 'Business Owner',
    status: 'active'
  }
];

const ParentsList = () => {
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // In a real app, we would fetch parents from the API
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setParents(mockParents);
      setLoading(false);
    }, 500);
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = (parentId) => {
    if (window.confirm('Are you sure you want to delete this parent?')) {
      setParents(prev => prev.filter(parent => parent._id !== parentId));
      alert('Parent deleted successfully!');
    }
  };

  const filteredParents = parents.filter(parent =>
    parent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.children.some(child => 
      child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      child.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Parents Management</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          👨‍👩‍👧‍👦 Add New Parent
        </Button>
      </div>
      
      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search parents by name, email, or child name..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{parents.length}</p>
              <p className="text-sm text-gray-500">Total Parents</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {parents.filter(p => p.status === 'active').length}
              </p>
              <p className="text-sm text-gray-500">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {parents.reduce((total, parent) => total + parent.children.length, 0)}
              </p>
              <p className="text-sm text-gray-500">Total Children</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {filteredParents.length}
              </p>
              <p className="text-sm text-gray-500">Search Results</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Parents List */}
      <Card>
        <CardHeader>
          <CardTitle>Parents Directory</CardTitle>
          <CardDescription>
            Manage parent accounts and view their children information
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredParents.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
              <h3 className="text-lg font-medium mb-2">No parents found</h3>
              <p className="text-gray-500">
                {searchTerm ? "No parents match your search criteria." : "No parents registered yet."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredParents.map((parent) => (
                <Card key={parent._id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{parent.name}</CardTitle>
                        <CardDescription>{parent.occupation}</CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        {parent.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Contact</p>
                        <p className="text-sm">{parent.email}</p>
                        <p className="text-sm">{parent.phone}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="text-sm">{parent.address}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Emergency Contact</p>
                        <p className="text-sm">{parent.emergencyContact}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Children ({parent.children.length})</p>
                        <div className="space-y-1">
                          {parent.children.map((child) => (
                            <div key={child._id} className="flex justify-between items-center">
                              <span className="text-sm">{child.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {child.class} - {child.rollNumber}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1">
                        📝 Edit
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        👁️ View
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDelete(parent._id)}
                      >
                        🗑️
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-2xl mb-1">📧</span>
              <span className="text-sm">Send Notification</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-2xl mb-1">📊</span>
              <span className="text-sm">Generate Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-2xl mb-1">📤</span>
              <span className="text-sm">Export Data</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-2xl mb-1">📋</span>
              <span className="text-sm">Bulk Actions</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParentsList;
