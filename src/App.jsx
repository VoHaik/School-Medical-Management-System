import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Nafbar'; // Fixed typo: 'nafbar' -> 'Navbar'
import PrivateRoute from './components/PrivateRoute';
// import Home from './pages/Home';
// import Login from './pages/Login';
// import Dashboard from './pages/Dashboard';
// Import other pages as needed
// import StudentHealthProfile from './pages/StudentHealthProfile';
// import MedicationSubmission from './pages/MedicationSubmission';
// import MedicalEvents from './pages/MedicalEvents';
// import MedicalSupplies from './pages/MedicalSupplies';
// import VaccinationCampaigns from './pages/VaccinationCampaigns';
// import HealthCheckCampaigns from './pages/HealthCheckCampaigns';
// import Appointments from './pages/Appointments';
// import UserManagement from './pages/UserManagement';
// import Posts from './pages/Posts';

const App = () => {
  // Initialize userRole from localStorage
  const [userRole, setUserRole] = useState(localStorage.getItem('role') || null);

  // Update userRole in localStorage whenever it changes
  useEffect(() => {
    if (userRole) {
      localStorage.setItem('role', userRole);
    } else {
      localStorage.removeItem('role');
    }
  }, [userRole]);

  const handleLogin = (role) => {
    setUserRole(role);
  };

  const handleLogout = () => {
    setUserRole(null);
  };

  return (
    <Router>
      <div className="app">
        <div className="background-image" />
        <div className="overlay" />
        <Navbar userRole={userRole} onLogout={handleLogout} />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              userRole ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute allowedRoles={['Admin', 'MedicalStaff', 'Parent', 'Student']}>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/student-health-profile"
            element={
              <PrivateRoute allowedRoles={['Parent', 'Student']}>
                <StudentHealthProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/medication-submission"
            element={
              <PrivateRoute allowedRoles={['Parent', 'MedicalStaff']}>
                <MedicationSubmission />
              </PrivateRoute>
            }
          />
          <Route
            path="/medical-events"
            element={
              <PrivateRoute allowedRoles={['MedicalStaff']}>
                <MedicalEvents />
              </PrivateRoute>
            }
          />
          <Route
            path="/medical-supplies"
            element={
              <PrivateRoute allowedRoles={['MedicalStaff', 'Admin']}>
                <MedicalSupplies />
              </PrivateRoute>
            }
          />
          <Route
            path="/vaccination-campaigns"
            element={
              <PrivateRoute allowedRoles={['MedicalStaff', 'Parent']}>
                <VaccinationCampaigns />
              </PrivateRoute>
            }
          />
          <Route
            path="/health-check-campaigns"
            element={
              <PrivateRoute allowedRoles={['MedicalStaff', 'Parent']}>
                <HealthCheckCampaigns />
              </PrivateRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <PrivateRoute allowedRoles={['MedicalStaff', 'Parent']}>
                <Appointments />
              </PrivateRoute>
            }
          />
          <Route
            path="/user-management"
            element={
              <PrivateRoute allowedRoles={['Admin']}>
                <UserManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/posts"
            element={
              <PrivateRoute allowedRoles={['Admin', 'MedicalStaff']}>
                <Posts />
              </PrivateRoute>
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
