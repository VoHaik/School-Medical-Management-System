import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Tooltip,
  CircularProgress,
  Snackbar,
  FormHelperText,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  LocalHospital as HealthIcon,
  Vaccines as VaccineIcon,
  Schedule as ScheduleIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  getAllHealthEvents, 
  getHealthEventById, 
  createHealthEvent, 
  updateHealthEvent, 
  deleteHealthEvent,
  getAllGradeLevels,
  getAllVaccines,
  getAllCheckupTypes
} from '../../utils/api';

// Validation schema for health events
const eventSchema = yup.object().shape({
  eventName: yup.string().required('Event name is required'),
  eventType: yup.string().required('Event type is required'),
  description: yup.string().required('Description is required'),
  scheduledDate: yup.date().required('Scheduled date is required'),
  location: yup.string().required('Location is required'),
  status: yup.string().required('Status is required'),
  targetGradeIds: yup.array().min(1, 'At least one grade must be selected'),
  selectedVaccines: yup.array().when('eventType', {
    is: 'VACCINATION',
    then: (schema) => schema.min(1, 'At least one vaccine must be selected for vaccination events'),
    otherwise: (schema) => schema
  }),
  typesOfCheckups: yup.array().when('eventType', {
    is: 'HEALTH_CHECKUP',
    then: (schema) => schema.min(1, 'At least one checkup type must be selected for health checkup events'),
    otherwise: (schema) => schema
  })
});

