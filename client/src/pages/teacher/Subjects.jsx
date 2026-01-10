import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

// Mock data for subjects
const mockSubjects = [
  {
    _id: '1',
    name: 'Mathematics',
    code: 'MATH101',
    description: 'Advanced Mathematics covering Algebra, Geometry, and Calculus',
    classes: [
      { _id: '1', name: '10', section: 'A', studentsCount: 35 },
      { _id: '2', name: '9', section: 'B', studentsCount: 32 }
    ],
    totalStudents: 67,
    weeklyHours: 6,
    syllabus: [
      'Algebra and Linear Equations',
      'Geometry and Trigonometry',
      'Statistics and Probability',
      'Calculus Basics'
    ],
    upcomingTopics: [
      'Quadratic Equations',
      'Circle Geometry'
    ]
  },
  {
    _id: '2',
    name: 'Physics',
    code: 'PHY101',
    description: 'Fundamental Physics concepts and practical applications',
    classes: [
      { _id: '1', name: '10', section: 'A', studentsCount: 35 }
    ],
    totalStudents: 35,
    weeklyHours: 4,
    syllabus: [
      'Mechanics and Motion',
      'Heat and Thermodynamics',
      'Light and Optics',
      'Electricity and Magnetism'
    ],
    upcomingTopics: [
      'Wave Motion',
      'Sound Properties'
    ]
  }
];

const Subjects = () => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we would fetch subjects assigned to the teacher from the API
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubjects(mockSubjects);
      setLoading(false);
    }, 500);
  }, []);

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
        <h1 className="text-2xl font-bold">My Subjects</h1>
        <Button className="bg-green-600 hover:bg-green-700">
          📚 View Curriculum
        </Button>
      </div>

      {/* Subjects overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{subjects.length}</p>
              <p className="text-sm text-gray-500">Subjects Teaching</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {subjects.reduce((total, subject) => total + subject.totalStudents, 0)}
              </p>
              <p className="text-sm text-gray-500">Total Students</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">
                {subjects.reduce((total, subject) => total + subject.weeklyHours, 0)}
              </p>
              <p className="text-sm text-gray-500">Weekly Hours</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subjects list */}
      <div className="space-y-6">
        {subjects.length > 0 ? (
          subjects.map((subject) => (
            <Card key={subject._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{subject.name}</CardTitle>
                    <CardDescription>
                      {subject.code} • {subject.weeklyHours} hours/week
                    </CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    {subject.totalStudents} Students
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">{subject.description}</p>
                  
                  {/* Classes teaching */}
                  <div>
                    <h4 className="font-medium mb-2">Classes Teaching:</h4>
                    <div className="flex flex-wrap gap-2">
                      {subject.classes.map((cls) => (
                        <Badge key={cls._id} variant="outline" className="text-sm">
                          Class {cls.name}-{cls.section} ({cls.studentsCount} students)
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Syllabus overview */}
                  <div>
                    <h4 className="font-medium mb-2">Syllabus Overview:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {subject.syllabus.map((topic, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <span className="mr-2">📖</span>
                          {topic}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upcoming topics */}
                  <div>
                    <h4 className="font-medium mb-2">Upcoming Topics:</h4>
                    <div className="flex flex-wrap gap-2">
                      {subject.upcomingTopics.map((topic, index) => (
                        <Badge key={index} className="bg-blue-100 text-blue-800">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2 pt-4">
                    <Button variant="outline" size="sm">
                      📝 Create Assignment
                    </Button>
                    <Button variant="outline" size="sm">
                      📊 View Progress
                    </Button>
                    <Button variant="outline" size="sm">
                      📅 Schedule Exam
                    </Button>
                    <Button variant="outline" size="sm">
                      📚 Manage Syllabus
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-lg font-medium mb-2">No subjects assigned</h3>
              <p className="text-gray-500 mb-4">
                You don't have any subjects assigned yet. Contact the administrator to get subjects assigned.
              </p>
              <Button className="bg-green-600 hover:bg-green-700">
                📞 Contact Admin
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick actions */}
      {subjects.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks for subject management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <span className="text-2xl mb-1">📝</span>
                <span className="text-sm">Create Assignment</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <span className="text-2xl mb-1">📊</span>
                <span className="text-sm">Grade Papers</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <span className="text-2xl mb-1">📅</span>
                <span className="text-sm">Schedule Test</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <span className="text-2xl mb-1">📈</span>
                <span className="text-sm">View Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Subjects;
