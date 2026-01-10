import api from './axios';

/**
 * Get teacher profile
 * @returns {Promise} - Promise with teacher profile data
 */
export const getTeacherProfile = async () => {
  try {
    const response = await api.get('/teacher/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching teacher profile:', error);
    throw error;
  }
};

/**
 * Get teacher's assignments
 * @returns {Promise} - Promise with assignments data
 */
export const getTeacherAssignments = async () => {
  try {
    const response = await api.get('/assignment/teacher');
    return response.data;
  } catch (error) {
    console.error('Error fetching teacher assignments:', error);
    throw error;
  }
};

/**
 * Create new assignment
 * @param {Object} assignmentData - Assignment data
 * @returns {Promise} - Promise with created assignment
 */
export const createAssignment = async (assignmentData) => {
  try {
    const response = await api.post('/assignment', assignmentData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating assignment:', error);
    throw error;
  }
};

/**
 * Get assignment submissions
 * @param {string} assignmentId - Assignment ID
 * @returns {Promise} - Promise with submissions data
 */
export const getAssignmentSubmissions = async (assignmentId) => {
  try {
    const response = await api.get(`/assignment/${assignmentId}/submissions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching assignment submissions:', error);
    throw error;
  }
};

/**
 * Grade assignment submission
 * @param {string} submissionId - Submission ID
 * @param {Object} gradeData - Grade data (marks, feedback)
 * @returns {Promise} - Promise with grading result
 */
export const gradeSubmission = async (submissionId, gradeData) => {
  try {
    const response = await api.post(`/assignment/submission/${submissionId}/grade`, gradeData);
    return response.data;
  } catch (error) {
    console.error('Error grading submission:', error);
    throw error;
  }
};

/**
 * Get teacher's classes
 * @returns {Promise} - Promise with classes data
 */
export const getTeacherClasses = async () => {
  try {
    const response = await api.get('/teacher/classes');
    return response.data;
  } catch (error) {
    console.error('Error fetching teacher classes:', error);
    throw error;
  }
};

/**
 * Get students in teacher's classes
 * @returns {Promise} - Promise with students data
 */
export const getTeacherStudents = async () => {
  try {
    const response = await api.get('/teacher/students');
    return response.data;
  } catch (error) {
    console.error('Error fetching teacher students:', error);
    throw error;
  }
};

/**
 * Mark attendance
 * @param {Object} attendanceData - Attendance data
 * @returns {Promise} - Promise with attendance result
 */
export const markAttendance = async (attendanceData) => {
  try {
    const response = await api.post('/attendance', attendanceData);
    return response.data;
  } catch (error) {
    console.error('Error marking attendance:', error);
    throw error;
  }
};

/**
 * Get attendance records
 * @param {Object} filters - Filter parameters (classId, date, etc.)
 * @returns {Promise} - Promise with attendance data
 */
export const getAttendanceRecords = async (filters = {}) => {
  try {
    const response = await api.get('/attendance', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    throw error;
  }
};

/**
 * Create circular/announcement
 * @param {Object} circularData - Circular data
 * @returns {Promise} - Promise with created circular
 */
export const createCircular = async (circularData) => {
  try {
    const response = await api.post('/circular', circularData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating circular:', error);
    throw error;
  }
};

/**
 * Get teacher's circulars
 * @returns {Promise} - Promise with circulars data
 */
export const getTeacherCirculars = async () => {
  try {
    const response = await api.get('/circular/teacher');
    return response.data;
  } catch (error) {
    console.error('Error fetching teacher circulars:', error);
    throw error;
  }
};

/**
 * Get teacher's timetable
 * @returns {Promise} - Promise with timetable data
 */
export const getTeacherTimetable = async () => {
  try {
    const response = await api.get('/teacher/timetable');
    return response.data;
  } catch (error) {
    console.error('Error fetching teacher timetable:', error);
    throw error;
  }
};

/**
 * Get teacher's exams
 * @returns {Promise} - Promise with exams data
 */
export const getTeacherExams = async () => {
  try {
    const response = await api.get('/teacher/exams');
    return response.data;
  } catch (error) {
    console.error('Error fetching teacher exams:', error);
    throw error;
  }
};

// Mock data for development
export const getMockTeacherProfile = () => {
  return {
    success: true,
    data: {
      _id: 't1',
      name: 'Ms. Sarah Johnson',
      email: 'sarah.johnson@school.com',
      phone: '555-0123',
      subjectSpecialization: 'Mathematics',
      classAssigned: { _id: 'c1', name: '10', section: 'A' },
      employeeId: 'EMP001',
      department: 'Mathematics',
      qualification: 'M.Sc. Mathematics, B.Ed.',
      experience: '8 years',
      joiningDate: '2016-06-15'
    }
  };
};

export const getMockTeacherClasses = () => {
  return {
    success: true,
    data: [
      {
        _id: 'c1',
        name: '10',
        section: 'A',
        studentsCount: 35,
        subjects: ['Mathematics', 'Physics'],
        classTeacher: true
      },
      {
        _id: 'c2',
        name: '10',
        section: 'B',
        studentsCount: 32,
        subjects: ['Mathematics'],
        classTeacher: false
      }
    ]
  };
};

export const getMockTeacherAssignments = () => {
  return {
    success: true,
    data: [
      {
        _id: 'a1',
        title: 'Quadratic Equations Practice',
        subject: 'Mathematics',
        classId: { name: '10', section: 'A' },
        dueDate: '2024-01-25',
        maxMarks: 50,
        submissionsCount: 28,
        gradedCount: 15,
        pendingCount: 13
      },
      {
        _id: 'a2',
        title: 'Trigonometry Problems',
        subject: 'Mathematics',
        classId: { name: '10', section: 'B' },
        dueDate: '2024-01-30',
        maxMarks: 40,
        submissionsCount: 25,
        gradedCount: 25,
        pendingCount: 0
      }
    ]
  };
};

export const getMockAssignmentSubmissions = (assignmentId) => {
  const submissions = {
    'a1': [
      {
        _id: 's1',
        student: { _id: 'st1', name: 'John Doe', rollNumber: '101' },
        submissionText: 'Here are my solutions to the quadratic equations...',
        submittedAt: '2024-01-20T10:30:00Z',
        attachments: [
          {
            fileName: 'solutions.pdf',
            fileUrl: '#',
            fileType: 'application/pdf',
            fileSize: 245760
          }
        ],
        grade: null
      },
      {
        _id: 's2',
        student: { _id: 'st2', name: 'Jane Smith', rollNumber: '102' },
        submissionText: 'My approach to solving these problems...',
        submittedAt: '2024-01-19T15:45:00Z',
        attachments: [],
        grade: {
          marks: 42,
          feedback: 'Good work! Your solutions are mostly correct.',
          gradedAt: '2024-01-22T09:00:00Z'
        }
      }
    ]
  };

  return {
    success: true,
    data: submissions[assignmentId] || []
  };
};

export const getMockTeacherTimetable = () => {
  return {
    success: true,
    data: [
      {
        day: 'Monday',
        periods: [
          { period: 1, time: '8:00-9:00', subject: 'Mathematics', class: '10A', room: 'Room 101' },
          { period: 2, time: '9:00-10:00', subject: 'Mathematics', class: '10B', room: 'Room 102' },
          { period: 4, time: '11:15-12:15', subject: 'Mathematics', class: '10A', room: 'Room 101' }
        ]
      },
      {
        day: 'Tuesday',
        periods: [
          { period: 1, time: '8:00-9:00', subject: 'Mathematics', class: '10B', room: 'Room 102' },
          { period: 3, time: '10:15-11:15', subject: 'Mathematics', class: '10A', room: 'Room 101' },
          { period: 5, time: '1:00-2:00', subject: 'Mathematics', class: '10A', room: 'Room 101' }
        ]
      }
    ]
  };
};
