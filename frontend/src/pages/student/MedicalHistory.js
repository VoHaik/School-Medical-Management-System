import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Button,
  TextField,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,  Divider,
  Alert,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,  TimelineContent,
  TimelineDot
} from '@mui/lab';
import {
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputAdornment
} from '@mui/material';
import {
  LocalHospital as MedicalIcon,
  Medication as MedicationIcon,
  Vaccines as VaccineIcon,
  MonitorHeart as VitalsIcon,
  Event as EventIcon,
  Assignment as ReportIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  ExpandMore as ExpandMoreIcon,
  Warning as EmergencyIcon,
  Healing as HealingIcon,
  Psychology as PsychologyIcon,
  Visibility as EyeIcon,
  Hearing as HearingIcon,
  FitnessCenter as FitnessIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// Mock medical history data
const medicalHistory = [
  {
    id: 1,
    date: '2024-11-15',
    type: 'checkup',
    title: 'Annual Health Screening',
    description: 'Routine annual health checkup',
    provider: 'School Nurse Johnson',
    findings: [
      'Height: 140cm (+3cm from last year)',
      'Weight: 35kg (+2kg from last year)',
      'BMI: 17.9 (Normal range)',
      'Vision: 20/20',
      'Hearing: Normal'
    ],
    recommendations: [
      'Continue current diet and exercise',
      'Schedule next checkup in 1 year'
    ],
    status: 'completed'
  },
  {
    id: 2,
    date: '2024-10-20',
    type: 'medication',
    title: 'Asthma Inhaler Administration',
    description: 'Used rescue inhaler during PE class',
    provider: 'PE Teacher Ms. Brown',
    findings: [
      'Mild shortness of breath during running',
      'Used albuterol inhaler as prescribed',
      'Symptoms resolved within 5 minutes'
    ],
    recommendations: [
      'Continue to carry inhaler during physical activities',
      'Consider pre-medication before PE class'
    ],
    status: 'resolved'
  },
  {
    id: 3,
    date: '2024-10-01',
    type: 'vaccination',
    title: 'Flu Vaccination',
    description: 'Annual influenza vaccination',
    provider: 'School Nurse Johnson',
    findings: [
      'No adverse reactions observed',
      'Monitored for 15 minutes post-vaccination'
    ],
    recommendations: [
      'Next flu vaccination due October 2025'
    ],
    status: 'completed'
  },
  {
    id: 4,
    date: '2024-09-05',
    type: 'incident',
    title: 'Minor Playground Injury',
    description: 'Small cut on knee from playground fall',
    provider: 'School Nurse Johnson',
    findings: [
      'Small 1cm cut on right knee',
      'No signs of infection',
      'Cleaned and bandaged wound'
    ],
    recommendations: [
      'Keep wound clean and dry',
      'Change bandage daily',
      'Return if signs of infection appear'
    ],
    status: 'healed'
  },
  {
    id: 5,
    date: '2024-08-15',
    type: 'screening',
    title: 'Vision Screening',
    description: 'Annual vision screening program',
    provider: 'Visiting Optometrist',
    findings: [
      'Visual acuity: 20/20 both eyes',
      'No signs of refractive errors',
      'Proper eye tracking and coordination'
    ],
    recommendations: [
      'No vision correction needed',
      'Continue good eye care habits'
    ],
    status: 'normal'
  },
  {
    id: 6,
    date: '2024-05-10',
    type: 'checkup',
    title: 'Spring Health Check',
    description: 'Mid-year health assessment',
    provider: 'School Nurse Johnson',
    findings: [
      'Overall good health',
      'Growth tracking on target',
      'No new health concerns'
    ],
    recommendations: [
      'Continue current health routine',
      'Maintain active lifestyle'
    ],
    status: 'completed'
  }
];

const vitalsHistory = [
  { date: '2024-11-15', height: 140, weight: 35, bmi: 17.9, bloodPressure: '102/65', heartRate: 88 },
  { date: '2024-05-10', height: 137, weight: 33, bmi: 17.6, bloodPressure: '100/63', heartRate: 90 },
  { date: '2023-11-15', height: 132, weight: 30, bmi: 17.2, bloodPressure: '98/62', heartRate: 92 },
  { date: '2023-05-10', height: 128, weight: 27, bmi: 16.5, bloodPressure: '96/60', heartRate: 94 }
];

const growthData = {
  height: [
    { age: 8, value: 125 },
    { age: 8.5, value: 128 },
    { age: 9, value: 132 },
    { age: 9.5, value: 137 },
    { age: 10, value: 140 }
  ],
  weight: [
    { age: 8, value: 24 },
    { age: 8.5, value: 27 },
    { age: 9, value: 30 },
    { age: 9.5, value: 33 },
    { age: 10, value: 35 }
  ]
};

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const MedicalHistory = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'checkup': return <MedicalIcon />;
      case 'medication': return <MedicationIcon />;
      case 'vaccination': return <VaccineIcon />;
      case 'incident': return <EmergencyIcon />;
      case 'screening': return <EyeIcon />;
      default: return <EventIcon />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'checkup': return '#2196f3';
      case 'medication': return '#ff9800';
      case 'vaccination': return '#4caf50';
      case 'incident': return '#f44336';
      case 'screening': return '#9c27b0';
      default: return '#757575';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'resolved': return 'info';
      case 'normal': return 'success';
      case 'healed': return 'success';
      default: return 'default';
    }
  };

  const filteredHistory = medicalHistory.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || record.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setDetailDialogOpen(true);
  };

  return (
    <Box className="p-6">
      <Typography variant="h4" gutterBottom className="text-blue-600 font-bold">
        My Medical History
      </Typography>

      <Card>
        <CardContent>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="medical history tabs">
            <Tab 
              label="Timeline" 
              icon={<EventIcon />} 
              iconPosition="start"
            />
            <Tab 
              label="Vitals History" 
              icon={<VitalsIcon />} 
              iconPosition="start"
            />
            <Tab 
              label="Growth Chart" 
              icon={<FitnessIcon />} 
              iconPosition="start"
            />
            <Tab 
              label="Reports" 
              icon={<ReportIcon />} 
              iconPosition="start"
            />
          </Tabs>

          {/* Timeline Tab */}
          <TabPanel value={tabValue} index={0}>
            {/* Search and Filter */}
            <Box className="mb-4 flex flex-col md:flex-row gap-4 items-center justify-between">
              <TextField
                variant="outlined"
                placeholder="Search medical records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                className="flex-1 max-w-md"
              />
              <Box className="flex gap-2">
                <Button
                  variant={filterType === 'all' ? 'contained' : 'outlined'}
                  onClick={() => setFilterType('all')}
                  size="small"
                >
                  All
                </Button>
                <Button
                  variant={filterType === 'checkup' ? 'contained' : 'outlined'}
                  onClick={() => setFilterType('checkup')}
                  size="small"
                >
                  Checkups
                </Button>
                <Button
                  variant={filterType === 'vaccination' ? 'contained' : 'outlined'}
                  onClick={() => setFilterType('vaccination')}
                  size="small"
                >
                  Vaccines
                </Button>
                <Button
                  variant={filterType === 'incident' ? 'contained' : 'outlined'}
                  onClick={() => setFilterType('incident')}
                  size="small"
                >
                  Incidents
                </Button>
              </Box>
            </Box>

            {/* Timeline */}
            <Timeline>
              {filteredHistory.map((record, index) => (
                <TimelineItem key={record.id}>
                  <TimelineSeparator>
                    <TimelineDot style={{ backgroundColor: getTypeColor(record.type) }}>
                      {getTypeIcon(record.type)}
                    </TimelineDot>
                    {index < filteredHistory.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>
                    <Card variant="outlined" className="mb-3">
                      <CardContent>
                        <Box className="flex items-center justify-between mb-2">
                          <Typography variant="h6">{record.title}</Typography>
                          <Box className="flex items-center gap-2">
                            <Chip 
                              label={record.status}
                              color={getStatusColor(record.status)}
                              size="small"
                            />
                            <Typography variant="caption" color="textSecondary">
                              {record.date}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="body2" color="textSecondary" className="mb-2">
                          Provider: {record.provider}
                        </Typography>
                        <Typography variant="body2" className="mb-3">
                          {record.description}
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleViewDetails(record)}
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </TabPanel>

          {/* Vitals History Tab */}
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom>Vital Signs History</Typography>
            <Grid container spacing={3}>
              {vitalsHistory.map((vital, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom className="flex items-center">
                        <CalendarIcon className="mr-2" />
                        {vital.date}
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="body2">
                            <strong>Height:</strong> {vital.height} cm
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">
                            <strong>Weight:</strong> {vital.weight} kg
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">
                            <strong>BMI:</strong> {vital.bmi}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">
                            <strong>Heart Rate:</strong> {vital.heartRate} bpm
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body2">
                            <strong>Blood Pressure:</strong> {vital.bloodPressure} mmHg
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          {/* Growth Chart Tab */}
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>Growth Tracking</Typography>
            <Alert severity="info" className="mb-4">
              Your growth is being tracked over time to ensure healthy development. 
              All measurements are within normal ranges for your age group.
            </Alert>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Height Progress</Typography>
                    <Typography variant="body2" color="textSecondary" className="mb-3">
                      Tracking your height growth over time
                    </Typography>
                    {growthData.height.map((point, index) => (
                      <Box key={index} className="flex justify-between items-center p-2 border-b">
                        <Typography variant="body2">Age {point.age}</Typography>
                        <Typography variant="body2" className="font-semibold">
                          {point.value} cm
                        </Typography>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Weight Progress</Typography>
                    <Typography variant="body2" color="textSecondary" className="mb-3">
                      Tracking your weight development over time
                    </Typography>
                    {growthData.weight.map((point, index) => (
                      <Box key={index} className="flex justify-between items-center p-2 border-b">
                        <Typography variant="body2">Age {point.age}</Typography>
                        <Typography variant="body2" className="font-semibold">
                          {point.value} kg
                        </Typography>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Card variant="outlined" className="mt-4">
              <CardContent>
                <Typography variant="h6" gutterBottom>Growth Summary</Typography>
                <Typography variant="body2" className="mb-2">
                  Your growth pattern shows healthy development appropriate for your age.
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <FitnessIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Height Growth"
                      secondary="Consistent growth rate of 3-4 cm per year"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <VitalsIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Weight Development"
                      secondary="Healthy weight gain proportional to height growth"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <MedicalIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="BMI Tracking"
                      secondary="BMI remains in normal range for age and gender"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </TabPanel>

          {/* Reports Tab */}
          <TabPanel value={tabValue} index={3}>
            <Typography variant="h6" gutterBottom>Medical Reports</Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom className="flex items-center">
                      <ReportIcon className="mr-2" />
                      Annual Health Report
                    </Typography>
                    <Typography variant="body2" color="textSecondary" className="mb-3">
                      Comprehensive health summary for the current school year
                    </Typography>
                    <Typography variant="caption" className="block mb-3">
                      Last updated: November 15, 2024
                    </Typography>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<DownloadIcon />}
                    >
                      Download Report
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom className="flex items-center">
                      <VaccineIcon className="mr-2" />
                      Immunization Record
                    </Typography>
                    <Typography variant="body2" color="textSecondary" className="mb-3">
                      Complete vaccination history and schedule
                    </Typography>
                    <Typography variant="caption" className="block mb-3">
                      Last updated: October 1, 2024
                    </Typography>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<PrintIcon />}
                    >
                      Print Record
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom className="flex items-center">
                      <FitnessIcon className="mr-2" />
                      Growth Chart
                    </Typography>
                    <Typography variant="body2" color="textSecondary" className="mb-3">
                      Visual representation of growth over time
                    </Typography>
                    <Typography variant="caption" className="block mb-3">
                      Last updated: November 15, 2024
                    </Typography>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<DownloadIcon />}
                    >
                      Download Chart
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Alert severity="info" className="mt-4">
              Medical reports are automatically generated based on your health records. 
              If you need additional reports or have questions about your medical history, 
              please contact the school nurse.
            </Alert>
          </TabPanel>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedRecord?.title}
        </DialogTitle>
        <DialogContent>
          {selectedRecord && (
            <Box>
              <Grid container spacing={2} className="mb-4">
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Date:</strong> {selectedRecord.date}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Provider:</strong> {selectedRecord.provider}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Type:</strong> {selectedRecord.type}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Status:</strong> {selectedRecord.status}
                  </Typography>
                </Grid>
              </Grid>
              
              <Typography variant="body2" className="mb-4">
                {selectedRecord.description}
              </Typography>

              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1">Findings</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {selectedRecord.findings?.map((finding, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={finding} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1">Recommendations</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {selectedRecord.recommendations?.map((recommendation, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={recommendation} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
          <Button variant="contained" startIcon={<PrintIcon />}>
            Print Record
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MedicalHistory;
