import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, CircularProgress, Alert, Paper, Grid, Modal } from '@mui/material'; // Added Modal
import { AddCircleOutline as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import HealthEventForm from '../../components/healthcheckup/HealthEventForm'; // Corrected path
import HealthEventListItem from '../../components/healthcheckup/HealthEventListItem'; // Corrected path
import { getAllHealthEvents, createHealthEvent, updateHealthEvent, deleteHealthEvent } from '../../utils/api'; // Assuming API functions exist and added create/update
import { useUIText } from '../../hooks/useUIText';

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

const HealthEventManagement = () => {
    const { t } = useUIText();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openFormModal, setOpenFormModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null); // For editing
    const [isEditMode, setIsEditMode] = useState(false);

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAllHealthEvents();
            setEvents(data || []);
            setError(null);
        } catch (err) {
            setError(err.message || t.loadError);
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
                await updateHealthEvent(selectedEvent.eventId, formData);
            } else {
                await createHealthEvent(formData);
            }
            fetchEvents(); // Refresh list after save
            handleCloseModal();
        } catch (err) {
            setError(err.message || `Failed to ${isEditMode ? 'update' : 'create'} event.`);
            // Keep modal open if error to allow correction
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (window.confirm(t.deleteConfirm)) {
            try {
                await deleteHealthEvent(eventId);
                fetchEvents(); // Refresh list
            } catch (err) {
                setError(err.message || t.deleteError);
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
            <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>{t.createAndOrganizeEventManagement}</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenCreateModal}
                sx={{ mb: 2 }}
            >
                {t.createNewEvent}
            </Button>

            <Modal
                open={openFormModal}
                onClose={handleCloseModal}
                aria-labelledby="health-checkup-event-form-title"
            >
                <Box sx={style}>
                    <HealthEventForm
                        onSubmit={handleFormSubmit}
                        initialData={selectedEvent}
                        isEdit={isEditMode}
                    />
                </Box>
            </Modal>

            {events.length === 0 && !loading && (
                <Typography>{t.noData}</Typography>
            )}

            {loading && events.length > 0 && <CircularProgress sx={{display: 'block', margin: 'auto', my: 2}}/>}

            <Grid container spacing={2}>
                {events.map(event => (
                    <Grid item xs={12} key={event.eventId}> {/* Changed to full width for list items */}
                        <HealthEventListItem
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

export default HealthEventManagement;
