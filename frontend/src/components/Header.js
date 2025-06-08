import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import DarkModeToggle from './DarkModeToggle'; // Add this import

const Header = () => {
  const { currentUser, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  // Debug authentication state
  console.log('Header render - Authentication state:', {
    isAuthenticated: isAuthenticated(),
    currentUser,
    userRoles: currentUser?.roles,
    hasStudentRole: currentUser?.roles?.includes('ROLE_STUDENT'),
    hasParentRole: currentUser?.roles?.includes('ROLE_PARENT')
  });

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/');
  };

  return (
    <header className="header-animated text-white p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <i className="fas fa-heartbeat text-2xl mr-2 animate-pulse"></i>
          <h1 className="text-2xl font-bold">School Health Management System</h1>
        </div>
        <nav className="flex space-x-2 items-center"> {/* Add items-center */}
          <DarkModeToggle /> {/* Add the dark mode toggle */}
          <Link to="/" className="nav-link px-3 py-2 rounded flex items-center">
            <i className="fas fa-home mr-1"></i> Home
          </Link>
          
          {isAuthenticated() ? (
            // Authenticated user navigation
            <>              {currentUser && (
                currentUser.roles.includes('ROLE_STUDENT') || 
                currentUser.roles.includes('ROLE_Student') || 
                currentUser.roles.includes('ROLE_PARENT') || 
                currentUser.roles.includes('ROLE_Parent')
              ) && (
                <>
                  <Link to="/student-profile" className="nav-link px-3 py-2 rounded flex items-center">
                    <i className="fas fa-user mr-1"></i> My Profile
                  </Link>
                  <Link to="/student-blog" className="nav-link px-3 py-2 rounded flex items-center">
                    <i className="fas fa-blog mr-1"></i> My Blog
                  </Link>
                </>
              )}
              <button onClick={handleLogout} className="nav-link px-3 py-2 rounded flex items-center">
                <i className="fas fa-sign-out-alt mr-1"></i> Logout
              </button>
            </>
          ) : (
            // Non-authenticated user navigation
            <>
              <Link to="/#docs" className="nav-link px-3 py-2 rounded flex items-center">
                <i className="fas fa-file-medical mr-1"></i> Health Docs
              </Link>
              <Link to="/#blog" className="nav-link px-3 py-2 rounded flex items-center">
                <i className="fas fa-blog mr-1"></i> Blog
              </Link>
              <Link to="/login" className="nav-link px-3 py-2 rounded flex items-center">
                <i className="fas fa-sign-in-alt mr-1"></i> Login
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;