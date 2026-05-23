import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationsProvider } from './context/NotificationsContext';
import ErrorBoundary from './components/ErrorBoundary';
import RouteLoadingSpinner from './components/RouteLoadingSpinner';
import Navbar from './components/Navbar';
import GlobalBanner from './components/GlobalBanner';

// Eagerly loaded pages (small, frequently accessed)
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import LandingPage from './pages/LandingPage';
import RequestAccess from './pages/RequestAccess';
import CompleteSetup from './pages/CompleteSetup';

// Lazy loaded pages (heavy, less frequently accessed)
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const StudentDashboard = React.lazy(() => import('./pages/StudentDashboard'));
const TeacherDashboard = React.lazy(() => import('./pages/TeacherDashboard'));
const CourseEditor = React.lazy(() => import('./pages/CourseEditor'));
const QuizView = React.lazy(() => import('./pages/QuizView'));
const StudentCourseView = React.lazy(() => import('./pages/StudentCourseView'));
const StudentRegistrationForm = React.lazy(() => import('./pages/StudentRegistrationForm'));
const UserProfile = React.lazy(() => import('./pages/UserProfile'));
const InstructorProfile = React.lazy(() => import('./pages/InstructorProfile'));
const Professor = React.lazy(() => import('./pages/Professor'));
const CoursesPage = React.lazy(() => import('./pages/CoursesPage'));
const Scholarship = React.lazy(() => import('./pages/Scholarship'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
// Mobile app page removed

// Protected route component that's inside the auth context
const ProtectedRoute = ({ children, roles }) => {
  const { user, token, loading } = useAuth();
  
  if (loading) return <RouteLoadingSpinner />;
  if (!user || !token) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

// Inner app component that uses auth context
function AppShell() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const publicRoutes = new Set([
    '/',
    '/login',
    '/forgot-password',
    '/request-access',
    '/complete-setup',
    '/student-registration',
    '/professor',
    '/courses',
    '/scholarship',
    '/contact'
  ]);

  const isPublicRoute = publicRoutes.has(location.pathname);
  const hideNavbarRoutes = new Set(['/login', '/forgot-password', '/request-access', '/complete-setup', '/student-registration']);
  const showNavbar = !hideNavbarRoutes.has(location.pathname) || isAuthenticated;
  const hideBannerRoutes = new Set(['/login', '/student-registration']);
  const showGlobalBanner = !hideBannerRoutes.has(location.pathname);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
      {showNavbar && <Navbar />}
      {showGlobalBanner && <GlobalBanner />}
      <main className={`app-main ${isPublicRoute ? 'app-main--public' : 'app-main--dashboard'}`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/request-access" element={<RequestAccess />} />
          <Route path="/complete-setup" element={<CompleteSetup />} />
          <Route path="/student-registration" element={<StudentRegistrationForm />} />

          <Route path="/profile" element={
            <ProtectedRoute roles={['admin', 'teacher', 'student']}>
              <Suspense fallback={<RouteLoadingSpinner />}>
                <UserProfile />
              </Suspense>
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}>
              <Suspense fallback={<RouteLoadingSpinner />}>
                <AdminDashboard />
              </Suspense>
            </ProtectedRoute>
          } />

          <Route path="/teacher" element={
            <ProtectedRoute roles={['admin', 'teacher']}>
              <Suspense fallback={<RouteLoadingSpinner />}>
                <TeacherDashboard />
              </Suspense>
            </ProtectedRoute>
          } />

          <Route path="/teacher/instructor-profile" element={
            <ProtectedRoute roles={['teacher']}>
              <Suspense fallback={<RouteLoadingSpinner />}>
                <InstructorProfile />
              </Suspense>
            </ProtectedRoute>
          } />

          <Route path="/student" element={
            <ProtectedRoute roles={['student']}>
              <Suspense fallback={<RouteLoadingSpinner />}>
                <StudentDashboard />
              </Suspense>
            </ProtectedRoute>
          } />

          <Route path="/my-courses" element={
            <ProtectedRoute roles={['student']}>
              <Suspense fallback={<RouteLoadingSpinner />}>
                <StudentDashboard />
              </Suspense>
            </ProtectedRoute>
          } />

          <Route path="/course/read/:id" element={
            <ProtectedRoute roles={['student', 'admin', 'teacher']}>
              <Suspense fallback={<RouteLoadingSpinner />}>
                <StudentCourseView />
              </Suspense>
            </ProtectedRoute>
          } />

          <Route path="/course/edit/:id" element={
            <ProtectedRoute roles={['admin', 'teacher']}>
              <Suspense fallback={<RouteLoadingSpinner />}>
                <CourseEditor />
              </Suspense>
            </ProtectedRoute>
          } />

          <Route path="/quiz/:id" element={
            <ProtectedRoute roles={['student', 'admin', 'teacher']}>
              <Suspense fallback={<RouteLoadingSpinner />}>
                <QuizView />
              </Suspense>
            </ProtectedRoute>
          } />

          <Route path="/professor" element={
            <Suspense fallback={<RouteLoadingSpinner />}>
              <Professor />
            </Suspense>
          } />
          <Route path="/courses" element={
            <Suspense fallback={<RouteLoadingSpinner />}>
              <CoursesPage />
            </Suspense>
          } />
          <Route path="/scholarship" element={
            <Suspense fallback={<RouteLoadingSpinner />}>
              <Scholarship />
            </Suspense>
          } />
          {/* Mobile app route removed */}
          <Route path="/contact" element={
            <Suspense fallback={<RouteLoadingSpinner />}>
              <ContactPage />
            </Suspense>
          } />
        </Routes>
      </main>
    </div>
  );
}

function AppContent() {
  return (
    <Router>
      <Toaster />
      <AppShell />
    </Router>
  );
}

// Outer app component that wraps everything with providers
function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NotificationsProvider>
          <AppContent />
        </NotificationsProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
