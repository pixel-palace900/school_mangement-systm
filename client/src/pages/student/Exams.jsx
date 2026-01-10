import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import * as studentApi from '../../api/student';

// Icons (using emoji placeholders)
const Icons = {
  BookOpen: () => <span className="text-2xl">📚</span>,
  Calendar: () => <span className="text-xl">📅</span>,
  Clock: () => <span className="text-xl">🕒</span>,
  MapPin: () => <span className="text-xl">📍</span>,
  Award: () => <span className="text-xl">🏆</span>,
  FileText: () => <span className="text-xl">📄</span>,
  CheckCircle: () => <span className="text-xl">✅</span>,
  AlertCircle: () => <span className="text-xl">⚠️</span>,
};

const Exams = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);

        // In a production environment, we would use the API call
        // For now, we'll use mock data
        const examsResponse = studentApi.getMockExams();
        setExams(examsResponse.data);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching exams:', error);
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A+': return 'text-green-600 bg-green-50 border-green-200';
      case 'A': return 'text-green-600 bg-green-50 border-green-200';
      case 'B+': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'B': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'C+': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'C': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'D': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'F': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const isExamSoon = (examDate) => {
    const today = new Date();
    const exam = new Date(examDate);
    const diffTime = exam - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Icons.BookOpen />
        <div className="ml-3">
          <h1 className="text-2xl font-bold">Exams</h1>
          <p className="text-gray-600">View your upcoming exams and past exam results.</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'upcoming'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icons.AlertCircle />
              <span className="ml-2">Upcoming Exams ({exams?.upcoming?.length || 0})</span>
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'past'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icons.CheckCircle />
              <span className="ml-2">Past Results ({exams?.past?.length || 0})</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Upcoming Exams */}
      {activeTab === 'upcoming' && (
        <div className="space-y-6">
          {exams?.upcoming?.map((exam) => (
            <Card key={exam._id} className={`${isExamSoon(exam.date) ? 'border-orange-200 bg-orange-50' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center">
                      <Icons.FileText />
                      <span className="ml-2">{exam.title}</span>
                      {isExamSoon(exam.date) && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          <Icons.AlertCircle />
                          <span className="ml-1">Soon</span>
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription className="text-lg font-medium text-indigo-600">
                      {exam.subject}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Max Marks</p>
                    <p className="text-xl font-bold text-gray-900">{exam.maxMarks}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <Icons.Calendar />
                    <div className="ml-3">
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">{formatDate(exam.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Icons.Clock />
                    <div className="ml-3">
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="font-medium">{exam.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Icons.MapPin />
                    <div className="ml-3">
                      <p className="text-sm text-gray-500">Venue</p>
                      <p className="font-medium">{exam.venue}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {(!exams?.upcoming || exams.upcoming.length === 0) && (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <Icons.CheckCircle />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming exams</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    You don't have any upcoming exams scheduled.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Past Exam Results */}
      {activeTab === 'past' && (
        <div className="space-y-6">
          {exams?.past?.map((exam) => (
            <Card key={exam._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center">
                      <Icons.Award />
                      <span className="ml-2">{exam.title}</span>
                    </CardTitle>
                    <CardDescription className="text-lg font-medium text-indigo-600">
                      {exam.subject}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getGradeColor(exam.grade)}`}>
                      {exam.grade}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <Icons.Calendar />
                    <div className="ml-3">
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">{formatDate(exam.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Icons.Award />
                    <div className="ml-3">
                      <p className="text-sm text-gray-500">Marks Obtained</p>
                      <p className="font-medium">
                        <span className="text-lg font-bold text-indigo-600">{exam.marks}</span>
                        <span className="text-gray-500">/{exam.maxMarks}</span>
                        <span className="ml-2 text-sm text-gray-400">
                          ({Math.round((exam.marks / exam.maxMarks) * 100)}%)
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Icons.FileText />
                    <div className="ml-3">
                      <p className="text-sm text-gray-500">Grade</p>
                      <p className="font-medium">{exam.grade}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {(!exams?.past || exams.past.length === 0) && (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <Icons.FileText />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No past exam results</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Your past exam results will appear here once available.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default Exams;