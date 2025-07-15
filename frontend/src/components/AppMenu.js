import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Box, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Divider, Typography, Button } from '@mui/material';
import { ExitToApp as ExitToAppIcon } from '@mui/icons-material';

// Helper to convert Font Awesome class to a component if needed, or just use <i>
const IconRenderer = ({ iconClass }) => <i className={iconClass} style={{ marginRight: '8px', fontSize: '1.25em' }} />;

const AppMenu = ({ isOpen, closeMenu }) => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!isOpen || !currentUser) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
    if (closeMenu) closeMenu();
  };

  const getNavigationItems = () => {
    const roles = currentUser.roles || [];
    let items = [];

    // Determine the primary role for navigation.
    let primaryRole = null;    if (roles.includes('Admin') || roles.includes('ROLE_ADMIN')) {
      primaryRole = 'ROLE_ADMIN';
    } else if (roles.includes('Parent') || roles.includes('ROLE_PARENT')) {
      primaryRole = 'ROLE_PARENT';
    } else if (roles.includes('SchoolNurse') || roles.includes('ROLE_SCHOOLNURSE')) {
      primaryRole = 'ROLE_SCHOOLNURSE';
    } else if (roles.includes('Student') || roles.includes('ROLE_STUDENT')) {
      primaryRole = 'ROLE_STUDENT';
    } else if (roles.length > 0) {
      primaryRole = roles[0]; 
    }

    switch (primaryRole) {
      case 'ROLE_PARENT':
        items = [
          { path: '/parent/dashboard', label: 'Parent Dashboard', icon: 'fas fa-tachometer-alt' },
          { path: '/parent/health-declaration', label: 'Health Declaration', icon: 'fas fa-file-medical-alt' },
          { path: '/parent/health-records', label: 'Health Records', icon: 'fas fa-heartbeat' },
          { path: '/parent/student-health-profile', label: 'Health Profile', icon: 'fas fa-user-md' },
          { path: '/parent/medication-submission', label: 'Submit Medication', icon: 'fas fa-pills' },
          { path: '/parent/my-requests', label: 'View Medication Requests', icon: 'fas fa-list-alt' },
          { path: '/parent/vaccination-consent', label: 'Vaccination Consent', icon: 'fas fa-syringe' },
          { path: '/parent/checkup-information', label: 'Check up Information', icon: 'fas fa-clipboard-list' },
          { path: '/health-docs', label: 'Health Docs', icon: 'fas fa-file-medical' },
          { path: '/health-blog', label: 'Health Blog', icon: 'fas fa-blog' },
        ];
        break;
      case 'ROLE_SCHOOLNURSE':
        items = [
          { path: '/medical/dashboard', label: 'Medical Dashboard', icon: 'fas fa-tachometer-alt' },
          { path: '/nurse/health-declaration-approval', label: 'Health Declaration Review', icon: 'fas fa-clipboard-check' },
          { path: '/medical/medication-management', label: 'Medication Management', icon: 'fas fa-capsules' },
          { path: '/nurse/health-checkup-events', label: 'Create and Organize Event', icon: 'fas fa-calendar-check' },
          { path: '/medical/vaccination-management', label: 'Vaccination Management', icon: 'fas fa-syringe' },
          { path: '/medical/health-checkups', label: 'Health Checkups', icon: 'fas fa-stethoscope' },
          { path: '/medical/student-management', label: 'Student Management', icon: 'fas fa-users' },
          { path: '/health-docs', label: 'Health Docs', icon: 'fas fa-file-medical' },
          { path: '/nurse/blog', label: 'Health Blog Management', icon: 'fas fa-blog' },
        ];
        break;
      case 'ROLE_ADMIN':
        items = [
          { path: '/admin/dashboard', label: 'Admin Dashboard', icon: 'fas fa-user-shield' },
          { path: '/admin/user-management', label: 'User Management', icon: 'fas fa-users-cog' },
          { path: '/admin/parent-registration-management', label: 'Parent Registration', icon: 'fas fa-user-plus' },
          { path: '/admin/health-programs', label: 'Health Programs', icon: 'fas fa-heartbeat' },
          { path: '/admin/data-export', label: 'Data Export', icon: 'fas fa-file-export' },
          { path: '/health-docs', label: 'Health Docs', icon: 'fas fa-file-medical' },
          { path: '/health-blog', label: 'Health Blog', icon: 'fas fa-blog' },
        ];
        break;
      case 'ROLE_STUDENT':
        items = [
          { path: '/student/dashboard', label: 'Student Dashboard', icon: 'fas fa-user-graduate' },
          { path: '/health-profile', label: 'Health Profile', icon: 'fas fa-heart' },
          { path: '/medical-history', label: 'Medical History', icon: 'fas fa-file-medical' },
          { path: '/vaccination-record', label: 'Vaccination Record', icon: 'fas fa-syringe' },
          { path: '/profile', label: 'Profile', icon: 'fas fa-user-circle' },
          { path: '/health-docs', label: 'Health Docs', icon: 'fas fa-file-medical' },
          { path: '/health-blog', label: 'Health Blog', icon: 'fas fa-blog' },
        ];
        break;
      default:
        items = []; // No specific items if role doesn't match known ones
    }
    
    // Only add Profile link for students
    if (primaryRole === 'ROLE_STUDENT' && !items.find(item => item.path === '/profile')) {
        items.push({ path: '/profile', label: 'Profile', icon: 'fas fa-user-circle' });
    }
    
    return items;
  };

  const navigationItems = getNavigationItems();

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '64px', // Adjust based on actual header height
        right: '10px',
        width: '280px',
        bgcolor: 'background.paper',
        color: 'text.primary', // Ensure text color contrasts with background
        boxShadow: '0px 4px 20px rgba(0,0,0,0.15)',
        borderRadius: '8px',
        zIndex: 1300, // Ensure it's above other content like MUI Dialogs (often 1200-1300)
        overflow: 'hidden',
      }}
    >
      <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        <Typography variant="subtitle1" fontWeight="medium">
          Welcome, {currentUser.fullName || currentUser.username}
        </Typography>
      </Box>
      <Divider />
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
      <Box sx={{ p: 1.5 }}>
        <Button
          variant="contained"
          color="error" // Using error color for logout often implies a final action
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

export default AppMenu;
