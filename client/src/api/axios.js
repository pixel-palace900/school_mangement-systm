import axios from 'axios';
import { mockData, simulateDelay } from './mockData';

// Standalone mode flag
const STANDALONE_MODE = true;

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * MOCK INTERCEPTOR
 * This intercepts all requests and returns data from mockData.js
 * when STANDALONE_MODE is enabled.
 */
api.interceptors.request.use(
  async (config) => {
    if (STANDALONE_MODE) {
      console.log(`[Standalone Mode] Intercepting ${config.method.toUpperCase()} ${config.url}`);

      await simulateDelay(300);

      let data = null;
      const url = config.url.toLowerCase();

      // ========== AUTH ROUTES ==========
      if (url.includes('/user/login')) {
        let credentials = {};
        try {
          credentials = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data || {});
        } catch (e) {
          console.error('[Standalone Mode] Failed to parse request data:', e);
        }

        const { userType, email, password } = credentials;
        console.log('[Standalone Mode] Login credentials:', { userType, email, password });
        console.log('[Standalone Mode] Available users:', mockData.users);
        const user = mockData.users.find(u => u.role === userType);
        console.log('[Standalone Mode] Found user:', user);

        if (user) {
          // In standalone mode, accept any password
          const token = `mock_token_${userType}_${Date.now()}`;
          const responseData = {
            success: true,
            token: token,
            data: {
              token: token,
              user: user
            }
          };

          data = responseData;
          console.log('[Standalone Mode] Login response data:', data);

          // Store user in localStorage for subsequent requests
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token', token);
        } else {
          // Return error if user type not found
          const mockErrorResponse = {
            data: { success: false, message: 'Invalid user type' },
            status: 400,
            statusText: 'Bad Request',
            headers: {},
            config: config,
          };
          config.adapter = () => Promise.reject({ response: mockErrorResponse });
          return config;
        }
      } else if (url.includes('/user/me')) {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        data = { success: true, data: storedUser || mockData.users[0] };
      }

      // ========== ADMIN ROUTES ==========
      else if (url.includes('/admin/students') || url.includes('/student') && config.method === 'get') {
        data = { success: true, data: mockData.students };
      } else if (url.includes('/admin/teachers') || url.includes('/teacher') && config.method === 'get') {
        data = { success: true, data: mockData.teachers };
      } else if (url.includes('/admin/parents')) {
        data = { success: true, data: mockData.parents };
      } else if (url.includes('/admin/classes') || url.includes('/class')) {
        data = { success: true, data: mockData.classes };
      } else if (url.includes('/admin/subjects') || url.includes('/subject')) {
        data = { success: true, data: mockData.subjects };
      } else if (url.includes('/admin/dashboard')) {
        data = { success: true, data: mockData.dashboardStats.admin };
      } else if (url.includes('/admin/attendance')) {
        data = { success: true, data: mockData.attendanceSummary };
      } else if (url.includes('/admin/fees')) {
        data = { success: true, data: mockData.fees };
      } else if (url.includes('/admin/exams')) {
        data = { success: true, data: mockData.exams };
      }

      // ========== TEACHER ROUTES ==========
      else if (url.includes('/teacher/dashboard')) {
        data = { success: true, data: mockData.dashboardStats.teacher };
      } else if (url.includes('/teacher/classes')) {
        const teacher = JSON.parse(localStorage.getItem('user') || '{}');
        const teacherClasses = mockData.classes.filter(c => c.classTeacherId === teacher.id);
        data = { success: true, data: teacherClasses };
      } else if (url.includes('/teacher/students')) {
        data = { success: true, data: mockData.students };
      } else if (url.includes('/teacher/assignments')) {
        data = { success: true, data: mockData.assignments };
      } else if (url.includes('/teacher/attendance')) {
        data = { success: true, data: mockData.attendanceSummary };
      } else if (url.includes('/teacher/grades')) {
        data = { success: true, data: mockData.grades };
      } else if (url.includes('/teacher/exams')) {
        data = { success: true, data: mockData.exams };
      }

      // ========== STUDENT ROUTES ==========
      else if (url.includes('/student/dashboard')) {
        data = { success: true, data: mockData.dashboardStats.student };
      } else if (url.includes('/student/profile')) {
        data = { success: true, data: mockData.students[0] };
      } else if (url.includes('/student/attendance')) {
        data = {
          success: true,
          data: {
            attendance: [],
            summary: {
              present: 90,
              absent: 5,
              total: 95,
              percentage: mockData.students[0].attendance
            }
          }
        };
      } else if (url.includes('/student/assignments')) {
        data = { success: true, data: mockData.assignments };
      } else if (url.includes('/student/grades')) {
        data = { success: true, data: mockData.grades.s1 };
      } else if (url.includes('/student/exams')) {
        data = { success: true, data: { upcoming: mockData.exams, past: [] } };
      } else if (url.includes('/student/fees')) {
        const studentFees = mockData.fees.filter(f => f.studentId === 's1');
        data = { success: true, data: { fees: studentFees, totalPaid: 15000, totalPending: 0 } };
      } else if (url.includes('/student/timetable')) {
        data = { success: true, data: { timetable: mockData.timetable['10-A'] } };
      }

      // ========== PARENT ROUTES ==========
      else if (url.includes('/parent/dashboard')) {
        data = { success: true, data: mockData.dashboardStats.parent };
      } else if (url.includes('/parent/children')) {
        const parent = mockData.parents[0];
        data = { success: true, data: parent.children };
      } else if (url.includes('/parent/attendance')) {
        data = { success: true, data: mockData.attendanceSummary };
      } else if (url.includes('/parent/fees')) {
        data = { success: true, data: mockData.fees };
      } else if (url.includes('/parent/exams')) {
        data = { success: true, data: mockData.exams };
      }

      // ========== COMMON ROUTES ==========
      else if (url.includes('/circular')) {
        data = { success: true, data: mockData.circulars };
      }

      // If we found mock data, return it
      if (data) {
        const mockResponse = {
          data: data,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: config,
        };
        config.adapter = () => Promise.resolve(mockResponse);
      }
    }

    // Auth token logic
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Basic response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
