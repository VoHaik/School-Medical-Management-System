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
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingIcon,
  Cancel as CancelIcon, // Add CancelIcon
} from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import MedicationIcon from '@mui/icons-material/Medication';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ChildCareIcon from '@mui/icons-material/ChildCare'; // For child selection
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
    const child = dashboardData.children.find(c => c.studentCode === selectedChildId); // Changed c.id to c.studentCode
    const childName = child ? child.fullName : '';

    const filterItems = (items) => {
      if (!selectedChildId) return items; // Show all if no child selected
      // Ensure items is an array before filtering
      if (!Array.isArray(items)) return []; 
      return items.filter(item => 
        (item.studentName === childName || item.studentCode === selectedChildId) || !item.studentCode // Changed item.studentId to item.studentCode
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

  // This useEffect will re-fetch data if the selectedChildId changes, 
  // or if the current user changes (e.g., on login)
  useEffect(() => {
    console.log("ParentDashboard currentUser state in useEffect:", currentUser); // Debug currentUser
    if (currentUser && currentUser.accessToken) { // Check for accessToken specifically
      fetchDashboardData(); 
    } else if (currentUser && !currentUser.accessToken) {
      console.error("ParentDashboard: currentUser exists but accessToken is missing. Data fetch skipped.", currentUser);
      setLoading(false); // Stop loading if token is missing
      setDashboardData({ // Reset data to avoid errors with undefined properties
        children: [],
        allRecentNotifications: [],
        allUpcomingEvents: [],
        allMedicationRequests: [],
        healthSummary: { totalChildren: 0, activeAlerts: 0, pendingRequests: 0, upcomingEventsCount: 0 }
      });
    } else if (!currentUser) {
      console.log("ParentDashboard: currentUser is null. Waiting for user data. Data fetch skipped.");
      setLoading(false); // Stop loading if no user
       setDashboardData({ // Reset data
        children: [],
        allRecentNotifications: [],
        allUpcomingEvents: [],
        allMedicationRequests: [],
        healthSummary: { totalChildren: 0, activeAlerts: 0, pendingRequests: 0, upcomingEventsCount: 0 }
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, selectedChildId]); // Dependency array remains

  const fetchDashboardData = async () => {
    setLoading(true);

    if (!currentUser || !currentUser.accessToken) {
      console.error("fetchDashboardData: Cannot fetch data, currentUser or accessToken is missing.", currentUser);
      setLoading(false);
      setDashboardData(prevData => ({
        children: prevData.children || [],
        allRecentNotifications: [],
        allUpcomingEvents: [],
        allMedicationRequests: [], // Clear medication requests
        healthSummary: { totalChildren: prevData.children?.length || 0, activeAlerts: 0, pendingRequests: 0, upcomingEventsCount: 0 }
      }));
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${currentUser.accessToken}` };
      console.log(`Fetching children for parent: ${currentUser.username}`);
      const childrenResponse = await axios.get(`/api/parent/students`, { headers });
      const fetchedChildren = childrenResponse.data || [];
      // console.log("Fetched children:", fetchedChildren); // Already logged

      const studentCodeParam = selectedChildId ? `?studentCode=${selectedChildId}` : '';

      if (!currentUser.username) {
        console.error("Parent code (currentUser.username) is not available for fetching dependent data.");
        setLoading(false);
        setDashboardData({
          children: fetchedChildren, // Keep children if fetched
          allRecentNotifications: [],
          allUpcomingEvents: [],
          allMedicationRequests: [],
          healthSummary: { totalChildren: fetchedChildren.length, activeAlerts: 0, pendingRequests: 0, upcomingEventsCount: 0 }
        });
        return;
      }
      
      console.log(`Fetching notifications for parent: ${currentUser.username}, student: ${selectedChildId || 'All'}`);
      const notificationsResponse = await axios.get(`/api/notifications/parent/${currentUser.username}${studentCodeParam}`, { headers });
      const fetchedNotifications = notificationsResponse.data || [];
      // console.log("Fetched notifications:", fetchedNotifications); // Already logged

      console.log(`Fetching events for parent: ${currentUser.username}, student: ${selectedChildId || 'All'}`);
      const eventsResponse = await axios.get(`/api/events/parent/${currentUser.username}${studentCodeParam}`, { headers });
      const fetchedEvents = eventsResponse.data || [];
      // console.log("Fetched events:", fetchedEvents);

      // Fetch medication requests for the parent (no studentCodeParam here, filtered on frontend)
      console.log(`Fetching medication requests for parent: ${currentUser.username}`);
      const medicationRequestsResponse = await axios.get(`/api/medication-requests/parent/${currentUser.username}`, { headers });
      const fetchedMedicationRequests = medicationRequestsResponse.data || [];
      // console.log("Fetched medication requests:", fetchedMedicationRequests);

      setDashboardData({ // Single update with all fetched data
        children: fetchedChildren,
        allRecentNotifications: fetchedNotifications,
        allUpcomingEvents: fetchedEvents,
        allMedicationRequests: fetchedMedicationRequests, // Add this
        // healthSummary will be recalculated by the other useEffect based on this new data
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Preserve children if fetched, clear others
      setDashboardData(prev => ({
          children: prev.children || [], // Keep previously fetched children if any
          allRecentNotifications: [],
          allUpcomingEvents: [],
          allMedicationRequests: [],
          healthSummary: { totalChildren: prev.children?.length || 0, activeAlerts: 0, pendingRequests: 0, upcomingEventsCount: 0 }
      }));
    } finally {
      setLoading(false);
    }
  };

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

  const getChipColor = (status) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'APPROVED': return 'info';
      case 'ADMINISTERED': return 'success';
      case 'REJECTED': return 'error';
      case 'CANCELLED': return 'default'; // Or 'secondary'
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

  const handleCancelRequest = async (requestId) => {
    if (!currentUser || !currentUser.accessToken) {
      alert("Authentication required. Please log in.");
      // Optionally navigate to login or show a modal
      return;
    }
    if (!window.confirm("Are you sure you want to cancel this medication request?")) {
      return;
    }
    try {
      setLoading(true); // Indicate loading state during cancellation
      await axios.delete(`/api/medication-requests/${requestId}`, {
        headers: { Authorization: `Bearer ${currentUser.accessToken}` },
      });
      // alert("Medication request cancelled successfully."); // Consider using a Snackbar for notifications
      fetchDashboardData(); // Refetch data to update the list
    } catch (error) {
      console.error("Error cancelling medication request:", error);
      alert(`Failed to cancel medication request: ${error.response?.data?.message || error.message}`);
      setLoading(false); // Reset loading state on error
    }
    // setLoading(false) will be called in fetchDashboardData's finally block
  };

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

  const selectedChildName = selectedChildId ? dashboardData.children.find(c => c.studentCode === selectedChildId)?.fullName : '' ; // Changed c.id to c.studentCode

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
                  <MenuItem key={child.studentCode} value={child.studentCode}>{child.fullName}</MenuItem> // Changed child.id to child.studentCode
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
                    navigate(action.path, { state: { studentCode: selectedChildId } }); // Changed studentId to studentCode
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
          <List sx={{ width: '100%' }}>
            {displayData.medicationRequests.map((request) => (
              <Paper component="li" key={request.requestId} elevation={2} sx={{ mb: 2, borderRadius: 2, '&:hover': { boxShadow: 5 } }}>
                <ListItem alignItems="flex-start" sx={{ p: 2 }}>
                  <ListItemAvatar sx={{ mr: 2, mt: 0.5 }}>
                    <Avatar sx={{ bgcolor: getStatusColor(request.status), width: 48, height: 48 }}>
                      <MedicationIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primaryTypographyProps={{ variant: 'h6', fontWeight: 'medium', mb: 0.5 }}
                    primary={`${request.medicationName || 'N/A'}`}
                    secondary={
                      <>
                        <Typography component="div" variant="body2" color="text.primary">
                          Student: <Chip label={request.studentName || 'N/A'} size="small" icon={<PersonIcon />} sx={{mr:1}}/>
                          Status: <Chip label={request.status || 'N/A'} size="small" color={getChipColor(request.status)} />
                        </Typography>
                        <Typography component="div" variant="body2" color="text.secondary" sx={{mt: 0.5}}>
                          Requested: {request.requestDate ? new Date(request.requestDate).toLocaleDateString() : 'N/A'}
                        </Typography>
                        {request.reason && (
                          <Typography component="div" variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, fontStyle: 'italic' }}>
                            Reason: {request.reason}
                          </Typography>
                        )}
                      </>
                    }
                  />
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'row', sm: 'column' }, alignItems: 'center', gap: 1, pt: {xs: 1, sm: 0}, ml: 'auto', mt: {xs:1, sm:0.5} }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<ViewIcon />}
                      onClick={() => navigate(`/parent/medication-request/${request.requestId}`)} // Ensure this route exists or will be created
                      sx={{minWidth: '105px', mb: {sm: 0.5}}}
                    >
                      Details
                    </Button>
                    {(request.status === 'PENDING' || request.status === 'SUBMITTED') && ( // SUBMITTED if that's a possible initial status
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={() => handleCancelRequest(request.requestId)}
                        sx={{minWidth: '105px'}}
                      >
                        Cancel
                      </Button>
                    )}
                  </Box>
                </ListItem>
              </Paper>
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
              <Grid item xs={12} sm={6} md={4} key={child.studentCode}> // Changed child.id to child.studentCode
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
                        navigate('/parent/health-declaration', { state: { studentCode: selectedChildForDialog.studentCode } }); // Changed studentId to studentCode and used studentCode
                    }}
                >View Health Declaration</Button>
                <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => {
                        setChildDetailsOpen(false);
                        navigate('/parent/medication-submission', { state: { studentCode: selectedChildForDialog.studentCode } }); // Changed studentId to studentCode and used studentCode
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
