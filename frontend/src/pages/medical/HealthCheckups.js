import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
  Autocomplete,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormLabel,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  LocalHospital as HealthIcon,
  Visibility as VisionIcon,
  Hearing as HearingIcon,
  FitnessCenter as FitnessIcon,
  Psychology as PsychologyIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  Group as GroupIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  BarChart as BarChartIcon
} from '@mui/icons-material';
import PageHeader from '../../components/PageHeader';

const checkupSchema = yup.object().shape({
  studentId: yup.string().required('Student is required'),
  checkupType: yup.string().required('Checkup type is required'),
  checkupDate: yup.date().required('Checkup date is required'),
  conductedBy: yup.string().required('Conducted by is required'),
  height: yup.number().min(0, 'Height must be positive'),
  weight: yup.number().min(0, 'Weight must be positive'),
  bmi: yup.number(),
  bloodPressure: yup.string(),
  heartRate: yup.number().min(0, 'Heart rate must be positive'),
  temperature: yup.number().min(35, 'Temperature seems too low').max(42, 'Temperature seems too high'),
  visionLeft: yup.string(),
  visionRight: yup.string(),
  hearingLeft: yup.string(),
  hearingRight: yup.string(),
  oralHealth: yup.string(),
  skinCondition: yup.string(),
  respiratoryHealth: yup.string(),
  findings: yup.array().of(yup.string()),
  recommendations: yup.array().of(yup.string()),
  followUpRequired: yup.boolean(),
  followUpDate: yup.date(),
  notes: yup.string()
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterGrade, setFilterGrade] = useState('all');
  const [activeStep, setActiveStep] = useState(0);

  const checkupForm = useForm({
    resolver: yupResolver(checkupSchema),
    defaultValues: {
      findings: [],
      recommendations: [],
      followUpRequired: false
    }
  });

  const programForm = useForm({
    resolver: yupResolver(screeningProgramSchema),
    defaultValues: {
      targetGrades: []
    }
  });

  const { fields: findingFields, append: appendFinding, remove: removeFinding } = useFieldArray({
    control: checkupForm.control,
    name: 'findings'
  });

  const { fields: recommendationFields, append: appendRecommendation, remove: removeRecommendation } = useFieldArray({
    control: checkupForm.control,
    name: 'recommendations'
  });

  const watchHeight = checkupForm.watch('height');
  const watchWeight = checkupForm.watch('weight');

  // Calculate BMI automatically
  useEffect(() => {
    if (watchHeight && watchWeight) {
      const bmi = (watchWeight / ((watchHeight / 100) * (watchHeight / 100))).toFixed(1);
      checkupForm.setValue('bmi', parseFloat(bmi));
    }
  }, [watchHeight, watchWeight, checkupForm]);

  useEffect(() => {
    fetchCheckups();
    fetchPrograms();
    fetchStudents();
  }, []);

  const fetchCheckups = async () => {
    try {
      // Mock data - replace with actual API call
      setCheckups([
        {
          id: '1',
          studentId: 'S001',
          studentName: 'John Doe',
          grade: '10A',
          checkupType: 'Annual Physical',
          checkupDate: '2024-01-15',
          conductedBy: 'Dr. Smith',
          height: 165,
          weight: 55,
          bmi: 20.2,
          bloodPressure: '120/80',
          heartRate: 72,
          temperature: 36.5,
          visionLeft: '20/20',
          visionRight: '20/20',
          hearingLeft: 'Normal',
          hearingRight: 'Normal',
          oralHealth: 'Good',
          skinCondition: 'Normal',
          respiratoryHealth: 'Normal',
          findings: ['Good overall health'],
          recommendations: ['Continue regular exercise'],
          followUpRequired: false,
          status: 'completed'
        },
        {
          id: '2',
          studentId: 'S002',
          studentName: 'Jane Smith',
          grade: '9B',
          checkupType: 'Vision Screening',
          checkupDate: '2024-01-10',
          conductedBy: 'Nurse Johnson',
          visionLeft: '20/30',
          visionRight: '20/25',
          findings: ['Mild myopia in left eye'],
          recommendations: ['Refer to optometrist'],
          followUpRequired: true,
          followUpDate: '2024-02-10',
          status: 'follow-up-required'
        }
      ]);
    } catch (error) {
      console.error('Error fetching checkups:', error);
    }
  };

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
      // Mock data - replace with actual API call
      setStudents([
        { id: 'S001', name: 'John Doe', grade: '10A', dateOfBirth: '2008-05-15' },
        { id: 'S002', name: 'Jane Smith', grade: '9B', dateOfBirth: '2009-03-20' }
      ]);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleAddCheckup = () => {
    setSelectedCheckup(null);
    checkupForm.reset();
    setActiveStep(0);
    setCheckupDialogOpen(true);
  };

  const handleEditCheckup = (checkup) => {
    setSelectedCheckup(checkup);
    checkupForm.reset(checkup);
    setActiveStep(0);
    setCheckupDialogOpen(true);
  };

  const handleAddProgram = () => {
    setSelectedProgram(null);
    programForm.reset();
    setProgramDialogOpen(true);
  };

  const handleEditProgram = (program) => {
    setSelectedProgram(program);
    programForm.reset(program);
    setProgramDialogOpen(true);
  };

  const onCheckupSubmit = async (data) => {
    try {
      if (selectedCheckup) {
        console.log('Updating checkup:', data);
      } else {
        console.log('Adding checkup:', data);
      }
      setCheckupDialogOpen(false);
      fetchCheckups();
    } catch (error) {
      console.error('Error saving checkup:', error);
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

  const filteredCheckups = checkups.filter(checkup => {
    const matchesSearch = checkup.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         checkup.checkupType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || checkup.checkupType.toLowerCase().includes(filterType.toLowerCase());
    const matchesGrade = filterGrade === 'all' || checkup.grade.includes(filterGrade);
    return matchesSearch && matchesType && matchesGrade;
  });

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

  return (
    <div className="p-6">
      <PageHeader
        title="Health Checkups"
        subtitle="Manage student health checkups and screening programs"
        icon={<HealthIcon />}
      />

      {/* Statistics Cards */}
      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent className="text-center">
              <HealthIcon className="text-4xl text-blue-500 mb-2" />
              <Typography variant="h4">{checkups.length}</Typography>
              <Typography color="textSecondary">Total Checkups</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent className="text-center">
              <ScheduleIcon className="text-4xl text-green-500 mb-2" />
              <Typography variant="h4">{programs.filter(p => p.status === 'active').length}</Typography>
              <Typography color="textSecondary">Active Programs</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent className="text-center">
              <WarningIcon className="text-4xl text-orange-500 mb-2" />
              <Typography variant="h4">{checkups.filter(c => c.followUpRequired).length}</Typography>
              <Typography color="textSecondary">Follow-ups Required</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent className="text-center">
              <CheckCircleIcon className="text-4xl text-purple-500 mb-2" />
              <Typography variant="h4">
                {Math.round((checkups.filter(c => c.status === 'completed').length / students.length) * 100)}%
              </Typography>
              <Typography color="textSecondary">Completion Rate</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label="Health Records" />
            <Tab label="Screening Programs" />
            <Tab label="Analytics" />
          </Tabs>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <Box className="flex gap-4 mb-4">
            <TextField
              placeholder="Search checkups or programs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon className="mr-2 text-gray-500" />
              }}
              className="flex-1"
            />
            {activeTab === 0 && (
              <>
                <FormControl className="min-w-32">
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={filterType}
                    label="Type"
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="physical">Physical</MenuItem>
                    <MenuItem value="vision">Vision</MenuItem>
                    <MenuItem value="hearing">Hearing</MenuItem>
                    <MenuItem value="dental">Dental</MenuItem>
                  </Select>
                </FormControl>
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
              </>
            )}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={activeTab === 0 ? handleAddCheckup : activeTab === 1 ? handleAddProgram : null}
            >
              {activeTab === 0 ? 'Add Checkup' : activeTab === 1 ? 'Add Program' : 'Add'}
            </Button>
          </Box>

          {/* Tab Content */}
          {activeTab === 0 && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Conducted By</TableCell>
                    <TableCell>BMI</TableCell>
                    <TableCell>Vision</TableCell>
                    <TableCell>Hearing</TableCell>
                    <TableCell>Follow-up</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCheckups.map((checkup) => (
                    <TableRow key={checkup.id}>
                      <TableCell>
                        <div>
                          <Typography variant="subtitle2">{checkup.studentName}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {checkup.grade}
                          </Typography>
                        </div>
                      </TableCell>
                      <TableCell>{checkup.checkupType}</TableCell>
                      <TableCell>{new Date(checkup.checkupDate).toLocaleDateString()}</TableCell>
                      <TableCell>{checkup.conductedBy}</TableCell>
                      <TableCell>
                        {checkup.bmi && (
                          <div>
                            <Typography variant="body2">{checkup.bmi}</Typography>
                            <Chip
                              label={getBMICategory(checkup.bmi).category}
                              color={getBMICategory(checkup.bmi).color}
                              size="small"
                            />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {checkup.visionLeft && checkup.visionRight ? (
                          <div>
                            <Typography variant="caption">L: {checkup.visionLeft}</Typography><br />
                            <Typography variant="caption">R: {checkup.visionRight}</Typography>
                          </div>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        {checkup.hearingLeft && checkup.hearingRight ? (
                          <div>
                            <Typography variant="caption">L: {checkup.hearingLeft}</Typography><br />
                            <Typography variant="caption">R: {checkup.hearingRight}</Typography>
                          </div>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        {checkup.followUpRequired ? (
                          <Chip
                            label={checkup.followUpDate ? new Date(checkup.followUpDate).toLocaleDateString() : 'Required'}
                            color="warning"
                            size="small"
                          />
                        ) : (
                          <Typography variant="caption" color="textSecondary">None</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={checkup.status}
                          color={getStatusColor(checkup.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Edit">
                          <IconButton onClick={() => handleEditCheckup(checkup)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton color="error">
                            <DeleteIcon />
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
        </CardContent>
      </Card>

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
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Autocomplete
                            options={students}
                            getOptionLabel={(option) => `${option.name} (${option.grade})`}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Student"
                                error={!!checkupForm.formState.errors.studentId}
                                helperText={checkupForm.formState.errors.studentId?.message}
                              />
                            )}
                            onChange={(event, value) => {
                              checkupForm.setValue('studentId', value?.id || '');
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth>
                            <InputLabel>Checkup Type</InputLabel>
                            <Select
                              {...checkupForm.register('checkupType')}
                              error={!!checkupForm.formState.errors.checkupType}
                            >
                              <MenuItem value="Annual Physical">Annual Physical</MenuItem>
                              <MenuItem value="Vision Screening">Vision Screening</MenuItem>
                              <MenuItem value="Hearing Screening">Hearing Screening</MenuItem>
                              <MenuItem value="Dental Checkup">Dental Checkup</MenuItem>
                              <MenuItem value="Sports Physical">Sports Physical</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Checkup Date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            {...checkupForm.register('checkupDate')}
                            error={!!checkupForm.formState.errors.checkupDate}
                            helperText={checkupForm.formState.errors.checkupDate?.message}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Conducted By"
                            {...checkupForm.register('conductedBy')}
                            error={!!checkupForm.formState.errors.conductedBy}
                            helperText={checkupForm.formState.errors.conductedBy?.message}
                          />
                        </Grid>
                      </Grid>
                    )}

                    {index === 1 && (
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            label="Height (cm)"
                            type="number"
                            {...checkupForm.register('height')}
                            error={!!checkupForm.formState.errors.height}
                            helperText={checkupForm.formState.errors.height?.message}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            label="Weight (kg)"
                            type="number"
                            {...checkupForm.register('weight')}
                            error={!!checkupForm.formState.errors.weight}
                            helperText={checkupForm.formState.errors.weight?.message}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            label="BMI"
                            type="number"
                            {...checkupForm.register('bmi')}
                            disabled
                            helperText="Calculated automatically"
                          />
                        </Grid>
                      </Grid>
                    )}

                    {index === 2 && (
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            label="Blood Pressure"
                            placeholder="120/80"
                            {...checkupForm.register('bloodPressure')}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            label="Heart Rate (bpm)"
                            type="number"
                            {...checkupForm.register('heartRate')}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            label="Temperature (°C)"
                            type="number"
                            step="0.1"
                            {...checkupForm.register('temperature')}
                          />
                        </Grid>
                      </Grid>
                    )}

                    {index === 3 && (
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={3}>
                          <TextField
                            fullWidth
                            label="Vision - Left Eye"
                            placeholder="20/20"
                            {...checkupForm.register('visionLeft')}
                          />
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <TextField
                            fullWidth
                            label="Vision - Right Eye"
                            placeholder="20/20"
                            {...checkupForm.register('visionRight')}
                          />
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <FormControl fullWidth>
                            <InputLabel>Hearing - Left</InputLabel>
                            <Select {...checkupForm.register('hearingLeft')}>
                              <MenuItem value="Normal">Normal</MenuItem>
                              <MenuItem value="Mild Loss">Mild Loss</MenuItem>
                              <MenuItem value="Moderate Loss">Moderate Loss</MenuItem>
                              <MenuItem value="Severe Loss">Severe Loss</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <FormControl fullWidth>
                            <InputLabel>Hearing - Right</InputLabel>
                            <Select {...checkupForm.register('hearingRight')}>
                              <MenuItem value="Normal">Normal</MenuItem>
                              <MenuItem value="Mild Loss">Mild Loss</MenuItem>
                              <MenuItem value="Moderate Loss">Moderate Loss</MenuItem>
                              <MenuItem value="Severe Loss">Severe Loss</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>
                    )}

                    {index === 4 && (
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="General Notes"
                            multiline
                            rows={3}
                            {...checkupForm.register('notes')}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                {...checkupForm.register('followUpRequired')}
                                color="primary"
                              />
                            }
                            label="Follow-up Required"
                          />
                        </Grid>
                      </Grid>
                    )}

                    <Box className="mt-4">
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
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCheckupDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={activeStep !== checkupSteps.length - 1}>
              {selectedCheckup ? 'Update' : 'Save'} Checkup
            </Button>
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