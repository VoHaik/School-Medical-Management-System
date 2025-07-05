import React, { useState, useEffect, useContext } from 'react';
import {
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  Alert
} from '@mui/material';
import { format } from 'date-fns';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';
import authHeader from '../../services/auth-header';
import { AuthContext } from '../../context/AuthContext';

const HealthDeclarationApproval = () => {
  const { currentUser } = useContext(AuthContext); // Lấy thông tin người dùng hiện tại
  const [declarations, setDeclarations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const [selectedDeclaration, setSelectedDeclaration] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [reviewStatus, setReviewStatus] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(null);
    useEffect(() => {
    // Log thông tin người dùng và quyền hạn để debug
    console.log('Current user:', currentUser);
    console.log('User roles:', currentUser?.roles);
    console.log('Has ROLE_NURSE:', currentUser?.roles?.includes('ROLE_NURSE'));
    console.log('Has ROLE_SCHOOLNURSE:', currentUser?.roles?.includes('ROLE_SCHOOLNURSE'));
    
    // Check if user has the required role before fetching declarations
    if (currentUser && 
        (currentUser.roles?.includes('ROLE_SCHOOLNURSE') || 
         currentUser.roles?.includes('ROLE_NURSE') || 
         currentUser.roles?.includes('ROLE_ADMIN'))) {
      fetchPendingDeclarations();
    } else if (currentUser) {
      setError('You do not have the required permissions to view this page. Required roles: ROLE_SCHOOLNURSE, ROLE_NURSE, or ROLE_ADMIN');
      setLoading(false);
    }
  }, [currentUser]);
    const fetchPendingDeclarations = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get auth headers and check if token exists
      const headers = authHeader();
      console.log('Auth headers:', headers);
      
      if (!headers.Authorization) {
        console.error('No authorization token found');
        setError('Authentication token is missing. Please try logging out and logging in again.');
        setLoading(false);
        return;
      }
      
      console.log('Request URL:', '/api/health-declaration/pending');
      
      // Try to refresh the token first if needed
      try {
        await axios.get('/api/auth/me', { headers });
        console.log('Token validation successful');
      } catch (validationErr) {
        if (validationErr.response?.status === 401) {
          console.error('Token validation failed, user needs to login again');
          setError('Your session has expired. Please log in again.');
          setLoading(false);
          return;
        }
      }
      
      // Now proceed with the main request
      const response = await axios.get(
        `/api/health-declaration/pending`,
        { headers }
      );
      
      // Enhanced logging for the response
      console.log('API response status:', response.status);
      console.log('API response data type:', typeof response.data);
      console.log('API response data:', JSON.stringify(response.data, null, 2));
      
      if (Array.isArray(response.data)) {
        console.log('Response is an array with length:', response.data.length);
      } else {
        console.log('Response is not an array, actual type:', Object.prototype.toString.call(response.data));
      }
      
      setDeclarations(response.data);
      
      // Thêm thông báo kiểm tra số lượng dữ liệu
      if (response.data && response.data.length === 0) {
        setError('Không tìm thấy khai báo sức khỏe nào đang chờ duyệt. Có thể tất cả đã được xử lý hoặc chưa có khai báo nào được gửi.');
      }
    } catch (err) {
      console.error('Error fetching pending health declarations:', err);
      console.error('Error details:', err.response?.data || err.message);
      console.error('Error status:', err.response?.status);
      console.error('Error headers:', err.response?.headers);
      
      if (err.response?.status === 401) {
        setError('Phiên đăng nhập của bạn đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.');
        
        // Optional: Redirect to login page after a delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      } else if (err.response?.status === 403) {
        setError('Bạn không có quyền xem danh sách khai báo sức khỏe đang chờ duyệt.');
      } else {
        setError('Không thể tải danh sách khai báo sức khỏe. Lỗi: ' + (err.response?.data?.message || err.message));
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
    const handleViewDeclaration = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/health-declaration/${id}`,
        { headers: authHeader() }
      );
      setSelectedDeclaration(response.data);
      setOpenDialog(true);
    } catch (err) {
      console.error('Error fetching declaration details:', err);
      setError('Could not load declaration details. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleOpenReviewDialog = (declaration, status) => {
    setSelectedDeclaration(declaration);
    setReviewStatus(status);
    setReviewNotes('');
    setReviewError(null);
    setReviewSuccess(null);
    setOpenReviewDialog(true);
  };
  
  const handleCloseReviewDialog = () => {
    setOpenReviewDialog(false);
  };
  
  const handleSubmitReview = async () => {
    if (!selectedDeclaration || !reviewStatus) return;
    
    setReviewLoading(true);
    setReviewError(null);
    setReviewSuccess(null);
      try {
      await axios.put(
        `/api/health-declaration/${selectedDeclaration.declarationId}/review`,
        { status: reviewStatus, reviewNotes },
        { headers: authHeader() }
      );
      
      // Hiển thị thông báo thành công
      setReviewSuccess(`Health declaration has been ${reviewStatus.toLowerCase()} successfully!`);
      
      // Đóng dialog sau 1 giây
      setTimeout(() => {
        setOpenReviewDialog(false);
        // Tải lại danh sách khai báo
        fetchPendingDeclarations();
      }, 1000);
      
    } catch (err) {
      console.error('Error reviewing health declaration:', err);
      setReviewError('Could not submit review. Please try again.');
    } finally {
      setReviewLoading(false);
    }
  };
  
  const getStatusChip = (status) => {
    switch(status) {
      case 'PENDING':
        return <Chip label="Pending" color="warning" size="small" />;
      case 'APPROVED':
        return <Chip label="Approved" color="success" size="small" />;
      case 'REJECTED':
        return <Chip label="Rejected" color="error" size="small" />;
      case 'DRAFT':
        return <Chip label="Draft" color="default" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Health Declarations Requiring Review
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : declarations.length === 0 ? (
        <Alert severity="info">No pending health declarations found.</Alert>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student Code</TableCell>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Declaration Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {declarations
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((declaration) => (
                    <TableRow key={declaration.declarationId}>
                      <TableCell>{declaration.studentCode}</TableCell>
                      <TableCell>{declaration.studentName || 'N/A'}</TableCell>
                      <TableCell>
                        {declaration.declarationDate ? 
                          format(new Date(declaration.declarationDate), 'dd/MM/yyyy') : 
                          'N/A'}
                      </TableCell>
                      <TableCell>{getStatusChip(declaration.status)}</TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                          <Button 
                            variant="outlined" 
                            size="small" 
                            startIcon={<VisibilityIcon />}
                            onClick={() => handleViewDeclaration(declaration.declarationId)}
                          >
                            View
                          </Button>
                          <Button 
                            variant="contained" 
                            color="success" 
                            size="small"
                            startIcon={<CheckCircleIcon />}
                            onClick={() => handleOpenReviewDialog(declaration, 'APPROVED')}
                          >
                            Approve
                          </Button>
                          <Button 
                            variant="contained" 
                            color="error" 
                            size="small"
                            startIcon={<CancelIcon />}
                            onClick={() => handleOpenReviewDialog(declaration, 'REJECTED')}
                          >
                            Reject
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={declarations.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
      
      {/* Dialog hiển thị chi tiết khai báo sức khỏe */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Health Declaration Details</DialogTitle>
        <DialogContent dividers>
          {selectedDeclaration && (
            <Box sx={{ p: 1 }}>
              <Typography variant="h6" gutterBottom>Student Information</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 2 }}>
                <Box sx={{ mr: 4, mb: 1 }}>
                  <Typography variant="caption" color="textSecondary">Student Code</Typography>
                  <Typography variant="body1">{selectedDeclaration.studentCode}</Typography>
                </Box>
                <Box sx={{ mr: 4, mb: 1 }}>
                  <Typography variant="caption" color="textSecondary">Declaration Date</Typography>
                  <Typography variant="body1">
                    {selectedDeclaration.declarationDate ? 
                      format(new Date(selectedDeclaration.declarationDate), 'dd/MM/yyyy') : 
                      'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ mr: 4, mb: 1 }}>
                  <Typography variant="caption" color="textSecondary">Status</Typography>
                  <Box>{getStatusChip(selectedDeclaration.status)}</Box>
                </Box>
              </Box>
              
              <Typography variant="h6" gutterBottom>Medical Information</Typography>
              
              {/* Allergies */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1">Allergies</Typography>
                {selectedDeclaration.allergies && selectedDeclaration.allergies.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selectedDeclaration.allergies.map((allergy, index) => (
                      <Chip key={index} label={allergy} size="small" />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="textSecondary">No allergies declared</Typography>
                )}
              </Box>
              
              {/* Medical Conditions */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1">Medical Conditions</Typography>
                {selectedDeclaration.medicalConditions && selectedDeclaration.medicalConditions.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selectedDeclaration.medicalConditions.map((condition, index) => (
                      <Chip key={index} label={condition} size="small" />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="textSecondary">No medical conditions declared</Typography>
                )}
              </Box>
              
              {/* Medications */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1">Medications</Typography>
                {selectedDeclaration.medications && selectedDeclaration.medications.length > 0 ? (
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Medication</TableCell>
                          <TableCell>Dosage</TableCell>
                          <TableCell>Frequency</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedDeclaration.medications.map((med, index) => (
                          <TableRow key={index}>
                            <TableCell>{med.medicationName || med.name}</TableCell>
                            <TableCell>{med.dosage}</TableCell>
                            <TableCell>{med.frequency}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography variant="body2" color="textSecondary">No medications declared</Typography>
                )}
              </Box>
              
              {/* Notes */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1">Notes</Typography>
                <Typography variant="body2">
                  {selectedDeclaration.notes || 'No notes provided'}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
          <Button 
            variant="contained" 
            color="success"
            onClick={() => {
              setOpenDialog(false);
              handleOpenReviewDialog(selectedDeclaration, 'APPROVED');
            }}
          >
            Approve
          </Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={() => {
              setOpenDialog(false);
              handleOpenReviewDialog(selectedDeclaration, 'REJECTED');
            }}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialog phê duyệt/từ chối khai báo */}
      <Dialog
        open={openReviewDialog}
        onClose={handleCloseReviewDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {reviewStatus === 'APPROVED' ? 'Approve' : 'Reject'} Health Declaration
        </DialogTitle>
        <DialogContent>
          {reviewError && (
            <Alert severity="error" sx={{ mb: 2 }}>{reviewError}</Alert>
          )}
          
          {reviewSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>{reviewSuccess}</Alert>
          )}
          
          <Typography variant="body2" sx={{ mb: 2 }}>
            You are about to {reviewStatus === 'APPROVED' ? 'approve' : 'reject'} the health declaration for student{' '}
            <strong>{selectedDeclaration?.studentCode}</strong>
          </Typography>
          
          <TextField
            label="Review Notes"
            multiline
            rows={4}
            fullWidth
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
            placeholder={reviewStatus === 'APPROVED' ? 
              'Add any notes about this approval (optional)' : 
              'Please provide a reason for rejection'}
            variant="outlined"
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReviewDialog} disabled={reviewLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color={reviewStatus === 'APPROVED' ? 'success' : 'error'}
            onClick={handleSubmitReview}
            disabled={reviewLoading || !!reviewSuccess}
            startIcon={reviewLoading ? <CircularProgress size={16} /> : null}
          >
            {reviewStatus === 'APPROVED' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HealthDeclarationApproval;
