import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Button,
  Grid,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Person as PersonIcon,
  LocalHospital as MedicalIcon,
  Favorite as HeartIcon,
  Warning as WarningIcon,
  Medication as MedicationIcon,
  Vaccines as VaccineIcon,
  Height as HeightIcon,
  Monitor as VitalsIcon,
  Edit as EditIcon,
  Print as PrintIcon,
  Warning as EmergencyIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Home as HomeIcon,
  School as SchoolIcon,
} from '@mui/icons-material';

// Mock student data
const studentData = {
  id: 1,
  name: 'Emma Johnson',
  studentCode: 'STU2024001', // Changed from studentId
  grade: '5',
  dateOfBirth: '2014-03-15',
  age: 10,
  gender: 'Female',
  bloodType: 'A+',
  height: '140 cm',
  weight: '35 kg',
  bmi: 17.9,
  profilePicture: '/avatars/student1.jpg',
  emergencyContacts: [
    {
      name: 'Sarah Johnson',
      relationship: 'Mother',
      phone: '+1 (555) 123-4567',
      email: 'sarah.johnson@email.com',
      isPrimary: true
    },
    {
      name: 'Mike Johnson',
      relationship: 'Father',
      phone: '+1 (555) 123-4568',
      email: 'mike.johnson@email.com',
      isPrimary: false
    }
  ],
  address: {
    street: '123 Oak Street',
    city: 'Hanoi',
    state: 'Vietnam',
    zipCode: '10000'
  },
  classInfo: {
    teacher: 'Mrs. Smith',
    room: '205',
    homeroom: '8:00 AM'
  }
};

