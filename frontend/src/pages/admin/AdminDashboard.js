import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Button,
  Alert,
  TablePagination
} from '@mui/material';
import {
  People,
  School,
  LocalHospital,
  Assessment,
  TrendingUp,
  Warning,
  CheckCircle,
  Refresh
} from '@mui/icons-material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { getAdminDashboardStats, getAllUsers } from '../../utils/api';
import PageHeader from '../../components/PageHeader';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [dashboardStats, allUsers] = await Promise.all([
        getAdminDashboardStats(),
        getAllUsers()
      ]);
      
      setStats(dashboardStats);
      setUsers(allUsers || []);
    } catch (err) {
      console.error('Error loading admin dashboard:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <PageHeader 
          title="Admin Dashboard" 
          subtitle="System overview and user management"
          icon={<Assessment />}
        />
        <Box display="flex" justifyContent="center" mt={4}>
          <LinearProgress sx={{ width: '50%' }} />
        </Box>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <PageHeader 
          title="Admin Dashboard" 
          subtitle="System overview and user management"
          icon={<Assessment />}
        />
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
          <Button 
            onClick={loadDashboardData} 
            startIcon={<Refresh />}
            sx={{ ml: 2 }}
          >
            Retry
          </Button>
        </Alert>
      </div>
    );
  }

  // Calculate real user statistics from actual data
  const activeUsers = users.filter(u => u.status !== 'INACTIVE').length; // Only show as inactive if explicitly set
  const inactiveUsers = users.filter(u => u.status === 'INACTIVE').length;
  
  const userStatusData = [
    { name: 'Active Users', value: activeUsers, color: '#4caf50' },
    { name: 'Inactive Users', value: inactiveUsers, color: '#ff9800' }
  ];

  // Calculate role distribution
  const roleData = [
    { name: 'Students', value: users.filter(u => u.role === 'STUDENT').length, color: '#2196f3' },
    { name: 'Nurses', value: users.filter(u => u.role === 'NURSE').length, color: '#9c27b0' },
    { name: 'Admins', value: users.filter(u => u.role === 'ADMIN').length, color: '#ff5722' },
    { name: 'Others', value: users.filter(u => !['STUDENT', 'NURSE', 'ADMIN'].includes(u.role)).length, color: '#607d8b' }
  ].filter(item => item.value > 0); // Only show roles that have users

  return (
    <div className="p-6">
      <PageHeader 
        title="Admin Dashboard" 
        subtitle="System overview and user management"
        icon={<Assessment />}
      />

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: '#2196f3', mr: 2 }}>
                  <People />
                </Avatar>
                <Box>
                  <Typography variant="h6" component="div">
                    {users.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Users
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: '#4caf50', mr: 2 }}>
                  <School />
                </Avatar>
                <Box>
                  <Typography variant="h6" component="div">
                    {stats?.totalStudents || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Students
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: '#ff9800', mr: 2 }}>
                  <LocalHospital />
                </Avatar>
                <Box>
                  <Typography variant="h6" component="div">
                    {stats?.totalHealthCheckups || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Health Checkups
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: '#9c27b0', mr: 2 }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="h6" component="div">
                    {stats?.totalVaccinations || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Vaccinations
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* User Status Pie Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                User Status Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={userStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {userStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Role Distribution Pie Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Role Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={roleData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {roleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* User Management Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  User Management (View Only)
                </Typography>
                <Box>
                  <Typography variant="body2" color="textSecondary" sx={{ mr: 2, display: 'inline' }}>
                    Total Users: {users.length}
                  </Typography>
                  <Button 
                    startIcon={<Refresh />} 
                    onClick={loadDashboardData}
                    size="small"
                  >
                    Refresh
                  </Button>
                </Box>
              </Box>
              
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Details</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar sx={{ mr: 2, bgcolor: user.role === 'STUDENT' ? '#4caf50' : '#2196f3' }}>
                              {user.role === 'STUDENT' ? <School /> : <LocalHospital />}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2">
                                {user.fullName || 'N/A'}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {user.username}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={user.role} 
                            color={user.role === 'STUDENT' ? 'primary' : 'secondary'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={user.status === 'INACTIVE' ? 'Inactive' : 'Active'} 
                            color={user.status === 'INACTIVE' ? 'error' : 'success'}
                            size="small"
                            icon={user.status === 'INACTIVE' ? <Warning /> : <CheckCircle />}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            Role: {user.role || 'N/A'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={users.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                  setRowsPerPage(parseInt(event.target.value, 10));
                  setPage(0);
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default AdminDashboard;
