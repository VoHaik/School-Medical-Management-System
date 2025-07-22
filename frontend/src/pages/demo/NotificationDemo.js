import React from 'react';
import { 
  Box, 
  Button, 
  Grid, 
  Typography, 
  Paper,
  Stack,
  Divider
} from '@mui/material';
import { useAlert } from '../../hooks/useAlert';
import { VaccinationSuccessDialog } from '../../components/notifications';

const NotificationDemo = () => {
  const { 
    successAlert, 
    errorAlert, 
    warningAlert, 
    infoAlert, 
    deleteConfirm, 
    cancelConfirm, 
    submitConfirm 
  } = useAlert();
  
  const [vaccinationDialogOpen, setVaccinationDialogOpen] = React.useState(false);

  const handleDeleteTest = async () => {
    const confirmed = await deleteConfirm('tài liệu này');
    if (confirmed) {
      successAlert('Đã xóa thành công!');
    } else {
      infoAlert('Đã hủy thao tác xóa');
    }
  };

  const handleCancelTest = async () => {
    const confirmed = await cancelConfirm('form này');
    if (confirmed) {
      warningAlert('Đã hủy form, dữ liệu không được lưu');
    } else {
      infoAlert('Tiếp tục làm việc');
    }
  };

  const handleSubmitTest = async () => {
    const confirmed = await submitConfirm('dữ liệu này');
    if (confirmed) {
      successAlert('Đã gửi dữ liệu thành công!');
    } else {
      infoAlert('Đã hủy gửi dữ liệu');
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Notification System Demo
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mb: 4 }}>
        Test các loại thông báo mới trong hệ thống
      </Typography>

      <Grid container spacing={3}>
        {/* Basic Notifications */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Thông báo cơ bản
            </Typography>
            <Stack spacing={2}>
              <Button 
                variant="contained" 
                color="success" 
                onClick={() => successAlert('Thao tác thành công!')}
                fullWidth
              >
                Success Alert
              </Button>
              <Button 
                variant="contained" 
                color="error" 
                onClick={() => errorAlert('Có lỗi xảy ra!')}
                fullWidth
              >
                Error Alert
              </Button>
              <Button 
                variant="contained" 
                color="warning" 
                onClick={() => warningAlert('Cảnh báo: Kiểm tra lại dữ liệu!')}
                fullWidth
              >
                Warning Alert
              </Button>
              <Button 
                variant="contained" 
                color="info" 
                onClick={() => infoAlert('Thông tin: Hệ thống sẽ bảo trì lúc 2h sáng')}
                fullWidth
              >
                Info Alert
              </Button>
            </Stack>
          </Paper>
        </Grid>

        {/* Confirmation Dialogs */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Dialog xác nhận
            </Typography>
            <Stack spacing={2}>
              <Button 
                variant="outlined" 
                color="error" 
                onClick={handleDeleteTest}
                fullWidth
              >
                Test Delete Confirm
              </Button>
              <Button 
                variant="outlined" 
                color="warning" 
                onClick={handleCancelTest}
                fullWidth
              >
                Test Cancel Confirm
              </Button>
              <Button 
                variant="outlined" 
                color="primary" 
                onClick={handleSubmitTest}
                fullWidth
              >
                Test Submit Confirm
              </Button>
            </Stack>
          </Paper>
        </Grid>

        {/* Special Dialogs */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Dialog đặc biệt
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => setVaccinationDialogOpen(true)}
                size="large"
              >
                Test Vaccination Success Dialog
              </Button>
            </Stack>
          </Paper>
        </Grid>

        {/* Multiple Notifications Test */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Test nhiều thông báo cùng lúc
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
              <Button 
                variant="contained" 
                onClick={() => {
                  successAlert('Thông báo 1');
                  setTimeout(() => infoAlert('Thông báo 2'), 500);
                  setTimeout(() => warningAlert('Thông báo 3'), 1000);
                  setTimeout(() => errorAlert('Thông báo 4'), 1500);
                }}
              >
                Hiện 4 thông báo
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => {
                  for (let i = 1; i <= 6; i++) {
                    setTimeout(() => {
                      successAlert(`Thông báo số ${i}`);
                    }, i * 300);
                  }
                }}
              >
                Hiện 6 thông báo theo thứ tự
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Vaccination Success Dialog */}
      <VaccinationSuccessDialog
        open={vaccinationDialogOpen}
        onClose={() => setVaccinationDialogOpen(false)}
        title="Thành công!"
        message="Yêu cầu đồng ý tiêm chủng đã được gửi thành công cho 'Vaccine Injection'"
        confirmText="Đồng ý"
      />
    </Box>
  );
};

export default NotificationDemo;
