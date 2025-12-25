import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import CourseEditor from './pages/CourseEditor';
import QuizView from './pages/QuizView';
import StudentCourseView from './pages/StudentCourseView';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
          <Navbar />
          <main style={{ padding: '2rem' }}>
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route path="/admin" element={
                <ProtectedRoute roles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              <Route path="/teacher" element={
                <ProtectedRoute roles={['admin', 'teacher']}>
                  <TeacherDashboard />
                </ProtectedRoute>
              } />

              <Route path="/student" element={
                <ProtectedRoute roles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              } />

              <Route path="/course/read/:id" element={
                <ProtectedRoute roles={['student', 'admin', 'teacher']}>
                  <StudentCourseView />
                </ProtectedRoute>
              } />

              <Route path="/course/edit/:id" element={
                <ProtectedRoute roles={['admin', 'teacher']}>
                  <CourseEditor />
                </ProtectedRoute>
              } />

              <Route path="/quiz/:id" element={
                <ProtectedRoute roles={['student', 'admin', 'teacher']}>
                  <QuizView />
                </ProtectedRoute>
              } />

              <Route path="/" element={
                <ProtectedRoute>
                  <StudentDashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
