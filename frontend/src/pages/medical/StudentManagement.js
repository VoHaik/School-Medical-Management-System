import React, { useState, useEffect } from 'react';
import { useAlert } from '../../hooks/useAlert'; // Import useAlert hook
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Typography,
  Grid,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tab,
  Tabs,
  Badge,
  Tooltip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from '@mui/lab';
import {
  Search as SearchIcon,
  Group as GroupIcon,
  LocalHospital as HealthIcon,
  Medication as MedicationIcon,
  Vaccines as VaccinesIcon,
  Warning as WarningIcon,
  ExpandMore as ExpandMoreIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Assignment as AssignmentIcon,
  BarChart as BarChartIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import PageHeader from '../../components/PageHeader';
import './StudentManagement.css';
import { getAllStudents, getHealthDeclarationByStudentCode, getAllStudentsWithHealthData, nurseEditHealthDeclaration, getMedicalEventsByStudent } from '../../utils/api';

function StudentManagement() {
  const { successAlert, errorAlert } = useAlert(); // Initialize useAlert hook
  const [activeTab, setActiveTab] = useState(0);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('all');
  const [filterHealthStatus, setFilterHealthStatus] = useState('all');
  const [healthProfile, setHealthProfile] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use our getAllStudentsWithHealthData function which already maps and combines the data
      const studentsWithHealthData = await getAllStudentsWithHealthData();
      
      // Map the returned data to the format expected by the UI
      const formattedStudents = studentsWithHealthData.map(student => {
        // Extract health data
        const healthData = student.healthData || {};
        
        // Debug logging
        if (student.studentCode === 'STU001') {
          }
        
        return {
          id: student.studentCode,
          name: student.fullName,
          grade: student.className || 'N/A',
          dateOfBirth: student.dateOfBirth || 'N/A',
          gender: student.gender || 'N/A',
          studentCode: student.studentCode,
          email: student.userUsername || 'N/A',
          phone: 'N/A', // Not available in student data
          address: 'N/A', // Not available in student data
          
          // Health status based on health declaration
          healthStatus: healthData.status ? 
            (healthData.status === 'APPROVED' ? 'normal' : 
             healthData.status === 'PENDING' ? 'attention' : 
             healthData.status === 'REJECTED' ? 'critical' : 'normal') : 'normal',
          
          // Health declaration details
          allergies: healthData.allergies ? 
            (Array.isArray(healthData.allergies) ? 
              healthData.allergies.filter(item => item && item.trim() !== '') : 
              (typeof healthData.allergies === 'string' ? 
                healthData.allergies.split(',').filter(item => item.trim() !== '') : [])) : [],
          medications: healthData.medications ? 
            (Array.isArray(healthData.medications) ?
              healthData.medications.map(med => 
                typeof med === 'string' ? med : (med.medicationName || med.name || String(med))
              ) : 
              (typeof healthData.medications === 'string' ?
                healthData.medications.split(',').filter(item => item.trim() !== '') : [])) : [],
          chronicIllnesses: healthData.chronicIllnesses ? 
            (Array.isArray(healthData.chronicIllnesses) ? 
              healthData.chronicIllnesses.filter(item => item && item.trim() !== '') : 
              (typeof healthData.chronicIllnesses === 'string' ? 
                healthData.chronicIllnesses.split(',').filter(item => item.trim() !== '') : [])) : [],
          healthConditions: healthData.chronicIllnesses ? 
            (Array.isArray(healthData.chronicIllnesses) ? 
              healthData.chronicIllnesses.filter(item => item && item.trim() !== '') : 
              (typeof healthData.chronicIllnesses === 'string' ? 
                healthData.chronicIllnesses.split(',').filter(item => item.trim() !== '') : [])) : [],
          emergencyContacts: healthData.emergencyContacts ? 
            healthData.emergencyContacts : 
            (healthData.emergencyContactName ? [{ 
              name: healthData.emergencyContactName, 
              relationship: healthData.emergencyContactRelationship || 'Contact', 
              phone: healthData.emergencyContactPhone || 'N/A' 
            }] : []),
          
          // Other health-related info
          lastCheckup: healthData.lastModifiedDate || 'N/A',
          nextCheckup: 'Scheduled based on school policy',
          vaccinationStatus: healthData.vaccinationStatus || 'unknown',
          medicalEvents: student.medicalEvents || [],
          
          // Additional health declaration fields
          visionStatus: healthData.visionStatus || '',
          hearingStatus: healthData.hearingStatus || '',
          medicalHistory: healthData.medicalHistory || '',
          specialNeeds: healthData.specialNeeds || '',
          physicalLimitations: healthData.physicalLimitations || '',
          mentalHealthConcerns: healthData.mentalHealthConcerns || '',
          dietaryRestrictions: healthData.dietaryRestrictions || '',
          vaccinations: healthData.vaccinations || [],
          
          restrictions: healthData.specialNeeds ? 
            [healthData.specialNeeds] : []
        };
      });
      
      setStudents(formattedStudents);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Failed to load student data. Please try again later.');
      setLoading(false);
    }
  };

  const handleViewProfile = (student) => {
    setHealthProfile(student);
    setProfileDialogOpen(true);
  };

  const handleEditProfile = (student) => {
    setEditingProfile({
      ...student,
      allergies: student.allergies || [],
      chronicIllnesses: student.chronicIllnesses || [],
      emergencyContacts: student.emergencyContacts || [],
      visionStatus: student.visionStatus || '',
      hearingStatus: student.hearingStatus || '',
      specialNeeds: student.specialNeeds || '',
      physicalLimitations: student.physicalLimitations || '',
      mentalHealthConcerns: student.mentalHealthConcerns || '',
      dietaryRestrictions: student.dietaryRestrictions || '',
      medicalHistory: student.medicalHistory || ''
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingProfile) return;

    setIsSubmittingEdit(true);
    try {
      await nurseEditHealthDeclaration(editingProfile.studentCode, {
        allergies: editingProfile.allergies,
        chronicIllnesses: editingProfile.chronicIllnesses,
        emergencyContacts: editingProfile.emergencyContacts,
        visionStatus: editingProfile.visionStatus,
        hearingStatus: editingProfile.hearingStatus,
        specialNeeds: editingProfile.specialNeeds,
        physicalLimitations: editingProfile.physicalLimitations,
        mentalHealthConcerns: editingProfile.mentalHealthConcerns,
        dietaryRestrictions: editingProfile.dietaryRestrictions,
        medicalHistory: editingProfile.medicalHistory
      });

      successAlert('Health profile updated successfully!');
      setEditDialogOpen(false);
      setEditingProfile(null);
      fetchStudents(); // Reload the student list
    } catch (error) {
      console.error('Error updating health profile:', error);
      errorAlert('Error updating health profile: ' + (error.message || 'Unknown error'));
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = filterGrade === 'all' || student.grade.includes(filterGrade);
    const matchesHealthStatus = filterHealthStatus === 'all' || student.healthStatus === filterHealthStatus;
    return matchesSearch && matchesGrade && matchesHealthStatus;
  });

  const getHealthStatusColor = (status) => {
    switch (status) {
      case 'normal': return 'success';
      case 'attention': return 'warning';
      case 'critical': return 'error';
      default: return 'default';
    }
  };

  const getVaccinationStatusColor = (status) => {
    switch (status) {
      case 'up-to-date': return 'success';
      case 'pending': return 'warning';
      case 'overdue': return 'error';
      default: return 'default';
    }
  };

  const getHealthStatusIcon = (status) => {
    switch (status) {
      case 'attention': return <WarningIcon />;
      case 'critical': return <WarningIcon />;
      default: return <HealthIcon />;
    }
  };

  const countByHealthStatus = (status) => {
    return students.filter(student => student.healthStatus === status).length;
  };

  const countByVaccinationStatus = (status) => {
    return students.filter(student => student.vaccinationStatus === status).length;
  };

  return (
    <div className="p-6">
      <PageHeader
        title="Student Management"
        subtitle="View and manage student health profiles and medical information"
        icon={<GroupIcon />}
      />

      {/* Statistics Cards */}
      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent className="text-center">
              <GroupIcon className="text-4xl text-blue-500 mb-2" />
              <Typography variant="h4">{students.length}</Typography>
              <Typography color="textSecondary">Total Students</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent className="text-center">
              <HealthIcon className="text-4xl text-green-500 mb-2" />
              <Typography variant="h4">{countByHealthStatus('normal')}</Typography>
              <Typography color="textSecondary">Normal Health</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent className="text-center">
              <WarningIcon className="text-4xl text-orange-500 mb-2" />
              <Typography variant="h4">{countByHealthStatus('attention')}</Typography>
              <Typography color="textSecondary">Need Attention</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent className="text-center">
              <VaccinesIcon className="text-4xl text-purple-500 mb-2" />
              <Typography variant="h4">{countByVaccinationStatus('up-to-date')}</Typography>
              <Typography color="textSecondary">Vaccinations Current</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label="Student Directory" />
            <Tab label="Health Alerts" />
            <Tab label="Reports" />
          </Tabs>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <Box className="flex gap-4 mb-4">
            <TextField
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon className="mr-2 text-gray-500" />
              }}
              className="flex-1"
              disabled={loading}
            />
            <FormControl className="min-w-32">
              <InputLabel>Grade</InputLabel>
              <Select
                value={filterGrade}
                label="Grade"
                onChange={(e) => setFilterGrade(e.target.value)}
                disabled={loading}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="9">Grade 9</MenuItem>
                <MenuItem value="10">Grade 10</MenuItem>
                <MenuItem value="11">Grade 11</MenuItem>
                <MenuItem value="12">Grade 12</MenuItem>
              </Select>
            </FormControl>
            <FormControl className="min-w-40">
              <InputLabel>Health Status</InputLabel>
              <Select
                value={filterHealthStatus}
                label="Health Status"
                onChange={(e) => setFilterHealthStatus(e.target.value)}
                disabled={loading}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="normal">Normal</MenuItem>
                <MenuItem value="attention">Need Attention</MenuItem>
                <MenuItem value="critical">Critical</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              onClick={fetchStudents}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <HealthIcon />}
            >
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
          </Box>
          
          {/* Error message */}
          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Tab Content */}
          {activeTab === 0 && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student</TableCell>
                    <TableCell>Grade</TableCell>
                    <TableCell>Health Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                          <CircularProgress />
                        </Box>
                        <Typography variant="body2" color="textSecondary" align="center">
                          Loading student health data...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : filteredStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography variant="body2" color="textSecondary">
                          No students found matching your criteria.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <Box className="flex items-center gap-3">
                          <Avatar>{student.name.charAt(0)}</Avatar>
                          <div>
                            <Typography variant="subtitle2">{student.name}</Typography>
                            <Typography variant="caption" color="textSecondary">
                              ID: {student.studentCode}
                            </Typography>
                          </div>
                        </Box>
                      </TableCell>
                      <TableCell>{student.grade}</TableCell>
                      <TableCell>
                        <Chip
                          icon={getHealthStatusIcon(student.healthStatus)}
                          label={student.healthStatus}
                          color={getHealthStatusColor(student.healthStatus)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View Profile">
                          <IconButton onClick={() => handleViewProfile(student)}>
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {activeTab === 1 && (
            <div>
              <Alert severity="warning" className="mb-4">
                <Typography variant="h6">Health Alerts</Typography>
                <Typography>
                  {countByHealthStatus('attention')} students require attention, {countByVaccinationStatus('pending')} have pending vaccinations
                </Typography>
              </Alert>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardHeader title="Students Requiring Attention" />
                    <CardContent>
                      <List>
                        {students.filter(s => s.healthStatus === 'attention').map((student) => (
                          <ListItem key={student.id}>
                            <ListItemIcon>
                              <WarningIcon color="warning" />
                            </ListItemIcon>
                            <ListItemText
                              primary={student.name}
                              secondary={`${student.grade} - ${student.healthConditions.join(', ')}`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card>
                    <CardHeader title="Vaccination Pending" />
                    <CardContent>
                      <List>
                        {students.filter(s => s.vaccinationStatus === 'pending').map((student) => (
                          <ListItem key={student.id}>
                            <ListItemIcon>
                              <VaccinesIcon color="warning" />
                            </ListItemIcon>
                            <ListItemText
                              primary={student.name}
                              secondary={`${student.grade} - Vaccination due`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </div>
          )}

          {activeTab === 2 && (
            <div className="text-center py-8">
              <BarChartIcon className="text-6xl text-gray-400 mb-4" />
              <Typography variant="h6" color="textSecondary">
                Student Health Reports
              </Typography>
              <Typography color="textSecondary" className="mb-4">
                Generate comprehensive reports on student health statistics, trends, and compliance.
              </Typography>
              <Button variant="outlined" startIcon={<AssignmentIcon />}>
                Generate Report
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student Profile Dialog */}
      <Dialog open={profileDialogOpen} onClose={() => setProfileDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          {healthProfile && (
            <Box className="flex items-center gap-3">
              <Avatar className="w-12 h-12">{healthProfile.name.charAt(0)}</Avatar>
              <div>
                <Typography variant="h6">{healthProfile.name}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {healthProfile.grade} - ID: {healthProfile.studentCode}
                </Typography>
              </div>
            </Box>
          )}
        </DialogTitle>
        <DialogContent>
          {healthProfile && (
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Basic Information" />
                  <CardContent>
                    <Typography variant="body2" className="mb-2">
                      <strong>Date of Birth:</strong> {new Date(healthProfile.dateOfBirth).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" className="mb-2">
                      <strong>Gender:</strong> {healthProfile.gender}
                    </Typography>
                    {healthProfile.email && healthProfile.email !== 'N/A' && (
                      <Typography variant="body2" className="mb-2">
                        <strong>Email:</strong> {healthProfile.email}
                      </Typography>
                    )}
                    {healthProfile.phone && healthProfile.phone !== 'N/A' && (
                      <Typography variant="body2" className="mb-2">
                        <strong>Phone:</strong> {healthProfile.phone}
                      </Typography>
                    )}
                    {healthProfile.address && healthProfile.address !== 'N/A' && (
                      <Typography variant="body2">
                        <strong>Address:</strong> {healthProfile.address}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Health Status */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Health Status" />
                  <CardContent>
                    <Box className="mb-3">
                      <Typography variant="body2" className="mb-1"><strong>Overall Status:</strong></Typography>
                      <Chip
                        icon={getHealthStatusIcon(healthProfile.healthStatus)}
                        label={healthProfile.healthStatus}
                        color={getHealthStatusColor(healthProfile.healthStatus)}
                      />
                    </Box>
                    {healthProfile.lastCheckup && healthProfile.lastCheckup !== 'Invalid Date' && !isNaN(new Date(healthProfile.lastCheckup)) && (
                      <Typography variant="body2" className="mb-2">
                        <strong>Last Checkup:</strong> {new Date(healthProfile.lastCheckup).toLocaleDateString()}
                      </Typography>
                    )}
                    {healthProfile.nextCheckup && healthProfile.nextCheckup !== 'Invalid Date' && !isNaN(new Date(healthProfile.nextCheckup)) && (
                      <Typography variant="body2">
                        <strong>Next Checkup:</strong> {new Date(healthProfile.nextCheckup).toLocaleDateString()}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Health Conditions */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Health Conditions & Allergies" />
                  <CardContent>
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2">
                          Health Conditions ({healthProfile.healthConditions ? healthProfile.healthConditions.length : 0})
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {console.log('Current healthProfile healthConditions:', healthProfile.healthConditions)}
                        {healthProfile.healthConditions && healthProfile.healthConditions.length > 0 ? (
                          <Box>
                            {healthProfile.healthConditions.map((condition, index) => (
                              <Chip key={index} label={String(condition)} className="mr-1 mb-1" />
                            ))}
                          </Box>
                        ) : (
                          <Typography variant="body2" color="textSecondary">
                            No health conditions reported (Data: {JSON.stringify(healthProfile.healthConditions)})
                          </Typography>
                        )}
                      </AccordionDetails>
                    </Accordion>

                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2">
                          Allergies ({healthProfile.allergies ? healthProfile.allergies.length : 0})
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {/* Enhanced Debug logging */}
                        {console.log('Current healthProfile allergies:', healthProfile.allergies)}
                        {console.log('Allergies type:', typeof healthProfile.allergies)}
                        {console.log('Allergies is array:', Array.isArray(healthProfile.allergies))}
                        {healthProfile.allergies && healthProfile.allergies.length > 0 ? (
                          <Box>
                            {console.log('Rendering allergies:', healthProfile.allergies)}
                            {healthProfile.allergies.map((allergy, index) => (
                              <Chip key={index} label={String(allergy)} color="error" className="mr-1 mb-1" />
                            ))}
                          </Box>
                        ) : (
                          <Typography variant="body2" color="textSecondary">
                            No allergies reported (Data: {JSON.stringify(healthProfile.allergies)})
                          </Typography>
                        )}
                      </AccordionDetails>
                    </Accordion>

                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2">
                          Current Medications ({healthProfile.medications ? healthProfile.medications.length : 0})
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {console.log('Current healthProfile medications:', healthProfile.medications)}
                        {healthProfile.medications && healthProfile.medications.length > 0 ? (
                          <Box>
                            {healthProfile.medications.map((medication, index) => (
                              <Chip key={index} label={String(medication)} color="primary" className="mr-1 mb-1" />
                            ))}
                          </Box>
                        ) : (
                          <Typography variant="body2" color="textSecondary">
                            No current medications (Data: {JSON.stringify(healthProfile.medications)})
                          </Typography>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  </CardContent>
                </Card>
              </Grid>

              {/* Vision & Hearing and Medical History */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Vision & Hearing Status" />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="textSecondary">Vision Status</Typography>
                        <Typography variant="body2">{healthProfile.visionStatus || 'Not specified'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="textSecondary">Hearing Status</Typography>
                        <Typography variant="body2">{healthProfile.hearingStatus || 'Not specified'}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Medical History */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Medical History" />
                  <CardContent>
                    <Typography variant="body2">
                      {healthProfile.medicalHistory || 'No medical history provided'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Other Health Information */}
              <Grid item xs={12}>
                <Card>
                  <CardHeader title="Other Health Information" />
                  <CardContent>
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2">Special Needs or Accommodations</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body2">
                          {healthProfile.specialNeeds || 'None specified'}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>

                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2">Physical Limitations or Activity Restrictions</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body2">
                          {healthProfile.physicalLimitations || 'None specified'}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>

                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2">Mental or Emotional Health Concerns</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body2">
                          {healthProfile.mentalHealthConcerns || 'None specified'}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>

                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2">Dietary Restrictions or Preferences</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body2">
                          {healthProfile.dietaryRestrictions || 'None specified'}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  </CardContent>
                </Card>
              </Grid>

              {/* Vaccinations */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Vaccination Records" />
                  <CardContent>
                    {healthProfile.vaccinations && healthProfile.vaccinations.length > 0 ? (
                      <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ fontWeight: 'bold' }}>Vaccine</TableCell>
                              <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {healthProfile.vaccinations.map((vaccination, index) => (
                              <TableRow key={index}>
                                <TableCell sx={{ py: 1 }}>{vaccination.vaccineName}</TableCell>
                                <TableCell sx={{ py: 1 }}>
                                  {vaccination.vaccinationDate ? 
                                    new Date(vaccination.vaccinationDate).toLocaleDateString() : 
                                    'Date not available'}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        No vaccination records available
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Emergency Contacts */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Emergency Contacts" />
                  <CardContent>
                    <List>
                      {healthProfile.emergencyContacts.map((contact, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <PhoneIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={contact.name}
                            secondary={`${contact.relationship} - ${contact.phone}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              {/* Medical History Timeline */}
              <Grid item xs={12}>
                <Card>
                  <CardHeader title="Recent Medical Events" />
                  <CardContent sx={{ p: 0 }}>
                    <Timeline sx={{ 
                      '& .MuiTimelineItem-root': {
                        '&:before': {
                          flex: 0,
                          padding: 0
                        }
                      },
                      '& .MuiTimelineContent-root': {
                        flex: 1,
                        px: 2,
                        py: 1
                      }
                    }}>
                      {healthProfile.medicalEvents && healthProfile.medicalEvents.length > 0 ? (
                        healthProfile.medicalEvents.map((event, index) => (
                          <TimelineItem key={index}>
                            <TimelineSeparator>
                              <TimelineDot color={
                                event.severity === 'LOW' ? 'success' : 
                                event.severity === 'MEDIUM' ? 'warning' : 
                                event.severity === 'HIGH' ? 'error' : 'primary'
                              } />
                              {index < healthProfile.medicalEvents.length - 1 && <TimelineConnector />}
                            </TimelineSeparator>
                            <TimelineContent sx={{ flex: 1, minWidth: 0 }}>
                              <Box sx={{ 
                                backgroundColor: 'background.paper', 
                                borderRadius: 2, 
                                p: 2,
                                border: '1px solid',
                                borderColor: 'divider',
                                boxShadow: 1,
                                width: '100%',
                                maxWidth: 'none'
                              }}>
                                {/* Header Row */}
                                <Box sx={{ 
                                  display: 'flex', 
                                  justifyContent: 'space-between', 
                                  alignItems: 'center',
                                  mb: 2,
                                  pb: 1,
                                  borderBottom: '1px solid',
                                  borderColor: 'divider'
                                }}>
                                  <Typography variant="h6" fontWeight="bold" color="primary">
                                    {event.type || event.eventType || 'INJURY'}
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="body2" color="textSecondary">
                                      {event.date ? new Date(event.date).toLocaleDateString() : 'Date not available'}
                                    </Typography>
                                    <Chip 
                                      label={event.severity || 'MEDIUM'} 
                                      size="small" 
                                      color={
                                        event.severity === 'LOW' ? 'success' : 
                                        event.severity === 'MEDIUM' ? 'warning' : 
                                        event.severity === 'HIGH' ? 'error' : 'warning'
                                      }
                                    />
                                  </Box>
                                </Box>
                                
                                {/* Details Grid - Stretch to full width */}
                                <Grid container spacing={3} sx={{ width: '100%' }}>
                                  {event.description && (
                                    <Grid item xs={12} md={6}>
                                      <Box sx={{ 
                                        backgroundColor: 'grey.50', 
                                        p: 2, 
                                        borderRadius: 1,
                                        height: '100%'
                                      }}>
                                        <Typography variant="body2" fontWeight="bold" color="text.primary" sx={{ mb: 1 }}>
                                          Injury/Condition:
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                          {event.description}
                                        </Typography>
                                      </Box>
                                    </Grid>
                                  )}
                                  
                                  {event.symptoms && (
                                    <Grid item xs={12} md={6}>
                                      <Box sx={{ 
                                        backgroundColor: 'grey.50', 
                                        p: 2, 
                                        borderRadius: 1,
                                        height: '100%'
                                      }}>
                                        <Typography variant="body2" fontWeight="bold" color="text.primary" sx={{ mb: 1 }}>
                                          Symptoms:
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                          {event.symptoms}
                                        </Typography>
                                      </Box>
                                    </Grid>
                                  )}
                                  
                                  {event.treatment && (
                                    <Grid item xs={12}>
                                      <Box sx={{ 
                                        backgroundColor: 'blue.50', 
                                        p: 2, 
                                        borderRadius: 1
                                      }}>
                                        <Typography variant="body2" fontWeight="bold" color="text.primary" sx={{ mb: 1 }}>
                                          Treatment Provided:
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                          {event.treatment}
                                        </Typography>
                                      </Box>
                                    </Grid>
                                  )}
                                  
                                  {event.medicationsUsed && event.medicationsUsed.length > 0 && (
                                    <Grid item xs={12}>
                                      <Box sx={{ 
                                        backgroundColor: 'green.50', 
                                        p: 2, 
                                        borderRadius: 1
                                      }}>
                                        <Typography variant="body2" fontWeight="bold" color="text.primary" sx={{ mb: 1 }}>
                                          Medications Used:
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                          {event.medicationsUsed.map((med, medIndex) => (
                                            <Chip 
                                              key={medIndex} 
                                              label={`${med.name}${med.dosage ? ` - ${med.dosage}` : ''}`}
                                              size="small"
                                              color="success"
                                              variant="outlined"
                                              sx={{ fontWeight: 'medium' }}
                                            />
                                          ))}
                                        </Box>
                                      </Box>
                                    </Grid>
                                  )}
                                  
                                  {event.followUpRequired && (
                                    <Grid item xs={12}>
                                      <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: 1,
                                        backgroundColor: 'warning.light',
                                        color: 'warning.contrastText',
                                        p: 2,
                                        borderRadius: 1
                                      }}>
                                        <Typography variant="body2" fontWeight="bold">
                                          ⚠️ Follow-up Required
                                        </Typography>
                                      </Box>
                                    </Grid>
                                  )}
                                </Grid>
                              </Box>
                            </TimelineContent>
                          </TimelineItem>
                        ))
                      ) : (
                        <TimelineItem>
                          <TimelineSeparator>
                            <TimelineDot color="grey" />
                          </TimelineSeparator>
                          <TimelineContent>
                            <Typography variant="body2" color="textSecondary">
                              No recent medical events recorded
                            </Typography>
                          </TimelineContent>
                        </TimelineItem>
                      )}
                    </Timeline>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProfileDialogOpen(false)}>Close</Button>
          <Button variant="contained" startIcon={<EditIcon />} onClick={() => handleEditProfile(healthProfile)}>
            Edit Profile
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Health Profile</DialogTitle>
        <DialogContent>
          {editingProfile && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                {/* Basic Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Student: {editingProfile.name} ({editingProfile.studentCode})
                  </Typography>
                </Grid>

                {/* Allergies */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>Allergies</Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={Array.isArray(editingProfile.allergies) ? editingProfile.allergies.join(', ') : editingProfile.allergies || ''}
                    onChange={(e) => setEditingProfile({
                      ...editingProfile,
                      allergies: e.target.value.split(',').map(item => item.trim()).filter(item => item)
                    })}
                    placeholder="Enter allergies separated by commas"
                  />
                </Grid>

                {/* Chronic Illnesses */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>Chronic Illnesses</Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={Array.isArray(editingProfile.chronicIllnesses) ? editingProfile.chronicIllnesses.join(', ') : editingProfile.chronicIllnesses || ''}
                    onChange={(e) => setEditingProfile({
                      ...editingProfile,
                      chronicIllnesses: e.target.value.split(',').map(item => item.trim()).filter(item => item)
                    })}
                    placeholder="Enter chronic illnesses separated by commas"
                  />
                </Grid>

                {/* Vision Status */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>Vision Status</Typography>
                  <TextField
                    fullWidth
                    value={editingProfile.visionStatus || ''}
                    onChange={(e) => setEditingProfile({
                      ...editingProfile,
                      visionStatus: e.target.value
                    })}
                    placeholder="e.g., Wears glasses, 20/20"
                  />
                </Grid>

                {/* Hearing Status */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>Hearing Status</Typography>
                  <TextField
                    fullWidth
                    value={editingProfile.hearingStatus || ''}
                    onChange={(e) => setEditingProfile({
                      ...editingProfile,
                      hearingStatus: e.target.value
                    })}
                    placeholder="e.g., Normal, Uses hearing aids"
                  />
                </Grid>

                {/* Special Needs */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>Special Needs</Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    value={editingProfile.specialNeeds || ''}
                    onChange={(e) => setEditingProfile({
                      ...editingProfile,
                      specialNeeds: e.target.value
                    })}
                    placeholder="Describe any special needs"
                  />
                </Grid>

                {/* Physical Limitations */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>Physical Limitations</Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    value={editingProfile.physicalLimitations || ''}
                    onChange={(e) => setEditingProfile({
                      ...editingProfile,
                      physicalLimitations: e.target.value
                    })}
                    placeholder="Describe any physical limitations"
                  />
                </Grid>

                {/* Mental Health Concerns */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>Mental Health Concerns</Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    value={editingProfile.mentalHealthConcerns || ''}
                    onChange={(e) => setEditingProfile({
                      ...editingProfile,
                      mentalHealthConcerns: e.target.value
                    })}
                    placeholder="Describe any mental health concerns"
                  />
                </Grid>

                {/* Dietary Restrictions */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>Dietary Restrictions</Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    value={editingProfile.dietaryRestrictions || ''}
                    onChange={(e) => setEditingProfile({
                      ...editingProfile,
                      dietaryRestrictions: e.target.value
                    })}
                    placeholder="e.g., Vegetarian, Gluten-free"
                  />
                </Grid>

                {/* Medical History */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>Medical History</Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={editingProfile.medicalHistory || ''}
                    onChange={(e) => setEditingProfile({
                      ...editingProfile,
                      medicalHistory: e.target.value
                    })}
                    placeholder="Describe relevant medical history"
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} disabled={isSubmittingEdit}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSaveEdit} 
            disabled={isSubmittingEdit}
            startIcon={isSubmittingEdit ? <CircularProgress size={20} /> : null}
          >
            {isSubmittingEdit ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default StudentManagement;