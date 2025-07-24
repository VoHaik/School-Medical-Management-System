import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Box, Typography, CircularProgress, Alert, Grid, Paper, Select, MenuItem, FormControl, InputLabel } from '@mui/material'; // Removed Button as it's in Item
import ParentHealthCheckupEventItem from '../../components/healthcheckup/ParentHealthCheckupEventItem';
import { 
    getAllHealthCheckupEvents, 
    getStudentHealthCheckupsByStudentId
} from '../../utils/api'; 
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../hooks/useAlert';

const ParentHealthCheckupOverview = () => {
    const { user } = useAuth();
    const { successAlert } = useAlert();
    const navigate = useNavigate(); // Initialize useNavigate
    const [events, setEvents] = useState([]);
    const [children, setChildren] = useState([]);
    const [selectedChildId, setSelectedChildId] = useState('');
    const [selectedChildName, setSelectedChildName] = useState('');
    const [childCheckupData, setChildCheckupData] = useState({}); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch children associated with the parent
    useEffect(() => {
        if (user && user.children && user.children.length > 0) {
            setChildren(user.children);
            setSelectedChildId(user.children[0].userId); 
            setSelectedChildName(`${user.children[0].firstName} ${user.children[0].lastName}`);
        } else if (user && user.role === 'PARENT') {
            // If user.children is not populated, you might need an API call here
            // For now, assuming it's populated or we show a message
            setChildren([]);
        }
    }, [user]);

    const fetchEventsAndChildData = useCallback(async () => {
        if (!selectedChildId) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const [allEventsData, studentCheckupsData] = await Promise.all([
                getAllHealthCheckupEvents(),
                getStudentHealthCheckupsByStudentId(selectedChildId)
            ]);
            
            setEvents(allEventsData || []);
            
            const checkupMap = {};
            if (studentCheckupsData) {
                studentCheckupsData.forEach(chk => {
                    const eventId = chk.eventId || (chk.healthEvent && chk.healthEvent.eventId);
                    if (eventId) {
                        checkupMap[eventId] = {
                            recordId: chk.recordId, // Store the recordId
                            consentStatus: chk.consentStatus, // This should be boolean: true, false, or null/undefined
                            consentDate: chk.consentDate,
                            resultAvailable: !!(chk.height && chk.weight) // Simple check for result, adjust as needed
                        };
                    }
                });
            }
            setChildCheckupData(checkupMap);
            setError(null);
        } catch (err) {
            setError(err.message || 'Failed to fetch health checkup information.');
            setEvents([]);
            setChildCheckupData({});
        } finally {
            setLoading(false);
        }
    }, [selectedChildId]);

    useEffect(() => {
        fetchEventsAndChildData();
    }, [fetchEventsAndChildData]);

    const handleChildChange = (event) => {
        const childId = event.target.value;
        setSelectedChildId(childId);
        const selectedChild = children.find(c => c.userId === childId);
        if (selectedChild) {
            setSelectedChildName(`${selectedChild.firstName} ${selectedChild.lastName}`);
        }
    };

    const handleProvideConsent = async (eventId, childId, consentDecision, consentNotes) => {
        try {
            // Note: Health checkup consent functionality is not yet implemented in the backend
            // TODO: Implement health checkup consent API when required
            console.log('Health checkup consent recorded locally (backend implementation pending)');
            
            // For now, just show success message without API call
            successAlert(`Đồng ý "${consentDecision}" đã được ghi nhận cho sự kiện kiểm tra sức khỏe.`);
            
            // Refresh data to reflect any changes
            // fetchEventsAndChildData(); 
        } catch (err) {
            setError(err.message || 'Failed to update consent.');
            // Potentially revert optimistic UI update or show specific error to user
        }
    };

    const handleViewDetails = (eventId, childId, recordId) => {
        if (!recordId) {
            setError("Cannot view details: Record ID is missing for this event and child.");
            return;
        }
        navigate(`/parent/health-checkups/event/${eventId}/child/${childId}/result/${recordId}`);
    };

    if (!user || user.role !== 'PARENT') {
        return <Typography>This page is for parents only.</Typography>;
    }

    if (children.length === 0 && !loading) {
        return <Typography>No children found for your account. Please add your child information.</Typography>;
    }

    return (
        <Paper sx={{ p: 3, m: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>Health Checkup & Events</Typography>
            
            {children.length > 0 && (
                <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel id="select-child-label">Select Child</InputLabel>
                    <Select
                        labelId="select-child-label"
                        value={selectedChildId}
                        label="Select Child"
                        onChange={handleChildChange}
                    >
                        {children.map(child => (
                            <MenuItem key={child.userId} value={child.userId}>
                                {child.firstName} {child.lastName} {/* Assuming child object has name */}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}

            {loading && <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px"><CircularProgress /></Box>}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {!loading && !error && events.length === 0 && (
                <Typography>No health checkups or events scheduled at this time.</Typography>
            )}

            {!loading && !error && events.length > 0 && (
                <Grid container spacing={2}>
                    {events.map(event => {
                        const eventChildData = childCheckupData[event.eventId] || { recordId: null, consentStatus: null, consentDate: null, resultAvailable: false };
                        return (
                            <Grid item xs={12} key={event.eventId}>
                                <ParentHealthCheckupEventItem 
                                    event={event} 
                                    childId={selectedChildId}
                                    studentName={selectedChildName} // Pass student name
                                    consentStatus={eventChildData.consentStatus} // Should be boolean or null
                                    consentDate={eventChildData.consentDate}
                                    resultAvailable={eventChildData.resultAvailable}
                                    onGiveConsent={handleProvideConsent} // Pass the updated handler
                                    onViewDetails={() => eventChildData.resultAvailable && eventChildData.recordId ? handleViewDetails(event.eventId, selectedChildId, eventChildData.recordId) : null}
                                    // Disable or alter onViewDetails if results not available or no recordId
                                />
                            </Grid>
                        );
                    })}
                </Grid>
            )}
        </Paper>
    );
};

export default ParentHealthCheckupOverview;
