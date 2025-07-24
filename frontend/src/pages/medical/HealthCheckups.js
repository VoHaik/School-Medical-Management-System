import React, { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios'; // Import axios
import { useAlert } from '../../hooks/useAlert'; // Import useAlert hook
import {
  getAllHealthCheckupRecords,
  createHealthCheckupRecord,
  updateHealthCheckupRecord,
  deleteHealthCheckupRecord,
  getAllStudents
} from '../../utils/api';
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

  Autocomplete,
  FormControlLabel,
  Checkbox,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  LocalHospital as HealthIcon
} from '@mui/icons-material';
import PageHeader from '../../components/PageHeader';

const healthCheckupSchema = yup.object().shape({
  checkupDate: yup.date().required('Checkup date is required').typeError('Invalid date'),
  height_cm: yup.number().positive('Height must be positive').required('Height is required').typeError('Height must be a number'),
  weight_kg: yup.number().positive('Weight must be positive').required('Weight is required').typeError('Weight must be a number'),
  bloodPressureSystolic: yup.number().integer('Systolic BP must be an integer').positive('Systolic BP must be positive').required('Systolic BP is required').typeError('Systolic BP must be a number'),
  bloodPressureDiastolic: yup.number().integer('Diastolic BP must be an integer').positive('Diastolic BP must be positive').required('Diastolic BP is required').typeError('Diastolic BP must be a number'),
  heartRate: yup.number().integer('Heart rate must be an integer').positive('Heart rate must be positive').required('Heart rate is required').typeError('Heart rate must be a number'),
  temperature: yup.number().positive('Temperature must be positive').required('Temperature is required').typeError('Temperature must be a number'),
  notes: yup.string(),
  studentCode: yup.string().required('Student is required'),
  conductedByUserName: yup.string().required('Conducted by is required'),
  followUpRequired: yup.boolean(),
  followUpDate: yup.date().nullable().when('followUpRequired', {
    is: true,
    then: (schema) => schema.required('Follow-up date is required').typeError('Invalid date'),
    otherwise: (schema) => schema.nullable(),
  }),
  status: yup.string().required('Status is required'),
});


