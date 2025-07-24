import React from 'react';
import { Paper, Typography, Button, Grid, IconButton, Box, Chip } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon, 
         VaccinesOutlined as VaccineIcon, HealthAndSafety as HealthCheckupIcon } from '@mui/icons-material';
import { useUIText } from '../../hooks/useUIText';

const HealthEventListItem = ({ event, onEdit, onDelete, onView, onSendConsents }) => {
  const { t, getStatusColor, getEventTypeColor, formatDate, getEventTypeLabel, getStatusLabel } = useUIText();
  
  if (!event) {
    return null;
  }
  
  const getEventTypeDetails = (eventType) => {
    switch (eventType) {
      case 'HEALTH_CHECKUP':
        return {
          label: getEventTypeLabel(eventType),
          icon: <HealthCheckupIcon />,
          color: getEventTypeColor(eventType)
        };
      case 'VACCINATION':
        return {
          label: getEventTypeLabel(eventType),
          icon: <VaccineIcon />,
          color: getEventTypeColor(eventType)
        };
      default:
        return {
          label: t.unknown,
          icon: null,
          color: 'default'
        };
    }
  };

  const eventTypeDetails = getEventTypeDetails(event.eventType);

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={8}>
          <Box display="flex" alignItems="center" mb={1}>
            <Typography variant="h6" sx={{mr: 1}}>{event.eventName}</Typography>
            <Chip
              icon={eventTypeDetails.icon}
              label={eventTypeDetails.label}
              color={eventTypeDetails.color}
              size="small"
              sx={{ mr: 1 }}
            />
            <Chip 
              label={getStatusLabel(event.status)}
              color={getStatusColor(event.status)}
              size="small"
            />
          </Box>          <Typography variant="body2" color="textSecondary">{event.description}</Typography>          <Typography variant="caption" display="block" gutterBottom>
            {t.scheduledDate}: {event.scheduledDate ? formatDate(event.scheduledDate) : t.notSpecified}
          </Typography>
          <Typography variant="caption" display="block">
            {t.location}: {event.location || t.notSpecified}
          </Typography>
          {/* Display target grade levels with fallback options */}
          {(() => {
            let gradeDisplay = '';
            if (event.targetGradeNames && event.targetGradeNames.length > 0) {
              gradeDisplay = event.targetGradeNames.join(', ');
            } else if (event.targetGradeIds && event.targetGradeIds.length > 0) {
              gradeDisplay = `Grade IDs: ${event.targetGradeIds.join(', ')}`;
            } else if (event.targetGradeLevels && typeof event.targetGradeLevels === 'string') {
              gradeDisplay = event.targetGradeLevels;
            }
            
            return gradeDisplay ? (
              <Typography variant="caption" display="block">
                {t.gradeLevels}: {gradeDisplay}
              </Typography>
            ) : null;
          })()}
        </Grid>
        <Grid item xs={12} sm={4} container justifyContent={{ xs: 'flex-start', sm: 'flex-end' }} spacing={1}>
          {/* Send Consent Requests button for vaccination events */}
          {event.eventType === 'VACCINATION' && onSendConsents && (
            <Grid item>
              <Button
                variant="contained"
                size="small"
                color="success"
                onClick={() => onSendConsents(event)}
                sx={{ mr: {sm: 1}, mb: {xs: 1, sm: 0} }}
              >
                Send Consents
              </Button>
            </Grid>
          )}
          {onView && (
            <Grid item>
              <Button
                variant="outlined"
                size="small"
                startIcon={<ViewIcon />}
                onClick={() => onView(event)}
                sx={{ mr: {sm: 1}, mb: {xs: 1, sm: 0} }}
              >
                {t.view}
              </Button>
            </Grid>
          )}
          {onEdit && (
            <Grid item>
              <IconButton color="primary" onClick={() => onEdit(event)} aria-label={t.edit}>
                <EditIcon />
              </IconButton>
            </Grid>
          )}
          {onDelete && (
            <Grid item>
              <IconButton color="error" onClick={() => onDelete(event.eventId)} aria-label={t.delete}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default HealthEventListItem;
