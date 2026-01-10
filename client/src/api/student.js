import api from './axios';

/**
 * Get student profile
 * @returns {Promise} - Promise with student profile data
 */
export const getStudentProfile = async () => {
  try {
    const response = await api.get('/student/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching student profile:', error);
    throw error;
  }
};

/**
 * Get student assignments
 * @returns {Promise} - Promise with assignments data
 */
export const getStudentAssignments = async () => {
  try {
    const response = await api.get('/assignment/student');
    return response.data;
  } catch (error) {
    console.error('Error fetching student assignments:', error);
    throw error;
  }
};

/**
 * Submit assignment
 * @param {string} assignmentId - Assignment ID
 * @param {FormData} submissionData - Submission data including files
 * @returns {Promise} - Promise with submission result
 */
export const submitAssignment = async (assignmentId, submissionData) => {
  try {
    const response = await api.post(`/assignment/${assignmentId}/submit`, submissionData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting assignment:', error);
    throw error;
  }
};

/**
 * Get assignment submission details
 * @param {string} assignmentId - Assignment ID
 * @returns {Promise} - Promise with submission details
 */
export const getAssignmentSubmission = async (assignmentId) => {
  try {
    const response = await api.get(`/assignment/${assignmentId}/submission`);
    return response.data;
  } catch (error) {
    console.error('Error fetching assignment submission:', error);
    throw error;
  }
};

/**
 * Get student grades
 * @returns {Promise} - Promise with grades data
 */
export const getStudentGrades = async () => {
  try {
    const response = await api.get('/grade/student');
    return response.data;
  } catch (error) {
    console.error('Error fetching student grades:', error);
    throw error;
  }
};

/**
 * Get student attendance
 * @returns {Promise} - Promise with attendance data
 */
export const getStudentAttendance = async () => {
  try {
    const response = await api.get('/student/attendance');
    return response.data;
  } catch (error) {
    console.error('Error fetching student attendance:', error);
    throw error;
  }
};

/**
 * Get student timetable
 * @returns {Promise} - Promise with timetable data
 */
export const getStudentTimetable = async () => {
  try {
    const response = await api.get('/student/timetable');
    return response.data;
  } catch (error) {
    console.error('Error fetching student timetable:', error);
    throw error;
  }
};

/**
 * Get student exams
 * @returns {Promise} - Promise with exams data
 */
export const getStudentExams = async () => {
  try {
    const response = await api.get('/student/exams');
    return response.data;
  } catch (error) {
    console.error('Error fetching student exams:', error);
    throw error;
  }
};



/**
 * Get student fees
 * @returns {Promise} - Promise with fees data
 */
export const getStudentFees = async () => {
  try {
    const response = await api.get('/student/fees');
    return response.data;
  } catch (error) {
    console.error('Error fetching student fees:', error);
    throw error;
  }
};



/**
 * Get assignment by ID
 * @param {string} assignmentId - Assignment ID
 * @returns {Promise} - Promise with assignment data
 */
export const getAssignmentById = async (assignmentId) => {
  try {
    const response = await api.get(`/assignment/${assignmentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching assignment:', error);
    throw error;
  }
};



/**
 * Get circulars
 * @returns {Promise} - Promise with circulars data
 */
export const getCirculars = async () => {
  try {
    const response = await api.get('/circular');
    return response.data;
  } catch (error) {
    console.error('Error fetching circulars:', error);
    throw error;
  }
};

// Mock data for development (when API is not available)
export const getMockProfile = () => {
  return {
    data: {
      _id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      rollNumber: '101',
      phone: '1234567890',
      dateOfBirth: '2005-05-15',
      classId: { _id: '1', name: '10', section: 'A' },
      parentId: { _id: '1', name: 'Robert Doe', email: 'robert.doe@example.com', phone: '9876543210' }
    }
  };
};

export const getMockAttendance = () => {
  return {
    data: {
      attendance: [
        { _id: '1', date: '2023-06-01', status: 'Present' },
        { _id: '2', date: '2023-06-02', status: 'Present' },
        { _id: '3', date: '2023-06-03', status: 'Absent', remarks: 'Sick leave' },
        { _id: '4', date: '2023-06-04', status: 'Present' },
        { _id: '5', date: '2023-06-05', status: 'Present' },
        { _id: '6', date: '2023-06-08', status: 'Present' },
        { _id: '7', date: '2023-06-09', status: 'Present' },
        { _id: '8', date: '2023-06-10', status: 'Present' },
        { _id: '9', date: '2023-06-11', status: 'Absent', remarks: 'Family emergency' },
        { _id: '10', date: '2023-06-12', status: 'Present' }
      ],
      summary: {
        present: 8,
        absent: 2,
        total: 10,
        percentage: 80
      }
    }
  };
};

export const getMockTimetable = () => {
  return {
    data: {
      timetable: [
        { day: 'Monday', periods: [
          { period: 1, time: '8:00 AM - 9:00 AM', subject: 'Mathematics', teacher: 'Mr. Smith' },
          { period: 2, time: '9:00 AM - 10:00 AM', subject: 'Science', teacher: 'Mrs. Johnson' },
          { period: 3, time: '10:15 AM - 11:15 AM', subject: 'English', teacher: 'Mr. Brown' },
          { period: 4, time: '11:15 AM - 12:15 PM', subject: 'History', teacher: 'Mrs. Davis' },
          { period: 5, time: '1:00 PM - 2:00 PM', subject: 'Computer Science', teacher: 'Mr. Wilson' },
          { period: 6, time: '2:00 PM - 3:00 PM', subject: 'Physical Education', teacher: 'Mr. Thompson' }
        ]},
        { day: 'Tuesday', periods: [
          { period: 1, time: '8:00 AM - 9:00 AM', subject: 'Science', teacher: 'Mrs. Johnson' },
          { period: 2, time: '9:00 AM - 10:00 AM', subject: 'Mathematics', teacher: 'Mr. Smith' },
          { period: 3, time: '10:15 AM - 11:15 AM', subject: 'Geography', teacher: 'Mrs. Davis' },
          { period: 4, time: '11:15 AM - 12:15 PM', subject: 'English', teacher: 'Mr. Brown' },
          { period: 5, time: '1:00 PM - 2:00 PM', subject: 'Art', teacher: 'Ms. Roberts' },
          { period: 6, time: '2:00 PM - 3:00 PM', subject: 'Computer Science', teacher: 'Mr. Wilson' }
        ]},
        { day: 'Wednesday', periods: [
          { period: 1, time: '8:00 AM - 9:00 AM', subject: 'English', teacher: 'Mr. Brown' },
          { period: 2, time: '9:00 AM - 10:00 AM', subject: 'Mathematics', teacher: 'Mr. Smith' },
          { period: 3, time: '10:15 AM - 11:15 AM', subject: 'Science', teacher: 'Mrs. Johnson' },
          { period: 4, time: '11:15 AM - 12:15 PM', subject: 'Music', teacher: 'Ms. Roberts' },
          { period: 5, time: '1:00 PM - 2:00 PM', subject: 'History', teacher: 'Mrs. Davis' },
          { period: 6, time: '2:00 PM - 3:00 PM', subject: 'Physical Education', teacher: 'Mr. Thompson' }
        ]},
        { day: 'Thursday', periods: [
          { period: 1, time: '8:00 AM - 9:00 AM', subject: 'Mathematics', teacher: 'Mr. Smith' },
          { period: 2, time: '9:00 AM - 10:00 AM', subject: 'Science', teacher: 'Mrs. Johnson' },
          { period: 3, time: '10:15 AM - 11:15 AM', subject: 'Computer Science', teacher: 'Mr. Wilson' },
          { period: 4, time: '11:15 AM - 12:15 PM', subject: 'English', teacher: 'Mr. Brown' },
          { period: 5, time: '1:00 PM - 2:00 PM', subject: 'Geography', teacher: 'Mrs. Davis' },
          { period: 6, time: '2:00 PM - 3:00 PM', subject: 'Art', teacher: 'Ms. Roberts' }
        ]},
        { day: 'Friday', periods: [
          { period: 1, time: '8:00 AM - 9:00 AM', subject: 'Science', teacher: 'Mrs. Johnson' },
          { period: 2, time: '9:00 AM - 10:00 AM', subject: 'English', teacher: 'Mr. Brown' },
          { period: 3, time: '10:15 AM - 11:15 AM', subject: 'Mathematics', teacher: 'Mr. Smith' },
          { period: 4, time: '11:15 AM - 12:15 PM', subject: 'Computer Science', teacher: 'Mr. Wilson' },
          { period: 5, time: '1:00 PM - 2:00 PM', subject: 'Physical Education', teacher: 'Mr. Thompson' },
          { period: 6, time: '2:00 PM - 3:00 PM', subject: 'History', teacher: 'Mrs. Davis' }
        ]}
      ]
    }
  };
};

export const getMockExams = () => {
  return {
    data: {
      upcoming: [
        { _id: '1', title: 'Mid-Term Exam', subject: 'Mathematics', date: '2023-07-10', time: '9:00 AM - 11:00 AM', venue: 'Hall A', maxMarks: 100 },
        { _id: '2', title: 'Mid-Term Exam', subject: 'Science', date: '2023-07-12', time: '9:00 AM - 11:00 AM', venue: 'Hall A', maxMarks: 100 },
        { _id: '3', title: 'Mid-Term Exam', subject: 'English', date: '2023-07-14', time: '9:00 AM - 11:00 AM', venue: 'Hall A', maxMarks: 100 }
      ],
      past: [
        { _id: '4', title: 'Unit Test', subject: 'Mathematics', date: '2023-05-10', marks: 85, maxMarks: 100, grade: 'A' },
        { _id: '5', title: 'Unit Test', subject: 'Science', date: '2023-05-12', marks: 78, maxMarks: 100, grade: 'B' },
        { _id: '6', title: 'Unit Test', subject: 'English', date: '2023-05-14', marks: 92, maxMarks: 100, grade: 'A+' }
      ]
    }
  };
};

export const getMockGrades = () => {
  return {
    data: {
      terms: [
        {
          name: 'Term 1',
          subjects: [
            { subject: 'Mathematics', marks: 85, maxMarks: 100, grade: 'A', remarks: 'Excellent work!' },
            { subject: 'Science', marks: 78, maxMarks: 100, grade: 'B', remarks: 'Good understanding of concepts.' },
            { subject: 'English', marks: 92, maxMarks: 100, grade: 'A+', remarks: 'Outstanding performance!' },
            { subject: 'History', marks: 88, maxMarks: 100, grade: 'A', remarks: 'Very good knowledge of historical events.' },
            { subject: 'Computer Science', marks: 95, maxMarks: 100, grade: 'A+', remarks: 'Exceptional programming skills.' }
          ],
          gpa: 3.8
        },
        {
          name: 'Term 2',
          subjects: [
            { subject: 'Mathematics', marks: 90, maxMarks: 100, grade: 'A+', remarks: 'Excellent problem-solving skills!' },
            { subject: 'Science', marks: 82, maxMarks: 100, grade: 'A', remarks: 'Good improvement in practical work.' },
            { subject: 'English', marks: 88, maxMarks: 100, grade: 'A', remarks: 'Well-structured essays.' },
            { subject: 'History', marks: 85, maxMarks: 100, grade: 'A', remarks: 'Good analytical skills.' },
            { subject: 'Computer Science', marks: 92, maxMarks: 100, grade: 'A+', remarks: 'Excellent project work.' }
          ],
          gpa: 3.9
        }
      ]
    }
  };
};

export const getMockAssignments = () => {
  return {
    data: {
      pending: [
        {
          _id: '1',
          title: 'Problem Set 5',
          subject: 'Mathematics',
          dueDate: '2024-01-25',
          assignedDate: '2024-01-15',
          description: 'Complete problems 1-15 from Chapter 7. Focus on quadratic equations and their applications.',
          maxMarks: 20,
          attachments: [
            { fileName: 'problem_set_5.pdf', fileUrl: '/files/problem_set_5.pdf', fileType: 'pdf' }
          ],
          assignedBy: { name: 'Mr. Smith', email: 'smith@school.com' },
          priority: 'high'
        },
        {
          _id: '2',
          title: 'Science Project',
          subject: 'Science',
          dueDate: '2024-01-30',
          assignedDate: '2024-01-10',
          description: 'Prepare a model on renewable energy sources. Include solar, wind, and hydroelectric power.',
          maxMarks: 50,
          attachments: [
            { fileName: 'project_guidelines.pdf', fileUrl: '/files/project_guidelines.pdf', fileType: 'pdf' },
            { fileName: 'rubric.docx', fileUrl: '/files/rubric.docx', fileType: 'docx' }
          ],
          assignedBy: { name: 'Ms. Johnson', email: 'johnson@school.com' },
          priority: 'medium'
        },
        {
          _id: '3',
          title: 'Essay Writing',
          subject: 'English',
          dueDate: '2024-01-22',
          assignedDate: '2024-01-12',
          description: 'Write a 500-word essay on "The Impact of Technology on Education". Use proper citations.',
          maxMarks: 25,
          attachments: [],
          assignedBy: { name: 'Mrs. Davis', email: 'davis@school.com' },
          priority: 'high'
        },
        {
          _id: '6',
          title: 'Computer Programming',
          subject: 'Computer Science',
          dueDate: '2024-01-28',
          assignedDate: '2024-01-18',
          description: 'Create a simple calculator program using Python. Include basic arithmetic operations.',
          maxMarks: 30,
          attachments: [
            { fileName: 'starter_code.py', fileUrl: '/files/starter_code.py', fileType: 'py' }
          ],
          assignedBy: { name: 'Mr. Wilson', email: 'wilson@school.com' },
          priority: 'medium'
        }
      ],
      completed: [
        {
          _id: '4',
          title: 'History Report',
          subject: 'History',
          dueDate: '2024-01-10',
          submittedDate: '2024-01-09',
          assignedDate: '2023-12-20',
          grade: 'A',
          marksObtained: 18,
          maxMarks: 20,
          description: 'Research and write about World War II. Focus on major battles and their outcomes.',
          feedback: 'Excellent research and well-structured report. Great use of primary sources.',
          attachments: [
            { fileName: 'wwii_guidelines.pdf', fileUrl: '/files/wwii_guidelines.pdf', fileType: 'pdf' }
          ],
          assignedBy: { name: 'Mr. Brown', email: 'brown@school.com' },
          status: 'graded'
        },
        {
          _id: '5',
          title: 'Math Quiz',
          subject: 'Mathematics',
          dueDate: '2024-01-05',
          submittedDate: '2024-01-04',
          assignedDate: '2023-12-28',
          grade: 'B+',
          marksObtained: 16,
          maxMarks: 20,
          description: 'Solve algebraic equations and show your work step by step.',
          feedback: 'Good understanding of concepts. Minor calculation errors in questions 3 and 7.',
          attachments: [],
          assignedBy: { name: 'Mr. Smith', email: 'smith@school.com' },
          status: 'graded'
        },
        {
          _id: '7',
          title: 'Chemistry Lab Report',
          subject: 'Science',
          dueDate: '2024-01-08',
          submittedDate: '2024-01-07',
          assignedDate: '2023-12-25',
          grade: 'A-',
          marksObtained: 23,
          maxMarks: 25,
          description: 'Write a lab report on the acid-base titration experiment.',
          feedback: 'Well-documented procedure and accurate results. Could improve on conclusion section.',
          attachments: [
            { fileName: 'lab_template.docx', fileUrl: '/files/lab_template.docx', fileType: 'docx' }
          ],
          assignedBy: { name: 'Ms. Johnson', email: 'johnson@school.com' },
          status: 'graded'
        }
      ]
    }
  };
};

export const getMockFees = () => {
  return {
    data: {
      fees: [
        { _id: '1', term: 'Term 1', amount: 25000, dueDate: '2023-06-15', status: 'paid', paidDate: '2023-06-10', receiptNo: 'REC001' },
        { _id: '2', term: 'Term 2', amount: 25000, dueDate: '2023-09-15', status: 'unpaid' },
        { _id: '3', term: 'Annual Activity Fee', amount: 5000, dueDate: '2023-07-15', status: 'unpaid' }
      ],
      totalPaid: 25000,
      totalPending: 30000
    }
  };
};

export const getMockCirculars = () => {
  return {
    data: {
      circulars: [
        { _id: '1', title: 'School Reopening', content: 'School will reopen on June 15, 2023 after summer vacation.', issueDate: '2023-06-01', category: 'General' },
        { _id: '2', title: 'Parent-Teacher Meeting', content: 'Parent-Teacher meeting will be held on June 20, 2023. All parents are requested to attend.', issueDate: '2023-06-05', category: 'Meeting' },
        { _id: '3', title: 'Annual Sports Day', content: 'Annual Sports Day will be held on July 5, 2023. Students interested in participating should register with their Physical Education teacher.', issueDate: '2023-06-10', category: 'Event' },
        { _id: '4', title: 'Holiday Notice', content: 'School will remain closed on June 25, 2023 due to local elections.', issueDate: '2023-06-15', category: 'Holiday' }
      ]
    }
  };
};
