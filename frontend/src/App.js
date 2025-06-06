import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentProfile from './pages/StudentProfile';
import StudentBlog from './pages/StudentBlog';
import AuthDebug from './pages/AuthDebug';
import DashboardNew from './pages/DashboardNew';

// Parent Pages
import HealthDeclaration from './pages/parent/HealthDeclaration';
import MedicationSubmission from './pages/parent/MedicationSubmission';
import VaccinationConsent from './pages/parent/VaccinationConsent';
import CheckupHistory from './pages/parent/CheckupHistory';
import Notifications from './pages/parent/Notifications';
import EmergencyContacts from './pages/parent/EmergencyContacts';

// Medical Staff Pages
import MedicationManagement from './pages/medical/MedicationManagement';
import VaccinationManagement from './pages/medical/VaccinationManagement';
import HealthCheckups from './pages/medical/HealthCheckups';
import StudentManagement from './pages/medical/StudentManagement';
import MedicalReports from './pages/medical/Reports';
import MedicalEvents from './pages/medical/MedicalEvents';

// Admin Pages
import UserManagement from './pages/admin/UserManagement';
import SystemConfiguration from './pages/admin/SystemConfiguration';
import AnalyticsReports from './pages/admin/AnalyticsReports';
import HealthPrograms from './pages/admin/HealthPrograms';
import DataExport from './pages/admin/DataExport';

// Student Pages
import HealthProfile from './pages/student/HealthProfile';
import MedicalHistory from './pages/student/MedicalHistory';
import VaccinationRecord from './pages/student/VaccinationRecord';
import HealthResources from './pages/student/HealthResources';

import { AuthProvider, AuthContext } from './context/AuthContext';

// Prevent direct execution with Node.js
if (typeof window === 'undefined') {
  console.error(
    'Error: This file contains JSX and is intended to be run with React.\n' +
    'Please use the correct method to run this application:\n' +
    '1. Navigate to the frontend directory: cd frontend\n' +
    '2. Run the React development server: npm start\n' +
    'For more information, please refer to the README.md file.'
  );
  process.exit(1);
}

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <Header />
        <Navigation />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth-debug" element={<AuthDebug />} />

            {/* Dashboard */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardNew />
              </ProtectedRoute>
            } />

            {/* Legacy Routes */}
            <Route path="/student-profile" element={
              <ProtectedRoute>
                <StudentProfile />
              </ProtectedRoute>
            } />
            <Route path="/student-blog" element={
              <ProtectedRoute>
                <StudentBlog />
              </ProtectedRoute>
            } />

            {/* Parent Routes */}
            <Route path="/parent/health-declaration" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <HealthDeclaration />
              </ProtectedRoute>
            } />
            <Route path="/parent/medication-submission" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <MedicationSubmission />
              </ProtectedRoute>
            } />
            <Route path="/parent/vaccination-consent" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <VaccinationConsent />
              </ProtectedRoute>
            } />
            <Route path="/parent/checkup-history" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <CheckupHistory />
              </ProtectedRoute>
            } />
            <Route path="/parent/notifications" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <Notifications />
              </ProtectedRoute>
            } />
            <Route path="/parent/emergency-contacts" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <EmergencyContacts />
              </ProtectedRoute>
            } />

            {/* Medical Staff Routes */}
            <Route path="/medical/medication-management" element={
              <ProtectedRoute allowedRoles={['medical_staff']}>
                <MedicationManagement />
              </ProtectedRoute>
            } />
            <Route path="/medical/vaccination-management" element={
              <ProtectedRoute allowedRoles={['medical_staff']}>
                <VaccinationManagement />
              </ProtectedRoute>
            } />
            <Route path="/medical/health-checkups" element={
              <ProtectedRoute allowedRoles={['medical_staff']}>
                <HealthCheckups />
              </ProtectedRoute>
            } />
            <Route path="/medical/student-management" element={
              <ProtectedRoute allowedRoles={['medical_staff']}>
                <StudentManagement />
              </ProtectedRoute>
            } />
            <Route path="/medical/reports" element={
              <ProtectedRoute allowedRoles={['medical_staff']}>
                <MedicalReports />
              </ProtectedRoute>
            } />
            <Route path="/medical/events" element={
              <ProtectedRoute allowedRoles={['medical_staff']}>
                <MedicalEvents />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin/user-management" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/system-configuration" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <SystemConfiguration />
              </ProtectedRoute>
            } />
            <Route path="/admin/analytics-reports" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AnalyticsReports />
              </ProtectedRoute>
            } />
            <Route path="/admin/health-programs" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <HealthPrograms />
              </ProtectedRoute>
            } />
            <Route path="/admin/data-export" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DataExport />
              </ProtectedRoute>
            } />

            {/* Student Routes */}
            <Route path="/student/health-profile" element={
              <ProtectedRoute allowedRoles={['student']}>
                <HealthProfile />
              </ProtectedRoute>
            } />
            <Route path="/student/medical-history" element={
              <ProtectedRoute allowedRoles={['student']}>
                <MedicalHistory />
              </ProtectedRoute>
            } />
            <Route path="/student/vaccination-record" element={
              <ProtectedRoute allowedRoles={['student']}>
                <VaccinationRecord />
              </ProtectedRoute>
            } />
            <Route path="/student/health-resources" element={
              <ProtectedRoute allowedRoles={['student']}>
                <HealthResources />
              </ProtectedRoute>
            } />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

// Protected route component to handle authentication and role-based access
function ProtectedRoute({ children, allowedRoles = [] }) {
  const { currentUser, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access if allowedRoles is provided
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return children;
}

export default App;
