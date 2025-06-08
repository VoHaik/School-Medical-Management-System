import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
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
import ParentDashboard from './pages/parent/ParentDashboard';
import ChildInformationForm from './pages/parent/ChildInformationForm';
import ChildProfileView from './pages/parent/ChildProfileView';
import ChildMedicalHistory from './pages/parent/ChildMedicalHistory'; // Add this line

// Medical Staff Pages
import MedicationManagement from './pages/medical/MedicationManagement';
import VaccinationManagement from './pages/medical/VaccinationManagement';
import HealthCheckups from './pages/medical/HealthCheckups';
import StudentManagement from './pages/medical/StudentManagement';
import MedicalReports from './pages/medical/Reports';
import MedicalEvents from './pages/medical/MedicalEvents';

// Manager Pages
import ManagerDashboard from './pages/manager/ManagerDashboard';
import ReportsAnalytics from './pages/manager/ReportsAnalytics';
import ManagerUserManagement from './pages/manager/UserManagement';
import ManagerHealthPrograms from './pages/manager/HealthPrograms';
import ContentManagement from './pages/manager/ContentManagement';

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

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';

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
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
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
                    <ErrorBoundary fallbackMessage="There was an error loading the dashboard.">
                      <DashboardNew />
                    </ErrorBoundary>
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
                  <ProtectedRoute allowedRoles={['ROLE_PARENT']}>
                    <HealthDeclaration />
                  </ProtectedRoute>
                } />
                <Route path="/parent/medication-submission" element={
                  <ProtectedRoute allowedRoles={['ROLE_PARENT']}>
                    <MedicationSubmission />
                  </ProtectedRoute>
                } />
                <Route path="/parent/vaccination-consent" element={
                  <ProtectedRoute allowedRoles={['ROLE_PARENT']}>
                    <VaccinationConsent />
                  </ProtectedRoute>
                } />
                <Route path="/parent/checkup-history" element={
                  <ProtectedRoute allowedRoles={['ROLE_PARENT']}>
                    <CheckupHistory />
                  </ProtectedRoute>
                } />
                <Route path="/parent/notifications" element={
                  <ProtectedRoute allowedRoles={['ROLE_PARENT']}>
                    <Notifications />
                  </ProtectedRoute>
                } />
                <Route path="/parent/emergency-contacts" element={
                  <ProtectedRoute allowedRoles={['ROLE_PARENT']}>
                    <EmergencyContacts />
                  </ProtectedRoute>
                } />
                <Route path="/parent/dashboard" element={
                  <ProtectedRoute allowedRoles={['ROLE_PARENT']}>
                    <ParentDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/parent/child-registration" element={
                  <ProtectedRoute allowedRoles={['ROLE_PARENT']}>
                    <ChildInformationForm />
                  </ProtectedRoute>
                } />
                <Route path="/parent/child/:childId/edit" element={
                  <ProtectedRoute allowedRoles={['ROLE_PARENT']}>
                    <ChildInformationForm />
                  </ProtectedRoute>
                } />
                <Route path="/parent/child/:childId/profile" element={
                  <ProtectedRoute allowedRoles={['ROLE_PARENT']}>
                    <ChildProfileView />
                  </ProtectedRoute>
                } />
                <Route path="/parent/child/:childId/medical-history" element={ // Add this new route
                  <ProtectedRoute allowedRoles={['ROLE_PARENT']}>
                    <ChildMedicalHistory />
                  </ProtectedRoute>
                } />

                {/* Medical Staff Routes */}
                <Route path="/medical/medication-management" element={
                  <ProtectedRoute allowedRoles={['ROLE_SCHOOLNURSE']}>
                    <MedicationManagement />
                  </ProtectedRoute>
                } />
                <Route path="/medical/vaccination-management" element={
                  <ProtectedRoute allowedRoles={['ROLE_SCHOOLNURSE']}>
                    <VaccinationManagement />
                  </ProtectedRoute>
                } />
                <Route path="/medical/health-checkups" element={
                  <ProtectedRoute allowedRoles={['ROLE_SCHOOLNURSE']}>
                    <HealthCheckups />
                  </ProtectedRoute>
                } />
                <Route path="/medical/student-management" element={
                  <ProtectedRoute allowedRoles={['ROLE_SCHOOLNURSE']}>
                    <StudentManagement />
                  </ProtectedRoute>
                } />
                <Route path="/medical/reports" element={
                  <ProtectedRoute allowedRoles={['ROLE_SCHOOLNURSE']}>
                    <MedicalReports />
                  </ProtectedRoute>
                } />
                <Route path="/medical/events" element={
                  <ProtectedRoute allowedRoles={['ROLE_SCHOOLNURSE']}>
                    <MedicalEvents />
                  </ProtectedRoute>
                } />

                {/* Manager Routes */}
                <Route path="/manager/dashboard" element={
                  <ProtectedRoute allowedRoles={['ROLE_TEACHER']}>
                    <ManagerDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/manager/reports" element={
                  <ProtectedRoute allowedRoles={['ROLE_TEACHER']}>
                    <ReportsAnalytics />
                  </ProtectedRoute>
                } />
                <Route path="/manager/user-management" element={
                  <ProtectedRoute allowedRoles={['ROLE_TEACHER']}>
                    <ManagerUserManagement />
                  </ProtectedRoute>
                } />
                <Route path="/manager/health-programs" element={
                  <ProtectedRoute allowedRoles={['ROLE_TEACHER']}>
                    <ManagerHealthPrograms />
                  </ProtectedRoute>
                } />
                <Route path="/manager/content" element={
                  <ProtectedRoute allowedRoles={['ROLE_TEACHER']}>
                    <ContentManagement />
                  </ProtectedRoute>
                } />

                {/* Admin Routes */}
                <Route path="/admin/user-management" element={
                  <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <UserManagement />
                  </ProtectedRoute>
                } />
                <Route path="/admin/system-configuration" element={
                  <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <SystemConfiguration />
                  </ProtectedRoute>
                } />
                <Route path="/admin/analytics-reports" element={
                  <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <AnalyticsReports />
                  </ProtectedRoute>
                } />
                <Route path="/admin/health-programs" element={
                  <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <HealthPrograms />
                  </ProtectedRoute>
                } />
                <Route path="/admin/data-export" element={
                  <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <DataExport />
                  </ProtectedRoute>
                } />

                {/* Student Routes */}
                <Route path="/student/health-profile" element={
                  <ProtectedRoute allowedRoles={['ROLE_STUDENT']}>
                    <HealthProfile />
                  </ProtectedRoute>
                } />
                <Route path="/student/medical-history" element={
                  <ProtectedRoute allowedRoles={['ROLE_STUDENT']}>
                    <MedicalHistory />
                  </ProtectedRoute>
                } />
                <Route path="/student/vaccination-record" element={
                  <ProtectedRoute allowedRoles={['ROLE_STUDENT']}>
                    <VaccinationRecord />
                  </ProtectedRoute>
                } />
                <Route path="/student/health-resources" element={
                  <ProtectedRoute allowedRoles={['ROLE_STUDENT']}>
                    <HealthResources />
                  </ProtectedRoute>
                } />

                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
