import api from '../axios';

/**
 * Get all teachers
 * @returns {Promise} - Promise with teachers data
 */
export const getAllTeachers = async () => {
  try {
    const response = await api.get('/teacher');
    return response.data;
  } catch (error) {
    console.error('Error fetching teachers:', error);
    throw error;
  }
};

/**
 * Get teacher by ID
 * @param {string} id - Teacher ID
 * @returns {Promise} - Promise with teacher data
 */
export const getTeacherById = async (id) => {
  try {
    const response = await api.get(`/teacher/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching teacher with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new teacher
 * @param {Object} teacherData - Teacher data
 * @returns {Promise} - Promise with created teacher data
 */
export const createTeacher = async (teacherData) => {
  try {
    const response = await api.post('/teacher', teacherData);
    return response.data;
  } catch (error) {
    console.error('Error creating teacher:', error);
    throw error;
  }
};

/**
 * Update a teacher
 * @param {string} id - Teacher ID
 * @param {Object} teacherData - Updated teacher data
 * @returns {Promise} - Promise with updated teacher data
 */
export const updateTeacher = async (id, teacherData) => {
  try {
    const response = await api.put(`/teacher/${id}`, teacherData);
    return response.data;
  } catch (error) {
    console.error(`Error updating teacher with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a teacher
 * @param {string} id - Teacher ID
 * @returns {Promise} - Promise with deletion result
 */
export const deleteTeacher = async (id) => {
  try {
    const response = await api.delete(`/teacher/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting teacher with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Assign teacher to class
 * @param {string} teacherId - Teacher ID
 * @param {string} classId - Class ID
 * @returns {Promise} - Promise with updated teacher data
 */
export const assignTeacherToClass = async (teacherId, classId) => {
  try {
    const response = await api.put(`/teacher/${teacherId}`, { classAssigned: classId });
    return response.data;
  } catch (error) {
    console.error(`Error assigning teacher ${teacherId} to class ${classId}:`, error);
    throw error;
  }
};

/**
 * Remove teacher from class
 * @param {string} teacherId - Teacher ID
 * @returns {Promise} - Promise with updated teacher data
 */
export const removeTeacherFromClass = async (teacherId) => {
  try {
    const response = await api.put(`/teacher/${teacherId}`, { classAssigned: null });
    return response.data;
  } catch (error) {
    console.error(`Error removing teacher ${teacherId} from class:`, error);
    throw error;
  }
};

// Mock data for development (when API is not available)
export const getMockTeachers = () => {
  return {
    success: true,
    data: {
      teachers: [
        { 
          _id: '1', 
          name: 'John Smith', 
          email: 'john.smith@example.com',
          phone: '1234567890',
          subjectSpecialization: 'Mathematics',
          classAssigned: { _id: '1', name: '10', section: 'A' }
        },
        { 
          _id: '2', 
          name: 'Jane Doe', 
          email: 'jane.doe@example.com',
          phone: '2345678901',
          subjectSpecialization: 'Science',
          classAssigned: { _id: '2', name: '10', section: 'B' }
        },
        { 
          _id: '3', 
          name: 'Robert Johnson', 
          email: 'robert.johnson@example.com',
          phone: '3456789012',
          subjectSpecialization: 'English',
          classAssigned: null
        },
        { 
          _id: '4', 
          name: 'Emily Wilson', 
          email: 'emily.wilson@example.com',
          phone: '4567890123',
          subjectSpecialization: 'History',
          classAssigned: { _id: '3', name: '9', section: 'A' }
        },
        { 
          _id: '5', 
          name: 'Michael Brown', 
          email: 'michael.brown@example.com',
          phone: '5678901234',
          subjectSpecialization: 'Physical Education',
          classAssigned: null
        }
      ],
      count: 5
    },
    message: 'Teachers retrieved successfully'
  };
};
