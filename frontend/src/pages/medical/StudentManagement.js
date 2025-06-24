import React, { useState, useEffect } from 'react';
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
import { getAllStudents, getHealthDeclarationByStudentCode, getAllStudentsWithHealthData, nurseEditHealthDeclaration } from '../../utils/api';

function StudentManagement() {
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
            (typeof healthData.allergies === 'string' ? 
              healthData.allergies.split(',').filter(item => item.trim() !== '') : 
              healthData.allergies) : [],
          medications: healthData.medications ? 
            healthData.medications.map(med => med.medicationName) : [],
          chronicIllnesses: healthData.chronicIllnesses ? 
            (typeof healthData.chronicIllnesses === 'string' ? 
              healthData.chronicIllnesses.split(',').filter(item => item.trim() !== '') : 
              healthData.chronicIllnesses) : [],
          healthConditions: healthData.chronicIllnesses ? 
            (typeof healthData.chronicIllnesses === 'string' ? 
              healthData.chronicIllnesses.split(',').filter(item => item.trim() !== '') : 
              healthData.chronicIllnesses) : [],
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
          medicalEvents: [],
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

      alert('Health profile updated successfully!');
      setEditDialogOpen(false);
      setEditingProfile(null);
      fetchStudents(); // Reload the student list
    } catch (error) {
      console.error('Error updating health profile:', error);
      alert('Error updating health profile: ' + (error.message || 'Unknown error'));
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
                    <TableCell>Conditions</TableCell>
                    <TableCell>Allergies</TableCell>
                    <TableCell>Medications</TableCell>
                    <TableCell>Last Checkup</TableCell>
                    <TableCell>Vaccination</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
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
                      <TableCell colSpan={9} align="center">
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
                        {student.healthConditions.length > 0 ? (
                          <div>
                            {student.healthConditions.slice(0, 2).map((condition, index) => (
                              <Chip key={index} label={condition} size="small" className="mr-1 mb-1" />
                            ))}
                            {student.healthConditions.length > 2 && (
                              <Chip label={`+${student.healthConditions.length - 2} more`} size="small" />
                            )}
                          </div>
                        ) : (
                          <Typography variant="caption" color="textSecondary">None</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {student.allergies.length > 0 ? (
                          <div>
                            {student.allergies.slice(0, 2).map((allergy, index) => (
                              <Chip key={index} label={allergy} size="small" color="error" className="mr-1 mb-1" />
                            ))}
                            {student.allergies.length > 2 && (
                              <Chip label={`+${student.allergies.length - 2} more`} size="small" color="error" />
                            )}
                          </div>
                        ) : (
                          <Typography variant="caption" color="textSecondary">None</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {student.medications.length > 0 ? (
                          <Badge badgeContent={student.medications.length} color="primary">
                            <MedicationIcon />
                          </Badge>
                        ) : (
                          <Typography variant="caption" color="textSecondary">None</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {student.lastCheckup ? new Date(student.lastCheckup).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={student.vaccinationStatus}
                          color={getVaccinationStatusColor(student.vaccinationStatus)}
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
                    <Typography variant="body2" className="mb-2">
                      <strong>Email:</strong> {healthProfile.email}
                    </Typography>
                    <Typography variant="body2" className="mb-2">
                      <strong>Phone:</strong> {healthProfile.phone}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Address:</strong> {healthProfile.address}
                    </Typography>
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
                    <Box className="mb-3">
                      <Typography variant="body2" className="mb-1"><strong>Vaccination Status:</strong></Typography>
                      <Chip
                        label={healthProfile.vaccinationStatus}
                        color={getVaccinationStatusColor(healthProfile.vaccinationStatus)}
                      />
                    </Box>
                    <Typography variant="body2" className="mb-2">
                      <strong>Last Checkup:</strong> {new Date(healthProfile.lastCheckup).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Next Checkup:</strong> {new Date(healthProfile.nextCheckup).toLocaleDateString()}
                    </Typography>
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
                        <Typography variant="subtitle2">Health Conditions ({healthProfile.healthConditions.length})</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {healthProfile.healthConditions.length > 0 ? (
                          healthProfile.healthConditions.map((condition, index) => (
                            <Chip key={index} label={condition} className="mr-1 mb-1" />
                          ))
                        ) : (
                          <Typography variant="body2" color="textSecondary">No health conditions reported</Typography>
                        )}
                      </AccordionDetails>
                    </Accordion>

                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2">Allergies ({healthProfile.allergies.length})</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {healthProfile.allergies.length > 0 ? (
                          healthProfile.allergies.map((allergy, index) => (
                            <Chip key={index} label={allergy} color="error" className="mr-1 mb-1" />
                          ))
                        ) : (
                          <Typography variant="body2" color="textSecondary">No allergies reported</Typography>
                        )}
                      </AccordionDetails>
                    </Accordion>

                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2">Current Medications ({healthProfile.medications.length})</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {healthProfile.medications.length > 0 ? (
                          healthProfile.medications.map((medication, index) => (
                            <Chip key={index} label={medication} color="primary" className="mr-1 mb-1" />
                          ))
                        ) : (
                          <Typography variant="body2" color="textSecondary">No current medications</Typography>
                        )}
                      </AccordionDetails>
                    </Accordion>
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
                  <CardContent>
                    <Timeline>
                      {healthProfile.medicalEvents.map((event, index) => (
                        <TimelineItem key={index}>
                          <TimelineSeparator>
                            <TimelineDot color={event.severity === 'Normal' ? 'success' : 'warning'} />
                            {index < healthProfile.medicalEvents.length - 1 && <TimelineConnector />}
                          </TimelineSeparator>
                          <TimelineContent>
                            <Typography variant="subtitle2">{event.type}</Typography>
                            <Typography variant="body2" color="textSecondary">
                              {new Date(event.date).toLocaleDateString()} - {event.severity}
                            </Typography>
                          </TimelineContent>
                        </TimelineItem>
                      ))}
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