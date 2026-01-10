import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useToast } from "../../components/ui/use-toast";

// Mock data for exams
const mockExams = [
  { _id: '1', title: 'Mid-Term Exam', subject: 'Mathematics', date: '2023-07-10', maxMarks: 100, passMarks: 35 },
  { _id: '2', title: 'Final Exam', subject: 'Mathematics', date: '2023-12-15', maxMarks: 100, passMarks: 35 },
  { _id: '3', title: 'Unit Test 1', subject: 'Science', date: '2023-06-05', maxMarks: 50, passMarks: 18 },
  { _id: '4', title: 'Unit Test 2', subject: 'Science', date: '2023-08-20', maxMarks: 50, passMarks: 18 },
];

// Mock data for classes
const mockClasses = [
  { _id: '1', name: '10', section: 'A' },
  { _id: '2', name: '9', section: 'B' },
];

// Mock data for students
const mockStudents = [
  { _id: '1', name: 'John Doe', rollNumber: '101', classId: { _id: '1', name: '10', section: 'A' } },
  { _id: '2', name: 'Jane Smith', rollNumber: '102', classId: { _id: '1', name: '10', section: 'A' } },
  { _id: '3', name: 'Michael Johnson', rollNumber: '103', classId: { _id: '1', name: '10', section: 'A' } },
  { _id: '4', name: 'Emily Wilson', rollNumber: '104', classId: { _id: '1', name: '10', section: 'A' } },
  { _id: '5', name: 'Robert Brown', rollNumber: '105', classId: { _id: '1', name: '10', section: 'A' } },
  { _id: '6', name: 'Sarah Davis', rollNumber: '201', classId: { _id: '2', name: '9', section: 'B' } },
  { _id: '7', name: 'David Miller', rollNumber: '202', classId: { _id: '2', name: '9', section: 'B' } },
  { _id: '8', name: 'Jennifer Garcia', rollNumber: '203', classId: { _id: '2', name: '9', section: 'B' } },
];

// Mock data for grades
const mockGrades = [
  { _id: '1', studentId: '1', examId: '1', marksObtained: 85, remarks: 'Good performance' },
  { _id: '2', studentId: '2', examId: '1', marksObtained: 92, remarks: 'Excellent work' },
  { _id: '3', studentId: '3', examId: '1', marksObtained: 78, remarks: 'Can improve' },
  { _id: '4', studentId: '4', examId: '1', marksObtained: 65, remarks: 'Needs more practice' },
  { _id: '5', studentId: '5', examId: '1', marksObtained: 88, remarks: 'Very good' },
  { _id: '6', studentId: '6', examId: '3', marksObtained: 42, remarks: 'Good effort' },
  { _id: '7', studentId: '7', examId: '3', marksObtained: 38, remarks: 'Needs improvement' },
  { _id: '8', studentId: '8', examId: '3', marksObtained: 45, remarks: 'Good work' },
];

