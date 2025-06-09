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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Divider,
  Badge,
  Paper,
  Alert,
  Tooltip,
  Menu,
  MenuItem,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Warning,
  Info,
  CheckCircle,
  Schedule,
  MedicalServices,
  VaccinesOutlined,
  Assignment,
  Email,
  Sms,
  MoreVert,
  Delete,
  MarkAsUnread,
  Archive,
  Settings,
  FilterList,
  Search,
  ExpandMore,
  Close,
  Star,
  StarBorder,
  Circle
} from '@mui/icons-material';
import { format, parseISO, isToday, isYesterday, subDays } from 'date-fns';

// Mock notification data
const mockNotificationData = {
  notifications: [
    {
      id: 1,
      type: 'vaccination',
      priority: 'high',
      title: 'HPV Vaccination Consent Required',
      message: 'Consent is required for John Smith\'s HPV vaccination scheduled for June 20, 2024. Please respond by June 15, 2024.',
      timestamp: '2024-05-20T10:30:00Z',
      read: false,
      starred: true,
      category: 'health',
      actionRequired: true,
      actionText: 'Provide Consent',
      relatedStudents: ['John Smith'],
      sender: 'School Health Services'
    },
    {
      id: 2,
      type: 'appointment',
      priority: 'medium',
      title: 'Annual Physical Examination Scheduled',
      message: 'John Smith\'s annual physical examination has been scheduled for June 15, 2024 at 2:00 PM with Dr. Sarah Johnson at the School Health Clinic.',
      timestamp: '2024-05-18T14:15:00Z',
      read: false,
      starred: false,
      category: 'appointment',
      actionRequired: false,
      relatedStudents: ['John Smith'],
      sender: 'School Health Clinic'
    },
    {
      id: 3,
      type: 'medication',
      priority: 'high',
      title: 'Medication Administration Update',
      message: 'John Smith\'s inhaler medication was administered today at 11:30 AM due to mild asthma symptoms during PE class. Symptoms resolved quickly.',
      timestamp: '2024-05-17T11:45:00Z',
      read: true,
      starred: false,
      category: 'health',
      actionRequired: false,
      relatedStudents: ['John Smith'],
      sender: 'School Nurse Mary Wilson'
    },
    {
      id: 4,
      type: 'health-alert',
      priority: 'medium',
      title: 'Flu Outbreak Alert',
      message: 'We have identified several cases of influenza in Grade 10. Please monitor your child for symptoms including fever, cough, and body aches.',
      timestamp: '2024-05-15T09:00:00Z',
      read: true,
      starred: false,
      category: 'alert',
      actionRequired: false,
      relatedStudents: ['John Smith'],
      sender: 'School Administration'
    },
    {
      id: 5,
      type: 'checkup',
      priority: 'low',
      title: 'Health Checkup Results Available',
      message: 'The results from John Smith\'s routine health screening on May 10th are now available. Overall health status is excellent.',
      timestamp: '2024-05-12T16:20:00Z',
      read: true,
      starred: true,
      category: 'health',
      actionRequired: false,
      relatedStudents: ['John Smith'],
      sender: 'Dr. Sarah Johnson'
    },
    {
      id: 6,
      type: 'policy',
      priority: 'low',
      title: 'Updated Health Policies',
      message: 'We have updated our school health policies regarding medication administration and emergency procedures. Please review the attached documents.',
      timestamp: '2024-05-10T13:45:00Z',
      read: true,
      starred: false,
      category: 'policy',
      actionRequired: false,
      relatedStudents: [],
      sender: 'School Administration'
    },
    {
      id: 7,
      type: 'reminder',
      priority: 'medium',
      title: 'Medication Refill Reminder',
      message: 'John Smith\'s asthma inhaler prescription expires in 7 days. Please contact your healthcare provider for a refill.',
      timestamp: '2024-05-08T08:00:00Z',
      read: true,
      starred: false,
      category: 'medication',
      actionRequired: true,
      actionText: 'Refill Prescription',
      relatedStudents: ['John Smith'],
      sender: 'School Health Services'
    }
  ],
  settings: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    vaccinationReminders: true,
    appointmentReminders: true,
    medicationAlerts: true,
    healthAlerts: true,
    quietHours: {
      enabled: true,
      startTime: '22:00',
      endTime: '07:00'
    }
  },
  summary: {
    total: 7,
    unread: 2,
    starred: 2,
    actionRequired: 2
  }
};

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`notifications-tabpanel-${index}`}
      aria-labelledby={`notifications-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const Notifications = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState(mockNotificationData);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedForMenu, setSelectedForMenu] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setDetailsOpen(true);
    
    // Mark as read if not already
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const markAsRead = (notificationId) => {
    setData(prev => ({
      ...prev,
      notifications: prev.notifications.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      ),
      summary: {
        ...prev.summary,
        unread: prev.summary.unread - 1
      }
    }));
  };

  const markAsUnread = (notificationId) => {
    setData(prev => ({
      ...prev,
      notifications: prev.notifications.map(n =>
        n.id === notificationId ? { ...n, read: false } : n
      ),
      summary: {
        ...prev.summary,
        unread: prev.summary.unread + 1
      }
    }));
  };

  const toggleStar = (notificationId) => {
    setData(prev => ({
      ...prev,
      notifications: prev.notifications.map(n =>
        n.id === notificationId ? { ...n, starred: !n.starred } : n
      ),
      summary: {
        ...prev.summary,
        starred: prev.notifications.find(n => n.id === notificationId)?.starred 
          ? prev.summary.starred - 1 
          : prev.summary.starred + 1
      }
    }));
  };

  const deleteNotification = (notificationId) => {
    setData(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== notificationId),
      summary: {
        ...prev.summary,
        total: prev.summary.total - 1,
        unread: prev.notifications.find(n => n.id === notificationId)?.read 
          ? prev.summary.unread 
          : prev.summary.unread - 1,
        starred: prev.notifications.find(n => n.id === notificationId)?.starred 
          ? prev.summary.starred - 1 
          : prev.summary.starred
      }
    }));
  };

  const handleMenuOpen = (event, notification) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setSelectedForMenu(notification);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedForMenu(null);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'vaccination':
        return <VaccinesOutlined />;
      case 'appointment':
        return <Schedule />;
      case 'medication':
        return <MedicalServices />;
      case 'health-alert':
        return <Warning />;
      case 'checkup':
        return <Assignment />;
      case 'reminder':
        return <Schedule />;
      case 'policy':
        return <Info />;
      default:
        return <NotificationsIcon />;
    }
  };

  const getRelativeTime = (timestamp) => {
    const date = parseISO(timestamp);
    if (isToday(date)) {
      return `Today at ${format(date, 'h:mm a')}`;
    } else if (isYesterday(date)) {
      return `Yesterday at ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM dd, yyyy');
    }
  };

  const filteredNotifications = data.notifications.filter(notification => {
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getFilteredByTab = (notifications) => {
    switch (activeTab) {
      case 0: // All
        return notifications;
      case 1: // Unread
        return notifications.filter(n => !n.read);
      case 2: // Starred
        return notifications.filter(n => n.starred);
      case 3: // Action Required
        return notifications.filter(n => n.actionRequired);
      default:
        return notifications;
    }
  };

  const displayNotifications = getFilteredByTab(filteredNotifications);

  return (
    <Box className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <Box className="mb-6">
        <Box className="flex items-center justify-between mb-4">
          <Box className="flex items-center gap-3">
            <Badge badgeContent={data.summary.unread} color="error">
              <NotificationsIcon className="text-blue-600" sx={{ fontSize: 32 }} />
            </Badge>
            <Typography variant="h4" className="font-bold text-gray-800">
              Notifications
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<Settings />}
            onClick={() => setSettingsOpen(true)}
          >
            Settings
          </Button>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} className="mb-6">
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent className="text-center">
                <Typography variant="h4" className="font-bold text-blue-600">
                  {data.summary.total}
                </Typography>
                <Typography variant="caption" className="text-gray-600">
                  Total
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent className="text-center">
                <Typography variant="h4" className="font-bold text-red-600">
                  {data.summary.unread}
                </Typography>
                <Typography variant="caption" className="text-gray-600">
                  Unread
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent className="text-center">
                <Typography variant="h4" className="font-bold text-yellow-600">
                  {data.summary.starred}
                </Typography>
                <Typography variant="caption" className="text-gray-600">
                  Starred
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent className="text-center">
                <Typography variant="h4" className="font-bold text-orange-600">
                  {data.summary.actionRequired}
                </Typography>
                <Typography variant="caption" className="text-gray-600">
                  Action Required
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Search and Filter */}
      <Box className="mb-4">
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search className="mr-2 text-gray-400" />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Filter by Type"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              SelectProps={{ native: true }}
            >
              <option value="all">All Types</option>
              <option value="vaccination">Vaccination</option>
              <option value="appointment">Appointment</option>
              <option value="medication">Medication</option>
              <option value="health-alert">Health Alert</option>
              <option value="checkup">Checkup</option>
              <option value="reminder">Reminder</option>
              <option value="policy">Policy</option>
            </TextField>
          </Grid>
        </Grid>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label={`All (${data.summary.total})`} />
          <Tab label={`Unread (${data.summary.unread})`} />
          <Tab label={`Starred (${data.summary.starred})`} />
          <Tab label={`Action Required (${data.summary.actionRequired})`} />
        </Tabs>
      </Box>

      {/* Notifications List */}
      <TabPanel value={activeTab} index={activeTab}>
        {displayNotifications.length > 0 ? (
          <List className="space-y-2">
            {displayNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  !notification.read ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <ListItem>
                  <ListItemIcon>
                    <Badge
                      variant="dot"
                      color={getPriorityColor(notification.priority)}
                      invisible={notification.read}
                    >
                      <Avatar className={`bg-${getPriorityColor(notification.priority)}-100`}>
                        {getTypeIcon(notification.type)}
                      </Avatar>
                    </Badge>
                  </ListItemIcon>
                  
                  <ListItemText
                    primary={
                      <Box className="flex items-center gap-2">
                        <Typography
                          variant="subtitle1"
                          className={`${!notification.read ? 'font-bold' : 'font-medium'}`}
                        >
                          {notification.title}
                        </Typography>
                        {notification.actionRequired && (
                          <Chip label="Action Required" color="warning" size="small" />
                        )}
                        {notification.priority === 'high' && (
                          <Chip label="High Priority" color="error" size="small" />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box className="mt-1">
                        <Typography variant="body2" className="text-gray-600 mb-1 line-clamp-2">
                          {notification.message}
                        </Typography>
                        <Box className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{getRelativeTime(notification.timestamp)}</span>
                          <span>•</span>
                          <span>{notification.sender}</span>
                          {notification.relatedStudents.length > 0 && (
                            <>
                              <span>•</span>
                              <span>{notification.relatedStudents.join(', ')}</span>
                            </>
                          )}
                        </Box>
                      </Box>
                    }
                  />
                  
                  <ListItemSecondaryAction>
                    <Box className="flex items-center gap-1">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStar(notification.id);
                        }}
                        className={notification.starred ? 'text-yellow-500' : 'text-gray-400'}
                      >
                        {notification.starred ? <Star /> : <StarBorder />}
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, notification)}
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              </Card>
            ))}
          </List>
        ) : (
          <Paper className="p-8 text-center">
            <NotificationsIcon className="text-gray-400 mb-4" sx={{ fontSize: 48 }} />
            <Typography variant="h6" className="text-gray-600 mb-2">
              No Notifications
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              {activeTab === 1 ? 'All notifications have been read.' :
               activeTab === 2 ? 'No starred notifications.' :
               activeTab === 3 ? 'No actions required at this time.' :
               'No notifications to display.'}
            </Typography>
          </Paper>
        )}
      </TabPanel>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            if (selectedForMenu?.read) {
              markAsUnread(selectedForMenu.id);
            } else {
              markAsRead(selectedForMenu.id);
            }
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            {selectedForMenu?.read ? <MarkAsUnread /> : <CheckCircle />}
          </ListItemIcon>
          {selectedForMenu?.read ? 'Mark as Unread' : 'Mark as Read'}
        </MenuItem>
        <MenuItem
          onClick={() => {
            toggleStar(selectedForMenu.id);
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            {selectedForMenu?.starred ? <StarBorder /> : <Star />}
          </ListItemIcon>
          {selectedForMenu?.starred ? 'Remove Star' : 'Add Star'}
        </MenuItem>
        <MenuItem
          onClick={() => {
            deleteNotification(selectedForMenu.id);
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <Delete />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>

      {/* Notification Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box className="flex justify-between items-center">
            <Box className="flex items-center gap-2">
              {selectedNotification && getTypeIcon(selectedNotification.type)}
              <Typography variant="h6">
                {selectedNotification?.title}
              </Typography>
            </Box>
            <IconButton onClick={() => setDetailsOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedNotification && (
            <Box className="space-y-4">
              <Box className="flex items-center gap-2">
                <Chip
                  label={selectedNotification.priority.toUpperCase()}
                  color={getPriorityColor(selectedNotification.priority)}
                  size="small"
                />
                <Chip
                  label={selectedNotification.category}
                  variant="outlined"
                  size="small"
                />
                {selectedNotification.actionRequired && (
                  <Chip label="Action Required" color="warning" size="small" />
                )}
              </Box>
              
              <Typography variant="body1">
                {selectedNotification.message}
              </Typography>
              
              <Divider />
              
              <Box className="grid grid-cols-2 gap-4">
                <Box>
                  <Typography variant="caption" className="text-gray-500">
                    Sender
                  </Typography>
                  <Typography variant="body2">
                    {selectedNotification.sender}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" className="text-gray-500">
                    Time
                  </Typography>
                  <Typography variant="body2">
                    {format(parseISO(selectedNotification.timestamp), 'MMMM dd, yyyy at h:mm a')}
                  </Typography>
                </Box>
                {selectedNotification.relatedStudents.length > 0 && (
                  <Box>
                    <Typography variant="caption" className="text-gray-500">
                      Related Students
                    </Typography>
                    <Typography variant="body2">
                      {selectedNotification.relatedStudents.join(', ')}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {selectedNotification?.actionRequired && (
            <Button variant="contained" color="primary">
              {selectedNotification.actionText}
            </Button>
          )}
          <Button onClick={() => setDetailsOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box className="flex justify-between items-center">
            <Typography variant="h6">Notification Settings</Typography>
            <IconButton onClick={() => setSettingsOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box className="space-y-4">
            <Typography variant="h6">Delivery Methods</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={data.settings.emailNotifications}
                  onChange={(e) => setData(prev => ({
                    ...prev,
                    settings: { ...prev.settings, emailNotifications: e.target.checked }
                  }))}
                />
              }
              label={
                <Box className="flex items-center gap-2">
                  <Email />
                  <span>Email Notifications</span>
                </Box>
              }
            />
            <FormControlLabel
              control={
                <Switch
                  checked={data.settings.smsNotifications}
                  onChange={(e) => setData(prev => ({
                    ...prev,
                    settings: { ...prev.settings, smsNotifications: e.target.checked }
                  }))}
                />
              }
              label={
                <Box className="flex items-center gap-2">
                  <Sms />
                  <span>SMS Notifications</span>
                </Box>
              }
            />
            <FormControlLabel
              control={
                <Switch
                  checked={data.settings.pushNotifications}
                  onChange={(e) => setData(prev => ({
                    ...prev,
                    settings: { ...prev.settings, pushNotifications: e.target.checked }
                  }))}
                />
              }
              label={
                <Box className="flex items-center gap-2">
                  <NotificationsIcon />
                  <span>Push Notifications</span>
                </Box>
              }
            />
            
            <Divider />
            
            <Typography variant="h6">Notification Types</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={data.settings.vaccinationReminders}
                  onChange={(e) => setData(prev => ({
                    ...prev,
                    settings: { ...prev.settings, vaccinationReminders: e.target.checked }
                  }))}
                />
              }
              label="Vaccination Reminders"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={data.settings.appointmentReminders}
                  onChange={(e) => setData(prev => ({
                    ...prev,
                    settings: { ...prev.settings, appointmentReminders: e.target.checked }
                  }))}
                />
              }
              label="Appointment Reminders"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={data.settings.medicationAlerts}
                  onChange={(e) => setData(prev => ({
                    ...prev,
                    settings: { ...prev.settings, medicationAlerts: e.target.checked }
                  }))}
                />
              }
              label="Medication Alerts"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={data.settings.healthAlerts}
                  onChange={(e) => setData(prev => ({
                    ...prev,
                    settings: { ...prev.settings, healthAlerts: e.target.checked }
                  }))}
                />
              }
              label="Health Alerts"
            />
            
            <Divider />
            
            <Typography variant="h6">Quiet Hours</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={data.settings.quietHours.enabled}
                  onChange={(e) => setData(prev => ({
                    ...prev,
                    settings: {
                      ...prev.settings,
                      quietHours: { ...prev.settings.quietHours, enabled: e.target.checked }
                    }
                  }))}
                />
              }
              label="Enable Quiet Hours"
            />
            
            {data.settings.quietHours.enabled && (
              <Box className="grid grid-cols-2 gap-3">
                <TextField
                  type="time"
                  label="Start Time"
                  value={data.settings.quietHours.startTime}
                  onChange={(e) => setData(prev => ({
                    ...prev,
                    settings: {
                      ...prev.settings,
                      quietHours: { ...prev.settings.quietHours, startTime: e.target.value }
                    }
                  }))}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  type="time"
                  label="End Time"
                  value={data.settings.quietHours.endTime}
                  onChange={(e) => setData(prev => ({
                    ...prev,
                    settings: {
                      ...prev.settings,
                      quietHours: { ...prev.settings.quietHours, endTime: e.target.value }
                    }
                  }))}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setSettingsOpen(false)}>
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Notifications;
