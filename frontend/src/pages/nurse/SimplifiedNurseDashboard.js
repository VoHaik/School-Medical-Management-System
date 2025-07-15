import React, { useState, useEffect } from 'react';
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
  Today as TodayIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../utils/api';
import { ENGLISH_UI } from '../../constants/englishUI';

const NurseDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Call the new nurse dashboard API
      const response = await apiClient.get('/nurse/dashboard');
      setDashboardData(response.data);
    } catch (err) {
      console.error('Error loading nurse dashboard:', err);
      setError(ENGLISH_UI.cannotLoadData);
      
      // Set default data if API fails
      setDashboardData({
        pendingMedicationRequests: 0,
        pendingHealthDeclarations: 0,
        totalStudents: 0,
        todayEvents: 0,
        completedToday: 0,
        recentMedicationRequests: []
      });
    } finally {
      setLoading(false);
    }
  };

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
          Xem Chi Tiết
        </Button>
      </CardContent>
    </Card>
  );

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
              {ENGLISH_UI.nurseDashboard}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {ENGLISH_UI.healthManagement}
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

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={ENGLISH_UI.medicationRequests}
            value={dashboardData?.pendingMedicationRequests || 0}
            icon={<MedicationIcon />}
            color="primary"
            subtitle={ENGLISH_UI.pending}
            onClick={() => navigate('/medical/medication-management')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={ENGLISH_UI.totalStudents}
            value={dashboardData?.totalStudents || 0}
            icon={<PeopleIcon />}
            color="info"
            subtitle="In system"
            onClick={() => navigate('/medical/student-management')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={ENGLISH_UI.healthDeclarations}
            value={dashboardData?.pendingHealthDeclarations || 0}
            icon={<AssignmentIcon />}
            color="warning"
            subtitle="Awaiting approval"
            onClick={() => navigate('/nurse/health-declaration-approval')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Today's Activities"
            value={dashboardData?.todayEvents || 0}
            icon={<TodayIcon />}
            color="success"
            subtitle="Scheduled events"
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <QuickActionCard
                title={ENGLISH_UI.medicationManagement}
                description={ENGLISH_UI.viewAndProcess}
                icon={<MedicationIcon />}
                color="primary"
                onClick={() => navigate('/medical/medication-management')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <QuickActionCard
                title={ENGLISH_UI.studentManagement}
                description="View student health information"
                icon={<PeopleIcon />}
                color="info"
                onClick={() => navigate('/medical/student-management')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <QuickActionCard
                title={ENGLISH_UI.healthCheckups}
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
              {dashboardData?.recentMedicationRequests && dashboardData.recentMedicationRequests.length > 0 ? (
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

      {/* Links to other sections */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quick Links
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="text"
              fullWidth
              startIcon={<AssignmentIcon />}
              onClick={() => navigate('/medical/reports')}
            >
              Reports
            </Button>
          </Grid>
          {/* TEMPORARILY HIDDEN - NOTIFICATION BUTTON */}
          {/* <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="text"
              fullWidth
              startIcon={<NotificationIcon />}
              onClick={() => navigate('/notifications')}
            >
              Notifications
            </Button>
          </Grid> */}
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="text"
              fullWidth
              startIcon={<PersonIcon />}
              onClick={() => navigate('/nurse/health-declaration-approval')}
            >
              Declaration Approval
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="text"
              fullWidth
              startIcon={<MedicalIcon />}
              onClick={() => navigate('/health-blog')}
            >
              Health Blog
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default NurseDashboard;
