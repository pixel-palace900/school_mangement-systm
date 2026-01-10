import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

// Mock data for exams
const mockExams = [
  {
    _id: '1',
    title: 'Mid-Term Examination',
    subject: 'Mathematics',
    class: { _id: '1', name: '10', section: 'A' },
    date: '2024-02-15',
    time: '09:00 AM - 12:00 PM',
    duration: '3 hours',
    maxMarks: 100,
    status: 'upcoming',
    description: 'Mid-term examination covering chapters 1-5'
  },
  {
    _id: '2',
    title: 'Unit Test 2',
    subject: 'Mathematics',
    class: { _id: '2', name: '9', section: 'B' },
    date: '2024-02-20',
    time: '10:00 AM - 11:30 AM',
    duration: '1.5 hours',
    maxMarks: 50,
    status: 'upcoming',
    description: 'Unit test on Algebra and Geometry'
  },
  {
    _id: '3',
    title: 'Final Examination',
    subject: 'Mathematics',
    class: { _id: '1', name: '10', section: 'A' },
    date: '2024-01-20',
    time: '09:00 AM - 12:00 PM',
    duration: '3 hours',
    maxMarks: 100,
    status: 'completed',
    description: 'Final examination for the semester'
  }
];

const Exams = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, completed

  useEffect(() => {
    // In a real app, we would fetch exams from the API
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setExams(mockExams);
      setLoading(false);
    }, 500);
  }, []);

  const filteredExams = exams.filter(exam => {
    if (filter === 'all') return true;
    return exam.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'ongoing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
        <h1 className="text-2xl font-bold">Exams</h1>
        <Button className="bg-green-600 hover:bg-green-700">
          📝 Create New Exam
        </Button>
      </div>

      {/* Filter buttons */}
      <div className="flex space-x-2 mb-6">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'bg-green-600 hover:bg-green-700' : ''}
        >
          All Exams
        </Button>
        <Button
          variant={filter === 'upcoming' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('upcoming')}
          className={filter === 'upcoming' ? 'bg-blue-600 hover:bg-blue-700' : ''}
        >
          Upcoming
        </Button>
        <Button
          variant={filter === 'completed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('completed')}
          className={filter === 'completed' ? 'bg-green-600 hover:bg-green-700' : ''}
        >
          Completed
        </Button>
      </div>

      {/* Exams list */}
      <div className="space-y-4">
        {filteredExams.length > 0 ? (
          filteredExams.map((exam) => (
            <Card key={exam._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{exam.title}</CardTitle>
                    <CardDescription>
                      {exam.subject} • Class {exam.class.name}-{exam.class.section}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(exam.status)}>
                    {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{formatDate(exam.date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium">{exam.time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">{exam.duration}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Max Marks</p>
                    <p className="font-medium">{exam.maxMarks}</p>
                  </div>
                </div>
                
                {exam.description && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="text-sm">{exam.description}</p>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    📝 Edit Exam
                  </Button>
                  {exam.status === 'completed' && (
                    <Button variant="outline" size="sm">
                      📊 View Results
                    </Button>
                  )}
                  {exam.status === 'upcoming' && (
                    <Button variant="outline" size="sm">
                      👥 View Students
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-lg font-medium mb-2">No exams found</h3>
              <p className="text-gray-500 mb-4">
                {filter === 'all' 
                  ? "You haven't created any exams yet."
                  : `No ${filter} exams found.`
                }
              </p>
              <Button className="bg-green-600 hover:bg-green-700">
                📝 Create Your First Exam
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Exams;
