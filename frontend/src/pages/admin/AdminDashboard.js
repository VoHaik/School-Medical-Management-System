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
  Alert
} from '@mui/material';
import {
  People,
  School,
  LocalHospital,
  Assessment,
  TrendingUp,
  Warning,
  CheckCircle,
  Refresh,
  Block,
  CheckCircleOutline
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
import { getAdminDashboardStats, getAllUsers, deactivateUser, activateUser } from '../../utils/api';
import PageHeader from '../../components/PageHeader';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleUserStatusToggle = async (userId, currentStatus) => {
    try {
      if (currentStatus === 'active') {
        await deactivateUser(userId);
      } else {
        await activateUser(userId);
      }
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, status: currentStatus === 'active' ? 'inactive' : 'active' }
          : user
      ));
    } catch (err) {
      console.error('Error updating user status:', err);
      setError('Failed to update user status. This feature requires backend implementation.');
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

  const userStatusData = [
    { name: 'Active Users', value: stats?.activeUsers || 0, color: '#4caf50' },
    { name: 'Inactive Users', value: Math.max((stats?.totalUsers || 0) - (stats?.activeUsers || 0), 0), color: '#ff9800' }
  ];

  // Get monthly data from backend or show empty state
  const monthlyData = stats?.monthlyActivity || [];

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
                    {stats?.totalUsers || 0}
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
        {/* Activity Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Activity
              </Typography>
              {monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="checkups" fill="#4caf50" name="Health Checkups" />
                    <Bar dataKey="vaccinations" fill="#2196f3" name="Vaccinations" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                  <Typography color="text.secondary">No monthly activity data available</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* User Status Pie Chart */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                User Status
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

        {/* Recent Users */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  User Management
                </Typography>
                <Button 
                  startIcon={<Refresh />} 
                  onClick={loadDashboardData}
                  size="small"
                >
                  Refresh
                </Button>
              </Box>
              
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Details</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.slice(0, 10).map((user) => (
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
                            label={user.status || 'active'} 
                            color={(user.status || 'active') === 'active' ? 'success' : 'error'}
                            size="small"
                            icon={(user.status || 'active') === 'active' ? <CheckCircle /> : <Warning />}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {user.role === 'STUDENT' ? `Grade: ${user.grade || 'N/A'}` : 
                             user.role === 'NURSE' ? `Spec: ${user.specialization || 'General'}` : 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleUserStatusToggle(user.id, user.status || 'active')}
                            color={(user.status || 'active') === 'active' ? 'error' : 'success'}
                            title={(user.status || 'active') === 'active' ? 'Deactivate User' : 'Activate User'}
                          >
                            {(user.status || 'active') === 'active' ? <Block /> : <CheckCircleOutline />}
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {users.length > 10 && (
                <Box mt={2} textAlign="center">
                  <Typography variant="body2" color="text.secondary">
                    Showing 10 of {users.length} users
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default AdminDashboard;
