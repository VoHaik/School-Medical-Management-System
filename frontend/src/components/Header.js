import React, { useContext, useState } from 'react'; // Added useState
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import DarkModeToggle from './DarkModeToggle';
import AppMenu from './AppMenu'; // Import the new AppMenu component
import { IconButton, Badge } from '@mui/material'; // For menu button
import MenuIcon from '@mui/icons-material/Menu'; // Standard menu icon
import NotificationsIcon from '@mui/icons-material/Notifications'; // Example for a notification icon

// NOTE VN: Component Header chính của ứng dụng
// - Quản lý authentication state và navigation
// - Hiển thị menu cho user đã đăng nhập
// - Responsive design với Material-UI icons

const Header = () => {
  const { currentUser, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // State to control menu visibility

  // NOTE VN: Debug authentication state - Kiểm tra trạng thái đăng nhập
  // - Log ra console để debug các role và user info
  // - Kiểm tra ROLE_STUDENT và ROLE_PARENT
  console.log('Header render - Authentication state:', {
    isAuthenticated: isAuthenticated(),
    currentUser,
    userRoles: currentUser?.roles,
    hasStudentRole: currentUser?.roles?.includes('ROLE_STUDENT'),
    hasParentRole: currentUser?.roles?.includes('ROLE_PARENT')
  });

  // NOTE VN: Hàm toggle menu - Mở/đóng menu dropdown
  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  // NOTE VN: Hàm đóng menu - Dùng khi click outside hoặc chọn item
  const handleCloseMenu = () => {
    setMenuOpen(false);
  };

  // NOTE VN: Hàm logout - Xử lý đăng xuất và redirect về home
  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/');
  };

  return (
    // NOTE VN: Header chính với sticky position và blue theme
    // - Sticky top-0 z-50: Luôn hiển thị ở đầu trang
    // - Background màu xanh #4A90E2 (màu dashboard)
    <header className="header-animated text-white p-4 sticky top-0 z-50" style={{ backgroundColor: '#4A90E2' /* Blue dashboard color */ }}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          {/* NOTE VN: Logo với heartbeat icon animation */}
          <i className="fas fa-heartbeat text-2xl mr-2 animate-pulse"></i>
          <Link to="/" className="text-2xl font-bold hover:text-gray-200">School Health Management System</Link>
        </div>
        <nav className="flex space-x-2 items-center">
          {/* NOTE VN: Dark mode toggle component */}
          <DarkModeToggle />
          
          {isAuthenticated() ? (
            <>
              {/* NOTE VN: Notification Icon - Badge hiển thị số thông báo */}
              <IconButton color="inherit" onClick={() => navigate('/parent/notifications')} sx={{ mr: 1}}>
                <Badge badgeContent={currentUser?.notificationCount || 0} color="error"> {/* Assuming notificationCount is available */}
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              {/* NOTE VN: User Menu Button - Hamburger menu với accessibility */}
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
              {/* NOTE VN: AppMenu component - Dropdown menu cho user */}
              <AppMenu isOpen={menuOpen} closeMenu={handleCloseMenu} />
            </>
          ) : (
            <>
              {/* NOTE VN: Public navigation links - Hiển thị khi chưa đăng nhập */}
              <Link to="/" className="nav-link px-3 py-2 rounded flex items-center">
                <i className="fas fa-home mr-1"></i> Home
              </Link>
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

// NOTE VN: Export Header component
// CHỨC NĂNG CHÍNH:
// 1. Authentication state management
// 2. Responsive navigation với conditional rendering
// 3. Material-UI integration với icons và badges
// 4. Dropdown menu system cho authenticated users
// 5. Public navigation cho guest users
// 6. Dark mode toggle integration
// 7. Notification system với badge counter
// 8. Accessibility support với ARIA attributes

export default Header;