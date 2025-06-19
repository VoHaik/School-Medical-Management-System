import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, MenuItem, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { getAllMedicalEvents, createMedicalEvent, updateMedicalEvent, deleteMedicalEvent } from '../../utils/api';

const statusColor = {
  'Đã xử lý': 'success',
  'Đang theo dõi': 'warning',
  'Chưa xử lý': 'error',
};

const MedicalEventsAdmin = () => {
  const [events, setEvents] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const theme = useTheme();

  useEffect(() => {
    const fetchEvents = async () => {
      const data = await getAllMedicalEvents();
      setEvents(data || []);
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(e =>
    (filterType === 'all' || e.type === filterType) &&
    (filterStatus === 'all' || e.status === filterStatus) &&
    (!filterDate || e.date === filterDate)
  );

  // TODO: Thêm/sửa/xóa sự kiện sẽ gọi API tương ứng, sau đó fetch lại danh sách

  return (
    <Box p={3} sx={{ bgcolor: theme.palette.background.default, color: theme.palette.text.primary, minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom>Quản lý Sự kiện y tế</Typography>
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={3}>
          <TextField
            select
            label="Loại sự kiện"
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            fullWidth
            sx={{ bgcolor: theme.palette.background.paper, color: theme.palette.text.primary, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="Tai nạn">Tai nạn</MenuItem>
            <MenuItem value="Sốt">Sốt</MenuItem>
            <MenuItem value="Dịch bệnh">Dịch bệnh</MenuItem>
            <MenuItem value="Khác">Khác</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            select
            label="Trạng thái"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            fullWidth
            sx={{ bgcolor: theme.palette.background.paper, color: theme.palette.text.primary, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="Đã xử lý">Đã xử lý</MenuItem>
            <MenuItem value="Đang theo dõi">Đang theo dõi</MenuItem>
            <MenuItem value="Chưa xử lý">Chưa xử lý</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            label="Ngày"
            type="date"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{ bgcolor: theme.palette.background.paper, color: theme.palette.text.primary, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}
          />
        </Grid>
        <Grid item xs={12} md={3} display="flex" alignItems="center">
          <Button variant="contained" color="primary" sx={{ mt: { xs: 2, md: 0 }, borderRadius: 2 }}>
            Thêm sự kiện mới
          </Button>
        </Grid>
      </Grid>
      <TableContainer component={Paper} sx={{ bgcolor: theme.palette.card.main, borderRadius: 2, boxShadow: theme.shadows[1], border: `1px solid ${theme.palette.divider}` }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: theme.palette.background.paper }}>
              <TableCell sx={{ color: theme.palette.text.primary }}>Ngày</TableCell>
              <TableCell sx={{ color: theme.palette.text.primary }}>Loại sự kiện</TableCell>
              <TableCell sx={{ color: theme.palette.text.primary }}>Học sinh/Lớp</TableCell>
              <TableCell sx={{ color: theme.palette.text.primary }}>Mô tả</TableCell>
              <TableCell sx={{ color: theme.palette.text.primary }}>Trạng thái</TableCell>
              <TableCell sx={{ color: theme.palette.text.primary }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEvents.map(e => (
              <TableRow key={e.id} sx={{ '&:hover': { bgcolor: theme.palette.action.hover } }}>
                <TableCell sx={{ color: theme.palette.text.primary }}>{e.date}</TableCell>
                <TableCell sx={{ color: theme.palette.text.primary }}>{e.type}</TableCell>
                <TableCell sx={{ color: theme.palette.text.primary }}>{e.student}</TableCell>
                <TableCell sx={{ color: theme.palette.text.primary }}>{e.description}</TableCell>
                <TableCell>
                  <Chip label={e.status} color={statusColor[e.status]} size="small" />
                </TableCell>
                <TableCell>
                  <Button variant="outlined" size="small" sx={{ color: theme.palette.text.primary, borderRadius: 2 }}>
                    Xem chi tiết
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MedicalEventsAdmin; 