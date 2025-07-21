import React, { useState, useEffect } from 'react';
import { getStudentDashboard } from '../../utils/api';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Divider
} from '@mui/material';
import {
  Person,
  History,
  Vaccines,
  HealthAndSafety,
  Info,
  Warning,
  Book as BookIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ENGLISH_UI } from '../../constants/englishUI';

const StudentDashboardNew = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Call the actual API endpoint
      const data = await getStudentDashboard();
      setDashboardData(data);
      
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      
      // Fallback to basic user data if API fails
      setDashboardData({
        studentCode: user?.userCode || 'STU001',
        fullName: user?.fullName || 'Student',
        email: user?.email || '',
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
            title: 'Dashboard Update',
            description: 'Dashboard functionality is being updated. Please use the navigation menu to access specific features.',
            timestamp: new Date().toISOString()
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const InfoCard = ({ title, icon, data, actionLabel, actionPath }) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon}
          <Typography variant="h6" component="h2" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        
        {data.hasData ? (
          <Box>
            {data.allergies && (
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Allergies:
                </Typography>
                <Typography variant="body1">{data.allergies}</Typography>
              </Box>
            )}
            {data.medicalConditions && (
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Medical Conditions:
                </Typography>
                <Typography variant="body1">{data.medicalConditions}</Typography>
              </Box>
            )}
            {data.emergencyContact && (
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Emergency Contact:
                </Typography>
                <Typography variant="body1">
                  {data.emergencyContact} - {data.emergencyPhone}
                </Typography>
              </Box>
            )}
            <Chip 
              label="Data Available" 
              color="success" 
              size="small"
              icon={<Info />}
            />
          </Box>
        ) : (
          <Box>
            <Alert severity="info" sx={{ mb: 2 }}>
              {data.message}
            </Alert>
            <Chip 
              label="No data available" 
              color="default" 
              size="small"
              icon={<Warning />}
            />
          </Box>
        )}
      </CardContent>
      
      <CardActions>
        <Button 
          size="small" 
          onClick={() => navigate(actionPath)}
          variant="outlined"
          fullWidth
        >
          {actionLabel}
        </Button>
      </CardActions>
    </Card>
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {ENGLISH_UI.studentDashboard}
        </Typography>
        
        {dashboardData && (
          <Box>
            <Typography variant="h6" color="primary">
              Welcome, {dashboardData.fullName || dashboardData.username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {ENGLISH_UI.studentCode}: {dashboardData.studentCode}
            </Typography>
            {dashboardData.className && (
              <Typography variant="body2" color="text.secondary">
                Class: {dashboardData.className} - {dashboardData.gradeLevel}
              </Typography>
            )}
          </Box>
        )}
      </Paper>

      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <InfoCard
            title={ENGLISH_UI.healthProfile}
            icon={<HealthAndSafety color="primary" />}
            data={dashboardData?.healthProfile || { hasData: false, message: 'Unable to load information' }}
            actionLabel="View Details"
            actionPath="/health-profile"
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <InfoCard
            title={ENGLISH_UI.medicalHistory}
            icon={<History color="primary" />}
            data={dashboardData?.medicalHistory || { hasData: false, message: 'Unable to load information' }}
            actionLabel="View History"
            actionPath="/medical-history"
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <InfoCard
            title={ENGLISH_UI.vaccination}
            icon={<Vaccines color="primary" />}
            data={dashboardData?.vaccinationRecord || { hasData: false, message: 'Unable to load information' }}
            actionLabel="View Records"
            actionPath="/vaccination-record"
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      {dashboardData?.quickActions && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Quick Access
          </Typography>
          <Grid container spacing={2}>
            {dashboardData.quickActions.map((action, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate(action.url)}
                  sx={{ 
                    p: 2, 
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1
                  }}
                >
                  <Person />
                  <Typography variant="body2">
                    {action.label}
                  </Typography>
                </Button>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Health Resources Quick Access */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BookIcon color="primary" />
          Health Resources
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/health-blog')}
              sx={{
                p: 2,
                height: '80px',
                display: 'flex',
                flexDirection: 'column',
                gap: 1
              }}
            >
              <i className="fas fa-blog" style={{ fontSize: '24px' }} />
              <Typography variant="body2">
                Health Blog
              </Typography>
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/health-docs')}
              sx={{
                p: 2,
                height: '80px',
                display: 'flex',
                flexDirection: 'column',
                gap: 1
              }}
            >
              <i className="fas fa-file-medical" style={{ fontSize: '24px' }} />
              <Typography variant="body2">
                Health Documents
              </Typography>
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/vaccination-record')}
              sx={{
                p: 2,
                height: '80px',
                display: 'flex',
                flexDirection: 'column',
                gap: 1
              }}
            >
              <Vaccines color="primary" />
              <Typography variant="body2">
                Vaccination Records
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default StudentDashboardNew;
