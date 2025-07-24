import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getAdminDashboardStats, getStudentDashboard } from '../utils/api';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Skeleton,
  useTheme,
  alpha,
  IconButton,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  MedicalServices,
  PersonAdd,
  Analytics,
  Event,
  Settings,
  FavoriteOutlined,
  LocalHospital,
  Vaccines,
  Assignment,
  CalendarToday,
  School,
  MenuBook,
  TrendingUp,
  AccessTime,
} from '@mui/icons-material';

const Dashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const theme = useTheme();
  const [dashboardData, setDashboardData] = useState({
    upcomingEvents: [],
    quickStats: {},
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [currentUser]);

  const fetchDashboardData = async () => {
    try {
      // Temporarily disable dashboard API calls due to backend endpoint issues
      // Return mock data structure to prevent errors
      const mockResponse = {
        quickStats: {
          totalAppointments: 0,
          pendingVaccinations: 0,
          healthDeclarations: 0,
          unreadNotifications: 0
        },
        recentActivities: [
          {
            id: 1,
            type: 'info',
            title: 'System Status',
            description: 'Dashboard functionality is being updated. Please use the navigation menu to access specific features.',
            time: new Date().toISOString()
          }
        ],
        healthProfile: { hasData: false, message: 'Dashboard temporarily unavailable' }
      };
      
      setDashboardData(mockResponse);
    } catch (error) {
      console.error('Error in dashboard:', error);
      // Set default data structure on any error
      setDashboardData({
        quickStats: {},
        recentActivities: []
      });
    } finally {
      setLoading(false);
    }
  };

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    return `${greeting}, ${currentUser?.fullName || currentUser?.username}!`;
  };

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const getRoleSpecificContent = () => {
    const userRole = currentUser?.roles?.[0] || '';
    
    // Debug logging
    console.log('DashboardNew - currentUser:', currentUser);
    console.log('DashboardNew - userRole:', userRole);
    console.log('DashboardNew - all roles:', currentUser?.roles);
    
    if (userRole === 'ROLE_PARENT' || userRole === 'Parent') {
      // Redirect parent users to the dedicated parent dashboard
      window.location.href = '/parent/dashboard';
      return (
        <Box textAlign="center" py={8}>
          <Typography color="text.secondary">Redirecting to Parent Dashboard...</Typography>
        </Box>
      );
    }

    if (userRole === 'ROLE_SCHOOLNURSE' || userRole === 'MEDICAL_STAFF') {
        return (
          <motion.div variants={container} initial="hidden" animate="visible">
            <Grid container spacing={3}>
              {/* Health Blog management removed */}
              <Grid item xs={12} sm={6} lg={4}>
                <motion.div variants={item}>
                  <ModernDashboardCard
                    title="Medical Events"
                    description="Record and manage medical incidents"
                    icon={<LocalHospital />}
                    link="/medical-events"
                    color={theme.palette.error.main}
                  />
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <motion.div variants={item}>
                  <ModernDashboardCard
                    title="Medication Management"
                    description="Manage student medications and supplies"
                    icon={<MedicalServices />}
                    link="/medication-management"
                    color={theme.palette.primary.main}
                  />
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <motion.div variants={item}>
                  <ModernDashboardCard
                    title="Vaccination Management"
                    description="Organize vaccination campaigns"
                    icon={<Vaccines />}
                    link="/vaccination-management"
                    color={theme.palette.success.main}
                  />
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <motion.div variants={item}>
                  <ModernDashboardCard
                    title="Health Checkups"
                    description="Conduct routine health examinations"
                    icon={<FavoriteOutlined />}
                    link="/health-checkups"
                    color={theme.palette.secondary.main}
                  />
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <motion.div variants={item}>
                  <ModernDashboardCard
                    title="Student Management"
                    description="View and manage student health profiles"
                    icon={<School />}
                    link="/student-management"
                    color={theme.palette.warning.main}
                  />
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <motion.div variants={item}>
                  <ModernDashboardCard
                    title="Reports"
                    description="Generate health reports and statistics"
                    icon={<Analytics />}
                    link="/reports"
                    color={theme.palette.info.main}
                  />
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        );
    }

    if (userRole === 'ROLE_ADMIN' || userRole === 'ADMIN') {
        return (
          <motion.div variants={container} initial="hidden" animate="visible">
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} lg={4}>
                <motion.div variants={item}>
                  <ModernDashboardCard
                    title="Admin Dashboard"
                    description="System overview and user management"
                    icon={<DashboardIcon />}
                    link="/admin/dashboard"
                    color={theme.palette.primary.main}
                  />
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <motion.div variants={item}>
                  <ModernDashboardCard
                    title="User Management"
                    description="Manage system users and permissions"
                    icon={<PersonAdd />}
                    link="/admin/user-management"
                    color={theme.palette.primary.main}
                  />
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <motion.div variants={item}>
                  <ModernDashboardCard
                    title="Analytics & Reports"
                    description="View comprehensive system analytics"
                    icon={<TrendingUp />}
                    link="/admin/analytics-reports"
                    color={theme.palette.success.main}
                  />
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <motion.div variants={item}>
                  <ModernDashboardCard
                    title="Medical Events Overview"
                    description="Monitor all medical events"
                    icon={<LocalHospital />}
                    link="/medical-events"
                    color={theme.palette.error.main}
                  />
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <motion.div variants={item}>
                  <ModernDashboardCard
                    title="Event Management"
                    description="Manage health checkup and vaccination events"
                    icon={<Event />}
                    link="/admin/health-programs"
                    color={theme.palette.secondary.main}
                  />
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <motion.div variants={item}>
                  <ModernDashboardCard
                    title="System Configuration"
                    description="Configure system settings"
                    icon={<Settings />}
                    link="/admin/system-config"
                    color={theme.palette.text.secondary}
                  />
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        );
    }

    if (userRole === 'ROLE_STUDENT' || userRole === 'STUDENT') {
        return (
          <motion.div variants={container} initial="hidden" animate="visible">
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} lg={4}>
                <motion.div variants={item}>
                  <ModernDashboardCard
                    title="Health Profile"
                    description="View your health information"
                    icon={<FavoriteOutlined />}
                    link="/health-profile"
                    color={theme.palette.error.main}
                  />
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <motion.div variants={item}>
                  <ModernDashboardCard
                    title="Medical History"
                    description="Access your medical records"
                    icon={<Assignment />}
                    link="/medical-history"
                    color={theme.palette.primary.main}
                  />
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <motion.div variants={item}>
                  <ModernDashboardCard
                    title="Vaccination Record"
                    description="View vaccination history"
                    icon={<Vaccines />}
                    link="/vaccination-record"
                    color={theme.palette.success.main}
                  />
                </motion.div>
              </Grid>
              {/* Health Blog card removed */}
              <Grid item xs={12} sm={6} lg={4}>
                <motion.div variants={item}>
                  <ModernDashboardCard
                    title="Upcoming Checkups"
                    description="View scheduled health checkups"
                    icon={<CalendarToday />}
                    link="/upcoming-checkups"
                    color={theme.palette.warning.main}
                  />
                </motion.div>
              </Grid>
              {/* Health Resources card removed */}
            </Grid>
          </motion.div>
        );
    }

    // Default case
    return (
      <Box textAlign="center" py={8}>
        <Typography color="text.secondary">Please contact administrator for role assignment.</Typography>
      </Box>
    );
  };

  if (loading) {
    return (
      <LoadingSpinner
        variant="page"
        size="large"
        message="Loading Dashboard"
        fullHeight={true}
      />
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.secondary.main, 0.03)} 100%)`,
        py: { xs: 2, md: 4 }
      }}
    >
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Welcome Section */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              mb: 4,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              color: 'white',
              borderRadius: 3,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '200px',
                height: '200px',
                background: `radial-gradient(circle, ${alpha('#fff', 0.1)} 0%, transparent 70%)`,
                borderRadius: '50%',
                transform: 'translate(50%, -50%)'
              }
            }}
          >
            <Grid container alignItems="center" spacing={3}>
              <Grid item xs={12} md={8}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
                    {getWelcomeMessage()}
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    Welcome to the FPT Junior High School Health Management System
                  </Typography>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={4}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <Box display="flex" justifyContent={{ xs: 'center', md: 'flex-end' }}>
                    <Avatar
                      sx={{
                        width: { xs: 80, md: 100 },
                        height: { xs: 80, md: 100 },
                        bgcolor: alpha('#fff', 0.2),
                        fontSize: { xs: '2rem', md: '2.5rem' }
                      }}
                    >
                      {currentUser?.fullName?.charAt(0) || currentUser?.username?.charAt(0) || 'U'}
                    </Avatar>
                  </Box>
                </motion.div>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>

        {/* Quick Stats */}
        <AnimatePresence>
          {Object.keys(dashboardData.quickStats).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {Object.entries(dashboardData.quickStats).map(([key, value], index) => (
                  <Grid item xs={12} sm={6} md={3} key={key}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                    >
                      <Card
                        elevation={2}
                        sx={{
                          p: 3,
                          textAlign: 'center',
                          height: '100%',
                          transition: 'all 0.3s ease-in-out',
                          cursor: 'pointer',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: theme.shadows[8]
                          }
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 56,
                            height: 56,
                            mx: 'auto',
                            mb: 2,
                            bgcolor: theme.palette.primary.main
                          }}
                        >
                          <TrendingUp />
                        </Avatar>
                        <Typography variant="h4" component="div" fontWeight="bold" color="primary">
                          {value}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" textTransform="capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </Typography>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Role-specific Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {getRoleSpecificContent()}
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Grid container spacing={3} sx={{ mt: 4 }}>
            {/* Recent Activities */}
            <AnimatePresence>
              {dashboardData.recentActivities?.length > 0 && (
                <Grid item xs={12} lg={6}>
                  <Card elevation={2} sx={{ height: '100%' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box display="flex" alignItems="center" mb={3}>
                        <Avatar sx={{ bgcolor: theme.palette.info.main, mr: 2 }}>
                          <AccessTime />
                        </Avatar>
                        <Typography variant="h6" component="h3" fontWeight="bold">
                          Recent Activities
                        </Typography>
                      </Box>
                      <List>
                        {dashboardData.recentActivities.slice(0, 5).map((activity, index) => (
                          <React.Fragment key={index}>
                            <ListItem sx={{ px: 0 }}>
                              <ListItemIcon>
                                <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.grey[200] }}>
                                  <AccessTime fontSize="small" color="action" />
                                </Avatar>
                              </ListItemIcon>
                              <ListItemText
                                primary={activity.description}
                                secondary={activity.timestamp}
                                primaryTypographyProps={{ variant: 'body2' }}
                                secondaryTypographyProps={{ variant: 'caption' }}
                              />
                            </ListItem>
                            {index < dashboardData.recentActivities.slice(0, 5).length - 1 && (
                              <Divider component="li" />
                            )}
                          </React.Fragment>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </AnimatePresence>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

const ModernDashboardCard = ({ title, description, icon, link, color, badge }) => {
  const theme = useTheme();
  
  return (
    <Card
      component={Link}
      to={link}
      elevation={2}
      sx={{
        height: '100%',
        textDecoration: 'none',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: theme.shadows[12],
          '& .card-icon': {
            transform: 'scale(1.1) rotate(5deg)',
          },
          '& .card-content': {
            transform: 'translateY(-2px)',
          }
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${color} 0%, ${alpha(color, 0.6)} 100%)`,
        }
      }}
    >
      {badge > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <Chip
            label={badge}
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              bgcolor: theme.palette.error.main,
              color: 'white',
              zIndex: 2,
              minWidth: 24,
              height: 24,
              '& .MuiChip-label': {
                fontSize: '0.75rem',
                fontWeight: 'bold',
                px: 1
              }
            }}
          />
        </motion.div>
      )}
      
      <CardContent
        className="card-content"
        sx={{
          p: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.3s ease'
        }}
      >
        <Box display="flex" alignItems="flex-start" mb={3}>
          <Avatar
            className="card-icon"
            sx={{
              width: 64,
              height: 64,
              bgcolor: alpha(color, 0.1),
              color: color,
              transition: 'all 0.3s ease',
              mr: 0
            }}
          >
            {icon}
          </Avatar>
        </Box>
        
        <Box flex={1}>
          <Typography
            variant="h6"
            component="h3"
            fontWeight="bold"
            gutterBottom
            sx={{
              color: 'text.primary',
              lineHeight: 1.3,
              mb: 1
            }}
          >
            {title}
          </Typography>
          
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {description}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
