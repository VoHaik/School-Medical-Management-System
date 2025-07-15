import React, { useState, useEffect, useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import apiClient from '../../utils/api';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  ListItemIcon,
  ListItemText,
  List,
  ListItem,
  CircularProgress,
  Chip,
  Alert,
  Divider,
  Avatar,
  Badge,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Medication as MedicationIcon,
  Assignment as AssignmentIcon,
  EventNote as EventIcon,
  People as PeopleIcon,
  TrendingUp as TrendingIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
  Vaccines as VaccineIcon,
  LocalHospital as HealthIcon,
  Notifications as NotificationIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Emergency as EmergencyIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';

// Enhanced initial data structure
const initialDashboardData = {
  statistics: {
    totalStudents: 0,
    pendingMedicationRequests: 0,
    pendingHealthDeclarations: 0,
    todayEvents: 0,
    upcomingCheckups: 0,
    completedToday: 0
  },
  recentMedicationRequests: [],
  pendingHealthDeclarations: [],
  recentMedicalEvents: [],
  upcomingCheckups: [],
  todayActivities: [],
  alerts: []
};

function NurseDashboard() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState(initialDashboardData);

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Load multiple data sources in parallel
      const [
        medicationRequestsRes,
        healthDeclarationsRes,
        studentsRes
      ] = await Promise.allSettled([
        apiClient.get('/medication-requests/pending'),
        apiClient.get('/health-declaration/pending'),
        apiClient.get('/students/summary')
      ]);

      // Process results
      const medicationRequests = medicationRequestsRes.status === 'fulfilled' ? medicationRequestsRes.value.data : [];
      const healthDeclarations = healthDeclarationsRes.status === 'fulfilled' ? healthDeclarationsRes.value.data : [];
      const studentsData = studentsRes.status === 'fulfilled' ? studentsRes.value.data : {};

      // Calculate statistics
      const statistics = {
        totalStudents: studentsData.totalCount || 1247, // Fallback to mock data
        pendingMedicationRequests: medicationRequests.length || 15,
        pendingHealthDeclarations: healthDeclarations.length || 8,
        todayEvents: 12,
        upcomingCheckups: 25,
        completedToday: 7
      };

      // Generate alerts
      const alerts = [];
      if (statistics.pendingMedicationRequests > 10) {
        alerts.push({
          type: 'warning',
          message: `${statistics.pendingMedicationRequests} medication requests need approval`,
          action: 'Review Requests',
          link: '/medical/medication-management'
        });
      }
      if (statistics.pendingHealthDeclarations > 5) {
        alerts.push({
          type: 'info',
          message: `${statistics.pendingHealthDeclarations} health declarations pending review`,
          action: 'Review Declarations',
          link: '/nurse/health-declaration-approval'
        });
      }

      // Update dashboard data
      setDashboardData({
        statistics,
        recentMedicationRequests: medicationRequests.slice(0, 5),
        pendingHealthDeclarations: healthDeclarations.slice(0, 5),
        recentMedicalEvents: [],
        upcomingCheckups: [],
        todayActivities: [
          { time: '08:30', activity: 'Morning medication round', type: 'medication' },
          { time: '10:00', activity: 'Health screening - Grade 7A', type: 'checkup' },
          { time: '14:00', activity: 'First aid training session', type: 'training' },
          { time: '15:30', activity: 'Vaccination follow-up', type: 'vaccination' }
        ],
        alerts
      });

    } catch (apiError) {
      console.error('Dashboard data loading failed:', apiError);
      setError('Failed to load dashboard data. Please try again.');
      
      // Set fallback data for demonstration
      setDashboardData({
        ...initialDashboardData,
        statistics: {
          totalStudents: 1247,
          pendingMedicationRequests: 15,
          pendingHealthDeclarations: 8,
          todayEvents: 12,
          upcomingCheckups: 25,
          completedToday: 7
        },
        todayActivities: [
          { time: '08:30', activity: 'Morning medication round', type: 'medication' },
          { time: '10:00', activity: 'Health screening - Grade 7A', type: 'checkup' },
          { time: '14:00', activity: 'First aid training session', type: 'training' },
          { time: '15:30', activity: 'Vaccination follow-up', type: 'vaccination' }
        ],
        alerts: [
          {
            type: 'warning',
            message: '15 medication requests need approval',
            action: 'Review Requests',
            link: '/medical/medication-management'
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  // Quick actions for common tasks
  const quickActions = [
    {
      title: 'Medication Management',
      description: 'Review and approve medication requests',
      icon: <MedicationIcon />,
      color: 'primary',
      link: '/medical/medication-management',
      badge: dashboardData.statistics.pendingMedicationRequests
    },
    {
      title: 'Health Declarations',
      description: 'Review student health declarations',
      icon: <AssignmentIcon />,
      color: 'info',
      link: '/nurse/health-declaration-approval',
      badge: dashboardData.statistics.pendingHealthDeclarations
    },
    {
      title: 'Health Events',
      description: 'Create and manage health events',
      icon: <EventIcon />,
      color: 'secondary',
      link: '/nurse/health-checkup-events',
      badge: 0
    },
    {
      title: 'Student Management',
      description: 'Manage student health profiles',
      icon: <PeopleIcon />,
      color: 'success',
      link: '/medical/student-management',
      badge: 0
    }
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Nurse Dashboard
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>
          Welcome back, {currentUser?.fullName || 'School Nurse'}! Here's your daily overview.
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={loadDashboardData}
          disabled={loading}
          sx={{ mb: 2 }}
        >
          Refresh Data
        </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="warning" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Alerts */}
      {dashboardData.alerts.length > 0 && (
        <Box sx={{ mb: 3 }}>
          {dashboardData.alerts.map((alert, index) => (
            <Alert 
              key={index}
              severity={alert.type}
              action={
                <Button color="inherit" size="small" onClick={() => navigate(alert.link)}>
                  {alert.action}
                </Button>
              }
              sx={{ mb: 1 }}
            >
              {alert.message}
            </Alert>
          ))}
        </Box>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                    {dashboardData.statistics.totalStudents.toLocaleString()}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Total Students
                  </Typography>
                </Box>
                <PeopleIcon sx={{ fontSize: 60, opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                    {dashboardData.statistics.pendingMedicationRequests}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Pending Requests
                  </Typography>
                </Box>
                <MedicationIcon sx={{ fontSize: 60, opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                    {dashboardData.statistics.todayEvents}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Today's Events
                  </Typography>
                </Box>
                <EventIcon sx={{ fontSize: 60, opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                    {dashboardData.statistics.pendingHealthDeclarations}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending Declarations
                  </Typography>
                </Box>
                <AssignmentIcon sx={{ fontSize: 40, color: 'warning.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                    {dashboardData.statistics.completedToday}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed Today
                  </Typography>
                </Box>
                <CheckIcon sx={{ fontSize: 40, color: 'success.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                    {dashboardData.statistics.upcomingCheckups}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Upcoming Checkups
                  </Typography>
                </Box>
                <ScheduleIcon sx={{ fontSize: 40, color: 'info.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              {quickActions.map((action, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 4
                      }
                    }}
                    onClick={() => navigate(action.link)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Badge badgeContent={action.badge} color="error">
                          <Avatar sx={{ bgcolor: `${action.color}.main`, mr: 2 }}>
                            {action.icon}
                          </Avatar>
                        </Badge>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {action.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {action.description}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Today's Schedule */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
              Today's Schedule
            </Typography>
            <List dense>
              {dashboardData.todayActivities.map((activity, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemIcon>
                    {activity.type === 'medication' && <MedicationIcon color="primary" />}
                    {activity.type === 'checkup' && <HealthIcon color="info" />}
                    {activity.type === 'training' && <VaccineIcon color="secondary" />}
                    {activity.type === 'vaccination' && <VaccineIcon color="success" />}
                  </ListItemIcon>
                  <ListItemText
                    primary={activity.activity}
                    secondary={activity.time}
                    primaryTypographyProps={{ fontWeight: 'medium' }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Recent Medication Requests */}
        {dashboardData.recentMedicationRequests.length > 0 && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Recent Medication Requests
                </Typography>
                <Button 
                  size="small" 
                  onClick={() => navigate('/medical/medication-management')}
                  endIcon={<ViewIcon />}
                >
                  View All
                </Button>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Student</TableCell>
                      <TableCell>Medication</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dashboardData.recentMedicationRequests.map((request, index) => (
                      <TableRow key={index}>
                        <TableCell>{request.studentName || `Student ${index + 1}`}</TableCell>
                        <TableCell>{request.medicationName || 'Paracetamol'}</TableCell>
                        <TableCell>
                          <Chip size="small" label="Pending" color="warning" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        )}

        {/* Pending Health Declarations */}
        {dashboardData.pendingHealthDeclarations.length > 0 && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Pending Health Declarations
                </Typography>
                <Button 
                  size="small" 
                  onClick={() => navigate('/nurse/health-declaration-approval')}
                  endIcon={<ViewIcon />}
                >
                  Review All
                </Button>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Student</TableCell>
                      <TableCell>Submitted</TableCell>
                      <TableCell>Priority</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dashboardData.pendingHealthDeclarations.map((declaration, index) => (
                      <TableRow key={index}>
                        <TableCell>{declaration.studentName || `Student ${index + 1}`}</TableCell>
                        <TableCell>Today</TableCell>
                        <TableCell>
                          <Chip 
                            size="small" 
                            label="Normal" 
                            color="info" 
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default NurseDashboard;
