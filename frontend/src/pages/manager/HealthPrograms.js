import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Paper,
  Tabs,
  Tab,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
  Divider,
  InputAdornment,
  Alert,
  Avatar,
  Switch,
  CardMedia,
  CardActions,
  Collapse
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarMonth as CalendarIcon,
  LocalHospital as MedicalIcon,
  Medication as MedicationIcon,
  MedicalServices as HealthServiceIcon,
  Favorite as HeartIcon,
  Psychology as MindIcon,
  FitnessCenter as FitnessIcon,
  Restaurant as NutritionIcon,
  School as SchoolIcon,
  Event as EventIcon,
  Done as CheckIcon,
  Schedule as PendingIcon,
  Visibility as ViewIcon,
  ExpandMore as ExpandMoreIcon,
  Group as ParticipantsIcon,
  TrendingUp as TrendingUpIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { DataTable, ChartWidget, StatsCard } from '../../components/shared';
import PageHeader from '../../components/PageHeader';

const HealthPrograms = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [programFilter, setProgramFilter] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add', 'edit', 'view', 'delete'
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [programs, setPrograms] = useState([]);
  
  // Form state for add/edit program
  const [programForm, setFormState] = useState({
    title: '',
    description: '',
    type: '',
    startDate: '',
    endDate: '',
    targetAudience: '',
    coordinator: '',
    status: 'active',
    imageUrl: ''
  });
  
  // Load mock data
  useEffect(() => {
    setTimeout(() => {
      const mockPrograms = [
        {
          id: 1,
          title: 'Annual Vision Screening',
          description: 'Comprehensive vision screening for all students to detect vision problems early',
          type: 'screening',
          imageUrl: 'https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          startDate: '2025-06-01',
          endDate: '2025-06-30',
          targetAudience: 'All Students',
          coordinator: 'Dr. Sarah Johnson',
          status: 'active',
          progress: 45,
          participation: {
            eligible: 1250,
            completed: 565,
            pending: 685
          },
          schedule: [
            { date: '2025-06-10', grade: 'Grade 1', location: 'Medical Room' },
            { date: '2025-06-15', grade: 'Grade 2', location: 'Medical Room' },
            { date: '2025-06-22', grade: 'Grade 3-4', location: 'Medical Room' },
            { date: '2025-06-29', grade: 'Grade 5-6', location: 'Medical Room' }
          ]
        },
        {
          id: 2,
          title: 'Influenza Vaccination',
          description: 'Seasonal flu vaccination program to protect students against influenza',
          type: 'vaccination',
          imageUrl: 'https://images.unsplash.com/photo-1584117756914-99892f3079d0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          startDate: '2025-05-15',
          endDate: '2025-06-15',
          targetAudience: 'All Students and Staff',
          coordinator: 'Nurse Wilson',
          status: 'active',
          progress: 78,
          participation: {
            eligible: 1350,
            completed: 1053,
            pending: 297
          },
          schedule: [
            { date: '2025-05-15', grade: 'Staff', location: 'Staff Room' },
            { date: '2025-05-20', grade: 'Grades 7-8', location: 'Gymnasium' },
            { date: '2025-05-27', grade: 'Grades 4-6', location: 'Gymnasium' },
            { date: '2025-06-03', grade: 'Grades 1-3', location: 'Gymnasium' }
          ]
        },
        {
          id: 3,
          title: 'Mental Health Awareness',
          description: 'Educational program to promote mental health awareness and reduce stigma',
          type: 'education',
          imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          startDate: '2025-06-15',
          endDate: '2025-07-15',
          targetAudience: 'Middle and High School Students',
          coordinator: 'Michelle Garcia',
          status: 'pending',
          progress: 0,
          participation: {
            eligible: 625,
            completed: 0,
            pending: 625
          },
          schedule: [
            { date: '2025-06-15', grade: 'Staff Training', location: 'Conference Room' },
            { date: '2025-06-20', grade: 'Grade 8', location: 'Auditorium' },
            { date: '2025-06-27', grade: 'Grade 7', location: 'Auditorium' },
            { date: '2025-07-04', grade: 'Grade 6', location: 'Auditorium' }
          ]
        },
        {
          id: 4,
          title: 'Dental Health Program',
          description: 'Preventive dental care and education program',
          type: 'screening',
          imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          startDate: '2025-04-01',
          endDate: '2025-05-15',
          targetAudience: 'Elementary Students',
          coordinator: 'Dr. James Wilson',
          status: 'completed',
          progress: 100,
          participation: {
            eligible: 540,
            completed: 522,
            pending: 18
          },
          schedule: [
            { date: '2025-04-05', grade: 'Grade 1', location: 'Dental Room' },
            { date: '2025-04-12', grade: 'Grade 2', location: 'Dental Room' },
            { date: '2025-04-19', grade: 'Grade 3', location: 'Dental Room' },
            { date: '2025-05-03', grade: 'Grade 4', location: 'Dental Room' }
          ]
        },
        {
          id: 5,
          title: 'Nutrition & Physical Activity',
          description: 'Program promoting healthy eating and physical activity habits',
          type: 'education',
          imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          startDate: '2025-07-01',
          endDate: '2025-08-15',
          targetAudience: 'All Students',
          coordinator: 'Coach Rodriguez',
          status: 'pending',
          progress: 0,
          participation: {
            eligible: 1250,
            completed: 0,
            pending: 1250
          },
          schedule: [
            { date: '2025-07-05', grade: 'All Grades', location: 'Various' }
          ]
        },
        {
          id: 6,
          title: 'Scoliosis Screening',
          description: 'Early detection screening for spinal curvature issues',
          type: 'screening',
          imageUrl: 'https://images.unsplash.com/photo-1521539801379-bfb9f92a3c26?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
          startDate: '2025-05-01',
          endDate: '2025-05-30',
          targetAudience: 'Grades 6-8',
          coordinator: 'Nurse Garcia',
          status: 'completed',
          progress: 100,
          participation: {
            eligible: 375,
            completed: 368,
            pending: 7
          },
          schedule: [
            { date: '2025-05-05', grade: 'Grade 6', location: 'Gymnasium' },
            { date: '2025-05-12', grade: 'Grade 7', location: 'Gymnasium' },
            { date: '2025-05-19', grade: 'Grade 8', location: 'Gymnasium' }
          ]
        }
      ];
      
      setPrograms(mockPrograms);
      setLoading(false);
    }, 1000);
  }, []);
  
  // Handler for tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handler for search query change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  
  // Handler for filter change
  const handleFilterChange = (event) => {
    setProgramFilter(event.target.value);
  };
  
  // Filter programs based on search query, type filter and tab value
  const filteredPrograms = programs.filter(program => {
    const matchesSearch = 
      program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = programFilter === 'all' || program.type === programFilter;
    
    let statusMatch = true;
    if (tabValue === 0) { // Active
      statusMatch = program.status === 'active';
    } else if (tabValue === 1) { // Pending
      statusMatch = program.status === 'pending';
    } else if (tabValue === 2) { // Completed
      statusMatch = program.status === 'completed';
    }
    
    return matchesSearch && matchesFilter && statusMatch;
  });
  
  // Open dialog for add, edit, view or delete program
  const handleOpenDialog = (mode, program = null) => {
    setDialogMode(mode);
    setSelectedProgram(program);
    
    if (mode === 'add') {
      // Reset form for new program
      setFormState({
        title: '',
        description: '',
        type: '',
        startDate: '',
        endDate: '',
        targetAudience: '',
        coordinator: '',
        status: 'pending',
        imageUrl: ''
      });
    } else if (mode === 'edit' && program) {
      // Pre-fill form with program data
      setFormState({
        title: program.title,
        description: program.description,
        type: program.type,
        startDate: program.startDate,
        endDate: program.endDate,
        targetAudience: program.targetAudience,
        coordinator: program.coordinator,
        status: program.status,
        imageUrl: program.imageUrl
      });
    }
    
    setOpenDialog(true);
  };
  
  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  // Handle form field changes
  const handleFormChange = (field) => (event) => {
    setFormState({
      ...programForm,
      [field]: event.target.value
    });
  };
  
  // Handle form submission
  const handleSubmitForm = () => {
    // In a real application, you would send this to your API
    console.log("Form submitted:", programForm);
    
    // Mock implementation for UI demonstration
    if (dialogMode === 'add') {
      // Mock adding new program
      const newProgram = {
        id: programs.length + 1,
        ...programForm,
        progress: 0,
        participation: {
          eligible: 0,
          completed: 0,
          pending: 0
        },
        schedule: []
      };
      setPrograms([...programs, newProgram]);
    } else if (dialogMode === 'edit' && selectedProgram) {
      // Mock updating program
      const updatedPrograms = programs.map(program => 
        program.id === selectedProgram.id ? { ...program, ...programForm } : program
      );
      setPrograms(updatedPrograms);
    } else if (dialogMode === 'delete' && selectedProgram) {
      // Mock deleting program
      const updatedPrograms = programs.filter(program => program.id !== selectedProgram.id);
      setPrograms(updatedPrograms);
    }
    
    handleCloseDialog();
  };
  
  // Toggle expanded card
  const handleExpandCard = (programId) => {
    setExpandedId(expandedId === programId ? null : programId);
  };
  
  // Get program type icon
  const getProgramTypeIcon = (type) => {
    switch (type) {
      case 'screening':
        return <HealthServiceIcon />;
      case 'vaccination':
        return <MedicationIcon />;
      case 'education':
        return <SchoolIcon />;
      case 'nutrition':
        return <NutritionIcon />;
      case 'fitness':
        return <FitnessIcon />;
      case 'mental_health':
        return <MindIcon />;
      default:
        return <MedicalIcon />;
    }
  };
  
  // Get program status chip
  const getProgramStatusChip = (status) => {
    switch (status) {
      case 'active':
        return <Chip icon={<CheckIcon />} label="Active" color="success" size="small" />;
      case 'pending':
        return <Chip icon={<PendingIcon />} label="Pending" color="warning" size="small" />;
      case 'completed':
        return <Chip icon={<CheckIcon />} label="Completed" color="default" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };
  
  // Calculate summary stats
  const summaryStats = {
    totalPrograms: programs.length,
    activePrograms: programs.filter(p => p.status === 'active').length,
    pendingPrograms: programs.filter(p => p.status === 'pending').length,
    completedPrograms: programs.filter(p => p.status === 'completed').length,
    totalParticipants: programs.reduce((sum, p) => sum + (p.participation?.eligible || 0), 0),
    completionRate: Math.round(
      (programs.reduce((sum, p) => sum + (p.participation?.completed || 0), 0) / 
       programs.reduce((sum, p) => sum + (p.participation?.eligible || 0), 0) * 100) || 0
    )
  };
  
  // Render dialog content based on mode
  const renderDialogContent = () => {
    switch (dialogMode) {
      case 'add':
      case 'edit':
        return (
          <>
            <DialogTitle>{dialogMode === 'add' ? 'Add New Health Program' : 'Edit Health Program'}</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <TextField
                    label="Program Title"
                    fullWidth
                    value={programForm.title}
                    onChange={handleFormChange('title')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    fullWidth
                    multiline
                    rows={3}
                    value={programForm.description}
                    onChange={handleFormChange('description')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Program Type</InputLabel>
                    <Select
                      value={programForm.type}
                      onChange={handleFormChange('type')}
                      label="Program Type"
                    >
                      <MenuItem value="screening">Health Screening</MenuItem>
                      <MenuItem value="vaccination">Vaccination</MenuItem>
                      <MenuItem value="education">Health Education</MenuItem>
                      <MenuItem value="nutrition">Nutrition</MenuItem>
                      <MenuItem value="fitness">Physical Fitness</MenuItem>
                      <MenuItem value="mental_health">Mental Health</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Target Audience"
                    fullWidth
                    value={programForm.targetAudience}
                    onChange={handleFormChange('targetAudience')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Start Date"
                    type="date"
                    fullWidth
                    value={programForm.startDate}
                    onChange={handleFormChange('startDate')}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="End Date"
                    type="date"
                    fullWidth
                    value={programForm.endDate}
                    onChange={handleFormChange('endDate')}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Program Coordinator"
                    fullWidth
                    value={programForm.coordinator}
                    onChange={handleFormChange('coordinator')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={programForm.status}
                      onChange={handleFormChange('status')}
                      label="Status"
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Image URL"
                    fullWidth
                    value={programForm.imageUrl}
                    onChange={handleFormChange('imageUrl')}
                    helperText="URL to an image representing this program"
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleSubmitForm}
              >
                {dialogMode === 'add' ? 'Add Program' : 'Save Changes'}
              </Button>
            </DialogActions>
          </>
        );
        
      case 'view':
        if (!selectedProgram) return null;
        return (
          <>
            <DialogTitle>{selectedProgram.title}</DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                {selectedProgram.imageUrl && (
                  <img 
                    src={selectedProgram.imageUrl} 
                    alt={selectedProgram.title}
                    style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 4 }}
                  />
                )}
              </Box>
              
              <Typography variant="body1" paragraph>
                {selectedProgram.description}
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Program Type</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {getProgramTypeIcon(selectedProgram.type)}
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {selectedProgram.type.charAt(0).toUpperCase() + selectedProgram.type.slice(1)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                  {getProgramStatusChip(selectedProgram.status)}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Duration</Typography>
                  <Typography variant="body2">
                    {new Date(selectedProgram.startDate).toLocaleDateString()} - {new Date(selectedProgram.endDate).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Target Audience</Typography>
                  <Typography variant="body2">{selectedProgram.targetAudience}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Program Coordinator</Typography>
                  <Typography variant="body2">{selectedProgram.coordinator}</Typography>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>Progress & Participation</Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Overall Progress: {selectedProgram.progress}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={selectedProgram.progress} 
                  sx={{ height: 8, borderRadius: 5 }}
                />
              </Box>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={4}>
                  <Typography variant="subtitle2" align="center" color="text.secondary">Eligible</Typography>
                  <Typography variant="h6" align="center">{selectedProgram.participation?.eligible || 0}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="subtitle2" align="center" color="text.secondary">Completed</Typography>
                  <Typography variant="h6" align="center">{selectedProgram.participation?.completed || 0}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="subtitle2" align="center" color="text.secondary">Pending</Typography>
                  <Typography variant="h6" align="center">{selectedProgram.participation?.pending || 0}</Typography>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>Schedule</Typography>
              {selectedProgram.schedule && selectedProgram.schedule.length > 0 ? (
                <List dense>
                  {selectedProgram.schedule.map((item, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CalendarIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.grade}
                        secondary={`${new Date(item.date).toLocaleDateString()} - ${item.location}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2">No schedule information available.</Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button 
                color="primary"
                onClick={() => {
                  handleCloseDialog();
                  handleOpenDialog('edit', selectedProgram);
                }}
              >
                Edit
              </Button>
            </DialogActions>
          </>
        );
        
      case 'delete':
        return (
          <>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <Alert severity="warning" sx={{ mb: 2 }}>
                This action cannot be undone.
              </Alert>
              <Typography>
                Are you sure you want to delete the health program:{' '}
                <strong>{selectedProgram?.title}</strong>?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button 
                variant="contained" 
                color="error"
                onClick={handleSubmitForm}
              >
                Delete
              </Button>
            </DialogActions>
          </>
        );
        
      default:
        return null;
    }
  };

  // Pie chart data for program types
  const programTypeData = {
    title: "Program Types",
    subtitle: "Distribution by category",
    chartType: "pie",
    data: [
      { name: 'Screening', value: programs.filter(p => p.type === 'screening').length },
      { name: 'Vaccination', value: programs.filter(p => p.type === 'vaccination').length },
      { name: 'Education', value: programs.filter(p => p.type === 'education').length },
      { name: 'Nutrition', value: programs.filter(p => p.type === 'nutrition').length },
      { name: 'Fitness', value: programs.filter(p => p.type === 'fitness').length },
      { name: 'Mental Health', value: programs.filter(p => p.type === 'mental_health').length }
    ].filter(item => item.value > 0)
  };

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader 
        title="Health Programs"
        subtitle="Manage and monitor school health programs"
        icon={<HeartIcon fontSize="large" />}
      />
      
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard 
              title="Total Programs"
              value={summaryStats.totalPrograms}
              icon={<MedicalIcon fontSize="large" color="primary" />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard 
              title="Active Programs"
              value={summaryStats.activePrograms}
              icon={<CheckIcon fontSize="large" color="success" />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard 
              title="Total Participants"
              value={summaryStats.totalParticipants}
              icon={<ParticipantsIcon fontSize="large" color="primary" />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard 
              title="Completion Rate"
              value={`${summaryStats.completionRate}%`}
              icon={<TrendingUpIcon fontSize="large" color="success" />}
            />
          </Grid>
        </Grid>
      </Box>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
              indicatorColor="primary"
            >
              <Tab label={`Active (${summaryStats.activePrograms})`} />
              <Tab label={`Pending (${summaryStats.pendingPrograms})`} />
              <Tab label={`Completed (${summaryStats.completedPrograms})`} />
            </Tabs>
            
            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Grid item xs={12} sm={5}>
                <TextField
                  label="Search Programs"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={searchQuery}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <FormControl variant="outlined" size="small" fullWidth>
                  <InputLabel>Program Type</InputLabel>
                  <Select
                    value={programFilter}
                    onChange={handleFilterChange}
                    label="Program Type"
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    <MenuItem value="screening">Health Screening</MenuItem>
                    <MenuItem value="vaccination">Vaccination</MenuItem>
                    <MenuItem value="education">Education</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  fullWidth
                  onClick={() => handleOpenDialog('add')}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
            
            {filteredPrograms.length === 0 ? (
              <Alert severity="info">
                No health programs found matching your criteria.
              </Alert>
            ) : (
              <Grid container spacing={2}>
                {filteredPrograms.map((program) => (
                  <Grid item xs={12} key={program.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={3}>
                            {program.imageUrl ? (
                              <CardMedia
                                component="img"
                                height="120"
                                image={program.imageUrl}
                                alt={program.title}
                                sx={{ borderRadius: 1, objectFit: 'cover' }}
                              />
                            ) : (
                              <Box 
                                sx={{ 
                                  height: 120, 
                                  bgcolor: 'background.default',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  borderRadius: 1
                                }}
                              >
                                {getProgramTypeIcon(program.type)}
                              </Box>
                            )}
                          </Grid>
                          <Grid item xs={12} sm={9}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                              <Typography variant="h6" gutterBottom>{program.title}</Typography>
                              {getProgramStatusChip(program.status)}
                            </Box>
                            
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {program.description}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                              <Chip 
                                icon={getProgramTypeIcon(program.type)} 
                                label={program.type.charAt(0).toUpperCase() + program.type.slice(1)}
                                size="small"
                                variant="outlined"
                              />
                              <Typography variant="caption" color="text.secondary">
                                {new Date(program.startDate).toLocaleDateString()} - {new Date(program.endDate).toLocaleDateString()}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="body2" gutterBottom>
                                Progress: {program.progress}%
                              </Typography>
                              <LinearProgress 
                                variant="determinate" 
                                value={program.progress} 
                                sx={{ height: 6, borderRadius: 3 }}
                              />
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                      
                      <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
                        <Box>
                          <Button
                            size="small"
                            startIcon={<ViewIcon />}
                            onClick={() => handleOpenDialog('view', program)}
                          >
                            View
                          </Button>
                          <Button
                            size="small"
                            startIcon={<EditIcon />}
                            onClick={() => handleOpenDialog('edit', program)}
                          >
                            Edit
                          </Button>
                        </Box>
                        
                        <Box>
                          <IconButton
                            onClick={() => handleExpandCard(program.id)}
                            aria-expanded={expandedId === program.id}
                            aria-label="show details"
                            size="small"
                          >
                            <ExpandMoreIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleOpenDialog('delete', program)}
                            color="error"
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </CardActions>
                      
                      <Collapse in={expandedId === program.id} unmountOnExit>
                        <CardContent>
                          <Divider sx={{ my: 1 }} />
                          
                          <Typography variant="subtitle2" gutterBottom>Program Details</Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="text.secondary">Target Audience</Typography>
                              <Typography variant="body2">{program.targetAudience}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" color="text.secondary">Coordinator</Typography>
                              <Typography variant="body2">{program.coordinator}</Typography>
                            </Grid>
                          </Grid>
                          
                          <Typography variant="subtitle2" sx={{ mt: 2 }} gutterBottom>Participation</Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={4}>
                              <Typography variant="body2" color="text.secondary">Eligible</Typography>
                              <Typography variant="body2">{program.participation?.eligible || 0}</Typography>
                            </Grid>
                            <Grid item xs={4}>
                              <Typography variant="body2" color="text.secondary">Completed</Typography>
                              <Typography variant="body2">{program.participation?.completed || 0}</Typography>
                            </Grid>
                            <Grid item xs={4}>
                              <Typography variant="body2" color="text.secondary">Pending</Typography>
                              <Typography variant="body2">{program.participation?.pending || 0}</Typography>
                            </Grid>
                          </Grid>
                          
                          {program.schedule && program.schedule.length > 0 && (
                            <>
                              <Typography variant="subtitle2" sx={{ mt: 2 }} gutterBottom>Next Sessions</Typography>
                              <List dense disablePadding>
                                {program.schedule.slice(0, 2).map((item, index) => (
                                  <ListItem key={index} disablePadding>
                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                      <CalendarIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText 
                                      primary={`${item.grade} - ${item.location}`}
                                      secondary={new Date(item.date).toLocaleDateString()}
                                      primaryTypographyProps={{ variant: 'body2' }}
                                      secondaryTypographyProps={{ variant: 'caption' }}
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            </>
                          )}
                        </CardContent>
                      </Collapse>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Program Types</Typography>
            <ChartWidget 
              {...programTypeData}
              height={220}
            />
          </Paper>
          
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Upcoming Events</Typography>
            <List dense>
              {programs
                .filter(p => p.status === 'active' || p.status === 'pending')
                .flatMap(p => p.schedule || [])
                .filter(s => new Date(s.date) >= new Date())
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .slice(0, 5)
                .map((event, index) => (
                  <ListItem key={index} divider={index < 4}>
                    <ListItemIcon>
                      <EventIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={event.grade}
                      secondary={`${new Date(event.date).toLocaleDateString()} - ${event.location}`}
                    />
                  </ListItem>
                ))}
            </List>
            
            {programs
              .filter(p => p.status === 'active' || p.status === 'pending')
              .flatMap(p => p.schedule || [])
              .filter(s => new Date(s.date) >= new Date()).length === 0 && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  No upcoming events scheduled.
                </Alert>
              )}
          </Paper>
        </Grid>
      </Grid>
      
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {renderDialogContent()}
      </Dialog>
    </Box>
  );
};

export default HealthPrograms;
