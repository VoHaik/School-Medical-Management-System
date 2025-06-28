import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Tabs,
  Tab
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  School as SchoolIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';

const PendingRegistrationManagement = ({ onRegistrationProcessed }) => {
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [allRegistrations, setAllRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [tabValue, setTabValue] = useState(0);

  const { getAuthAxios } = React.useContext(AuthContext);

  useEffect(() => {
    loadPendingRegistrations();
    loadAllRegistrations();
  }, []);

  const loadPendingRegistrations = async () => {
    try {
      setLoading(true);
      const authAxios = getAuthAxios();
      const response = await authAxios.get('/api/registration/pending');
      setPendingRegistrations(response.data);
      setError(null);
    } catch (err) {
      console.error('Error loading pending registrations:', err);
      setError('Failed to load pending registrations');
    } finally {
      setLoading(false);
    }
  };

  const loadAllRegistrations = async () => {
    try {
      const authAxios = getAuthAxios();
      const [approvedResponse, rejectedResponse] = await Promise.all([
        authAxios.get('/api/registration/status/approved'),
        authAxios.get('/api/registration/status/rejected')
      ]);
      
      const allRegs = [
        ...approvedResponse.data.map(reg => ({ ...reg, status: 'APPROVED' })),
        ...rejectedResponse.data.map(reg => ({ ...reg, status: 'REJECTED' }))
      ].sort((a, b) => new Date(b.processedAt || b.requestedAt) - new Date(a.processedAt || a.requestedAt));
      
      setAllRegistrations(allRegs);
    } catch (err) {
      console.error('Error loading all registrations:', err);
    }
  };

  const handleViewDetails = (registration) => {
    setSelectedRegistration(registration);
    setDetailDialogOpen(true);
  };

  const handleApprove = (registration) => {
    setSelectedRegistration(registration);
    setAdminNotes('');
    setApproveDialogOpen(true);
  };

  const handleReject = (registration) => {
    setSelectedRegistration(registration);
    setRejectionReason('');
    setAdminNotes('');
    setRejectDialogOpen(true);
  };

  const confirmApprove = async () => {
    if (!selectedRegistration) return;

    try {
      setProcessing(true);
      const authAxios = getAuthAxios();
      await authAxios.put(`/api/registration/${selectedRegistration.id}/approve`, {
        adminNotes: adminNotes
      });

      setSuccessMessage('Registration approved successfully!');
      setApproveDialogOpen(false);
      loadPendingRegistrations();
      loadAllRegistrations();
      
      // Notify parent component about the change
      if (onRegistrationProcessed) {
        onRegistrationProcessed();
      }
    } catch (err) {
      console.error('Error approving registration:', err);
      setError(err.response?.data?.message || 'Failed to approve registration');
    } finally {
      setProcessing(false);
    }
  };

  const confirmReject = async () => {
    if (!selectedRegistration || !rejectionReason.trim()) return;

    try {
      setProcessing(true);
      const authAxios = getAuthAxios();
      await authAxios.put(`/api/registration/${selectedRegistration.id}/reject`, {
        rejectionReason: rejectionReason,
        adminNotes: adminNotes
      });

      setSuccessMessage('Registration rejected successfully!');
      setRejectDialogOpen(false);
      loadPendingRegistrations();
      loadAllRegistrations();
      
      // Notify parent component about the change
      if (onRegistrationProcessed) {
        onRegistrationProcessed();
      }
    } catch (err) {
      console.error('Error rejecting registration:', err);
      setError(err.response?.data?.message || 'Failed to reject registration');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'error';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const renderRegistrationTable = (registrations, showActions = true) => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Parent Name</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Student</TableCell>
            <TableCell>Relationship</TableCell>
            <TableCell>Parent Code</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Requested Date</TableCell>
            {showActions && <TableCell>Actions</TableCell>}
            {!showActions && <TableCell>Processed Date</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {registrations.map((registration) => (
            <TableRow key={registration.id}>
              <TableCell>{registration.fullName}</TableCell>
              <TableCell>{registration.username}</TableCell>
              <TableCell>{registration.email}</TableCell>
              <TableCell>
                {registration.studentFullName}
                <br />
                <Typography variant="caption" color="textSecondary">
                  {registration.studentCode}
                </Typography>
              </TableCell>
              <TableCell>{registration.relationshipWithStudent}</TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                  {registration.parentCode}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip 
                  label={registration.status} 
                  color={getStatusColor(registration.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>{formatDate(registration.requestedAt)}</TableCell>
              {showActions ? (
                <TableCell>
                  <Tooltip title="View Details">
                    <IconButton 
                      size="small" 
                      onClick={() => handleViewDetails(registration)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Approve">
                    <IconButton 
                      size="small" 
                      color="success"
                      onClick={() => handleApprove(registration)}
                    >
                      <CheckIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Reject">
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleReject(registration)}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              ) : (
                <TableCell>{formatDate(registration.processedAt)}</TableCell>
              )}
            </TableRow>
          ))}
          {registrations.length === 0 && (
            <TableRow>
              <TableCell colSpan={showActions ? 8 : 8} align="center">
                <Typography color="textSecondary">
                  No registrations found
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Parent Registration Management
        </Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={() => {
            loadPendingRegistrations();
            loadAllRegistrations();
          }}
          variant="outlined"
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending Registrations
              </Typography>
              <Typography variant="h4" color="warning.main">
                {pendingRegistrations.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Approved Today
              </Typography>
              <Typography variant="h4" color="success.main">
                {allRegistrations.filter(reg => 
                  reg.status === 'APPROVED' && 
                  reg.processedAt && 
                  new Date(reg.processedAt).toDateString() === new Date().toDateString()
                ).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Processed
              </Typography>
              <Typography variant="h4">
                {allRegistrations.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label={`Pending (${pendingRegistrations.length})`} />
          <Tab label={`All Processed (${allRegistrations.length})`} />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {tabValue === 0 && renderRegistrationTable(pendingRegistrations, true)}
      {tabValue === 1 && renderRegistrationTable(allRegistrations, false)}

      {/* Detail Dialog */}
      <Dialog 
        open={detailDialogOpen} 
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Registration Details</DialogTitle>
        <DialogContent>
          {selectedRegistration && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Parent Information
                </Typography>
                <Typography><strong>Full Name:</strong> {selectedRegistration.fullName}</Typography>
                <Typography><strong>Username:</strong> {selectedRegistration.username}</Typography>
                <Typography><strong>Email:</strong> {selectedRegistration.email}</Typography>
                <Typography><strong>Phone:</strong> {selectedRegistration.phoneNumber || 'N/A'}</Typography>
                <Typography><strong>Gender:</strong> {selectedRegistration.gender || 'N/A'}</Typography>
                <Typography><strong>Emergency Contact:</strong> {selectedRegistration.emergencyContact || 'N/A'}</Typography>
                <Typography><strong>Address:</strong> {selectedRegistration.address || 'N/A'}</Typography>
                <Typography><strong>Relationship:</strong> {selectedRegistration.relationshipWithStudent}</Typography>
                <Typography><strong>Parent Code:</strong> 
                  <span style={{ fontFamily: 'monospace', fontWeight: 'bold', marginLeft: '8px' }}>
                    {selectedRegistration.parentCode}
                  </span>
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Student Information
                </Typography>
                <Typography><strong>Student Code:</strong> {selectedRegistration.studentCode}</Typography>
                <Typography><strong>Student Name:</strong> {selectedRegistration.studentFullName}</Typography>
                <Typography><strong>Date of Birth:</strong> {formatDate(selectedRegistration.studentDateOfBirth)}</Typography>
                <Typography><strong>Class:</strong> {selectedRegistration.studentClass || 'N/A'}</Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Request Information</Typography>
                <Typography><strong>Status:</strong> 
                  <Chip 
                    label={selectedRegistration.status} 
                    color={getStatusColor(selectedRegistration.status)}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Typography>
                <Typography><strong>Requested Date:</strong> {formatDate(selectedRegistration.requestedAt)}</Typography>
                {selectedRegistration.processedAt && (
                  <Typography><strong>Processed Date:</strong> {formatDate(selectedRegistration.processedAt)}</Typography>
                )}
                {selectedRegistration.processedByName && (
                  <Typography><strong>Processed By:</strong> {selectedRegistration.processedByName}</Typography>
                )}
                {selectedRegistration.adminNotes && (
                  <Typography><strong>Admin Notes:</strong> {selectedRegistration.adminNotes}</Typography>
                )}
                {selectedRegistration.rejectionReason && (
                  <Typography><strong>Rejection Reason:</strong> {selectedRegistration.rejectionReason}</Typography>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onClose={() => setApproveDialogOpen(false)}>
        <DialogTitle>Approve Registration</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Are you sure you want to approve the registration for <strong>{selectedRegistration?.fullName}</strong>?
          </Typography>
          <TextField
            fullWidth
            label="Admin Notes (Optional)"
            multiline
            rows={3}
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApproveDialogOpen(false)} disabled={processing}>
            Cancel
          </Button>
          <Button 
            onClick={confirmApprove} 
            variant="contained" 
            color="success"
            disabled={processing}
          >
            {processing ? <CircularProgress size={20} /> : 'Approve'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)}>
        <DialogTitle>Reject Registration</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Please provide a reason for rejecting the registration for <strong>{selectedRegistration?.fullName}</strong>:
          </Typography>
          <TextField
            fullWidth
            label="Rejection Reason *"
            multiline
            rows={3}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            sx={{ mt: 2, mb: 2 }}
            required
          />
          <TextField
            fullWidth
            label="Admin Notes (Optional)"
            multiline
            rows={2}
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)} disabled={processing}>
            Cancel
          </Button>
          <Button 
            onClick={confirmReject} 
            variant="contained" 
            color="error"
            disabled={processing || !rejectionReason.trim()}
          >
            {processing ? <CircularProgress size={20} /> : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PendingRegistrationManagement;
