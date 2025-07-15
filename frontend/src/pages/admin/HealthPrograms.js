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
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  LocalHospital as HealthIcon,
  Vaccines as VaccineIcon,
  Schedule as ScheduleIcon,
  Search as SearchIcon
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
      targetGradeIds: [],
      selectedVaccines: [],
      typesOfCheckups: []
    }
  });

  const watchEventType = watch('eventType');

  const { control, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: yupResolver(programSchema),
    defaultValues: {
      name: '',
      type: '',
      description: '',
      startDate: '',
      endDate: '',
      targetGrades: []
    }
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAddProgram = () => {
    setEditingProgram(null);
    reset();
    setDialogOpen(true);
  };

  const handleEditProgram = (program) => {
    setEditingProgram(program);
    setValue('name', program.name);
    setValue('type', program.type);
    setValue('description', program.description);
    setValue('startDate', program.startDate);
    setValue('endDate', program.endDate);
    setValue('targetGrades', program.targetGrades);
    setDialogOpen(true);
  };

  const handleViewProgram = (program) => {
    setSelectedProgram(program);
    setViewDialogOpen(true);
  };

  const onSubmit = (data) => {
    setDialogOpen(false);
    reset();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'completed': return 'info';
      case 'planned': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckIcon />;
      case 'completed': return <InfoIcon />;
      case 'planned': return <WarningIcon />;
      default: return <InfoIcon />;
    }
  };

  const calculateProgress = (completed, total) => {
    return Math.round((completed / total) * 100);
  };

  return (
    <Box className="p-6">
      <Typography variant="h4" gutterBottom className="text-blue-600 font-bold">
        Health Programs Management
      </Typography>

      <Card>
        <CardContent>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="health programs tabs">
            <Tab 
              label="Active Programs" 
              icon={<CampaignIcon />} 
              iconPosition="start"
            />
            <Tab 
              label="Program Templates" 
              icon={<AssignmentIcon />} 
              iconPosition="start"
            />
            <Tab 
              label="Analytics" 
              icon={<BarChartIcon />} 
              iconPosition="start"
            />
            <Tab 
              label="Calendar View" 
              icon={<ScheduleIcon />} 
              iconPosition="start"
            />
          </Tabs>

          {/* Active Programs Tab */}
          <TabPanel value={tabValue} index={0}>
            <Box className="mb-4 flex justify-between items-center">
              <Typography variant="h6">Active Health Programs</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddProgram}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Add New Program
              </Button>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Program Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Target Grades</TableCell>
                    <TableCell>Progress</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {healthPrograms.map((program) => (
                    <TableRow key={program.id}>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2">{program.name}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {program.description}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={program.type} 
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={program.status}
                          color={getStatusColor(program.status)}
                          icon={getStatusIcon(program.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {program.startDate} to {program.endDate}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box className="flex flex-wrap gap-1">
                          {program.targetGrades.map((grade) => (
                            <Chip key={grade} label={`Grade ${grade}`} size="small" />
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box className="w-32">
                          <Typography variant="caption">
                            {program.completedStudents}/{program.totalStudents} ({calculateProgress(program.completedStudents, program.totalStudents)}%)
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={calculateProgress(program.completedStudents, program.totalStudents)}
                            className="mt-1"
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View Details">
                          <IconButton onClick={() => handleViewProgram(program)}>
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Program">
                          <IconButton onClick={() => handleEditProgram(program)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Program">
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
          </TabPanel>

          {/* Program Templates Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box className="mb-4">
              <Typography variant="h6" gutterBottom>Program Templates</Typography>
              <Typography variant="body2" color="textSecondary" className="mb-4">
                Use pre-configured templates to quickly create new health programs
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {programTemplates.map((template) => (
                <Grid item xs={12} md={4} key={template.id}>
                  <Card className="h-full">
                    <CardContent>
                      <Box className="flex items-center mb-3">
                        <HealthIcon className="mr-2 text-blue-600" />
                        <Typography variant="h6">{template.name}</Typography>
                      </Box>
                      <Typography variant="body2" color="textSecondary" className="mb-3">
                        Type: {template.type} | Duration: {template.duration}
                      </Typography>
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="subtitle2">Program Components</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <List dense>
                            {template.components.map((component, index) => (
                              <ListItem key={index}>
                                <ListItemText primary={component} />
                              </ListItem>
                            ))}
                          </List>
                        </AccordionDetails>
                      </Accordion>
                      <Button
                        variant="outlined"
                        fullWidth
                        className="mt-3"
                        onClick={() => {
                          setValue('type', template.type);
                          setDialogOpen(true);
                        }}
                      >
                        Use Template
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          {/* Analytics Tab */}
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>Program Analytics</Typography>
            
            <Grid container spacing={3} className="mb-6">
              <Grid item xs={12} md={8}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Program Progress Timeline</Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={progressData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Line type="monotone" dataKey="planned" stroke="#8884d8" strokeWidth={2} />
                        <Line type="monotone" dataKey="completed" stroke="#82ca9d" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Program Types Distribution</Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={programTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {programTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Completion Rate by Grade</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={gradeCompletionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="grade" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="completed" fill="#82ca9d" name="Completion Rate %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabPanel>

          {/* Calendar View Tab */}
          <TabPanel value={tabValue} index={3}>
            <Typography variant="h6" gutterBottom>Program Calendar</Typography>
            <Alert severity="info" className="mb-4">
              Calendar view showing all scheduled health programs and their timelines
            </Alert>
            
            <Grid container spacing={3}>
              {healthPrograms.map((program) => (
                <Grid item xs={12} md={6} key={program.id}>
                  <Card>
                    <CardContent>
                      <Box className="flex items-center justify-between mb-2">
                        <Typography variant="h6">{program.name}</Typography>
                        <Chip 
                          label={program.status}
                          color={getStatusColor(program.status)}
                          size="small"
                        />
                      </Box>
                      <Typography variant="body2" color="textSecondary" className="mb-2">
                        {program.description}
                      </Typography>
                      <Box className="flex items-center mb-2">
                        <ScheduleIcon className="mr-2 text-gray-500" fontSize="small" />
                        <Typography variant="body2">
                          {program.startDate} - {program.endDate}
                        </Typography>
                      </Box>
                      <Box className="flex items-center mb-2">
                        <GroupIcon className="mr-2 text-gray-500" fontSize="small" />
                        <Typography variant="body2">
                          {program.targetGrades.join(', ')} grades
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={calculateProgress(program.completedStudents, program.totalStudents)}
                        className="mt-2"
                      />
                      <Typography variant="caption" className="mt-1 block">
                        Progress: {calculateProgress(program.completedStudents, program.totalStudents)}%
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>
        </CardContent>
      </Card>

      {/* Add/Edit Program Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingProgram ? 'Edit Health Program' : 'Add New Health Program'}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Program Name"
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.type}>
                      <InputLabel>Program Type</InputLabel>
                      <Select {...field} label="Program Type">
                        <MenuItem value="vaccination">Vaccination</MenuItem>
                        <MenuItem value="screening">Health Screening</MenuItem>
                        <MenuItem value="awareness">Awareness Campaign</MenuItem>
                        <MenuItem value="checkup">Health Checkup</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="targetGrades"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.targetGrades}>
                      <InputLabel>Target Grades</InputLabel>
                      <Select
                        {...field}
                        multiple
                        label="Target Grades"
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip key={value} label={`Grade ${value}`} size="small" />
                            ))}
                          </Box>
                        )}
                      >
                        {['1', '2', '3', '4', '5', '6'].map((grade) => (
                          <MenuItem key={grade} value={grade}>
                            Grade {grade}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="date"
                      label="Start Date"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.startDate}
                      helperText={errors.startDate?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="date"
                      label="End Date"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.endDate}
                      helperText={errors.endDate?.message}
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
                      multiline
                      rows={4}
                      label="Program Description"
                      error={!!errors.description}
                      helperText={errors.description?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingProgram ? 'Update' : 'Create'} Program
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View Program Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Program Details</DialogTitle>
        <DialogContent>
          {selectedProgram && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>{selectedProgram.name}</Typography>
                <Typography variant="body2" color="textSecondary" className="mb-4">
                  {selectedProgram.description}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper className="p-4">
                  <Typography variant="subtitle1" gutterBottom>Program Information</Typography>
                  <Typography variant="body2"><strong>Type:</strong> {selectedProgram.type}</Typography>
                  <Typography variant="body2"><strong>Status:</strong> {selectedProgram.status}</Typography>
                  <Typography variant="body2"><strong>Duration:</strong> {selectedProgram.startDate} to {selectedProgram.endDate}</Typography>
                  <Typography variant="body2"><strong>Target Grades:</strong> {selectedProgram.targetGrades.join(', ')}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper className="p-4">
                  <Typography variant="subtitle1" gutterBottom>Progress Statistics</Typography>
                  <Typography variant="body2"><strong>Total Students:</strong> {selectedProgram.totalStudents}</Typography>
                  <Typography variant="body2"><strong>Completed:</strong> {selectedProgram.completedStudents}</Typography>
                  <Typography variant="body2"><strong>Progress:</strong> {calculateProgress(selectedProgram.completedStudents, selectedProgram.totalStudents)}%</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={calculateProgress(selectedProgram.completedStudents, selectedProgram.totalStudents)}
                    className="mt-2"
                  />
                </Paper>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HealthPrograms;