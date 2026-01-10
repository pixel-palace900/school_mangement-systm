import api from './axios';

/**
 * Get parent profile
 * @returns {Promise} - Promise with parent profile data
 */
export const getParentProfile = async () => {
  try {
    const response = await api.get('/parent/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching parent profile:', error);
    throw error;
  }
};

/**
 * Get children of a parent
 * @param {string} parentId - Parent ID
 * @returns {Promise} - Promise with children data
 */
export const getParentChildren = async (parentId) => {
  try {
    const response = await api.get(`/parent/${parentId}/children`);
    return response.data;
  } catch (error) {
    console.error('Error fetching parent children:', error);
    throw error;
  }
};

/**
 * Get student attendance
 * @param {string} studentId - Student ID
 * @returns {Promise} - Promise with attendance data
 */
export const getStudentAttendance = async (studentId) => {
  try {
    const response = await api.get(`/student/${studentId}/attendance`);
    return response.data;
  } catch (error) {
    console.error('Error fetching student attendance:', error);
    throw error;
  }
};

/**
 * Get student fees
 * @param {string} studentId - Student ID
 * @returns {Promise} - Promise with fees data
 */
export const getStudentFees = async (studentId) => {
  try {
    const response = await api.get(`/fee/student/${studentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching student fees:', error);
    throw error;
  }
};

/**
 * Get exams by class
 * @param {string} classId - Class ID
 * @returns {Promise} - Promise with exams data
 */
export const getExamsByClass = async (classId) => {
  try {
    const response = await api.get(`/exam/class/${classId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching class exams:', error);
    throw error;
  }
};

/**
 * Get upcoming exams
 * @returns {Promise} - Promise with upcoming exams data
 */
export const getUpcomingExams = async () => {
  try {
    const response = await api.get('/exam/upcoming');
    return response.data;
  } catch (error) {
    console.error('Error fetching upcoming exams:', error);
    throw error;
  }
};

/**
 * Get circulars by audience
 * @param {string} audience - Target audience (all, parents, etc.)
 * @returns {Promise} - Promise with circulars data
 */
export const getCircularsByAudience = async (audience) => {
  try {
    const response = await api.get(`/circular/audience/${audience}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching circulars:', error);
    throw error;
  }
};

/**
 * Get teachers by class
 * @param {string} classId - Class ID
 * @returns {Promise} - Promise with teachers data
 */
export const getTeachersByClass = async (classId) => {
  try {
    const response = await api.get(`/teacher/class/${classId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching class teachers:', error);
    throw error;
  }
};

// Mock data for development (when API is not available)
export const getMockChildren = () => {
  return {
    data: {
      children: [
        {
          _id: '1',
          name: 'John Doe',
          rollNumber: '101',
          classId: { _id: '1', name: '10', section: 'A' }
        },
        {
          _id: '2',
          name: 'Jane Doe',
          rollNumber: '102',
          classId: { _id: '2', name: '8', section: 'B' }
        }
      ]
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
        { _id: '5', date: '2023-06-05', status: 'Present' }
      ]
    }
  };
};

export const getMockFees = () => {
  return {
    data: {
      fees: [
        { _id: '1', amount: 5000, dueDate: '2023-06-15', status: 'paid', paidDate: '2023-06-10' },
        { _id: '2', amount: 2500, dueDate: '2023-07-15', status: 'unpaid' },
        { _id: '3', amount: 1500, dueDate: '2023-08-15', status: 'unpaid' }
      ]
    }
  };
};

export const getMockExams = () => {
  return {
    data: {
      exams: [
        { _id: '1', title: 'Mid-Term Exam', subject: 'Mathematics', date: '2023-07-10', startTime: '09:00', endTime: '11:00', maxMarks: 100, passMarks: 35 },
        { _id: '2', title: 'Mid-Term Exam', subject: 'Science', date: '2023-07-12', startTime: '09:00', endTime: '11:00', maxMarks: 100, passMarks: 35 },
        { _id: '3', title: 'Mid-Term Exam', subject: 'English', date: '2023-07-14', startTime: '09:00', endTime: '11:00', maxMarks: 100, passMarks: 35 }
      ]
    }
  };
};

export const getMockCirculars = () => {
  return {
    data: {
      circulars: [
        { _id: '1', title: 'School Reopening', content: 'School will reopen on June 15, 2023', issueDate: '2023-06-01' },
        { _id: '2', title: 'Parent-Teacher Meeting', content: 'Parent-Teacher meeting will be held on June 20, 2023', issueDate: '2023-06-05' },
        { _id: '3', title: 'Annual Sports Day', content: 'Annual Sports Day will be held on July 5, 2023', issueDate: '2023-06-10' }
      ]
    }
  };
};

export const getMockTeachers = () => {
  return {
    data: {
      teachers: [
        { _id: '1', name: 'Mr. Smith', email: 'smith@school.com', phone: '1234567890', subjectSpecialization: 'Mathematics' },
        { _id: '2', name: 'Mrs. Johnson', email: 'johnson@school.com', phone: '0987654321', subjectSpecialization: 'Science' },
        { _id: '3', name: 'Mr. Brown', email: 'brown@school.com', phone: '1122334455', subjectSpecialization: 'English' }
      ]
    }
  };
};
