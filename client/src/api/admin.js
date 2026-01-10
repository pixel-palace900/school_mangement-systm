import api from './axios';

/**
 * Get admin profile
 * @returns {Promise} - Promise with admin profile data
 */
export const getAdminProfile = async () => {
  try {
    const response = await api.get('/admin/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    throw error;
  }
};

/**
 * Update admin profile
 * @param {Object} profileData - Profile data to update
 * @returns {Promise} - Promise with updated profile data
 */
export const updateAdminProfile = async (profileData) => {
  try {
    const response = await api.put('/admin/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating admin profile:', error);
    throw error;
  }
};

/**
 * Upload admin profile image
 * @param {File} imageFile - Image file to upload
 * @returns {Promise} - Promise with upload result
 */
export const uploadAdminProfileImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('profileImage', imageFile);

    const response = await api.post('/admin/profile/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading admin profile image:', error);
    throw error;
  }
};

/**
 * Get all students
 * @returns {Promise} - Promise with students data
 */
export const getAllStudents = async () => {
  try {
    const response = await api.get('/student');
    return response.data;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};

/**
 * Get student by ID
 * @param {string} id - Student ID
 * @returns {Promise} - Promise with student data
 */
export const getStudentById = async (id) => {
  try {
    const response = await api.get(`/student/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching student with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new student
 * @param {Object} studentData - Student data
 * @returns {Promise} - Promise with created student data
 */
export const createStudent = async (studentData) => {
  try {
    const response = await api.post('/student', studentData);
    return response.data;
  } catch (error) {
    console.error('Error creating student:', error);
    throw error;
  }
};

/**
 * Update a student
 * @param {string} id - Student ID
 * @param {Object} studentData - Updated student data
 * @returns {Promise} - Promise with updated student data
 */
export const updateStudent = async (id, studentData) => {
  try {
    const response = await api.put(`/student/${id}`, studentData);
    return response.data;
  } catch (error) {
    console.error(`Error updating student with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a student
 * @param {string} id - Student ID
 * @returns {Promise} - Promise with deletion result
 */
export const deleteStudent = async (id) => {
  try {
    const response = await api.delete(`/student/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting student with ID ${id}:`, error);
    throw error;
  }
};

// Mock data for development (when API is not available)
export const getMockStudents = () => {
  return {
    success: true,
    data: {
      students: [
        {
          _id: '1',
          name: 'John Doe',
          rollNumber: '101',
          email: 'john.doe@example.com',
          phone: '1234567890',
          classId: { _id: '1', name: '10', section: 'A' },
          parentId: { _id: '1', name: 'Robert Doe', email: 'robert.doe@example.com', phone: '9876543210' }
        },
        {
          _id: '2',
          name: 'Jane Smith',
          rollNumber: '102',
          email: 'jane.smith@example.com',
          phone: '2345678901',
          classId: { _id: '1', name: '10', section: 'A' },
          parentId: { _id: '2', name: 'Sarah Smith', email: 'sarah.smith@example.com', phone: '8765432109' }
        },
        {
          _id: '3',
          name: 'Michael Johnson',
          rollNumber: '103',
          email: 'michael.johnson@example.com',
          phone: '3456789012',
          classId: { _id: '2', name: '10', section: 'B' },
          parentId: { _id: '3', name: 'David Johnson', email: 'david.johnson@example.com', phone: '7654321098' }
        }
      ],
      count: 3
    },
    message: 'Students retrieved successfully'
  };
};

export const getMockStudentById = (id) => {
  const students = getMockStudents().data.students;
  const student = students.find(s => s._id === id);

  if (!student) {
    throw new Error('Student not found');
  }

  return {
    success: true,
    data: student,
    message: 'Student retrieved successfully'
  };
};
