import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import JobSeekerProfile from './pages/JobSeekerProfile';
import Applications from './pages/Applications';
import SavedJobs from './pages/SavedJobs';
import EmployerProfile from './pages/EmployerProfile';
import PostJob from './pages/PostJob';
import MyJobs from './pages/MyJobs';
import Applicants from './pages/Applicants';
import Notifications from './pages/Notifications';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import JobModeration from './pages/admin/JobModeration';
import NotFound from './pages/NotFound';
import ServerError from './pages/ServerError';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <NotificationProvider>
            <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:jobId" element={<JobDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              {/* Error Pages */}
              <Route path="/500" element={<ServerError />} />
              
              {/* Dashboard Route - Role-based */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['jobseeker', 'employer', 'admin']}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              
              {/* Notifications Route */}
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute allowedRoles={['jobseeker', 'employer', 'admin']}>
                    <Notifications />
                  </ProtectedRoute>
                }
              />
              
              {/* Job Seeker Protected Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute allowedRoles={['jobseeker']}>
                    <JobSeekerProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/applications"
                element={
                  <ProtectedRoute allowedRoles={['jobseeker']}>
                    <Applications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/saved-jobs"
                element={
                  <ProtectedRoute allowedRoles={['jobseeker']}>
                    <SavedJobs />
                  </ProtectedRoute>
                }
              />
              
              {/* Employer Protected Routes */}
              <Route
                path="/employer/profile"
                element={
                  <ProtectedRoute allowedRoles={['employer']}>
                    <EmployerProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employer/post-job"
                element={
                  <ProtectedRoute allowedRoles={['employer']}>
                    <PostJob />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employer/edit-job/:jobId"
                element={
                  <ProtectedRoute allowedRoles={['employer']}>
                    <PostJob />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employer/jobs"
                element={
                  <ProtectedRoute allowedRoles={['employer']}>
                    <MyJobs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employer/jobs/:jobId/applicants"
                element={
                  <ProtectedRoute allowedRoles={['employer']}>
                    <Applicants />
                  </ProtectedRoute>
                }
              />
              
              {/* Admin Protected Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <UserManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/jobs"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <JobModeration />
                  </ProtectedRoute>
                }
              />
              
              {/* 404 - Must be last */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ToastContainer position="top-right" autoClose={3000} />
            </div>
          </NotificationProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
