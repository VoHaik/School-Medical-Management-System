import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Paper,
  Chip
} from '@mui/material';
import {
  School as SchoolIcon,
  CheckCircle as CheckIcon,
  Article as BlogIcon,
  Description as DocsIcon
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { currentUser } = useContext(AuthContext);

  const schoolInfo = {
    name: "FPT Junior High School",
    address: "123 Education Street, Hanoi, Vietnam",
    phone: "(024) 123-4567",
    email: "health@fpt-junior.edu.vn",
    healthOfficeHours: "Monday - Friday: 8:00 AM - 4:00 PM",
    nurseOnDuty: "Nurse Sarah Williams, RN"
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #7b1fa2 100%)',
          color: 'white',
          py: 10
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
                FPT Junior High School Health Management System
              </Typography>
              <Typography variant="h5" sx={{ mb: 3, opacity: 0.9 }}>
                Comprehensive health tracking and management for {schoolInfo.name}
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, opacity: 0.8 }}>
                Our advanced platform ensures the health and safety of all students through 
                digital health records, real-time monitoring, and seamless communication 
                between parents, students, and healthcare providers.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {/* Only show Login and Parent Registration buttons when user is not logged in */}
                {!currentUser && (
                  <>
                    <Button
                      component={Link}
                      to="/login"
                      variant="contained"
                      size="large"
                      sx={{ 
                        bgcolor: 'white', 
                        color: 'primary.main',
                        '&:hover': { bgcolor: 'grey.100' }
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      component={Link}
                      to="/parent-registration"
                      variant="outlined"
                      size="large"
                      sx={{ 
                        borderColor: 'white',
                        color: 'white',
                        '&:hover': { 
                          bgcolor: 'white',
                          color: 'primary.main'
                        }
                      }}
                    >
                      Parent Registration
                    </Button>
                  </>
                )}
                {/* Show welcome message when user is logged in */}
                {currentUser && (
                  <Box sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.1)', 
                    color: 'white',
                    px: 3,
                    py: 2,
                    borderRadius: 2,
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}>
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                      Welcome back, {currentUser.fullName || currentUser.username}!
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      You are logged in as {currentUser.roles?.join(', ').replace('ROLE_', '')}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <SchoolIcon sx={{ fontSize: 200, opacity: 0.2 }} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Guest Navigation Section */}
      {!currentUser && (
        <Box sx={{ bgcolor: 'white', py: 3, borderBottom: 1, borderColor: 'grey.200' }}>
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
              <Button
                component={Link}
                to="/health-blog"
                variant="outlined"
                startIcon={<BlogIcon />}
                sx={{ 
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  textTransform: 'none',
                  fontSize: '1rem'
                }}
              >
                Health Blogs
              </Button>
              <Button
                component={Link}
                to="/health-docs"
                variant="outlined"
                startIcon={<DocsIcon />}
                sx={{ 
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  textTransform: 'none',
                  fontSize: '1rem'
                }}
              >
                Health Documentation
              </Button>
            </Box>
          </Container>
        </Box>
      )}

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* School Information */}
        <Paper 
          sx={{ 
            p: 4, 
            mb: 6, 
            bgcolor: 'primary.light',
            borderLeft: 4,
            borderColor: 'primary.main',
            color: 'primary.contrastText'
          }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: 'primary.dark' }}>
                {schoolInfo.name} - Health Office Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Address:</strong> {schoolInfo.address}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Phone:</strong> {schoolInfo.phone}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Email:</strong> {schoolInfo.email}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Health Office Hours:</strong> {schoolInfo.healthOfficeHours}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Nurse on Duty:</strong> {schoolInfo.nurseOnDuty}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>

        {/* Health Tips Section */}
        <Paper 
          sx={{ 
            p: 4, 
            bgcolor: 'success.light',
            borderLeft: 4,
            borderColor: 'success.main'
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: 'success.dark' }}>
            Daily Health Tips
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <CheckIcon sx={{ color: 'success.main', mt: 0.5 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 500, mb: 0.5 }}>
                    Stay Hydrated
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Drink plenty of water throughout the day to maintain good health and concentration.
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <CheckIcon sx={{ color: 'success.main', mt: 0.5 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 500, mb: 0.5 }}>
                    Wash Your Hands
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Regular hand washing with soap and water helps prevent the spread of germs.
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <CheckIcon sx={{ color: 'success.main', mt: 0.5 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 500, mb: 0.5 }}>
                    Get Enough Sleep
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Adequate sleep is essential for learning, growth, and immune system function.
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Home;

