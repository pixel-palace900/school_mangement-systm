import api from '../axios';

// Admin Circular API functions
export const circularApi = {
  // Get all circulars
  getAllCirculars: async () => {
    try {
      const response = await api.get('/circular');
      return response.data;
    } catch (error) {
      console.error('Error fetching circulars:', error);
      throw error;
    }
  },

  // Get circular by ID
  getCircularById: async (id) => {
    try {
      const response = await api.get(`/circular/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching circular:', error);
      throw error;
    }
  },

  // Get circulars by target audience
  getCircularsByAudience: async (targetAudience) => {
    try {
      const response = await api.get(`/circular/audience/${targetAudience}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching circulars by audience:', error);
      throw error;
    }
  },

  // Create new circular
  createCircular: async (circularData) => {
    try {
      const response = await api.post('/circular', circularData);
      return response.data;
    } catch (error) {
      console.error('Error creating circular:', error);
      throw error;
    }
  },

  // Update circular
  updateCircular: async (id, circularData) => {
    try {
      const response = await api.put(`/circular/${id}`, circularData);
      return response.data;
    } catch (error) {
      console.error('Error updating circular:', error);
      throw error;
    }
  },

  // Delete circular
  deleteCircular: async (id) => {
    try {
      const response = await api.delete(`/circular/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting circular:', error);
      throw error;
    }
  },

  // Mock data for development (can be removed when API is fully integrated)
  getMockCirculars: () => {
    return {
      success: true,
      data: {
        circulars: [
          {
            _id: '1',
            title: 'Annual Sports Day 2024',
            content: 'The annual sports day will be held on March 15, 2024. All students are required to participate in at least one event. Parents are invited to attend and cheer for their children.',
            targetAudience: 'all',
            issueDate: '2024-02-01T00:00:00.000Z',
            issuedBy: '65f1234567890abcdef12345',
            issuedByModel: 'Admin'
          },
          {
            _id: '2',
            title: 'Parent-Teacher Meeting',
            content: 'A parent-teacher meeting will be held on February 25, 2024, from 10:00 AM to 2:00 PM. Parents are requested to attend as per the schedule shared with their children.',
            targetAudience: 'parents',
            issueDate: '2024-02-05T00:00:00.000Z',
            issuedBy: '65f1234567890abcdef12345',
            issuedByModel: 'Admin'
          },
          {
            _id: '3',
            title: 'Teacher Training Workshop',
            content: 'All teachers are required to attend the professional development workshop on February 20, 2024. The workshop will cover new teaching methodologies and assessment techniques.',
            targetAudience: 'teachers',
            issueDate: '2024-02-03T00:00:00.000Z',
            issuedBy: '65f1234567890abcdef12345',
            issuedByModel: 'Admin'
          },
          {
            _id: '4',
            title: 'School Closure Notice',
            content: 'The school will remain closed on February 14, 2024, due to a public holiday. Regular classes will resume on February 15, 2024.',
            targetAudience: 'all',
            issueDate: '2024-02-10T00:00:00.000Z',
            issuedBy: '65f1234567890abcdef12345',
            issuedByModel: 'Admin'
          },
          {
            _id: '5',
            title: 'Exam Schedule Released',
            content: 'The final examination schedule for the academic year 2023-24 has been released. Students can collect their admit cards from the school office starting February 28, 2024.',
            targetAudience: 'all',
            issueDate: '2024-02-12T00:00:00.000Z',
            issuedBy: '65f1234567890abcdef12345',
            issuedByModel: 'Admin'
          }
        ],
        count: 5
      }
    };
  }
};

export default circularApi;
