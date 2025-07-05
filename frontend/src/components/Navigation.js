import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navigation = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const location = useLocation();

  const getNavigationItems = () => {
    console.log('[Navigation.js] currentUser:', currentUser); // Enhanced log

    if (!currentUser || !currentUser.roles || !Array.isArray(currentUser.roles)) {
      console.log('[Navigation.js] currentUser or currentUser.roles is invalid. Roles:', currentUser ? currentUser.roles : 'N/A');
      // Return common items or empty array if user is not fully loaded or has no roles
      return currentUser ? [
        { path: '/dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
        { path: '/profile', label: 'Profile', icon: 'fas fa-user' },
      ] : [];
    }

    console.log('[Navigation.js] currentUser.roles:', currentUser.roles);

    const commonItems = [
      { path: '/dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
      { path: '/profile', label: 'Profile', icon: 'fas fa-user' },
    ];

    // Determine the primary role for navigation.
    let primaryRole = null;    if (currentUser.roles.includes('Admin') || currentUser.roles.includes('ROLE_ADMIN')) {
      primaryRole = 'ROLE_ADMIN';
    } else if (currentUser.roles.includes('Parent') || currentUser.roles.includes('ROLE_PARENT')) {
      primaryRole = 'ROLE_PARENT';
    } else if (currentUser.roles.includes('SchoolNurse') || currentUser.roles.includes('ROLE_SCHOOLNURSE')) {
      primaryRole = 'ROLE_SCHOOLNURSE';
    } else if (currentUser.roles.includes('Manager') || currentUser.roles.includes('ROLE_TEACHER')) {
      primaryRole = 'ROLE_TEACHER';
    } else if (currentUser.roles.includes('Student') || currentUser.roles.includes('ROLE_STUDENT')) {
      primaryRole = 'ROLE_STUDENT';
    } else if (currentUser.roles.length > 0) {
      primaryRole = currentUser.roles[0]; // Fallback to first role if specific ones aren't matched
      console.log('[Navigation.js] Using fallback primary role:', primaryRole);
    }

    console.log('[Navigation.js] Determined primaryRole for navigation:', primaryRole);

    switch (primaryRole) {
      case 'ROLE_PARENT':
        console.log('[Navigation.js] Matched ROLE_PARENT');
        return [
          // Remove commonItems spread: // ...commonItems,
          { path: '/parent/dashboard', label: 'Parent Dashboard', icon: 'fas fa-tachometer-alt' },
          { path: '/parent/health-declaration', label: 'Health Declaration', icon: 'fas fa-file-medical-alt' },
          { path: '/parent/medication-submission', label: 'Submit Medication', icon: 'fas fa-pills' },
          { path: '/parent/vaccination-consent', label: 'Vaccination Consent', icon: 'fas fa-syringe' },
          { path: '/parent/checkup-information', label: 'Check up Information', icon: 'fas fa-clipboard-list' },
          { path: '/parent/notifications', label: 'Notifications', icon: 'fas fa-bell' },
          { path: '/parent/emergency-contacts', label: 'Emergency Contacts', icon: 'fas fa-phone' },
          { path: '/student-blog', label: 'Blog/News', icon: 'fas fa-blog' },
          { path: '/profile', label: 'Profile', icon: 'fas fa-user' }, // Keep profile accessible
        ];
      case 'ROLE_SCHOOLNURSE':
        console.log('[Navigation.js] Matched ROLE_SCHOOLNURSE');
        return [
          // Remove commonItems spread: // ...commonItems,
          { path: '/medical/dashboard', label: 'Medical Dashboard', icon: 'fas fa-tachometer-alt' }, // Added a specific dashboard path
          { path: '/medical/events', label: 'Medical Events', icon: 'fas fa-ambulance' },
          { path: '/medical/medication-management', label: 'Medication Management', icon: 'fas fa-capsules' }, // Corrected path
          { path: '/medical/vaccination-management', label: 'Vaccination Management', icon: 'fas fa-syringe' }, // Corrected path
          { path: '/medical/health-checkups', label: 'Health Checkups', icon: 'fas fa-stethoscope' }, // Corrected path
          { path: '/medical/student-management', label: 'Student Management', icon: 'fas fa-users' }, // Corrected path
          { path: '/medical/reports', label: 'Reports', icon: 'fas fa-chart-bar' }, // Corrected path
        ];
      case 'ROLE_TEACHER':
        console.log('[Navigation.js] Matched ROLE_TEACHER');
        return [
          // Remove commonItems spread: // ...commonItems,
          { path: '/teacher/dashboard', label: 'Teacher Dashboard', icon: 'fas fa-chalkboard-teacher' }, // Added a specific dashboard path
          { path: '/manager/reports', label: 'Reports & Analytics', icon: 'fas fa-chart-bar' },
          { path: '/manager/user-management', label: 'User Management', icon: 'fas fa-users-cog' },
          { path: '/manager/health-programs', label: 'Health Programs', icon: 'fas fa-heartbeat' },
          { path: '/manager/content', label: 'Content Management', icon: 'fas fa-file-alt' },
        ];
      case 'ROLE_ADMIN':
        console.log('[Navigation.js] Matched ROLE_ADMIN');
        return [
          // Remove commonItems spread: // ...commonItems,
          { path: '/admin/dashboard', label: 'Admin Dashboard', icon: 'fas fa-user-shield' }, // Added a specific dashboard path
          { path: '/admin/user-management', label: 'User Management', icon: 'fas fa-users-cog' },
          { path: '/admin/system-configuration', label: 'System Configuration', icon: 'fas fa-cogs' },
          { path: '/admin/analytics-reports', label: 'Reports & Analytics', icon: 'fas fa-chart-line' },
          { path: '/admin/health-programs', label: 'Health Programs', icon: 'fas fa-heartbeat' },
          { path: '/admin/data-export', label: 'Data Export', icon: 'fas fa-file-export' },
        ];
      case 'ROLE_STUDENT':
        console.log('[Navigation.js] Matched ROLE_STUDENT');
        return [
          // Remove commonItems spread: // ...commonItems,
          { path: '/student/dashboard', label: 'Student Dashboard', icon: 'fas fa-user-graduate' }, // Added a specific dashboard path
          { path: '/health-profile', label: 'Health Profile', icon: 'fas fa-heart' },
          { path: '/medical-history', label: 'Medical History', icon: 'fas fa-file-medical' },
          { path: '/vaccination-record', label: 'Vaccination Record', icon: 'fas fa-syringe' },
          { path: '/blog', label: 'Health Blog', icon: 'fas fa-blog' },
        ];
      default:
        console.log('[Navigation.js] Defaulting navigation items. No specific role match or primaryRole is null.');
        // For users with no specific role or unauthenticated, show minimal navigation or public links
        if (currentUser && currentUser.roles && currentUser.roles.length > 0) {
            // If user is authenticated but doesn't match a specific role dashboard, provide a generic one
            return [
                { path: '/dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
                { path: '/profile', label: 'Profile', icon: 'fas fa-user' },
              ];
        }
        // For truly unauthenticated or users with no roles array
        return [
            { path: '/', label: 'Home', icon: 'fas fa-home' },
            { path: '/login', label: 'Login', icon: 'fas fa-sign-in-alt' },
            { path: '/register', label: 'Register', icon: 'fas fa-user-plus' },
        ];
    }
  };

  const navigationItems = getNavigationItems();

  // Debugging: Log user and determined navigation items
  // console.log('Navigation User:', currentUser); // Covered by enhanced log above
  console.log('[Navigation.js] Final navigationItems:', navigationItems);

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
