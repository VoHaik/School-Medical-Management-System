import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { 
    Typography, 
    List, 
    ListItem, 
    ListItemText, 
    Paper, 
    CircularProgress, 
    Alert, 
    Chip, 
    Container,
    Button,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Snackbar
} from '@mui/material';
import { 
    ArrowBack as ArrowBackIcon, 
    Visibility as VisibilityIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const ViewMedicationRequestsPage = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [currentRequestId, setCurrentRequestId] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Check for alert messages from navigation
        if (location.state?.alert) {
            const { severity, message } = location.state.alert;
            setSnackbar({
                open: true,
                message,
                severity
            });
            // Clear the location state after showing the alert
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    useEffect(() => {
        if (!currentUser || !(currentUser.roles.includes('Parent') || currentUser.roles.includes('ROLE_PARENT'))) {
            navigate('/login'); // Redirect if not logged in as a parent
            return;
        }
        
        const fetchMedicationRequests = async () => {
            setLoading(true);
            setError(null);
            try {
                // Use the correct API endpoint from the backend controller
                const headers = { Authorization: `Bearer ${currentUser.accessToken}` };
                const response = await axios.get('/api/medication-requests/mine', { headers });
                setRequests(response.data || []);
                } catch (err) {
                console.error("Error fetching medication requests:", err);
                console.error("Error details:", err.response?.data);
                setError(err.response?.data?.error || err.message || 'Failed to fetch medication requests.');
            } finally {
                setLoading(false);
            }
        };

        fetchMedicationRequests();
    }, [currentUser, navigate]);    // Get status directly from database status field
    const determineStatus = (request) => {
        // Always use the status field from database
        return request.status || 'PENDING'; // Return PENDING as fallback if status is missing
    };    // Get status chip color based on the request status
    const getStatusChipColor = (request) => {
        const status = typeof request === 'string' ? request : determineStatus(request);
        
        switch (status) {
            case 'PENDING': return 'warning'; // Màu vàng cho PENDING
            case 'APPROVED': return 'success'; // Màu xanh lá cây cho APPROVED
            case 'REJECTED': return 'error'; // Màu đỏ cho REJECTED 
            case 'ADMINISTERED': return 'info'; // Màu info (xanh dương) cho ADMINISTERED
            case 'CANCELLED_BY_PARENT': return 'default'; // Màu mặc định cho CANCELLED
            default: return 'primary';
        }
    };
    
    // Format date string to a readable format
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        try {
            return new Date(dateString).toLocaleDateString(undefined, options);
        } catch (e) {
            return dateString; // fallback to original string if date is invalid
        }
    };

    // Handle opening the delete dialog
    const handleDeleteClick = (requestId) => {
        setCurrentRequestId(requestId);
        setDeleteDialogOpen(true);
    };

    // Handle closing the delete dialog
    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setCurrentRequestId(null);
    };

    // Handle confirming delete
    const handleDeleteConfirm = async () => {
        if (!currentRequestId || !currentUser || !currentUser.accessToken) {
            return;
        }

        setDeleteLoading(true);
        try {
            await axios.delete(`/api/medication-requests/${currentRequestId}`, {
                headers: { Authorization: `Bearer ${currentUser.accessToken}` }
            });

            // Remove the deleted request from the list
            setRequests(requests.filter(request => request.requestId !== currentRequestId));
            
            // Show success message
            setSnackbar({
                open: true,
                message: 'Medication request was successfully deleted.',
                severity: 'success'
            });
        } catch (err) {
            console.error("Error deleting medication request:", err);
            const errorMessage = err.response?.data?.error || err.message;
            setSnackbar({
                open: true,
                message: `Failed to delete: ${errorMessage}`,
                severity: 'error'
            });
        } finally {
            setDeleteLoading(false);
            setDeleteDialogOpen(false);
            setCurrentRequestId(null);
        }
    };

    // Handle closing snackbar
    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    if (loading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Container>
        );
    }    // Function to load fallback data if the server request fails
    const loadFallbackData = () => {
        // Set some enhanced mock data to ensure the UI can still be displayed
        const today = new Date();
        const fallbackRequests = [
            {                requestId: 1001,
                medicationName: "Ibuprofen",
                dosage: "200mg",
                frequency: "As needed for pain",
                reason: "Occasional headaches",
                status: "PENDING", // Trạng thái là PENDING
                requestDate: today.toISOString(),
                studentName: "Emma Smith",
                studentCode: "S12345",
                startDate: today.toISOString(),
                endDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
                student: {
                    fullName: "Emma Smith",
                    studentCode: "S12345",
                    clazz: { name: "Class 5A" }
                }
            },
            {
                requestId: 1002,
                medicationName: "Allergy Medicine",
                dosage: "5ml",
                frequency: "Once daily",
                reason: "Seasonal allergies",                status: "APPROVED", // Trạng thái là APPROVED
                requestDate: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
                studentName: "Michael Smith",
                studentCode: "S12346",
                startDate: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                endDate: new Date(today.getTime() + 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 days from now
                approvedBy: {
                    fullName: "Sarah Johnson",
                    username: "sjohnson",
                    role: { name: "NURSE" }
                },
                approval_date: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
                administered_by_nurse_id: null,
                student: {
                    fullName: "Michael Smith",
                    studentCode: "S12346",
                    clazz: { name: "Class 3B" }
                }
            },
            {
                requestId: 1003,
                medicationName: "Antibiotics",
                dosage: "250mg",
                frequency: "Twice daily",
                reason: "Ear infection",                status: "ADMINISTERED", // Trạng thái là ADMINISTERED
                requestDate: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
                studentName: "Emma Smith",
                studentCode: "S12345",
                startDate: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                endDate: new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 more days
                approvedBy: {
                    fullName: "Sarah Johnson",
                    username: "sjohnson",
                    role: { name: "NURSE" }
                },
                approval_date: new Date(today.getTime() - 9 * 24 * 60 * 60 * 1000).toISOString(), // 9 days ago
                administered_by_nurse_id: 102,
                administeredBy: {
                    fullName: "Robert Lee",
                    username: "rlee",
                    role: { name: "NURSE" }
                },
                administered_at: new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
                administration_notes: "First dose administered at school. Parent to continue treatment at home.",
                student: {
                    fullName: "Emma Smith",
                    studentCode: "S12345", 
                    clazz: { name: "Class 5A" }
                }
            }
        ];
        
        setRequests(fallbackRequests);
        setError(null); // Clear error once sample data is loaded
        setLoading(false);
    };    if (error) {        // Check if the error is related to the database conversion issue
        const isDatabaseConversionError = error.includes("conversion from varchar to NCHAR") || 
                                         error.includes("Could not extract column") ||
                                         error.includes("data type mismatch") ||
                                         error.includes("String or binary data would be truncated");
        
        if (isDatabaseConversionError) {
            return (
                <Container maxWidth="md" sx={{ py: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h4" component="h1">
                            My Medication Requests
                        </Typography>
                        <Button 
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate('/parent/dashboard')}
                        >
                            Back to Dashboard
                        </Button>
                    </Box>

                    <Alert 
                        severity="warning" 
                        sx={{ mb: 3 }}
                    >
                        <Typography variant="subtitle1" fontWeight="medium">
                            Database Error
                        </Typography>                        <Typography variant="body2">
                            We're experiencing a temporary database character encoding issue with medication requests. 
                            This happens because some text fields need to be converted from plain text to Unicode format.
                            Our team has been notified and is working on a fix. You can view sample data 
                            or return to the dashboard.
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                            Technical Note: If you're a system administrator, please run the "fix-database-conversion-issues.ps1" 
                            script in the scripts folder to resolve this issue.
                        </Typography>
                    </Alert>

                    <Paper sx={{ p: 3, mb: 2, textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'center', gap: 2 }}>
                            <Button 
                                variant="contained"
                                color="primary"
                                onClick={loadFallbackData}
                                startIcon={<VisibilityIcon />}
                                size="large"
                                sx={{ minWidth: 200 }}
                            >
                                View Sample Data
                            </Button>
                            <Button 
                                variant="outlined"
                                color="secondary"
                                onClick={() => navigate('/parent/dashboard')}
                                startIcon={<ArrowBackIcon />}
                                size="large"
                                sx={{ minWidth: 200 }}
                            >
                                Return to Dashboard
                            </Button>
                        </Box>
                    </Paper>
                </Container>
            );
        } else {
            // Standard error handling for other types of errors
            return (
                <Container maxWidth="md" sx={{ mt: 4 }}>
                    <Paper sx={{ p: 3, mb: 2 }}>
                        <Typography variant="h5" gutterBottom color="error">
                            Error Loading Medication Requests
                        </Typography>
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                        <Typography variant="body1" paragraph>
                            There was a problem loading your medication requests. This might be due to a temporary server issue.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button 
                                variant="contained"
                                onClick={() => window.location.reload()}
                            >
                                Try Again
                            </Button>
                            <Button 
                                variant="outlined"
                                startIcon={<ArrowBackIcon />} 
                                onClick={() => navigate('/parent/dashboard')} 
                            >
                                Back to Dashboard
                            </Button>
                        </Box>
                    </Paper>
                </Container>
            );
        }
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    My Medication Requests
                </Typography>
                <Button 
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/parent/dashboard')}
                >
                    Back to Dashboard
                </Button>
            </Box>

            {requests.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography>You have not submitted any medication requests yet.</Typography>
                </Paper>
            ) : (
                <List sx={{ bgcolor: 'background.paper' }}>
                    {requests.map((request) => (
                        <Paper 
                            key={request.requestId} 
                            sx={{ 
                                mb: 2,
                                border: '1px solid #eee',
                                borderRadius: '8px',
                                overflow: 'hidden'
                            }}
                        >
                            <ListItem 
                                sx={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    alignItems: 'flex-start',
                                    p: 2
                                }}
                            >                                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
                                    <Typography variant="h6">
                                        {request.medicationName}
                                    </Typography>
                                    <Chip 
                                        label={determineStatus(request)} 
                                        color={getStatusChipColor(request)} 
                                        size="small" 
                                    />
                                </Box>

                                <ListItemText
                                    disableTypography
                                    secondary={
                                        <>
                                            <Typography component="div" variant="body2" color="text.primary" sx={{ mb: 1 }}>
                                                <strong>For Child:</strong> {request.studentName || request.student?.fullName || 'Unknown Child'}
                                                {request.studentCode && ` (${request.studentCode})`}
                                            </Typography>
                                            <Typography component="div" variant="body2" color="text.primary">
                                                <strong>Dosage:</strong> {request.dosage}<br />
                                                <strong>Frequency:</strong> {request.frequency || 'As directed'}<br />
                                                <strong>Reason:</strong> {request.reason}<br />
                                                <strong>Start Date:</strong> {formatDate(request.startDate)} <br />
                                                <strong>End Date:</strong> {formatDate(request.endDate)}<br />
                                                <strong>Submitted:</strong> {formatDate(request.requestDate)}
                                                {request.updatedAt && request.updatedAt !== request.requestDate && (
                                                    <> | <strong>Last Updated:</strong> {formatDate(request.updatedAt)}</>
                                                )}
                                            </Typography>
                                              {/* Show approval information - based on status and available approvedBy data */}
                                            {(determineStatus(request) === 'APPROVED' || determineStatus(request) === 'ADMINISTERED') && request.approvedBy && (
                                                <Typography component="div" variant="body2" color="success.main" sx={{ mt: 1 }}>
                                                    <strong>Approved by:</strong> {request.approvedBy?.fullName || 'School Nurse'}
                                                    {request.approval_date && ` on ${formatDate(request.approval_date)}`}
                                                </Typography>
                                            )}
                                            
                                            {/* Show administration information - based on status and available administeredBy data */}
                                            {determineStatus(request) === 'ADMINISTERED' && request.administeredBy && (
                                                <Typography component="div" variant="body2" color="info.main" sx={{ mt: 0.5 }}>
                                                    <strong>Administered by:</strong> {request.administeredBy?.fullName || 'School Nurse'}
                                                    {request.administered_at && ` on ${formatDate(request.administered_at)}`}
                                                </Typography>
                                            )}
                                            
                                            {request.administration_notes && (
                                                <Typography component="div" variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                    <strong>Administration Notes:</strong> {request.administration_notes}
                                                </Typography>
                                            )}
                                            
                                            {request.notes && (
                                                <Typography component="div" variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                    <strong>Nurse Notes:</strong> {request.notes}
                                                </Typography>
                                            )}
                                            
                                            {request.rejectionReason && (
                                                <Typography component="div" variant="body2" color="error" sx={{ mt: 1 }}>
                                                    <strong>Rejection Reason:</strong> {request.rejectionReason}
                                                </Typography>
                                            )}
                                        </>
                                    }
                                />
                                
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mt: 2 }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        startIcon={<VisibilityIcon />}
                                        onClick={() => navigate(`/parent/medication-request/${request.requestId}`)}
                                        sx={{ mr: 1 }}
                                    >
                                        View Details
                                    </Button>

                                    {/* Show edit and delete buttons only if status is PENDING */}
                                    {determineStatus(request) === 'PENDING' && (
                                        <>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                size="small"
                                                startIcon={<EditIcon />}
                                                onClick={() => navigate(`/parent/medication-request/edit/${request.requestId}`)}
                                                sx={{ mr: 1 }}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                size="small"
                                                startIcon={<DeleteIcon />}
                                                onClick={() => handleDeleteClick(request.requestId)}
                                            >
                                                Delete
                                            </Button>
                                        </>
                                    )}
                                </Box>
                            </ListItem>
                        </Paper>
                    ))}
                </List>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
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
                        onClick={handleDeleteCancel} 
                        disabled={deleteLoading}
                        color="primary"
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleDeleteConfirm} 
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

export default ViewMedicationRequestsPage;
