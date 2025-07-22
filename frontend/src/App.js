import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import ParentRegistration from './pages/ParentRegistration';
import BlogPostDetail from './pages/BlogPostDetail';
import HealthDocs from './pages/HealthDocs'; // Add HealthDocs import

import NurseBlog from './pages/NurseBlog';
import DashboardNew from './pages/DashboardNew';
import StudentDashboard from './pages/student/StudentDashboard';

// Parent Pages
import HealthDeclaration from './pages/parent/HealthDeclaration';
import HealthRecordsPage from './pages/parent/HealthRecordsPage'; // Add import for Health Records page
import HealthDeclarationDetailPage from './pages/parent/HealthDeclarationDetailPage'; // Add import for Health Declaration Detail page
import StudentHealthProfilePage from './pages/parent/StudentHealthProfilePage'; // Import for Student Health Profile page
// import VaccinationConsent from './pages/parent/VaccinationConsent';
import VaccinationConsent from './pages/parent/VaccinationConsentSimple';
import CheckupInformation from './pages/parent/CheckupInformation';
// import Notifications from './pages/parent/Notifications'; // To be replaced by common notifications page
// import EmergencyContacts from './pages/parent/EmergencyContacts';
import ParentDashboard from './pages/parent/ParentDashboard';
import ChildInformationForm from './pages/parent/ChildInformationForm';
import ChildProfileView from './pages/parent/ChildProfileView';
import ChildMedicalHistory from './pages/parent/ChildMedicalHistory'; // Add this line
import MedicationRequestDetailPage from './pages/parent/MedicationRequestDetailPage'; // Add this line
import EditMedicationRequestPage from './pages/parent/EditMedicationRequestPage'; // Add new import
import ParentHealthCheckupOverview from './pages/parent/ParentHealthCheckupOverview'; // Added for parent
import ParentHealthCheckupResultPage from './pages/parent/ParentHealthCheckupResultPage'; // Added for parent result view
import SubmitMedicationPage from './pages/parent/SubmitMedicationPage'; // <<< IMPORT MỚI
import ViewMedicationRequestsPage from './pages/parent/ViewMedicationRequestsPage'; // <<< IMPORT FOR VIEWING REQUESTS

// Medical Staff Pages
import NurseDashboard from './pages/nurse/NurseDashboard';
import MedicationManagement from './pages/medical/MedicationManagement';
import VaccinationManagement from './pages/medical/VaccinationManagement';
import HealthCheckupManagement from './pages/medical/HealthCheckupManagement';
import StudentManagement from './pages/medical/StudentManagement';
import MedicalReports from './pages/medical/Reports';
import MedicalEvents from './pages/medical/MedicalEvents';
import HealthEventManagement from './pages/nurse/HealthEventManagement'; // Updated for nurse/admin - renamed from HealthCheckupEventManagement
import HealthEventStudentManagement from './pages/nurse/HealthEventStudentManagement'; // Updated for nurse/admin - renamed from HealthCheckupEventStudentManagement
import HealthDeclarationApproval from './pages/nurse/HealthDeclarationApproval'; // Added for nurse approval of health declarations

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import AnalyticsReports from './pages/admin/AnalyticsReports';
import HealthPrograms from './pages/admin/EventManagement';
import DataExport from './pages/admin/DataExport';
import ParentRegistrationManagement from './pages/admin/ParentRegistrationManagement';

// Student Pages
import HealthProfile from './pages/student/HealthProfile';
import MedicalHistory from './pages/student/MedicalHistory';
import VaccinationRecord from './pages/student/VaccinationRecord';
import HealthResources from './pages/student/HealthResources';
import Profile from './pages/student/Profile';
import StudentHealthCheckupHistory from './pages/student/StudentHealthCheckupHistory'; // Added for student

// Student Components (New)
import StudentHealthProfile from './components/student/StudentHealthProfile';
import StudentMedicalHistory from './components/student/StudentMedicalHistory';
import StudentVaccinationRecords from './components/student/StudentVaccinationRecords';

// Common Pages
import NotificationsPage from './pages/common/NotificationsPage'; // Import the new common notifications page
import NotificationDemo from './pages/demo/NotificationDemo'; // Import notification demo

