import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  useTheme,
  alpha,
  Avatar,
  Chip,
  Hidden,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Dashboard,
  MedicalServices,
  School,
  Assignment,
  Vaccines,
  LocalHospital,
  Analytics,
  Settings,
  Home,
  Login,
  PersonAdd,
  Logout,
  FavoriteOutlined,
  MenuBook,
  SupervisorAccount,
  AdminPanelSettings,
  MoreVert,
} from '@mui/icons-material';

const Navigation = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const location = useLocation();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getIconByName = (iconName) => {
    const iconMap = {
      'fas fa-tachometer-alt': <Dashboard />,
      'fas fa-file-medical-alt': <Assignment />,
      'fas fa-pills': <MedicalServices />,
      'fas fa-syringe': <Vaccines />,
      'fas fa-clipboard-list': <Assignment />,
      'fas fa-blog': <MenuBook />,
      'fas fa-ambulance': <LocalHospital />,
      'fas fa-capsules': <MedicalServices />,
      'fas fa-stethoscope': <FavoriteOutlined />,
      'fas fa-users': <School />,
      'fas fa-edit': <Assignment />,
      'fas fa-chart-bar': <Analytics />,
      'fas fa-chalkboard-teacher': <SupervisorAccount />,
      'fas fa-users-cog': <Settings />,
      'fas fa-heartbeat': <FavoriteOutlined />,
      'fas fa-file-alt': <Assignment />,
      'fas fa-user-shield': <AdminPanelSettings />,
      'fas fa-chart-line': <Analytics />,
      'fas fa-file-export': <Assignment />,
      'fas fa-user-graduate': <School />,
      'fas fa-heart': <FavoriteOutlined />,
      'fas fa-file-medical': <Assignment />,
      'fas fa-user-circle': <Settings />,
      'fas fa-home': <Home />,
      'fas fa-sign-in-alt': <Login />,
      'fas fa-user-plus': <PersonAdd />,
    };
    return iconMap[iconName] || <Dashboard />;
  };

  const getNavigationItems = () => {
    // Enhanced log

    if (!currentUser || !currentUser.roles || !Array.isArray(currentUser.roles)) {
      // Return common items or empty array if user is not fully loaded or has no roles
      return currentUser ? [
        { path: '/dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
        { path: '/profile', label: 'Profile', icon: 'fas fa-user' },
      ] : [];
    }

    // Determine the primary role for navigation.
    let primaryRole = null;    if (currentUser.roles.includes('Admin') || currentUser.roles.includes('ROLE_ADMIN')) {
      primaryRole = 'ROLE_ADMIN';
    } else if (currentUser.roles.includes('Parent') || currentUser.roles.includes('ROLE_PARENT')) {
      primaryRole = 'ROLE_PARENT';
    } else if (currentUser.roles.includes('SchoolNurse') || currentUser.roles.includes('ROLE_SCHOOLNURSE')) {
      primaryRole = 'ROLE_SCHOOLNURSE';
    } else if (currentUser.roles.includes('Student') || currentUser.roles.includes('ROLE_STUDENT')) {
      primaryRole = 'ROLE_STUDENT';
    } else if (currentUser.roles.length > 0) {
      primaryRole = currentUser.roles[0]; // Fallback to first role if specific ones aren't matched
      }

    switch (primaryRole) {
      case 'ROLE_PARENT':
        return [
          { path: '/parent/dashboard', label: 'Parent Dashboard', icon: 'fas fa-tachometer-alt' },
          { path: '/parent/health-declaration', label: 'Health Declaration', icon: 'fas fa-file-medical-alt' },
          { path: '/parent/medication-submission', label: 'Submit Medication', icon: 'fas fa-pills' },
          { path: '/parent/vaccination-consent', label: 'Vaccination Consent', icon: 'fas fa-syringe' },
          { path: '/parent/checkup-information', label: 'Check up Information', icon: 'fas fa-clipboard-list' },
          { path: '/health-blog', label: 'Health Blog', icon: 'fas fa-blog' },
        ];
      case 'ROLE_SCHOOLNURSE':
        return [
          // Remove commonItems spread: // ...commonItems,
          { path: '/medical/dashboard', label: 'Medical Dashboard', icon: 'fas fa-tachometer-alt' }, // Added a specific dashboard path
          { path: '/medical/events', label: 'Medical Events', icon: 'fas fa-ambulance' },
          { path: '/medical/medication-management', label: 'Medication Management', icon: 'fas fa-capsules' }, // Corrected path
          { path: '/medical/vaccination-management', label: 'Vaccination Management', icon: 'fas fa-syringe' }, // Corrected path
          { path: '/medical/health-checkups', label: 'Health Checkups', icon: 'fas fa-stethoscope' }, // Corrected path
          { path: '/medical/student-management', label: 'Student Management', icon: 'fas fa-users' }, // Corrected path
          { path: '/nurse/blog', label: 'Manage Health Blog', icon: 'fas fa-edit' },
          { path: '/health-blog', label: 'View Health Blog', icon: 'fas fa-blog' },
          { path: '/medical/reports', label: 'Reports', icon: 'fas fa-chart-bar' }, // Corrected path
        ];
      case 'ROLE_ADMIN':
        return [
          { path: '/admin/dashboard', label: 'Admin Dashboard', icon: 'fas fa-user-shield' },
          { path: '/admin/user-management', label: 'User Management', icon: 'fas fa-users-cog' },
          { path: '/admin/analytics-reports', label: 'Reports & Analytics', icon: 'fas fa-chart-line' },
          { path: '/admin/health-programs', label: 'Health Programs', icon: 'fas fa-heartbeat' },
          { path: '/admin/data-export', label: 'Data Export', icon: 'fas fa-file-export' },
        ];
      case 'ROLE_STUDENT':
        return [
          { path: '/student/dashboard', label: 'Student Dashboard', icon: 'fas fa-user-graduate' },
          { path: '/health-profile', label: 'Health Profile', icon: 'fas fa-heart' },
          { path: '/medical-history', label: 'Medical History', icon: 'fas fa-file-medical' },
          { path: '/vaccination-record', label: 'Vaccination Record', icon: 'fas fa-syringe' },
          { path: '/profile', label: 'Profile', icon: 'fas fa-user-circle' },
        ];
      default:
        // For users with no specific role or unauthenticated, show minimal navigation or public links
        if (currentUser && currentUser.roles && currentUser.roles.length > 0) {
            // If user is authenticated but doesn't match a specific role dashboard, provide a generic one
            return [
                { path: '/dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
              ];
        }
        // For truly unauthenticated or users with no roles array
        return [
            { path: '/', label: 'Home', icon: 'fas fa-home' },
            { path: '/health-blog', label: 'Health Blog', icon: 'fas fa-blog' },
            { path: '/login', label: 'Login', icon: 'fas fa-sign-in-alt' },
            { path: '/register', label: 'Register', icon: 'fas fa-user-plus' },
        ];
    }
  };

  const navigationItems = getNavigationItems();

  // Debugging: Log user and determined navigation items
  // // Covered by enhanced log above
  return (
    <AppBar
      position="sticky"
      elevation={2}
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ py: 1 }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
              <Avatar
                sx={{
                  mr: 2,
                  bgcolor: alpha('#fff', 0.2),
                  color: 'white',
                  fontSize: '1.5rem'
                }}
              >
                <FavoriteOutlined />
              </Avatar>
              <Typography
                variant="h6"
                component={Link}
                to="/"
                sx={{
                  fontWeight: 'bold',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  '&:hover': { opacity: 0.9 }
                }}
              >
                FPT Junior High School
              </Typography>
            </Box>
          </motion.div>

          {currentUser && (
            <Box display="flex" alignItems="center" gap={1}>
              {/* Desktop Navigation */}
              <Hidden mdDown>
                <Box display="flex" alignItems="center" gap={1}>
                  {navigationItems.slice(0, 4).map((item, index) => (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      <Button
                        component={Link}
                        to={item.path}
                        startIcon={getIconByName(item.icon)}
                        sx={{
                          color: 'white',
                          borderRadius: 2,
                          px: 2,
                          py: 1,
                          minWidth: 'auto',
                          backgroundColor: location.pathname === item.path 
                            ? alpha('#fff', 0.2) 
                            : 'transparent',
                          '&:hover': {
                            backgroundColor: alpha('#fff', 0.1),
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.2s ease-in-out',
                        }}
                      >
                        <Typography variant="body2" fontWeight="medium">
                          {item.label}
                        </Typography>
                      </Button>
                    </motion.div>
                  ))}
                  
                  {navigationItems.length > 4 && (
                    <IconButton
                      onClick={handleMenuOpen}
                      sx={{ 
                        color: 'white',
                        '&:hover': { backgroundColor: alpha('#fff', 0.1) }
                      }}
                    >
                      <MoreVert />
                    </IconButton>
                  )}
                </Box>
              </Hidden>

              {/* User Menu */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Hidden smDown>
                    <Box textAlign="right">
                      <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
                        Welcome back
                      </Typography>
                      <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 'bold' }}>
                        {currentUser.fullName || currentUser.username}
                      </Typography>
                    </Box>
                  </Hidden>
                  
                  <Avatar
                    sx={{
                      bgcolor: alpha('#fff', 0.2),
                      color: 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        bgcolor: alpha('#fff', 0.3),
                      }
                    }}
                  >
                    {currentUser.fullName?.charAt(0) || currentUser.username?.charAt(0) || 'U'}
                  </Avatar>
                  
                  <Button
                    onClick={logout}
                    startIcon={<Logout />}
                    sx={{
                      color: 'white',
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: alpha('#fff', 0.1),
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    <Hidden smDown>
                      Logout
                    </Hidden>
                  </Button>
                </Box>
              </motion.div>
            </Box>
          )}
        </Toolbar>
      </Container>

      {/* Dropdown Menu for Extra Items */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 2,
            borderRadius: 2,
            minWidth: 200,
            boxShadow: theme.shadows[8],
          }
        }}
      >
        {navigationItems.slice(4).map((item) => (
          <MenuItem
            key={item.path}
            component={Link}
            to={item.path}
            onClick={handleMenuClose}
            sx={{
              gap: 2,
              py: 1.5,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              }
            }}
          >
            {getIconByName(item.icon)}
            <Typography variant="body2">{item.label}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </AppBar>
  );
};

export default Navigation;
