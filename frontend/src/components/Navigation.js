import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navigation = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const getNavigationItems = () => {
    if (!user) return [];

    const commonItems = [
      { path: '/dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
      { path: '/profile', label: 'Profile', icon: 'fas fa-user' },
    ];

    switch (user.role) {
      case 'PARENT':
        return [
          ...commonItems,
          { path: '/health-declaration', label: 'Health Declaration', icon: 'fas fa-file-medical-alt' },
          { path: '/medication-submission', label: 'Submit Medication', icon: 'fas fa-pills' },
          { path: '/vaccination-consent', label: 'Vaccination Consent', icon: 'fas fa-syringe' },
          { path: '/checkup-history', label: 'Checkup History', icon: 'fas fa-history' },
          { path: '/notifications', label: 'Notifications', icon: 'fas fa-bell' },
        ];
      
      case 'MEDICAL_STAFF':
        return [
          ...commonItems,
          { path: '/medical-events', label: 'Medical Events', icon: 'fas fa-ambulance' },
          { path: '/medication-management', label: 'Medication Management', icon: 'fas fa-capsules' },
          { path: '/vaccination-management', label: 'Vaccination Management', icon: 'fas fa-syringe' },
          { path: '/health-checkups', label: 'Health Checkups', icon: 'fas fa-stethoscope' },
          { path: '/student-management', label: 'Student Management', icon: 'fas fa-users' },
          { path: '/reports', label: 'Reports', icon: 'fas fa-chart-bar' },
        ];
      
      case 'ADMIN':
        return [
          ...commonItems,
          { path: '/user-management', label: 'User Management', icon: 'fas fa-users-cog' },
          { path: '/system-config', label: 'System Configuration', icon: 'fas fa-cogs' },
          { path: '/medical-events', label: 'Medical Events', icon: 'fas fa-ambulance' },
          { path: '/vaccination-management', label: 'Vaccination Management', icon: 'fas fa-syringe' },
          { path: '/health-checkups', label: 'Health Checkups', icon: 'fas fa-stethoscope' },
          { path: '/reports', label: 'Reports & Analytics', icon: 'fas fa-analytics' },
        ];
      
      case 'STUDENT':
        return [
          ...commonItems,
          { path: '/health-profile', label: 'Health Profile', icon: 'fas fa-heart' },
          { path: '/medical-history', label: 'Medical History', icon: 'fas fa-file-medical' },
          { path: '/vaccination-record', label: 'Vaccination Record', icon: 'fas fa-syringe' },
          { path: '/blog', label: 'Health Blog', icon: 'fas fa-blog' },
        ];
      
      default:
        return commonItems;
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <i className="fas fa-heartbeat text-2xl text-indigo-600 mr-2"></i>
              <span className="font-bold text-xl text-gray-800">School Health</span>
            </Link>
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4">
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === item.path
                        ? 'text-indigo-600 bg-indigo-50'
                        : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                    }`}
                  >
                    <i className={`${item.icon} mr-2`}></i>
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  Welcome, {user.fullName || user.username}
                </span>
                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <i className="fas fa-sign-out-alt mr-1"></i>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
