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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  LinearProgress,
  Avatar,
  Badge
} from '@mui/material';
import {
  HealthAndSafety,
  Search,
  FilterList,
  Download,
  Print,
  Visibility,
  Close,
  Schedule,
  Assignment,
  TrendingUp,
  Warning,
  CheckCircle,
  MonitorHeart,
  Height,
  FitnessCenter,
  Psychology,
  LocalHospital
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format, parseISO, subMonths } from 'date-fns';

// Mock data for checkup history
const mockCheckupData = {
  student: {
    id: 'STU-2024-001',
    name: 'John Smith',
    grade: 'Grade 10',
    birthDate: '2008-03-15'
  },
  summary: {
    totalCheckups: 15,
    completedThisYear: 3,
    upcomingCheckups: 1,
    averageScore: 92,
    lastCheckup: '2024-01-15'
  },
  checkupHistory: [
    {
      id: 1,
      date: '2024-01-15',
      type: 'Annual Physical Examination',
      provider: 'Dr. Sarah Johnson',
      location: 'School Health Clinic',
      status: 'completed',
      overallScore: 95,
      measurements: {
        height: 165.2,
        weight: 58.5,
        bmi: 21.4,
        bloodPressure: '110/70',
        heartRate: 72,
        temperature: 36.8
      },
      screenings: [
        { test: 'Vision Screening', result: '20/20', status: 'normal' },
        { test: 'Hearing Test', result: 'Normal', status: 'normal' },
        { test: 'Dental Check', result: '2 cavities', status: 'requires-followup' },
        { test: 'Mental Health Screening', result: 'No concerns', status: 'normal' }
      ],
      notes: 'Student is in excellent health. Recommend follow-up dental care for cavities.',
      followUpRequired: true,
      followUpDate: '2024-02-15',
      followUpReason: 'Dental treatment'
    },
    {
      id: 2,
      date: '2023-09-10',
      type: 'Sports Physical',
      provider: 'Dr. Michael Chen',
      location: 'Sports Medicine Clinic',
      status: 'completed',
      overallScore: 98,
      measurements: {
        height: 163.8,
        weight: 56.2,
        bmi: 21.0,
        bloodPressure: '108/68',
        heartRate: 68,
        temperature: 36.6
      },
      screenings: [
        { test: 'Cardiovascular Screening', result: 'Excellent', status: 'normal' },
        { test: 'Musculoskeletal Exam', result: 'No issues', status: 'normal' },
        { test: 'Flexibility Test', result: 'Above average', status: 'normal' }
      ],
      notes: 'Cleared for all sports activities. Excellent cardiovascular fitness.',
      followUpRequired: false
    },
    {
      id: 3,
      date: '2023-05-20',
      type: 'Routine Health Screening',
      provider: 'School Nurse Mary Wilson',
      location: 'School Health Office',
      status: 'completed',
      overallScore: 88,
      measurements: {
        height: 162.1,
        weight: 54.8,
        bmi: 20.9,
        bloodPressure: '112/72',
        heartRate: 75,
        temperature: 36.7
      },
      screenings: [
        { test: 'Vision Screening', result: '20/25', status: 'monitor' },
        { test: 'Hearing Test', result: 'Normal', status: 'normal' },
        { test: 'Scoliosis Screening', result: 'Normal', status: 'normal' }
      ],
      notes: 'Slight vision decline noted. Recommend eye exam.',
      followUpRequired: true,
      followUpDate: '2023-06-15',
      followUpReason: 'Eye examination'
    },
    {
      id: 4,
      date: '2023-01-12',
      type: 'Annual Physical Examination',
      provider: 'Dr. Sarah Johnson',
      location: 'School Health Clinic',
      status: 'completed',
      overallScore: 91,
      measurements: {
        height: 160.5,
        weight: 53.2,
        bmi: 20.6,
        bloodPressure: '105/65',
        heartRate: 70,
        temperature: 36.5
      },
      screenings: [
        { test: 'Vision Screening', result: '20/20', status: 'normal' },
        { test: 'Hearing Test', result: 'Normal', status: 'normal' },
        { test: 'Dental Check', result: 'Good oral health', status: 'normal' },
        { test: 'Mental Health Screening', result: 'No concerns', status: 'normal' }
      ],
      notes: 'Overall excellent health. Continue current health practices.',
      followUpRequired: false
    }
  ],
  upcomingCheckups: [
    {
      id: 5,
      date: '2024-06-15',
      type: 'Annual Physical Examination',
      provider: 'Dr. Sarah Johnson',
      location: 'School Health Clinic',
      status: 'scheduled',
      notes: 'Annual comprehensive health examination'
    }
  ],
  growthData: [
    { date: '2023-01', height: 160.5, weight: 53.2, bmi: 20.6 },
    { date: '2023-05', height: 162.1, weight: 54.8, bmi: 20.9 },
    { date: '2023-09', height: 163.8, weight: 56.2, bmi: 21.0 },
    { date: '2024-01', height: 165.2, weight: 58.5, bmi: 21.4 }
  ],
  vitalTrends: [
    { date: '2023-01', systolic: 105, diastolic: 65, heartRate: 70 },
    { date: '2023-05', systolic: 112, diastolic: 72, heartRate: 75 },
    { date: '2023-09', systolic: 108, diastolic: 68, heartRate: 68 },
    { date: '2024-01', systolic: 110, diastolic: 70, heartRate: 72 }
  ]
};

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

