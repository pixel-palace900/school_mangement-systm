import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";

const AdminAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  // Mock data
  useEffect(() => {
    const mockAttendance = [
      {
        _id: '1',
        studentId: {
          _id: '1',
          name: 'John Doe',
          rollNumber: 'ST001',
          class: { _id: '1', name: '10', section: 'A' }
        },
        date: '2024-01-15',
        status: 'Present',
        remarks: ''
      },
      {
        _id: '2',
        studentId: {
          _id: '2',
          name: 'Jane Smith',
          rollNumber: 'ST002',
          class: { _id: '1', name: '10', section: 'A' }
        },
        date: '2024-01-15',
        status: 'Absent',
        remarks: 'Sick leave'
      },
      {
        _id: '3',
        studentId: {
          _id: '3',
          name: 'Mike Johnson',
          rollNumber: 'ST003',
          class: { _id: '2', name: '11', section: 'A' }
        },
        date: '2024-01-15',
        status: 'Present',
        remarks: ''
      },
      {
        _id: '4',
        studentId: {
          _id: '1',
          name: 'John Doe',
          rollNumber: 'ST001',
          class: { _id: '1', name: '10', section: 'A' }
        },
        date: '2024-01-16',
        status: 'Absent',
        remarks: 'Family emergency'
      }
    ];

    const mockStudents = [
      { _id: '1', name: 'John Doe', rollNumber: 'ST001', class: { _id: '1', name: '10', section: 'A' } },
      { _id: '2', name: 'Jane Smith', rollNumber: 'ST002', class: { _id: '1', name: '10', section: 'A' } },
      { _id: '3', name: 'Mike Johnson', rollNumber: 'ST003', class: { _id: '2', name: '11', section: 'A' } },
      { _id: '4', name: 'Sarah Wilson', rollNumber: 'ST004', class: { _id: '3', name: '12', section: 'A' } }
    ];

    const mockClasses = [
      { _id: '1', name: '10', section: 'A' },
      { _id: '2', name: '11', section: 'A' },
      { _id: '3', name: '12', section: 'A' }
    ];

    setAttendance(mockAttendance);
    setStudents(mockStudents);
    setClasses(mockClasses);
    setLoading(false);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present': return 'bg-green-100 text-green-800';
      case 'Absent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredAttendance = attendance.filter(record => {
    const matchesSearch = record.studentId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.studentId.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || record.studentId.class._id === selectedClass;
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    
    let matchesDateRange = true;
    if (dateRange.startDate && dateRange.endDate) {
      const recordDate = new Date(record.date);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      matchesDateRange = recordDate >= startDate && recordDate <= endDate;
    }
    
    return matchesSearch && matchesClass && matchesStatus && matchesDateRange;
  });

  const getAttendanceStats = () => {
    const totalRecords = filteredAttendance.length;
    const presentCount = filteredAttendance.filter(record => record.status === 'Present').length;
    const absentCount = filteredAttendance.filter(record => record.status === 'Absent').length;
    const attendanceRate = totalRecords > 0 ? ((presentCount / totalRecords) * 100).toFixed(1) : 0;

    return { totalRecords, presentCount, absentCount, attendanceRate };
  };

  const getClassAttendanceStats = () => {
    const classStats = {};
    
    classes.forEach(cls => {
      const classRecords = filteredAttendance.filter(record => record.studentId.class._id === cls._id);
      const presentCount = classRecords.filter(record => record.status === 'Present').length;
      const totalCount = classRecords.length;
      const rate = totalCount > 0 ? ((presentCount / totalCount) * 100).toFixed(1) : 0;
      
      classStats[cls._id] = {
        className: `${cls.name}-${cls.section}`,
        presentCount,
        totalCount,
        rate
      };
    });
    
    return classStats;
  };

  const exportAttendanceData = () => {
    const csvContent = [
      ['Student Name', 'Roll Number', 'Class', 'Date', 'Status', 'Remarks'].join(','),
      ...filteredAttendance.map(record => [
        record.studentId.name,
        record.studentId.rollNumber,
        `${record.studentId.class.name}-${record.studentId.class.section}`,
        record.date,
        record.status,
        record.remarks || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const stats = getAttendanceStats();
  const classStats = getClassAttendanceStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading attendance data...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📋 Attendance Management</h1>
        <div className="flex gap-2">
          <Button onClick={exportAttendanceData} variant="outline">
            📊 Export Data
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            📝 Take Attendance
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Total Records</p>
                <p className="text-2xl font-bold text-blue-700">{stats.totalRecords}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <span className="text-2xl">📋</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Present</p>
                <p className="text-2xl font-bold text-green-700">{stats.presentCount}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Absent</p>
                <p className="text-2xl font-bold text-red-700">{stats.absentCount}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <span className="text-2xl">❌</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Attendance Rate</p>
                <p className="text-2xl font-bold text-purple-700">{stats.attendanceRate}%</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Class-wise Attendance */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>📚 Class-wise Attendance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.values(classStats).map((stat, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Class {stat.className}</h4>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {stat.presentCount}/{stat.totalCount} Present
                  </span>
                  <Badge className={stat.rate >= 80 ? 'bg-green-100 text-green-800' : stat.rate >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}>
                    {stat.rate}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="search">Search Student</Label>
              <Input
                id="search"
                placeholder="Search by name or roll number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="class">Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classes.map(cls => (
                    <SelectItem key={cls._id} value={cls._id}>
                      Class {cls.name}-{cls.section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Present">Present</SelectItem>
                  <SelectItem value="Absent">Absent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Records */}
      <div className="space-y-4">
        {filteredAttendance.length > 0 ? (
          filteredAttendance.map((record) => (
            <Card key={record._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-medium">{record.studentId.name}</h3>
                      <p className="text-sm text-gray-500">
                        {record.studentId.rollNumber} • Class {record.studentId.class.name}-{record.studentId.class.section}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">{formatDate(record.date)}</p>
                    </div>
                    <div>
                      <Badge className={getStatusColor(record.status)}>
                        {record.status}
                      </Badge>
                    </div>
                    {record.remarks && (
                      <div>
                        <p className="text-sm text-gray-500">Remarks</p>
                        <p className="text-sm">{record.remarks}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      ✏️ Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      👁️ View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium mb-2">No attendance records found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || selectedClass !== 'all' || filterStatus !== 'all' || dateRange.startDate || dateRange.endDate
                  ? "No records match your search criteria."
                  : "Start by taking attendance for your classes."
                }
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                📝 Take Attendance
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminAttendance;
