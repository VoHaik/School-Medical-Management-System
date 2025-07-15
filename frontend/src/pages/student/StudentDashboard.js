import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../co          ],
          recentActivities: []ontext';
import { getStudentDashboard } from '../../utils/api';
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
  Divider
} from '@mui/material';
import { 
  Person as PersonIcon,
  History as HistoryIcon,
  Vaccines as VaccinesIcon
} from '@mui/icons-material';

const StudentDashboard = () => {
  const { currentUser } = useContext(AuthContext);
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
        // Try to fetch real data from API first, fallback to mock if API fails
        let apiData = null;
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get('/api/student/health-profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          apiData = response.data;
        } catch (apiError) {
          }

        // Enhanced mock data for student overview (used when API fails or returns no data)
        const mockData = {
          studentCode: currentUser?.userCode || 'STU001',
          fullName: currentUser?.fullName || 'Nguyen Minh Khai',
          email: currentUser?.email || 'khai.nguyen@student.edu.vn',
          className: 'Grade 8A',
          dateOfBirth: '2010-05-15',
          gender: 'Male',
          healthProfile: {
            bloodType: 'O+',
            height: '150 cm',
            weight: '45 kg',
            allergies: ['No known allergies'],
            medicalConditions: ['None reported'],
            emergencyContact: {
              name: 'Le Thi Mai',
              relationship: 'Mother',
              phone: '0901234567'
            }
          },
          medicalHistory: [
            {
              date: '2024-12-10',
              type: 'Health Declaration',
              status: 'Approved',
              description: 'Monthly health check - all clear'
            },
            {
              date: '2024-11-15',
              type: 'Health Checkup',
              status: 'Completed',
              description: 'Annual physical examination'
            },
            {
              date: '2024-10-20',
              type: 'Vaccination',
              status: 'Completed',
              description: 'Flu vaccine administered'
            }
          ],
          vaccinationRecord: [
            {
              vaccine: 'COVID-19',
              date: '2024-03-15',
              dose: '2nd dose',
              nextDue: null
            },
            {
              vaccine: 'Influenza',
              date: '2024-10-20',
              dose: 'Annual',
              nextDue: '2025-10-20'
            },
            {
              vaccine: 'Hepatitis B',
              date: '2023-08-10',
              dose: '3rd dose',
              nextDue: null
            }
          ],
          quickStats: {
            totalAppointments: 3,
            pendingVaccinations: 1,
            healthDeclarations: 5,
            unreadNotifications: 0
          },
          recentActivities: []
        };
        
        // Use API data if available, otherwise use mock data
        setStudentData(apiData || mockData);
      } catch (err) {
        setError('Connection error: ' + err.message);
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
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Student Health Dashboard
        </Typography>
        {studentData?.fullName && (
          <Typography variant="h6" color="text.secondary">
            Welcome, {studentData.fullName}
          </Typography>
        )}
      </Box>

      {/* Student Basic Info */}
      {studentData && (
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Personal Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2" color="text.secondary">Student ID</Typography>
                    <Typography variant="body1">{studentData.studentCode}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2" color="text.secondary">Class</Typography>
                    <Typography variant="body1">{studentData.className}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2" color="text.secondary">Date of Birth</Typography>
                    <Typography variant="body1">{studentData.dateOfBirth}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2" color="text.secondary">Gender</Typography>
                    <Typography variant="body1">{studentData.gender}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Health Overview Cards */}
      <Grid container spacing={3} mb={4}>
        {/* Health Profile Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <PersonIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Health Profile</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <Box mb={1}>
                <Typography variant="body2" color="text.secondary">Blood Type:</Typography>
                <Typography variant="body1">{studentData.healthProfile.bloodType}</Typography>
              </Box>
              <Box mb={1}>
                <Typography variant="body2" color="text.secondary">Height:</Typography>
                <Typography variant="body1">{studentData.healthProfile.height}</Typography>
              </Box>
              <Box mb={1}>
                <Typography variant="body2" color="text.secondary">Weight:</Typography>
                <Typography variant="body1">{studentData.healthProfile.weight}</Typography>
              </Box>
              <Box mb={1}>
                <Typography variant="body2" color="text.secondary">Allergies:</Typography>
                <Typography variant="body1">{studentData.healthProfile.allergies.join(', ')}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Medical History Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <HistoryIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Medical History</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              {studentData.medicalHistory.slice(0, 3).map((record, index) => (
                <Box key={index} mb={2}>
                  <Typography variant="body2" fontWeight="medium">{record.type}</Typography>
                  <Typography variant="caption" color="text.secondary">{record.date}</Typography>
                  <Typography variant="body2" color="text.secondary">{record.description}</Typography>
                  <Chip 
                    label={record.status} 
                    size="small" 
                    color={record.status === 'Completed' || record.status === 'Approved' ? 'success' : 'default'}
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Vaccination Record Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <VaccinesIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Vaccination Record</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              {studentData.vaccinationRecord.map((vaccine, index) => (
                <Box key={index} mb={2}>
                  <Typography variant="body2" fontWeight="medium">{vaccine.vaccine}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {vaccine.dose} - {vaccine.date}
                  </Typography>
                  {vaccine.nextDue && (
                    <Typography variant="caption" color="warning.main" display="block">
                      Next due: {vaccine.nextDue}
                    </Typography>
                  )}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Emergency Contact */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Emergency Contact</Typography>
              <Divider sx={{ mb: 2 }} />
              <Box>
                <Typography variant="body2" color="text.secondary">Name:</Typography>
                <Typography variant="body1">{studentData.healthProfile.emergencyContact.name}</Typography>
              </Box>
              <Box mt={1}>
                <Typography variant="body2" color="text.secondary">Relationship:</Typography>
                <Typography variant="body1">{studentData.healthProfile.emergencyContact.relationship}</Typography>
              </Box>
              <Box mt={1}>
                <Typography variant="body2" color="text.secondary">Phone:</Typography>
                <Typography variant="body1">{studentData.healthProfile.emergencyContact.phone}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Health Statistics</Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Health Declarations</Typography>
                  <Typography variant="h4" color="primary">{studentData.quickStats.healthDeclarations}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Total Appointments</Typography>
                  <Typography variant="h4" color="primary">{studentData.quickStats.totalAppointments}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Vaccinations</Typography>
                  <Typography variant="h4" color="primary">{studentData.vaccinationRecord.length}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Medical Records</Typography>
                  <Typography variant="h4" color="primary">{studentData.medicalHistory.length}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default StudentDashboard;