const CheckupHistory = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCheckup, setSelectedCheckup] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('all');
  const [data, setData] = useState(mockCheckupData);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleViewDetails = (checkup) => {
    setSelectedCheckup(checkup);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedCheckup(null);
  };

  const filteredCheckups = data.checkupHistory.filter(checkup => {
    const matchesSearch = checkup.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         checkup.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = filterYear === 'all' || 
                       new Date(checkup.date).getFullYear().toString() === filterYear;
    return matchesSearch && matchesYear;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'normal':
        return 'success';
      case 'monitor':
        return 'warning';
      case 'requires-followup':
        return 'error';
      case 'completed':
        return 'success';
      case 'scheduled':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'normal':
        return <CheckCircle />;
      case 'monitor':
        return <Warning />;
      case 'requires-followup':
        return <Assignment />;
      case 'completed':
        return <CheckCircle />;
      case 'scheduled':
        return <Schedule />;
      default:
        return <Assignment />;
    }
  };

  const getBMIStatus = (bmi) => {
    if (bmi < 18.5) return { status: 'Underweight', color: 'warning' };
    if (bmi < 25) return { status: 'Normal', color: 'success' };
    if (bmi < 30) return { status: 'Overweight', color: 'warning' };
    return { status: 'Obese', color: 'error' };
  };

  return (
    <Box className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <Box className="mb-6">
        <Box className="flex items-center gap-3 mb-4">
          <HealthAndSafety className="text-blue-600" sx={{ fontSize: 32 }} />
          <Typography variant="h4" className="font-bold text-gray-800">
            Health Checkup History
          </Typography>
        </Box>
        <Typography variant="body1" className="text-gray-600">
          Track your child's health checkups, screenings, and wellness progress over time.
        </Typography>
      </Box>

      {/* Student Overview */}
      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box className="flex items-center gap-4">
                <Avatar className="bg-blue-500" sx={{ width: 64, height: 64 }}>
                  {data.student.name.split(' ').map(n => n[0]).join('')}
                </Avatar>
                <Box className="flex-1">
                  <Typography variant="h5" className="font-semibold mb-1">
                    {data.student.name}
                  </Typography>
                  <Typography variant="body1" className="text-gray-600 mb-2">
                    {data.student.grade} • Born: {format(parseISO(data.student.birthDate), 'MMMM dd, yyyy')}
                  </Typography>
                  <Typography variant="body2" className="text-gray-500">
                    Last Checkup: {format(parseISO(data.summary.lastCheckup), 'MMMM dd, yyyy')}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="mb-3">Health Summary</Typography>
              <Box className="space-y-3">
                <Box className="flex justify-between">
                  <Typography variant="body2">Total Checkups:</Typography>
                  <Typography variant="body2" className="font-semibold">{data.summary.totalCheckups}</Typography>
                </Box>
                <Box className="flex justify-between">
                  <Typography variant="body2">This Year:</Typography>
                  <Typography variant="body2" className="font-semibold">{data.summary.completedThisYear}</Typography>
                </Box>
                <Box className="flex justify-between">
                  <Typography variant="body2">Upcoming:</Typography>
                  <Typography variant="body2" className="font-semibold">{data.summary.upcomingCheckups}</Typography>
                </Box>
                <Box className="flex justify-between">
                  <Typography variant="body2">Average Score:</Typography>
                  <Typography variant="body2" className="font-semibold text-green-600">{data.summary.averageScore}%</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Checkup History" />
          <Tab label="Growth Tracking" />
          <Tab label="Vital Signs Trends" />
          <Tab label="Upcoming Checkups" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <TabPanel value={activeTab} index={0}>
        {/* Search and Filter */}
        <Box className="mb-4">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
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
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                select
                label="Filter by Year"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                SelectProps={{ native: true }}
              >
                <option value="all">All Years</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box className="flex gap-2">
                <Tooltip title="Download Report">
                  <IconButton className="text-blue-600">
                    <Download />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Print History">
                  <IconButton className="text-green-600">
                    <Print />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
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
                <TableCell>Score</TableCell>
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
                    <Box className="flex items-center gap-2">
                      <Typography variant="body2" className="font-semibold">
                        {checkup.overallScore}%
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={checkup.overallScore}
                        className="w-16 h-2"
                        color={checkup.overallScore >= 90 ? 'success' : checkup.overallScore >= 75 ? 'warning' : 'error'}
                      />
                    </Box>
                  </TableCell>
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
                      size="small"
                      onClick={() => handleViewDetails(checkup)}
                      startIcon={<Visibility />}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="mb-4">Growth Chart</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.growthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <RechartsTooltip />
                    <Line yAxisId="left" type="monotone" dataKey="height" stroke="#8884d8" name="Height (cm)" />
                    <Line yAxisId="right" type="monotone" dataKey="weight" stroke="#82ca9d" name="Weight (kg)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="mb-4">BMI Tracking</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.growthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="bmi" fill="#8884d8" name="BMI" />
                  </BarChart>
                </ResponsiveContainer>
                
                <Box className="mt-4">
                  <Typography variant="subtitle2" className="mb-2">Latest BMI Status</Typography>
                  {data.growthData.length > 0 && (
                    <Chip
                      label={`${getBMIStatus(data.growthData[data.growthData.length - 1].bmi).status} (${data.growthData[data.growthData.length - 1].bmi})`}
                      color={getBMIStatus(data.growthData[data.growthData.length - 1].bmi).color}
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="mb-4">Blood Pressure Trends</Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={data.vitalTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <RechartsTooltip />
                    <Line type="monotone" dataKey="systolic" stroke="#8884d8" name="Systolic" />
                    <Line type="monotone" dataKey="diastolic" stroke="#82ca9d" name="Diastolic" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="mb-4">Heart Rate Trends</Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={data.vitalTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <RechartsTooltip />
                    <Line type="monotone" dataKey="heartRate" stroke="#ff7300" name="Heart Rate (bpm)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="mb-4">Latest Vital Signs</Typography>
                <Grid container spacing={3}>
                  {data.vitalTrends.length > 0 && (
                    <>
                      <Grid item xs={6} md={3}>
                        <Box className="text-center p-4 border rounded-lg">
                          <MonitorHeart className="text-blue-500 mb-2" />
                          <Typography variant="h6" className="font-bold">
                            {data.vitalTrends[data.vitalTrends.length - 1].systolic}/{data.vitalTrends[data.vitalTrends.length - 1].diastolic}
                          </Typography>
                          <Typography variant="caption" className="text-gray-600">
                            Blood Pressure (mmHg)
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Box className="text-center p-4 border rounded-lg">
                          <FitnessCenter className="text-red-500 mb-2" />
                          <Typography variant="h6" className="font-bold">
                            {data.vitalTrends[data.vitalTrends.length - 1].heartRate}
                          </Typography>
                          <Typography variant="caption" className="text-gray-600">
                            Heart Rate (bpm)
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Box className="text-center p-4 border rounded-lg">
                          <Height className="text-green-500 mb-2" />
                          <Typography variant="h6" className="font-bold">
                            {data.growthData[data.growthData.length - 1].height}
                          </Typography>
                          <Typography variant="caption" className="text-gray-600">
                            Height (cm)
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Box className="text-center p-4 border rounded-lg">
                          <Typography variant="h6" className="font-bold">
                            {data.growthData[data.growthData.length - 1].weight}
                          </Typography>
                          <Typography variant="caption" className="text-gray-600">
                            Weight (kg)
                          </Typography>
                        </Box>
                      </Grid>
                    </>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={activeTab} index={3}>
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
                    
                    <Typography variant="body2" className="text-gray-600 mb-2">
                      <strong>Date:</strong> {format(parseISO(checkup.date), 'MMMM dd, yyyy')}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600 mb-2">
                      <strong>Provider:</strong> {checkup.provider}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600 mb-2">
                      <strong>Location:</strong> {checkup.location}
                    </Typography>
                    
                    {checkup.notes && (
                      <Typography variant="body2" className="text-gray-600 mt-3">
                        <strong>Notes:</strong> {checkup.notes}
                      </Typography>
                    )}
                    
                    <Box className="mt-4 flex gap-2">
                      <Button variant="outlined" size="small">
                        Reschedule
                      </Button>
                      <Button variant="text" size="small">
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

      {/* Checkup Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box className="flex justify-between items-center">
            <Typography variant="h6">
              Checkup Details - {selectedCheckup?.type}
            </Typography>
            <IconButton onClick={handleCloseDetails}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedCheckup && (
            <Box className="space-y-4">
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" className="mb-2">Basic Information</Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText primary="Date" secondary={format(parseISO(selectedCheckup.date), 'MMMM dd, yyyy')} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Provider" secondary={selectedCheckup.provider} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Location" secondary={selectedCheckup.location} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Overall Score" secondary={`${selectedCheckup.overallScore}%`} />
                    </ListItem>
                  </List>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" className="mb-2">Measurements</Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText primary="Height" secondary={`${selectedCheckup.measurements.height} cm`} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Weight" secondary={`${selectedCheckup.measurements.weight} kg`} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="BMI" secondary={selectedCheckup.measurements.bmi} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Blood Pressure" secondary={`${selectedCheckup.measurements.bloodPressure} mmHg`} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Heart Rate" secondary={`${selectedCheckup.measurements.heartRate} bpm`} />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
              
              <Divider />
              
              <Box>
                <Typography variant="h6" className="mb-2">Screening Results</Typography>
                <List>
                  {selectedCheckup.screenings.map((screening, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        {getStatusIcon(screening.status)}
                      </ListItemIcon>
                      <ListItemText
                        primary={screening.test}
                        secondary={`Result: ${screening.result}`}
                      />
                      <Chip
                        label={screening.status.replace('-', ' ')}
                        color={getStatusColor(screening.status)}
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
              
              <Divider />
              
              <Box>
                <Typography variant="h6" className="mb-2">Notes</Typography>
                <Typography variant="body2" className="text-gray-600">
                  {selectedCheckup.notes}
                </Typography>
              </Box>
              
              {selectedCheckup.followUpRequired && (
                <Alert severity="warning">
                  <Typography variant="subtitle2">Follow-up Required</Typography>
                  <Typography variant="body2">
                    Date: {format(parseISO(selectedCheckup.followUpDate), 'MMMM dd, yyyy')}
                  </Typography>
                  <Typography variant="body2">
                    Reason: {selectedCheckup.followUpReason}
                  </Typography>
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Close</Button>
          <Button variant="contained" startIcon={<Download />}>
            Download Report
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CheckupHistory;
