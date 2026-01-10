import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";

// Mock data for students
const mockStudents = [
  {
    _id: '1',
    name: 'John Smith',
    rollNumber: 'ST001',
    email: 'john.smith@school.edu',
    phone: '+1234567890',
    classId: { _id: '1', name: '10', section: 'A' },
    parentName: 'Robert Smith',
    parentPhone: '+1234567891',
    attendancePercentage: 95,
    lastAttendance: '2024-01-15',
    status: 'active'
  },
  {
    _id: '2',
    name: 'Emily Johnson',
    rollNumber: 'ST002',
    email: 'emily.johnson@school.edu',
    phone: '+1234567892',
    classId: { _id: '1', name: '10', section: 'A' },
    parentName: 'Michael Johnson',
    parentPhone: '+1234567893',
    attendancePercentage: 88,
    lastAttendance: '2024-01-15',
    status: 'active'
  },
  {
    _id: '3',
    name: 'David Wilson',
    rollNumber: 'ST003',
    email: 'david.wilson@school.edu',
    phone: '+1234567894',
    classId: { _id: '2', name: '9', section: 'B' },
    parentName: 'Sarah Wilson',
    parentPhone: '+1234567895',
    attendancePercentage: 92,
    lastAttendance: '2024-01-14',
    status: 'active'
  },
  {
    _id: '4',
    name: 'Lisa Brown',
    rollNumber: 'ST004',
    email: 'lisa.brown@school.edu',
    phone: '+1234567896',
    classId: { _id: '2', name: '9', section: 'B' },
    parentName: 'James Brown',
    parentPhone: '+1234567897',
    attendancePercentage: 78,
    lastAttendance: '2024-01-12',
    status: 'active'
  }
];

const mockClasses = [
  { _id: '1', name: '10', section: 'A' },
  { _id: '2', name: '9', section: 'B' }
];

const Students = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');

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

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || student.classId._id === selectedClass;
    return matchesSearch && matchesClass;
  });

  const getAttendanceColor = (percentage) => {
    if (percentage >= 90) return 'bg-green-100 text-green-800';
    if (percentage >= 75) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Students</h1>
        <Button className="bg-green-600 hover:bg-green-700">
          👥 View All Classes
        </Button>
      </div>

      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search students by name or roll number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="sm:w-48">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Classes</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                Class {cls.name}-{cls.section}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <Card key={student._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{student.name}</CardTitle>
                    <CardDescription>
                      Roll No: {student.rollNumber}
                    </CardDescription>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">
                    {student.classId.name}-{student.classId.section}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="text-sm">{student.email}</p>
                    <p className="text-sm">{student.phone}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Parent Contact</p>
                    <p className="text-sm">{student.parentName}</p>
                    <p className="text-sm">{student.parentPhone}</p>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Attendance</span>
                    <Badge className={getAttendanceColor(student.attendancePercentage)}>
                      {student.attendancePercentage}%
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Last Attendance</p>
                    <p className="text-sm">
                      {new Date(student.lastAttendance).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    📊 View Profile
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    📝 Grades
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-lg font-medium mb-2">No students found</h3>
                <p className="text-gray-500">
                  {searchTerm || selectedClass !== 'all' 
                    ? "No students match your search criteria."
                    : "No students assigned to your classes yet."
                  }
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Summary stats */}
      {filteredStudents.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Class Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{filteredStudents.length}</p>
                <p className="text-sm text-gray-500">Total Students</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(filteredStudents.reduce((acc, s) => acc + s.attendancePercentage, 0) / filteredStudents.length)}%
                </p>
                <p className="text-sm text-gray-500">Avg Attendance</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {filteredStudents.filter(s => s.attendancePercentage >= 90).length}
                </p>
                <p className="text-sm text-gray-500">Excellent (≥90%)</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {filteredStudents.filter(s => s.attendancePercentage < 75).length}
                </p>
                <p className="text-sm text-gray-500">Below 75%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Students;
