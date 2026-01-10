import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { ResponsiveTable } from '../../components/ui/responsive-table';

// Mock data for students
const mockStudents = [
  {
    _id: '1',
    name: 'John Doe',
    rollNumber: '101',
    email: 'john.doe@example.com',
    phone: '1234567890',
    classId: { _id: '1', name: '10', section: 'A' },
    parentId: { _id: '1', name: 'Robert Doe', email: 'robert.doe@example.com', phone: '9876543210' }
  },
  {
    _id: '2',
    name: 'Jane Smith',
    rollNumber: '102',
    email: 'jane.smith@example.com',
    phone: '2345678901',
    classId: { _id: '1', name: '10', section: 'A' },
    parentId: { _id: '2', name: 'Sarah Smith', email: 'sarah.smith@example.com', phone: '8765432109' }
  },
  {
    _id: '3',
    name: 'Michael Johnson',
    rollNumber: '103',
    email: 'michael.johnson@example.com',
    phone: '3456789012',
    classId: { _id: '2', name: '10', section: 'B' },
    parentId: { _id: '3', name: 'David Johnson', email: 'david.johnson@example.com', phone: '7654321098' }
  },
  {
    _id: '4',
    name: 'Emily Brown',
    rollNumber: '104',
    email: 'emily.brown@example.com',
    phone: '4567890123',
    classId: { _id: '2', name: '10', section: 'B' },
    parentId: { _id: '4', name: 'James Brown', email: 'james.brown@example.com', phone: '6543210987' }
  },
  {
    _id: '5',
    name: 'William Davis',
    rollNumber: '105',
    email: 'william.davis@example.com',
    phone: '5678901234',
    classId: { _id: '3', name: '9', section: 'A' },
    parentId: { _id: '5', name: 'Richard Davis', email: 'richard.davis@example.com', phone: '5432109876' }
  }
];

// Mock data for classes
const mockClasses = [
  { _id: '1', name: '10', section: 'A' },
  { _id: '2', name: '10', section: 'B' },
  { _id: '3', name: '9', section: 'A' },
  { _id: '4', name: '9', section: 'B' },
  { _id: '5', name: '8', section: 'A' }
];

const Students = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');

  useEffect(() => {
    // In a real app, we would fetch students and classes from the API
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setStudents(mockStudents);
      setClasses(mockClasses);
      setLoading(false);
    }, 500);
  }, []);

  // Filter students based on search term and selected class
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.rollNumber.includes(searchTerm) ||
                          student.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClass = selectedClass ? student.classId._id === selectedClass : true;

    return matchesSearch && matchesClass;
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-responsive-2xl font-bold">Students Management</h1>
        <Button asChild className="mobile-btn-primary">
          <Link to="/admin/students/add">Add New Student</Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="mobile-padding">
          <div className="mobile-form-container">
            <div className="mobile-form-row">
              <div className="mobile-form-group">
                <label htmlFor="search" className="block text-responsive-sm font-medium text-gray-700 mb-1">
                  Search Students
                </label>
                <Input
                  id="search"
                  type="text"
                  placeholder="Search by name, roll number, or email"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="touch-target"
                />
              </div>
              <div className="mobile-form-group">
                <label htmlFor="class-filter" className="block text-responsive-sm font-medium text-gray-700 mb-1">
                  Filter by Class
                </label>
                <select
                  id="class-filter"
                  value={selectedClass}
                  onChange={handleClassChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-responsive-sm p-3 border touch-target"
                >
                  <option value="">All Classes</option>
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      Class {cls.name} - {cls.section}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-center sm:justify-start">
              <Button
                variant="outline"
                onClick={() => { setSearchTerm(''); setSelectedClass(''); }}
                className="mobile-btn-secondary"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <ResponsiveTable
        title="Students List"
        data={filteredStudents}
        columns={[
          {
            key: 'name',
            header: 'Name',
            render: (value, row) => (
              <div>
                <div className="text-sm font-medium text-gray-900">{row.name}</div>
                <div className="text-sm text-gray-500">{row.email}</div>
              </div>
            )
          },
          {
            key: 'rollNumber',
            header: 'Roll Number'
          },
          {
            key: 'classId',
            header: 'Class',
            render: (value, row) => (
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                Class {row.classId.name} - {row.classId.section}
              </span>
            )
          },
          {
            key: 'parentId',
            header: 'Parent',
            render: (value, row) => (
              <div>
                <div className="text-sm text-gray-900">{row.parentId.name}</div>
                <div className="text-sm text-gray-500">{row.parentId.email}</div>
              </div>
            )
          },
          {
            key: 'phone',
            header: 'Contact'
          }
        ]}
        actions={(student) => (
          <>
            <Button asChild variant="outline" size="sm" className="touch-target">
              <Link to={`/admin/students/${student._id}`}>View</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="touch-target">
              <Link to={`/admin/students/${student._id}/edit`}>Edit</Link>
            </Button>
          </>
        )}
        emptyMessage="No students found matching your filters."
      />
    </div>
  );
};

export default Students;
