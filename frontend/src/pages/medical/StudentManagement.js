import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
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
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  LocalHospital as HealthIcon,
  Medication as MedicationIcon,
  Vaccines as VaccinesIcon,
  Warning as WarningIcon,
  ExpandMore as ExpandMoreIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Assignment as AssignmentIcon,
  Timeline as TimelineIcon,
  BarChart as BarChartIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import PageHeader from '../../components/PageHeader';

const studentHealthProfileSchema = yup.object().shape({
  studentId: yup.string().required('Student ID is required'),
  healthConditions: yup.array().of(yup.string()),
  allergies: yup.array().of(yup.string()),
  medications: yup.array().of(yup.string()),
  emergencyContacts: yup.array().of(yup.object()),
  medicalNotes: yup.string(),
  restrictions: yup.array().of(yup.string()),
  lastCheckupDate: yup.date(),
  nextCheckupDate: yup.date()
});

function StudentManagement() {
  const [activeTab, setActiveTab] = useState(0);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('all');
  const [filterHealthStatus, setFilterHealthStatus] = useState('all');
  const [healthProfile, setHealthProfile] = useState(null);

  const profileForm = useForm({
    resolver: yupResolver(studentHealthProfileSchema),
    defaultValues: {
      healthConditions: [],
      allergies: [],
      medications: [],
      emergencyContacts: [],
      restrictions: []
    }
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      // Mock data - replace with actual API call
      setStudents([
        {
          id: 'S001',
          name: 'John Doe',
          grade: '10A',
          dateOfBirth: '2008-05-15',
          gender: 'Male',
          studentId: 'STU001',
          email: 'john.doe@school.edu',
          phone: '(555) 123-4567',
          address: '123 Main St, City, State 12345',
          healthStatus: 'normal',
          allergies: ['Peanuts', 'Shellfish'],
          medications: ['Inhaler for asthma'],
          healthConditions: ['Asthma'],
          emergencyContacts: [
            { name: 'Jane Doe', relationship: 'Mother', phone: '(555) 987-6543' },
            { name: 'Robert Doe', relationship: 'Father', phone: '(555) 456-7890' }
          ],
          lastCheckup: '2024-01-15',
          nextCheckup: '2024-07-15',
          vaccinationStatus: 'up-to-date',
          medicalEvents: [
            { date: '2024-01-20', type: 'Asthma Episode', severity: 'Mild' },
            { date: '2023-12-10', type: 'Physical Checkup', severity: 'Normal' }
          ],
          restrictions: ['No contact sports during asthma flare-ups']
        },
        {
          id: 'S002',
          name: 'Jane Smith',
          grade: '9B',
          dateOfBirth: '2009-03-20',
          gender: 'Female',
          studentId: 'STU002',
          email: 'jane.smith@school.edu',
          phone: '(555) 234-5678',
          address: '456 Oak Ave, City, State 12345',
          healthStatus: 'attention',
          allergies: ['Latex'],
          medications: [],
          healthConditions: ['Mild hearing loss'],
          emergencyContacts: [
            { name: 'Sarah Smith', relationship: 'Mother', phone: '(555) 876-5432' }
          ],
          lastCheckup: '2024-01-10',
          nextCheckup: '2024-03-10',
          vaccinationStatus: 'pending',
          medicalEvents: [
            { date: '2024-01-10', type: 'Hearing Test', severity: 'Mild Loss' }
          ],
          restrictions: []
        },
        {
          id: 'S003',
          name: 'Michael Johnson',
          grade: '11C',
          dateOfBirth: '2007-09-12',
          gender: 'Male',
          studentId: 'STU003',
          email: 'michael.johnson@school.edu',
          phone: '(555) 345-6789',
          address: '789 Pine St, City, State 12345',
          healthStatus: 'normal',
          allergies: [],
          medications: [],
          healthConditions: [],
          emergencyContacts: [
            { name: 'Lisa Johnson', relationship: 'Mother', phone: '(555) 765-4321' },
            { name: 'David Johnson', relationship: 'Father', phone: '(555) 567-8901' }
          ],
          lastCheckup: '2024-01-05',
          nextCheckup: '2024-07-05',
          vaccinationStatus: 'up-to-date',
          medicalEvents: [
            { date: '2024-01-05', type: 'Annual Physical', severity: 'Normal' }
          ],
          restrictions: []
        }
      ]);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleViewProfile = (student) => {
    setSelectedStudent(student);
    setHealthProfile(student);
    setProfileDialogOpen(true);
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
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
            />
            <FormControl className="min-w-32">
              <InputLabel>Grade</InputLabel>
              <Select
                value={filterGrade}
                label="Grade"
                onChange={(e) => setFilterGrade(e.target.value)}
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
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="normal">Normal</MenuItem>
                <MenuItem value="attention">Need Attention</MenuItem>
                <MenuItem value="critical">Critical</MenuItem>
              </Select>
            </FormControl>
          </Box>

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
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <Box className="flex items-center gap-3">
                          <Avatar>{student.name.charAt(0)}</Avatar>
                          <div>
                            <Typography variant="subtitle2">{student.name}</Typography>
                            <Typography variant="caption" color="textSecondary">
                              ID: {student.studentId}
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
                  ))}
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
                  {healthProfile.grade} - ID: {healthProfile.studentId}
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
          <Button variant="contained" startIcon={<EditIcon />}>
            Edit Profile
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default StudentManagement;