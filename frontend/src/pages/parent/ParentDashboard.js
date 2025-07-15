import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  IconButton,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Divider,
  Badge,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  MedicalServices as MedicalIcon,
  Assignment as AssignmentIcon,
  Vaccines as VaccineIcon,
  LocalPharmacy as PharmacyIcon,
  Notifications as NotificationIcon,
  ContactPhone as ContactIcon,
  HealthAndSafety,
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,  Schedule as ScheduleIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingIcon,
  ChildCare as ChildCareIcon
} from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import MedicationIcon from '@mui/icons-material/Medication';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { CalendarToday } from '@mui/icons-material'; // Ensured CalendarToday is imported

const ParentDashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [dashboardData, setDashboardData] = useState({
    children: [],
    allRecentNotifications: [], 
    allUpcomingEvents: [],
    allMedicationRequests: [],
    healthSummary: {}
  });
  const [selectedChildId, setSelectedChildId] = useState('');
  const [childDetailsOpen, setChildDetailsOpen] = useState(false);
  const [selectedChildForDialog, setSelectedChildForDialog] = useState(null);

  const [displayData, setDisplayData] = useState({
    recentNotifications: [],
    upcomingEvents: [],
    medicationRequests: [],
  });

  useEffect(() => {
    if (currentUser) {
      fetchDashboardData();
    }
  }, [currentUser]);

  useEffect(() => {
    const child = dashboardData.children.find(c => c.id === selectedChildId);
    const childName = child ? child.fullName : '';

    const filterItems = (items) => {
      if (!selectedChildId) return items; // Show all if no child selected
      // Ensure items is an array before filtering
      if (!Array.isArray(items)) return []; 
      return items.filter(item => 
        (item.studentName === childName || item.studentId === selectedChildId) || !item.studentId // Include items not tied to a student
      );
    };

    setDisplayData({
      recentNotifications: filterItems(dashboardData.allRecentNotifications),
      upcomingEvents: filterItems(dashboardData.allUpcomingEvents),
      medicationRequests: filterItems(dashboardData.allMedicationRequests),
    });

    // Recalculate health summary
    const filteredNotifications = filterItems(dashboardData.allRecentNotifications);
    const filteredMedicationRequests = filterItems(dashboardData.allMedicationRequests);
    const filteredEvents = filterItems(dashboardData.allUpcomingEvents);

    setDashboardData(prevData => ({
      ...prevData,
      healthSummary: {
        totalChildren: prevData.children.length,
        activeAlerts: Array.isArray(filteredNotifications) ? filteredNotifications.filter(n => n.priority === 'high').length : 0,
        pendingRequests: Array.isArray(filteredMedicationRequests) ? filteredMedicationRequests.filter(r => r.status === 'pending').length : 0,
        upcomingEventsCount: Array.isArray(filteredEvents) ? filteredEvents.length : 0,
      }
    }));

  }, [selectedChildId, dashboardData.allRecentNotifications, dashboardData.allUpcomingEvents, dashboardData.allMedicationRequests, dashboardData.children]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!currentUser || !currentUser.id) {
        setLoading(false);
        return;
      }

      // Fetch children first
      const childrenResponse = await axios.get(`/api/students/parent/${currentUser.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const fetchedChildren = childrenResponse.data || [];
      setDashboardData(prev => ({ ...prev, children: fetchedChildren }));

      // If a child is selected, fetch their specific data, otherwise fetch general data for the parent
      const studentIdParam = selectedChildId ? `?studentId=${selectedChildId}` : '';

      // Fetch Notifications
      const notificationsResponse = await axios.get(`/api/notifications/parent/${currentUser.id}${studentIdParam}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const fetchedNotifications = notificationsResponse.data || [];

      // Fetch Events
      const eventsResponse = await axios.get(`/api/events/parent/${currentUser.id}${studentIdParam}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const fetchedEvents = eventsResponse.data || [];

      // Fetch Medication Summary/Requests
      // This endpoint specifically requires studentId for the summary as per current backend mock.
      // If no child is selected, we might fetch an aggregated summary or an empty list.
      // For now, if no child is selected, we'll fetch an empty list for medication requests.
      let fetchedMedicationRequests = [];
      if (selectedChildId) {
        const medicationResponse = await axios.get(`/api/medication-submissions/summary/parent/${currentUser.id}?studentId=${selectedChildId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchedMedicationRequests = medicationResponse.data || [];
      } else {
        // Optional: Fetch all medication requests for all children if an endpoint exists and is desired
        // Or, fetch a parent-level summary if that makes sense for your application
        // For now, keeping it empty if no specific child is selected for medication summary.
      }

      setDashboardData(prevData => ({
        ...prevData,
        children: fetchedChildren, // Ensure children are updated
        allRecentNotifications: fetchedNotifications,
        allUpcomingEvents: fetchedEvents,
        allMedicationRequests: fetchedMedicationRequests,
        // Health summary will be recalculated by the useEffect hook that depends on these arrays and selectedChildId
      }));

    } catch (error) {
      console.error('Error fetching dashboard data:', error.response ? error.response.data : error);
      // Set empty arrays on error to prevent issues with .filter or .map
      setDashboardData(prevData => ({
        ...prevData, // Keep children if already fetched
        allRecentNotifications: [],
        allUpcomingEvents: [],
        allMedicationRequests: [],
      }));
    } finally {
      setLoading(false);
    }
  };

  // This useEffect will re-fetch data if the selectedChildId changes, 
  // or if the current user changes (e.g., on login)
  useEffect(() => {
    if (currentUser && currentUser.id) {
      fetchDashboardData(); 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, selectedChildId]); // Re-fetch when selectedChildId changes

  // This useEffect is for filtering and setting displayData and healthSummary
  // It should run AFTER fetchDashboardData updates the `all*` arrays.
  useEffect(() => {
    const child = dashboardData.children.find(c => c.id === selectedChildId);
    const childName = child ? child.fullName : ''; // Not used in current filter logic but kept for context

    // If selectedChildId is present, the fetched data is already specific to that child (for notifications, events, meds).
    // If selectedChildId is NOT present, fetched data is general for the parent.
    // So, the `filterItems` logic might be redundant if backend already filters by studentId.
    // However, if backend returns all items for a parent and frontend needs to filter, it's useful.
    // For now, assuming backend handles filtering if studentId is passed.
    // If studentId is NOT passed to backend, then frontend filtering is essential.

    // Let's assume the `all*` arrays are now correctly populated (either all for parent, or specific to child)
    // The current `fetchDashboardData` fetches child-specific data if `selectedChildId` is set.
    // So, no additional frontend filtering is strictly needed if `selectedChildId` was used in API calls.

    setDisplayData({
      recentNotifications: dashboardData.allRecentNotifications, // Already filtered by backend if selectedChildId was used
      upcomingEvents: dashboardData.allUpcomingEvents, // Already filtered by backend if selectedChildId was used
      medicationRequests: dashboardData.allMedicationRequests, // Already filtered by backend if selectedChildId was used
    });

    // Recalculate health summary based on the (potentially filtered by backend) data
    setDashboardData(prevData => ({
      ...prevData,
      healthSummary: {
        totalChildren: prevData.children.length,
        activeAlerts: Array.isArray(prevData.allRecentNotifications) ? prevData.allRecentNotifications.filter(n => n.type === 'HEALTH_FORM_DUE' || n.priority === 'high').length : 0, // Example: count high priority or specific types
        pendingRequests: Array.isArray(prevData.allMedicationRequests) ? prevData.allMedicationRequests.filter(r => r.status && r.status.toUpperCase() === 'PENDING_APPROVAL').length : 0,
        upcomingEventsCount: Array.isArray(prevData.allUpcomingEvents) ? prevData.allUpcomingEvents.length : 0,
      }
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChildId, dashboardData.allRecentNotifications, dashboardData.allUpcomingEvents, dashboardData.allMedicationRequests, dashboardData.children]);

  // Initial fetch when component mounts and currentUser is available
  useEffect(() => {
    if (currentUser && currentUser.id) {
        fetchDashboardData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]); // Initial fetch based on currentUser only

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleViewChildDetails = (child) => {
    setSelectedChildForDialog(child);
    setChildDetailsOpen(true);
  };

  const handleChildSelectionChange = (event) => {
    setSelectedChildId(event.target.value);
    setActiveTab(0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const TabPanel = ({ children, value, index, ...other }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`parent-tabpanel-${index}`}
      aria-labelledby={`parent-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <LinearProgress sx={{ width: '50%' }} />
      </Box>
    );
  }

  const quickActions = [
    {
      title: 'Health Declaration',
      icon: <AssignmentIcon color="primary" sx={{ fontSize: 40 }} />,
      path: '/parent/health-declaration',
      description: 'Submit or update health forms.'
    },
    {
      title: 'Medication Submission',
      icon: <PharmacyIcon color="secondary" sx={{ fontSize: 40 }} />,
      path: '/parent/medication-submission',
      description: 'Request medication administration.'
    },
    {
      title: 'View Appointments',
      icon: <CalendarToday color="success" sx={{ fontSize: 40 }} />,
      path: '/parent/appointments', 
      description: 'Check upcoming school health appointments.'
    }
  ];

  const selectedChildName = selectedChildId ? dashboardData.children.find(c => c.id === selectedChildId)?.fullName : '' ;

  return (
    <Box sx={{ p: 3, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>
              Parent Dashboard
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Welcome, {currentUser?.fullName || 'Parent'}! Manage your children's health information here.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, mt: { xs: 2, md: 0 } }}>
            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel id="select-child-label">Select Child</InputLabel>
              <Select
                labelId="select-child-label"
                id="select-child"
                value={selectedChildId}
                label="Select Child"
                onChange={handleChildSelectionChange}
              >
                <MenuItem value="">
                  <em>All Children / Overview</em>
                </MenuItem>
                {dashboardData.children.map((child) => (
                  <MenuItem key={child.id} value={child.id}>{child.fullName}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#e3f2fd', color: '#0d47a1' }}>
            <CardContent>
              <Typography variant="h6">Total Children</Typography>
              <Typography variant="h4">{dashboardData.healthSummary.totalChildren}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#fff3e0', color: '#e65100' }}>
            <CardContent>
              <Typography variant="h6">Active Alerts {selectedChildName ? `(${selectedChildName})` : ''}</Typography>
              <Typography variant="h4">{dashboardData.healthSummary.activeAlerts}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#e8f5e9', color: '#1b5e20' }}>
            <CardContent>
              <Typography variant="h6">Pending Requests {selectedChildName ? `(${selectedChildName})` : ''}</Typography>
              <Typography variant="h4">{dashboardData.healthSummary.pendingRequests}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#fce4ec', color: '#ad1457' }}>
            <CardContent>
              <Typography variant="h6">Upcoming Events {selectedChildName ? `(${selectedChildName})` : ''}</Typography>
              <Typography variant="h4">{dashboardData.healthSummary.upcomingEventsCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>Quick Actions {selectedChildName ? `for ${selectedChildName}` : ''}</Typography>
        <Grid container spacing={2}>
          {quickActions.map((action) => (
            <Grid item xs={12} sm={6} md={4} key={action.title}>
              <Card 
                elevation={2} 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  '&:hover': { boxShadow: 6 }
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  {action.icon}
                  <Typography variant="h6" sx={{ mt: 1 }}>{action.title}</Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>{action.description}</Typography>
                </CardContent>
                <Button 
                  variant="contained" 
                  fullWidth 
                  onClick={() => {
                    navigate(action.path, { state: { studentId: selectedChildId } });
                  }}
                  sx={{ 
                    borderTopLeftRadius: 0, 
                    borderTopRightRadius: 0,
                    py: 1.5
                  }}
                >
                  Go to {action.title}
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Tabs value={activeTab} onChange={handleTabChange} indicatorColor="primary" textColor="primary" variant="fullWidth">
        <Tab label={`Notifications (${displayData.recentNotifications.length})`} icon={<NotificationIcon />} />
        <Tab label={`Upcoming Events (${displayData.upcomingEvents.length})`} icon={<CalendarIcon />} />
        <Tab label={`Medication Requests (${displayData.medicationRequests.length})`} icon={<PharmacyIcon />} />
        <Tab label="My Children" icon={<PersonIcon />} />
      </Tabs>
      <Divider sx={{ mb: 2 }}/>

      <TabPanel value={activeTab} index={0}>
        <Typography variant="h5" gutterBottom>Recent Notifications {selectedChildName ? `for ${selectedChildName}` : ''}</Typography>
        {displayData.recentNotifications.length > 0 ? (
          <List>
            {displayData.recentNotifications.map((notification) => (
              <ListItem 
                key={notification.id} 
                divider 
                sx={{
                  mb: 1, 
                  p:2, 
                  borderRadius: 1, 
                  boxShadow: 1,
                  backgroundColor: notification.priority === 'high' ? '#ffebee' : notification.priority === 'medium' ? '#fff3e0' : 'white'
                }}
              >
                <ListItemIcon>
                  <Badge color={getPriorityColor(notification.priority)} variant="dot">
                    <NotificationIcon />
                  </Badge>
                </ListItemIcon>
                <ListItemText 
                  primary={`${notification.title} ${notification.studentName ? '('+notification.studentName+')' : ''}`}
                  secondary={`${notification.message} - ${new Date(notification.date).toLocaleDateString()}`}
                />
                 <Chip label={notification.priority || 'normal'} color={getPriorityColor(notification.priority)} size="small" />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>No recent notifications{selectedChildName ? ` for ${selectedChildName}` : ''}.</Typography>
        )}
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <Typography variant="h5" gutterBottom>Upcoming School Health Events {selectedChildName ? `for ${selectedChildName}` : ''}</Typography>
        {displayData.upcomingEvents.length > 0 ? (
          <Grid container spacing={2}>
            {displayData.upcomingEvents.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                <Card sx={{height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                  <CardContent>
                    <ListItemIcon sx={{minWidth: 'auto', mr: 1, color: 'primary.main'}}>
                      {event.type === 'vaccination' ? <VaccineIcon /> : <ScheduleIcon />}
                    </ListItemIcon>
                    <Typography variant="h6">{event.title} {event.student ? `(${event.student})` : ''}</Typography>
                    <Typography color="textSecondary">Date: {new Date(event.date).toLocaleDateString()} at {event.time}</Typography>
                    <Typography color="textSecondary">Location: {event.location}</Typography>
                  </CardContent>
                  <Button size="small" sx={{mt: 'auto'}}>View Details</Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography>No upcoming events{selectedChildName ? ` for ${selectedChildName}` : ''}.</Typography>
        )}
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <Typography variant="h5" gutterBottom>Medication Requests {selectedChildName ? `for ${selectedChildName}` : ''}</Typography>
        {displayData.medicationRequests.length > 0 ? (
          <List>
            {displayData.medicationRequests.map((request) => (
              <ListItem key={request.id} divider sx={{mb: 1, p:2, borderRadius: 1, boxShadow: 1}}>
                <ListItemIcon>
                  <PharmacyIcon color={getStatusColor(request.status)} />
                </ListItemIcon>
                <ListItemText 
                  primary={`${request.medicationName} ${request.student ? '('+request.student+')' : ''}`}
                  secondary={`Submitted: ${new Date(request.submittedDate).toLocaleDateString()} ${request.approvedDate ? '- Approved: ' + new Date(request.approvedDate).toLocaleDateString() : ''}`}
                />
                <Chip label={request.status} color={getStatusColor(request.status)} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>No medication requests{selectedChildName ? ` for ${selectedChildName}` : ''}.</Typography>
        )}
      </TabPanel>

      <TabPanel value={activeTab} index={3}>
        <Typography variant="h5" gutterBottom>My Children</Typography>
        {dashboardData.children.length > 0 ? (
          <Grid container spacing={2}>
            {dashboardData.children.map((child) => (
              <Grid item xs={12} sm={6} md={4} key={child.id}>
                <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ width: 56, height: 56, mr: 2, bgcolor: 'secondary.main' }}>
                        <PersonIcon fontSize="large" />
                      </Avatar>
                      <Box>
                        <Typography variant="h6">{child.fullName}</Typography>
                        <Typography variant="body2" color="textSecondary">Grade: {child.grade || 'N/A'}</Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="textSecondary">DOB: {child.dateOfBirth ? new Date(child.dateOfBirth).toLocaleDateString() : 'N/A'}</Typography>
                    {/* Add more quick info if available */}
                  </CardContent>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    onClick={() => handleViewChildDetails(child)}
                    sx={{ borderTopLeftRadius: 0, borderTopRightRadius: 0}}
                  >
                    View Details
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography>No children found.</Typography>
        )}
      </TabPanel>

      <Dialog open={childDetailsOpen} onClose={() => setChildDetailsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Child Details</DialogTitle>
        <DialogContent>
          {selectedChildForDialog && (
            <Box>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}>
                    <PersonIcon sx={{ fontSize: 50 }} />
                  </Avatar>
                </Grid>
                <Grid item xs>
                  <Typography variant="h5">{selectedChildForDialog.fullName}</Typography>
                  <Typography variant="body1" color="textSecondary">Grade: {selectedChildForDialog.grade || 'N/A'}</Typography>
                  <Typography variant="body1" color="textSecondary">DOB: {selectedChildForDialog.dateOfBirth ? new Date(selectedChildForDialog.dateOfBirth).toLocaleDateString() : 'N/A'}</Typography>
                </Grid>
              </Grid>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Key Health Info</Typography>
              <Typography variant="body2">Allergies: {selectedChildForDialog.allergies || 'None reported'}</Typography>
              <Typography variant="body2">Medical Conditions: {selectedChildForDialog.conditions || 'None reported'}</Typography>
              
              <Box sx={{ mt: 2, display: 'flex', gap: 1}}>
                <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => {
                        setChildDetailsOpen(false);
                        navigate('/parent/health-declaration', { state: { studentId: selectedChildForDialog.id } });
                    }}
                >View Health Declaration</Button>
                <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => {
                        setChildDetailsOpen(false);
                        navigate('/parent/medication-submission', { state: { studentId: selectedChildForDialog.id } });
                    }}
                >Manage Medications</Button>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChildDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ParentDashboard;
