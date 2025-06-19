import React, { useState, useEffect, useContext } from 'react';
import { getUserNotifications, markNotificationAsRead } from '../../utils/api'; // Corrected path
import { AuthContext } from '../../context/AuthContext'; // Corrected path
import { List, ListItem, ListItemText, Typography, Paper, CircularProgress, Alert, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!currentUser || !currentUser.userId) {
        setError('User not found. Please log in.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await getUserNotifications(currentUser.userId);
        // Sort notifications by date, newest first
        const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setNotifications(sortedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch notifications.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [currentUser]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(prevNotifications =>
        prevNotifications.map(notif =>
          notif.notificationId === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
      // Optionally show a small error message to the user
    }
  };
  
  const handleNotificationClick = (notification) => {
    if (notification.relatedEntity && notification.relatedEntityId) {
      // Example: Navigate to a specific page based on notification type
      // This needs to be customized based on your notification types and routes
      if (notification.message.includes('health checkup consent')) {
        navigate(`/parent/health-checkups`);
      } else if (notification.message.includes('health checkup results')) {
         navigate(`/parent/health-checkups/results/${notification.relatedEntityId}`);
      } else if (notification.message.includes('medication request')) {
        // Assuming a route like /medication-requests/:id
        navigate(`/medication-requests/${notification.relatedEntityId}`);
      }
      // Add more conditions for other notification types
    }
    if (!notification.read) {
      handleMarkAsRead(notification.notificationId);
    }
  };


  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Paper elevation={3} style={{ margin: '20px', padding: '20px' }}>
        <Alert severity="error">{error}</Alert>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} style={{ margin: '20px', padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Notifications
      </Typography>
      {notifications.length === 0 ? (
        <Typography>You have no notifications.</Typography>
      ) : (
        <List>
          {notifications.map((notification) => (
            <ListItem 
              key={notification.notificationId} 
              divider
              button 
              onClick={() => handleNotificationClick(notification)}
              style={{ backgroundColor: notification.read ? 'transparent' : '#f0f8ff' }}
            >
              <ListItemText
                primary={notification.message}
                secondary={`Received: ${new Date(notification.createdAt).toLocaleString()}`}
              />
              {!notification.read && (
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent ListItem click event
                    handleMarkAsRead(notification.notificationId);
                  }}
                  style={{ marginLeft: '10px' }}
                >
                  Mark as Read
                </Button>
              )}
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default NotificationsPage;
