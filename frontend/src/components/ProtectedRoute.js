// NOTE VN: Component ProtectedRoute - Route protection với role-based access
// - Kiểm tra authentication state và user roles
// - Redirect unauthenticated users đến login
// - Display access denied cho insufficient permissions
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { currentUser, loading } = useContext(AuthContext);

  // NOTE VN: Loading state - Hiển thị spinner khi đang check auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  // NOTE VN: Unauthenticated user - Redirect đến login page
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // NOTE VN: Role-based access control - Check user role against allowed roles
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

  // NOTE VN: Authorized user - Render protected content
  return children;
}

// NOTE VN: Export ProtectedRoute component
// CHỨC NĂNG CHÍNH:
// 1. Authentication guard cho protected routes
// 2. Role-based access control (RBAC)
// 3. Loading state management
// 4. Redirect unauthenticated users
// 5. Access denied UI cho unauthorized users
// 6. Navigation history support với Go Back button

export default ProtectedRoute; 