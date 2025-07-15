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
  Warning
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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
      // Temporarily disable dashboard API calls due to backend endpoint issues
      // Return mock data structure to prevent errors
      const mockData = {
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
            description: 'Student dashboard is temporarily unavailable. Please use the navigation menu to access health records.',
            time: new Date().toISOString()
          }
        ],
        healthProfile: { hasData: false, message: 'Contact health office for your health information.' }
      };
      
      setDashboardData(mockData);
    } catch (error) {
      setError('Unable to load dashboard data');
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
                  Dị ứng:
                </Typography>
                <Typography variant="body1">{data.allergies}</Typography>
              </Box>
            )}
            {data.medicalConditions && (
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Tình trạng bệnh lý:
                </Typography>
                <Typography variant="body1">{data.medicalConditions}</Typography>
              </Box>
            )}
            {data.emergencyContact && (
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Liên hệ khẩn cấp:
                </Typography>
                <Typography variant="body1">
                  {data.emergencyContact} - {data.emergencyPhone}
                </Typography>
              </Box>
            )}
            <Chip 
              label="Có dữ liệu" 
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
          Dashboard Học Sinh
        </Typography>
        
        {dashboardData && (
          <Box>
            <Typography variant="h6" color="primary">
              Chào mừng, {dashboardData.fullName || dashboardData.username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Mã học sinh: {dashboardData.studentCode}
            </Typography>
            {dashboardData.className && (
              <Typography variant="body2" color="text.secondary">
                Lớp: {dashboardData.className} - {dashboardData.gradeLevel}
              </Typography>
            )}
          </Box>
        )}
      </Paper>

      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <InfoCard
            title="Hồ Sơ Sức Khỏe"
            icon={<HealthAndSafety color="primary" />}
            data={dashboardData?.healthProfile || { hasData: false, message: 'Unable to load information' }}
            actionLabel="Xem Chi Tiết"
            actionPath="/health-profile"
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <InfoCard
            title="Lịch Sử Khám Bệnh"
            icon={<History color="primary" />}
            data={dashboardData?.medicalHistory || { hasData: false, message: 'Unable to load information' }}
            actionLabel="Xem Lịch Sử"
            actionPath="/medical-history"
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <InfoCard
            title="Tiêm Chủng"
            icon={<Vaccines color="primary" />}
            data={dashboardData?.vaccinationRecord || { hasData: false, message: 'Unable to load information' }}
            actionLabel="Xem Bản Ghi"
            actionPath="/vaccination-record"
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      {dashboardData?.quickActions && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Truy Cập Nhanh
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
    </Container>
  );
};

export default StudentDashboardNew;
