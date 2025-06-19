import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Medication as MedicationIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Notes as NotesIcon,
  Category as CategoryIcon,
  AccessTime as AccessTimeIcon,
  ErrorOutline as ErrorOutlineIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  HelpOutline as HelpOutlineIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Cancel as CancelIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  School as SchoolIcon,
  AssignmentInd as AssignmentIndIcon
} from '@mui/icons-material';

const getStatusChipColor = (status) => {
  switch (status) {
    case 'PENDING': return 'warning';
    case 'APPROVED': return 'info';
    case 'ADMINISTERED': return 'success';
    case 'REJECTED': return 'error';
    case 'CANCELLED': return 'default';
    default: return 'default';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'PENDING': return <HourglassEmptyIcon />;
    case 'APPROVED': return <CheckCircleOutlineIcon />;
    case 'ADMINISTERED': return <CheckCircleOutlineIcon color="success" />;
    case 'REJECTED': return <ErrorOutlineIcon color="error" />;
    case 'CANCELLED': return <CancelIcon />;
    default: return <HelpOutlineIcon />;
  }
};

const MedicationRequestDetailPage = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [requestDetails, setRequestDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser || !currentUser.accessToken) {
      setError("Authentication required. Please log in.");
      setLoading(false);
      return;
    }

    const fetchRequestDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`/api/medication-requests/${requestId}`, {
          headers: { Authorization: `Bearer ${currentUser.accessToken}` },
        });
        setRequestDetails(response.data);
      } catch (err) {
        console.error("Error fetching medication request details:", err);
        setError(err.response?.data?.message || err.message || "Failed to fetch medication request details.");
      } finally {
        setLoading(false);
      }
    };

    if (requestId) {
      fetchRequestDetails();
    }
  }, [requestId, currentUser]);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error" action={
          <Button color="inherit" size="small" onClick={() => navigate('/parent/dashboard')}>
            Back to Dashboard
          </Button>
        }>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!requestDetails) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="info">No medication request details found.</Alert>
        <Button startIcon={<ArrowBackIcon />} sx={{ mt: 2 }} variant="outlined" onClick={() => navigate('/parent/dashboard')}>
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  const {
    studentName,
    studentCode,
    medicationName,
    dosage,
    frequency,
    startDate,
    endDate,
    reason,
    notes,
    status,
    requestDate,
    requestedBy, // User object
    approvedBy,  // User object
    administeredBy, // User object
    rejectionReason,
    cancellationReason,
    administrationNotes,
    administrationTime
  } = requestDetails;

  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString() : 'N/A';
  const formatDateTime = (dateString) => dateString ? new Date(dateString).toLocaleString() : 'N/A';

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <MedicationIcon sx={{ mr: 1, fontSize: '2.5rem' }} color="primary" />
            Medication Request Details
          </Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            onClick={() => navigate('/parent/dashboard')}
          >
            Back to Dashboard
          </Button>
        </Box>

        <Grid container spacing={3}>
          {/* Request Status */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', p: 2, backgroundColor: 'grey.100', borderRadius: 1 }}>
              <ListItemIcon sx={{minWidth: 'auto', mr: 1.5}}>
                {getStatusIcon(status)}
              </ListItemIcon>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Status
              </Typography>
              <Chip label={status || 'N/A'} color={getStatusChipColor(status)} size="medium" />
            </Box>
          </Grid>

          {/* Student Information */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}><SchoolIcon sx={{mr:1}}/>Student</Typography>
            <Typography><strong>Name:</strong> {studentName || 'N/A'}</Typography>
            <Typography><strong>Student Code:</strong> {studentCode || 'N/A'}</Typography>
          </Grid>

          {/* Medication Information */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}><MedicationIcon sx={{mr:1}}/>Medication</Typography>
            <Typography><strong>Name:</strong> {medicationName || 'N/A'}</Typography>
            <Typography><strong>Dosage:</strong> {dosage || 'N/A'}</Typography>
            <Typography><strong>Frequency:</strong> {frequency || 'N/A'}</Typography>
          </Grid>

          {/* Dates */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}><CalendarIcon sx={{mr:1}}/>Dates</Typography>
            <Typography><strong>Start Date:</strong> {formatDate(startDate)}</Typography>
            <Typography><strong>End Date:</strong> {formatDate(endDate)}</Typography>
            <Typography><strong>Requested On:</strong> {formatDate(requestDate)}</Typography>
          </Grid>
          
          {/* Reason & Notes */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}><NotesIcon sx={{mr:1}}/>Reason & Notes</Typography>
            <Typography><strong>Reason for Medication:</strong> {reason || 'N/A'}</Typography>
            {notes && <Typography><strong>Additional Notes:</strong> {notes}</Typography>}
          </Grid>

          <Grid item xs={12}><Divider sx={{my:1}}/></Grid>

          {/* Requester Information */}
          {requestedBy && (
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}><PersonIcon sx={{mr:1}}/>Requested By</Typography>
              <Typography><strong>Name:</strong> {requestedBy.fullName || requestedBy.username || 'N/A'}</Typography>
              <Typography><strong>Role:</strong> {requestedBy.role?.name || 'N/A'}</Typography>
            </Grid>
          )}

          {/* Approver Information */}
          {approvedBy && (
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}><AdminPanelSettingsIcon sx={{mr:1}}/>Approved By</Typography>
              <Typography><strong>Name:</strong> {approvedBy.fullName || approvedBy.username || 'N/A'}</Typography>
              <Typography><strong>Role:</strong> {approvedBy.role?.name || 'N/A'}</Typography>
            </Grid>
          )}
          
          {/* Administrator Information */}
          {administeredBy && (
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}><AssignmentIndIcon sx={{mr:1}}/>Administered By</Typography>
              <Typography><strong>Name:</strong> {administeredBy.fullName || administeredBy.username || 'N/A'}</Typography>
              <Typography><strong>Role:</strong> {administeredBy.role?.name || 'N/A'}</Typography>
              {administrationTime && <Typography><strong>Time:</strong> {formatDateTime(administrationTime)}</Typography>}
              {administrationNotes && <Typography><strong>Administration Notes:</strong> {administrationNotes}</Typography>}
            </Grid>
          )}

          {/* Rejection/Cancellation Reason */}
          {status === 'REJECTED' && rejectionReason && (
            <Grid item xs={12}>
              <Alert severity="error" icon={<ErrorOutlineIcon />}>
                <strong>Rejection Reason:</strong> {rejectionReason}
              </Alert>
            </Grid>
          )}
          {status === 'CANCELLED' && cancellationReason && (
            <Grid item xs={12}>
              <Alert severity="info" icon={<CancelIcon />}>
                <strong>Cancellation Reason:</strong> {cancellationReason || "Request was cancelled."}
              </Alert>
            </Grid>
          )}

        </Grid>
      </Paper>
    </Container>
  );
};

export default MedicationRequestDetailPage;

