import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Button,
  Tabs,
  Tab,
  IconButton,
  TextField,
  MenuItem,
  InputAdornment,
  Select,
  FormControl,
  InputLabel,
  Divider,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  Group as GroupIcon,
  LocalHospital as MedicalIcon,
  Vaccines as VaccineIcon,
  Assignment as AssignmentIcon,
  NotificationsActive as AlertIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  Assessment as AssessmentIcon,
  DateRange as DateRangeIcon,
  Print as PrintIcon,
  Person as PersonIcon,
  Event as EventIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { ChartWidget, StatsCard, DataTable, TimelineWidget } from '../../components/shared';
import PageHeader from '../../components/PageHeader';

const ManagerDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');
  const [dashboardData, setDashboardData] = useState({
    healthMetrics: {},
    recentEvents: [],
    staffOverview: {},
    upcomingCheckups: [],
    upcomingVaccinations: [],
    alerts: []
  });
  
  // Load mock data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockData = {
        healthMetrics: {
          totalStudents: 1250,
          medicalEvents: {
            total: 87,
            byType: {
              injury: 42,
              illness: 28,
              emergency: 7,
              other: 10
            },
            trend: [
              { date: '2025-05-01', count: 5 },
              { date: '2025-05-08', count: 8 },
              { date: '2025-05-15', count: 10 },
              { date: '2025-05-22', count: 7 },
              { date: '2025-05-29', count: 12 },
              { date: '2025-06-05', count: 6 }
            ]
          },
          checkups: {
            completed: 845,
            pending: 405,
            abnormalities: 78
          },
          vaccinations: {
            completed: 920,
            pending: 330,
            exemptions: 25
          }
        },
        recentEvents: [
          {
            id: 1,
            type: 'emergency',
            title: 'Severe Allergic Reaction',
            description: 'Student experienced severe allergic reaction in cafeteria',
            date: '2025-06-06',
            time: '12:30',
            status: 'resolved',
            severity: 'high',
            student: 'Michael Johnson',
            class: '7C'
          },
          {
            id: 2,
            type: 'checkup',
            title: 'Annual Health Screening',
            description: 'Grade 5 annual health screening completed',
            date: '2025-06-05',
            time: '09:00',
            status: 'completed',
            student: 'Multiple Students',
            class: 'Grade 5'
          },
          {
            id: 3,
            type: 'vaccination',
            title: 'Influenza Vaccination',
            description: 'Seasonal flu vaccination administered',
            date: '2025-06-04',
            time: '10:15',
            status: 'completed',
            student: 'Multiple Students',
            class: 'Various'
          },
          {
            id: 4,
            type: 'illness',
            title: 'Fever Outbreak',
            description: 'Multiple students reporting fever and cough',
            date: '2025-06-03',
            time: '14:00',
            status: 'monitoring',
            severity: 'medium',
            student: 'Multiple Students',
            class: 'Grade 3'
          }
        ],
        staffOverview: {
          total: 15,
          active: 12,
          onLeave: 3,
          byRole: {
            nurses: 8,
            assistants: 5,
            coordinators: 2
          }
        },
        upcomingCheckups: [
          {
            id: 1,
            title: 'Annual Vision Screening',
            date: '2025-06-10',
            time: '09:00 - 12:00',
            class: 'Grade 2',
            location: 'Medical Room',
            assignedTo: 'Nurse Johnson'
          },
          {
            id: 2,
            title: 'Dental Check',
            date: '2025-06-12',
            time: '10:00 - 14:00',
            class: 'Grade 4',
            location: 'Dental Room',
            assignedTo: 'Dr. Smith (External)'
          },
          {
            id: 3,
            title: 'Height & Weight Measurement',
            date: '2025-06-15',
            time: '09:30 - 11:30',
            class: 'Grade 1',
            location: 'Gym',
            assignedTo: 'Nurse Garcia'
          }
        ],
        upcomingVaccinations: [
          {
            id: 1,
            title: 'MMR Booster',
            date: '2025-06-20',
            time: '09:00 - 12:00',
            class: 'Grade 6',
            location: 'Medical Room',
            assignedTo: 'Vaccination Team'
          },
          {
            id: 2,
            title: 'Tdap Vaccination',
            date: '2025-06-25',
            time: '10:00 - 14:00',
            class: 'Grade 7',
            location: 'Medical Room',
            assignedTo: 'Vaccination Team'
          }
        ],
        alerts: [
          {
            id: 1,
            type: 'emergency',
            message: 'Severe allergic reaction reported in the cafeteria',
            timestamp: '2025-06-06T12:35:00',
            priority: 'high',
            resolved: true
          },
          {
            id: 2,
            type: 'outbreak',
            message: 'Increased fever cases in Grade 3, monitoring required',
            timestamp: '2025-06-03T15:20:00',
            priority: 'medium',
            resolved: false
          },
          {
            id: 3,
            type: 'inventory',
            message: 'Low stock of EpiPens (2 remaining)',
            timestamp: '2025-06-05T09:15:00',
            priority: 'medium',
            resolved: false
          },
          {
            id: 4,
            type: 'staff',
            message: 'Nurse Wilson on emergency leave until June 10',
            timestamp: '2025-06-04T08:30:00',
            priority: 'low',
            resolved: false
          }
        ]
      };
      
      setDashboardData(mockData);
      setLoading(false);
    }, 1000);
  }, []);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };
  
  // Data for the medical events chart
  const eventChartData = {
    title: "Medical Events",
    subtitle: `Last ${timeRange}`,
    chartType: "bar",
    data: dashboardData.healthMetrics?.medicalEvents?.trend || [],
    xAxisKey: "date",
    series: [{ name: "Events", key: "count", color: "#4f46e5" }]
  };
  
  // Data for health status breakdown chart
  const healthStatusData = {
    title: "Health Metrics Breakdown",
    subtitle: "Current academic year",
    chartType: "pie",
    data: [
      { name: 'Normal', value: 1097 },
      { name: 'Monitoring', value: 85 },
      { name: 'Treatment', value: 48 },
      { name: 'Special Needs', value: 20 }
    ]
  };
  
  // Data for event type breakdown
  const eventTypeData = {
    title: "Medical Event Types",
    subtitle: "Current academic year",
    chartType: "pie",
    data: Object.entries(dashboardData.healthMetrics?.medicalEvents?.byType || {}).map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: value
    }))
  };
  
  // Helper function for alert priority styling
  const getAlertSeverity = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'info';
    }
  };
  
  // Helper function for event icon
  const getEventIcon = (type) => {
    switch (type) {
      case 'emergency': return <ErrorIcon color="error" />;
      case 'checkup': return <AssignmentIcon color="primary" />;
      case 'vaccination': return <VaccineIcon color="success" />;
      case 'illness': return <MedicalIcon color="warning" />;
      default: return <EventIcon color="default" />;
    }
  };
  
  // Helper function for alert icon
  const getAlertIcon = (type) => {
    switch (type) {
      case 'emergency': return <ErrorIcon />;
      case 'outbreak': return <WarningIcon />;
      case 'inventory': return <AlertIcon />;
      case 'staff': return <PersonIcon />;
      default: return <AlertIcon />;
    }
  };

  return (
    <Box className="p-6">
      <PageHeader
        title="Manager Dashboard"
        subtitle="Overview of school health metrics and activities"
        icon={<DashboardIcon />}
      />
      
      {/* Quick Stats */}
      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Students"
            value={dashboardData.healthMetrics?.totalStudents || 0}
            icon={<GroupIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Medical Events"
            value={dashboardData.healthMetrics?.medicalEvents?.total || 0}
            subtitle="This month"
            icon={<MedicalIcon />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Checkups"
            value={(dashboardData.healthMetrics?.checkups?.completed || 0) + '/' + 
              ((dashboardData.healthMetrics?.checkups?.completed || 0) + (dashboardData.healthMetrics?.checkups?.pending || 0))}
            subtitle="Completed"
            icon={<AssignmentIcon />}
            color="info"
            progress={Math.round((dashboardData.healthMetrics?.checkups?.completed || 0) / 
              ((dashboardData.healthMetrics?.checkups?.completed || 0) + (dashboardData.healthMetrics?.checkups?.pending || 0)) * 100)}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Vaccinations"
            value={(dashboardData.healthMetrics?.vaccinations?.completed || 0) + '/' + 
              ((dashboardData.healthMetrics?.vaccinations?.completed || 0) + (dashboardData.healthMetrics?.vaccinations?.pending || 0))}
            subtitle="Completed"
            icon={<VaccineIcon />}
            color="success"
            progress={Math.round((dashboardData.healthMetrics?.vaccinations?.completed || 0) / 
              ((dashboardData.healthMetrics?.vaccinations?.completed || 0) + (dashboardData.healthMetrics?.vaccinations?.pending || 0)) * 100)}
          />
        </Grid>
      </Grid>
      
      {/* Dashboard Tabs */}
      <Box className="mb-6">
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<DashboardIcon />} label="Overview" iconPosition="start" />
          <Tab icon={<AssessmentIcon />} label="Reports" iconPosition="start" />
          <Tab icon={<GroupIcon />} label="Staff" iconPosition="start" />
          <Tab icon={<AlertIcon />} label="Alerts" iconPosition="start" />
        </Tabs>
      </Box>
      
      {/* Tab Content */}
      {tabValue === 0 && (
        <Grid container spacing={4}>
          {/* Medical Events Trend Chart */}
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Box className="flex justify-between items-center mb-4">
                  <Typography variant="h6">Medical Events Trend</Typography>
                  <FormControl variant="outlined" size="small" style={{ minWidth: 120 }}>
                    <Select
                      value={timeRange}
                      onChange={handleTimeRangeChange}
                      displayEmpty
                    >
                      <MenuItem value="week">Last Week</MenuItem>
                      <MenuItem value="month">Last Month</MenuItem>
                      <MenuItem value="quarter">Last Quarter</MenuItem>
                      <MenuItem value="year">Last Year</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <ChartWidget {...eventChartData} height={300} />
              </CardContent>
            </Card>
          </Grid>
          
          {/* Alerts and Notifications */}
          <Grid item xs={12} lg={4}>
            <Card className="h-full">
              <CardContent>
                <Box className="flex justify-between items-center mb-4">
                  <Typography variant="h6">Alerts & Notifications</Typography>
                  <Button size="small" endIcon={<FilterIcon />}>Filter</Button>
                </Box>
                
                {dashboardData.alerts && dashboardData.alerts.length > 0 ? (
                  <List>
                    {dashboardData.alerts.map((alert) => (
                      <ListItem
                        key={alert.id}
                        className={`mb-2 rounded border-l-4 ${
                          alert.resolved ? 'border-l-gray-300 bg-gray-50' : 
                          `border-l-${getAlertSeverity(alert.priority)}`
                        }`}
                        divider
                      >
                        <ListItemIcon>
                          {getAlertIcon(alert.type)}
                        </ListItemIcon>
                        <ListItemText
                          primary={alert.message}
                          secondary={new Date(alert.timestamp).toLocaleString()}
                        />
                        <Chip 
                          size="small"
                          label={alert.resolved ? "Resolved" : "Active"} 
                          color={alert.resolved ? "default" : getAlertSeverity(alert.priority)}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" className="text-center py-4">
                    No alerts to display
                  </Typography>
                )}
                
                <Box className="mt-4 flex justify-center">
                  <Button variant="outlined" size="small">
                    View All Alerts
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Recent Medical Events */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="mb-4">Recent Medical Events</Typography>
                
                <TimelineWidget
                  events={dashboardData.recentEvents.map(event => ({
                    ...event,
                    date: event.date,
                    time: event.time,
                    tags: [event.class]
                  }))}
                  iconMap={{
                    emergency: <ErrorIcon />,
                    checkup: <AssignmentIcon />,
                    vaccination: <VaccineIcon />,
                    illness: <MedicalIcon />
                  }}
                  colorMap={{
                    emergency: 'error',
                    checkup: 'primary',
                    vaccination: 'success', 
                    illness: 'warning'
                  }}
                  maxItems={3}
                />
                
                <Box className="mt-4 flex justify-center">
                  <Button variant="outlined" size="small">
                    View All Events
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Health Status Overview */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="mb-4">Health Status Overview</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <ChartWidget {...healthStatusData} height={200} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <ChartWidget {...eventTypeData} height={200} />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Upcoming Health Events */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box className="flex justify-between items-center mb-4">
                  <Typography variant="h6">Upcoming Health Events</Typography>
                  <Box>
                    <IconButton size="small">
                      <DateRangeIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small">
                      <PrintIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>Checkups</Typography>
                    {dashboardData.upcomingCheckups && dashboardData.upcomingCheckups.length > 0 ? (
                      <List>
                        {dashboardData.upcomingCheckups.map((event) => (
                          <ListItem
                            key={event.id}
                            className="border rounded mb-2 hover:bg-gray-50"
                          >
                            <ListItemIcon>
                              <AssignmentIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText
                              primary={event.title}
                              secondary={
                                <Box>
                                  <Typography variant="body2">
                                    {event.date} • {event.time}
                                  </Typography>
                                  <Typography variant="body2">
                                    {event.class} • {event.location}
                                  </Typography>
                                </Box>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body2">No upcoming checkups</Typography>
                    )}
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>Vaccinations</Typography>
                    {dashboardData.upcomingVaccinations && dashboardData.upcomingVaccinations.length > 0 ? (
                      <List>
                        {dashboardData.upcomingVaccinations.map((event) => (
                          <ListItem
                            key={event.id}
                            className="border rounded mb-2 hover:bg-gray-50"
                          >
                            <ListItemIcon>
                              <VaccineIcon color="success" />
                            </ListItemIcon>
                            <ListItemText
                              primary={event.title}
                              secondary={
                                <Box>
                                  <Typography variant="body2">
                                    {event.date} • {event.time}
                                  </Typography>
                                  <Typography variant="body2">
                                    {event.class} • {event.location}
                                  </Typography>
                                </Box>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body2">No upcoming vaccinations</Typography>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {tabValue === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom>Reports</Typography>
          {/* Reports Tab Content */}
        </Box>
      )}
      
      {tabValue === 2 && (
        <Box>
          <Typography variant="h6" gutterBottom>Staff</Typography>
          {/* Staff Tab Content */}
        </Box>
      )}
      
      {tabValue === 3 && (
        <Box>
          <Typography variant="h6" gutterBottom>Alerts</Typography>
          {/* Alerts Tab Content */}
        </Box>
      )}
    </Box>
  );
};

export default ManagerDashboard;
