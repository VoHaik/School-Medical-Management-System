import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Tab,
  Tabs,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  Avatar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import {
  HealthAndSafety,
  Search,
  CheckCircle,
  LocalHospital,
  CalendarToday,
  Person,
  Schedule,
  Visibility,
  Close
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { 
  getParentStudents, 
  getUpcomingHealthEventsForStudent,
  getStudentHealthCheckupsByStudentId,
  getAllHealthEvents
} from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`checkup-tabpanel-${index}`}
      aria-labelledby={`checkup-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const CheckupInformation = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState({
    student: null,
    summary: {
      totalCheckups: 0,
      completedThisYear: 0,
      upcomingCheckups: 0,
      averageScore: 0,
      lastCheckup: null
    },
    checkupHistory: [],
    upcomingCheckups: []
  });
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [healthEvents, setHealthEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedCheckupDetail, setSelectedCheckupDetail] = useState(null);
  const [lastEventCount, setLastEventCount] = useState(0);

  // Helper function to format conducted by name for display
  const formatConductedByName = (conductedBy) => {
    if (!conductedBy) return 'N/A';
    
    // Since parents don't have access to nurses data, format the username nicely
    // If it looks like a username (contains dots, no spaces), try to format it
    if (conductedBy.includes('.') && !conductedBy.includes(' ')) {
      // Convert "nurse.johnson" to "Nurse Johnson"
      return conductedBy
        .split('.')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(' ');
    }
    
    // Return as is if it already looks like a proper name
    return conductedBy;
  };

  // Helper function to get event name
  const getEventName = (eventId) => {
    if (!eventId) return 'General Health Checkup';
    const event = healthEvents.find(e => e.id === eventId);
    return event ? event.name : 'General Health Checkup';
  };

  // Helper function to check if any checkup has BMI data
  const hasBMIData = (checkups) => {
    return checkups && checkups.some(checkup => checkup.bmi && checkup.bmi !== null && checkup.bmi !== '');
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleStudentChange = async (event) => {
    const studentCode = event.target.value;
    setSelectedStudent(studentCode);
    await loadCheckupData(studentCode);
  };

  const loadCheckupData = async (studentCode) => {
    try {
      setLoading(true);
      
      // Get checkup history for this student and filter health events for their grade
      // Handle each API call separately to prevent one failure from affecting the other
      const [checkupHistory] = await Promise.all([
        getStudentHealthCheckupsByStudentId(studentCode).catch(error => {
          return []; // Return empty array if this fails
        })
      ]);
      
      // Get student info to determine their grade
      const studentInfo = students.find(s => s.studentCode === studentCode);
      const studentGrade = studentInfo?.gradeLevel || studentInfo?.grade || studentInfo?.gradeName;
      
      // Filter health events for this student's grade and future dates
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to start of day for comparison
      
      const upcomingEvents = healthEvents.filter(event => {
        // Check if event is not completed or cancelled
        const validStatuses = ['SCHEDULED', 'IN_PROGRESS', 'POSTPONED'];
        const eventStatus = event.status?.toUpperCase();
        if (eventStatus && !validStatuses.includes(eventStatus)) {
          return false;
        }
        
        // Check if event date is in the future
        const eventDate = new Date(event.scheduledDate || event.startDate);
        if (eventDate < today) return false;
        
        // If no student grade available, show all future events
        if (!studentGrade) return true;
        
        // Check if event is for this student's grade
        if (event.targetGradeNames && Array.isArray(event.targetGradeNames)) {
          const isForThisGrade = event.targetGradeNames.some(gradeName => {
            // Extract numbers from both grade names for comparison
            const eventGradeNumber = gradeName.replace(/[^\d]/g, '');
            const studentGradeNumber = String(studentGrade).replace(/[^\d]/g, '');
            
            // Also check if grade names match exactly (case insensitive)
            const exactMatch = gradeName.toLowerCase() === String(studentGrade).toLowerCase();
            const numberMatch = eventGradeNumber && studentGradeNumber && eventGradeNumber === studentGradeNumber;
            
            return exactMatch || numberMatch;
          });
          
          return isForThisGrade;
        }
        
        return false; // If no target grades specified, don't show
      });

      // Transform the health events to match the expected format
      const transformedUpcomingCheckups = upcomingEvents.map(event => {
        return {
        id: event.eventId || event.id,
        date: event.scheduledDate || event.startDate,
        type: event.eventName || 'General Health Event',
        eventType: event.eventType || 'HEALTH_CHECKUP', // Add event type
        checkupTypes: event.typesOfCheckups || [], // For health checkup events
        vaccineNames: event.vaccineNames || [], // For vaccination events
        provider: event.createdByUserName || 'School Health Center', // Use nurse/staff name
        location: event.location || null, // Use actual location from form or null
        status: event.status?.toLowerCase() || 'scheduled',
        notes: event.description || null // Use actual description from form or null
        };
      });

      // Transform checkup history to match the expected format
      const transformedCheckupHistory = Array.isArray(checkupHistory) ? checkupHistory.map(checkup => {
        return {
          id: checkup.checkupId || checkup.id,
          date: checkup.checkupDate,
          type: getEventName(checkup.eventId),
          provider: formatConductedByName(checkup.conductedBy),
          location: 'School Health Center', // Default location
          status: 'completed',
          overallScore: null, // Health checkups don't have scores in our system
          notes: checkup.healthNotes || checkup.recommendations || '',
          followUpRequired: checkup.requiresFollowUp || false,
          followUpDate: checkup.followUpDate || null,
          followUpNotes: checkup.followUpNotes || null,
          // Include all the detailed checkup data for the detail view
          ...checkup
        };
      }) : [];

      // Calculate summary statistics
      const currentYear = new Date().getFullYear();
      const completedThisYear = transformedCheckupHistory.filter(checkup => 
        new Date(checkup.date).getFullYear() === currentYear
      ).length;

      const lastCheckup = transformedCheckupHistory.length > 0 
        ? transformedCheckupHistory.sort((a, b) => new Date(b.date) - new Date(a.date))[0].date
        : null;
      
      // Update the data state
      setData(prevData => ({
        ...prevData,
        checkupHistory: transformedCheckupHistory,
        upcomingCheckups: transformedUpcomingCheckups,
        summary: {
          totalCheckups: transformedCheckupHistory.length,
          completedThisYear: completedThisYear,
          upcomingCheckups: transformedUpcomingCheckups.length,
          averageScore: null, // We don't use scores in our system
          lastCheckup: lastCheckup
        }
      }));
      
    } catch (error) {
      console.error('Error loading checkup data:', error);
      setError('Failed to load checkup data');
      // Set empty data on error
      setData(prevData => ({
        ...prevData,
        checkupHistory: [],
        upcomingCheckups: [],
        summary: {
          totalCheckups: 0,
          completedThisYear: 0,
          upcomingCheckups: 0,
          averageScore: 0,
          lastCheckup: null
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load students first (most critical)
      const studentsData = await getParentStudents();
      
      if (studentsData && studentsData.length > 0) {
        setStudents(studentsData);
        
        // Auto-select first student and load their checkup data
        const firstStudent = studentsData[0];
        setSelectedStudent(firstStudent.studentCode);
        
        // Load health events in the background (parents don't need nurses data)
        getAllHealthEvents().then(eventsData => {
          // Set health events data
          if (Array.isArray(eventsData)) {
            setHealthEvents(eventsData);
            setLastEventCount(eventsData.length); // Initialize count
          } else {
            setHealthEvents([]);
          }
        }).catch(error => {
          setHealthEvents([]);
        });
        
        // Load checkup data for the first student
        await loadCheckupData(firstStudent.studentCode);
      } else {
        setError('No students found for this parent account. Please contact the school administrator to ensure your account is properly linked to your child\'s records.');
      }
    } catch (error) {
      console.error('Error loading students:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        const status = error.response.status;
        if (status === 401) {
          setError('Authentication failed. Please log out and log back in.');
        } else if (status === 403) {
          setError('Access denied. Please ensure you have parent account permissions.');
        } else if (status === 404) {
          setError('Parent students API not found. Please contact support.');
        } else {
          setError(`Server error (${status}). Please try again later.`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        setError('Unable to connect to the server. Please check your internet connection.');
      } else {
        // Something happened in setting up the request
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // Reload checkup data when health events are loaded
  useEffect(() => {
    if (healthEvents.length > 0 && selectedStudent) {
      loadCheckupData(selectedStudent);
    }
  }, [healthEvents]); // Depend on healthEvents changes

  // Auto-refresh health events every 30 seconds to catch new events from admin
  useEffect(() => {
    const interval = setInterval(() => {
      getAllHealthEvents().then(eventsData => {
        if (Array.isArray(eventsData)) {
          // Check if new events were added
          if (lastEventCount > 0 && eventsData.length > lastEventCount) {
            // Show notification for new events
            }
          setHealthEvents(eventsData);
          setLastEventCount(eventsData.length);
        }
      }).catch(error => {
        });
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [lastEventCount]); // Depend on lastEventCount

  const getSelectedStudentInfo = () => {
    return students.find(student => student.studentCode === selectedStudent);
  };

  const filteredCheckups = data.checkupHistory.filter(checkup => {
    const matchesSearch = checkup.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         checkup.provider.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'scheduled':
        return 'primary';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle />;
      case 'scheduled':
        return <Schedule />;
      default:
        return <LocalHospital />;
    }
  };

  const selectedStudentInfo = getSelectedStudentInfo();

  const handleViewDetails = (checkup) => {
    setSelectedCheckupDetail(checkup);
    setDetailDialogOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailDialogOpen(false);
    setSelectedCheckupDetail(null);
  };

  if (loading) {
    return (
      <Box className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <Box className="mb-6">
        <Box className="flex items-center gap-3 mb-4">
          <HealthAndSafety className="text-blue-600" sx={{ fontSize: 32 }} />
          <Typography variant="h4" className="font-bold text-gray-800">
            Check up Information
          </Typography>
        </Box>
        <Typography variant="body1" className="text-gray-600">
          View your child's upcoming health checkups and complete health checkup history.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" className="mb-6">
          <Box>
            <Typography variant="body1" className="mb-2">{error}</Typography>
            <Button 
              variant="outlined" 
              size="small" 
              onClick={() => {
                setError(null);
                loadStudents();
              }}
              sx={{ mt: 1 }}
            >
              Try Again
            </Button>
          </Box>
        </Alert>
      )}

      {/* Student Selection Dropdown */}
      {students.length > 0 ? (
        <Card className="mb-6 border-l-4 border-blue-400">
          <CardContent>
            <Typography variant="h6" className="mb-3 font-semibold text-blue-700">
              {students.length > 1 
                ? `Select Your Child (${students.length} children)` 
                : 'Your Child'
              }
            </Typography>
            <FormControl fullWidth>
              <InputLabel>
                {students.length > 1 
                  ? 'Choose which child to view checkup information for'
                  : 'Student information'
                }
              </InputLabel>
              <Select
                value={selectedStudent}
                onChange={handleStudentChange}
                label={students.length > 1 
                  ? 'Choose which child to view checkup information for'
                  : 'Student information'
                }
                sx={{ 
                  '& .MuiSelect-select': { 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 2
                  }
                }}
              >
                {students.map((student) => (
                  <MenuItem key={student.studentCode} value={student.studentCode}>
                    <Typography variant="body1" className="font-semibold text-gray-800">
                      {student.fullName}
                    </Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {students.length > 1 && !selectedStudent && (
              <Box className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <Typography variant="body2" className="text-amber-700 flex items-center gap-2">
                  Please select one of your children to view their checkup information.
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-6 border-l-4 border-red-400">
          <CardContent className="text-center py-8">
            <Person sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" className="mb-2 text-red-700">
              No Students Found
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              No student information found for this parent account.
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Student Overview - Show only when student is selected */}
      {selectedStudent && selectedStudentInfo && (
        <Grid container spacing={3} className="mb-6">
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box className="flex items-center gap-4">
                  <Avatar className="bg-blue-500" sx={{ width: 64, height: 64 }}>
                    {selectedStudentInfo.fullName.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                  <Box className="flex-1">
                    <Typography variant="h5" className="font-semibold mb-1">
                      {selectedStudentInfo.fullName}
                    </Typography>
                    <Typography variant="body1" className="text-gray-600 mb-2">
                      {selectedStudentInfo.gradeLevel || 'Grade N/A'} • Student Code: {selectedStudentInfo.studentCode}
                    </Typography>
                    <Typography variant="body2" className="text-gray-500">
                      Last Checkup: {data.summary.lastCheckup ? format(parseISO(data.summary.lastCheckup), 'MMMM dd, yyyy') : 'No checkups yet'}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Tabs - Show only when student is selected */}
      {selectedStudent && selectedStudentInfo && (
        <>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label="Upcoming Checkups" />
              <Tab label="Checkup History" />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <TabPanel value={activeTab} index={0}>
        {data.upcomingCheckups.length > 0 ? (
          <Grid container spacing={3}>
            {data.upcomingCheckups.map((checkup) => (
              <Grid item xs={12} md={6} key={checkup.id}>
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent>
                    <Box className="flex justify-between items-start mb-3">
                      <Typography variant="h6" className="font-semibold">
                        {checkup.type}
                      </Typography>
                      <Chip
                        icon={<Schedule />}
                        label="Scheduled"
                        color="info"
                        size="small"
                      />
                    </Box>
                    
                    <Box className="flex items-center gap-2 mb-2">
                      <CalendarToday className="text-gray-500" fontSize="small" />
                      <Typography variant="body2" className="text-gray-600">
                        {format(parseISO(checkup.date), 'MMMM dd, yyyy')}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" className="text-gray-600 mb-2">
                      <strong>Provider:</strong> {checkup.provider}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600 mb-2">
                      <strong>Location:</strong> {checkup.location}
                    </Typography>
                    
                    {/* Display checkup types for health checkup events or vaccines for vaccination events */}
                    <Box className="mb-3">
                      {checkup.eventType === 'VACCINATION' ? (
                        <>
                          <Typography variant="body2" className="text-gray-700 font-semibold mb-1">
                            Vaccination Event - Vaccines Included:
                          </Typography>
                          {checkup.vaccineNames && checkup.vaccineNames.length > 0 ? (
                            <Box>
                              <Box className="flex flex-wrap gap-1 mb-2">
                                {checkup.vaccineNames.map((vaccine, index) => (
                                  <Chip
                                    key={index}
                                    label={vaccine}
                                    variant="outlined"
                                    size="small"
                                    color="secondary"
                                    sx={{
                                      borderStyle: 'dashed',
                                      borderWidth: '2px',
                                      borderColor: 'secondary.main'
                                    }}
                                  />
                                ))}
                              </Box>
                              <Typography variant="caption" className="text-gray-500 italic">
                                {checkup.vaccineNames.length === 1 
                                  ? 'This vaccination event includes 1 vaccine'
                                  : `This vaccination event includes ${checkup.vaccineNames.length} vaccines administered together`
                                }
                              </Typography>
                            </Box>
                          ) : (
                            <Typography variant="body2" className="text-gray-500 italic">
                              No specific vaccines specified - General vaccination event
                            </Typography>
                          )}
                        </>
                      ) : (
                        <>
                          <Typography variant="body2" className="text-gray-700 font-semibold mb-1">
                            Health Checkup - Types:
                          </Typography>
                          {checkup.checkupTypes && checkup.checkupTypes.length > 0 ? (
                            <Box className="flex flex-wrap gap-1">
                              {checkup.checkupTypes.map((type, index) => (
                                <Chip
                                  key={index}
                                  label={type}
                                  variant="outlined"
                                  size="small"
                                  color="primary"
                                />
                              ))}
                            </Box>
                          ) : (
                            <Typography variant="body2" className="text-gray-500 italic">
                              No specific checkup types specified - General health checkup
                            </Typography>
                          )}
                        </>
                      )}
                    </Box>
                    
                    {checkup.notes && checkup.notes.trim() !== '' && (
                      <Typography variant="body2" className="text-gray-600 mt-3">
                        <strong>Notes:</strong> {checkup.notes}
                      </Typography>
                    )}
                    
                    {/* View Details Button */}
                    <Box className="mt-4 pt-3 border-t border-gray-200">
                      <Button
                        startIcon={<Visibility />}
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => handleViewDetails(checkup)}
                        fullWidth
                      >
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper className="p-8 text-center">
            <Schedule className="text-gray-400 mb-4" sx={{ fontSize: 48 }} />
            <Typography variant="h6" className="text-gray-600 mb-2">
              No Upcoming Checkups
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              All scheduled checkups are up to date.
            </Typography>
          </Paper>
        )}
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        {/* Search */}
        <Box className="mb-4">
          <TextField
            fullWidth
            placeholder="Search checkups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 400 }}
          />
        </Box>

        {/* Checkup History Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Provider</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCheckups.map((checkup) => (
                <TableRow key={checkup.id} className="hover:bg-gray-50">
                  <TableCell>
                    {format(parseISO(checkup.date), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" className="font-semibold">
                      {checkup.type}
                    </Typography>
                  </TableCell>
                  <TableCell>{checkup.provider}</TableCell>
                  <TableCell>{checkup.location}</TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(checkup.status)}
                      label={checkup.status.charAt(0).toUpperCase() + checkup.status.slice(1)}
                      color={getStatusColor(checkup.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      startIcon={<Visibility />}
                      size="small"
                      variant="outlined"
                      onClick={() => handleViewDetails(checkup)}
                      sx={{ mr: 1 }}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* Follow-up Reminders */}
        {filteredCheckups.some(checkup => checkup.followUpRequired) && (
          <Box className="mt-4">
            <Alert severity="warning">
              <Typography variant="subtitle2" className="mb-2">Follow-up Required</Typography>
              {filteredCheckups
                .filter(checkup => checkup.followUpRequired)
                .map(checkup => (
                  <Typography key={checkup.id} variant="body2">
                    • {checkup.type} on {format(parseISO(checkup.date), 'MMM dd, yyyy')} - 
                    Follow-up needed by {format(parseISO(checkup.followUpDate), 'MMM dd, yyyy')}
                  </Typography>
                ))}
            </Alert>
          </Box>
        )}
      </TabPanel>
        </>
      )}

      {/* Checkup Detail Dialog */}
      <Dialog 
        open={detailDialogOpen} 
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box className="flex justify-between items-center">
            <Typography variant="h6" className="font-semibold">
              Checkup Details
            </Typography>
            <IconButton onClick={handleCloseDetails} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent dividers>
          {selectedCheckupDetail && (
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography variant="h6" className="mb-3 text-blue-700 font-semibold">
                  Basic Information
                </Typography>
                <Card variant="outlined">
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" className="text-gray-600 mb-1">
                          <strong>Date:</strong>
                        </Typography>
                        <Typography variant="body1">
                          {format(parseISO(selectedCheckupDetail.date), 'MMMM dd, yyyy')}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" className="text-gray-600 mb-1">
                          <strong>Name:</strong>
                        </Typography>
                        <Typography variant="body1">
                          {selectedCheckupDetail.type}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" className="text-gray-600 mb-1">
                          <strong>Conducted By:</strong>
                        </Typography>
                        <Typography variant="body1">
                          {selectedCheckupDetail.provider}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" className="text-gray-600 mb-1">
                          <strong>Status:</strong>
                        </Typography>
                        <Chip
                          icon={getStatusIcon(selectedCheckupDetail.status)}
                          label={selectedCheckupDetail.status.charAt(0).toUpperCase() + selectedCheckupDetail.status.slice(1)}
                          color={getStatusColor(selectedCheckupDetail.status)}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" className="text-gray-600 mb-1">
                          <strong>Health Status:</strong>
                        </Typography>
                        <Typography variant="body1">
                          {selectedCheckupDetail.generalHealthStatus || 'Not specified'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Physical Measurements - only show for health checkups, not vaccinations */}
              {selectedCheckupDetail.eventType !== 'VACCINATION' && (
                <Grid item xs={12}>
                  <Typography variant="h6" className="mb-3 text-blue-700 font-semibold">
                    Physical Measurements
                  </Typography>
                  <Card variant="outlined">
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={6} md={3}>
                          <Typography variant="body2" className="text-gray-600 mb-1">
                            <strong>Height:</strong>
                          </Typography>
                          <Typography variant="body1">
                            {selectedCheckupDetail.height ? `${selectedCheckupDetail.height} cm` : 'N/A'}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Typography variant="body2" className="text-gray-600 mb-1">
                            <strong>Weight:</strong>
                          </Typography>
                          <Typography variant="body1">
                            {selectedCheckupDetail.weight ? `${selectedCheckupDetail.weight} kg` : 'N/A'}
                          </Typography>
                        </Grid>
                        {hasBMIData([selectedCheckupDetail]) && (
                          <Grid item xs={6} md={3}>
                            <Typography variant="body2" className="text-gray-600 mb-1">
                              <strong>BMI:</strong>
                            </Typography>
                            <Typography variant="body1">
                              {selectedCheckupDetail.bmi ? selectedCheckupDetail.bmi.toFixed(1) : 'N/A'}
                            </Typography>
                          </Grid>
                        )}
                        <Grid item xs={6} md={3}>
                          <Typography variant="body2" className="text-gray-600 mb-1">
                            <strong>Heart Rate:</strong>
                          </Typography>
                          <Typography variant="body1">
                            {selectedCheckupDetail.heartRate ? `${selectedCheckupDetail.heartRate} bpm` : 'N/A'}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Typography variant="body2" className="text-gray-600 mb-1">
                            <strong>Temperature:</strong>
                          </Typography>
                          <Typography variant="body1">
                            {selectedCheckupDetail.temperature ? `${selectedCheckupDetail.temperature}°C` : 'N/A'}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Typography variant="body2" className="text-gray-600 mb-1">
                            <strong>Blood Pressure:</strong>
                          </Typography>
                          <Typography variant="body1">
                            {(selectedCheckupDetail.bloodPressureSystolic && selectedCheckupDetail.bloodPressureDiastolic) 
                              ? `${selectedCheckupDetail.bloodPressureSystolic}/${selectedCheckupDetail.bloodPressureDiastolic} mmHg` 
                              : 'N/A'}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Typography variant="body2" className="text-gray-600 mb-1">
                            <strong>Vision Left:</strong>
                          </Typography>
                          <Typography variant="body1">
                            {selectedCheckupDetail.visionLeft || 'N/A'}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Typography variant="body2" className="text-gray-600 mb-1">
                            <strong>Vision Right:</strong>
                          </Typography>
                          <Typography variant="body1">
                            {selectedCheckupDetail.visionRight || 'N/A'}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Typography variant="body2" className="text-gray-600 mb-1">
                            <strong>Hearing Left:</strong>
                          </Typography>
                          <Typography variant="body1">
                            {selectedCheckupDetail.hearingLeft || 'N/A'}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Typography variant="body2" className="text-gray-600 mb-1">
                            <strong>Hearing Right:</strong>
                          </Typography>
                          <Typography variant="body1">
                            {selectedCheckupDetail.hearingRight || 'N/A'}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {/* Notes and Recommendations */}
              {(selectedCheckupDetail.healthNotes || selectedCheckupDetail.recommendations) && (
                <Grid item xs={12}>
                  <Typography variant="h6" className="mb-3 text-blue-700 font-semibold">
                    Notes & Recommendations
                  </Typography>
                  <Card variant="outlined">
                    <CardContent>
                      {selectedCheckupDetail.healthNotes && (
                        <Box className="mb-3">
                          <Typography variant="body2" className="text-gray-600 mb-1">
                            <strong>Health Notes:</strong>
                          </Typography>
                          <Typography variant="body1" className="text-gray-700">
                            {selectedCheckupDetail.healthNotes}
                          </Typography>
                        </Box>
                      )}
                      {selectedCheckupDetail.recommendations && (
                        <Box>
                          <Typography variant="body2" className="text-gray-600 mb-1">
                            <strong>Recommendations:</strong>
                          </Typography>
                          <Typography variant="body1" className="text-gray-700">
                            {selectedCheckupDetail.recommendations}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {/* Follow-up Information */}
              {selectedCheckupDetail.requiresFollowUp && (
                <Grid item xs={12}>
                  <Typography variant="h6" className="mb-3 text-orange-700 font-semibold">
                    Follow-up Required
                  </Typography>
                  <Alert severity="warning">
                    <Typography variant="body1">
                      Follow-up appointment needed
                      {selectedCheckupDetail.followUpDate && 
                        ` by ${format(parseISO(selectedCheckupDetail.followUpDate), 'MMMM dd, yyyy')}`
                      }
                    </Typography>
                    {selectedCheckupDetail.followUpNotes && (
                      <Typography variant="body2" className="mt-2">
                        Notes: {selectedCheckupDetail.followUpNotes}
                      </Typography>
                    )}
                  </Alert>
                </Grid>
              )}

              {/* Checkup Types for health checkup events or Vaccines for vaccination events */}
              {selectedCheckupDetail.eventType === 'VACCINATION' ? (
                selectedCheckupDetail.vaccineNames && selectedCheckupDetail.vaccineNames.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="h6" className="mb-3 text-blue-700 font-semibold">
                      Vaccination Event Details
                    </Typography>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="body1" className="mb-3 font-semibold text-purple-700">
                          This vaccination event includes {selectedCheckupDetail.vaccineNames.length} 
                          {selectedCheckupDetail.vaccineNames.length === 1 ? ' vaccine' : ' vaccines'} administered together:
                        </Typography>
                        <Box className="flex flex-wrap gap-2 mb-3">
                          {selectedCheckupDetail.vaccineNames.map((vaccine, index) => (
                            <Chip
                              key={index}
                              label={`${index + 1}. ${vaccine}`}
                              variant="outlined"
                              color="secondary"
                              size="medium"
                              sx={{
                                borderStyle: 'dashed',
                                borderWidth: '2px',
                                borderColor: 'secondary.main',
                                backgroundColor: 'secondary.50'
                              }}
                            />
                          ))}
                        </Box>
                        <Typography variant="body2" className="text-gray-600 italic">
                          All vaccines listed above are part of the same vaccination appointment scheduled for{' '}
                          {format(parseISO(selectedCheckupDetail.date), 'MMMM dd, yyyy')}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )
              ) : (
                selectedCheckupDetail.checkupTypes && selectedCheckupDetail.checkupTypes.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="h6" className="mb-3 text-blue-700 font-semibold">
                      Health Checkup Types
                    </Typography>
                    <Card variant="outlined">
                      <CardContent>
                        <Box className="flex flex-wrap gap-2">
                          {selectedCheckupDetail.checkupTypes.map((type, index) => (
                            <Chip
                              key={index}
                              label={type}
                              variant="outlined"
                              color="primary"
                              size="medium"
                            />
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                )
              )}
            </Grid>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDetails} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CheckupInformation;
