import React from 'react';
import {
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  Typography, 
  Chip, 
  Button, 
  Paper, 
  Box 
} from '@mui/material';
import MedicationIcon from '@mui/icons-material/Medication';
import PersonIcon from '@mui/icons-material/Person';
import ViewIcon from '@mui/icons-material/Visibility';
import CancelIcon from '@mui/icons-material/Cancel'; // Assuming you might add cancel here too
import { useNavigate } from 'react-router-dom';

const getChipColor = (status) => {
  switch (status) {
    case 'PENDING': return 'warning';
    case 'APPROVED': return 'info';
    case 'ADMINISTERED': return 'success';
    case 'REJECTED': return 'error';
    case 'CANCELLED': return 'default';
    default: return 'default';
  }
};

const getStatusColor = (status) => { // For Avatar background
  switch (status) {
    case 'PENDING': return 'warning.main';
    case 'APPROVED': return 'info.main';
    case 'ADMINISTERED': return 'success.main';
    case 'REJECTED': return 'error.main';
    case 'CANCELLED': return 'grey.500';
    default: return 'grey.500';
  }
};

const MedicationItem = ({ request, onCancelRequest }) => {
  const navigate = useNavigate();

  if (!request) {
    return null; // Or some placeholder if a request is expected but missing
  }

  return (
    <Paper component="li" elevation={2} sx={{ mb: 2, borderRadius: 2, '&:hover': { boxShadow: 5 } }}>
      <ListItem alignItems="flex-start" sx={{ p: 2 }}>
        <ListItemAvatar sx={{ mr: 2, mt: 0.5 }}>
          <Avatar sx={{ bgcolor: getStatusColor(request.status), width: 48, height: 48 }}>
            <MedicationIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primaryTypographyProps={{ variant: 'h6', fontWeight: 'medium', mb: 0.5 }}
          primary={`${request.medicationName || 'N/A'}`}
          secondary={
            <>
              <Typography component="div" variant="body2" color="text.primary">
                Student: <Chip label={request.studentName || request.studentCode || 'N/A'} size="small" icon={<PersonIcon />} sx={{mr:1}}/>
                Status: <Chip label={request.status || 'N/A'} size="small" color={getChipColor(request.status)} />
              </Typography>
              <Typography component="div" variant="body2" color="text.secondary" sx={{mt: 0.5}}>
                Requested: {request.requestDate ? new Date(request.requestDate).toLocaleDateString() : 'N/A'}
              </Typography>
              {request.reason && (
                <Typography component="div" variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, fontStyle: 'italic' }}>
                  Reason: {request.reason}
                </Typography>
              )}
              {/* Display more fields as needed, e.g., dosage, frequency */}
              {request.dosage && (
                <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  Dosage: {request.dosage}
                </Typography>
              )}
              {request.frequency && (
                <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  Frequency: {request.frequency}
                </Typography>
              )}
            </>
          }
        />
        <Box sx={{ display: 'flex', flexDirection: { xs: 'row', sm: 'column' }, alignItems: 'center', gap: 1, pt: {xs: 1, sm: 0}, ml: 'auto', mt: {xs:1, sm:0.5} }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<ViewIcon />}
            onClick={() => navigate(`/parent/medication-request/${request.requestId}`)} // Ensure this route exists
            sx={{minWidth: '105px', mb: {sm: 0.5}}}
          >
            Details
          </Button>
          {(request.status === 'PENDING' || request.status === 'SUBMITTED') && onCancelRequest && (
            <Button
              variant="outlined"
              size="small"
              color="error"
              startIcon={<CancelIcon />}
              onClick={() => onCancelRequest(request.requestId)}
              sx={{minWidth: '105px'}}
            >
              Cancel
            </Button>
          )}
        </Box>
      </ListItem>
    </Paper>
  );
};

export default MedicationItem;
