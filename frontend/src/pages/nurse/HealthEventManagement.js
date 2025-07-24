import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, CircularProgress, Alert, Paper, Grid, Modal } from '@mui/material'; // Added Modal
import { AddCircleOutline as AddIcon } from '@mui/icons-material';
import HealthEventForm from '../../components/healthcheckup/HealthEventForm'; // Corrected path
import HealthEventListItem from '../../components/healthcheckup/HealthEventListItem'; // Corrected path
import { getAllHealthEvents, createHealthEvent, updateHealthEvent, deleteHealthEvent, sendVaccinationConsents } from '../../utils/api';
import { useUIText } from '../../hooks/useUIText';
import { useAlert } from '../../hooks/useAlert';
import { VaccinationSuccessDialog } from '../../components/notifications';

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
    const { successAlert, errorAlert, deleteConfirm } = useAlert();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openFormModal, setOpenFormModal] = useState(false);
    const [openViewModal, setOpenViewModal] = useState(false); // Added for view modal
    const [selectedEvent, setSelectedEvent] = useState(null); // For editing
    const [isEditMode, setIsEditMode] = useState(false);
    const [vaccinationSuccessOpen, setVaccinationSuccessOpen] = useState(false);
    const [successEventName, setSuccessEventName] = useState('');

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
    }, [t]);

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

    const handleSendConsents = async (event) => {
        try {
            await sendVaccinationConsents(event.eventId);
            setSuccessEventName(event.eventName);
            setVaccinationSuccessOpen(true);
            // Optionally refresh the events list to show updated status
            fetchEvents();
        } catch (err) {
            errorAlert(err.message || 'Không thể gửi yêu cầu đồng ý tiêm chủng');
        }
    };

    const handleDeleteEvent = async (eventId) => {
        const confirmed = await deleteConfirm(t.deleteConfirm);
        if (confirmed) {
            try {
                await deleteHealthEvent(eventId);
                fetchEvents(); // Refresh list
                successAlert('Đã xóa sự kiện thành công');
            } catch (err) {
                errorAlert(err.message || t.deleteError);
            }
        }
    };

    // View event details
    const handleViewEvent = (event) => {
        setSelectedEvent(event);
        setOpenViewModal(true);
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
                        initialData={isEditMode ? selectedEvent : null}
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
                            onView={handleViewEvent} // Pass the handler for viewing event details
                            onSendConsents={handleSendConsents} // Pass the handler for sending consents
                        />
                    </Grid>
                ))}
            </Grid>



            {/* View Event Details Modal */}
            <Modal open={openViewModal} onClose={() => setOpenViewModal(false)}>
                <Box sx={style}>
                    <Typography variant="h5" gutterBottom>
                        {t.eventDetails}
                    </Typography>
                    {selectedEvent && (
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                {selectedEvent.eventName}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                <strong>{t.eventType}:</strong> {selectedEvent.eventType}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                <strong>{t.description}:</strong> {selectedEvent.description || t.notSpecified}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                <strong>{t.scheduledDate}:</strong> {selectedEvent.scheduledDate || t.notSpecified}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                <strong>{t.location}:</strong> {selectedEvent.location || t.notSpecified}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                <strong>{t.status}:</strong> {selectedEvent.status}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                <strong>{t.gradeLevels}:</strong> {selectedEvent.targetGradeNames?.join(', ') || t.notSpecified}
                            </Typography>
                            
                            {/* Always show Types of Checkups for HEALTH_CHECKUP events */}
                            {selectedEvent.eventType === 'HEALTH_CHECKUP' && (
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    <strong>{t.typesOfCheckups || 'Types of Checkups'}:</strong> {
                                        selectedEvent.typesOfCheckups && selectedEvent.typesOfCheckups.length > 0 
                                            ? selectedEvent.typesOfCheckups.join(', ')
                                            : 'No specific checkup types specified (General health checkup)'
                                    }
                                </Typography>
                            )}
                            
                            {selectedEvent.eventType === 'VACCINATION' && (
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    <strong>Vaccines:</strong> {selectedEvent.vaccineNames?.join(', ') || 'Not specified'}
                                </Typography>
                            )}
                            
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                <Button onClick={() => setOpenViewModal(false)}>
                                    {t.close}
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Modal>

            {/* Vaccination Success Dialog */}
            <VaccinationSuccessDialog
                open={vaccinationSuccessOpen}
                onClose={() => setVaccinationSuccessOpen(false)}
                title="Thành công!"
                message={`Yêu cầu đồng ý tiêm chủng đã được gửi thành công cho "${successEventName}"`}
                confirmText="Đồng ý"
            />
        </Paper>
    );
};

export default HealthEventManagement;
