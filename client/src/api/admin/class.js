import api from '../axios';

/**
 * Get all classes
 * @returns {Promise} - Promise with classes data
 */
export const getAllClasses = async () => {
  try {
    const response = await api.get('/class');
    return response.data;
  } catch (error) {
    console.error('Error fetching classes:', error);
    throw error;
  }
};

/**
 * Get class by ID
 * @param {string} id - Class ID
 * @returns {Promise} - Promise with class data
 */
export const getClassById = async (id) => {
  try {
    const response = await api.get(`/class/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching class with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new class
 * @param {Object} classData - Class data
 * @returns {Promise} - Promise with created class data
 */
export const createClass = async (classData) => {
  try {
    const response = await api.post('/class', classData);
    return response.data;
  } catch (error) {
    console.error('Error creating class:', error);
    throw error;
  }
};

/**
 * Update a class
 * @param {string} id - Class ID
 * @param {Object} classData - Updated class data
 * @returns {Promise} - Promise with updated class data
 */
export const updateClass = async (id, classData) => {
  try {
    const response = await api.put(`/class/${id}`, classData);
    return response.data;
  } catch (error) {
    console.error(`Error updating class with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a class
 * @param {string} id - Class ID
 * @returns {Promise} - Promise with deletion result
 */
export const deleteClass = async (id) => {
  try {
    const response = await api.delete(`/class/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting class with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Get students in a class
 * @param {string} classId - Class ID
 * @returns {Promise} - Promise with students data
 */
export const getStudentsByClass = async (classId) => {
  try {
    const response = await api.get(`/student?classId=${classId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching students for class ${classId}:`, error);
    throw error;
  }
};

// Mock data for development (when API is not available)
export const getMockClasses = () => {
  return {
    success: true,
    data: {
      classes: [
        { 
          _id: '1', 
          name: '10', 
          section: 'A',
          classTeacher: { 
            _id: '1', 
            name: 'John Smith', 
            email: 'john.smith@example.com',
            subjectSpecialization: 'Mathematics'
          }
        },
        { 
          _id: '2', 
          name: '10', 
          section: 'B',
          classTeacher: { 
            _id: '2', 
            name: 'Jane Doe', 
            email: 'jane.doe@example.com',
            subjectSpecialization: 'Science'
          }
        },
        { 
          _id: '3', 
          name: '9', 
          section: 'A',
          classTeacher: { 
            _id: '4', 
            name: 'Emily Wilson', 
            email: 'emily.wilson@example.com',
            subjectSpecialization: 'History'
          }
        },
        { 
          _id: '4', 
          name: '9', 
          section: 'B',
          classTeacher: null
        },
        { 
          _id: '5', 
          name: '8', 
          section: 'A',
          classTeacher: null
        }
      ],
      count: 5
    },
    message: 'Classes retrieved successfully'
  };
};
