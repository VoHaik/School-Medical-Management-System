import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  Paper,
  Avatar,
  LinearProgress,
  IconButton,
  useTheme,
  alpha
} from '@mui/material';
import { 
  Person as PersonIcon,
  History as HistoryIcon,
  Vaccines as VaccinesIcon,
  School as SchoolIcon,
  Favorite as FavoriteIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';

const StudentDashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch student dashboard data
  useEffect(() => {
    const fetchStudentData = async () => {
      if (!currentUser?.accessToken) {
        setError('Not logged in');
        setLoading(false);
        return;
      }

      try {
        console.log('StudentDashboard - currentUser:', currentUser);
        console.log('StudentDashboard - user roles:', currentUser?.roles);
        
        const token = localStorage.getItem('token') || currentUser?.accessToken;
        console.log('Making API call with token:', token ? 'Present' : 'Missing');
        
        // Initialize data structure
        let combinedData = {
          // Basic user info from currentUser as fallback
          studentCode: currentUser?.userCode || '',
          fullName: currentUser?.fullName || '',
          email: currentUser?.email || '',
          phoneNumber: currentUser?.phoneNumber || '',
          className: 'Not assigned',
          dateOfBirth: 'Not provided',
          gender: 'Not specified',
          address: 'Not provided',
          
          // Initialize empty arrays for API data
          healthProfile: {},
          medicalHistory: [],
          vaccinationRecord: [],
          quickStats: {
            healthDeclarations: 0,
            totalAppointments: 0,
            medicalRecords: 0,
            vaccinations: 0
          }
        };

        try {
          // 1. Get student profile
          console.log('Fetching student profile...');
          const profileResponse = await axios.get('/api/students/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (profileResponse.data) {
            console.log('Student profile data received:', profileResponse.data);
            combinedData = {
              ...combinedData,
              ...profileResponse.data,
              // Ensure proper fallbacks
              className: profileResponse.data.className || 'Not assigned',
              dateOfBirth: profileResponse.data.dateOfBirth || 'Not provided',
              gender: profileResponse.data.gender || 'Not specified',
              address: profileResponse.data.address || 'Not provided',
              allergies: profileResponse.data.allergies || 'None recorded',
              medicalConditions: profileResponse.data.medicalConditions || 'None recorded',
              emergencyContactName: profileResponse.data.emergencyContactName || 'Not provided',
              emergencyContactPhone: profileResponse.data.emergencyContactPhone || 'Not provided'
            };
            console.log('Combined data after profile:', combinedData);
          }
        } catch (profileError) {
          console.error('Error fetching student profile:', profileError);
          console.error('Profile error response:', profileError.response?.data);
          console.error('Profile error status:', profileError.response?.status);
          
          // If profile fetch fails, we'll use the fallback data already in combinedData
          console.log('Using fallback data due to profile fetch error');
        }

        try {
          // 2. Get health profile
          console.log('Fetching health profile...');
          const healthResponse = await axios.get('/api/student/health-profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (healthResponse.data) {
            console.log('Health profile data:', healthResponse.data);
            combinedData.healthProfile = {
              bloodType: healthResponse.data.bloodType || 'Not available',
              height: healthResponse.data.height || 'Not available',
              weight: healthResponse.data.weight || 'Not available',
              allergies: healthResponse.data.allergies || [],
              medicalConditions: healthResponse.data.medicalConditions || [],
              emergencyContact: {
                name: healthResponse.data.emergencyContactName || 'Not available',
                relationship: healthResponse.data.emergencyContactRelationship || 'Not available',
                phone: healthResponse.data.emergencyContactPhone || 'Not available'
              }
            };
            
            // Update quick stats
            combinedData.quickStats.healthDeclarations = 1;
          }
        } catch (healthError) {
          console.warn('Failed to fetch health profile:', healthError);
        }

        try {
          // 3. Get medical history
          console.log('Fetching medical history...');
          const medicalResponse = await axios.get('/api/student/medical-history', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (medicalResponse.data && Array.isArray(medicalResponse.data)) {
            console.log('Medical history data:', medicalResponse.data);
            combinedData.medicalHistory = medicalResponse.data.map(record => ({
              type: record.eventName || record.type || 'Medical Event',
              date: record.eventDate || record.date || new Date().toISOString().split('T')[0],
              description: record.description || record.eventDescription || 'No description',
              status: record.status || 'Completed'
            }));
            
            combinedData.quickStats.medicalRecords = combinedData.medicalHistory.length;
          }
        } catch (medicalError) {
          console.warn('Failed to fetch medical history:', medicalError);
        }

        try {
          // 4. Get vaccination records
          console.log('Fetching vaccination records...');
          const vaccinationResponse = await axios.get('/api/student/vaccination-records', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (vaccinationResponse.data && Array.isArray(vaccinationResponse.data)) {
            console.log('Vaccination records data:', vaccinationResponse.data);
            combinedData.vaccinationRecord = vaccinationResponse.data.map(record => ({
              vaccine: record.vaccineName || record.vaccine || 'Unknown Vaccine',
              date: record.vaccinationDate || record.date || new Date().toISOString().split('T')[0],
              dose: `Dose ${record.doseNumber || record.dose || 1}`,
              provider: record.providerName || record.provider || 'Healthcare Provider',
              status: record.verificationStatus || record.status || 'Completed',
              nextDue: record.nextDueDate || null
            }));
            
            combinedData.quickStats.vaccinations = combinedData.vaccinationRecord.length;
          }
        } catch (vaccinationError) {
          console.warn('Failed to fetch vaccination records:', vaccinationError);
        }

        console.log('Final combined data:', combinedData);
        setStudentData(combinedData);
        
      } catch (err) {
        console.error('Error in fetchStudentData:', err);
        setError('Failed to load student data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [currentUser]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          If this problem persists, please contact the school administration.
        </Typography>
      </Container>
    );
  }

  if (!studentData) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="info">
          No student data available. Please contact your school administrator to set up your profile.
        </Alert>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
        py: 3
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
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
            <Grid item>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: alpha('#fff', 0.2),
                  fontSize: '2rem',
                  fontWeight: 'bold'
                }}
              >
                {studentData?.fullName?.charAt(0) || currentUser?.fullName?.charAt(0) || 'S'}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
                Student Health Dashboard
              </Typography>
              <Typography variant="h5" sx={{ opacity: 0.9, fontWeight: 300 }}>
                Welcome back, {studentData?.fullName || currentUser?.fullName || 'Student'}!
              </Typography>
              <Box display="flex" alignItems="center" mt={2} gap={3}>
                <Box display="flex" alignItems="center" gap={1}>
                  <SchoolIcon />
                  <Typography variant="body1">{studentData?.className || 'Class not assigned'}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <EmailIcon />
                  <Typography variant="body1">{studentData?.email || currentUser?.email || 'Email not available'}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Student Basic Info - Disabled */}
        {false && studentData && (
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12}>
              <Card 
                elevation={3}
                sx={{ 
                  borderRadius: 3,
                  background: `linear-gradient(45deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`,
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box display="flex" alignItems="center" mb={3}>
                    <PersonIcon color="primary" sx={{ mr: 2, fontSize: '2rem' }} />
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                      Personal Information
                    </Typography>
                  </Box>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper 
                        elevation={1} 
                        sx={{ 
                          p: 2, 
                          textAlign: 'center', 
                          borderRadius: 2,
                          background: alpha(theme.palette.primary.main, 0.05),
                          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                        }}
                      >
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                          Student ID
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                          {studentData?.studentCode || currentUser?.username || 'Not assigned'}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper 
                        elevation={1} 
                        sx={{ 
                          p: 2, 
                          textAlign: 'center', 
                          borderRadius: 2,
                          background: alpha(theme.palette.secondary.main, 0.05),
                          border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`
                        }}
                      >
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                          Class
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.secondary.main }}>
                          {studentData?.className || 'Not assigned'}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper 
                        elevation={1} 
                        sx={{ 
                          p: 2, 
                          textAlign: 'center', 
                          borderRadius: 2,
                          background: alpha(theme.palette.success.main, 0.05),
                          border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`
                        }}
                      >
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                          Date of Birth
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.success.main }}>
                          {studentData?.dateOfBirth || 'Not provided'}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper 
                        elevation={1} 
                        sx={{ 
                          p: 2, 
                          textAlign: 'center', 
                          borderRadius: 2,
                          background: alpha(theme.palette.warning.main, 0.05),
                          border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`
                        }}
                      >
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                          Gender
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.warning.main }}>
                          {studentData?.gender || 'Not specified'}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}      {/* Health Overview Cards */}
      <Grid container spacing={3} mb={4}>
        {/* Health Profile Card */}
        <Grid item xs={12} md={4}>
          <Card 
            elevation={4}
            sx={{ 
              height: '100%',
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.05)} 0%, ${alpha(theme.palette.error.main, 0.1)} 100%)`,
              border: `2px solid ${alpha(theme.palette.error.main, 0.2)}`,
              transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: `0 12px 20px ${alpha(theme.palette.error.main, 0.3)}`
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" mb={3}>
                <Avatar
                  sx={{
                    bgcolor: theme.palette.error.main,
                    width: 48,
                    height: 48,
                    mr: 2
                  }}
                >
                  <FavoriteIcon />
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.palette.error.main }}>
                  Health Profile
                </Typography>
              </Box>
              <Divider sx={{ mb: 3, borderColor: alpha(theme.palette.error.main, 0.2) }} />
              
              <Box mb={2}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                  Blood Type
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.error.main }}>
                  {studentData?.healthProfile?.bloodType || 'Not available'}
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                  Height
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {studentData?.healthProfile?.height || 'Not available'}
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                  Weight
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {studentData?.healthProfile?.weight || 'Not available'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                  Allergies
                </Typography>
                <Chip 
                  label={studentData?.healthProfile?.allergies?.join(', ') || 'None reported'}
                  color="error"
                  variant="outlined"
                  sx={{ mt: 1, width: '100%', justifyContent: 'flex-start' }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Medical History Card */}
        <Grid item xs={12} md={4}>
          <Card 
            elevation={4}
            sx={{ 
              height: '100%',
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
              border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: `0 12px 20px ${alpha(theme.palette.primary.main, 0.3)}`
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" mb={3}>
                <Avatar
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    width: 48,
                    height: 48,
                    mr: 2
                  }}
                >
                  <AssignmentIcon />
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                  Medical History
                </Typography>
              </Box>
              <Divider sx={{ mb: 3, borderColor: alpha(theme.palette.primary.main, 0.2) }} />
              
              {(studentData?.medicalHistory || []).length > 0 ? (
                (studentData?.medicalHistory || []).slice(0, 3).map((record, index) => (
                  <Paper 
                    key={index} 
                    elevation={1}
                    sx={{ 
                      p: 2, 
                      mb: 2, 
                      borderRadius: 2,
                      background: alpha(theme.palette.background.paper, 0.8),
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight="bold" color="primary">
                      {record.type}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      <CalendarIcon sx={{ fontSize: 12, mr: 0.5 }} />
                      {record.date}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 1 }}>
                      {record.description}
                    </Typography>
                    <Chip 
                      label={record.status} 
                      size="small" 
                      color={record.status === 'Completed' || record.status === 'Approved' ? 'success' : 'default'}
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Paper>
                ))
              ) : (
                <Box textAlign="center" py={4}>
                  <AssignmentIcon sx={{ fontSize: 60, color: alpha(theme.palette.primary.main, 0.3), mb: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    No medical history available
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Vaccination Record Card */}
        <Grid item xs={12} md={4}>
          <Card 
            elevation={4}
            sx={{ 
              height: '100%',
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.05)} 0%, ${alpha(theme.palette.success.main, 0.1)} 100%)`,
              border: `2px solid ${alpha(theme.palette.success.main, 0.2)}`,
              transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: `0 12px 20px ${alpha(theme.palette.success.main, 0.3)}`
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" mb={3}>
                <Avatar
                  sx={{
                    bgcolor: theme.palette.success.main,
                    width: 48,
                    height: 48,
                    mr: 2
                  }}
                >
                  <VaccinesIcon />
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.palette.success.main }}>
                  Vaccination Record
                </Typography>
              </Box>
              <Divider sx={{ mb: 3, borderColor: alpha(theme.palette.success.main, 0.2) }} />
              
              {(studentData?.vaccinationRecord || []).length > 0 ? (
                (studentData?.vaccinationRecord || []).map((vaccine, index) => (
                  <Paper 
                    key={index} 
                    elevation={1}
                    sx={{ 
                      p: 2, 
                      mb: 2, 
                      borderRadius: 2,
                      background: alpha(theme.palette.background.paper, 0.8),
                      border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight="bold" color="success.main">
                      {vaccine.vaccine}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      <CalendarIcon sx={{ fontSize: 12, mr: 0.5 }} />
                      {vaccine.dose} - {vaccine.date}
                    </Typography>
                    {vaccine.nextDue && (
                      <Chip 
                        label={`Next due: ${vaccine.nextDue}`}
                        size="small"
                        color="warning"
                        variant="outlined"
                        sx={{ mt: 1, fontSize: '0.75rem' }}
                      />
                    )}
                  </Paper>
                ))
              ) : (
                <Box textAlign="center" py={4}>
                  <VaccinesIcon sx={{ fontSize: 60, color: alpha(theme.palette.success.main, 0.3), mb: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    No vaccination records available
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Emergency Contact & Health Statistics */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card 
            elevation={4}
            sx={{ 
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.05)} 0%, ${alpha(theme.palette.warning.main, 0.1)} 100%)`,
              border: `2px solid ${alpha(theme.palette.warning.main, 0.2)}`,
              transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: `0 12px 20px ${alpha(theme.palette.warning.main, 0.3)}`
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" mb={3}>
                <Avatar
                  sx={{
                    bgcolor: theme.palette.warning.main,
                    width: 48,
                    height: 48,
                    mr: 2
                  }}
                >
                  <PhoneIcon />
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.palette.warning.main }}>
                  Emergency Contact
                </Typography>
              </Box>
              <Divider sx={{ mb: 3, borderColor: alpha(theme.palette.warning.main, 0.2) }} />
              
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  mb: 2, 
                  borderRadius: 2,
                  background: alpha(theme.palette.background.paper, 0.8)
                }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                  Name
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {studentData?.healthProfile?.emergencyContact?.name || 'Not available'}
                </Typography>
              </Paper>
              
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  mb: 2, 
                  borderRadius: 2,
                  background: alpha(theme.palette.background.paper, 0.8)
                }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                  Relationship
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {studentData?.healthProfile?.emergencyContact?.relationship || 'Not available'}
                </Typography>
              </Paper>
              
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  background: alpha(theme.palette.background.paper, 0.8)
                }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                  Phone
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.warning.main }}>
                  {studentData?.healthProfile?.emergencyContact?.phone || 'Not available'}
                </Typography>
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card 
            elevation={4}
            sx={{ 
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.05)} 0%, ${alpha(theme.palette.info.main, 0.1)} 100%)`,
              border: `2px solid ${alpha(theme.palette.info.main, 0.2)}`,
              transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: `0 12px 20px ${alpha(theme.palette.info.main, 0.3)}`
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" mb={3}>
                <Avatar
                  sx={{
                    bgcolor: theme.palette.info.main,
                    width: 48,
                    height: 48,
                    mr: 2
                  }}
                >
                  <TrendingUpIcon />
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.palette.info.main }}>
                  Health Statistics
                </Typography>
              </Box>
              <Divider sx={{ mb: 3, borderColor: alpha(theme.palette.info.main, 0.2) }} />
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 2, 
                      textAlign: 'center', 
                      borderRadius: 2,
                      background: alpha(theme.palette.primary.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                      Health Declarations
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                      {studentData?.quickStats?.healthDeclarations || 0}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 2, 
                      textAlign: 'center', 
                      borderRadius: 2,
                      background: alpha(theme.palette.secondary.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                      Total Appointments
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', color: theme.palette.secondary.main }}>
                      {studentData?.quickStats?.totalAppointments || 0}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 2, 
                      textAlign: 'center', 
                      borderRadius: 2,
                      background: alpha(theme.palette.success.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                      Vaccinations
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', color: theme.palette.success.main }}>
                      {studentData?.vaccinationRecord?.length || 0}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 2, 
                      textAlign: 'center', 
                      borderRadius: 2,
                      background: alpha(theme.palette.error.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.error.main, 0.1)}`
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                      Medical Records
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', color: theme.palette.error.main }}>
                      {studentData?.medicalHistory?.length || 0}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      </Container>
    </Box>
  );
};

export default StudentDashboard;
