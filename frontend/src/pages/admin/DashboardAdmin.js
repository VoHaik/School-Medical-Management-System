import React from 'react';
import { Grid, Card, CardContent, Typography, Box, Avatar, LinearProgress, Chip, Paper, Divider } from '@mui/material';
import { 
  Group, 
  Assessment, 
  LocalHospital, 
  PersonAdd,
  TrendingUp
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';

// Mock data for dashboard statistics
const dashboardStats = [
  {
    title: 'Tổng học sinh',
    value: '1,250',
    change: '+5.2%',
    changeType: 'positive',
    icon: <Group fontSize="large" />,
    color: '#1976d2'
  },
  {
    title: 'Chương trình đang chạy',
    value: '8',
    change: '+2',
    changeType: 'positive',
    icon: <LocalHospital fontSize="large" />,
    color: '#2e7d32'
  },
  {
    title: 'Báo cáo tháng này',
    value: '24',
    change: '+12%',
    changeType: 'positive',
    icon: <Assessment fontSize="large" />,
    color: '#ed6c02'
  },
  {
    title: 'Tỷ lệ hoàn thành',
    value: '89.5%',
    change: '+3.1%',
    changeType: 'positive',
    icon: <TrendingUp fontSize="large" />,
    color: '#9c27b0'
  }
];

const recentActivities = [
  { id: 1, type: 'vaccination', title: 'Tiêm chủng cúm mùa', date: '2024-01-20', status: 'completed', students: 450 },
  { id: 2, type: 'health_checkup', title: 'Khám sức khỏe định kỳ', date: '2024-01-18', status: 'active', students: 320 },
  { id: 3, type: 'medical_event', title: 'Tuần lễ sức khỏe tâm thần', date: '2024-01-15', status: 'planned', students: 280 },
];

const monthlyData = [
  { name: 'T1', vaccination: 85, health_checkup: 92, medical_event: 78 },
  { name: 'T2', vaccination: 88, health_checkup: 89, medical_event: 82 },
  { name: 'T3', vaccination: 92, health_checkup: 94, medical_event: 85 },
  { name: 'T4', vaccination: 89, health_checkup: 91, medical_event: 88 },
  { name: 'T5', vaccination: 94, health_checkup: 96, medical_event: 91 },
  { name: 'T6', vaccination: 91, health_checkup: 93, medical_event: 89 },
];

const programTypeData = [
  { name: 'Tiêm chủng', value: 40, color: '#8884d8' },
  { name: 'Khám sức khỏe', value: 35, color: '#82ca9d' },
  { name: 'Sự kiện y tế', value: 25, color: '#ffc658' }
];

const adminCards = [
  {
    title: 'Quản lý người dùng',
    description: 'Quản lý tài khoản, phân quyền, vai trò hệ thống',
    icon: <Group fontSize="large" />,
    color: '#1976d2',
    link: '/admin/user-management',
  },
  {
    title: 'Duyệt đăng ký phụ huynh',
    description: 'Duyệt và quản lý đăng ký tài khoản phụ huynh',
    icon: <PersonAdd fontSize="large" />,
    color: '#ff9800',
    link: '/admin/parent-registration-approval',
  },
  {
    title: 'Báo cáo & Thống kê',
    description: 'Xem báo cáo, thống kê toàn hệ thống',
    icon: <Assessment fontSize="large" />,
    color: '#fbc02d',
    link: '/admin/reports',
  },
  {
    title: 'Chương trình y tế',
    description: 'Quản lý tiêm chủng, kiểm tra sức khỏe định kỳ',
    icon: <LocalHospital fontSize="large" />,
    color: '#7b1fa2',
    link: '/admin/health-programs',
  },
];

const DashboardAdmin = () => {
  const theme = useTheme();  return (
    <Box p={2} sx={{ bgcolor: theme.palette.background.default, minHeight: '100vh' }}>
      <Typography variant="h3" fontWeight={700} sx={{ color: theme.palette.primary.main }} gutterBottom>
        Dashboard Quản trị
      </Typography>
      <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
        Truy cập nhanh các chức năng quản trị hệ thống y tế học đường
      </Typography>
      <Grid container spacing={2}>
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
                  minHeight: 180,
                  background: theme.palette.card.main,
                  color: theme.palette.text.primary,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <CardContent>
                  <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={1.5}>
                    <Avatar sx={{ bgcolor: card.color, width: 56, height: 56, boxShadow: theme.shadows[2] }}>
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