const Grades = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [studentGrades, setStudentGrades] = useState({});
  const [remarks, setRemarks] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // In a real app, we would fetch data from the API
        // Simulate API calls with setTimeout
        setTimeout(() => {
          setExams(mockExams);
          setClasses(mockClasses);
          setStudents(mockStudents);
          setGrades(mockGrades);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive"
        });
        setLoading(false);
      }
    };

    loadData();
  }, [toast]);

  // Filter students when class or exam changes
  useEffect(() => {
    if (selectedClass) {
      const studentsInClass = students.filter(
        student => student.classId._id === selectedClass
      );
      setFilteredStudents(studentsInClass);

      // Initialize grades for students
      const initialGrades = {};
      const initialRemarks = {};
      
      studentsInClass.forEach(student => {
        // Find existing grade for this student and exam
        const existingGrade = grades.find(
          grade => grade.studentId === student._id && grade.examId === selectedExam
        );
        
        initialGrades[student._id] = existingGrade ? existingGrade.marksObtained : '';
        initialRemarks[student._id] = existingGrade ? existingGrade.remarks : '';
      });
      
      setStudentGrades(initialGrades);
      setRemarks(initialRemarks);
    } else {
      setFilteredStudents([]);
      setStudentGrades({});
      setRemarks({});
    }
  }, [selectedClass, selectedExam, students, grades]);

  // Handle grade input change
  const handleGradeChange = (studentId, value) => {
    // Validate input (only numbers and up to max marks)
    const selectedExamObj = exams.find(exam => exam._id === selectedExam);
    const maxMarks = selectedExamObj ? selectedExamObj.maxMarks : 100;
    
    // Allow empty string or number up to max marks
    if (value === '' || (Number(value) >= 0 && Number(value) <= maxMarks)) {
      setStudentGrades(prev => ({
        ...prev,
        [studentId]: value
      }));
    }
  };

  // Handle remarks input change
  const handleRemarksChange = (studentId, value) => {
    setRemarks(prev => ({
      ...prev,
      [studentId]: value
    }));
  };

  // Save grades
  const handleSaveGrades = async () => {
    if (!selectedClass || !selectedExam) {
      toast({
        title: "Error",
        description: "Please select both class and exam.",
        variant: "destructive"
      });
      return;
    }

    // Validate all grades are entered
    const invalidGrades = Object.entries(studentGrades).filter(
      ([_, value]) => value === '' || isNaN(Number(value))
    );

    if (invalidGrades.length > 0) {
      toast({
        title: "Error",
        description: "Please enter valid marks for all students.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);

    try {
      // In a real app, we would send data to the API
      // Simulate API call with setTimeout
      setTimeout(() => {
        // Update local grades state
        const updatedGrades = [...grades];
        
        Object.entries(studentGrades).forEach(([studentId, marksObtained]) => {
          const existingGradeIndex = updatedGrades.findIndex(
            grade => grade.studentId === studentId && grade.examId === selectedExam
          );
          
          if (existingGradeIndex !== -1) {
            // Update existing grade
            updatedGrades[existingGradeIndex] = {
              ...updatedGrades[existingGradeIndex],
              marksObtained: Number(marksObtained),
              remarks: remarks[studentId] || ''
            };
          } else {
            // Add new grade
            updatedGrades.push({
              _id: Date.now().toString() + studentId, // Generate a temporary ID
              studentId,
              examId: selectedExam,
              marksObtained: Number(marksObtained),
              remarks: remarks[studentId] || ''
            });
          }
        });
        
        setGrades(updatedGrades);
        
        toast({
          title: "Success",
          description: "Grades saved successfully!",
        });
        
        setIsSaving(false);
      }, 1000);
    } catch (error) {
      console.error('Error saving grades:', error);
      toast({
        title: "Error",
        description: "Failed to save grades. Please try again.",
        variant: "destructive"
      });
      setIsSaving(false);
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
      <h1 className="text-2xl font-bold mb-6">Manage Grades</h1>
      
      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Class and Exam</CardTitle>
          <CardDescription>
            Choose a class and exam to enter or update grades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="class-select">Class</Label>
              <select
                id="class-select"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
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
              <Label htmlFor="exam-select">Exam</Label>
              <select
                id="exam-select"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                disabled={!selectedClass}
              >
                <option value="">Select Exam</option>
                {exams.map((exam) => (
                  <option key={exam._id} value={exam._id}>
                    {exam.title} - {exam.subject} ({new Date(exam.date).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Grades Entry Form */}
      {selectedClass && selectedExam && (
        <Card>
          <CardHeader>
            <CardTitle>Enter Grades</CardTitle>
            <CardDescription>
              {exams.find(e => e._id === selectedExam)?.title} - 
              {exams.find(e => e._id === selectedExam)?.subject} | 
              Max Marks: {exams.find(e => e._id === selectedExam)?.maxMarks}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredStudents.length === 0 ? (
              <p className="text-center text-gray-500">No students found in this class.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Roll No
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Marks
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Remarks
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStudents.map((student) => (
                      <tr key={student._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{student.rollNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Input
                            type="number"
                            min="0"
                            max={exams.find(e => e._id === selectedExam)?.maxMarks}
                            value={studentGrades[student._id] || ''}
                            onChange={(e) => handleGradeChange(student._id, e.target.value)}
                            className="w-24"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Input
                            type="text"
                            value={remarks[student._id] || ''}
                            onChange={(e) => handleRemarksChange(student._id, e.target.value)}
                            placeholder="Add remarks"
                            className="w-full"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button 
              onClick={handleSaveGrades}
              disabled={isSaving || filteredStudents.length === 0}
            >
              {isSaving ? 'Saving...' : 'Save Grades'}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default Grades;
