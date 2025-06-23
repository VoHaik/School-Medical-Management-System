import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

import StudentBlog from './pages/StudentBlog';
import AuthDebug from './pages/AuthDebug';
import DashboardNew from './pages/DashboardNew';

// Parent Pages
import HealthDeclaration from './pages/parent/HealthDeclaration';
import VaccinationConsent from './pages/parent/VaccinationConsent';
import CheckupHistory from './pages/parent/CheckupHistory';
// import Notifications from './pages/parent/Notifications'; // To be replaced by common notifications page
import EmergencyContacts from './pages/parent/EmergencyContacts';
import ParentDashboard from './pages/parent/ParentDashboard';
import ChildInformationForm from './pages/parent/ChildInformationForm';
import ChildProfileView from './pages/parent/ChildProfileView';
import ChildMedicalHistory from './pages/parent/ChildMedicalHistory'; // Add this line
import MedicationRequestDetailPage from './pages/parent/MedicationRequestDetailPage'; // Add this line
import ParentHealthCheckupOverview from './pages/parent/ParentHealthCheckupOverview'; // Added for parent
import ParentHealthCheckupResultPage from './pages/parent/ParentHealthCheckupResultPage'; // Added for parent result view
import SubmitMedicationPage from './pages/parent/SubmitMedicationPage'; // <<< IMPORT MỚI
import ViewMedicationRequestsPage from './pages/parent/ViewMedicationRequestsPage'; // <<< IMPORT FOR VIEWING REQUESTS

// Medical Staff Pages
import MedicationManagement from './pages/medical/MedicationManagement';
import VaccinationManagement from './pages/medical/VaccinationManagement';
import HealthCheckups from './pages/medical/HealthCheckups';
import StudentManagement from './pages/medical/StudentManagement';
import MedicalReports from './pages/medical/Reports';
import MedicalEvents from './pages/medical/MedicalEvents';
import HealthCheckupEventManagement from './pages/nurse/HealthCheckupEventManagement'; // Added for nurse/admin
import HealthCheckupEventStudentManagement from './pages/nurse/HealthCheckupEventStudentManagement'; // Added for nurse/admin

// Manager Pages
import ManagerDashboard from './pages/manager/ManagerDashboard';
import ReportsAnalytics from './pages/manager/ReportsAnalytics';
import ManagerUserManagement from './pages/manager/UserManagement';
import ManagerHealthPrograms from './pages/manager/HealthPrograms';
import ContentManagement from './pages/manager/ContentManagement';

// Admin Pages
import UserManagement from './pages/admin/UserManagement';
import ParentRegistrationApproval from './pages/admin/ParentRegistrationApproval';
import SystemConfiguration from './pages/admin/SystemConfiguration';
import AnalyticsReports from './pages/admin/AnalyticsReports';
import HealthPrograms from './pages/admin/HealthPrograms';
import DataExport from './pages/admin/DataExport';
import DashboardAdmin from './pages/admin/DashboardAdmin';
import ReportAdmin from './pages/admin/ReportAdmin';
import MedicalEventsAdmin from './pages/admin/MedicalEventsAdmin';

// Student Pages
import HealthProfile from './pages/student/HealthProfile';
import MedicalHistory from './pages/student/MedicalHistory';
import VaccinationRecord from './pages/student/VaccinationRecord';
import HealthResources from './pages/student/HealthResources';
import Profile from './pages/student/Profile';
import StudentHealthCheckupHistory from './pages/student/StudentHealthCheckupHistory'; // Added for student

// Common Pages
import NotificationsPage from './pages/common/NotificationsPage'; // Import the new common notifications page

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';

console.log('--- App.js MODULE LOADED - V3 ---');
// console.log('[App.js] ProtectedRoute module imported:', ProtectedRoute); // New log