const healthData = {
  allergies: [
    {
      allergen: 'Peanuts',
      severity: 'Severe',
      reaction: 'Anaphylaxis',
      treatment: 'EpiPen immediately, call 911'
    },
    {
      allergen: 'Shellfish',
      severity: 'Moderate',
      reaction: 'Hives, swelling',
      treatment: 'Antihistamine, monitor closely'
    }
  ],
  medications: [
    {
      name: 'EpiPen',
      dosage: '0.3mg',
      frequency: 'As needed',
      reason: 'Severe allergic reactions',
      prescribedBy: 'Dr. Anderson',
      startDate: '2023-09-01',
      endDate: '2024-09-01'
    },
    {
      name: 'Albuterol Inhaler',
      dosage: '2 puffs',
      frequency: 'As needed',
      reason: 'Exercise-induced asthma',
      prescribedBy: 'Dr. Brown',
      startDate: '2023-08-15',
      endDate: '2024-08-15'
    }
  ],
  conditions: [
    {
      condition: 'Exercise-induced asthma',
      severity: 'Mild',
      diagnosedDate: '2022-05-10',
      managementPlan: 'Use inhaler before physical activities, avoid outdoor exercise on high pollen days'
    }
  ],
  immunizations: [
    {
      vaccine: 'MMR',
      date: '2019-08-15',
      doseNumber: 2,
      nextDue: 'Complete'
    },
    {
      vaccine: 'Tdap',
      date: '2023-09-01',
      doseNumber: 1,
      nextDue: '2028-09-01'
    },
    {
      vaccine: 'Influenza',
      date: '2024-10-01',
      doseNumber: 1,
      nextDue: '2025-10-01'
    }
  ],
  vitals: {
    lastCheckup: '2024-11-01',
    height: '140 cm',
    weight: '35 kg',
    bmi: 17.9,
    bloodPressure: '102/65',
    heartRate: '88 bpm',
    temperature: '98.6°F'
  },
  physicalLimitations: [
    {
      limitation: 'Avoid strenuous exercise without inhaler',
      notes: 'Student should have inhaler available during PE class'
    }
  ]
};

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const HealthProfile = () => {
  const [tabValue, setTabValue] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getBMIStatus = (bmi) => {
    if (bmi < 5) return { status: 'Underweight', color: 'warning' };
    if (bmi < 85) return { status: 'Normal', color: 'success' };
    if (bmi < 95) return { status: 'Overweight', color: 'warning' };
    return { status: 'Obese', color: 'error' };
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'severe': return 'error';
      case 'moderate': return 'warning';
      case 'mild': return 'info';
      default: return 'default';
    }
  };

  const bmiStatus = getBMIStatus(healthData.vitals.bmi);

  return (
    <Box className="p-6">
      <Typography variant="h4" gutterBottom className="text-blue-600 font-bold">
        My Health Profile
      </Typography>

      {/* Student Overview Card */}
      <Card className="mb-6">
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar
                src={studentData.profilePicture}
                sx={{ width: 100, height: 100 }}
              >
                {studentData.name.split(' ').map(n => n[0]).join('')}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h5" gutterBottom>{studentData.name}</Typography>
              <Grid container spacing={2}>
                <Grid item>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Student Code:</strong> {studentData.studentCode} {/* Changed from studentId */}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Grade:</strong> {studentData.grade}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Age:</strong> {studentData.age} years old
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Blood Type:</strong> {studentData.bloodType}
                  </Typography>
                </Grid>
              </Grid>
              <Box className="mt-3 flex gap-2">
                <Chip 
                  icon={<HeightIcon />}
                  label={`Height: ${healthData.vitals.height}`}
                  variant="outlined"
                  size="small"
                />
                <Chip 
                  icon={<VitalsIcon />}
                  label={`Weight: ${healthData.vitals.weight}`}
                  variant="outlined"
                  size="small"
                />
                <Chip 
                  icon={<HeartIcon />}
                  label={`BMI: ${healthData.vitals.bmi} (${bmiStatus.status})`}
                  color={bmiStatus.color}
                  size="small"
                />
              </Box>
            </Grid>
            <Grid item>
              <Box className="flex flex-col gap-2">
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setEditDialogOpen(true)}
                >
                  Update Profile
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<PrintIcon />}
                >
                  Print Profile
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="health profile tabs">
            <Tab 
              label="Basic Info" 
              icon={<PersonIcon />} 
              iconPosition="start"
            />
            <Tab 
              label="Medical Conditions" 
              icon={<MedicalIcon />} 
              iconPosition="start"
            />
            <Tab 
              label="Medications" 
              icon={<MedicationIcon />} 
              iconPosition="start"
            />
            <Tab 
              label="Allergies" 
              icon={<WarningIcon />} 
              iconPosition="start"
            />
            <Tab 
              label="Immunizations" 
              icon={<VaccineIcon />} 
              iconPosition="start"
            />
            <Tab 
              label="Emergency Contacts" 
              icon={<EmergencyIcon />} 
              iconPosition="start"
            />
          </Tabs>

          {/* Basic Info Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom className="flex items-center">
                      <PersonIcon className="mr-2" />
                      Personal Information
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Full Name"
                          secondary={studentData.name}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Date of Birth"
                          secondary={studentData.dateOfBirth}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Gender"
                          secondary={studentData.gender}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Blood Type"
                          secondary={studentData.bloodType}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom className="flex items-center">
                      <VitalsIcon className="mr-2" />
                      Current Vitals
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Height"
                          secondary={healthData.vitals.height}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Weight"
                          secondary={healthData.vitals.weight}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="BMI"
                          secondary={
                            <Box className="flex items-center">
                              <span>{healthData.vitals.bmi}</span>
                              <Chip 
                                label={bmiStatus.status}
                                color={bmiStatus.color}
                                size="small"
                                className="ml-2"
                              />
                            </Box>
                          }
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Last Checkup"
                          secondary={healthData.vitals.lastCheckup}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom className="flex items-center">
                      <HomeIcon className="mr-2" />
                      Address
                    </Typography>
                    <Typography variant="body2">
                      {studentData.address.street}<br />
                      {studentData.address.city}, {studentData.address.state} {studentData.address.zipCode}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom className="flex items-center">
                      <SchoolIcon className="mr-2" />
                      Class Information
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Teacher"
                          secondary={studentData.classInfo.teacher}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Room"
                          secondary={studentData.classInfo.room}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Homeroom"
                          secondary={studentData.classInfo.homeroom}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Medical Conditions Tab */}
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom>Medical Conditions</Typography>
            {healthData.conditions.length > 0 ? (
              <Grid container spacing={3}>
                {healthData.conditions.map((condition, index) => (
                  <Grid item xs={12} key={index}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box className="flex items-center justify-between mb-2">
                          <Typography variant="h6">{condition.condition}</Typography>
                          <Chip 
                            label={condition.severity}
                            color={getSeverityColor(condition.severity)}
                            size="small"
                          />
                        </Box>
                        <Typography variant="body2" color="textSecondary" className="mb-2">
                          Diagnosed: {condition.diagnosedDate}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Management Plan:</strong> {condition.managementPlan}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Alert severity="info">No medical conditions on record</Alert>
            )}
            
            {healthData.physicalLimitations.length > 0 && (
              <Box className="mt-4">
                <Typography variant="h6" gutterBottom>Physical Limitations</Typography>
                {healthData.physicalLimitations.map((limitation, index) => (
                  <Alert key={index} severity="warning" className="mb-2">
                    <Typography variant="subtitle2">{limitation.limitation}</Typography>
                    <Typography variant="body2">{limitation.notes}</Typography>
                  </Alert>
                ))}
              </Box>
            )}
          </TabPanel>

          {/* Medications Tab */}
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>Current Medications</Typography>
            {healthData.medications.length > 0 ? (
              <Grid container spacing={3}>
                {healthData.medications.map((medication, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>{medication.name}</Typography>
                        <List dense>
                          <ListItem>
                            <ListItemText
                              primary="Dosage"
                              secondary={medication.dosage}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              primary="Frequency"
                              secondary={medication.frequency}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              primary="Reason"
                              secondary={medication.reason}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              primary="Prescribed by"
                              secondary={medication.prescribedBy}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              primary="Valid until"
                              secondary={medication.endDate}
                            />
                          </ListItem>
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Alert severity="info">No current medications</Alert>
            )}
          </TabPanel>

          {/* Allergies Tab */}
          <TabPanel value={tabValue} index={3}>
            <Typography variant="h6" gutterBottom>Known Allergies</Typography>
            {healthData.allergies.length > 0 ? (
              <Grid container spacing={3}>
                {healthData.allergies.map((allergy, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Alert 
                      severity={allergy.severity === 'Severe' ? 'error' : 'warning'}
                      className="mb-2"
                    >
                      <Typography variant="h6" gutterBottom>{allergy.allergen}</Typography>
                      <Typography variant="body2" className="mb-2">
                        <strong>Severity:</strong> {allergy.severity}
                      </Typography>
                      <Typography variant="body2" className="mb-2">
                        <strong>Reaction:</strong> {allergy.reaction}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Treatment:</strong> {allergy.treatment}
                      </Typography>
                    </Alert>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Alert severity="success">No known allergies</Alert>
            )}
          </TabPanel>

          {/* Immunizations Tab */}
          <TabPanel value={tabValue} index={4}>
            <Typography variant="h6" gutterBottom>Immunization Record</Typography>
            <Grid container spacing={3}>
              {healthData.immunizations.map((vaccine, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>{vaccine.vaccine}</Typography>
                      <List dense>
                        <ListItem>
                          <ListItemText
                            primary="Date Received"
                            secondary={vaccine.date}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Dose Number"
                            secondary={vaccine.doseNumber}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Next Due"
                            secondary={vaccine.nextDue}
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          {/* Emergency Contacts Tab */}
          <TabPanel value={tabValue} index={5}>
            <Typography variant="h6" gutterBottom>Emergency Contacts</Typography>
            <Grid container spacing={3}>
              {studentData.emergencyContacts.map((contact, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box className="flex items-center justify-between mb-2">
                        <Typography variant="h6">{contact.name}</Typography>
                        {contact.isPrimary && (
                          <Chip label="Primary" color="primary" size="small" />
                        )}
                      </Box>
                      <Typography variant="body2" color="textSecondary" className="mb-3">
                        {contact.relationship}
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemIcon>
                            <PhoneIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary="Phone"
                            secondary={contact.phone}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <EmailIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary="Email"
                            secondary={contact.email}
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>
        </CardContent>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Health Profile</DialogTitle>
        <DialogContent>
          <Alert severity="info" className="mb-4">
            Some information can only be updated by medical staff or parents. 
            You can update your personal preferences and emergency contact information.
          </Alert>
          <Typography variant="body2">
            To make changes to medical information, allergies, or medications, 
            please contact the school nurse or have your parent/guardian submit an update.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Close</Button>
          <Button variant="contained">Contact Nurse</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HealthProfile;
