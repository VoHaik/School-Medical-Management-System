import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// console.log('--- ProtectedRoute.js MODULE LOADED - V3 ---');
// console.log('[ProtectedRoute] MODULE LOADED - This log is at the top of ProtectedRoute.js'); // New log

function ProtectedRoute({ children, allowedRoles = [] }) {
  // console.log('[ProtectedRoute] FUNCTION CALLED - Path:', window.location.pathname); // New log
  const { currentUser, loading } = useContext(AuthContext);

  // console.log('[ProtectedRoute] Component rendered. Loading:', loading, 'CurrentUser:', currentUser);
  // console.log('[ProtectedRoute] Allowed roles for this route:', allowedRoles);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  if (!currentUser) {
    // console.error('[ProtectedRoute] CRITICAL: No currentUser found. Redirecting to login.');
    return <Navigate to="/login" replace />;
  }

  // console.log('[ProtectedRoute] Checking roles. currentUser.roles:', currentUser.roles);
  const userHasRequiredRole =
    allowedRoles.length === 0 ||
    (currentUser.roles && currentUser.roles.some(role => allowedRoles.includes(role)));

  console.log('[ProtectedRoute] Result of role check - userHasRequiredRole:', userHasRequiredRole);

  if (!userHasRequiredRole) {
    // console.error(
    //   '[ProtectedRoute] CRITICAL: Access Denied. User roles:',
    //   currentUser.roles,
    //   'Required roles for route:',
    //   allowedRoles
    // );
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

export default ProtectedRoute;