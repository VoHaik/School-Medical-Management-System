// NOTE VN: Component AppMenu - Menu dropdown cho authenticated users
// - Hiển thị navigation items dựa trên user roles
// - Quản lý logout functionality
// - Material-UI List components với icons
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Box, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Divider, Typography, Button } from '@mui/material';
import { ExitToApp as ExitToAppIcon, AccountCircle as AccountCircleIcon } from '@mui/icons-material';

// NOTE VN: Helper component để render Font Awesome icons
// - Convert Font Awesome class thành React component
// - Styling consistent cho tất cả icons
const IconRenderer = ({ iconClass }) => <i className={iconClass} style={{ marginRight: '8px', fontSize: '1.25em' }} />;

const AppMenu = ({ isOpen, closeMenu }) => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // NOTE VN: Early return nếu menu không mở hoặc user chưa đăng nhập
  if (!isOpen || !currentUser) {
    return null;
  }

  // NOTE VN: Hàm xử lý logout - Clear auth state và redirect
  const handleLogout = () => {
    logout();
    navigate('/');
    if (closeMenu) closeMenu();
  };

  // NOTE VN: Hàm tạo navigation items dựa trên user roles
  // - Kiểm tra role hierarchy và return appropriate menu items
  // - Primary role được ưu tiên theo thứ tự: ADMIN > PARENT > SCHOOLNURSE > TEACHER > STUDENT
  const getNavigationItems = () => {
    const roles = currentUser.roles || [];
    let items = [];

    // NOTE VN: Xác định primary role cho navigation
    let primaryRole = null;
    if (roles.includes('ROLE_ADMIN')) {
      primaryRole = 'ROLE_ADMIN';
    } else if (roles.includes('ROLE_PARENT')) {
      primaryRole = 'ROLE_PARENT';
    } else if (roles.includes('ROLE_SCHOOLNURSE')) {
      primaryRole = 'ROLE_SCHOOLNURSE';
    } else if (roles.includes('ROLE_TEACHER')) {
      primaryRole = 'ROLE_TEACHER';
    } else if (roles.includes('ROLE_STUDENT')) {
      primaryRole = 'ROLE_STUDENT';
    } else if (roles.length > 0) {
      primaryRole = roles[0]; 
    }

    // NOTE VN: Switch case để tạo menu items cho từng role
    switch (primaryRole) {
      case 'ROLE_PARENT':
        // NOTE VN: Menu items cho Parent role
        items = [
          { path: '/parent/dashboard', label: 'Parent Dashboard', icon: 'fas fa-tachometer-alt' },
          { path: '/parent/health-declaration', label: 'Health Declaration', icon: 'fas fa-file-medical-alt' },
          { path: '/parent/medication-submission', label: 'Submit Medication', icon: 'fas fa-pills' },
          { path: '/parent/vaccination-consent', label: 'Vaccination Consent', icon: 'fas fa-syringe' },
          { path: '/parent/checkup-history', label: 'Checkup History', icon: 'fas fa-history' },
          { path: '/parent/notifications', label: 'Notifications', icon: 'fas fa-bell' },
          { path: '/parent/emergency-contacts', label: 'Emergency Contacts', icon: 'fas fa-phone' },
          { path: '/student-blog', label: 'Blog/News', icon: 'fas fa-blog' },
        ];
        break;
      case 'ROLE_SCHOOLNURSE':
        // NOTE VN: Menu items cho School Nurse role
        items = [
          { path: '/medical/dashboard', label: 'Nurse Dashboard', icon: 'fas fa-user-nurse' },
          { path: '/medical/medication-requests', label: 'Medication Requests', icon: 'fas fa-prescription-bottle-alt' },
          { path: '/medical/health-checkups', label: 'Health Checkups & Screenings', icon: 'fas fa-stethoscope' },
          { path: '/medical/student-management', label: 'Student Health Profiles', icon: 'fas fa-users' },
          { path: '/medical/events', label: 'Medical Events & Incidents', icon: 'fas fa-ambulance' },
          { path: '/medical/medication-management', label: 'Medication Management', icon: 'fas fa-capsules' },
          { path: '/medical/vaccination-management', label: 'Vaccination Management', icon: 'fas fa-syringe' },
          { path: '/medical/reports', label: 'Health Reports & Analytics', icon: 'fas fa-chart-bar' },
        ];
        break;
      case 'ROLE_TEACHER': // NOTE VN: Teacher role (manager functionality)
        items = [
          { path: '/teacher/dashboard', label: 'Teacher Dashboard', icon: 'fas fa-chalkboard-teacher' },
          { path: '/manager/reports', label: 'Reports & Analytics', icon: 'fas fa-chart-bar' },
          { path: '/manager/user-management', label: 'User Management', icon: 'fas fa-users-cog' },
          { path: '/manager/health-programs', label: 'Health Programs', icon: 'fas fa-heartbeat' },
          { path: '/manager/content', label: 'Content Management', icon: 'fas fa-file-alt' },
        ];
        break;
      case 'ROLE_ADMIN':
        // NOTE VN: Menu items cho Admin role - Full system access
        items = [
          { path: '/admin/dashboard', label: 'Admin Dashboard', icon: 'fas fa-user-shield' },
          { path: '/admin/user-management', label: 'User Management', icon: 'fas fa-users-cog' },
          { path: '/admin/system-configuration', label: 'System Configuration', icon: 'fas fa-cogs' },
          { path: '/admin/analytics-reports', label: 'Reports & Analytics', icon: 'fas fa-chart-line' },
          { path: '/admin/health-programs', label: 'Health Programs', icon: 'fas fa-heartbeat' },
          { path: '/admin/data-export', label: 'Data Export', icon: 'fas fa-file-export' },
        ];
        break;
      case 'ROLE_STUDENT':
        // NOTE VN: Menu items cho Student role
        items = [
          { path: '/student/dashboard', label: 'Student Dashboard', icon: 'fas fa-user-graduate' },
          { path: '/health-profile', label: 'Health Profile', icon: 'fas fa-heart' },
          { path: '/medical-history', label: 'Medical History', icon: 'fas fa-file-medical' },
          { path: '/vaccination-record', label: 'Vaccination Record', icon: 'fas fa-syringe' },
          { path: '/blog', label: 'Health Blog', icon: 'fas fa-blog' },
          { path: '/student/profile', label: 'Profile', icon: 'fas fa-user-circle' },
        ];
        break;
      default:
        items = []; // NOTE VN: Không có menu items nếu role không khớp
    }
    
    // NOTE VN: Thêm Profile link cho tất cả authenticated users nếu chưa có
    // Kiểm tra xem đã có profile link chưa để tránh duplicate
    if (!items.find(item => item.path === '/profile' || item.path === '/student/profile')) {
        items.push({ path: '/profile', label: 'Profile', icon: 'fas fa-user-circle' });
    }
    return items;
  };

  const navigationItems = getNavigationItems();

  return (
    // NOTE VN: Material-UI Box container cho dropdown menu
    // - Position absolute với top/right positioning
    // - Shadow và border radius cho modern UI
    // - Z-index cao để hiển thị trên các elements khác
    <Box
      sx={{
        position: 'absolute',
        top: '64px', // NOTE VN: Điều chỉnh dựa trên chiều cao header
        right: '10px',
        width: '280px',
        bgcolor: 'background.paper',
        color: 'text.primary', // NOTE VN: Đảm bảo contrast với background
        boxShadow: '0px 4px 20px rgba(0,0,0,0.15)',
        borderRadius: '8px',
        zIndex: 1300, // NOTE VN: Z-index cao hơn MUI Dialogs (1200-1300)
        overflow: 'hidden',
      }}
    >
      {/* NOTE VN: Header section với user welcome message */}
      <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        <Typography variant="subtitle1" fontWeight="medium">
          Welcome, {currentUser.fullName || currentUser.username}
        </Typography>
      </Box>
      <Divider />
      
      {/* NOTE VN: Navigation items list với scroll support */}
      <List dense sx={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', p:1 }}>
        {navigationItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton component={Link} to={item.path} onClick={closeMenu}>
              <ListItemIcon sx={{minWidth: '32px'}}>
                <IconRenderer iconClass={item.icon} />
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      
      {/* NOTE VN: Logout button section */}
      <Box sx={{ p: 1.5 }}>
        <Button
          variant="contained"
          color="error" // NOTE VN: Error color cho logout action
          startIcon={<ExitToAppIcon />}
          onClick={handleLogout}
          fullWidth
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

// NOTE VN: Export AppMenu component
// CHỨC NĂNG CHÍNH:
// 1. Role-based navigation menu system
// 2. Dynamic menu items dựa trên user roles (ADMIN, PARENT, SCHOOLNURSE, TEACHER, STUDENT)
// 3. Material-UI integration với responsive design
// 4. Icon rendering với Font Awesome support
// 5. Authentication state management
// 6. Logout functionality với navigation
// 7. Dropdown positioning và styling
// 8. User welcome display

export default AppMenu;
