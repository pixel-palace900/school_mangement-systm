import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

// Mock data for students
const mockStudents = [
  { 
    _id: '1', 
    name: 'John Doe', 
    rollNumber: '101', 
    email: 'john.doe@example.com',
    phone: '1234567890',
    dateOfBirth: '2005-05-15',
    classId: { _id: '1', name: '10', section: 'A' },
    parentId: { _id: '1', name: 'Robert Doe', email: 'robert.doe@example.com', phone: '9876543210', address: '123 Main St, City' }
  },
  { 
    _id: '2', 
    name: 'Jane Smith', 
    rollNumber: '102', 
    email: 'jane.smith@example.com',
    phone: '2345678901',
    dateOfBirth: '2005-08-22',
    classId: { _id: '1', name: '10', section: 'A' },
    parentId: { _id: '2', name: 'Sarah Smith', email: 'sarah.smith@example.com', phone: '8765432109', address: '456 Oak St, Town' }
  }
];

// Mock attendance data
const mockAttendance = [
  { _id: '1', date: '2023-06-01', status: 'Present' },
  { _id: '2', date: '2023-06-02', status: 'Present' },
  { _id: '3', date: '2023-06-03', status: 'Absent', remarks: 'Sick leave' },
  { _id: '4', date: '2023-06-04', status: 'Present' },
  { _id: '5', date: '2023-06-05', status: 'Present' }
];

// Mock fee data
const mockFees = [
  { _id: '1', amount: 5000, dueDate: '2023-06-15', status: 'paid', paidDate: '2023-06-10' },
  { _id: '2', amount: 2500, dueDate: '2023-07-15', status: 'unpaid' },
  { _id: '3', amount: 1500, dueDate: '2023-08-15', status: 'unpaid' }
];

// Mock exam results
const mockResults = [
  { examId: '1', title: 'Mid-Term Exam', subject: 'Mathematics', date: '2023-05-10', marks: 85, maxMarks: 100, grade: 'A' },
  { examId: '2', title: 'Mid-Term Exam', subject: 'Science', date: '2023-05-12', marks: 78, maxMarks: 100, grade: 'B' },
  { examId: '3', title: 'Mid-Term Exam', subject: 'English', date: '2023-05-14', marks: 92, maxMarks: 100, grade: 'A+' }
];

const StudentDetails = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [fees, setFees] = useState([]);
  const [examResults, setExamResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'attendance', 'fees', 'exams'

  useEffect(() => {
    // In a real app, we would fetch student data from the API
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const foundStudent = mockStudents.find(s => s._id === id);
      if (foundStudent) {
        setStudent(foundStudent);
        setAttendance(mockAttendance);
        setFees(mockFees);
        setExamResults(mockResults);
      }
      setLoading(false);
    }, 500);
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2">Student Not Found</h2>
        <p className="text-gray-500 mb-4">The student you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/admin/students">Back to Students List</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Student Details</h1>
        <div className="space-x-2">
          <Button asChild variant="outline">
            <Link to="/admin/students">Back to List</Link>
          </Button>
          <Button asChild>
            <Link to={`/admin/students/${id}/edit`}>Edit Student</Link>
          </Button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`${
              activeTab === 'profile'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`${
              activeTab === 'attendance'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Attendance
          </button>
          <button
            onClick={() => setActiveTab('fees')}
            className={`${
              activeTab === 'fees'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Fees
          </button>
          <button
            onClick={() => setActiveTab('exams')}
            className={`${
              activeTab === 'exams'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Exam Results
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                  <p className="mt-1">{student.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                  <p className="mt-1">{student.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                  <p className="mt-1">{student.phone || 'Not provided'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
                  <p className="mt-1">{student.dateOfBirth ? formatDate(student.dateOfBirth) : 'Not provided'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Roll Number</h3>
                  <p className="mt-1">{student.rollNumber}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Class</h3>
                  <p className="mt-1">Class {student.classId.name} - {student.classId.section}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Parent Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Parent Name</h3>
                  <p className="mt-1">{student.parentId.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                  <p className="mt-1">{student.parentId.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                  <p className="mt-1">{student.parentId.phone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Address</h3>
                  <p className="mt-1">{student.parentId.address || 'Not provided'}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" size="sm">
                <Link to={`/admin/parents/${student.parentId._id}`}>View Parent Details</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
      
      {activeTab === 'attendance' && (
        <Card>
          <CardHeader>
            <CardTitle>Attendance Records</CardTitle>
            <CardDescription>
              Recent attendance history for {student.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
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
                  {attendance.map((record) => (
                    <tr key={record._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(record.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          record.status === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.remarks || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {attendance.length === 0 && (
              <div className="text-center py-4">
                <p className="text-gray-500">No attendance records found.</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild size="sm">
              <Link to={`/admin/attendance/add?studentId=${id}`}>Add Attendance Record</Link>
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {activeTab === 'fees' && (
        <Card>
          <CardHeader>
            <CardTitle>Fee Records</CardTitle>
            <CardDescription>
              Fee payment history for {student.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paid Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {fees.map((fee) => (
                    <tr key={fee._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(fee.dueDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(fee.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          fee.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {fee.status === 'paid' ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {fee.paidDate ? formatDate(fee.paidDate) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {fee.status === 'unpaid' ? (
                          <Button size="sm">Mark as Paid</Button>
                        ) : (
                          <Button variant="outline" size="sm">Receipt</Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {fees.length === 0 && (
              <div className="text-center py-4">
                <p className="text-gray-500">No fee records found.</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild size="sm">
              <Link to={`/admin/fees/add?studentId=${id}`}>Add Fee Record</Link>
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {activeTab === 'exams' && (
        <Card>
          <CardHeader>
            <CardTitle>Exam Results</CardTitle>
            <CardDescription>
              Academic performance for {student.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Exam
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Marks
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {examResults.map((result) => (
                    <tr key={result.examId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {result.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(result.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result.marks} / {result.maxMarks}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          result.grade === 'A+' || result.grade === 'A' ? 'bg-green-100 text-green-800' : 
                          result.grade === 'B' ? 'bg-blue-100 text-blue-800' : 
                          result.grade === 'C' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {result.grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {examResults.length === 0 && (
              <div className="text-center py-4">
                <p className="text-gray-500">No exam results found.</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild size="sm">
              <Link to={`/admin/exams/results/add?studentId=${id}`}>Add Exam Result</Link>
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default StudentDetails;