const EventManagement = () => {
  // State management
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventToDelete, setEventToDelete] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Form data
  const [gradeLevels, setGradeLevels] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [checkupTypes, setCheckupTypes] = useState([]);
  
  // Notification state
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Form setup
  const { control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(eventSchema),
    defaultValues: {
      eventName: '',
      eventType: 'HEALTH_CHECKUP',
      description: '',
      scheduledDate: '',
      location: '',
      status: 'SCHEDULED',
      targetGradeIds: [],
      selectedVaccines: [],
      typesOfCheckups: []
    }
  });

  const watchEventType = watch('eventType');

  // Load initial data
  useEffect(() => {
    loadEvents();
    loadFormData();
  }, []);

  // Filter events when search term or filters change
  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, typeFilter, statusFilter]);

  // Fetch events from API
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await getAllHealthEvents();
      if (data && Array.isArray(data)) {
        setEvents(data);
        setFilteredEvents(data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load events',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await getAllHealthEvents();
      setEvents(eventsData);
    } catch (error) {
      console.error('Error loading events:', error);
      showSnackbar('Failed to load events', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadFormData = async () => {
    try {
      const [gradesData, vaccinesData, checkupsData] = await Promise.all([
        getAllGradeLevels(),
        getAllVaccines(),
        getAllCheckupTypes()
      ]);
      setGradeLevels(gradesData);
      setVaccines(vaccinesData);
      setCheckupTypes(checkupsData);
    } catch (error) {
      console.error('Error loading form data:', error);
      showSnackbar('Failed to load form data', 'error');
    }
  };

  const filterEvents = () => {
    let filtered = events;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== 'ALL') {
      filtered = filtered.filter(event => event.eventType === typeFilter);
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(event => event.status === statusFilter);
    }

    setFilteredEvents(filtered);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingEvent(null);
    reset({
      eventName: '',
      eventType: 'HEALTH_CHECKUP',
      description: '',
      scheduledDate: '',
      location: '',
      status: 'SCHEDULED',
      targetGradeIds: [],
      selectedVaccines: [],
      typesOfCheckups: []
    });
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Event handlers
  const handleAddEvent = () => {
    setEditingEvent(null);
    reset({
      eventName: '',
      eventType: 'HEALTH_CHECKUP',
      description: '',
      scheduledDate: '',
      location: '',
      targetGradeIds: [],
      selectedVaccines: [],
      typesOfCheckups: []
    });
    setDialogOpen(true);
  };

  const handleEditEvent = async (event) => {
    try {
      // Get full event details with all IDs populated
      const eventDetails = await getHealthEventById(event.eventId);
      
      setEditingEvent(eventDetails);
      reset({
        eventName: eventDetails.eventName || '',
        eventType: eventDetails.eventType || 'HEALTH_CHECKUP',
        description: eventDetails.description || '',
        scheduledDate: eventDetails.scheduledDate || '',
        location: eventDetails.location || '',
        status: eventDetails.status || 'SCHEDULED',
        targetGradeIds: eventDetails.targetGradeIds || [],
        selectedVaccines: eventDetails.selectedVaccines || [],
        typesOfCheckups: eventDetails.typesOfCheckups || []
      });
      setDialogOpen(true);
    } catch (error) {
      console.error('Error loading event details for editing:', error);
      showSnackbar('Failed to load event details', 'error');
    }
  };

  const handleViewEvent = async (event) => {
    try {
      const eventDetails = await getHealthEventById(event.eventId);
      setSelectedEvent(eventDetails);
      setViewDialogOpen(true);
    } catch (error) {
      console.error('Error loading event details:', error);
      showSnackbar('Failed to load event details', 'error');
    }
  };

  const handleDeleteEvent = (event) => {
    setEventToDelete(event);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteHealthEvent(eventToDelete.eventId);
      showSnackbar('Event deleted successfully');
      loadEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      
      // More detailed error message
      let errorMessage = 'Failed to delete event';
      if (error.message) {
        errorMessage += ': ' + error.message;
      } else if (error.response?.data?.message) {
        errorMessage += ': ' + error.response.data.message;
      } else if (error.response?.status === 404) {
        errorMessage = 'Event not found - it may have already been deleted';
      } else if (error.response?.status === 403) {
        errorMessage = 'Permission denied - you do not have access to delete this event';
      } else if (error.response?.status === 409) {
        errorMessage = 'Cannot delete event - it may have associated records (checkups, vaccinations, etc.)';
      }
      
      showSnackbar(errorMessage, 'error');
    } finally {
      setDeleteDialogOpen(false);
      setEventToDelete(null);
    }
  };

  const onSubmit = async (data) => {
    try {
      // Validate that targetGradeIds is not empty
      if (!data.targetGradeIds || data.targetGradeIds.length === 0) {
        showSnackbar('Please select at least one grade level', 'error');
        return;
      }
      
      // Convert targetGradeIds to targetGradeNames for backend validation
      const targetGradeNames = data.targetGradeIds.map(gradeId => {
        const grade = gradeLevels.find(g => g.gradeId === gradeId);
        return grade ? grade.gradeName : null;
      }).filter(Boolean); // Remove any null values
      
      // Additional validation to ensure conversion was successful
      if (targetGradeNames.length === 0) {
        console.error('Failed to convert any grade IDs to grade names');
        showSnackbar('Error: Could not convert grade levels for submission', 'error');
        return;
      }
      
      if (targetGradeNames.length !== data.targetGradeIds.length) {
        }

      // Format the data for the API
      const eventData = {
        eventName: data.eventName,
        eventType: data.eventType,
        description: data.description,
        scheduledDate: data.scheduledDate,
        location: data.location,
        status: data.status,
        targetGradeIds: data.targetGradeIds,
        targetGradeNames: targetGradeNames, // Add this for backend validation
        selectedVaccines: data.eventType === 'VACCINATION' ? data.selectedVaccines : [],
        typesOfCheckups: data.eventType === 'HEALTH_CHECKUP' ? data.typesOfCheckups : []
      };

      if (editingEvent) {
        await updateHealthEvent(editingEvent.eventId, eventData);
        showSnackbar('Event updated successfully');
      } else {
        await createHealthEvent(eventData);
        showSnackbar('Event created successfully');
      }

      handleCloseDialog();
      loadEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      showSnackbar('Failed to save event', 'error');
    }
  };

  // Utility functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'SCHEDULED': return 'primary';
      case 'IN_PROGRESS': return 'warning';
      case 'COMPLETED': return 'success';
      case 'CANCELLED': return 'error';
      case 'POSTPONED': return 'secondary';
      default: return 'default';
    }
  };

  const getEventTypeIcon = (type) => {
    return type === 'VACCINATION' ? <VaccineIcon /> : <HealthIcon />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    return new Date(dateTimeString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Box className="mb-4 flex justify-between items-center">
            <Typography variant="h5" component="h1">
              Health Event Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddEvent}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Create New Event
            </Button>
          </Box>

          {/* Search and Filter Controls */}
          <Grid container spacing={3} className="mb-4">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search Events"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon className="mr-2 text-gray-500" />
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Event Type</InputLabel>
                <Select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  label="Event Type"
                >
                  <MenuItem value="ALL">All Types</MenuItem>
                  <MenuItem value="HEALTH_CHECKUP">Health Checkup</MenuItem>
                  <MenuItem value="VACCINATION">Vaccination</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="ALL">All Statuses</MenuItem>
                  <MenuItem value="SCHEDULED">Scheduled</MenuItem>
                  <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                  <MenuItem value="COMPLETED">Completed</MenuItem>
                  <MenuItem value="CANCELLED">Cancelled</MenuItem>
                  <MenuItem value="POSTPONED">Postponed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Events Table */}
          {loading ? (
            <Box className="flex justify-center py-8">
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Event Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Scheduled Date</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEvents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography variant="body2" color="textSecondary">
                          No events found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEvents.map((event) => (
                      <TableRow key={event.eventId}>
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2">{event.eventName}</Typography>
                            <Typography variant="caption" color="textSecondary">
                              {event.description}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getEventTypeIcon(event.eventType)}
                            label={event.eventType.replace('_', ' ')}
                            variant="outlined"
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={event.status}
                            color={getStatusColor(event.status)}
                            size="small"
                          />
                          {/* Debug info */}
                          {process.env.NODE_ENV === 'development' && (
                            <Typography variant="caption" display="block" color="textSecondary">
                              Debug: {event.status}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Box className="flex items-center">
                            <ScheduleIcon className="mr-1 text-gray-500" fontSize="small" />
                            <Typography variant="body2">
                              {formatDate(event.scheduledDate)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{event.location}</Typography>
                        </TableCell>
                        <TableCell>
                          <Tooltip title="View Details">
                            <IconButton onClick={() => handleViewEvent(event)}>
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Event">
                            <IconButton onClick={() => handleEditEvent(event)}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          {false && (
                            <Tooltip title="Delete Event">
                              <IconButton color="error" onClick={() => handleDeleteEvent(event)}>
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Event Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingEvent ? 'Edit Health Event' : 'Create New Health Event'}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Controller
                  name="eventName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Event Name"
                      error={!!errors.eventName}
                      helperText={errors.eventName?.message}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Controller
                  name="eventType"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.eventType}>
                      <InputLabel>Event Type</InputLabel>
                      <Select {...field} label="Event Type">
                        <MenuItem value="HEALTH_CHECKUP">Health Checkup</MenuItem>
                        <MenuItem value="VACCINATION">Vaccination</MenuItem>
                      </Select>
                      {errors.eventType && <FormHelperText>{errors.eventType.message}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Controller
                  name="scheduledDate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Scheduled Date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.scheduledDate}
                      helperText={errors.scheduledDate?.message}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.status}>
                      <InputLabel>Status</InputLabel>
                      <Select {...field} label="Status">
                        <MenuItem value="SCHEDULED">Scheduled</MenuItem>
                        <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                        <MenuItem value="COMPLETED">Completed</MenuItem>
                        <MenuItem value="CANCELLED">Cancelled</MenuItem>
                        <MenuItem value="POSTPONED">Postponed</MenuItem>
                      </Select>
                      {errors.status && <FormHelperText>{errors.status.message}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Location"
                      error={!!errors.location}
                      helperText={errors.location?.message}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Description"
                      multiline
                      rows={3}
                      error={!!errors.description}
                      helperText={errors.description?.message}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Controller
                  name="targetGradeIds"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.targetGradeIds}>
                      <InputLabel>Target Grades</InputLabel>
                      <Select
                        {...field}
                        multiple
                        label="Target Grades"
                        renderValue={(selected) => 
                          selected.map(id => {
                            const grade = gradeLevels.find(g => g.gradeId === id);
                            return grade ? grade.gradeName : id;
                          }).join(', ')
                        }
                      >
                        {gradeLevels.map((grade) => (
                          <MenuItem key={grade.gradeId} value={grade.gradeId}>
                            {grade.gradeName}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.targetGradeIds && <FormHelperText>{errors.targetGradeIds.message}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </Grid>
              
              {watchEventType === 'VACCINATION' && (
                <Grid item xs={12}>
                  <Controller
                    name="selectedVaccines"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.selectedVaccines}>
                        <InputLabel>Vaccines</InputLabel>
                        <Select
                          {...field}
                          multiple
                          label="Vaccines"
                          renderValue={(selected) => 
                            selected.map(id => {
                              const vaccine = vaccines.find(v => v.vaccineId === id);
                              return vaccine ? vaccine.name : id;
                            }).join(', ')
                          }
                        >
                          {vaccines.map((vaccine) => (
                            <MenuItem key={vaccine.vaccineId} value={vaccine.vaccineId}>
                              {vaccine.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.selectedVaccines && <FormHelperText>{errors.selectedVaccines.message}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </Grid>
              )}
              
              {watchEventType === 'HEALTH_CHECKUP' && (
                <Grid item xs={12}>
                  <Controller
                    name="typesOfCheckups"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.typesOfCheckups}>
                        <InputLabel>Checkup Types</InputLabel>
                        <Select
                          {...field}
                          multiple
                          label="Checkup Types"
                          renderValue={(selected) => 
                            selected.map(id => {
                              const checkup = checkupTypes.find(c => c.checkupTypeId === id);
                              return checkup ? checkup.typeName : id;
                            }).join(', ')
                          }
                        >
                          {checkupTypes.map((checkup) => (
                            <MenuItem key={checkup.checkupTypeId} value={checkup.checkupTypeId}>
                              {checkup.typeName}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.typesOfCheckups && <FormHelperText>{errors.typesOfCheckups.message}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingEvent ? 'Update' : 'Create'} Event
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View Event Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box className="flex justify-between items-center">
            Event Details
            <IconButton onClick={() => setViewDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>{selectedEvent.eventName}</Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Paper className="p-4" sx={{ backgroundColor: '#e3f2fd', border: '2px solid #1976d2' }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DescriptionIcon />
                    Event Description
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    lineHeight: 1.8, 
                    whiteSpace: 'pre-line', 
                    fontStyle: selectedEvent.description ? 'normal' : 'italic',
                    color: selectedEvent.description ? 'text.primary' : 'text.secondary',
                    backgroundColor: '#fff',
                    padding: 2,
                    borderRadius: 1,
                    border: '1px solid #e0e0e0'
                  }}>
                    {selectedEvent.description || 'No description provided for this event'}
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper className="p-4">
                  <Typography variant="subtitle1" gutterBottom>Event Information</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}><strong>Type:</strong> {selectedEvent.eventType?.replace('_', ' ')}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                    <Typography variant="body2"><strong>Status:</strong></Typography>
                    <Chip 
                      label={selectedEvent.status}
                      color={getStatusColor(selectedEvent.status)}
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>
                  <Typography variant="body2"><strong>Date:</strong> {formatDate(selectedEvent.scheduledDate)}</Typography>
                  <Typography variant="body2"><strong>Location:</strong> {selectedEvent.location}</Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper className="p-4">
                  <Typography variant="subtitle1" gutterBottom>Target Grades</Typography>
                  {selectedEvent.targetGradeNames && selectedEvent.targetGradeNames.length > 0 ? (
                    <Box className="flex flex-wrap gap-1">
                      {selectedEvent.targetGradeNames.map((gradeName, index) => (
                        <Chip key={index} label={gradeName} size="small" />
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="textSecondary">No grades specified</Typography>
                  )}
                </Paper>
              </Grid>
              
              {selectedEvent.eventType === 'VACCINATION' && selectedEvent.vaccineNames && selectedEvent.vaccineNames.length > 0 && (
                <Grid item xs={12}>
                  <Paper className="p-4">
                    <Typography variant="subtitle1" gutterBottom>Vaccines</Typography>
                    <Box className="flex flex-wrap gap-1">
                      {selectedEvent.vaccineNames.map((vaccineName, index) => (
                        <Chip key={index} label={vaccineName} size="small" color="primary" />
                      ))}
                    </Box>
                  </Paper>
                </Grid>
              )}
              
              {selectedEvent.eventType === 'HEALTH_CHECKUP' && selectedEvent.typesOfCheckups && selectedEvent.typesOfCheckups.length > 0 && (
                <Grid item xs={12}>
                  <Paper className="p-4">
                    <Typography variant="subtitle1" gutterBottom>Checkup Types</Typography>
                    <Box className="flex flex-wrap gap-1">
                      {selectedEvent.typesOfCheckups.map((checkupName, index) => (
                        <Chip key={index} label={checkupName} size="small" color="secondary" />
                      ))}
                    </Box>
                  </Paper>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the event "{eventToDelete?.eventName}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EventManagement;
