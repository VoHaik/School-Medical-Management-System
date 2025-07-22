import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../hooks/useAlert'; // Import useAlert hook
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Typography,
  Grid,
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
  Chip,
  Checkbox,
  FormControlLabel,
  Autocomplete
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  LocalHospital as HealthIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import {
  getAllHealthCheckupRecords,
  createHealthCheckupRecord,
  updateHealthCheckupRecord,
  deleteHealthCheckupRecord,
  getAllStudents,
  getAllHealthEvents,
  getAllNurses
} from '../../utils/api';
import PageHeader from '../../components/PageHeader';

const healthCheckupSchema = yup.object().shape({
  studentId: yup.string().required('Student is required'),
  checkupDate: yup.date().required('Checkup date is required'),
  conductedBy: yup.string().required('Conducted by is required'),
  eventId: yup.string().required('Health event is required'),
  status: yup.string().required('Status is required'),
  height: yup.number()
    .positive('Height must be positive')
    .max(300, 'Height cannot exceed 300 cm')
    .transform((value, originalValue) => originalValue === '' ? null : value)
    .nullable(),
  weight: yup.number()
    .positive('Weight must be positive')
    .max(500, 'Weight cannot exceed 500 kg')
    .transform((value, originalValue) => originalValue === '' ? null : value)
    .nullable(),
  bloodPressureSystolic: yup.number()
    .integer('Must be a whole number')
    .min(70, 'Systolic pressure must be at least 70')
    .max(250, 'Systolic pressure cannot exceed 250')
    .transform((value, originalValue) => originalValue === '' ? null : value)
    .nullable(),
  bloodPressureDiastolic: yup.number()
    .integer('Must be a whole number')
    .min(40, 'Diastolic pressure must be at least 40')
    .max(150, 'Diastolic pressure cannot exceed 150')
    .transform((value, originalValue) => originalValue === '' ? null : value)
    .nullable(),
  heartRate: yup.number()
    .integer('Must be a whole number')
    .min(50, 'Heart rate must be at least 50')
    .max(200, 'Heart rate cannot exceed 200')
    .transform((value, originalValue) => originalValue === '' ? null : value)
    .nullable(),
  temperature: yup.number()
    .min(35, 'Temperature must be at least 35°C')
    .max(42, 'Temperature cannot exceed 42°C')
    .transform((value, originalValue) => originalValue === '' ? null : value)
    .nullable(),
  visionLeft: yup.string(),
  visionRight: yup.string(),
  hearingLeft: yup.string(),
  hearingRight: yup.string(),
  generalHealthStatus: yup.string().required('Health status is required'),
  healthNotes: yup.string(),
  recommendations: yup.string(),
  requiresFollowUp: yup.boolean(),
  followUpDate: yup.date()
    .nullable()
    .when('requiresFollowUp', {
      is: true,
      then: (schema) => schema.required('Follow-up date is required when follow-up is needed'),
      otherwise: (schema) => schema.nullable()
    }),
  followUpNotes: yup.string()
});

