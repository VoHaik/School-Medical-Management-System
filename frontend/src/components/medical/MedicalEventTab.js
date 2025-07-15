import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import apiClient from '../../utils/api';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Autocomplete,
  FormHelperText,
  Alert,
  CircularProgress,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  WarningAmber as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

// Form validation schema
const schema = yup.object().shape({
  studentCode: yup.string().required('Student code is required'),
  eventType: yup.string().required('Event type is required'),
  description: yup.string().required('Description is required'),
  severity: yup.string().required('Severity is required'),
  actionTaken: yup.string().required('Action taken is required'),
  medicationGiven: yup.string(),
  medicationQuantity: yup.number().min(1, 'Số lượng phải lớn hơn 0'),
  symptoms: yup.array().of(yup.string()).nullable(),
  status: yup.string().required('Status is required')
});

function MedicalEventTab() {  // State variables
  const [medicalEvents, setMedicalEvents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [students, setStudents] = useState([]);
  const [medications, setMedications] = useState([]); // Danh sách thuốc từ kho
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [symptomOptions, setSymptomOptions] = useState([
    'Fever', 'Headache', 'Nausea', 'Vomiting', 'Dizziness', 'Rash', 
    'Pain', 'Bleeding', 'Swelling', 'Coughing', 'Fatigue', 'Shortness of breath'
  ]);  // Initialize form
  const { control, handleSubmit, reset, setValue, formState: { errors }, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      studentCode: '',
      eventType: '',
      description: '',
      severity: '',
      actionTaken: '',
      medicationGiven: '',
      medicationQuantity: 1, // Số lượng thuốc mặc định là 1
      symptoms: [],
      status: 'ACTIVE'
    }
  });
  
  // Theo dõi các giá trị của form để kiểm tra số lượng thuốc
  const selectedMedication = watch('medicationGiven');
  const medicationQuantity = watch('medicationQuantity');
  // Fetch all medical events when component mounts
  useEffect(() => {
    fetchMedicalEvents();
    fetchStudents();
    fetchMedications();
  }, []);

  // Fetch medical events from API
  const fetchMedicalEvents = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/medical-events');
      setMedicalEvents(response.data);
      setErrorMessage('');
    } catch (error) {
      
      setErrorMessage('Failed to load medical events. ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };
  // Fetch students for dropdown
  const fetchStudents = async () => {
    try {
      const response = await apiClient.get('/students');
      setStudents(response.data);
    } catch (error) {
      
      setErrorMessage('Failed to load students. ' + (error.response?.data?.message || error.message));
    }
  };
    // Fetch medications from inventory
  const fetchMedications = async () => {
    try {
      const response = await apiClient.get('/medications/inventory');
      setMedications(response.data);
    } catch (error) {
      
      setErrorMessage('Unable to load medication list. ' + (error.response?.data?.message || error.message));
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      // Format the data
      const formattedData = {
        ...data,
        eventDatetime: new Date().toISOString()
      };
      
      if (editMode) {
        const response = await apiClient.put(`/medical-events/${editId}`, formattedData);
        setSuccessMessage('Medical event updated successfully');
        setMedicalEvents(medicalEvents.map(event => event.id === editId ? response.data : event));
      } else {
        const response = await apiClient.post('/medical-events', formattedData);
        setSuccessMessage('Medical event added successfully');
        setMedicalEvents([...medicalEvents, response.data]);
      }
      
      handleCloseDialog();
      fetchMedicalEvents(); // Refresh the list
    } catch (error) {
      
      setErrorMessage('Failed to save medical event. ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };
  // Open dialog for adding a new medical event
  const handleOpenAddDialog = () => {
    setEditMode(false);
    setEditId(null);
    reset({
      studentCode: '',
      eventType: '',
      description: '',
      severity: '',
      actionTaken: '',
      medicationGiven: '',
      medicationQuantity: 1,
      symptoms: [],
      status: 'ACTIVE'
    });
    setOpenDialog(true);
  };

  // Open dialog for editing an existing medical event
  const handleOpenEditDialog = (event) => {
    setEditMode(true);
    setEditId(event.id);    // Pre-populate the form with existing data
    reset({
      studentCode: event.studentCode || '',
      eventType: event.eventType || '',
      description: event.description || '',
      severity: event.severity || '',
      actionTaken: event.actionTaken || '',
      medicationGiven: event.medicationGiven || '',
      medicationQuantity: event.medicationQuantity || 1,
      symptoms: event.symptoms || [],
      status: event.status || 'ACTIVE'
    });
    setOpenDialog(true);
  };

  // Close the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setErrorMessage('');
    setSuccessMessage('');
  };

  // Delete a medical event
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this medical event?')) {
      setLoading(true);
      try {
        await apiClient.delete(`/medical-events/${id}`);
        setSuccessMessage('Medical event deleted successfully');
        setMedicalEvents(medicalEvents.filter(event => event.id !== id));
      } catch (error) {
        
        setErrorMessage('Failed to delete medical event. ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    }
  };

  // Get severity color based on level
  const getSeverityColor = (severity) => {
    switch (severity?.toUpperCase()) {
      case 'LOW':
        return 'info';
      case 'MEDIUM':
        return 'warning';
      case 'HIGH':
        return 'error';
      case 'CRITICAL':
        return 'error';
      default:
        return 'default';
    }
  };

  // Get status color based on value
  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return 'error';
      case 'RESOLVED':
        return 'success';
      case 'FOLLOW_UP':
        return 'warning';
      case 'REFERRED':
        return 'info';
      default:
        return 'default';
    }
  };

  // Get status icon based on value
  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return <WarningIcon />;
      case 'RESOLVED':
        return <CheckCircleIcon />;
      case 'FOLLOW_UP':
        return <ErrorIcon />;
      case 'REFERRED':
        return <ErrorIcon />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h2">Medical Event Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
        >
          Add Medical Event
        </Button>
      </Box>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Student</TableCell>
                <TableCell>Event Type</TableCell>
                <TableCell>Severity</TableCell>
                <TableCell>Date/Time</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {medicalEvents.length > 0 ? (
                medicalEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{event.id}</TableCell>
                    <TableCell>{event.studentCode}</TableCell>
                    <TableCell>{event.eventType}</TableCell>
                    <TableCell>
                      <Chip 
                        label={event.severity} 
                        color={getSeverityColor(event.severity)} 
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {event.eventDatetime ? new Date(event.eventDatetime).toLocaleString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        icon={getStatusIcon(event.status)}
                        label={event.status} 
                        color={getStatusColor(event.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title={event.description}>
                        <Typography noWrap sx={{ maxWidth: '150px' }}>
                          {event.description}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleOpenEditDialog(event)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(event.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No medical events found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Medical Event Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editMode ? 'Edit Medical Event' : 'Add New Medical Event'}</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="studentCode"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.studentCode}>
                      <InputLabel>Student</InputLabel>
                      <Select
                        {...field}
                        label="Student"
                      >
                        {students.map((student) => (
                          <MenuItem key={student.studentCode} value={student.studentCode}>
                            {student.studentCode} - {student.firstName} {student.lastName}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.studentCode && (
                        <FormHelperText>{errors.studentCode.message}</FormHelperText>
                      )}
                    </FormControl>
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
                      <Select
                        {...field}
                        label="Event Type"
                      >
                        <MenuItem value="INJURY">Injury</MenuItem>
                        <MenuItem value="ILLNESS">Illness</MenuItem>
                        <MenuItem value="ACCIDENT">Accident</MenuItem>
                        <MenuItem value="EMERGENCY">Emergency</MenuItem>
                        <MenuItem value="MEDICATION">Medication Related</MenuItem>
                        <MenuItem value="OUTBREAK">Disease Outbreak</MenuItem>
                        <MenuItem value="FALL">Fall</MenuItem>
                        <MenuItem value="FEVER">Fever</MenuItem>
                        <MenuItem value="ALLERGIC_REACTION">Allergic Reaction</MenuItem>
                        <MenuItem value="OTHER">Other</MenuItem>
                      </Select>
                      {errors.eventType && (
                        <FormHelperText>{errors.eventType.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="severity"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.severity}>
                      <InputLabel>Severity</InputLabel>
                      <Select
                        {...field}
                        label="Severity"
                      >
                        <MenuItem value="LOW">Low</MenuItem>
                        <MenuItem value="MEDIUM">Medium</MenuItem>
                        <MenuItem value="HIGH">High</MenuItem>
                        <MenuItem value="CRITICAL">Critical</MenuItem>
                      </Select>
                      {errors.severity && (
                        <FormHelperText>{errors.severity.message}</FormHelperText>
                      )}
                    </FormControl>
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
                      <Select
                        {...field}
                        label="Status"
                      >
                        <MenuItem value="ACTIVE">Active</MenuItem>
                        <MenuItem value="RESOLVED">Resolved</MenuItem>
                        <MenuItem value="FOLLOW_UP">Follow-up</MenuItem>
                        <MenuItem value="REFERRED">Referred</MenuItem>
                      </Select>
                      {errors.status && (
                        <FormHelperText>{errors.status.message}</FormHelperText>
                      )}
                    </FormControl>
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
                      label="Description"
                      multiline
                      rows={2}
                      fullWidth
                      error={!!errors.description}
                      helperText={errors.description?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="symptoms"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      multiple
                      options={symptomOptions}
                      freeSolo
                      onChange={(_, value) => field.onChange(value)}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Symptoms"
                          error={!!errors.symptoms}
                          helperText={errors.symptoms?.message}
                        />
                      )}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="actionTaken"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Action Taken"
                      multiline
                      rows={2}
                      fullWidth
                      error={!!errors.actionTaken}
                      helperText={errors.actionTaken?.message}
                    />
                  )}
                />
              </Grid>              <Grid item xs={12} md={6}>                <Controller
                  name="medicationGiven"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.medicationGiven}>
                      <InputLabel>Thuốc đã cấp</InputLabel>
                      <Select
                        {...field}
                        label="Thuốc đã cấp"
                      >                        {medications.map((med) => (
                          <MenuItem key={med.medicationId} value={med.medicationName} disabled={med.quantity <= 0}>
                            {med.medicationName} ({med.dosage}, {med.form}) - Số lượng: {med.quantity} {med.quantity <= 5 ? '⚠️' : ''}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.medicationGiven && (
                        <FormHelperText>{errors.medicationGiven.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>              <Grid item xs={12} md={4}>
                <Controller
                  name="medicationQuantity"
                  control={control}
                  render={({ field }) => {
                    // Tìm thuốc được chọn để xem số lượng tối đa có thể sử dụng
                    const selectedMed = medications.find(med => med.medicationName === selectedMedication);
                    const maxQuantity = selectedMed ? selectedMed.quantity : 1;
                    
                    return (
                      <TextField
                        {...field}
                        label="Số lượng thuốc"
                        type="number"
                        fullWidth
                        InputProps={{ 
                          inputProps: { 
                            min: 1, 
                            max: maxQuantity 
                          } 
                        }}
                        error={!!errors.medicationQuantity || (selectedMed && field.value > maxQuantity)}
                        helperText={
                          errors.medicationQuantity?.message || 
                          (selectedMed && field.value > maxQuantity ? `Vượt quá số lượng trong kho (${maxQuantity})` : '')
                        }
                        onChange={(e) => {
                          const value = parseInt(e.target.value, 10);
                          if (!isNaN(value)) {
                            if (selectedMed && value > maxQuantity) {
                              field.onChange(maxQuantity);
                            } else if (value < 1) {
                              field.onChange(1);
                            } else {
                              field.onChange(value);
                            }
                          }
                        }}
                      />
                    );
                  }}
                />
              </Grid>
                {/* Các trường ReferredTo, ParentNotified, FollowUpRequired đã được xóa bỏ */}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            color="primary"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : editMode ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default MedicalEventTab;