import { AuthProvider } from './context/AuthContext';
import { AppThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import { NotificationProvider } from './components/notifications';

// Compiled v3 React app with enhanced routing

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
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppThemeProvider>
          <NotificationProvider>
            <div className="app-container">
              <Header />
              <main className="main-content">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/blog/:id" element={<BlogPostDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Navigate to="/parent-registration" replace />} />
                <Route path="/parent-registration" element={<ParentRegistration />} />

                {/* Dashboard */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <DashboardNew />
                  </ProtectedRoute>
                } />

                {/* Common Protected Routes */}
                {/* TEMPORARILY DISABLED - NOTIFICATIONS ROUTE */}
                {/* <Route path="/notifications" element={
                  <ProtectedRoute>
                    <NotificationsPage />
                  </ProtectedRoute>
                } /> */}

                {/* Health Docs - Available for all users without login */}
                <Route path="/health-docs" element={<HealthDocs />} />

                {/* Student Routes */}
                <Route path="/health-blog" element={<NurseBlog />} />
                <Route path="/nurse/blog" element={<ProtectedRoute roles={['ROLE_SCHOOLNURSE']}><NurseBlog /></ProtectedRoute>} />
                
                {/* Student Dashboard */}
                <Route path="/student/dashboard" element={<ProtectedRoute roles={['ROLE_STUDENT']}><StudentDashboard /></ProtectedRoute>} />
                
                {/* New Student Routes with Updated Components */}
                <Route path="/health-profile" element={<ProtectedRoute roles={['ROLE_STUDENT']}><StudentHealthProfile /></ProtectedRoute>} />
                <Route path="/medical-history" element={<ProtectedRoute roles={['ROLE_STUDENT']}><StudentMedicalHistory /></ProtectedRoute>} />
                <Route path="/vaccination-record" element={<ProtectedRoute roles={['ROLE_STUDENT']}><StudentVaccinationRecords /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute roles={['ROLE_STUDENT']}><Profile /></ProtectedRoute>} />
                
                {/* Legacy Student Routes */}
                <Route path="/student/health-profile" element={<ProtectedRoute roles={['ROLE_STUDENT']}><HealthProfile /></ProtectedRoute>} />
                <Route path="/student/medical-history" element={<ProtectedRoute roles={['ROLE_STUDENT']}><MedicalHistory /></ProtectedRoute>} />
                <Route path="/student/vaccination-record" element={<ProtectedRoute roles={['ROLE_STUDENT']}><VaccinationRecord /></ProtectedRoute>} />
                <Route path="/student/health-resources" element={<ProtectedRoute roles={['ROLE_STUDENT']}><HealthResources /></ProtectedRoute>} />
                <Route path="/student/profile" element={<ProtectedRoute roles={['ROLE_STUDENT']}><Profile /></ProtectedRoute>} />
                <Route path="/student/health-checkups" element={<ProtectedRoute roles={['ROLE_STUDENT']}><StudentHealthCheckupHistory /></ProtectedRoute>} />

                {/* Parent Routes */}
                <Route path="/parent/dashboard" element={<ProtectedRoute roles={['ROLE_PARENT']}><ParentDashboard /></ProtectedRoute>} />
                <Route path="/parent/health-declaration" element={<ProtectedRoute roles={['ROLE_PARENT']}><HealthDeclaration /></ProtectedRoute>} />
                <Route path="/parent/health-records" element={<ProtectedRoute roles={['ROLE_PARENT']}><HealthRecordsPage /></ProtectedRoute>} />
                <Route path="/parent/health-declaration-detail/:declarationId" element={<ProtectedRoute roles={['ROLE_PARENT']}><HealthDeclarationDetailPage /></ProtectedRoute>} />
                <Route path="/parent/student-health-profile" element={<ProtectedRoute roles={['ROLE_PARENT']}><StudentHealthProfilePage /></ProtectedRoute>} />
                <Route path="/parent/vaccination-consent" element={<ProtectedRoute roles={['ROLE_PARENT']}><VaccinationConsent /></ProtectedRoute>} />
                <Route path="/parent/checkup-information" element={<ProtectedRoute roles={['ROLE_PARENT']}><CheckupInformation /></ProtectedRoute>} />
                {/* <Route path="/parent/notifications" element={<ProtectedRoute roles={['ROLE_PARENT']}><Notifications /></ProtectedRoute>} /> */}
                {/* <Route path="/parent/emergency-contacts" element={<ProtectedRoute roles={['ROLE_PARENT']}><EmergencyContacts /></ProtectedRoute>} /> */}
                <Route path="/parent/child-information" element={<ProtectedRoute roles={['ROLE_PARENT']}><ChildInformationForm /></ProtectedRoute>} />
                <Route path="/parent/child-profile/:childId" element={<ProtectedRoute roles={['ROLE_PARENT']}><ChildProfileView /></ProtectedRoute>} />
                <Route path="/parent/child-medical-history/:childId" element={<ProtectedRoute roles={['ROLE_PARENT']}><ChildMedicalHistory /></ProtectedRoute>} />
                <Route path="/parent/health-checkups" element={<ProtectedRoute roles={['ROLE_PARENT']}><ParentHealthCheckupOverview /></ProtectedRoute>} />
                <Route path="/parent/health-checkup-result/:resultId" element={<ProtectedRoute roles={['ROLE_PARENT']}><ParentHealthCheckupResultPage /></ProtectedRoute>} />                <Route path="/parent/medication-submission" element={<ProtectedRoute roles={['ROLE_PARENT']}><SubmitMedicationPage /></ProtectedRoute>} /> {/* <<< ROUTE MỚI */}                <Route path="/parent/my-requests" element={<ProtectedRoute roles={['ROLE_PARENT']}><ViewMedicationRequestsPage /></ProtectedRoute>} /> {/* <<< ROUTE FOR VIEWING REQUESTS */}
                <Route path="/parent/medication-request/edit/:requestId" element={<ProtectedRoute roles={['ROLE_PARENT']}><EditMedicationRequestPage /></ProtectedRoute>} /> {/* Route cho chỉnh sửa yêu cầu thuốc */}
                <Route path="/parent/medication-request/:requestId" element={<ProtectedRoute roles={['ROLE_PARENT']}><MedicationRequestDetailPage /></ProtectedRoute>} /> {/* Route cho chi tiết yêu cầu thuốc */}                <Route path="/parent/student-health-profile" element={<ProtectedRoute roles={['ROLE_PARENT']}><StudentHealthProfilePage /></ProtectedRoute>} /> {/* <<< ROUTE MỚI - Student Health Profile */}

                {/* Medical Staff (Nurse/Doctor) Routes */}
                <Route path="/medical/dashboard" element={<ProtectedRoute roles={['ROLE_NURSE', 'ROLE_SCHOOLNURSE', 'ROLE_DOCTOR']}><NurseDashboard /></ProtectedRoute>} />
                <Route path="/medical/medication-management" element={<ProtectedRoute roles={['ROLE_NURSE', 'ROLE_SCHOOLNURSE', 'ROLE_DOCTOR']}><MedicationManagement /></ProtectedRoute>} />
                <Route path="/medical/vaccination-management" element={<ProtectedRoute roles={['ROLE_NURSE', 'ROLE_SCHOOLNURSE', 'ROLE_DOCTOR']}><VaccinationManagement /></ProtectedRoute>} />
                <Route path="/medical/health-checkups" element={<ProtectedRoute roles={['ROLE_NURSE', 'ROLE_SCHOOLNURSE', 'ROLE_DOCTOR']}><HealthCheckupManagement /></ProtectedRoute>} />
                <Route path="/medical/student-management" element={<ProtectedRoute roles={['ROLE_NURSE', 'ROLE_SCHOOLNURSE', 'ROLE_DOCTOR']}><StudentManagement /></ProtectedRoute>} />
                <Route path="/medical/reports" element={<ProtectedRoute roles={['ROLE_NURSE', 'ROLE_SCHOOLNURSE', 'ROLE_DOCTOR']}><MedicalReports /></ProtectedRoute>} />                <Route path="/medical/events" element={<ProtectedRoute roles={['ROLE_NURSE', 'ROLE_SCHOOLNURSE', 'ROLE_DOCTOR']}><MedicalEvents /></ProtectedRoute>} />
                <Route path="/nurse/health-checkup-events" element={<ProtectedRoute roles={['ROLE_NURSE', 'ROLE_SCHOOLNURSE', 'ROLE_ADMIN']}><HealthEventManagement /></ProtectedRoute>} />
                <Route path="/nurse/health-checkup-events/:eventId/students" element={<ProtectedRoute roles={['ROLE_NURSE', 'ROLE_SCHOOLNURSE', 'ROLE_ADMIN']}><HealthEventStudentManagement /></ProtectedRoute>} />
                <Route path="/nurse/health-declaration-approval" element={<ProtectedRoute roles={['ROLE_NURSE', 'ROLE_SCHOOLNURSE', 'ROLE_ADMIN']}><HealthDeclarationApproval /></ProtectedRoute>} /> {/* Route cho phê duyệt khai báo sức khỏe */}

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<ProtectedRoute roles={['ROLE_ADMIN']}><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/user-management" element={<ProtectedRoute roles={['ROLE_ADMIN']}><UserManagement /></ProtectedRoute>} />
                <Route path="/admin/parent-registration-management" element={<ProtectedRoute roles={['ROLE_ADMIN']}><ParentRegistrationManagement /></ProtectedRoute>} />
                <Route path="/admin/analytics-reports" element={<ProtectedRoute roles={['ROLE_ADMIN']}><AnalyticsReports /></ProtectedRoute>} />
                <Route path="/admin/health-programs" element={<ProtectedRoute roles={['ROLE_ADMIN']}><HealthPrograms /></ProtectedRoute>} />
                <Route path="/admin/data-export" element={<ProtectedRoute roles={['ROLE_ADMIN']}><DataExport /></ProtectedRoute>} />
                
                {/* Demo Routes - Remove in production */}
                <Route path="/demo/notifications" element={<NotificationDemo />} />
                
                {/* Fallback for unmatched routes - consider a 404 page */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
          </NotificationProvider>
        </AppThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
