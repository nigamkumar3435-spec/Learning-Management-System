import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import StudentDashboard from './pages/StudentDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import InstructorCourseCreate from './pages/InstructorCourseCreate';
import StudentBrowseCourses from './pages/StudentBrowseCourses';
import StudentCourseDetails from './pages/StudentCourseDetails';
import StudentCourseLearn from './pages/StudentCourseLearn';
import InstructorCourseManage from './pages/InstructorCourseManage';

import { AuthProvider, AuthContext } from './context/AuthContext';

function RootRedirect() {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  const userRole = user.role?.toLowerCase() === 'instructor' ? 'instructor' : 'student';
  return <Navigate to={userRole === 'instructor' ? '/instructor' : '/student'} replace />;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student Routes */}
        <Route element={<ProtectedRoute allowedRole="Student" />}>
          <Route path="/student" element={<DashboardLayout role="Student" />}>
            <Route index element={<StudentDashboard />} />
            <Route path="courses" element={<StudentBrowseCourses />} />
            <Route path="courses/:id" element={<StudentCourseDetails />} />
          </Route>
          <Route path="/student/courses/:id/learn" element={<StudentCourseLearn />} />
        </Route>

        {/* Instructor Routes */}
        <Route element={<ProtectedRoute allowedRole="Instructor" />}>
          <Route path="/instructor" element={<DashboardLayout role="Instructor" />}>
            <Route index element={<InstructorDashboard />} />
            <Route path="create" element={<InstructorCourseCreate />} />
            <Route path="courses/:id/manage" element={<InstructorCourseManage />} />
          </Route>
        </Route>

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