function HealthCheckupManagement() {
  const { currentUser } = useAuth();
  const { successAlert, errorAlert, deleteConfirm } = useAlert(); // Initialize useAlert hook
  const [checkups, setCheckups] = useState([]);
  const [students, setStudents] = useState([]);
  const [healthEvents, setHealthEvents] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedCheckup, setSelectedCheckup] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null); // Add state for selected student
  const [viewCheckup, setViewCheckup] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Helper function to check if any checkup has BMI data
  const hasBMIData = () => {
    return checkups.some(checkup => checkup.bmi && checkup.bmi !== null && checkup.bmi !== '');
  };
  
  // Helper function to get conductor name
  const getConductorName = () => {
    if (currentUser) {
      return currentUser.fullName || currentUser.username || 'Unknown User';
    }
    return '';
  };

  // Helper function to format conducted by name for display
  const formatConductedByName = (conductedBy) => {
    if (!conductedBy) return 'N/A';
    
    // First, try to find the nurse by nurse_code (which should match username)
    const nurse = nurses.find(n => n.nurseCode === conductedBy || n.nurse_code === conductedBy);
    if (nurse) {
      return nurse.fullName || nurse.full_name || nurse.name;
    }
    
    // Fallback: If it looks like a username (contains dots, no spaces), try to format it
    if (conductedBy.includes('.') && !conductedBy.includes(' ')) {
      // Convert "nurse.johnson" to "Nurse Johnson"
      return conductedBy
        .split('.')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(' ');
    }
    
    // If it's already a full name, return as is
    return conductedBy;
  };
  
  const form = useForm({
    resolver: yupResolver(healthCheckupSchema),
    defaultValues: {
      conductedBy: getConductorName(),
      checkupDate: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
      generalHealthStatus: 'Normal',
      status: 'Completed',
      requiresFollowUp: false,
      visionLeft: '',
      visionRight: '',
      hearingLeft: 'Normal',
      hearingRight: 'Normal'
    }
  });

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load students, health events, and nurses first
        await fetchStudents();
        await fetchHealthEvents();
        await fetchNurses();
        
        // Then fetch checkups after all dependencies are loaded
        await fetchCheckups();
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };
    
    loadInitialData();
  }, []); // Empty dependency array - only run once

  // Re-fetch checkups when students or nurses are loaded to ensure proper enrichment
  useEffect(() => {
    if (students.length > 0 && nurses.length > 0) {
      fetchCheckups();
    }
  }, [students, nurses]); // Re-run when students or nurses change

  // Update conducted by field when currentUser is available
  useEffect(() => {
    if (currentUser && !form.getValues('conductedBy')) {
      form.setValue('conductedBy', getConductorName());
    }
  }, [currentUser, form]); // Re-run when currentUser changes

  const fetchCheckups = async () => {
    try {
      const data = await getAllHealthCheckupRecords();
      
      if (!data) {
        setCheckups([]);
        return;
      }
      
      // Store the raw checkups first, enrich with student names and event info later if available
      const enrichedCheckups = data.map(checkup => {
        const student = students.find(s => s.id === checkup.studentId);
        const event = healthEvents.find(e => e.id === checkup.eventId);
        
        // Ensure we always have a proper student name
        const studentName = student?.name || 'Unknown Student';
        
        return {
          ...checkup,
          studentName: studentName,
          eventName: event ? event.name : (checkup.eventId ? `Event ID: ${checkup.eventId}` : 'No Event')
        };
      });
      
      setCheckups(enrichedCheckups);
    } catch (error) {
      console.error('Error fetching checkups:', error);
      // Show error to user instead of using mock data
      errorAlert('Unable to load health checkup records. Please refresh the page or contact administrator.');
      setCheckups([]);
    }
  };

  const fetchStudents = async () => {
    try {
      const data = await getAllStudents();
      
      if (data && Array.isArray(data)) {
        const mappedStudents = data.map(student => ({
          id: student.studentCode || student.username || student.id || student.studentId,
          name: student.fullName || student.name || `${student.firstName || ''} ${student.lastName || ''}`.trim() || 'Unknown Student',
          grade: student.gradeLevel?.gradeName || student.grade || student.className || 'N/A'
        }));
        setStudents(mappedStudents);
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      // Show error to user instead of using mock data
      errorAlert('Unable to load students. Please refresh the page or contact administrator.');
      setStudents([]);
    }
  };

  const fetchHealthEvents = async () => {
    try {
      const data = await getAllHealthEvents();
      if (data && Array.isArray(data)) {
        const mappedEvents = data.map(event => ({
          id: event.eventId,
          name: event.eventName || event.title || `Event ${event.eventId}`,
          date: event.eventDate || event.scheduledDate,
          type: event.eventType
        }));
        setHealthEvents(mappedEvents);
      } else {
        setHealthEvents([]);
      }
    } catch (error) {
      console.error('Error fetching health events:', error);
      setHealthEvents([]);
    }
  };

  const fetchNurses = async () => {
    try {
      const data = await getAllNurses();
      if (data && Array.isArray(data)) {
        const mappedNurses = data.map(nurse => ({
          id: nurse.nurseId || nurse.nurse_id,
          nurseCode: nurse.nurseCode || nurse.nurse_code,
          fullName: nurse.fullName || nurse.full_name,
          qualification: nurse.qualification,
          specialization: nurse.specialization
        }));
        setNurses(mappedNurses);
      } else {
        setNurses([]);
      }
    } catch (error) {
      console.error('Error fetching nurses:', error);
      setNurses([]);
    }
  };

  const handleAddCheckup = () => {
    setSelectedCheckup(null);
    setSelectedStudent(null); // Reset selected student
    form.reset({
      conductedBy: getConductorName(),
      checkupDate: new Date().toISOString().split('T')[0], // Current date
      generalHealthStatus: 'Normal',
      status: 'Completed',
      requiresFollowUp: false,
      visionLeft: '',
      visionRight: '',
      hearingLeft: 'Normal',
      hearingRight: 'Normal'
    });
    setDialogOpen(true);
  };

  const handleEditCheckup = (checkup) => {
    setSelectedCheckup(checkup);
    // Find and set the selected student for the Autocomplete
    const student = students.find(s => s.id === checkup.studentId);
    setSelectedStudent(student || null);
    form.reset(checkup);
    setDialogOpen(true);
  };

  const handleViewCheckup = (checkup) => {
    setViewCheckup(checkup);
    setViewDialogOpen(true);
  };

  const handleDeleteCheckup = async (id) => {
    const confirmed = await deleteConfirm('Are you sure you want to delete this checkup record?');
    if (confirmed) {
      try {
        await deleteHealthCheckupRecord(id);
        if (students.length > 0) {
          fetchCheckups();
        }
        successAlert('Health checkup record deleted successfully');
      } catch (error) {
        console.error('Error deleting checkup:', error);
        errorAlert('Error deleting health checkup record. Please try again.');
      }
    }
  };

  // Helper function to check if student already has a checkup record for the same event
  const checkDuplicateRecord = (studentId, eventId) => {
    return checkups.find(checkup => 
      checkup.studentId === studentId && 
      checkup.eventId === eventId
    );
  };

  const onSubmit = async (data) => {
    try {
      if (selectedCheckup) {
        await updateHealthCheckupRecord(selectedCheckup.checkupId, data);
      } else {
        // Check for duplicate record before creating new one (now always has eventId)
        const existingRecord = checkDuplicateRecord(data.studentId, data.eventId);
        if (existingRecord) {
          // Ask user if they want to update the existing record instead
          const shouldUpdate = await deleteConfirm(
            `A health checkup record already exists for this student in this event.\n\n` +
            `Student: ${existingRecord.studentName}\n` +
            `Event: ${existingRecord.eventName}\n` +
            `Date: ${existingRecord.checkupDate}\n\n` +
            `Would you like to update the existing record instead of creating a new one?`
          );
          
          if (shouldUpdate) {
            // Switch to update mode with existing record
            setSelectedCheckup(existingRecord);
            form.reset({...existingRecord, ...data}); // Merge existing data with new input
            return; // Don't close dialog, let user continue editing
          } else {
            return; // User chose not to update, cancel the operation
          }
        }
        
        await createHealthCheckupRecord(data);
      }
      setDialogOpen(false);
      setSelectedStudent(null); // Reset selected student
      form.reset({
        conductedBy: getConductorName(),
        checkupDate: new Date().toISOString().split('T')[0], // Current date
        generalHealthStatus: 'Normal',
        status: 'Completed',
        requiresFollowUp: false,
        visionLeft: '',
        visionRight: '',
        hearingLeft: 'Normal',
        hearingRight: 'Normal'
      });
      // Fetch checkups after successful save
      if (students.length > 0) {
        fetchCheckups();
      }
      successAlert('Health checkup record saved successfully');
    } catch (error) {
      console.error('Error saving checkup:', error);
      errorAlert('Error saving health checkup record. Please try again.');
    }
  };

  const filteredCheckups = checkups.filter(checkup => {
    const matchesSearch = (checkup.studentName && checkup.studentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (checkup.studentId && checkup.studentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (checkup.conductedBy && checkup.conductedBy.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || 
                         checkup.status === filterStatus || 
                         checkup.generalHealthStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });



  return (
    <div className="p-6">
      <PageHeader
        title="Health Checkup Management"
        subtitle="Manage student health checkup records and results"
        icon={<HealthIcon />}
      />

      {/* Controls */}
      <Box className="flex gap-4 mb-4">
        <TextField
          placeholder="Search checkups..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon className="mr-2 text-gray-500" />
          }}
          className="flex-1"
        />
        <FormControl className="min-w-32">
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            label="Status"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
            <MenuItem value="Rescheduled">Rescheduled</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddCheckup}
        >
          Add Checkup
        </Button>
      </Box>

      {/* Checkups Table */}
      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student</TableCell>
                  <TableCell>Grade</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Conducted By</TableCell>
                  <TableCell>Height (cm)</TableCell>
                  <TableCell>Weight (kg)</TableCell>
                  {hasBMIData() && <TableCell>BMI</TableCell>}
                  <TableCell>Health Status</TableCell>
                  <TableCell>Checkup Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCheckups.length > 0 ? (
                  filteredCheckups.map((checkup) => (
                    <TableRow key={checkup.checkupId}>
                      <TableCell>
                        {(() => {
                          const student = students.find(s => s.id === checkup.studentId);
                          const displayName = student?.name || checkup.studentName;
                          
                          // Only show the studentName if it doesn't start with "Student ID:"
                          const finalName = displayName && !displayName.startsWith('Student ID:') 
                            ? displayName 
                            : (student?.name || 'Unknown Student');
                            
                          return (
                            <div>
                              <Typography variant="subtitle2">{finalName}</Typography>
                              <Typography variant="caption" color="textSecondary">
                                ID: {checkup.studentId}
                              </Typography>
                            </div>
                          );
                        })()}
                      </TableCell>
                      <TableCell>
                        {students.find(s => s.id === checkup.studentId)?.grade || 'N/A'}
                      </TableCell>
                      <TableCell>{new Date(checkup.checkupDate).toLocaleDateString()}</TableCell>
                      <TableCell>{formatConductedByName(checkup.conductedBy)}</TableCell>
                      <TableCell>{checkup.height || 'N/A'}</TableCell>
                      <TableCell>{checkup.weight || 'N/A'}</TableCell>
                      {hasBMIData() && <TableCell>{checkup.bmi || 'N/A'}</TableCell>}
                      <TableCell>
                        <Chip
                          label={checkup.generalHealthStatus || 'Normal'}
                          color={checkup.generalHealthStatus === 'Normal' ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={checkup.status || 'Completed'}
                          color={
                            checkup.status === 'Completed' ? 'success' :
                            checkup.status === 'In Progress' ? 'info' :
                            checkup.status === 'Pending' ? 'warning' :
                            checkup.status === 'Cancelled' ? 'error' :
                            'default'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          color="primary" 
                          onClick={() => handleEditCheckup(checkup)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          color="primary"
                          onClick={() => handleViewCheckup(checkup)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          onClick={() => handleDeleteCheckup(checkup.checkupId)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      <Box py={4}>
                        <Typography variant="h6" color="textSecondary" gutterBottom>
                          No health checkups found
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Click "Add Checkup" to create your first health checkup record.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => { setDialogOpen(false); setSelectedStudent(null); }} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedCheckup ? 'Edit Health Checkup' : 'Add New Health Checkup'}
        </DialogTitle>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogContent>
            {selectedCheckup && (
              <Alert severity="info" sx={{ mb: 3 }}>
                <strong>Updating existing record:</strong> This student already has a checkup record for this event. 
                You are now updating the existing record instead of creating a new one.
              </Alert>
            )}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={students}
                  value={selectedStudent} // Use selectedStudent state
                  getOptionLabel={(option) => `${option.name} - ${option.grade}`}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Student"
                      required
                      error={!!form.formState.errors.studentId}
                      helperText={form.formState.errors.studentId?.message}
                    />
                  )}
                  onChange={(event, value) => {
                    setSelectedStudent(value); // Update selectedStudent state
                    form.setValue('studentId', value?.id || '');
                  }}
                  disabled={!!selectedCheckup} // Disable when editing to prevent changing student
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Checkup Date"
                  type="date"
                  {...form.register('checkupDate')}
                  error={!!form.formState.errors.checkupDate}
                  helperText={form.formState.errors.checkupDate?.message}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Conducted By"
                  {...form.register('conductedBy')}
                  error={!!form.formState.errors.conductedBy}
                  helperText={form.formState.errors.conductedBy?.message}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={healthEvents}
                  getOptionLabel={(option) => {
                    let label = option.name || '';
                    if (option.date) {
                      label += ` (${new Date(option.date).toLocaleDateString()})`;
                    }
                    return label;
                  }}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <Box>
                        <Typography variant="subtitle2">{option.name}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {option.date && `Date: ${new Date(option.date).toLocaleDateString()}`}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  value={healthEvents.find(event => event.id === form.watch('eventId')) || null}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Health Event"
                      required
                      error={!!form.formState.errors.eventId}
                      helperText={form.formState.errors.eventId?.message}
                    />
                  )}
                  onChange={(event, value) => {
                    form.setValue('eventId', value?.id || '');
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Health Status</InputLabel>
                  <Select
                    {...form.register('generalHealthStatus')}
                    error={!!form.formState.errors.generalHealthStatus}
                  >
                    <MenuItem value="Normal">Normal</MenuItem>
                    <MenuItem value="Attention Required">Attention Required</MenuItem>
                    <MenuItem value="Medical Follow-up">Medical Follow-up</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Checkup Status</InputLabel>
                  <Select
                    {...form.register('status')}
                    error={!!form.formState.errors.status}
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                    <MenuItem value="Rescheduled">Rescheduled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Basic Measurements */}
              <Grid item xs={12}>
                <Typography variant="h6" className="mb-2">Basic Measurements</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField
                  fullWidth
                  label="Height (cm)"
                  type="number"
                  {...form.register('height')}
                  error={!!form.formState.errors.height}
                  helperText={form.formState.errors.height?.message}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField
                  fullWidth
                  label="Weight (kg)"
                  type="number"
                  {...form.register('weight')}
                  error={!!form.formState.errors.weight}
                  helperText={form.formState.errors.weight?.message}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField
                  fullWidth
                  label="Heart Rate (bpm)"
                  type="number"
                  {...form.register('heartRate')}
                  error={!!form.formState.errors.heartRate}
                  helperText={form.formState.errors.heartRate?.message}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField
                  fullWidth
                  label="Temperature (°C)"
                  type="number"
                  step="0.1"
                  {...form.register('temperature')}
                  error={!!form.formState.errors.temperature}
                  helperText={form.formState.errors.temperature?.message}
                />
              </Grid>

              {/* Blood Pressure */}
              <Grid item xs={6} md={3}>
                <TextField
                  fullWidth
                  label="Systolic BP"
                  type="number"
                  {...form.register('bloodPressureSystolic')}
                  error={!!form.formState.errors.bloodPressureSystolic}
                  helperText={form.formState.errors.bloodPressureSystolic?.message}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField
                  fullWidth
                  label="Diastolic BP"
                  type="number"
                  {...form.register('bloodPressureDiastolic')}
                  error={!!form.formState.errors.bloodPressureDiastolic}
                  helperText={form.formState.errors.bloodPressureDiastolic?.message}
                />
              </Grid>

              {/* Vision and Hearing */}
              <Grid item xs={6} md={3}>
                <TextField
                  fullWidth
                  label="Vision Left"
                  {...form.register('visionLeft')}
                  placeholder="e.g., 10/10"
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField
                  fullWidth
                  label="Vision Right"
                  {...form.register('visionRight')}
                  placeholder="e.g., 10/10"
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField
                  fullWidth
                  label="Hearing Left"
                  {...form.register('hearingLeft')}
                  placeholder="e.g., Normal"
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField
                  fullWidth
                  label="Hearing Right"
                  {...form.register('hearingRight')}
                  placeholder="e.g., Normal"
                />
              </Grid>

              {/* Notes and Follow-up */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Health Notes"
                  multiline
                  rows={3}
                  {...form.register('healthNotes')}
                  placeholder="Additional health observations..."
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Recommendations"
                  multiline
                  rows={2}
                  {...form.register('recommendations')}
                  placeholder="Medical recommendations..."
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      {...form.register('requiresFollowUp')}
                    />
                  }
                  label="Requires Follow-up"
                />
              </Grid>
              
              {/* Conditional Follow-up fields */}
              {form.watch('requiresFollowUp') && (
                <>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Follow-up Date"
                      type="date"
                      {...form.register('followUpDate')}
                      error={!!form.formState.errors.followUpDate}
                      helperText={form.formState.errors.followUpDate?.message}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Follow-up Notes"
                      multiline
                      rows={2}
                      {...form.register('followUpNotes')}
                      placeholder="Follow-up instructions or notes..."
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setDialogOpen(false); setSelectedStudent(null); }}>Cancel</Button>
            <Button type="submit" variant="contained">
              {selectedCheckup ? 'Update' : 'Save'} Checkup
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Health Checkup Details
        </DialogTitle>
        <DialogContent>
          {viewCheckup && (
            <Grid container spacing={3}>
              {/* Student Information */}
              <Grid item xs={12}>
                <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                  Student Information
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="textSecondary">Student Name</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {viewCheckup.studentName || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="textSecondary">Student ID</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {viewCheckup.studentId || 'N/A'}
                </Typography>
              </Grid>

              {/* Checkup Information */}
              <Grid item xs={12}>
                <Typography variant="h6" color="primary" sx={{ mb: 2, mt: 2 }}>
                  Checkup Information
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="textSecondary">Checkup Date</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {viewCheckup.checkupDate ? new Date(viewCheckup.checkupDate).toLocaleDateString() : 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="textSecondary">Conducted By</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {formatConductedByName(viewCheckup.conductedBy)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="textSecondary">Health Event</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {viewCheckup.eventName || 'No Event'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="textSecondary">Health Status</Typography>
                <Chip 
                  label={viewCheckup.generalHealthStatus || 'N/A'} 
                  color={
                    viewCheckup.generalHealthStatus === 'Normal' ? 'success' :
                    viewCheckup.generalHealthStatus === 'Attention Required' ? 'warning' :
                    viewCheckup.generalHealthStatus === 'Medical Follow-up' ? 'error' : 'default'
                  }
                  sx={{ fontWeight: 'bold' }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="textSecondary">Checkup Status</Typography>
                <Chip 
                  label={viewCheckup.status || 'Completed'} 
                  color={
                    viewCheckup.status === 'Completed' ? 'success' :
                    viewCheckup.status === 'In Progress' ? 'info' :
                    viewCheckup.status === 'Pending' ? 'warning' :
                    viewCheckup.status === 'Cancelled' ? 'error' :
                    viewCheckup.status === 'Rescheduled' ? 'secondary' : 'default'
                  }
                  sx={{ fontWeight: 'bold' }}
                />
              </Grid>

              {/* Measurements */}
              <Grid item xs={12}>
                <Typography variant="h6" color="primary" sx={{ mb: 2, mt: 2 }}>
                  Measurements
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="textSecondary">Height</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {viewCheckup.height ? `${viewCheckup.height} cm` : 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="textSecondary">Weight</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {viewCheckup.weight ? `${viewCheckup.weight} kg` : 'N/A'}
                </Typography>
              </Grid>
              {hasBMIData() && (
                <Grid item xs={6} md={3}>
                  <Typography variant="body2" color="textSecondary">BMI</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {viewCheckup.bmi ? viewCheckup.bmi.toFixed(1) : 'N/A'}
                  </Typography>
                </Grid>
              )}
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="textSecondary">Heart Rate</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {viewCheckup.heartRate ? `${viewCheckup.heartRate} bpm` : 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="textSecondary">Temperature</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {viewCheckup.temperature ? `${viewCheckup.temperature}°C` : 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="textSecondary">Blood Pressure</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {viewCheckup.bloodPressureSystolic && viewCheckup.bloodPressureDiastolic ? 
                    `${viewCheckup.bloodPressureSystolic}/${viewCheckup.bloodPressureDiastolic}` : 'N/A'}
                </Typography>
              </Grid>

              {/* Vision and Hearing */}
              <Grid item xs={12}>
                <Typography variant="h6" color="primary" sx={{ mb: 2, mt: 2 }}>
                  Vision & Hearing
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="textSecondary">Vision Left</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {viewCheckup.visionLeft || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="textSecondary">Vision Right</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {viewCheckup.visionRight || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="textSecondary">Hearing Left</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {viewCheckup.hearingLeft || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="textSecondary">Hearing Right</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {viewCheckup.hearingRight || 'N/A'}
                </Typography>
              </Grid>

              {/* Notes and Follow-up */}
              {(viewCheckup.healthNotes || viewCheckup.recommendations || viewCheckup.requiresFollowUp) && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="h6" color="primary" sx={{ mb: 2, mt: 2 }}>
                      Notes & Follow-up
                    </Typography>
                  </Grid>
                  {viewCheckup.healthNotes && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary">Health Notes</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {viewCheckup.healthNotes}
                      </Typography>
                    </Grid>
                  )}
                  {viewCheckup.recommendations && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary">Recommendations</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {viewCheckup.recommendations}
                      </Typography>
                    </Grid>
                  )}
                  {viewCheckup.requiresFollowUp && (
                    <>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="textSecondary">Requires Follow-up</Typography>
                        <Chip 
                          label={viewCheckup.requiresFollowUp ? 'Yes' : 'No'} 
                          color={viewCheckup.requiresFollowUp ? 'warning' : 'success'}
                          sx={{ fontWeight: 'bold' }}
                        />
                      </Grid>
                      {viewCheckup.followUpDate && (
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2" color="textSecondary">Follow-up Date</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {new Date(viewCheckup.followUpDate).toLocaleDateString()}
                          </Typography>
                        </Grid>
                      )}
                      {viewCheckup.followUpNotes && (
                        <Grid item xs={12}>
                          <Typography variant="body2" color="textSecondary">Follow-up Notes</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {viewCheckup.followUpNotes}
                          </Typography>
                        </Grid>
                      )}
                    </>
                  )}
                </>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          <Button 
            variant="contained" 
            onClick={() => {
              setViewDialogOpen(false);
              handleEditCheckup(viewCheckup);
            }}
          >
            Edit Checkup
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default HealthCheckupManagement;
