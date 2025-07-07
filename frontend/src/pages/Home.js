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
  Chip,
  Avatar
} from '@mui/material';
import {
  LocalHospital as MedicalIcon,
  School as SchoolIcon,
  Security as SecurityIcon,
  TrendingUp as TrendingIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  NotificationsActive as NotificationIcon,
  CheckCircle as CheckIcon,
  Description as DocumentIcon,
  Vaccines as VaccineIcon,
  Warning as EmergencyIcon
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { currentUser } = useContext(AuthContext);

  const features = [
    {
      icon: <MedicalIcon sx={{ color: '#1976d2', fontSize: 40 }} />,
      title: "Health Management",
      description: "Comprehensive health tracking, medical records, and vaccination management for all students."
    },
    {
      icon: <SecurityIcon sx={{ color: '#2e7d32', fontSize: 40 }} />,
      title: "Secure & Private",
      description: "HIPAA-compliant platform ensuring student health information remains secure and confidential."
    },
    {
      icon: <PeopleIcon sx={{ color: '#7b1fa2', fontSize: 40 }} />,
      title: "Multi-Role Access",
      description: "Tailored interfaces for parents, students, medical staff, and administrators."
    },
    {
      icon: <NotificationIcon sx={{ color: '#f57c00', fontSize: 40 }} />,
      title: "Real-Time Alerts",
      description: "Instant notifications for health emergencies, medication reminders, and checkup schedules."
    },
    {
      icon: <TrendingIcon sx={{ color: '#d32f2f', fontSize: 40 }} />,
      title: "Health Analytics",
      description: "Advanced reporting and analytics to track health trends and improve student wellness."
    },
    {
      icon: <AssignmentIcon sx={{ color: '#303f9f', fontSize: 40 }} />,
      title: "Digital Records",
      description: "Paperless health record management with easy access and sharing capabilities."
    }
  ];

  const healthBlogPosts = [
    {
      title: "Importance of Regular Health Checkups for Students",
      excerpt: "Regular health screenings help identify potential health issues early and ensure students stay healthy throughout the academic year.",
      date: "2024-01-15",
      author: "Dr. Sarah Johnson",
      readTime: "5 min read",
      category: "Prevention"
    },
    {
      title: "Managing Food Allergies in School Environment",
      excerpt: "A comprehensive guide for parents and school staff on creating a safe environment for students with food allergies.",
      date: "2024-01-10",
      author: "Nurse Lisa Chen",
      readTime: "7 min read",
      category: "Safety"
    },
    {
      title: "Mental Health Awareness for Students",
      excerpt: "Understanding the signs of mental health challenges and providing appropriate support for student wellbeing.",
      date: "2024-01-05",
      author: "Dr. Michael Brown",
      readTime: "6 min read",
      category: "Mental Health"
    }
  ];

  const healthDocuments = [
    {
      title: "Health Policy",
      description: "Comprehensive school health policies and procedures for students and staff.",
      icon: <DocumentIcon sx={{ color: '#1976d2', fontSize: 40 }} />,
      downloadUrl: "#"
    },
    {
      title: "Vaccination Guidelines",
      description: "Essential guidelines and schedules for required and recommended student vaccinations.",
      icon: <VaccineIcon sx={{ color: '#2e7d32', fontSize: 40 }} />,
      downloadUrl: "#"
    },
    {
      title: "Emergency Procedures",
      description: "Critical procedures and protocols for handling various medical emergencies at school.",
      icon: <EmergencyIcon sx={{ color: '#d32f2f', fontSize: 40 }} />,
      downloadUrl: "#"
    }
  ];

  const schoolInfo = {
    name: "Springfield Elementary School",
    address: "123 Education Street, Springfield, ST 12345",
    phone: "(555) 123-4567",
    email: "health@springfield-elem.edu",
    healthOfficeHours: "Monday - Friday: 8:00 AM - 4:00 PM",
    nurseOnDuty: "Nurse Sarah Williams, RN"
  };

  const getQuickActions = () => {
    if (!currentUser) return [];
    
    const allActions = [
      {
        title: "Health Dashboard",
        description: "View your personalized health dashboard",
        link: "/dashboard",
        icon: <TrendingIcon />,
        color: "primary",
        roles: ['parent', 'student', 'medical_staff', 'admin']
      },
      {
        title: "Health Declaration",
        description: "Submit daily health declaration",
        link: "/parent/health-declaration",
        icon: <AssignmentIcon />,
        color: "secondary",
        roles: ['parent']
      },
      {
        title: "Medical Records",
        description: "Access your medical history",
        link: "/student/medical-history",
        icon: <MedicalIcon />,
        color: "info",
        roles: ['student']
      },
      {
        title: "Student Management",
        description: "Manage student health records",
        link: "/medical/student-management",
        icon: <PeopleIcon />,
        color: "success",
        roles: ['medical_staff']
      },
      {
        title: "System Administration",
        description: "Manage system settings",
        link: "/admin/dashboard",
        icon: <SecurityIcon />,
        color: "warning",
        roles: ['admin']
      }
    ];

    return allActions.filter(action => action.roles.includes(currentUser.role));
  };

  const quickActions = getQuickActions();

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
                School Health Management System
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
                {currentUser ? (
                  <Button
                    component={Link}
                    to="/dashboard"
                    variant="contained"
                    size="large"
                    sx={{ 
                      bgcolor: 'white', 
                      color: 'primary.main',
                      '&:hover': { bgcolor: 'grey.100' }
                    }}
                  >
                    Go to Dashboard
                  </Button>
                ) : (
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
                      Register
                    </Button>
                  </>
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
            <Grid item xs={12} md={8}>
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
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Button
                  variant="contained"
                  color="error"
                  size="large"
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  Emergency: Call 911
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                >
                  Contact Health Office
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Quick Actions for Logged-in Users */}
        {currentUser && quickActions.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 3, color: 'text.primary' }}>
              Quick Actions
            </Typography>
            <Grid container spacing={3}>
              {quickActions.map((action, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card sx={{ height: '100%', '&:hover': { boxShadow: 6 }, transition: 'box-shadow 0.3s' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Avatar 
                        sx={{ 
                          mx: 'auto', 
                          mb: 2,
                          bgcolor: `${action.color}.light`,
                          color: `${action.color}.main`,
                          width: 56,
                          height: 56
                        }}
                      >
                        {action.icon}
                      </Avatar>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        {action.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                        {action.description}
                      </Typography>
                      <Button
                        component={Link}
                        to={action.link}
                        variant="contained"
                        color={action.color}
                        size="small"
                        fullWidth
                      >
                        Access
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Features Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 3, textAlign: 'center', color: 'text.primary' }}>
            Platform Features
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card sx={{ height: '100%', '&:hover': { boxShadow: 6 }, transition: 'box-shadow 0.3s' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Box sx={{ mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Health Documentation Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 3, textAlign: 'center', color: 'text.primary' }}>
            Health Documentation
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center', mb: 4, color: 'text.secondary' }}>
            Access important health documents and guidelines for students and parents.
          </Typography>
          <Grid container spacing={4}>
            {healthDocuments.map((doc, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ height: '100%', '&:hover': { boxShadow: 6 }, transition: 'box-shadow 0.3s' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Box sx={{ mb: 2 }}>
                      {doc.icon}
                    </Box>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                      {doc.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                      {doc.description}
                    </Typography>
                    <Button
                      variant="outlined"
                      color="primary"
                      fullWidth
                      startIcon={<DocumentIcon />}
                    >
                      Download PDF
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Health Blog Section */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary' }}>
              Health Blog & Resources
            </Typography>
            <Button variant="outlined" color="primary">
              View All Posts
            </Button>
          </Box>
          <Grid container spacing={4}>
            {healthBlogPosts.map((post, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ height: '100%', '&:hover': { boxShadow: 6 }, transition: 'box-shadow 0.3s' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Chip
                        label={post.category}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {post.readTime}
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                      {post.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                      {post.excerpt}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        By {post.author}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {new Date(post.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

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

