import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Alert,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  MedicalServices as MedicalIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  Notifications as NotificationIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Refresh as RefreshIcon,
  Medication as MedicationIcon,
  People as PeopleIcon,
  Today as TodayIcon,
  Warning as WarningIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { apiClient } from '../../utils/api';

// Helper Components
const StatCard = ({ title, value, icon, color, onClick, subtitle }) => (
  <Card 
    sx={{ 
      height: '100%', 
      cursor: onClick ? 'pointer' : 'default',
      '&:hover': onClick ? { boxShadow: 3 } : {}
    }}
    onClick={onClick}
  >
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={{ color: `${color}.main`, mr: 2 }}>
          {icon}
        </Box>
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div" color="primary">
        {value}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
);

const QuickActionCard = ({ title, description, onClick, icon, color }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={{ color: `${color}.main`, mr: 2 }}>
          {icon}
        </Box>
        <Typography variant="h6">{title}</Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {description}
      </Typography>
      <Button variant="contained" onClick={onClick} fullWidth>
        View Details
      </Button>
    </CardContent>
  </Card>
);

const AlertItem = ({ alert }) => {
  const navigate = useNavigate();
  
  const getAlertIcon = (type) => {
    switch (type) {
      case 'error': return <ErrorIcon color="error" />;
      case 'warning': return <WarningIcon color="warning" />;
      default: return <NotificationIcon color="info" />;
    }
  };

  return (
    <ListItem>
      <ListItemIcon>
        {getAlertIcon(alert.type)}
      </ListItemIcon>
      <ListItemText
        primary={alert.message}
        secondary={alert.action}
      />
      {alert.link && (
        <Button 
          size="small" 
          onClick={() => navigate(alert.link)}
        >
          {alert.action}
        </Button>
      )}
    </ListItem>
  );
};

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

      // Check authorization first
      if (!currentUser || !currentUser.roles || 
          !currentUser.roles.some(role => role === 'SchoolNurse' || role === 'Admin')) {
        setError('You do not have permission to access this page');
        setLoading(false);
        return;
      }

      try {
        // Try to get data from the new nurse dashboard endpoint
        const response = await apiClient.get('/nurse/dashboard');
        
        const statistics = {
          totalStudents: response.data.totalStudents || 0,
          pendingMedicationRequests: response.data.pendingMedicationRequests || 0,
          pendingHealthDeclarations: response.data.pendingHealthDeclarations || 0,
          todayEvents: response.data.todayEvents || 0,
          upcomingCheckups: 0,
          completedToday: response.data.completedToday || 0
        };

        // Generate alerts based on statistics
        const alerts = [];
        if (statistics.pendingMedicationRequests > 5) {
          alerts.push({
            id: 1,
            type: 'warning',
            message: `There are ${statistics.pendingMedicationRequests} pending medication requests`,
            action: 'View Now',
            link: '/medical/medication-management'
          });
        }

        setDashboardData({
          statistics,
          recentMedicationRequests: response.data.recentMedicationRequests || [],
          pendingHealthDeclarations: [],
          recentMedicalEvents: [],
          upcomingCheckups: [],
          todayActivities: [],
          alerts
        });
        
      } catch (apiError) {
        // Fallback: Load data from individual endpoints
        const [
          medicationRequestsRes,
          studentsRes
        ] = await Promise.allSettled([
          apiClient.get('/medication-requests/pending').catch(() => ({ data: [] })),
          apiClient.get('/students/summary').catch(() => ({ data: { totalCount: 0 } }))
        ]);

        const medicationRequests = medicationRequestsRes.status === 'fulfilled' ? 
          (medicationRequestsRes.value?.data || []) : [];
        const studentsData = studentsRes.status === 'fulfilled' ? 
          (studentsRes.value?.data || { totalCount: 0 }) : { totalCount: 0 };

        const statistics = {
          totalStudents: studentsData.totalCount || 0,
          pendingMedicationRequests: Array.isArray(medicationRequests) ? medicationRequests.length : 0,
          pendingHealthDeclarations: 0,
          todayEvents: 0,
          upcomingCheckups: 0,
          completedToday: 0
        };

        const alerts = [];
        if (statistics.pendingMedicationRequests > 5) {
          alerts.push({
            id: 1,
            type: 'warning',
            message: `Có ${statistics.pendingMedicationRequests} yêu cầu thuốc đang chờ xử lý`,
            action: 'Xem ngay',
            link: '/medical/medication-management'
          });
        }

        setDashboardData({
          statistics,
          recentMedicationRequests: Array.isArray(medicationRequests) ? medicationRequests.slice(0, 5) : [],
          pendingHealthDeclarations: [],
          recentMedicalEvents: [],
          upcomingCheckups: [],
          todayActivities: [],
          alerts
        });
      }

    } catch (err) {
      console.error('Error loading nurse dashboard:', err);
      setError('Unable to load dashboard data. Please try again.');
      
      // Set fallback data
      setDashboardData(initialDashboardData);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Nurse Dashboard
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Welcome, {currentUser?.fullName || currentUser?.username}
            </Typography>
          </Box>
          <IconButton onClick={loadDashboardData} color="primary">
            <RefreshIcon />
          </IconButton>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Alerts Section */}
      {dashboardData.alerts && dashboardData.alerts.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Alerts & Notifications
          </Typography>
          <List>
            {dashboardData.alerts.map((alert, index) => (
              <React.Fragment key={alert.id || index}>
                <AlertItem alert={alert} />
                {index < dashboardData.alerts.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Medication Requests"
            value={dashboardData.statistics.pendingMedicationRequests}
            icon={<MedicationIcon />}
            color="primary"
            subtitle="Pending Review"
            onClick={() => navigate('/medical/medication-management')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Students"
            value={dashboardData.statistics.totalStudents}
            icon={<PeopleIcon />}
            color="info"
            subtitle="In System"
            onClick={() => navigate('/medical/student-management')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Health Declarations"
            value={dashboardData.statistics.pendingHealthDeclarations}
            icon={<AssignmentIcon />}
            color="warning"
            subtitle="Pending Approval"
            onClick={() => navigate('/nurse/health-declaration-approval')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Today's Activities"
            value={dashboardData.statistics.todayEvents}
            icon={<TodayIcon />}
            color="success"
            subtitle="Scheduled Events"
          />
        </Grid>
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <QuickActionCard
                title="Medication Management"
                description="Review and process medication requests from parents"
                icon={<MedicationIcon />}
                color="primary"
                onClick={() => navigate('/medical/medication-management')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <QuickActionCard
                title="Student Management"
                description="View student health information"
                icon={<PeopleIcon />}
                color="info"
                onClick={() => navigate('/medical/student-management')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <QuickActionCard
                title="Health Checkups"
                description="Manage health checkup schedules"
                icon={<CheckCircleIcon />}
                color="success"
                onClick={() => navigate('/medical/health-checkups')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <QuickActionCard
                title="Vaccination Management"
                description="Track vaccination schedules"
                icon={<MedicalIcon />}
                color="warning"
                onClick={() => navigate('/medical/vaccination-management')}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Recent Medication Requests
          </Typography>
          <Card>
            <CardContent>
              {dashboardData.recentMedicationRequests && dashboardData.recentMedicationRequests.length > 0 ? (
                <List>
                  {dashboardData.recentMedicationRequests.map((request, index) => (
                    <React.Fragment key={request.requestId || index}>
                      <ListItem>
                        <ListItemIcon>
                          <PendingIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={`${request.studentFullName || request.studentName || 'Student'}`}
                          secondary={`${request.medicationName} - ${request.dosage || ''}`}
                        />
                        <Chip
                          label={request.status || 'PENDING'}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </ListItem>
                      {index < dashboardData.recentMedicationRequests.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    No recent medication requests
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/medical/medication-management')}
                >
                  View All Requests
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default NurseDashboard;