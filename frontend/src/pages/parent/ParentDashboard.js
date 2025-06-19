import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItemAvatar,
  Badge,
  LinearProgress
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import {
  NotificationsActive as NotificationsActiveIcon,
  CalendarToday,
  ListAlt as ListAltIcon,
  Person as PersonIcon,
  MedicalServices,
  EventAvailable as EventAvailableIcon,
  Warning as WarningIcon,
  ChildCare as ChildCareIcon,
  Visibility as ViewIcon,
  Cancel as CancelIcon,
  Notifications as NotificationIcon,
  HealthAndSafety,
  LocalPharmacy as PharmacyIcon,
  Schedule as ScheduleIcon,
  Event as EventIcon,
  Contacts as ContactIcon,
  Assignment as AssignmentIcon,
  Vaccines as VaccineIcon
} from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ParentDashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
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

  // Restore displayData state
  const [displayData, setDisplayData] = useState({
    recentNotifications: [],
    upcomingEvents: [],
    medicationRequests: [],
  });

  // Initial fetch or when user changes (e.g. login)
  useEffect(() => {
    if (currentUser && currentUser.accessToken) {
      fetchDashboardData();
    } else {
      setLoading(false); // Stop loading if no user/token
      setDashboardData({ // Reset data
        children: [], allRecentNotifications: [], allUpcomingEvents: [], allMedicationRequests: [],
        healthSummary: { totalChildren: 0, activeAlerts: 0, pendingRequests: 0, upcomingEventsCount: 0 }
      });
    }
  }, [currentUser]);

  // Restore useEffect for populating displayData and healthSummary
  useEffect(() => {
    const currentChildren = dashboardData.children || [];
    const child = currentChildren.find(c => c.studentCode === selectedChildId);
    const childName = child ? child.fullName : '';

    // Log children data for debugging
    console.log("Current children data:", currentChildren);

    const filterItems = (items) => {
      if (!Array.isArray(items)) return [];
      if (!selectedChildId) return items; // If no child selected, show all items for the parent
      // Filter items that are explicitly for the selected child OR have no student code (general items)
      return items.filter(item =>
        item.studentCode === selectedChildId || item.studentName === childName || !item.studentCode
      );
    };

    const filteredNotifications = filterItems(dashboardData.allRecentNotifications);
    const filteredMedicationRequests = filterItems(dashboardData.allMedicationRequests);
    const filteredEvents = filterItems(dashboardData.allUpcomingEvents);

    setDisplayData({
      recentNotifications: filteredNotifications,
      upcomingEvents: filteredEvents,
      medicationRequests: filteredMedicationRequests,
    });

    // Create a separate healthSummary object with accurate children count
    const updatedHealthSummary = {
      totalChildren: currentChildren.length,
      activeAlerts: Array.isArray(filteredNotifications) ? filteredNotifications.filter(n => n.priority === 'high').length : 0,
      pendingRequests: Array.isArray(filteredMedicationRequests) ? filteredMedicationRequests.filter(r => r.status === 'PENDING' || r.status === 'SUBMITTED').length : 0,
      upcomingEventsCount: Array.isArray(filteredEvents) ? filteredEvents.length : 0,
    };
    
    console.log("Updated health summary:", updatedHealthSummary);
    
    setDashboardData(prevData => ({
      ...prevData,
      healthSummary: updatedHealthSummary
    }));

  }, [selectedChildId, dashboardData.allRecentNotifications, dashboardData.allUpcomingEvents, dashboardData.allMedicationRequests, dashboardData.children]);

  // This useEffect will re-fetch data if the selectedChildId changes,
  // or if the current user changes (e.g., on login)
  useEffect(() => {
    console.log("ParentDashboard currentUser state in useEffect:", currentUser); // Debug currentUser
    if (currentUser && currentUser.accessToken) {
      fetchDashboardData();
    } else if (currentUser && !currentUser.accessToken) {
      console.error("ParentDashboard: currentUser exists but accessToken is missing. Data fetch skipped.", currentUser);
      setLoading(false); // Stop loading if token is missing
      setDashboardData({ // Reset data
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
  }, [currentUser, selectedChildId]); // fetchDashboardData will use selectedChildId
  const fetchDashboardData = async () => {
    setLoading(true);

    if (!currentUser || !currentUser.accessToken) {
      console.error("fetchDashboardData: Cannot fetch data, currentUser or accessToken is missing.", currentUser);
      setLoading(false);
      setDashboardData(prev => ({ 
        ...prev, 
        allRecentNotifications: [], 
        allUpcomingEvents: [], 
        allMedicationRequests: [], 
        healthSummary: { 
          ...(prev.healthSummary || {}), 
          activeAlerts: 0, 
          pendingRequests: 0, 
          upcomingEventsCount: 0 
        } 
      }));
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${currentUser.accessToken}` };
      
      // Fetch children data first - this is critical
      console.log(`Fetching children for parent: ${currentUser.username}`);
      let childrenData = [];
      try {
        const childrenResponse = await axios.get(`/api/parent/students`, { headers });
        childrenData = childrenResponse.data || [];
      } catch (childError) {
        console.error('Error fetching children data:', childError);
        // If we can't get children, show empty state with error
        setDashboardData(prev => ({
          ...prev,
          children: [], 
          healthSummary: { totalChildren: 0, activeAlerts: 0, pendingRequests: 0, upcomingEventsCount: 0 }
        }));
        setLoading(false);
        return;
      }
      
      if (!childrenData || childrenData.length === 0) {
        console.warn("No children found for this parent");
      }

      const studentCodeParam = selectedChildId ? `?studentCode=${selectedChildId}` : '';
      const parentUsername = currentUser.username;

      if (!parentUsername) {
        console.error("Parent code (currentUser.username) is not available for fetching dependent data.");
        setLoading(false);
        setDashboardData(prev => ({
          ...prev,
          children: childrenData, 
          allRecentNotifications: [],
          allUpcomingEvents: [],
          allMedicationRequests: [],
          healthSummary: { ...prev.healthSummary, totalChildren: childrenData.length, activeAlerts: 0, pendingRequests: 0, upcomingEventsCount: 0 }
        }));
        return;
      }
      
      // Fetch notifications, events, and medication requests in parallel
      // Using Promise.allSettled to continue even if some requests fail
      const [notificationsResult, eventsResult, medicationRequestsResult] = await Promise.allSettled([
        // Notifications request
        (async () => {
          console.log(`Fetching notifications for parent: ${parentUsername}, student: ${selectedChildId || 'All'}`);
          try {
            const response = await axios.get(`/api/notifications/parent/${parentUsername}${studentCodeParam}`, { headers });
            return response.data || [];
          } catch (error) {
            console.error('Error fetching notifications:', error);
            return [];
          }
        })(),
        
        // Events request
        (async () => {
          console.log(`Fetching events for parent: ${parentUsername}, student: ${selectedChildId || 'All'}`);
          try {
            const response = await axios.get(`/api/events/parent/${parentUsername}${studentCodeParam}`, { headers });
            return response.data || [];
          } catch (error) {
            console.error('Error fetching events:', error);
            return [];
          }
        })(),
        
        // Medication requests
        (async () => {
          console.log(`Fetching medication requests for parent: ${parentUsername}`);
          try {
            const response = await axios.get(`/api/medication-requests/parent/${parentUsername}${studentCodeParam}`, { headers });
            return response.data || [];
          } catch (error) {
            console.error('Error fetching medication requests:', error);
            return [];
          }
        })()
      ]);
      
      // Extract data from Promise results
      const fetchedNotifications = notificationsResult.status === 'fulfilled' ? notificationsResult.value : [];
      const fetchedEvents = eventsResult.status === 'fulfilled' ? eventsResult.value : [];
      const fetchedMedicationRequests = medicationRequestsResult.status === 'fulfilled' ? medicationRequestsResult.value : [];
      
      setDashboardData({
        children: childrenData,
        allRecentNotifications: fetchedNotifications,
        allUpcomingEvents: fetchedEvents,
        allMedicationRequests: fetchedMedicationRequests,
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData(prev => ({ 
        ...prev, 
        allRecentNotifications: [],
        allUpcomingEvents: [],
        allMedicationRequests: [],
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleChildChange = (event) => {
    setSelectedChildId(event.target.value);
  };

  const handleViewChildDetails = (child) => {
    setSelectedChildForDialog(child);
    setChildDetailsOpen(true);
  };

  const closeChildDetailsDialog = () => {
    setChildDetailsOpen(false);
    setSelectedChildForDialog(null);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
      case 'ADMINISTERED':
        return theme.palette.success.main;
      case 'PENDING':
      case 'SUBMITTED':
        return theme.palette.warning.main;
      case 'REJECTED':
      case 'CANCELLED':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getChipColor = (status) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'APPROVED': return 'info';
      case 'ADMINISTERED': return 'success';
      case 'REJECTED': return 'error';
      case 'CANCELLED': return 'default'; 
      default: return 'default';
    }
  };

  const handleCancelRequest = async (requestId) => {
    if (!currentUser || !currentUser.accessToken) {
      alert("Authentication required. Please log in.");
      return;
    }
    if (!window.confirm("Are you sure you want to cancel this medication request?")) {
      return;
    }
    try {
      setLoading(true); 
      await axios.delete(`/api/medication-requests/${requestId}`, {
        headers: { Authorization: `Bearer ${currentUser.accessToken}` },
      });
      fetchDashboardData(); 
    } catch (error) {
      console.error("Error cancelling medication request:", error);
      alert(`Failed to cancel medication request: ${error.response?.data?.message || error.message}`);
      setLoading(false); 
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 64px)' }}>
        <LinearProgress sx={{ width: '50%' }} />
      </Box>
    );
  }

  const { recentNotifications, upcomingEvents, medicationRequests } = displayData;
  return (
    <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 3 } }}>
      <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">Parent Dashboard</Typography>          <FormControl sx={{ minWidth: 200 }}>
            <Select
              value={selectedChildId}
              displayEmpty
              onChange={handleChildChange}
              sx={{ 
                borderRadius: 1,
                border: '1px solid rgba(0, 0, 0, 0.23)',
                py: 0.5,
                px: 1
              }}
              renderValue={(selected) => {
                if (!selected) {
                  return <Box>Select Child</Box>;
                }
                const selectedChild = dashboardData.children.find(child => child.studentCode === selected);
                return selectedChild ? selectedChild.fullName : "Select Child";
              }}
            >
              <MenuItem value="">
                <em>Select Child</em>
              </MenuItem>
              {dashboardData.children.map((child) => (
                <MenuItem key={child.studentCode} value={child.studentCode}>
                  {child.fullName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Typography variant="subtitle1" sx={{ pt: 1 }}>
          Welcome, Jennifer Smith! Manage your children's health information here.
        </Typography>
      </Paper>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>          <Paper 
            elevation={2} 
            sx={{ 
              bgcolor: '#e3f2fd', 
              height: '100%',
              borderRadius: 1,
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6
              }
            }} 
            onClick={() => setActiveTab(3)}
          >
            <Box sx={{ p: 3, textAlign: 'left' }}>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 'normal' }}>
                Total Children
              </Typography>
              <Typography variant="h2" color="primary" sx={{ fontWeight: 'normal', pt: 1 }}>
                {dashboardData.children?.length || 0}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>          <Paper 
            elevation={2} 
            sx={{ 
              bgcolor: '#fff3e0', 
              height: '100%',
              borderRadius: 1, 
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6
              }
            }} 
            onClick={() => setActiveTab(0)}
          >
            <Box sx={{ p: 3, textAlign: 'left' }}>
              <Typography variant="h6" color="error" sx={{ fontWeight: 'normal' }}>
                Active Alerts
              </Typography>
              <Typography variant="h2" color="error" sx={{ fontWeight: 'normal', pt: 1 }}>
                {dashboardData.healthSummary?.activeAlerts || 0}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>          <Paper 
            elevation={2} 
            sx={{ 
              bgcolor: '#e8f5e9', 
              height: '100%',
              borderRadius: 1, 
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6
              }
            }} 
            onClick={() => setActiveTab(2)}
          >
            <Box sx={{ p: 3, textAlign: 'left' }}>
              <Typography variant="h6" sx={{ fontWeight: 'normal', color: 'green' }}>
                Pending Requests
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 'normal', color: 'green', pt: 1 }}>
                {dashboardData.healthSummary?.pendingRequests || 0}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>          <Paper 
            elevation={2} 
            sx={{ 
              bgcolor: '#fce4ec', 
              height: '100%',
              borderRadius: 1,
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6
              }
            }} 
            onClick={() => setActiveTab(1)}
          >
            <Box sx={{ p: 3, textAlign: 'left' }}>
              <Typography variant="h6" sx={{ fontWeight: 'normal', color: '#d81b60' }}>
                Upcoming Events
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 'normal', color: '#d81b60', pt: 1 }}>
                {dashboardData.healthSummary?.upcomingEventsCount || 0}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>      <Typography variant="h5" gutterBottom>Quick Actions</Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            borderRadius: 1,
            boxShadow: 2,
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 6
            }
          }}>
            <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
              <Box sx={{ color: '#3f51b5', fontSize: '48px', mb: 2 }}>
                <ListAltIcon fontSize="inherit" />
              </Box>
              <Typography variant="h6">Health Declaration</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Submit or update health forms.
              </Typography>
            </CardContent>
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              onClick={() => navigate('/parent/health-declaration')}
              sx={{ 
                mt: 'auto', 
                borderTopLeftRadius: 0, 
                borderTopRightRadius: 0,
                py: 1.5,
                bgcolor: '#3f51b5'
              }}
            >
              GO TO HEALTH DECLARATION
            </Button>
          </Card>
        </Grid>        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            borderRadius: 1,
            boxShadow: 2,
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 6
            }
          }}>
            <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
              <Box sx={{ color: '#00bcd4', fontSize: '48px', mb: 2 }}>
                <MedicalServices fontSize="inherit" />
              </Box>
              <Typography variant="h6">Medication Submission</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Request medication administration.
              </Typography>
            </CardContent>
            <Button 
              variant="contained" 
              color="primary"
              fullWidth
              onClick={() => navigate('/parent/submit-medication')}
              sx={{ 
                mt: 'auto', 
                borderTopLeftRadius: 0, 
                borderTopRightRadius: 0,
                py: 1.5,
                bgcolor: '#3f51b5' 
              }}
            >
              GO TO MEDICATION SUBMISSION
            </Button>
          </Card>
        </Grid>        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            borderRadius: 1,
            boxShadow: 2,
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 6
            }
          }}>
            <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
              <Box sx={{ color: '#4caf50', fontSize: '48px', mb: 2 }}>
                <CalendarToday fontSize="inherit" />
              </Box>
              <Typography variant="h6">View Appointments</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Check upcoming school health appointments.
              </Typography>
            </CardContent>
            <Button 
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => navigate('/parent/appointments')}
              sx={{ 
                mt: 'auto', 
                borderTopLeftRadius: 0, 
                borderTopRightRadius: 0,
                py: 1.5,
                bgcolor: '#3f51b5'
              }}
            >
              GO TO VIEW APPOINTMENTS
            </Button>
          </Card>
        </Grid>
      </Grid>      <Paper sx={{ width: '100%', mb: 4, boxShadow: 2, borderRadius: 1, overflow: 'hidden' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          aria-label="dashboard tabs"
          sx={{ bgcolor: '#f5f5f5' }}
        >
          <Tab 
            icon={<NotificationsActiveIcon />} 
            iconPosition="start"
            label={`NOTIFICATIONS (${recentNotifications.length || 0})`} 
            sx={{ 
              textTransform: 'uppercase',
              fontWeight: 'medium',
              fontSize: '0.75rem',
              py: 2
            }}
          />
          <Tab 
            icon={<EventIcon />} 
            iconPosition="start"
            label={`UPCOMING EVENTS (${upcomingEvents.length || 0})`} 
            sx={{ 
              textTransform: 'uppercase',
              fontWeight: 'medium',
              fontSize: '0.75rem',
              py: 2
            }}
          />
          <Tab 
            icon={<PharmacyIcon />} 
            iconPosition="start"
            label={`MEDICATION REQUESTS (${medicationRequests.length || 0})`} 
            sx={{ 
              textTransform: 'uppercase',
              fontWeight: 'medium',
              fontSize: '0.75rem',
              py: 2
            }}
          />
          <Tab 
            icon={<ChildCareIcon />} 
            iconPosition="start"
            label="MY CHILDREN" 
            sx={{ 
              textTransform: 'uppercase',
              fontWeight: 'medium',
              fontSize: '0.75rem',
              py: 2
            }}
          />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          {recentNotifications.length > 0 ? (
            <List>
              {recentNotifications.map((notification) => (
                <ListItem key={notification.id} divider>
                  <ListItemIcon>
                    <NotificationIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary={notification.title}
                    secondary={`${notification.message} - ${new Date(notification.date || notification.createdAt).toLocaleDateString()}`}
                  />
                  <Chip 
                    label={notification.priority || 'normal'} 
                    color={getPriorityColor(notification.priority)} 
                    size="small" 
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No notifications to display.</Typography>
          )}
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          {upcomingEvents.length > 0 ? (
            <Grid container spacing={2}>
              {upcomingEvents.map((event) => (
                <Grid item xs={12} sm={6} key={event.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{event.title}</Typography>
                      <Typography color="textSecondary">Date: {new Date(event.date || event.startDate).toLocaleDateString()}</Typography>
                      <Typography color="textSecondary">Location: {event.location || 'School'}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography>No upcoming events to display.</Typography>
          )}
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          {medicationRequests.length > 0 ? (
            <List>
              {medicationRequests.map((request) => (
                <ListItem key={request.id || request.requestId} divider>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: getStatusColor(request.status) }}>
                      <PharmacyIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={request.medicationName}
                    secondary={`Status: ${request.status} - Requested: ${new Date(request.requestDate).toLocaleDateString()}`}
                  />
                  {(request.status === 'PENDING' || request.status === 'SUBMITTED') && (
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      startIcon={<CancelIcon />}
                      onClick={() => handleCancelRequest(request.id || request.requestId)}
                    >
                      Cancel
                    </Button>
                  )}
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No medication requests to display.</Typography>
          )}
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          {dashboardData.children.length > 0 ? (
            <Grid container spacing={2}>
              {dashboardData.children.map((child) => (
                <Grid item xs={12} sm={6} md={4} key={child.studentCode}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{child.fullName}</Typography>
                      <Typography variant="body2" color="textSecondary">Class: {child.clazz?.name || 'N/A'}</Typography>
                      <Typography variant="body2" color="textSecondary">Student Code: {child.studentCode}</Typography>
                      <Button 
                        variant="outlined" 
                        color="primary" 
                        onClick={() => handleViewChildDetails(child)}
                        sx={{ mt: 2 }}
                        fullWidth
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography>No children found.</Typography>
          )}        </TabPanel>
      </Paper>{selectedChildForDialog && (
        <Dialog open={childDetailsOpen} onClose={closeChildDetailsDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            Child Details: {selectedChildForDialog.fullName}
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item>
                <Avatar sx={{ width: 60, height: 60, bgcolor: theme.palette.primary.main }}>
                  <PersonIcon sx={{ fontSize: 40 }} />
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography variant="h6">{selectedChildForDialog.fullName}</Typography>
                <Typography variant="body1">Student Code: {selectedChildForDialog.studentCode}</Typography>
                <Typography variant="body1">Class: {selectedChildForDialog.clazz?.name || 'N/A'}</Typography>
                <Typography variant="body1">DOB: {selectedChildForDialog.dateOfBirth ? new Date(selectedChildForDialog.dateOfBirth).toLocaleDateString() : 'N/A'}</Typography>
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>Health Information</Typography>
            <Typography variant="body2">Allergies: {selectedChildForDialog.allergies || 'None reported'}</Typography>
            <Typography variant="body2">Medical Conditions: {selectedChildForDialog.conditions || 'None reported'}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeChildDetailsDialog} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default ParentDashboard;