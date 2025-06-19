import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, MenuItem } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const mockReports = [
  { id: 1, type: 'Tiêm chủng', date: '2024-01-10', total: 1200, completed: 1020 },
  { id: 2, type: 'Khám sức khỏe', date: '2024-01-05', total: 1200, completed: 1100 },
  { id: 3, type: 'Sự kiện y tế', date: '2024-01-12', total: 15, completed: 15 },
];

const ReportAdmin = () => {
  const [reports, setReports] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    setReports(mockReports);
  }, []);

  const filteredReports = reports.filter(r =>
    (filterType === 'all' || r.type === filterType) &&
    (!filterDate || r.date === filterDate)
  );

  // Chuẩn bị dữ liệu cho Pie chart
  const pieData = {
    labels: filteredReports.map(r => r.type),
    datasets: [
      {
        data: filteredReports.map(r => Math.round((r.completed / r.total) * 100)),
        backgroundColor: ['#4caf50', '#2196f3', '#ff9800']
      }
    ]
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Báo cáo hệ thống</Typography>
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={3}>
          <TextField
            select
            label="Loại báo cáo"
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            fullWidth
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="Tiêm chủng">Tiêm chủng</MenuItem>
            <MenuItem value="Khám sức khỏe">Khám sức khỏe</MenuItem>
            <MenuItem value="Sự kiện y tế">Sự kiện y tế</MenuItem>
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
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => window.print()}>
            Xuất báo cáo
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Loại báo cáo</TableCell>
                  <TableCell>Ngày</TableCell>
                  <TableCell>Tổng số</TableCell>
                  <TableCell>Hoàn thành</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReports.map(r => (
                  <TableRow key={r.id}>
                    <TableCell>{r.type}</TableCell>
                    <TableCell>{r.date}</TableCell>
                    <TableCell>{r.total}</TableCell>
                    <TableCell>{r.completed}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Tỉ lệ hoàn thành (%)</Typography>
              <Pie data={pieData} options={{ plugins: { legend: { display: true } } }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportAdmin; 