// Prevent direct execution with Node.js
if (typeof window === 'undefined') {
  // console.error(
  //   'Error: This file contains JSX and is intended to be run with React.\n' +
  //   'Please use the correct method to run this application:\n' +
  //   '1. Navigate to the frontend directory: cd frontend\n' +
  //   '2. Run the React development server: npm start\n' +
  //   'For more information, please refer to the README.md file.'
  // );
  if (process && typeof process.exit === 'function') {
    process.exit(1);
  }
}

function App() {
  // console.log('[App.js] App function component rendering'); // New log
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <div className="app-container">
            <Header />
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

                {/* Common Protected Routes */}
                <Route path="/notifications" element={
                  <ProtectedRoute>
                    <NotificationsPage />
                  </ProtectedRoute>
                } />

                {/* Student Routes */}
                <Route path="/student/blog" element={<ProtectedRoute roles={['ROLE_STUDENT']}><StudentBlog /></ProtectedRoute>} />
                <Route path="/student/health-profile" element={<ProtectedRoute roles={['ROLE_STUDENT']}><HealthProfile /></ProtectedRoute>} />
                <Route path="/student/medical-history" element={<ProtectedRoute roles={['ROLE_STUDENT']}><MedicalHistory /></ProtectedRoute>} />
                <Route path="/student/vaccination-record" element={<ProtectedRoute roles={['ROLE_STUDENT']}><VaccinationRecord /></ProtectedRoute>} />
                <Route path="/student/health-resources" element={<ProtectedRoute roles={['ROLE_STUDENT']}><HealthResources /></ProtectedRoute>} />
                <Route path="/student/profile" element={<ProtectedRoute roles={['ROLE_STUDENT']}><Profile /></ProtectedRoute>} />
                <Route path="/student/health-checkups" element={<ProtectedRoute roles={['ROLE_STUDENT']}><StudentHealthCheckupHistory /></ProtectedRoute>} />

                {/* Parent Routes */}
                <Route path="/parent/dashboard" element={<ProtectedRoute roles={['ROLE_PARENT']}><ParentDashboard /></ProtectedRoute>} />
                <Route path="/parent/health-declaration" element={<ProtectedRoute roles={['ROLE_PARENT']}><HealthDeclaration /></ProtectedRoute>} />
                <Route path="/parent/vaccination-consent" element={<ProtectedRoute roles={['ROLE_PARENT']}><VaccinationConsent /></ProtectedRoute>} />
                <Route path="/parent/checkup-history" element={<ProtectedRoute roles={['ROLE_PARENT']}><CheckupHistory /></ProtectedRoute>} />
                {/* <Route path="/parent/notifications" element={<ProtectedRoute roles={['ROLE_PARENT']}><Notifications /></ProtectedRoute>} /> */}
                <Route path="/parent/emergency-contacts" element={<ProtectedRoute roles={['ROLE_PARENT']}><EmergencyContacts /></ProtectedRoute>} />
                <Route path="/parent/child-information" element={<ProtectedRoute roles={['ROLE_PARENT']}><ChildInformationForm /></ProtectedRoute>} />
                <Route path="/parent/child-profile/:childId" element={<ProtectedRoute roles={['ROLE_PARENT']}><ChildProfileView /></ProtectedRoute>} />
                <Route path="/parent/child-medical-history/:childId" element={<ProtectedRoute roles={['ROLE_PARENT']}><ChildMedicalHistory /></ProtectedRoute>} />
                <Route path="/parent/health-checkups" element={<ProtectedRoute roles={['ROLE_PARENT']}><ParentHealthCheckupOverview /></ProtectedRoute>} />
                <Route path="/parent/health-checkup-result/:resultId" element={<ProtectedRoute roles={['ROLE_PARENT']}><ParentHealthCheckupResultPage /></ProtectedRoute>} />
                <Route path="/parent/medication-submission" element={<ProtectedRoute roles={['ROLE_PARENT']}><SubmitMedicationPage /></ProtectedRoute>} /> {/* <<< ROUTE MỚI */}
                <Route path="/parent/my-requests" element={<ProtectedRoute roles={['ROLE_PARENT']}><ViewMedicationRequestsPage /></ProtectedRoute>} /> {/* <<< ROUTE FOR VIEWING REQUESTS */}

                {/* Medical Staff (Nurse/Doctor) Routes */}
                <Route path="/medical/medication-management" element={<ProtectedRoute roles={['ROLE_NURSE', 'ROLE_DOCTOR']}><MedicationManagement /></ProtectedRoute>} />
                <Route path="/medical/vaccination-management" element={<ProtectedRoute roles={['ROLE_NURSE', 'ROLE_DOCTOR']}><VaccinationManagement /></ProtectedRoute>} />
                <Route path="/medical/health-checkups" element={<ProtectedRoute roles={['ROLE_NURSE', 'ROLE_DOCTOR']}><HealthCheckups /></ProtectedRoute>} />
                <Route path="/medical/student-management" element={<ProtectedRoute roles={['ROLE_NURSE', 'ROLE_DOCTOR']}><StudentManagement /></ProtectedRoute>} />
                <Route path="/medical/reports" element={<ProtectedRoute roles={['ROLE_NURSE', 'ROLE_DOCTOR']}><MedicalReports /></ProtectedRoute>} />
                <Route path="/medical/events" element={<ProtectedRoute roles={['ROLE_NURSE', 'ROLE_DOCTOR']}><MedicalEvents /></ProtectedRoute>} />
                <Route path="/nurse/health-checkup-events" element={<ProtectedRoute roles={['ROLE_NURSE', 'ROLE_ADMIN']}><HealthCheckupEventManagement /></ProtectedRoute>} />
                <Route path="/nurse/health-checkup-events/:eventId/students" element={<ProtectedRoute roles={['ROLE_NURSE', 'ROLE_ADMIN']}><HealthCheckupEventStudentManagement /></ProtectedRoute>} />

                {/* Manager Routes */}
                <Route path="/manager/dashboard" element={<ProtectedRoute roles={['ROLE_MANAGER']}><ManagerDashboard /></ProtectedRoute>} />
                <Route path="/manager/reports-analytics" element={<ProtectedRoute roles={['ROLE_MANAGER']}><ReportsAnalytics /></ProtectedRoute>} />
                <Route path="/manager/user-management" element={<ProtectedRoute roles={['ROLE_MANAGER']}><ManagerUserManagement /></ProtectedRoute>} />
                <Route path="/manager/health-programs" element={<ProtectedRoute roles={['ROLE_MANAGER']}><ManagerHealthPrograms /></ProtectedRoute>} />
                <Route path="/manager/content-management" element={<ProtectedRoute roles={['ROLE_MANAGER']}><ContentManagement /></ProtectedRoute>} />

                {/* Admin Routes */}
                <Route path="/admin/user-management" element={<ProtectedRoute roles={['ROLE_ADMIN']}><UserManagement /></ProtectedRoute>} />
                <Route path="/admin/parent-registration-approval" element={<ProtectedRoute roles={['ROLE_ADMIN']}><ParentRegistrationApproval /></ProtectedRoute>} />
                <Route path="/admin/system-configuration" element={<ProtectedRoute roles={['ROLE_ADMIN']}><SystemConfiguration /></ProtectedRoute>} />
                <Route path="/admin/analytics-reports" element={<ProtectedRoute roles={['ROLE_ADMIN']}><AnalyticsReports /></ProtectedRoute>} />
                <Route path="/admin/health-programs" element={<ProtectedRoute roles={['ROLE_ADMIN']}><HealthPrograms /></ProtectedRoute>} />
                <Route path="/admin/data-export" element={<ProtectedRoute roles={['ROLE_ADMIN']}><DataExport /></ProtectedRoute>} />
                <Route path="/admin/dashboard" element={<DashboardAdmin />} />
                <Route path="/admin/reports" element={<ReportAdmin />} />
                <Route path="/admin/medical-events" element={<ProtectedRoute roles={['ROLE_ADMIN']}><MedicalEventsAdmin /></ProtectedRoute>} />

                {/* Fallback for unmatched routes - consider a 404 page */}
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
