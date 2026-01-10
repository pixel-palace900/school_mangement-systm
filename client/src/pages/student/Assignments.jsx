import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useToast } from "../../components/ui/use-toast";
import AssignmentSubmission from '../../components/student/AssignmentSubmission';
import * as studentApi from '../../api/student';

// Icons (using emoji placeholders)
const Icons = {
  Search: () => <span className="text-lg">🔍</span>,
  Download: () => <span className="text-lg">📥</span>,
  Calendar: () => <span className="text-lg">📅</span>,
  Clock: () => <span className="text-lg">⏰</span>,
  File: () => <span className="text-lg">📄</span>,
  CheckCircle: () => <span className="text-lg">✅</span>,
  AlertCircle: () => <span className="text-lg">⚠️</span>,
  Filter: () => <span className="text-lg">🔽</span>,
};

const Assignments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [assignments, setAssignments] = useState({ pending: [], completed: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'completed'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate'); // 'dueDate', 'subject', 'priority'
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);

        // Try to use the real API first, fallback to mock data if it fails
        try {
          const response = await studentApi.getStudentAssignments();
          setAssignments({
            pending: response.data.pending || [],
            completed: response.data.completed || []
          });
        } catch (apiError) {
          console.warn('API error, falling back to mock data:', apiError);
          // Fallback to mock data if API is not available
          const response = studentApi.getMockAssignments();
          setAssignments({
            pending: response.data.pending,
            completed: response.data.completed
          });
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching assignments:', error);
        toast({
          title: "Error",
          description: "Failed to load assignments. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [toast]);

  // Helper functions
  const getUniqueSubjects = () => {
    const allAssignments = [...assignments.pending, ...assignments.completed];
    const subjects = [...new Set(allAssignments.map(assignment => assignment.subject))];
    return subjects.sort();
  };

  const filterAndSortAssignments = (assignmentList) => {
    let filtered = assignmentList;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(assignment =>
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by subject
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(assignment => assignment.subject === selectedSubject);
    }

    // Sort assignments
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'subject':
          return a.subject.localeCompare(b.subject);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const getDueDateStatus = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { status: 'overdue', color: 'bg-red-100 text-red-800', text: 'Overdue' };
    if (diffDays === 0) return { status: 'today', color: 'bg-orange-100 text-orange-800', text: 'Due Today' };
    if (diffDays === 1) return { status: 'tomorrow', color: 'bg-yellow-100 text-yellow-800', text: 'Due Tomorrow' };
    if (diffDays <= 3) return { status: 'soon', color: 'bg-amber-100 text-amber-800', text: `Due in ${diffDays} days` };
    return { status: 'normal', color: 'bg-blue-100 text-blue-800', text: `Due in ${diffDays} days` };
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownload = (attachment) => {
    toast({
      title: "Download Started",
      description: `Downloading ${attachment.fileName}...`,
    });
    // In a real app, this would trigger the actual download
  };

  const handleSubmitAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setShowSubmissionModal(true);
  };

  const handleSubmissionComplete = (submissionData) => {
    // Update the assignment in the state to reflect submission
    setAssignments(prev => ({
      pending: prev.pending.filter(a => a._id !== selectedAssignment._id),
      completed: [...prev.completed, { ...selectedAssignment, ...submissionData }]
    }));

    setShowSubmissionModal(false);
    setSelectedAssignment(null);

    toast({
      title: "Assignment Submitted",
      description: "Your assignment has been submitted successfully!",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const currentAssignments = activeTab === 'pending' ? assignments.pending : assignments.completed;
  const filteredAssignments = filterAndSortAssignments(currentAssignments);
  const subjects = getUniqueSubjects();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Assignment Dashboard</h1>
        <div className="text-sm text-gray-500">
          Welcome back, {user?.name}!
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Pending</p>
                <p className="text-2xl font-bold text-blue-600">{assignments.pending.length}</p>
              </div>
              <Icons.Clock />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-green-600">{assignments.completed.length}</p>
              </div>
              <Icons.CheckCircle />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Due Soon</p>
                <p className="text-2xl font-bold text-red-600">
                  {assignments.pending.filter(a => {
                    const days = Math.ceil((new Date(a.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
                    return days <= 3 && days >= 0;
                  }).length}
                </p>
              </div>
              <Icons.AlertCircle />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Average Grade</p>
                <p className="text-2xl font-bold text-amber-600">
                  {assignments.completed.length > 0
                    ? (assignments.completed.reduce((sum, a) => sum + (a.marksObtained || 0), 0) /
                       assignments.completed.reduce((sum, a) => sum + (a.maxMarks || 0), 0) * 100).toFixed(1) + '%'
                    : 'N/A'}
                </p>
              </div>
              <Icons.File />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Controls */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Icons.Search />
                <Input
                  placeholder="Search assignments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="dueDate">Sort by Due Date</option>
                <option value="subject">Sort by Subject</option>
                <option value="priority">Sort by Priority</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('pending')}
            className={`${
              activeTab === 'pending'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
          >
            <Icons.Clock />
            Pending Assignments ({assignments.pending.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`${
              activeTab === 'completed'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
          >
            <Icons.CheckCircle />
            Completed Assignments ({assignments.completed.length})
          </button>
        </nav>
      </div>

      {/* Assignment List */}
      <div className="space-y-6">
        {filteredAssignments.length > 0 ? (
          filteredAssignments.map((assignment) => (
            <Card key={assignment._id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-indigo-500">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{assignment.title}</CardTitle>
                      {assignment.priority && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(assignment.priority)}`}>
                          {assignment.priority.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <CardDescription className="flex items-center gap-4">
                      <span className="font-medium">{assignment.subject}</span>
                      <span className="text-gray-400">•</span>
                      <span>Assigned by {assignment.assignedBy?.name}</span>
                      {assignment.maxMarks && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span>Max Marks: {assignment.maxMarks}</span>
                        </>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {activeTab === 'pending' ? (
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDueDateStatus(assignment.dueDate).color}`}>
                        {getDueDateStatus(assignment.dueDate).text}
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                          Submitted: {new Date(assignment.submittedDate).toLocaleDateString()}
                        </span>
                        {assignment.grade && (
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            assignment.grade === 'A+' || assignment.grade === 'A' ? 'bg-green-100 text-green-800' :
                            assignment.grade === 'B+' || assignment.grade === 'B' || assignment.grade === 'A-' ? 'bg-blue-100 text-blue-800' :
                            assignment.grade === 'C+' || assignment.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {assignment.marksObtained ? `${assignment.marksObtained}/${assignment.maxMarks} (${assignment.grade})` : assignment.grade}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Icons.Calendar />
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 leading-relaxed">{assignment.description}</p>

                {/* Attachments */}
                {assignment.attachments && assignment.attachments.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <Icons.File />
                      Attachments:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {assignment.attachments.map((attachment, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(attachment)}
                          className="text-xs"
                        >
                          <Icons.Download />
                          {attachment.fileName}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Feedback for completed assignments */}
                {activeTab === 'completed' && assignment.feedback && (
                  <div className="bg-blue-50 p-3 rounded-md mb-4">
                    <h4 className="font-medium text-sm mb-1 text-blue-800">Teacher's Feedback:</h4>
                    <p className="text-sm text-blue-700">{assignment.feedback}</p>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    Assigned: {new Date(assignment.assignedDate).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    {activeTab === 'pending' ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSubmitAssignment(assignment)}
                        >
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSubmitAssignment(assignment)}
                        >
                          Submit Assignment
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSubmitAssignment(assignment)}
                      >
                        View Submission
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">
              {activeTab === 'pending' ? '📝' : '✅'}
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-700">
              {activeTab === 'pending'
                ? searchTerm || selectedSubject !== 'all'
                  ? 'No assignments match your search'
                  : 'No pending assignments'
                : searchTerm || selectedSubject !== 'all'
                  ? 'No completed assignments match your search'
                  : 'No completed assignments'
              }
            </h2>
            <p className="text-gray-500 mb-4">
              {activeTab === 'pending'
                ? searchTerm || selectedSubject !== 'all'
                  ? 'Try adjusting your search criteria or filters.'
                  : "You're all caught up! There are no pending assignments."
                : searchTerm || selectedSubject !== 'all'
                  ? 'Try adjusting your search criteria or filters.'
                  : "You haven't completed any assignments yet."
              }
            </p>
            {(searchTerm || selectedSubject !== 'all') && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSubject('all');
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Assignment Submission Modal */}
      {showSubmissionModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Assignment Submission</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowSubmissionModal(false);
                    setSelectedAssignment(null);
                  }}
                >
                  ✕
                </Button>
              </div>
              <AssignmentSubmission
                assignment={selectedAssignment}
                onSubmissionComplete={handleSubmissionComplete}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;
