import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navigation = () => {
  const { currentUser, logout } = useContext(AuthContext); // Changed user to currentUser to match AuthContext
  const location = useLocation();

  const getNavigationItems = () => {
    if (!currentUser) return []; // Changed user to currentUser

    const commonItems = [
      { path: '/dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
      { path: '/profile', label: 'Profile', icon: 'fas fa-user' },
    ];

    // Determine the primary role for navigation. 
    // Assumes roles are like ['ROLE_PARENT'], takes the first one.
    // You might need more sophisticated logic if users can have multiple primary roles.
    const primaryRole = currentUser.roles && currentUser.roles.length > 0 ? currentUser.roles[0] : null;

    switch (primaryRole) { // Switched to use primaryRole based on currentUser.roles
      case 'ROLE_PARENT':
        return [
          ...commonItems,
          { path: '/parent/dashboard', label: 'Parent Dashboard', icon: 'fas fa-tachometer-alt' },
          { path: '/parent/health-declaration', label: 'Health Declaration', icon: 'fas fa-file-medical-alt' },
          { path: '/parent/medication-submission', label: 'Submit Medication', icon: 'fas fa-pills' },
          { path: '/parent/vaccination-consent', label: 'Vaccination Consent', icon: 'fas fa-syringe' },
          { path: '/parent/checkup-history', label: 'Checkup History', icon: 'fas fa-history' },
          { path: '/parent/notifications', label: 'Notifications', icon: 'fas fa-bell' },
          { path: '/parent/emergency-contacts', label: 'Emergency Contacts', icon: 'fas fa-phone' },
          { path: '/student-blog', label: 'Blog/News', icon: 'fas fa-blog' }, // Added Blog/News link
        ];
      case 'ROLE_SCHOOLNURSE': // Changed from MEDICAL_STAFF to ROLE_SCHOOLNURSE
        return [
          ...commonItems,
          { path: '/medical/events', label: 'Medical Events', icon: 'fas fa-ambulance' }, // Corrected path
          { path: '/medical/medication-management', label: 'Medication Management', icon: 'fas fa-capsules' }, // Corrected path
          { path: '/medical/vaccination-management', label: 'Vaccination Management', icon: 'fas fa-syringe' }, // Corrected path
          { path: '/medical/health-checkups', label: 'Health Checkups', icon: 'fas fa-stethoscope' }, // Corrected path
          { path: '/medical/student-management', label: 'Student Management', icon: 'fas fa-users' }, // Corrected path
          { path: '/medical/reports', label: 'Reports', icon: 'fas fa-chart-bar' }, // Corrected path
        ];
      case 'ROLE_TEACHER': // Changed from MANAGER to ROLE_TEACHER
        return [
          ...commonItems,
          { path: '/manager/dashboard', label: 'Manager Dashboard', icon: 'fas fa-tachometer-alt' },
          { path: '/manager/reports', label: 'Reports & Analytics', icon: 'fas fa-chart-bar' },
          { path: '/manager/user-management', label: 'User Management', icon: 'fas fa-users-cog' },
          { path: '/manager/health-programs', label: 'Health Programs', icon: 'fas fa-heartbeat' },
          { path: '/manager/content', label: 'Content Management', icon: 'fas fa-file-alt' },
        ];
      case 'ROLE_ADMIN': // Changed from ADMIN to ROLE_ADMIN
        return [
          ...commonItems,
          { path: '/admin/user-management', label: 'User Management', icon: 'fas fa-users-cog' },
          { path: '/admin/system-configuration', label: 'System Configuration', icon: 'fas fa-cogs' },
          { path: '/admin/analytics-reports', label: 'Reports & Analytics', icon: 'fas fa-chart-line' },
          { path: '/admin/health-programs', label: 'Health Programs', icon: 'fas fa-heartbeat' },
          { path: '/admin/data-export', label: 'Data Export', icon: 'fas fa-file-export' },
        ];
      case 'ROLE_STUDENT': // Changed from STUDENT to ROLE_STUDENT
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

  // Debugging: Log user and determined navigation items
  console.log('Navigation User:', currentUser);
  console.log('Navigation Items:', navigationItems);

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

          {currentUser && (
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
                  Welcome, {currentUser.fullName || currentUser.username}
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
