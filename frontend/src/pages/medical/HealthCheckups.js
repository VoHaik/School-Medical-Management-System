import React, { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios'; // Import axios
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
  Tab,
  Tabs,
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
  Schedule as ScheduleIcon,
  BarChart as BarChartIcon,
  LocalHospital as HealthIcon // Added HealthIcon import
} from '@mui/icons-material';
import PageHeader from '../../components/PageHeader';

const healthCheckupSchema = yup.object().shape({
  checkupDate: yup.date().required('Checkup date is required').typeError('Invalid date'),
  height_cm: yup.number().positive('Height must be positive').required('Height is required').typeError('Height must be a number'),
  weight_kg: yup.number().positive('Weight must be positive').required('Weight is required').typeError('Weight must be a number'),
  visionLeft: yup.string().required('Vision (Left) is required'),
  visionRight: yup.string().required('Vision (Right) is required'),
  hearingLeft: yup.string().required('Hearing (Left) is required'),
  hearingRight: yup.string().required('Hearing (Right) is required'),
  bloodPressureSystolic: yup.number().integer('Systolic BP must be an integer').positive('Systolic BP must be positive').required('Systolic BP is required').typeError('Systolic BP must be a number'),
  bloodPressureDiastolic: yup.number().integer('Diastolic BP must be an integer').positive('Diastolic BP must be positive').required('Diastolic BP is required').typeError('Diastolic BP must be a number'),
  heartRate: yup.number().integer('Heart rate must be an integer').positive('Heart rate must be positive').required('Heart rate is required').typeError('Heart rate must be a number'),
  temperature: yup.number().positive('Temperature must be positive').required('Temperature is required').typeError('Temperature must be a number'),
  notes: yup.string(),
  studentCode: yup.string().required('Student is required'),
  conductedByUserName: yup.string().required('Conducted by is required'), // Changed from conductedBy to conductedByUserName
  consentStatus: yup.string().required('Consent status is required'), // Added
  followUpRequired: yup.boolean(),
  followUpDate: yup.date().nullable().when('followUpRequired', {
    is: true,
    then: (schema) => schema.required('Follow-up date is required').typeError('Invalid date'),
    otherwise: (schema) => schema.nullable(), // Ensure it's nullable when not required
  }),
  status: yup.string().required('Status is required'),
});

const screeningProgramSchema = yup.object().shape({
  programName: yup.string().required('Program name is required'),
  screeningType: yup.string().required('Screening type is required'),
  targetGrades: yup.array().of(yup.string()).min(1, 'At least one grade must be selected'),
  startDate: yup.date().required('Start date is required'),
  endDate: yup.date().required('End date is required'),
  provider: yup.string().required('Healthcare provider is required'),
  description: yup.string()
});

