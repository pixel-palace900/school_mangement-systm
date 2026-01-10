import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

// Icons (using emoji placeholders)
const Icons = {
  Search: () => <span className="text-lg">🔍</span>,
  Grade: () => <span className="text-lg">📊</span>,
  Student: () => <span className="text-lg">👨‍🎓</span>,
  Class: () => <span className="text-lg">🏫</span>,
  Subject: () => <span className="text-lg">📚</span>,
  Trophy: () => <span className="text-lg">🏆</span>,
  TrendingUp: () => <span className="text-lg">📈</span>,
  TrendingDown: () => <span className="text-lg">📉</span>,
  Filter: () => <span className="text-lg">🔽</span>,
};

const GradeManagement = () => {
  const { user } = useAuth();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedTerm, setSelectedTerm] = useState('current');
  const [viewMode, setViewMode] = useState('overview'); // 'overview', 'detailed', 'analytics'

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        setLoading(true);
        
        // Mock data for grade management
        const mockGrades = [
          {
            _id: 'g1',
            student: { _id: 'st1', name: 'John Doe', rollNumber: '101' },
            class: { name: '10', section: 'A' },
            subject: 'Mathematics',
            term: 'Term 1',
            assignment: 'Mid-term Exam',
            marks: 85,
            maxMarks: 100,
            grade: 'A',
            percentage: 85,
            teacher: { name: 'Ms. Johnson' },
            date: '2024-01-15'
          },
          {
            _id: 'g2',
            student: { _id: 'st1', name: 'John Doe', rollNumber: '101' },
            class: { name: '10', section: 'A' },
            subject: 'Physics',
            term: 'Term 1',
            assignment: 'Lab Test',
            marks: 78,
            maxMarks: 100,
            grade: 'B+',
            percentage: 78,
            teacher: { name: 'Mr. Smith' },
            date: '2024-01-12'
          },
          {
            _id: 'g3',
            student: { _id: 'st2', name: 'Jane Smith', rollNumber: '102' },
            class: { name: '10', section: 'A' },
            subject: 'Mathematics',
            term: 'Term 1',
            assignment: 'Mid-term Exam',
            marks: 92,
            maxMarks: 100,
            grade: 'A+',
            percentage: 92,
            teacher: { name: 'Ms. Johnson' },
            date: '2024-01-15'
          },
          {
            _id: 'g4',
            student: { _id: 'st3', name: 'Mike Johnson', rollNumber: '201' },
            class: { name: '10', section: 'B' },
            subject: 'Chemistry',
            term: 'Term 1',
            assignment: 'Unit Test',
            marks: 88,
            maxMarks: 100,
            grade: 'A',
            percentage: 88,
            teacher: { name: 'Dr. Brown' },
            date: '2024-01-10'
          }
        ];

        setGrades(mockGrades);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching grades:', error);
        setLoading(false);
      }
    };

    fetchGrades();
  }, []);

  // Helper functions
  const getUniqueClasses = () => {
    const classes = [...new Set(grades.map(grade => `${grade.class.name} ${grade.class.section}`))];
    return classes.sort();
  };

  const getUniqueSubjects = () => {
    const subjects = [...new Set(grades.map(grade => grade.subject))];
    return subjects.sort();
  };

  const filteredGrades = grades.filter(grade => {
    const matchesSearch = grade.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grade.student.rollNumber.includes(searchTerm) ||
                         grade.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = selectedClass === 'all' || 
                        `${grade.class.name} ${grade.class.section}` === selectedClass;
    
    const matchesSubject = selectedSubject === 'all' || grade.subject === selectedSubject;
    
    const matchesTerm = selectedTerm === 'all' || grade.term === selectedTerm;
    
    return matchesSearch && matchesClass && matchesSubject && matchesTerm;
  });

  // Analytics calculations
  const getClassAnalytics = () => {
    const classStats = {};
    grades.forEach(grade => {
      const classKey = `${grade.class.name} ${grade.class.section}`;
      if (!classStats[classKey]) {
        classStats[classKey] = { total: 0, sum: 0, count: 0 };
      }
      classStats[classKey].sum += grade.percentage;
      classStats[classKey].count += 1;
      classStats[classKey].average = classStats[classKey].sum / classStats[classKey].count;
    });
    return classStats;
  };

  const getSubjectAnalytics = () => {
    const subjectStats = {};
    grades.forEach(grade => {
      if (!subjectStats[grade.subject]) {
        subjectStats[grade.subject] = { sum: 0, count: 0 };
      }
      subjectStats[grade.subject].sum += grade.percentage;
      subjectStats[grade.subject].count += 1;
      subjectStats[grade.subject].average = subjectStats[grade.subject].sum / subjectStats[grade.subject].count;
    });
    return subjectStats;
  };

  const getTopPerformers = () => {
    const studentStats = {};
    grades.forEach(grade => {
      const studentKey = grade.student._id;
      if (!studentStats[studentKey]) {
        studentStats[studentKey] = {
          student: grade.student,
          class: grade.class,
          sum: 0,
          count: 0
        };
      }
      studentStats[studentKey].sum += grade.percentage;
      studentStats[studentKey].count += 1;
      studentStats[studentKey].average = studentStats[studentKey].sum / studentStats[studentKey].count;
    });

    return Object.values(studentStats)
      .sort((a, b) => b.average - a.average)
      .slice(0, 5);
  };

  const getGradeDistribution = () => {
    const distribution = { 'A+': 0, 'A': 0, 'B+': 0, 'B': 0, 'C+': 0, 'C': 0, 'F': 0 };
    grades.forEach(grade => {
      distribution[grade.grade] = (distribution[grade.grade] || 0) + 1;
    });
    return distribution;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const classAnalytics = getClassAnalytics();
  const subjectAnalytics = getSubjectAnalytics();
  const topPerformers = getTopPerformers();
  const gradeDistribution = getGradeDistribution();
  const overallAverage = grades.length > 0 ? 
    (grades.reduce((sum, grade) => sum + grade.percentage, 0) / grades.length).toFixed(1) : 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Grade Management</h1>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'overview' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('overview')}
          >
            Overview
          </Button>
          <Button
            variant={viewMode === 'detailed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('detailed')}
          >
            Detailed
          </Button>
          <Button
            variant={viewMode === 'analytics' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('analytics')}
          >
            Analytics
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Grades</p>
                <p className="text-2xl font-bold text-blue-600">{grades.length}</p>
              </div>
              <Icons.Grade />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Overall Average</p>
                <p className="text-2xl font-bold text-green-600">{overallAverage}%</p>
              </div>
              <Icons.TrendingUp />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">A+ Grades</p>
                <p className="text-2xl font-bold text-purple-600">{gradeDistribution['A+']}</p>
              </div>
              <Icons.Trophy />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Students Graded</p>
                <p className="text-2xl font-bold text-amber-600">
                  {[...new Set(grades.map(g => g.student._id))].length}
                </p>
              </div>
              <Icons.Student />
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
                  placeholder="Search by student name, roll number, or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Classes</option>
                {getUniqueClasses().map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Subjects</option>
                {getUniqueSubjects().map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
              <select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Terms</option>
                <option value="Term 1">Term 1</option>
                <option value="Term 2">Term 2</option>
                <option value="Term 3">Term 3</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content based on view mode */}
      {viewMode === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.Trophy />
                Top Performers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topPerformers.map((performer, index) => (
                  <div key={performer.student._id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-gray-500">#{index + 1}</span>
                      <div>
                        <p className="font-medium">{performer.student.name}</p>
                        <p className="text-sm text-gray-500">
                          Class {performer.class.name} {performer.class.section} • Roll: {performer.student.rollNumber}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">{performer.average.toFixed(1)}%</p>
                      <p className="text-xs text-gray-500">{performer.count} subjects</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Grade Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.Grade />
                Grade Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(gradeDistribution).map(([grade, count]) => (
                  <div key={grade} className="flex items-center justify-between">
                    <span className="font-medium">{grade}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(count / grades.length) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-8">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {viewMode === 'detailed' && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Grade Records</CardTitle>
            <CardDescription>
              Showing {filteredGrades.length} of {grades.length} grade records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Student</th>
                    <th className="text-left p-2">Class</th>
                    <th className="text-left p-2">Subject</th>
                    <th className="text-left p-2">Assignment</th>
                    <th className="text-left p-2">Marks</th>
                    <th className="text-left p-2">Grade</th>
                    <th className="text-left p-2">Teacher</th>
                    <th className="text-left p-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGrades.map((grade) => (
                    <tr key={grade._id} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <div>
                          <p className="font-medium">{grade.student.name}</p>
                          <p className="text-xs text-gray-500">Roll: {grade.student.rollNumber}</p>
                        </div>
                      </td>
                      <td className="p-2">{grade.class.name} {grade.class.section}</td>
                      <td className="p-2">{grade.subject}</td>
                      <td className="p-2">{grade.assignment}</td>
                      <td className="p-2">
                        <span className="font-medium">{grade.marks}/{grade.maxMarks}</span>
                        <span className="text-xs text-gray-500 ml-1">({grade.percentage}%)</span>
                      </td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          grade.grade === 'A+' || grade.grade === 'A' ? 'bg-green-100 text-green-800' :
                          grade.grade === 'B+' || grade.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                          grade.grade === 'C+' || grade.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {grade.grade}
                        </span>
                      </td>
                      <td className="p-2">{grade.teacher.name}</td>
                      <td className="p-2">{new Date(grade.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {viewMode === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Class Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.Class />
                Class Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(classAnalytics).map(([className, stats]) => (
                  <div key={className} className="p-3 border rounded">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Class {className}</h4>
                      <span className="text-lg font-bold text-blue-600">{stats.average.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${stats.average}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{stats.count} grades recorded</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Subject Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.Subject />
                Subject Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(subjectAnalytics).map(([subject, stats]) => (
                  <div key={subject} className="p-3 border rounded">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{subject}</h4>
                      <span className="text-lg font-bold text-green-600">{stats.average.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${stats.average}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{stats.count} grades recorded</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default GradeManagement;