const HealthCheckups = () => {
  const { successAlert, errorAlert } = useAlert(); // Initialize useAlert hook
  const [checkupDialogOpen, setCheckupDialogOpen] = useState(false);
  const [selectedCheckup, setSelectedCheckup] = useState(null);
  const [checkups, setCheckups] = useState([]);
  const [students, setStudents] = useState([]);
  const [loadingCheckups, setLoadingCheckups] = useState(true);
  const [submittingCheckup, setSubmittingCheckup] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [searchTerm, setSearchTerm] = useState(''); 

  const [filters, setFilters] = useState({
    studentCode: '',
    dateRange: 'today', // e.g., 'today', 'week', 'month', 'all'
    checkupType: '', // This will need to be defined based on available checkup types
    status: '', // e.g., 'completed', 'follow-up-required'
  });

  const checkupForm = useForm({
    resolver: yupResolver(healthCheckupSchema),
    defaultValues: {
      followUpRequired: false,
      checkupDate: new Date().toISOString().split('T')[0], // Default to today
      studentCode: '',
      conductedByUserName: '', // Default to empty
      bloodPressureSystolic: '',
      bloodPressureDiastolic: '',
      heartRate: '',
      temperature: '',
      height_cm: '',
      weight_kg: '',
      notes: '',
      status: 'completed', // Default status
      followUpDate: null,
    }
  });

  const watchHeight = checkupForm.watch('height_cm');
  const watchWeight = checkupForm.watch('weight_kg');

  // Calculate BMI automatically
  useEffect(() => {
    if (watchHeight && watchWeight) {
      const heightInMeters = parseFloat(watchHeight) / 100;
      const weightInKg = parseFloat(watchWeight);
      if (heightInMeters > 0 && weightInKg > 0) {
        const bmi = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
        checkupForm.setValue('bmi', parseFloat(bmi));
      } else {
        checkupForm.setValue('bmi', null);
      }
    } else {
      checkupForm.setValue('bmi', null);
    }
  }, [watchHeight, watchWeight, checkupForm]);

  const fetchCheckups = useCallback(async () => { // Wrapped fetchCheckups with useCallback
    setLoadingCheckups(true);
    const queryParams = new URLSearchParams();

    if (filters.studentCode) {
      queryParams.append('studentCode', filters.studentCode);
    }
    // Assuming checkupType filter will be added to backend, if not, this won't have an effect
    if (filters.checkupType) {
      queryParams.append('checkupType', filters.checkupType);
    }
    if (filters.status) {
      queryParams.append('status', filters.status);
    }

    const today = new Date();
    let startDate, endDate;

    switch (filters.dateRange) {
      case 'today':
        startDate = new Date(today.setHours(0, 0, 0, 0));
        endDate = new Date(new Date().setHours(23, 59, 59, 999)); // Ensure endDate is also based on a fresh Date object for today
        break;
      case 'week':
        const currentDay = today.getDay();
        const firstDayOfWeek = new Date(new Date(today).setDate(today.getDate() - currentDay + (currentDay === 0 ? -6 : 1))); // Adjust for Sunday as first day, ensure today is not mutated
        startDate = new Date(firstDayOfWeek.setHours(0, 0, 0, 0));
        const lastDayOfWeek = new Date(firstDayOfWeek);
        lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
        endDate = new Date(lastDayOfWeek.setHours(23, 59, 59, 999));
        break;
      case 'month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'all':
      default:
        // For 'all' or default, don't send date parameters, or send very broad ones
        // depending on backend implementation. Assuming backend handles nulls appropriately.
        break;
    }

    if (startDate && endDate && filters.dateRange !== 'all') {
      queryParams.append('startDate', startDate.toISOString().split('T')[0]);
      queryParams.append('endDate', endDate.toISOString().split('T')[0]);
    }

    try {
      const response = await getAllHealthCheckupRecords();
      setCheckups(response.data || []); // Fallback to empty array if data is undefined
    } catch (error) {
      console.error('Error fetching checkups:', error);
      setCheckups([]); // Set empty array on error
    } finally {
      setLoadingCheckups(false);
    }
  }, [filters]); // Added filters to useCallback dependency array

  useEffect(() => {
    fetchCheckups();
    fetchStudents();
  }, []);

  useEffect(() => {
    fetchCheckups();
  }, [filters, fetchCheckups]);

  const fetchStudents = async () => {
    try {
      const response = await getAllStudents();
      
      const formattedStudents = (response.data || []).map(s => ({
        studentCode: s.studentCode,
        fullName: s.fullName || 'Unknown Student',
        className: s.className || 'N/A',
        gradeLevel: s.gradeName || 'N/A'
      }));
      
      setStudents(formattedStudents);
      // Debug log
    } catch (error) {
      console.error('Error fetching students:', error);
      // Temporary fallback data to test the feature
      setStudents([
        {
          studentCode: 'STU001',
          fullName: 'Nguyễn Văn A',
          className: 'Class 10A',
          gradeLevel: 'Grade 10'
        },
        {
          studentCode: 'STU002', 
          fullName: 'Trần Thị B',
          className: 'Class 10B',
          gradeLevel: 'Grade 10'
        },
        {
          studentCode: 'STU003',
          fullName: 'Lê Văn C', 
          className: 'Class 9A',
          gradeLevel: 'Grade 9'
        }
      ]);
    }
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Define options for filters
  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'all', label: 'All Time' },
  ];

  // Assuming these are the checkup types your backend might support for filtering
  // Adjust these based on your actual HealthCheckup entity or DTO
  const checkupTypeOptions = [
    { value: '', label: 'All Types' },
    { value: 'ROUTINE', label: 'Routine' }, 
    { value: 'SPECIALIZED', label: 'Specialized' },
    { value: 'FOLLOW_UP', label: 'Follow-up' },
    // Add more types as defined in your backend (e.g., from an enum)
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'SCHEDULED', label: 'Scheduled' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
    { value: 'FOLLOW_UP_REQUIRED', label: 'Follow-up Required' },
    // Add more statuses as defined in your backend (e.g., from an enum)
  ];

  const handleStartCheckup = () => {
    setSelectedCheckup(null);
    
    // Get current user from localStorage or context
    const currentUser = localStorage.getItem('username') || 'nurse.johnson';
    
    checkupForm.reset({
        followUpRequired: false,
        checkupDate: new Date().toISOString().split('T')[0],
        studentCode: '',
        conductedByUserName: currentUser,
        bloodPressureSystolic: '',
        bloodPressureDiastolic: '',
        heartRate: '',
        temperature: '',
        height_cm: '',
        weight_kg: '',
        notes: '',
        status: 'completed',
        followUpDate: null,
    });
    setActiveStep(0);
    setCheckupDialogOpen(true);
  };

  const handleEditCheckup = (checkup) => {
    setSelectedCheckup(checkup);
    checkupForm.reset({
      ...checkup,
      studentCode: checkup.studentCode || '',
      conductedByUserName: checkup.conductedByUserName || '',
      checkupDate: checkup.checkupDate ? new Date(checkup.checkupDate).toISOString().split('T')[0] : null,
      followUpDate: checkup.followUpDate ? new Date(checkup.followUpDate).toISOString().split('T')[0] : null,
      // Ensure all fields from DTO are mapped
      height_cm: checkup.height_cm,
      weight_kg: checkup.weight_kg,
      bloodPressureSystolic: checkup.bloodPressureSystolic,
      bloodPressureDiastolic: checkup.bloodPressureDiastolic,
      heartRate: checkup.heartRate,
      temperature: checkup.temperature,
      notes: checkup.notes,
      status: checkup.status,
    });
    setActiveStep(0);
    setCheckupDialogOpen(true);
  };

  const onCheckupSubmit = async (data) => {
    setSubmittingCheckup(true);
    try {
      // Map form data to backend API format
      const payload = {
        studentId: data.studentCode,  // Map to entity field name
        checkupDate: data.checkupDate,
        height: parseFloat(data.height_cm),  // Map to entity field name
        weight: parseFloat(data.weight_kg),  // Map to entity field name
        bloodPressureSystolic: parseInt(data.bloodPressureSystolic),
        bloodPressureDiastolic: parseInt(data.bloodPressureDiastolic),
        heartRate: parseInt(data.heartRate),
        temperature: parseFloat(data.temperature),  // Map to entity field name
        conductedBy: data.conductedByUserName,  // Map to entity field name
        healthNotes: data.notes || '',  // Map to entity field name
        requiresFollowUp: data.followUpRequired || false,  // Map to entity field name
        followUpDate: data.followUpRequired && data.followUpDate ? data.followUpDate : null,
        // Add default values for fields that might be required by backend
        visionLeft: 'Normal',
        visionRight: 'Normal', 
        hearingLeft: 'Normal',
        hearingRight: 'Normal',
        generalHealthStatus: 'Normal'  // Map to entity field name
      };

      if (selectedCheckup) {
        // Update existing checkup
        await updateHealthCheckupRecord(selectedCheckup.id, payload);
        successAlert('Health checkup updated successfully!');
      } else {
        // Create new checkup
        await createHealthCheckupRecord(payload);
        successAlert('Health checkup completed and saved successfully!');
      }
      setCheckupDialogOpen(false);
      fetchCheckups(); // Refresh the list
    } catch (error) {
      console.error('Error saving checkup:', error.response?.data || error.message);
      errorAlert(`Error saving health checkup: ${error.response?.data?.message || error.message}`);
    } finally {
      setSubmittingCheckup(false);
    }
  };

  // The existing filteredCheckups logic will be removed or modified as filtering is now server-side.
  // For now, let's comment it out to avoid conflicts. We will use the `checkups` state directly from the API.

  /*
  const filteredCheckups = checkups.filter(checkup => {
    const student = students.find(s => s.studentCode === checkup.studentCode);
    const studentName = student ? student.fullName : (checkup.studentName || 'Unknown Student');
    const studentGrade = student ? student.className : 'N/A';

    const matchesSearch = studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (checkup.conductedByUserName && checkup.conductedByUserName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (checkup.status && checkup.status.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = filterType === 'all' || (checkup.status && checkup.status.toLowerCase().includes(filterType.toLowerCase()));
    const matchesGrade = filterGrade === 'all' || (studentGrade && studentGrade.toLowerCase().startsWith(filterGrade.toLowerCase()));
    return matchesSearch && matchesType && matchesGrade;
  });
  */

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'follow-up-required': return 'warning';
      case 'active': return 'primary';
      case 'planned': return 'info';
      default: return 'default';
    }
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'warning' };
    if (bmi < 25) return { category: 'Normal', color: 'success' };
    if (bmi < 30) return { category: 'Overweight', color: 'warning' };
    return { category: 'Obese', color: 'error' };
  };

  const checkupSteps = [
    'Student & Basic Info',
    'Measurements & Results'
  ];

  // Inside the return JSX, before the Tabs component:
  return (
    <div className="p-6">
      <PageHeader title="Student Health Checkup" icon={<HealthIcon fontSize="large" />} />
      
      {/* Simplified interface for conducting health checkups */}
      <Card>
        <CardHeader
          title="Conduct Health Examination"
          action={
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleStartCheckup}>
              Start Health Checkup
            </Button>
          }
        />
        <CardContent>
            {loadingCheckups ? (
              <Typography>Loading checkups...</Typography>
            ) : (
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Student</TableCell>
                      <TableCell>Class</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Conducted By</TableCell>
                      <TableCell>Height (cm)</TableCell>
                      <TableCell>Weight (kg)</TableCell>
                      <TableCell>BMI</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {checkups.length > 0 ? checkups.map((checkup) => {
                      const student = students.find(s => s.studentCode === checkup.studentCode);
                      const bmiValue = checkup.height_cm && checkup.weight_kg ? (checkup.weight_kg / ((checkup.height_cm / 100) ** 2)).toFixed(1) : 'N/A';
                      const bmiCategory = bmiValue !== 'N/A' ? getBMICategory(parseFloat(bmiValue)) : { category: 'N/A', color: 'default' };
                      return (
                        <TableRow hover key={checkup.id}>
                          <TableCell>{student ? student.fullName : checkup.studentName || 'Unknown'}</TableCell>
                          <TableCell>{student ? student.className : 'N/A'}</TableCell>
                          <TableCell>{new Date(checkup.checkupDate).toLocaleDateString()}</TableCell>
                          <TableCell>{checkup.conductedByUserName}</TableCell>
                          <TableCell>{checkup.height_cm}</TableCell>
                          <TableCell>{checkup.weight_kg}</TableCell>
                          <TableCell>
                            {bmiValue} {bmiValue !== 'N/A' && <Chip label={bmiCategory.category} color={bmiCategory.color} size="small" />}
                          </TableCell>
                          <TableCell>
                            <Chip label={checkup.status} color={getStatusColor(checkup.status)} size="small" />
                          </TableCell>
                          <TableCell>
                            <IconButton onClick={() => handleEditCheckup(checkup)} color="primary">
                              <EditIcon />
                            </IconButton>
                            {/* Add delete functionality if needed */}
                            {/* <IconButton onClick={() => handleDeleteCheckup(checkup.id)} color="error">
                              <DeleteIcon />
                            </IconButton> */}
                          </TableCell>
                        </TableRow>
                      );
                    }) : (
                      <TableRow>
                        <TableCell colSpan={9} align="center">
                          No health checkups found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>

      {/* Checkup Dialog with Stepper */}
      <Dialog open={checkupDialogOpen} onClose={() => setCheckupDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          {(() => {
            const selectedStudentCode = checkupForm.watch('studentCode');
            const selectedStudent = students.find(s => s.studentCode === selectedStudentCode);
            const studentName = selectedStudent ? selectedStudent.fullName : '';
            const baseTitle = selectedCheckup ? 'Edit Health Checkup' : 'Conduct Health Checkup';
            return studentName ? `${baseTitle} - ${studentName}` : baseTitle;
          })()}
        </DialogTitle>
        <form onSubmit={checkupForm.handleSubmit(onCheckupSubmit)}>
          <DialogContent>
            <Stepper activeStep={activeStep} orientation="vertical">
              {checkupSteps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                  <StepContent>
                    {index === 0 && (
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Controller
                            name="studentCode"
                            control={checkupForm.control}
                            render={({ field }) => (
                              <FormControl fullWidth required error={!!checkupForm.formState.errors.studentCode}>
                                <InputLabel>Select Student</InputLabel>
                                <Select {...field} label="Select Student">
                                  <MenuItem value="">
                                    <em>Choose a student...</em>
                                  </MenuItem>
                                  {students.map((student) => (
                                    <MenuItem key={student.studentCode} value={student.studentCode}>
                                      {student.fullName} - {student.className}
                                    </MenuItem>
                                  ))}
                                </Select>
                                {checkupForm.formState.errors.studentCode && (
                                  <Typography color="error" variant="caption">
                                    {checkupForm.formState.errors.studentCode.message}
                                  </Typography>
                                )}
                              </FormControl>
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Controller
                            name="checkupDate"
                            control={checkupForm.control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Checkup Date"
                                type="date"
                                fullWidth
                                required
                                InputLabelProps={{ shrink: true }}
                                error={!!checkupForm.formState.errors.checkupDate}
                                helperText={checkupForm.formState.errors.checkupDate?.message}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Controller
                            name="conductedByUserName"
                            control={checkupForm.control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Conducted By"
                                fullWidth
                                required
                                error={!!checkupForm.formState.errors.conductedByUserName}
                                helperText={checkupForm.formState.errors.conductedByUserName?.message}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Controller
                            name="status"
                            control={checkupForm.control}
                            render={({ field }) => (
                              <FormControl fullWidth required>
                                <InputLabel>Status</InputLabel>
                                <Select {...field} label="Status">
                                  <MenuItem value="completed">Completed</MenuItem>
                                  <MenuItem value="follow_up_needed">Follow-up Needed</MenuItem>
                                  <MenuItem value="cancelled">Cancelled</MenuItem>
                                </Select>
                              </FormControl>
                            )}
                          />
                        </Grid>
                      </Grid>
                    )}
                    {index === 1 && (
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                          <Controller
                            name="height_cm"
                            control={checkupForm.control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Height (cm)"
                                type="number"
                                fullWidth
                                required
                                error={!!checkupForm.formState.errors.height_cm}
                                helperText={checkupForm.formState.errors.height_cm?.message}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Controller
                            name="weight_kg"
                            control={checkupForm.control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Weight (kg)"
                                type="number"
                                fullWidth
                                required
                                error={!!checkupForm.formState.errors.weight_kg}
                                helperText={checkupForm.formState.errors.weight_kg?.message}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            label="BMI (calculated)"
                            value={checkupForm.getValues('bmi') ? checkupForm.getValues('bmi').toFixed(1) : '-'}
                            fullWidth
                            InputProps={{ readOnly: true }}
                            variant="filled"
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Controller
                            name="bloodPressureSystolic"
                            control={checkupForm.control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Blood Pressure - Systolic"
                                type="number"
                                fullWidth
                                required
                                error={!!checkupForm.formState.errors.bloodPressureSystolic}
                                helperText={checkupForm.formState.errors.bloodPressureSystolic?.message}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Controller
                            name="bloodPressureDiastolic"
                            control={checkupForm.control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Blood Pressure - Diastolic"
                                type="number"
                                fullWidth
                                required
                                error={!!checkupForm.formState.errors.bloodPressureDiastolic}
                                helperText={checkupForm.formState.errors.bloodPressureDiastolic?.message}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Controller
                            name="heartRate"
                            control={checkupForm.control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Heart Rate (bpm)"
                                type="number"
                                fullWidth
                                required
                                error={!!checkupForm.formState.errors.heartRate}
                                helperText={checkupForm.formState.errors.heartRate?.message}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Controller
                            name="temperature"
                            control={checkupForm.control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Temperature (°C)"
                                type="number"
                                fullWidth
                                required
                                step="0.1"
                                error={!!checkupForm.formState.errors.temperature}
                                helperText={checkupForm.formState.errors.temperature?.message}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Controller
                            name="followUpRequired"
                            control={checkupForm.control}
                            render={({ field }) => (
                              <FormControlLabel
                                control={<Checkbox {...field} checked={field.value} />}
                                label="Follow-up Required"
                              />
                            )}
                          />
                        </Grid>
                        {checkupForm.watch('followUpRequired') && (
                          <Grid item xs={12} md={6}>
                            <Controller
                              name="followUpDate"
                              control={checkupForm.control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label="Follow-up Date"
                                  type="date"
                                  fullWidth
                                  InputLabelProps={{ shrink: true }}
                                  error={!!checkupForm.formState.errors.followUpDate}
                                  helperText={checkupForm.formState.errors.followUpDate?.message}
                                />
                              )}
                            />
                          </Grid>
                        )}
                        <Grid item xs={12}>
                          <Controller
                            name="notes"
                            control={checkupForm.control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Medical Notes & Observations"
                                multiline
                                rows={3}
                                fullWidth
                                placeholder="Enter any additional observations, recommendations, or concerns..."
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                    )}
                    <Box sx={{ mt: 2, mb: 1 }}>
                      <div>
                        <Button
                          variant="contained"
                          onClick={() => setActiveStep(activeStep + 1)}
                          sx={{ mt: 1, mr: 1 }}
                          disabled={index === checkupSteps.length - 1}
                        >
                          {index === checkupSteps.length - 1 ? 'Finish' : 'Continue'}
                        </Button>
                        <Button
                          disabled={index === 0}
                          onClick={() => setActiveStep(activeStep - 1)}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          Back
                        </Button>
                      </div>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCheckupDialogOpen(false)}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={submittingCheckup}
            >
              {submittingCheckup ? 'Saving...' : (selectedCheckup ? 'Update Checkup' : 'Save Checkup')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default HealthCheckups;