import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Toaster } from './components/ui/toaster';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Admin Pages
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminStudents from './pages/admin/Students';
import AdminStudentForm from './pages/admin/StudentForm';
import AdminStudentDetails from './pages/admin/StudentDetails';
import AdminStudentManagement from './pages/admin/StudentManagement';
import AdminTeachersList from './pages/admin/TeachersList';
import AdminTeacherForm from './pages/admin/TeacherForm';
import AdminParentsList from './pages/admin/ParentsList';
import AdminClassesList from './pages/admin/ClassesList';
import AdminCirculars from './pages/admin/Circulars';
import AdminUpdateProfile from './pages/admin/UpdateProfile';
import AdminPlaceholderPage from './pages/admin/PlaceholderPage';
import AdminSubjects from './pages/admin/Subjects';
import AdminExams from './pages/admin/Exams';
import AdminFees from './pages/admin/Fees';
import AdminAttendance from './pages/admin/Attendance';
import AdminSettings from './pages/admin/Settings';
import AdminGradeManagement from './pages/admin/GradeManagement';

// Teacher Pages
import TeacherLayout from './layouts/TeacherLayout';
import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherAttendance from './pages/teacher/Attendance';
import TeacherClasses from './pages/teacher/Classes';
import TeacherStudents from './pages/teacher/Students';
import TeacherSubjects from './pages/teacher/Subjects';
import TeacherExams from './pages/teacher/Exams';
import TeacherGrades from './pages/teacher/Grades';
import TeacherAssignments from './pages/teacher/Assignments';
import TeacherTimetable from './pages/teacher/Timetable';
import TeacherLibrary from './pages/teacher/Library';
import TeacherCirculars from './pages/teacher/Circulars';
import TeacherFees from './pages/teacher/Fees';
import TeacherCommunication from './pages/teacher/Communication';
import TeacherProfile from './pages/teacher/Profile';
import TeacherAssignmentGrading from './pages/teacher/AssignmentGrading';

// Student Pages
import StudentLayout from './layouts/StudentLayout';
import StudentDashboard from './pages/student/Dashboard';
import StudentTimetable from './pages/student/Timetable';
import StudentAssignments from './pages/student/Assignments';
import StudentPlaceholderPage from './pages/student/PlaceholderPage';
import StudentGrades from './pages/student/Grades';
import StudentAttendance from './pages/student/Attendance';
import StudentExams from './pages/student/Exams';
import StudentFees from './pages/student/Fees';
import StudentLibrary from './pages/student/Library';
import StudentCirculars from './pages/student/Circulars';
import StudentProfile from './pages/student/Profile';

// Parent Pages
import ParentLayout from './layouts/ParentLayout';
import ParentDashboard from './pages/parent/Dashboard';
import ParentChildren from './pages/parent/Children';
import ParentAttendance from './pages/parent/Attendance';
import ParentFees from './pages/parent/Fees';
import ParentExams from './pages/parent/Exams';
import ParentCirculars from './pages/parent/Circulars';
import ParentCommunication from './pages/parent/Communication';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Protected routes - Admin */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/students" element={<AdminStudents />} />
              <Route path="/admin/students/add" element={<AdminStudentForm />} />
              <Route path="/admin/students/:id" element={<AdminStudentDetails />} />
              <Route path="/admin/students/:id/edit" element={<AdminStudentForm />} />
              <Route path="/admin/student-management" element={<AdminStudentManagement />} />
              <Route path="/admin/teachers" element={<AdminTeachersList />} />
              <Route path="/admin/teachers/add" element={<AdminTeacherForm />} />
              <Route path="/admin/teachers/:id/edit" element={<AdminTeacherForm />} />
              <Route path="/admin/parents" element={<AdminParentsList />} />
              <Route path="/admin/classes" element={<AdminClassesList />} />
              <Route path="/admin/subjects" element={<AdminSubjects />} />
              <Route path="/admin/exams" element={<AdminExams />} />
              <Route path="/admin/fees" element={<AdminFees />} />
              <Route path="/admin/attendance" element={<AdminAttendance />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="/admin/grades" element={<AdminGradeManagement />} />
              <Route path="/admin/circulars" element={<AdminCirculars />} />
              <Route path="/admin/profile" element={<AdminUpdateProfile />} />
            </Route>
          </Route>

          {/* Protected routes - Teacher */}
          <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
            <Route element={<TeacherLayout />}>
              <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
              <Route path="/teacher/attendance" element={<TeacherAttendance />} />
              <Route path="/teacher/classes" element={<TeacherClasses />} />
              <Route path="/teacher/students" element={<TeacherStudents />} />
              <Route path="/teacher/subjects" element={<TeacherSubjects />} />
              <Route path="/teacher/exams" element={<TeacherExams />} />
              <Route path="/teacher/grades" element={<TeacherGrades />} />
              <Route path="/teacher/assignments" element={<TeacherAssignments />} />
              <Route path="/teacher/assignment-grading" element={<TeacherAssignmentGrading />} />
              <Route path="/teacher/timetable" element={<TeacherTimetable />} />
              <Route path="/teacher/library" element={<TeacherLibrary />} />
              <Route path="/teacher/circulars" element={<TeacherCirculars />} />
              <Route path="/teacher/fees" element={<TeacherFees />} />
              <Route path="/teacher/communication" element={<TeacherCommunication />} />
              <Route path="/teacher/profile" element={<TeacherProfile />} />
            </Route>
          </Route>

          {/* Protected routes - Student */}
          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route element={<StudentLayout />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/timetable" element={<StudentTimetable />} />
              <Route path="/student/attendance" element={<StudentAttendance />} />
              <Route path="/student/assignments" element={<StudentAssignments />} />
              <Route path="/student/exams" element={<StudentExams />} />
              <Route path="/student/grades" element={<StudentGrades />} />
              <Route path="/student/fees" element={<StudentFees />} />
              <Route path="/student/library" element={<StudentLibrary />} />
              <Route path="/student/circulars" element={<StudentCirculars />} />
              <Route path="/student/profile" element={<StudentProfile />} />
            </Route>
          </Route>

          {/* Protected routes - Parent */}
          <Route element={<ProtectedRoute allowedRoles={['parent']} />}>
            <Route element={<ParentLayout />}>
              <Route path="/parent/dashboard" element={<ParentDashboard />} />
              <Route path="/parent/children" element={<ParentChildren />} />
              <Route path="/parent/children/:childId" element={<ParentChildren />} />
              <Route path="/parent/attendance" element={<ParentAttendance />} />
              <Route path="/parent/fees" element={<ParentFees />} />
              <Route path="/parent/exams" element={<ParentExams />} />
              <Route path="/parent/circulars" element={<ParentCirculars />} />
              <Route path="/parent/communication" element={<ParentCommunication />} />
            </Route>
          </Route>

          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;


