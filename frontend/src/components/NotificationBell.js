import React, { useState, useEffect, useCallback } from 'react';
import { List, ListItem, ListItemText, Typography, Badge, IconButton, Menu, MenuItem, Divider, CircularProgress, Box, Tooltip, Button } from '@mui/material'; // Added Button
import NotificationsIcon from '@mui/icons-material/Notifications';
import MarkChatReadIcon from '@mui/icons-material/MarkChatRead'; // For Mark all as read
import ReadMoreIcon from '@mui/icons-material/ReadMore'; // For View All
import { useNavigate } from 'react-router-dom';
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../utils/api';
import { useAuth } from '../context/AuthContext'; // To ensure user is logged in

const NotificationBell = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchNotifications = useCallback(async () => {
        if (!user || !user.userId) { // Check user.userId as well
            setNotifications([]);
            setUnreadCount(0);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            // Fetch all notifications and filter for unread count client-side or rely on a specific endpoint for unread count
            const allNotifs = await getUserNotifications(user.userId); // Pass userId
            setNotifications(allNotifs || []);
            const unread = allNotifs ? allNotifs.filter(n => !n.read).length : 0;
            setUnreadCount(unread);
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
            setError("Failed to load notifications.");
            setNotifications([]);
            setUnreadCount(0);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000); // Poll every 60 seconds
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    const handleOpenMenu = (event) => {
        setAnchorEl(event.currentTarget);
        fetchNotifications(); 
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleNotificationClick = async (notification) => {
        handleCloseMenu();
        if (!notification.read) {
            try {
                await markNotificationAsRead(notification.notificationId);
                fetchNotifications(); 
            } catch (err) {
                console.error("Failed to mark notification as read:", err);
            }
        }
        // Navigate based on notification content
        if (notification.message.includes('health checkup consent')) {
            navigate(`/parent/health-checkups`);
        } else if (notification.message.includes('health checkup results')) {
            // Assuming relatedEntityId stores the studentHealthCheckupId for result notifications
            navigate(`/parent/health-checkups/results/${notification.relatedEntityId}`);
        } else if (notification.message.includes('medication request')) {
            navigate(`/medication-requests/${notification.relatedEntityId}`);
        } else {
            // Fallback or general navigation
            navigate('/notifications');
        }
    };

    const handleMarkAllRead = async () => {
        if (unreadCount === 0) return;
        if (!user || !user.userId) return;
        try {
            await markAllNotificationsAsRead(user.userId); // Pass userId
            fetchNotifications(); 
        } catch (err) {
            console.error("Failed to mark all notifications as read:", err);
            setError("Failed to mark all as read.");
        }
    };

    const handleViewAllNotifications = () => {
        handleCloseMenu();
        navigate('/notifications'); // Navigate to the new common notifications page
    };

    if (!user) {
        return null; 
    }

    return (
        <>
            <Tooltip title="Notifications">
                <IconButton color="inherit" onClick={handleOpenMenu}>
                    <Badge badgeContent={unreadCount} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                PaperProps={{
                    style: {
                        maxHeight: 400,
                        width: '350px',
                    },
                }}
            >
                <Box sx={{ padding: '8px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1">Notifications</Typography>
                    {unreadCount > 0 && (
                        <Tooltip title="Mark all as read">
                            <IconButton size="small" onClick={handleMarkAllRead}>
                                <MarkChatReadIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
                <Divider />
                {loading ? (
                    <MenuItem disabled>
                        <CircularProgress size={20} sx={{ marginRight: '10px' }} /> Loading...
                    </MenuItem>
                ) : error ? (
                    <MenuItem disabled>
                        <Typography color="error" variant="caption">{error}</Typography>
                    </MenuItem>
                ) : notifications.length === 0 ? (
                    <MenuItem disabled>
                        <Typography variant="caption">No new notifications.</Typography>
                    </MenuItem>
                ) : (
                    <List dense sx={{ padding: 0 }}>
                        {notifications.slice(0, 5).map((notification) => ( // Show only first 5
                            <ListItem 
                                button 
                                key={notification.notificationId} 
                                onClick={() => handleNotificationClick(notification)}
                                sx={{ backgroundColor: notification.read ? 'transparent' : 'action.hover' }}
                            >
                                <ListItemText 
                                    primaryTypographyProps={{ 
                                        variant: 'body2', 
                                        style: { 
                                            fontWeight: notification.read ? 'normal' : 'bold',
                                            whiteSpace: 'normal',
                                            wordWrap: 'break-word' 
                                        }
                                    }}
                                    primary={notification.message} 
                                    secondary={new Date(notification.createdAt).toLocaleString()} 
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
                <Divider />
                <MenuItem onClick={handleViewAllNotifications} sx={{ justifyContent: 'center' }}>
                    <ReadMoreIcon fontSize="small" sx={{ mr: 0.5 }} />
                    View All Notifications
                </MenuItem>
            </Menu>
        </>
    );
};

export default NotificationBell;
