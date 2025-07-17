import React, { useContext, useState } from 'react'; // Added useState
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ThemeToggle from './shared/ThemeToggle';
import AppMenu from './AppMenu'; // Import the new AppMenu component
import { IconButton } from '@mui/material'; // For menu button. Removed Badge as NotificationBell handles it.
import MenuIcon from '@mui/icons-material/Menu'; // Standard menu icon
// import NotificationsIcon from '@mui/icons-material/Notifications'; // Removed, NotificationBell handles its own icon
import NotificationBell from './NotificationBell'; // Import NotificationBell

const Header = () => {
  const { currentUser, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // State to control menu visibility

  // Debug authentication state
  console.log('Header render - Authentication state:', {
    isAuthenticated: isAuthenticated(),
    currentUser,
    token: localStorage.getItem('token'),
    userRoles: currentUser?.roles,
    hasStudentRole: currentUser?.roles?.includes('ROLE_STUDENT'),
    hasParentRole: currentUser?.roles?.includes('ROLE_PARENT')
  });

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/');
    handleCloseMenu(); // Close menu after logout
  };

  return (
    <header className="header-animated text-white p-4 sticky top-0 z-50" style={{ backgroundColor: '#4A90E2' /* Blue dashboard color */ }}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <i className="fas fa-heartbeat text-2xl mr-2 animate-pulse"></i>
          <Link to="/" className="text-2xl font-bold hover:text-gray-200">FPT Junior High School Health Management System</Link>
        </div>
        <nav className="flex space-x-2 items-center">
          <ThemeToggle />
          
          {isAuthenticated() ? (
            <>
              {/* Integrate NotificationBell */}
              <NotificationBell />

              {/* User Menu Button */}
              <IconButton
                color="inherit"
                onClick={handleMenuToggle}
                aria-label="Open user menu"
                aria-controls={menuOpen ? 'app-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={menuOpen ? 'true' : undefined}
              >
                <MenuIcon />
              </IconButton>
              <AppMenu isOpen={menuOpen} closeMenu={handleCloseMenu} />
            </>
          ) : (
            // Guest users - minimal header with just login link
            <Link to="/login" className="nav-link px-4 py-2 bg-white text-blue-600 rounded hover:bg-gray-100 flex items-center font-medium">
              <i className="fas fa-sign-in-alt mr-2"></i> Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;