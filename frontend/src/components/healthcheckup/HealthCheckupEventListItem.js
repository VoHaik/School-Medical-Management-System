import React from 'react';
import { Paper, Typography, Button, Grid, IconButton, Box } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon } from '@mui/icons-material';

const HealthCheckupEventListItem = ({ event, onEdit, onDelete, onViewStudents }) => {
  if (!event) {
    return null;
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={8}>
          <Typography variant="h6" gutterBottom>{event.eventName}</Typography>
          <Typography variant="body2" color="textSecondary">{event.description}</Typography>
          <Typography variant="caption" display="block" gutterBottom>
            Date: {formatDate(event.startDate)} - {formatDate(event.endDate)}
          </Typography>
          <Typography variant="caption" display="block">
            Location: {event.location || 'N/A'}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4} container justifyContent={{ xs: 'flex-start', sm: 'flex-end' }} spacing={1}>
          {onViewStudents && (
            <Grid item>
              <Button
                variant="outlined"
                size="small"
                startIcon={<ViewIcon />}
                onClick={() => onViewStudents(event.eventId)}
                sx={{ mr: {sm: 1}, mb: {xs: 1, sm: 0} }}
              >
                View Students
              </Button>
            </Grid>
          )}
          {onEdit && (
            <Grid item>
              <IconButton color="primary" onClick={() => onEdit(event)} aria-label="edit event">
                <EditIcon />
              </IconButton>
            </Grid>
          )}
          {onDelete && (
            <Grid item>
              <IconButton color="error" onClick={() => onDelete(event.eventId)} aria-label="delete event">
                <DeleteIcon />
              </IconButton>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default HealthCheckupEventListItem;
