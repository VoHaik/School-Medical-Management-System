import React from 'react';
import { Grid, Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import Group from '@mui/icons-material/Group';
import Settings from '@mui/icons-material/Settings';
import Assessment from '@mui/icons-material/Assessment';
import EventNote from '@mui/icons-material/EventNote';
import LocalHospital from '@mui/icons-material/LocalHospital';
import CloudDownload from '@mui/icons-material/CloudDownload';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const adminCards = [
  {
    title: 'Quản lý người dùng',
    description: 'Quản lý tài khoản, phân quyền, vai trò hệ thống',
    icon: <Group fontSize="large" />, // MUI icon
    color: '#1976d2',
    link: '/admin/user-management',
  },
  {
    title: 'Cấu hình hệ thống',
    description: 'Thiết lập các thông số, bảo mật, thông báo',
    icon: <Settings fontSize="large" />, // MUI icon
    color: '#388e3c',
    link: '/admin/system-configuration',
  },
  {
    title: 'Báo cáo & Thống kê',
    description: 'Xem báo cáo, thống kê toàn hệ thống',
    icon: <Assessment fontSize="large" />, // MUI icon
    color: '#fbc02d',
    link: '/admin/reports',
  },
  {
    title: 'Sự kiện y tế',
    description: 'Theo dõi, quản lý các sự kiện y tế trong trường',
    icon: <EventNote fontSize="large" />, // MUI icon
    color: '#d32f2f',
    link: '/admin/medical-events',
  },
  {
    title: 'Chương trình y tế',
    description: 'Quản lý tiêm chủng, kiểm tra sức khỏe định kỳ',
    icon: <LocalHospital fontSize="large" />, // MUI icon
    color: '#7b1fa2',
    link: '/admin/health-programs',
  },
  {
    title: 'Xuất dữ liệu',
    description: 'Xuất báo cáo, dữ liệu hệ thống',
    icon: <CloudDownload fontSize="large" />, // MUI icon
    color: '#0288d1',
    link: '/admin/data-export',
  },
];

const DashboardAdmin = () => {
  const theme = useTheme();
  return (
    <Box p={3} sx={{ bgcolor: theme.palette.background.default, minHeight: '100vh' }}>
      <Typography variant="h3" fontWeight={700} sx={{ color: theme.palette.primary.main }} gutterBottom>
        Dashboard Quản trị
      </Typography>
      <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary, mb: 4 }}>
        Truy cập nhanh các chức năng quản trị hệ thống y tế học đường
      </Typography>
      <Grid container spacing={4}>
        {adminCards.map((card, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Link to={card.link} style={{ textDecoration: 'none' }}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: theme.shadows[1],
                  transition: theme.transitions.create(['transform', 'box-shadow', 'background']),
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.03)',
                    boxShadow: `0 8px 32px 0 ${card.color}33`,
                    bgcolor: theme.palette.action.hover,
                  },
                  minHeight: 200,
                  background: theme.palette.card.main,
                  color: theme.palette.text.primary,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <CardContent>
                  <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={2}>
                    <Avatar sx={{ bgcolor: card.color, width: 64, height: 64, boxShadow: theme.shadows[2] }}>
                      {card.icon}
                    </Avatar>
                    <Typography variant="h6" fontWeight={700} sx={{ color: card.color }} align="center">
                      {card.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }} align="center">
                      {card.description}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardAdmin; 