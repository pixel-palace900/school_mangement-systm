import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import GradeAssignment from '../../components/teacher/GradeAssignment';

// Icons (using emoji placeholders)
const Icons = {
  Search: () => <span className="text-lg">🔍</span>,
  Assignment: () => <span className="text-lg">📝</span>,
  Student: () => <span className="text-lg">👨‍🎓</span>,
  Clock: () => <span className="text-lg">⏰</span>,
  CheckCircle: () => <span className="text-lg">✅</span>,
  AlertCircle: () => <span className="text-lg">⚠️</span>,
  Grade: () => <span className="text-lg">📊</span>,
};

const AssignmentGrading = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'pending', 'graded'
  const [showGradingModal, setShowGradingModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Mock data for assignments and submissions
        const mockAssignments = [
          {
            _id: '1',
            title: 'Math Problem Set 1',
            subject: 'Mathematics',
            dueDate: '2024-01-15',
            maxMarks: 100,
            description: 'Solve the given algebraic equations and show your work.',
            classId: { name: '10', section: 'A' }
          },
          {
            _id: '2',
            title: 'Science Lab Report',
            subject: 'Physics',
            dueDate: '2024-01-20',
            maxMarks: 50,
            description: 'Write a detailed lab report on the pendulum experiment.',
            classId: { name: '10', section: 'B' }
          }
        ];

        const mockSubmissions = [
          {
            _id: 'sub1',
            assignmentId: '1',
            student: { _id: 'st1', name: 'John Doe', rollNumber: '101' },
            submissionText: 'Here are my solutions to the algebraic equations:\n\n1. x + 5 = 10\n   x = 10 - 5\n   x = 5\n\n2. 2y - 3 = 7\n   2y = 7 + 3\n   2y = 10\n   y = 5',
            submittedAt: '2024-01-14T10:30:00Z',
            attachments: [
              {
                fileName: 'math_solutions.pdf',
                fileUrl: '#',
                fileType: 'application/pdf',
                fileSize: 245760
              }
            ],
            grade: null
          },
          {
            _id: 'sub2',
            assignmentId: '1',
            student: { _id: 'st2', name: 'Jane Smith', rollNumber: '102' },
            submissionText: 'My approach to solving these equations...',
            submittedAt: '2024-01-13T15:45:00Z',
            attachments: [],
            grade: {
              marks: 85,
              feedback: 'Good work! Your solutions are correct, but you could show more detailed steps.',
              gradedAt: '2024-01-15T09:00:00Z'
            }
          },
          {
            _id: 'sub3',
            assignmentId: '2',
            student: { _id: 'st3', name: 'Mike Johnson', rollNumber: '201' },
            submissionText: 'Lab Report: Pendulum Experiment\n\nObjective: To study the motion of a simple pendulum...',
            submittedAt: '2024-01-19T14:20:00Z',
            attachments: [
              {
                fileName: 'lab_data.xlsx',
                fileUrl: '#',
                fileType: 'application/vnd.ms-excel',
                fileSize: 15360
              }
            ],
            grade: null
          }
        ];

        setAssignments(mockAssignments);
        setSubmissions(mockSubmissions);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getSubmissionsForAssignment = (assignmentId) => {
    return submissions.filter(sub => sub.assignmentId === assignmentId);
  };

  const getSubmissionStats = (assignmentId) => {
    const assignmentSubmissions = getSubmissionsForAssignment(assignmentId);
    const total = assignmentSubmissions.length;
    const graded = assignmentSubmissions.filter(sub => sub.grade).length;
    const pending = total - graded;
    
    return { total, graded, pending };
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.student.rollNumber.includes(searchTerm);
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'graded' && submission.grade) ||
                         (filterStatus === 'pending' && !submission.grade);
    
    return matchesSearch && matchesFilter;
  });

  const handleGradeSubmission = (submission, assignment) => {
    setSelectedSubmission(submission);
    setSelectedAssignment(assignment);
    setShowGradingModal(true);
  };

  const handleGradeSubmitted = (gradeData) => {
    // Update the submission with the new grade
    setSubmissions(prev => prev.map(sub => 
      sub._id === selectedSubmission._id 
        ? { ...sub, grade: { ...gradeData, gradedAt: new Date().toISOString() } }
        : sub
    ));
    
    setShowGradingModal(false);
    setSelectedSubmission(null);
    setSelectedAssignment(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Assignment Grading</h1>
        <div className="text-sm text-gray-500">
          Welcome, {user?.name}!
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Assignments</p>
                <p className="text-2xl font-bold text-blue-600">{assignments.length}</p>
              </div>
              <Icons.Assignment />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Graded</p>
                <p className="text-2xl font-bold text-green-600">
                  {submissions.filter(sub => sub.grade).length}
                </p>
              </div>
              <Icons.CheckCircle />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-red-600">
                  {submissions.filter(sub => !sub.grade).length}
                </p>
              </div>
              <Icons.AlertCircle />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Submissions</p>
                <p className="text-2xl font-bold text-purple-600">{submissions.length}</p>
              </div>
              <Icons.Student />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Icons.Search />
                <Input
                  placeholder="Search by student name or roll number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Submissions</option>
                <option value="pending">Pending Grading</option>
                <option value="graded">Already Graded</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assignments Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {assignments.map((assignment) => {
          const stats = getSubmissionStats(assignment._id);
          return (
            <Card key={assignment._id} className="border-l-4 border-l-indigo-500">
              <CardHeader>
                <CardTitle className="text-lg">{assignment.title}</CardTitle>
                <CardDescription>
                  {assignment.subject} • Class {assignment.classId.name} {assignment.classId.section} • Max Marks: {assignment.maxMarks}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                    <p className="text-xs text-gray-500">Total</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{stats.graded}</p>
                    <p className="text-xs text-gray-500">Graded</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">{stats.pending}</p>
                    <p className="text-xs text-gray-500">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Submissions List */}
      <Card>
        <CardHeader>
          <CardTitle>Submissions to Grade</CardTitle>
          <CardDescription>
            Click on any submission to start grading
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredSubmissions.map((submission) => {
              const assignment = assignments.find(a => a._id === submission.assignmentId);
              return (
                <div 
                  key={submission._id}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleGradeSubmission(submission, assignment)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{submission.student.name}</h4>
                        <span className="text-sm text-gray-500">({submission.student.rollNumber})</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          submission.grade 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {submission.grade ? 'Graded' : 'Pending'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Assignment:</strong> {assignment?.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        Submitted: {new Date(submission.submittedAt).toLocaleString()}
                      </p>
                      {submission.grade && (
                        <p className="text-sm text-green-600 mt-1">
                          <strong>Grade:</strong> {submission.grade.marks}/{assignment?.maxMarks}
                        </p>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      {submission.grade ? 'Review Grade' : 'Grade Now'}
                    </Button>
                  </div>
                </div>
              );
            })}
            
            {filteredSubmissions.length === 0 && (
              <div className="text-center py-8">
                <Icons.Grade />
                <h3 className="text-lg font-medium text-gray-700 mt-2">No submissions found</h3>
                <p className="text-gray-500">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'No submissions available for grading at the moment.'
                  }
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Grading Modal */}
      {showGradingModal && selectedSubmission && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Grade Assignment</h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowGradingModal(false)}
                >
                  ✕
                </Button>
              </div>
              <GradeAssignment 
                submission={selectedSubmission}
                assignment={selectedAssignment}
                onGradeSubmitted={handleGradeSubmitted}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentGrading;
