import React, { useState } from 'react';
import { Paper, Typography, Button, Grid, Chip, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const ParentHealthCheckupEventItem = ({ event, childId, studentName, consentStatus, consentDate, resultAvailable, onGiveConsent, onViewDetails }) => {
  const [openConsentModal, setOpenConsentModal] = useState(false);
  const [consentNotes, setConsentNotes] = useState(''); // If you want to add notes

  if (!event) {
    return null;
  }

  const handleOpenConsentModal = () => {
    setOpenConsentModal(true);
  };

  const handleCloseConsentModal = () => {
    setOpenConsentModal(false);
    setConsentNotes(''); // Reset notes on close
  };

  const handleConfirmConsent = async (consentDecision) => {
    // onGiveConsent will now be the function that calls the API
    // It should accept eventId, childId, consentDecision (true/false), and optionally notes
    await onGiveConsent(event.eventId, childId, consentDecision, consentNotes);
    handleCloseConsentModal();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getConsentChip = () => {
    let chipLabel = "Consent Pending";
    let chipColor = "warning";

    switch (consentStatus) {
      case true: // Assuming consentStatus is now boolean true/false or null/undefined
        chipLabel = `Consent Given on ${formatDate(consentDate)}`;
        chipColor = "success";
        break;
      case false:
        chipLabel = `Consent Denied on ${formatDate(consentDate)}`;
        chipColor = "error";
        break;
      default:
        // Keep pending
        break;
    }
    return <Chip label={chipLabel} color={chipColor} size="small" />;
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>{event.eventName} {studentName ? `for ${studentName}` : ''}</Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            {event.description}
          </Typography>
          <Typography variant="caption" display="block" gutterBottom>
            Date: {formatDate(event.startDate)} - {formatDate(event.endDate)}
          </Typography>
          <Typography variant="caption" display="block" sx={{ mb: 1 }}>
            Location: {event.location || 'N/A'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1}}>
            <Typography variant="subtitle2">Status for your child:</Typography>
            {getConsentChip()}
            {resultAvailable && <Chip label="Results Available" color="info" size="small" />}
          </Box>
        </Grid>
        <Grid item xs={12} md={4} container direction={{xs: 'row', md: 'column'}} spacing={1} justifyContent="center" alignItems={{md: 'flex-end'}}>
          {onViewDetails && (
            <Grid item>
                <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={() => onViewDetails(event.eventId, childId)} 
                    fullWidth
                >
                    View Details / Results
                </Button>
            </Grid>
          )}
          {/* Consent button logic changed to open modal */}
          {(consentStatus === null || consentStatus === undefined) && onGiveConsent && (
            <Grid item>
                <Button 
                    variant="contained" 
                    size="small" 
                    onClick={handleOpenConsentModal} 
                    fullWidth
                >
                    Provide Consent
                </Button>
            </Grid>
          )}
        </Grid>
      </Grid>

      <Dialog open={openConsentModal} onClose={handleCloseConsentModal}>
        <DialogTitle>Consent for {event.eventName}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{mb: 2}}>
            Please review the details for the health checkup event: <strong>{event.eventName}</strong> for your child {studentName ? <strong>{studentName}</strong> : ''}. 
            This event is scheduled from {formatDate(event.startDate)} to {formatDate(event.endDate)} at {event.location || 'N/A'}.
            <br/><br/>
            Do you consent to your child participating in this health checkup event?
          </DialogContentText>
          {/* Optional: Add a field for notes or reasons */}
          {/* 
          <TextField 
            autoFocus
            margin="dense"
            id="consentNotes"
            label="Optional Notes (e.g., specific concerns or conditions)"
            type="text"
            fullWidth
            variant="standard"
            value={consentNotes}
            onChange={(e) => setConsentNotes(e.target.value)}
          />
          */}
        </DialogContent>
        <DialogActions sx={{p: '0 24px 20px'}}>
          <Button onClick={() => handleConfirmConsent(false)} color="error">Deny Consent</Button>
          <Button onClick={() => handleConfirmConsent(true)} variant="contained" color="success">Give Consent</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ParentHealthCheckupEventItem;
