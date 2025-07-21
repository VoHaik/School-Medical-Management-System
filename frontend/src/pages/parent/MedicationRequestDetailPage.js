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
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
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
  AssignmentInd as AssignmentIndIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

// Get status directly from database status field
const determineStatus = (request) => {
  // Always use the status field from database
  return request.status || 'PENDING'; // Return PENDING as fallback if status is missing
};

const getStatusChipColor = (request) => {
  const status = typeof request === 'string' ? request : determineStatus(request);
  
  switch (status) {
    case 'PENDING': return 'warning'; // Màu vàng cho PENDING
    case 'APPROVED': return 'success'; // Màu xanh lá cho APPROVED
    case 'ADMINISTERED': return 'info'; // Màu xanh dương cho ADMINISTERED
    case 'REJECTED': return 'error'; // Màu đỏ cho REJECTED
    case 'CANCELLED_BY_PARENT': return 'default'; // Màu xám cho CANCELLED
    default: return 'default';
  }
};

const getStatusIcon = (request) => {
  const status = typeof request === 'string' ? request : determineStatus(request);
  
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
          // Check if it's the database conversion error
        const errorMessage = err.response?.data?.error || err.message || '';
        if (errorMessage.includes('conversion from varchar to NCHAR') || 
            errorMessage.includes('Could not extract column') ||
            errorMessage.includes('data type mismatch') ||
            errorMessage.includes('String or binary data would be truncated')) {
          // Provide fallback data for the UI with our enhanced structure
          setRequestDetails({
            requestId: parseInt(requestId),
            studentName: "Your Child",
            studentCode: "S12345",
            student: {
              fullName: "Your Child",
              studentCode: "S12345",
              clazz: { name: "Class 5A" }
            },
            medicationName: "Ibuprofen",
            dosage: "200mg",
            frequency: "As needed for pain",
            startDate: new Date().toISOString(),
            endDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            reason: "Occasional headaches",
            notes: "Sample fallback data due to database issue",            status: "PENDING", // Trạng thái là PENDING
            requestDate: new Date().toISOString(),
            requestedBy: {
              fullName: currentUser.fullName || currentUser.username,
              username: currentUser.username,
              role: { name: "PARENT" }
            }
          });
          
          setError("Note: The system is currently experiencing database issues. This is sample data being shown for demonstration purposes.");
          setLoading(false);
          return;
        }
        
        setError(err.response?.data?.message || err.message || "Failed to fetch medication request details.");
      } finally {
        setLoading(false);
      }
    };

    if (requestId) {
      fetchRequestDetails();
    }
  }, [requestId, currentUser]);

  // Function to handle deletion of medication request
  const handleDelete = async () => {
    if (!currentUser || !currentUser.accessToken) {
      setError("Authentication required. Please log in again.");
      return;
    }
    
    setDeleteLoading(true);
    try {
      await axios.delete(`/api/medication-requests/${requestId}`, {
        headers: { Authorization: `Bearer ${currentUser.accessToken}` }
      });
      
      setDeleteDialogOpen(false);
      // Redirect to the medication requests list after successful deletion
      navigate('/parent/medication-requests', { 
        state: { alert: { severity: 'success', message: 'Medication request was successfully deleted.' } }
      });
    } catch (err) {
      console.error("Error deleting medication request:", err);
      const errorMessage = err.response?.data?.error || err.message;
      setError(`Failed to delete: ${errorMessage}`);
      setDeleteDialogOpen(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Function to handle editing of medication request
  const handleEdit = () => {
    navigate(`/parent/medication-request/edit/${requestId}`);
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }
  if (error && !requestDetails) {
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
  
  // If we have both error and requestDetails, it means we're showing fallback data
  // We'll display the actual UI with a warning banner

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
    administrationTime,
    approvalDate, // Added this field
    approval_date, // Added as fallback
    administered_at // Added as fallback
  } = requestDetails;

  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('en-US') : 'N/A';
  const formatDateTime = (dateString) => dateString ? new Date(dateString).toLocaleString('en-US') : 'N/A';
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>      {error && requestDetails && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="medium">
            Database Character Encoding Issue
          </Typography>
          <Typography variant="body2">
            We're experiencing a temporary database character encoding issue. 
            This happens because some text fields need to be converted from plain text to Unicode format.
            The information below is sample data while our team resolves this issue.
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
            Technical Note: If you're a system administrator, please run the "fix-database-conversion-issues.ps1" 
            script in the scripts folder to resolve this issue.
          </Typography>
        </Alert>
      )}
      
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <MedicationIcon sx={{ mr: 1, fontSize: '2.5rem' }} color="primary" />
            Medication Request Details
          </Typography>
          <Box>
            <Button
              startIcon={<ArrowBackIcon />}
              variant="outlined"
              onClick={() => navigate('/parent/medication-requests')}
              sx={{ mr: 1 }}
            >
              Back to Requests
            </Button>
            
            {/* Show edit and delete buttons only if status is PENDING */}
            {requestDetails && determineStatus(requestDetails) === 'PENDING' && currentUser && (
              <>
                <Button
                  startIcon={<EditIcon />}
                  variant="contained"
                  color="primary"
                  onClick={handleEdit}
                  sx={{ mr: 1 }}
                >
                  Edit
                </Button>
                <Button
                  startIcon={<DeleteIcon />}
                  variant="contained"
                  color="error"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  Delete
                </Button>
              </>
            )}
          </Box>
        </Box>

        <Grid container spacing={3}>          {/* Request Status */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', p: 2, backgroundColor: 'grey.100', borderRadius: 1 }}>
              <ListItemIcon sx={{minWidth: 'auto', mr: 1.5}}>
                {getStatusIcon(requestDetails)}
              </ListItemIcon>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Status
              </Typography>
              <Chip 
                label={determineStatus(requestDetails)} 
                color={getStatusChipColor(requestDetails)} 
                size="medium" 
              />
            </Box>
          </Grid>          {/* Student Information */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}><SchoolIcon sx={{mr:1}}/>Student</Typography>
            <Typography><strong>Name:</strong> {studentName || requestDetails.student?.fullName || 'N/A'}</Typography>
            <Typography><strong>Student Code:</strong> {studentCode || requestDetails.student_code || 'N/A'}</Typography>
            {requestDetails.student?.clazz && (
              <Typography><strong>Class:</strong> {requestDetails.student.clazz.name || 'N/A'}</Typography>
            )}
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
          )}          {/* Approver Information - based on status and available approvedBy data */}
          {(determineStatus(requestDetails) === 'APPROVED' || determineStatus(requestDetails) === 'ADMINISTERED') && approvedBy && (
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}><AdminPanelSettingsIcon sx={{mr:1}}/>Approved By</Typography>
              <Typography>
                <strong>Name:</strong> {approvedBy?.fullName || approvedBy?.username || 'School Nurse'}
              </Typography>
              <Typography><strong>Role:</strong> {approvedBy?.role?.name || 'Nurse'}</Typography>              {(approvalDate || approval_date) && (
                <Typography>
                  <strong>Date:</strong> {formatDateTime(approvalDate || approval_date)}
                </Typography>
              )}
            </Grid>
          )}
          
          {/* Administrator Information - based on status and available administeredBy data */}
          {determineStatus(requestDetails) === 'ADMINISTERED' && administeredBy && (
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}><AssignmentIndIcon sx={{mr:1}}/>Administered By</Typography>
              <Typography>
                <strong>Name:</strong> {administeredBy?.fullName || administeredBy?.username || 'School Nurse'}
              </Typography>
              <Typography><strong>Role:</strong> {administeredBy?.role?.name || 'Nurse'}</Typography>              {(administrationTime || administered_at) && (
                <Typography>
                  <strong>Time:</strong> {formatDateTime(administrationTime || administered_at)}
                </Typography>
              )}              {(administrationNotes) && (
                <Typography>
                  <strong>Administration Notes:</strong> {administrationNotes}
                </Typography>
              )}
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
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !deleteLoading && setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          {"Delete Medication Request?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this medication request? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)} 
            disabled={deleteLoading}
            color="primary"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MedicationRequestDetailPage;

