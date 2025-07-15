import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
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
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Badge
} from '@mui/material';
import { 
  CheckCircle as ApproveIcon,
  Cancel as DeclineIcon,
  Visibility as ViewIcon,
  PersonAdd as PersonAddIcon
} from '@mui/icons-material';
import api from '../../services/api';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

function ParentRegistrationManagement() {
  const [currentTab, setCurrentTab] = useState(0);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Dialog states
  const [viewDialog, setViewDialog] = useState(false);
  const [declineDialog, setDeclineDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [declineReason, setDeclineReason] = useState('');
  const [processing, setProcessing] = useState(false);
  
  // Stats
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    declined: 0
  });

  const tabLabels = ['All', 'Pending', 'Approved', 'Declined'];
  const statusFilters = ['', 'PENDING', 'APPROVED', 'DECLINED'];

  useEffect(() => {
    fetchRequests();
    fetchStats();
  }, [currentTab]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const statusFilter = statusFilters[currentTab];
      const endpoint = statusFilter 
        ? `/parent-registration/status/${statusFilter}`
        : '/parent-registration/all';
      
      const response = await api.get(endpoint);
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setError('Unable to load registration requests list');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const [pendingRes, allRes] = await Promise.all([
        api.get('/parent-registration/pending-count'),
        api.get('/parent-registration/all')
      ]);
      
      const allRequests = allRes.data;
      setStats({
        pending: pendingRes.data.pendingCount,
        approved: allRequests.filter(r => r.status === 'APPROVED').length,
        declined: allRequests.filter(r => r.status === 'DECLINED').length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleApprove = async (requestId) => {
    setProcessing(true);
    try {
      const response = await api.post(`/parent-registration/${requestId}/approve`);
      
      if (response.data.success) {
        setSuccess('Request has been approved and account has been created');
        fetchRequests();
        fetchStats();
      }
    } catch (error) {
      console.error('Error approving request:', error);
      setError(error.response?.data?.message || 'Unable to approve request');
    } finally {
      setProcessing(false);
    }
  };

  const handleDeclineSubmit = async () => {
    if (!declineReason.trim()) {
      setError('Please enter a reason for decline');
      return;
    }

    setProcessing(true);
    try {
      const response = await api.post(`/parent-registration/${selectedRequest.requestId}/decline`, {
        reason: declineReason
      });
      
      if (response.data.success) {
        setSuccess('Request has been declined');
        setDeclineDialog(false);
        setDeclineReason('');
        setSelectedRequest(null);
        fetchRequests();
        fetchStats();
      }
    } catch (error) {
      console.error('Error declining request:', error);
      setError(error.response?.data?.message || 'Unable to decline request');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      PENDING: { label: 'Pending', color: 'warning' },
      APPROVED: { label: 'Approved', color: 'success' },
      DECLINED: { label: 'Declined', color: 'error' }
    };
    
    const config = statusConfig[status] || { label: status, color: 'default' };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Parent Registration Management
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Pending
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {stats.pending}
                  </Typography>
                </Box>
                <Badge badgeContent={stats.pending} color="warning">
                  <PersonAddIcon color="warning" fontSize="large" />
                </Badge>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Approved
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {stats.approved}
                  </Typography>
                </Box>
                <ApproveIcon color="success" fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Declined
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {stats.declined}
                  </Typography>
                </Box>
                <DeclineIcon color="error" fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alerts */}
      {error && (
        <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" onClose={() => setSuccess('')} sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Paper elevation={3}>
        {/* Tabs */}
        <Tabs 
          value={currentTab} 
          onChange={(e, newValue) => setCurrentTab(newValue)}
          variant="fullWidth"
        >
          {tabLabels.map((label, index) => (
            <Tab 
              key={index} 
              label={
                <Badge 
                  badgeContent={index === 1 ? stats.pending : 0} 
                  color="warning"
                  invisible={index !== 1 || stats.pending === 0}
                >
                  {label}
                </Badge>
              } 
            />
          ))}
        </Tabs>

        {/* Table */}
        <TableContainer>
          {loading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Parent Code</TableCell>
                  <TableCell>Full Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Student</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography color="textSecondary">
                        No requests found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.map((request) => (
                    <TableRow key={request.requestId}>
                      <TableCell>{request.parentCode}</TableCell>
                      <TableCell>{request.fullName}</TableCell>
                      <TableCell>{request.email}</TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">{request.studentName}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {request.studentCode}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{getStatusChip(request.status)}</TableCell>
                      <TableCell>{formatDate(request.createdAt)}</TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <Button
                            size="small"
                            startIcon={<ViewIcon />}
                            onClick={() => {
                              setSelectedRequest(request);
                              setViewDialog(true);
                            }}
                          >
                            View
                          </Button>
                          
                          {request.status === 'PENDING' && (
                            <>
                              <Button
                                size="small"
                                color="success"
                                startIcon={<ApproveIcon />}
                                onClick={() => handleApprove(request.requestId)}
                                disabled={processing}
                              >
                                Approve
                              </Button>
                              
                              <Button
                                size="small"
                                color="error"
                                startIcon={<DeclineIcon />}
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setDeclineDialog(true);
                                }}
                                disabled={processing}
                              >
                                Decline
                              </Button>
                            </>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Paper>

      {/* View Dialog */}
      <Dialog 
        open={viewDialog} 
        onClose={() => setViewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Registration Request Details</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Parent Code"
                  value={selectedRequest.parentCode}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Username"
                  value={selectedRequest.username}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={selectedRequest.fullName}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={selectedRequest.email}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={selectedRequest.phoneNumber}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Relationship"
                  value={selectedRequest.relationship}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Student Code"
                  value={selectedRequest.studentCode}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Student Name"
                  value={selectedRequest.studentName}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Status"
                  value={selectedRequest.status}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Created Date"
                  value={formatDate(selectedRequest.createdAt)}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              {selectedRequest.reviewedAt && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Reviewed Date"
                      value={formatDate(selectedRequest.reviewedAt)}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Reviewed By"
                      value={selectedRequest.reviewedByName || 'N/A'}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                </>
              )}
              {selectedRequest.declineReason && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Decline Reason"
                    value={selectedRequest.declineReason}
                    InputProps={{ readOnly: true }}
                    multiline
                    rows={3}
                  />
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Decline Dialog */}
      <Dialog 
        open={declineDialog} 
        onClose={() => setDeclineDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Decline Request</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Please enter the reason for declining this registration request:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Decline reason"
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
            placeholder="Enter reason..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeclineDialog(false)} disabled={processing}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeclineSubmit} 
            color="error" 
            variant="contained"
            disabled={processing}
          >
            {processing ? 'Processing...' : 'Decline'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ParentRegistrationManagement;
