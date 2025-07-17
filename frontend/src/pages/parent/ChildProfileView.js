import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  Tab,
  Tabs,
  LinearProgress,
  IconButton
} from '@mui/material';
import {
  MedicalServices as MedicalIcon,
  Vaccines as VaccineIcon,
  LocalPharmacy as PharmacyIcon,
  ContactPhone as ContactIcon,
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`child-profile-tabpanel-${index}`}
      aria-labelledby={`child-profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ChildProfileView = () => {
  const { childId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [childData, setChildData] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [vaccinationRecords, setVaccinationRecords] = useState([]);
  const [medicationRequests, setMedicationRequests] = useState([]);

  const fetchChildData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch child basic information
      const childResponse = await axios.get(`/api/students/${childId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Mock data for demonstration - replace with actual API calls
      const mockChildData = {
        ...childResponse.data,
        studentId: childId,
        fullName: 'John Smith',
        dateOfBirth: '2015-03-15',
        gender: 'Male',
        className: 'Grade 3A',
        school: 'FPT Junior High School',
        bloodType: 'O+',
        allergies: ['Peanuts', 'Shellfish'],
        medicalConditions: ['Asthma'],
        emergencyContacts: [
          {
            name: 'Mary Smith',
            relationship: 'Mother',
            phone: '(555) 123-4567',
            isPrimary: true
          },
          {
            name: 'Robert Smith',
            relationship: 'Father',
            phone: '(555) 123-4568',
            isPrimary: false
          }
        ],
        healthStatus: 'Good',
        lastCheckup: '2024-01-10'
      };

      const mockMedicalHistory = [
        {
          id: 1,
          date: '2024-01-10',
          type: 'Regular Checkup',
          provider: 'Dr. Sarah Johnson',
          findings: 'Normal development, height and weight within normal range',
          recommendations: 'Continue current diet and exercise routine'
        },
        {
          id: 2,
          date: '2023-12-15',
          type: 'Sick Visit',
          provider: 'Nurse Williams',
          findings: 'Common cold symptoms',
          recommendations: 'Rest and fluids, return if symptoms worsen'
        }
      ];

      const mockVaccinationRecords = [
        {
          id: 1,
          vaccine: 'MMR',
          date: '2023-09-01',
          provider: 'School Health Services',
          nextDue: '2024-09-01',
          status: 'Up to date'
        },
        {
          id: 2,
          vaccine: 'Flu Shot',
          date: '2023-10-15',
          provider: 'Dr. Sarah Johnson',
          nextDue: '2024-10-15',
          status: 'Due soon'
        }
      ];

      const mockMedicationRequests = [
        {
          id: 1,
          medicationName: 'Albuterol Inhaler',
          status: 'approved',
          requestDate: '2024-01-05',
          approvedDate: '2024-01-06',
          dosage: '2 puffs as needed',
          frequency: 'As needed for asthma symptoms'
        },
        {
          id: 2,
          medicationName: 'EpiPen',
          status: 'pending',
          requestDate: '2024-01-14',
          dosage: '0.3mg auto-injector',
          frequency: 'Emergency use only'
        }
      ];

      setChildData(mockChildData);
      setMedicalHistory(mockMedicalHistory);
      setVaccinationRecords(mockVaccinationRecords);
      setMedicationRequests(mockMedicationRequests);
    } catch (error) {
      console.error('Error fetching child data:', error);
    } finally {
      setLoading(false);
    }
  }, [childId]);

  useEffect(() => {
    if (childId && currentUser) {
      fetchChildData();
    }
  }, [childId, currentUser, fetchChildData]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      case 'Up to date': return 'success';
      case 'Due soon': return 'warning';
      case 'Overdue': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Typography>Loading child profile...</Typography>
        </Box>
      </Box>
    );
  }

  if (!childData) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Child profile not found or you don't have permission to view this profile.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/parent/dashboard')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" gutterBottom>
            Student Profile
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comprehensive health and academic information
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/parent/child/${childId}/edit`)}
        >
          Edit Information
        </Button>
      </Box>

      {/* Student Overview Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3} sx={{ textAlign: 'center' }}>
              <Avatar sx={{ width: 120, height: 120, mx: 'auto', mb: 2, bgcolor: 'primary.main', fontSize: '3rem' }}>
                {childData.fullName?.charAt(0)}
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {childData.fullName}
              </Typography>
              <Chip 
                label={childData.healthStatus} 
                color={childData.healthStatus === 'Good' ? 'success' : 'warning'}
                sx={{ mb: 1 }}
              />
            </Grid>
            
            <Grid item xs={12} md={9}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Student Code</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{childData.studentId}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Class</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{childData.className}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Date of Birth</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {new Date(childData.dateOfBirth).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Gender</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{childData.gender}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Blood Type</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>{childData.bloodType}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Last Checkup</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {new Date(childData.lastCheckup).toLocaleDateString()}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
            <Tab icon={<MedicalIcon />} label="Medical Information" />
            <Tab icon={<AssignmentIcon />} label="Medical History" />
            <Tab icon={<VaccineIcon />} label="Vaccinations" />
            <Tab icon={<PharmacyIcon />} label="Medications" />
            <Tab icon={<ContactIcon />} label="Emergency Contacts" />
          </Tabs>
        </Box>

        {/* Medical Information Tab */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Allergies
              </Typography>
              {childData.allergies && childData.allergies.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  {childData.allergies.map((allergy, index) => (
                    <Chip key={index} label={allergy} color="error" variant="outlined" />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  No known allergies
                </Typography>
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Medical Conditions
              </Typography>
              {childData.medicalConditions && childData.medicalConditions.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  {childData.medicalConditions.map((condition, index) => (
                    <Chip key={index} label={condition} color="warning" variant="outlined" />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  No known medical conditions
                </Typography>
              )}
            </Grid>
          </Grid>
        </TabPanel>

        {/* Medical History Tab */}
        <TabPanel value={activeTab} index={1}>
          <List>
            {medicalHistory.map((record, index) => (
              <React.Fragment key={record.id}>
                <ListItem alignItems="flex-start">
                  <ListItemIcon>
                    <MedicalIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {record.type}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • {new Date(record.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Provider:</strong> {record.provider}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Findings:</strong> {record.findings}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Recommendations:</strong> {record.recommendations}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < medicalHistory.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        </TabPanel>

        {/* Vaccinations Tab */}
        <TabPanel value={activeTab} index={2}>
          <List>
            {vaccinationRecords.map((vaccine, index) => (
              <React.Fragment key={vaccine.id}>
                <ListItem>
                  <ListItemIcon>
                    <VaccineIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {vaccine.vaccine}
                        </Typography>
                        <Chip 
                          label={vaccine.status} 
                          size="small" 
                          color={getStatusColor(vaccine.status)}
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2">
                          <strong>Last Given:</strong> {new Date(vaccine.date).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Provider:</strong> {vaccine.provider}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Next Due:</strong> {new Date(vaccine.nextDue).toLocaleDateString()}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < vaccinationRecords.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        </TabPanel>

        {/* Medications Tab */}
        <TabPanel value={activeTab} index={3}>
          <List>
            {medicationRequests.map((medication, index) => (
              <React.Fragment key={medication.id}>
                <ListItem>
                  <ListItemIcon>
                    <PharmacyIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {medication.medicationName}
                        </Typography>
                        <Chip 
                          label={medication.status} 
                          size="small" 
                          color={getStatusColor(medication.status)}
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2">
                          <strong>Dosage:</strong> {medication.dosage}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Frequency:</strong> {medication.frequency}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Requested:</strong> {new Date(medication.requestDate).toLocaleDateString()}
                        </Typography>
                        {medication.approvedDate && (
                          <Typography variant="body2">
                            <strong>Approved:</strong> {new Date(medication.approvedDate).toLocaleDateString()}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
                {index < medicationRequests.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        </TabPanel>

        {/* Emergency Contacts Tab */}
        <TabPanel value={activeTab} index={4}>
          <List>
            {childData.emergencyContacts.map((contact, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemIcon>
                    <ContactIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {contact.name}
                        </Typography>
                        {contact.isPrimary && (
                          <Chip label="Primary" size="small" color="primary" />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2">
                          <strong>Relationship:</strong> {contact.relationship}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Phone:</strong> {contact.phone}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < childData.emergencyContacts.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        </TabPanel>
      </Card>
    </Box>
  );
};

export default ChildProfileView;
