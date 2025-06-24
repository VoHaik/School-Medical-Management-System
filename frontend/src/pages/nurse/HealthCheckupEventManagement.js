import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, CircularProgress, Alert, Paper, Grid, Modal } from '@mui/material'; // Added Modal
import { AddCircleOutline as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import HealthCheckupEventForm from '../../components/healthcheckup/HealthCheckupEventForm'; // Corrected path
import HealthCheckupEventListItem from '../../components/healthcheckup/HealthCheckupEventListItem'; // Corrected path
import { getAllHealthCheckupEvents, createHealthCheckupEvent, updateHealthCheckupEvent, deleteHealthCheckupEvent } from '../../utils/api'; // Assuming API functions exist and added create/update

// Modal style
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: '90vh',
  overflowY: 'auto'
};

const HealthCheckupEventManagement = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openFormModal, setOpenFormModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null); // For editing
    const [isEditMode, setIsEditMode] = useState(false);

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAllHealthCheckupEvents();
            setEvents(data || []);
            setError(null);
        } catch (err) {
            setError(err.message || 'Failed to fetch health checkup events.');
            setEvents([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handleOpenCreateModal = () => {
        setSelectedEvent(null);
        setIsEditMode(false);
        setOpenFormModal(true);
    };

    const handleOpenEditModal = (event) => {
        setSelectedEvent(event);
        setIsEditMode(true);
        setOpenFormModal(true);
    };

    const handleCloseModal = () => {
        setOpenFormModal(false);
        setSelectedEvent(null);
        setIsEditMode(false);
    };

    const handleFormSubmit = async (formData) => {
        try {
            if (isEditMode && selectedEvent) {
                await updateHealthCheckupEvent(selectedEvent.eventId, formData);
            } else {
                await createHealthCheckupEvent(formData);
            }
            fetchEvents(); // Refresh list after save
            handleCloseModal();
        } catch (err) {
            setError(err.message || `Failed to ${isEditMode ? 'update' : 'create'} event.`);
            // Keep modal open if error to allow correction
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
            try {
                await deleteHealthCheckupEvent(eventId);
                fetchEvents(); // Refresh list
            } catch (err) {
                setError(err.message || 'Failed to delete event.');
            }
        }
    };

    // Placeholder for navigation to student management for an event
    const handleViewStudents = (eventId) => {
        console.log(`Navigate to student management for event ID: ${eventId}`);
        // Example: navigate(`/nurse/health-checkup-events/${eventId}/students`);
    };

    if (loading && events.length === 0) { // Show loader only on initial load
        return <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh"><CircularProgress /></Box>;
    }

    return (
        <Paper sx={{ p: { xs: 1, sm: 2, md: 3 }, m: { xs: 1, sm: 2 } }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>Health Checkup Event Management</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenCreateModal}
                sx={{ mb: 2 }}
            >
                Create New Event
            </Button>

            <Modal
                open={openFormModal}
                onClose={handleCloseModal}
                aria-labelledby="health-checkup-event-form-title"
            >
                <Box sx={style}>
                    <HealthCheckupEventForm
                        onSubmit={handleFormSubmit}
                        initialData={selectedEvent}
                        isEdit={isEditMode}
                    />
                </Box>
            </Modal>

            {events.length === 0 && !loading && (
                <Typography>No health checkup events found. Click "Create New Event" to add one.</Typography>
            )}

            {loading && events.length > 0 && <CircularProgress sx={{display: 'block', margin: 'auto', my: 2}}/>}

            <Grid container spacing={2}>
                {events.map(event => (
                    <Grid item xs={12} key={event.eventId}> {/* Changed to full width for list items */}
                        <HealthCheckupEventListItem
                            event={event}
                            onEdit={handleOpenEditModal}
                            onDelete={handleDeleteEvent}
                            onViewStudents={handleViewStudents} // Pass the handler
                        />
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
};

export default HealthCheckupEventManagement;
