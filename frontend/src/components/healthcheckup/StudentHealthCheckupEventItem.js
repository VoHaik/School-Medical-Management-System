import React from 'react';
import { Paper, Typography, Grid, Chip, Box, Divider } from '@mui/material';

const StudentHealthCheckupEventItem = ({ studentCheckup }) => {
  if (!studentCheckup || !studentCheckup.healthCheckupEvent) {
    return null;
  }

  const { healthCheckupEvent, ...checkupDetails } = studentCheckup;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const resultsAvailable = checkupDetails.height || checkupDetails.weight; // Simple check

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>{healthCheckupEvent.eventName}</Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
        {healthCheckupEvent.description}
      </Typography>
      <Grid container spacing={1} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="caption" display="block">
            Date: {formatDate(healthCheckupEvent.startDate)} - {formatDate(healthCheckupEvent.endDate)}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="caption" display="block">
            Location: {healthCheckupEvent.location || 'N/A'}
          </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" gutterBottom>Your Checkup Details</Typography>
      {checkupDetails.consentStatus === 'CONSENTED' && resultsAvailable ? (
        <Grid container spacing={1}>
          <Grid item xs={6} sm={3}><Typography><strong>Height:</strong> {checkupDetails.height || 'N/A'} cm</Typography></Grid>
          <Grid item xs={6} sm={3}><Typography><strong>Weight:</strong> {checkupDetails.weight || 'N/A'} kg</Typography></Grid>
          <Grid item xs={6} sm={3}><Typography><strong>Vision:</strong> {checkupDetails.vision || 'N/A'}</Typography></Grid>
          <Grid item xs={6} sm={3}><Typography><strong>Hearing:</strong> {checkupDetails.hearing || 'N/A'}</Typography></Grid>
          <Grid item xs={12} sm={6}><Typography><strong>Dental Health:</strong> {checkupDetails.dentalHealth || 'N/A'}</Typography></Grid>
          <Grid item xs={12} sm={6}><Typography><strong>Scoliosis:</strong> {checkupDetails.scoliosisScreening || 'N/A'}</Typography></Grid>
          <Grid item xs={12}><Typography><strong>General Condition:</strong> {checkupDetails.generalCondition || 'N/A'}</Typography></Grid>
          {checkupDetails.notes && (
            <Grid item xs={12}><Typography><strong>Nurse Notes:</strong> {checkupDetails.notes}</Typography></Grid>
          )}
        </Grid>
      ) : checkupDetails.consentStatus === 'CONSENTED' && !resultsAvailable ? (
        <Typography>Your results are not yet available. Please check back later.</Typography>
      ) : checkupDetails.consentStatus === 'PENDING' ? (
        <Typography>Your participation is pending parental consent.</Typography>
      ) : checkupDetails.consentStatus === 'REJECTED' ? (
        <Typography>Parental consent was not provided for this checkup.</Typography>
      ) : (
        <Typography>Your checkup details are not available or consent has not been processed.</Typography>
      )}
      {/* Display consent status if needed, though it's implied by message above */}
      {/* <Chip label={`Consent: ${checkupDetails.consentStatus}`} size="small" sx={{mt:1}} /> */}
    </Paper>
  );
};

export default StudentHealthCheckupEventItem;