function HealthCheckups() {
  const [activeTab, setActiveTab] = useState(0);
  const [checkupDialogOpen, setCheckupDialogOpen] = useState(false);
  const [programDialogOpen, setProgramDialogOpen] = useState(false);
  const [selectedCheckup, setSelectedCheckup] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [checkups, setCheckups] = useState([]);
  const [programs, setPrograms] = useState([]);
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
      visionLeft: '',
      visionRight: '',
      hearingLeft: '',
      hearingRight: '',
      bloodPressureSystolic: '',
      bloodPressureDiastolic: '',
      heartRate: '',
      temperature: '',
      height_cm: '',
      weight_kg: '',
      notes: '',
      status: 'completed', // Default status
      consentStatus: 'pending', // Default consent status
      followUpDate: null,
    }
  });

  const programForm = useForm({
    resolver: yupResolver(screeningProgramSchema),
    defaultValues: {
      targetGrades: []
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
    const token = localStorage.getItem('token');
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
      const response = await axios.get(`/api/health-checkups?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCheckups(response.data);
    } catch (error) {
      console.error('Error fetching checkups:', error);
    } finally {
      setLoadingCheckups(false);
    }
  }, [filters]); // Added filters to useCallback dependency array

  useEffect(() => {
    // fetchCheckups(); // Will be called by filter change effect
    fetchPrograms();
    fetchStudents();
  }, []); // Initial data fetch for programs and students

  useEffect(() => {
    fetchCheckups();
  }, [filters, fetchCheckups]); // Added fetchCheckups to dependency array

  const fetchPrograms = async () => {
    try {
      // Mock data - replace with actual API call
      setPrograms([
        {
          id: '1',
          programName: 'Annual Health Screening 2024',
          screeningType: 'Comprehensive',
          targetGrades: ['9', '10', '11', '12'],
          startDate: '2024-03-01',
          endDate: '2024-03-31',
          provider: 'School Health Services',
          description: 'Comprehensive annual health screening including physical, vision, and hearing tests',
          status: 'planned',
          totalStudents: 600,
          completedStudents: 0
        },
        {
          id: '2',
          programName: 'Vision Screening Program',
          screeningType: 'Vision',
          targetGrades: ['9', '10'],
          startDate: '2024-01-15',
          endDate: '2024-01-31',
          provider: 'Eye Care Center',
          description: 'Annual vision screening for grades 9-10',
          status: 'active',
          totalStudents: 300,
          completedStudents: 180
        }
      ]);
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/students', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const formattedStudents = response.data.map(s => ({
        studentCode: s.studentCode,
        fullName: `${s.firstName} ${s.lastName}`,
        className: s.schoolClass ? s.schoolClass.className : 'N/A',
      }));
      setStudents(formattedStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
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

  const handleAddCheckup = () => {
    setSelectedCheckup(null);
    checkupForm.reset({ // Reset with default values including dates
        followUpRequired: false,
        checkupDate: new Date().toISOString().split('T')[0],
        studentCode: '',
        conductedByUserName: '',
        visionLeft: '',
        visionRight: '',
        hearingLeft: '',
        hearingRight: '',
        bloodPressureSystolic: '',
        bloodPressureDiastolic: '',
        heartRate: '',
        temperature: '',
        height_cm: '',
        weight_kg: '',
        notes: '',
        status: 'completed',
        consentStatus: 'pending',
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
      visionLeft: checkup.visionLeft,
      visionRight: checkup.visionRight,
      hearingLeft: checkup.hearingLeft,
      hearingRight: checkup.hearingRight,
      bloodPressureSystolic: checkup.bloodPressureSystolic,
      bloodPressureDiastolic: checkup.bloodPressureDiastolic,
      heartRate: checkup.heartRate,
      temperature: checkup.temperature,
      notes: checkup.notes,
      status: checkup.status,
      consentStatus: checkup.consentStatus,
    });
    setActiveStep(0);
    setCheckupDialogOpen(true);
  };

  const handleEditProgram = (program) => {
    setSelectedProgram(program);
    programForm.reset(program);
    setProgramDialogOpen(true);
  };

  const onCheckupSubmit = async (data) => {
    setSubmittingCheckup(true);
    try {
      const token = localStorage.getItem('token');
      const payload = { ...data };
      // Ensure dates are in YYYY-MM-DD format if necessary, or let backend handle ISO string
      if (payload.checkupDate) payload.checkupDate = new Date(payload.checkupDate).toISOString();
      if (payload.followUpDate) payload.followUpDate = new Date(payload.followUpDate).toISOString();
      else payload.followUpDate = null; // Ensure it's null if not provided

      if (selectedCheckup) {
        // Update existing checkup
        await axios.put(`/api/health-checkups/${selectedCheckup.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // TODO: Add success notification (e.g., using a snackbar)
        alert('Health checkup updated successfully!');
      } else {
        // Create new checkup
        await axios.post('/api/health-checkups', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // TODO: Add success notification
        alert('Health checkup created successfully!');
      }
      setCheckupDialogOpen(false);
      fetchCheckups(); // Refresh the list
    } catch (error) {
      console.error('Error saving checkup:', error.response?.data || error.message);
      // TODO: Add user-friendly error notification
      alert(`Error saving health checkup: ${error.response?.data?.message || error.message}`);
    } finally {
      setSubmittingCheckup(false);
    }
  };

  const onProgramSubmit = async (data) => {
    try {
      if (selectedProgram) {
        console.log('Updating program:', data);
      } else {
        console.log('Adding program:', data);
      }
      setProgramDialogOpen(false);
      fetchPrograms();
    } catch (error) {
      console.error('Error saving program:', error);
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

  const filteredPrograms = programs.filter(program =>
    program.programName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.screeningType.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    'Basic Information',
    'Physical Measurements',
    'Vital Signs',
    'Sensory Tests',
    'Findings & Recommendations'
  ];

  // Inside the return JSX, before the Tabs component:
  return (
    <div className="p-6">
      <PageHeader title="Health Checkups Management" icon={<HealthIcon fontSize="large" />} />
      
      {/* Filter Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Filters</Typography>
          <Grid container spacing={2} alignItems="center"> {/* Added alignItems for better layout with search */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Search Checkups..."
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Using setSearchTerm
                sx={{ mr: 2 }} // Added margin for spacing
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Student</InputLabel>
                <Select
                  name="studentCode"
                  value={filters.studentCode}
                  onChange={handleFilterChange}
                  label="Student"
                >
                  <MenuItem value=""><em>All Students</em></MenuItem>
                  {students.map((student) => (
                    <MenuItem key={student.studentCode} value={student.studentCode}>
                      {student.fullName} ({student.className})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Date Range</InputLabel>
                <Select
                  name="dateRange"
                  value={filters.dateRange}
                  onChange={handleFilterChange}
                  label="Date Range"
                >
                  {dateRangeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Checkup Type</InputLabel>
                <Select
                  name="checkupType"
                  value={filters.checkupType}
                  onChange={handleFilterChange}
                  label="Checkup Type"
                >
                  {checkupTypeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  label="Status"
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onChange={(event, newValue) => setActiveTab(newValue)} indicatorColor="primary" textColor="primary" sx={{ mb: 2 }}>
        <Tab label="Health Checkups" />
        <Tab label="Screening Programs" />
        <Tab label="Analytics & Reports" />
      </Tabs>

      {activeTab === 0 && (
        <Card>
          <CardHeader
            title="Scheduled & Recorded Checkups"
            action={
              <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddCheckup}>
                Add New Checkup
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
      )}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          {filteredPrograms.map((program) => (
            <Grid item xs={12} md={6} lg={4} key={program.id}>
              <Card>
                <CardHeader
                  title={program.programName}
                  subheader={`${program.screeningType} - Grades ${program.targetGrades.join(', ')}`}
                  action={
                    <Chip
                      label={program.status}
                      color={getStatusColor(program.status)}
                      size="small"
                    />
                  }
                />
                <CardContent>
                  <Typography variant="body2" color="textSecondary" className="mb-2">
                    {program.description}
                  </Typography>
                  <Typography variant="body2" className="mb-2">
                    <strong>Period:</strong> {new Date(program.startDate).toLocaleDateString()} - {new Date(program.endDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" className="mb-2">
                    <strong>Provider:</strong> {program.provider}
                  </Typography>
                  <Typography variant="body2" className="mb-2">
                    <strong>Progress:</strong> {program.completedStudents}/{program.totalStudents} students
                  </Typography>
                  <Box className="flex gap-2 mt-3">
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleEditProgram(program)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      startIcon={<ScheduleIcon />}
                      color="primary"
                    >
                      Schedule
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      {activeTab === 2 && (
        <div className="text-center py-8">
          <BarChartIcon className="text-6xl text-gray-400 mb-4" />
          <Typography variant="h6" color="textSecondary">
            Health Analytics
          </Typography>
          <Typography color="textSecondary" className="mb-4">
            View comprehensive analytics on student health trends, screening results, and program effectiveness.
          </Typography>
          <Button variant="outlined" startIcon={<BarChartIcon />}>
            View Analytics
          </Button>
        </div>
      )}

      {/* Checkup Dialog with Stepper */}
      <Dialog open={checkupDialogOpen} onClose={() => setCheckupDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          {selectedCheckup ? 'Edit Health Checkup' : 'Add New Health Checkup'}
        </DialogTitle>
        <form onSubmit={checkupForm.handleSubmit(onCheckupSubmit)}>
          <DialogContent>
            <Stepper activeStep={activeStep} orientation="vertical">
              {checkupSteps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                  <StepContent>
                    {index === 0 && (
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Controller
                            name="studentCode"
                            control={checkupForm.control}
                            render={({ field }) => (
                              <FormControl fullWidth error={!!checkupForm.formState.errors.studentCode}>
                                <InputLabel>Student *</InputLabel>
                                <Select {...field} label="Student">
                                  <MenuItem value=""><em>Select Student</em></MenuItem>
                                  {students.map((student) => (
                                    <MenuItem key={student.studentCode} value={student.studentCode}>
                                      {student.fullName} ({student.studentCode}) - {student.className}
                                    </MenuItem>
                                  ))}
                                </Select>
                                {checkupForm.formState.errors.studentCode && <Typography color="error" variant="caption">{checkupForm.formState.errors.studentCode.message}</Typography>}
                            </FormControl>
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Controller
                            name="checkupDate"
                            control={checkupForm.control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Checkup Date *"
                                type="date"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                error={!!checkupForm.formState.errors.checkupDate}
                                helperText={checkupForm.formState.errors.checkupDate?.message}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Controller
                            name="conductedByUserName"
                            control={checkupForm.control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Conducted By (Username) *"
                                fullWidth
                                error={!!checkupForm.formState.errors.conductedByUserName}
                                helperText={checkupForm.formState.errors.conductedByUserName?.message}
                              />
                            )}
                          />
                        </Grid>
                         <Grid item xs={12} sm={6}>
                        <Controller
                          name="status"
                          control={checkupForm.control}
                          render={({ field }) => (
                            <FormControl fullWidth error={!!checkupForm.formState.errors.status}>
                              <InputLabel>Status *</InputLabel>
                              <Select {...field} label="Status">
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="in_progress">In Progress</MenuItem>
                                <MenuItem value="completed">Completed</MenuItem>
                                <MenuItem value="cancelled">Cancelled</MenuItem>
                                <MenuItem value="follow_up_needed">Follow-up Needed</MenuItem>
                              </Select>
                              {checkupForm.formState.errors.status && <Typography color="error" variant="caption">{checkupForm.formState.errors.status.message}</Typography>}
                            </FormControl>
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Controller
                          name="consentStatus"
                          control={checkupForm.control}
                          render={({ field }) => (
                             <FormControl fullWidth error={!!checkupForm.formState.errors.consentStatus}>
                              <InputLabel>Consent Status *</InputLabel>
                              <Select {...field} label="Consent Status">
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="given">Given</MenuItem>
                                <MenuItem value="refused">Refused</MenuItem>
                                <MenuItem value="not_required">Not Required</MenuItem>
                              </Select>
                              {checkupForm.formState.errors.consentStatus && <Typography color="error" variant="caption">{checkupForm.formState.errors.consentStatus.message}</Typography>}
                            </FormControl>
                          )}
                        />
                      </Grid>
                    </Grid>
                  )}
                  {activeStep === 1 && ( // Physical Measurements
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <Controller
                          name="height_cm"
                          control={checkupForm.control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Height (cm) *"
                              type="number"
                              fullWidth
                              error={!!checkupForm.formState.errors.height_cm}
                              helperText={checkupForm.formState.errors.height_cm?.message}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Controller
                          name="weight_kg"
                          control={checkupForm.control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Weight (kg) *"
                              type="number"
                              fullWidth
                              error={!!checkupForm.formState.errors.weight_kg}
                              helperText={checkupForm.formState.errors.weight_kg?.message}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          label="BMI"
                          value={checkupForm.getValues('bmi') || '-'}
                          fullWidth
                          InputProps={{ readOnly: true }}
                        />
                      </Grid>
                    </Grid>
                  )}
                  {activeStep === 2 && ( // Vital Signs
                     <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Controller
                            name="bloodPressureSystolic"
                            control={checkupForm.control}
                            render={({ field }) => (
                                <TextField
                                {...field}
                                label="BP Systolic (mmHg) *"
                                type="number"
                                fullWidth
                                error={!!checkupForm.formState.errors.bloodPressureSystolic}
                                helperText={checkupForm.formState.errors.bloodPressureSystolic?.message}
                                />
                            )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Controller
                            name="bloodPressureDiastolic"
                            control={checkupForm.control}
                            render={({ field }) => (
                                <TextField
                                {...field}
                                label="BP Diastolic (mmHg) *"
                                type="number"
                                fullWidth
                                error={!!checkupForm.formState.errors.bloodPressureDiastolic}
                                helperText={checkupForm.formState.errors.bloodPressureDiastolic?.message}
                                />
                            )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Controller
                            name="heartRate"
                            control={checkupForm.control}
                            render={({ field }) => (
                                <TextField
                                {...field}
                                label="Heart Rate (bpm) *"
                                type="number"
                                fullWidth
                                error={!!checkupForm.formState.errors.heartRate}
                                helperText={checkupForm.formState.errors.heartRate?.message}
                                />
                            )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Controller
                            name="temperature"
                            control={checkupForm.control}
                            render={({ field }) => (
                                <TextField
                                {...field}
                                label="Temperature (°C) *"
                                type="number"
                                fullWidth
                                InputProps={{ inputProps: { step: 0.1 } }}
                                error={!!checkupForm.formState.errors.temperature}
                                helperText={checkupForm.formState.errors.temperature?.message}
                                />
                            )}
                            />
                        </Grid>
                    </Grid>
                  )}
                  {activeStep === 3 && ( // Sensory Tests
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Controller
                            name="visionLeft"
                            control={checkupForm.control}
                            render={({ field }) => (
                                <TextField
                                {...field}
                                label="Vision (Left Eye) *"
                                fullWidth
                                error={!!checkupForm.formState.errors.visionLeft}
                                helperText={checkupForm.formState.errors.visionLeft?.message}
                                placeholder="e.g., 20/20"
                                />
                            )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller
                            name="visionRight"
                            control={checkupForm.control}
                            render={({ field }) => (
                                <TextField
                                {...field}
                                label="Vision (Right Eye) *"
                                fullWidth
                                error={!!checkupForm.formState.errors.visionRight}
                                helperText={checkupForm.formState.errors.visionRight?.message}
                                placeholder="e.g., 20/20"
                                />
                            )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller
                            name="hearingLeft"
                            control={checkupForm.control}
                            render={({ field }) => (
                                <TextField
                                {...field}
                                label="Hearing (Left Ear) *"
                                fullWidth
                                error={!!checkupForm.formState.errors.hearingLeft}
                                helperText={checkupForm.formState.errors.hearingLeft?.message}
                                placeholder="e.g., Normal, Mild Loss"
                                />
                            )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller
                            name="hearingRight"
                            control={checkupForm.control}
                            render={({ field }) => (
                                <TextField
                                {...field}
                                label="Hearing (Right Ear) *"
                                fullWidth
                                error={!!checkupForm.formState.errors.hearingRight}
                                helperText={checkupForm.formState.errors.hearingRight?.message}
                                placeholder="e.g., Normal, Mild Loss"
                                />
                            )}
                            />
                        </Grid>
                    </Grid>
                  )}
                  {activeStep === 4 && ( // Findings & Recommendations
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Controller
                                name="notes"
                                control={checkupForm.control}
                                render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Notes / Overall Assessment"
                                    multiline
                                    rows={4}
                                    fullWidth
                                    error={!!checkupForm.formState.errors.notes}
                                    helperText={checkupForm.formState.errors.notes?.message}
                                />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="followUpRequired"
                                control={checkupForm.control}
                                render={({ field }) => (
                                <FormControlLabel
                                    control={<Checkbox {...field} checked={field.value} />}
                                    label="Follow-up Required?"
                                />
                                )}
                            />
                        </Grid>
                        {checkupForm.watch('followUpRequired') && (
                            <Grid item xs={12} sm={6}>
                                <Controller
                                name="followUpDate"
                                control={checkupForm.control}
                                render={({ field }) => (
                                    <TextField
                                    {...field}
                                    label="Follow-up Date *"
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
                    </Grid>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                    <Button
                      disabled={activeStep === 0}
                      onClick={() => setActiveStep(activeStep - 1)}
                      className="mr-2"
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => setActiveStep(activeStep + 1)}
                      disabled={activeStep === checkupSteps.length - 1}
                    >
                      Next
                    </Button>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={submittingCheckup || activeStep !== checkupSteps.length - 1}
                    >
                      {submittingCheckup ? 'Saving...' : selectedCheckup ? 'Update Checkup' : 'Save Checkup'}
                    </Button>
                  </Box>
                </StepContent>
                </Step>
              ))}
            </Stepper>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCheckupDialogOpen(false)}>Cancel</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Program Dialog */}
      <Dialog open={programDialogOpen} onClose={() => setProgramDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedProgram ? 'Edit Screening Program' : 'Add New Screening Program'}
        </DialogTitle>
        <form onSubmit={programForm.handleSubmit(onProgramSubmit)}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Program Name"
                  {...programForm.register('programName')}
                  error={!!programForm.formState.errors.programName}
                  helperText={programForm.formState.errors.programName?.message}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Screening Type</InputLabel>
                  <Select
                    {...programForm.register('screeningType')}
                    error={!!programForm.formState.errors.screeningType}
                  >
                    <MenuItem value="Comprehensive">Comprehensive</MenuItem>
                    <MenuItem value="Vision">Vision</MenuItem>
                    <MenuItem value="Hearing">Hearing</MenuItem>
                    <MenuItem value="Dental">Dental</MenuItem>
                    <MenuItem value="Sports Physical">Sports Physical</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  multiple
                  options={['9', '10', '11', '12']}
                  getOptionLabel={(option) => `Grade ${option}`}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Target Grades"
                      error={!!programForm.formState.errors.targetGrades}
                      helperText={programForm.formState.errors.targetGrades?.message}
                    />
                  )}
                  onChange={(event, value) => {
                    programForm.setValue('targetGrades', value);
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setProgramDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              {selectedProgram ? 'Update' : 'Create'} Program
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default HealthCheckups;