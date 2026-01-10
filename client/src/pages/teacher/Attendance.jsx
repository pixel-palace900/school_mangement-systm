import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

// Mock data for classes
const mockClasses = [
  { _id: '1', name: '10', section: 'A', studentsCount: 35 },
  { _id: '2', name: '9', section: 'B', studentsCount: 32 }
];

// Mock data for students
const mockStudents = [
  { _id: '1', name: 'John Doe', rollNumber: '101', classId: { _id: '1', name: '10', section: 'A' } },
  { _id: '2', name: 'Jane Smith', rollNumber: '102', classId: { _id: '1', name: '10', section: 'A' } },
  { _id: '3', name: 'Michael Johnson', rollNumber: '103', classId: { _id: '1', name: '10', section: 'A' } },
  { _id: '4', name: 'Emily Brown', rollNumber: '104', classId: { _id: '1', name: '10', section: 'A' } },
  { _id: '5', name: 'William Davis', rollNumber: '105', classId: { _id: '2', name: '9', section: 'B' } },
  { _id: '6', name: 'Sarah Wilson', rollNumber: '106', classId: { _id: '2', name: '9', section: 'B' } },
  { _id: '7', name: 'James Taylor', rollNumber: '107', classId: { _id: '2', name: '9', section: 'B' } }
];

// Mock attendance data
const mockAttendanceRecords = [
  { 
    date: '2023-06-05', 
    classId: '1', 
    records: [
      { studentId: '1', status: 'present' },
      { studentId: '2', status: 'present' },
      { studentId: '3', status: 'absent', remarks: 'Sick leave' },
      { studentId: '4', status: 'present' }
    ]
  },
  { 
    date: '2023-06-05', 
    classId: '2', 
    records: [
      { studentId: '5', status: 'present' },
      { studentId: '6', status: 'present' },
      { studentId: '7', status: 'absent', remarks: 'Family emergency' }
    ]
  }
];

const Attendance = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // In a real app, we would fetch classes assigned to the teacher from the API
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setClasses(mockClasses);
      if (mockClasses.length > 0) {
        setSelectedClass(mockClasses[0]._id);
      }
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    if (selectedClass) {
      // In a real app, we would fetch students for the selected class from the API
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        const filteredStudents = mockStudents.filter(
          student => student.classId._id === selectedClass
        );
        setStudents(filteredStudents);
        
        // Initialize attendance records
        const initialRecords = {};
        filteredStudents.forEach(student => {
          initialRecords[student._id] = { status: 'present', remarks: '' };
        });
        setAttendanceRecords(initialRecords);
        
        setLoading(false);
      }, 500);
    }
  }, [selectedClass]);

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  const handleDateChange = (e) => {
    setAttendanceDate(e.target.value);
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], status }
    }));
  };

  const handleRemarksChange = (studentId, remarks) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], remarks }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedClass || !attendanceDate) {
      alert('Please select a class and date');
      return;
    }
    
    setSubmitting(true);
    
    try {
      // In a real app, we would send the attendance data to the API
      console.log('Submitting attendance:', {
        classId: selectedClass,
        date: attendanceDate,
        records: Object.entries(attendanceRecords).map(([studentId, record]) => ({
          studentId,
          ...record
        }))
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Attendance submitted successfully');
    } catch (error) {
      console.error('Error submitting attendance:', error);
      alert('Failed to submit attendance');
    } finally {
      setSubmitting(false);
    }
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
      <h1 className="text-2xl font-bold mb-6">Attendance Management</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Mark Attendance</CardTitle>
          <CardDescription>
            Select class and date to mark attendance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="class-select" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Class
                </label>
                <select
                  id="class-select"
                  value={selectedClass || ''}
                  onChange={handleClassChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                  required
                >
                  <option value="">Select Class</option>
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      Class {cls.name} - {cls.section}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="attendance-date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  id="attendance-date"
                  value={attendanceDate}
                  onChange={handleDateChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                  required
                />
              </div>
            </div>
            
            {students.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Roll No.
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Remarks
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => (
                      <tr key={student._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.rollNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {student.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <label className="inline-flex items-center">
                              <input
                                type="radio"
                                name={`status-${student._id}`}
                                value="present"
                                checked={attendanceRecords[student._id]?.status === 'present'}
                                onChange={() => handleStatusChange(student._id, 'present')}
                                className="form-radio h-4 w-4 text-green-600"
                              />
                              <span className="ml-2 text-sm text-gray-700">Present</span>
                            </label>
                            <label className="inline-flex items-center">
                              <input
                                type="radio"
                                name={`status-${student._id}`}
                                value="absent"
                                checked={attendanceRecords[student._id]?.status === 'absent'}
                                onChange={() => handleStatusChange(student._id, 'absent')}
                                className="form-radio h-4 w-4 text-red-600"
                              />
                              <span className="ml-2 text-sm text-gray-700">Absent</span>
                            </label>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            placeholder="Remarks (optional)"
                            value={attendanceRecords[student._id]?.remarks || ''}
                            onChange={(e) => handleRemarksChange(student._id, e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-1 border"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center py-4 text-gray-500">
                {selectedClass ? 'No students found in this class' : 'Please select a class to view students'}
              </p>
            )}
            
            {students.length > 0 && (
              <div className="mt-6 flex justify-end">
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <span className="mr-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      </span>
                      Submitting...
                    </>
                  ) : (
                    'Submit Attendance'
                  )}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
          <CardDescription>
            View previously marked attendance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center py-4 text-gray-500">
            Attendance history will be displayed here
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Attendance;
