import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
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
  Grid,
  TextField,
  Paper,
  Avatar,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Email,
  Phone,
  Person,
  PersonAdd,
  School
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

// Mock data cho pending parent registrations
const mockPendingRegistrations = [
  {
    id: 1,
    parentName: 'Nguyễn Văn A',
    studentName: 'Nguyễn Thị B',
    studentClass: '10A1',
    registrationDate: '2024-01-15',
    status: 'pending',
    contactInfo: {
      email: 'nguyenvana@gmail.com',
      phone: '0912345678'
    },
    reason: 'Đăng ký tài khoản theo dõi sức khỏe con em'
  },
  {
    id: 2,
    parentName: 'Trần Thị C',
    studentName: 'Trần Đại D',
    studentClass: '11B2',
    registrationDate: '2024-01-14',
    status: 'pending',
    contactInfo: {
      email: 'tranthic.parent@gmail.com',
      phone: '0987654321'
    },
    reason: 'Theo dõi tình hình sức khỏe và tiêm chủng'
  },
  {
    id: 3,
    parentName: 'Lê Minh E',
    studentName: 'Lê Thu F',
    studentClass: '9C3',
    registrationDate: '2024-01-13',
    status: 'pending',
    contactInfo: {
      email: 'leminhe@yahoo.com',
      phone: '0901234567'
    },
    reason: 'Quản lý hồ sơ y tế học sinh'
  }
];

const ParentRegistrationApproval = () => {
  const theme = useTheme();
  const [registrations, setRegistrations] = useState(mockPendingRegistrations);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleApprove = (id) => {
    setRegistrations(prev => prev.filter(reg => reg.id !== id));
    setSnackbar({
      open: true,
      message: 'Đã duyệt đăng ký thành công!',
      severity: 'success'
    });
    setDetailDialogOpen(false);
  };

  const handleReject = (id) => {
    setRegistrations(prev => prev.filter(reg => reg.id !== id));
    setSnackbar({
      open: true,
      message: 'Đã từ chối đăng ký!',
      severity: 'warning'
    });
    setDetailDialogOpen(false);
  };

  const handleViewDetail = (registration) => {
    setSelectedRegistration(registration);
    setDetailDialogOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ duyệt';
      case 'approved': return 'Đã duyệt';
      case 'rejected': return 'Đã từ chối';
      default: return status;
    }
  };

  return (
    <Box p={3} sx={{ bgcolor: theme.palette.background.default, minHeight: '100vh' }}>
      <Box display="flex" alignItems="center" mb={3}>
        <PersonAdd sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }} />
        <Box>
          <Typography variant="h4" fontWeight={700} sx={{ color: theme.palette.primary.main }}>
            Duyệt đăng ký phụ huynh
          </Typography>
          <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary }}>
            Quản lý và duyệt các yêu cầu đăng ký tài khoản phụ huynh
          </Typography>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: theme.palette.warning.main, mr: 2 }}>
                  <PersonAdd />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    {registrations.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Đơn chờ duyệt
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: theme.palette.success.main, mr: 2 }}>
                  <CheckCircle />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    45
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Đã duyệt tháng này
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: theme.palette.error.main, mr: 2 }}>
                  <Cancel />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    3
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Đã từ chối
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Table */}
      <Paper elevation={2}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: theme.palette.grey[100] }}>
                <TableCell><Typography fontWeight={700}>Tên phụ huynh</Typography></TableCell>
                <TableCell><Typography fontWeight={700}>Học sinh</Typography></TableCell>
                <TableCell><Typography fontWeight={700}>Lớp</Typography></TableCell>
                <TableCell><Typography fontWeight={700}>Thông tin liên hệ</Typography></TableCell>
                <TableCell><Typography fontWeight={700}>Ngày đăng ký</Typography></TableCell>
                <TableCell><Typography fontWeight={700}>Trạng thái</Typography></TableCell>
                <TableCell><Typography fontWeight={700}>Thao tác</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {registrations.map((registration) => (
                <TableRow key={registration.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2, width: 32, height: 32 }}>
                        <Person fontSize="small" />
                      </Avatar>
                      <Typography fontWeight={600}>
                        {registration.parentName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography>{registration.studentName}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      icon={<School />} 
                      label={registration.studentClass} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" flexDirection="column" gap={0.5}>
                      <Chip
                        icon={<Email />}
                        label={registration.contactInfo.email}
                        size="small"
                        variant="outlined"
                        color="info"
                      />
                      <Chip
                        icon={<Phone />}
                        label={registration.contactInfo.phone}
                        size="small"
                        variant="outlined"
                        color="secondary"
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography>{registration.registrationDate}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusText(registration.status)}
                      color={getStatusColor(registration.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleViewDetail(registration)}
                      >
                        Chi tiết
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircle />}
                        onClick={() => handleApprove(registration.id)}
                      >
                        Duyệt
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        startIcon={<Cancel />}
                        onClick={() => handleReject(registration.id)}
                      >
                        Từ chối
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Detail Dialog */}
      <Dialog 
        open={detailDialogOpen} 
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={700}>
            Chi tiết đăng ký phụ huynh
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedRegistration && (
            <Grid container spacing={3} mt={1}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tên phụ huynh"
                  value={selectedRegistration.parentName}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tên học sinh"
                  value={selectedRegistration.studentName}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Lớp"
                  value={selectedRegistration.studentClass}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Ngày đăng ký"
                  value={selectedRegistration.registrationDate}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={selectedRegistration.contactInfo.email}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  value={selectedRegistration.contactInfo.phone}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Lý do đăng ký"
                  value={selectedRegistration.reason}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>
            Đóng
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<Cancel />}
            onClick={() => handleReject(selectedRegistration?.id)}
          >
            Từ chối
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckCircle />}
            onClick={() => handleApprove(selectedRegistration?.id)}
          >
            Duyệt
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ParentRegistrationApproval;
