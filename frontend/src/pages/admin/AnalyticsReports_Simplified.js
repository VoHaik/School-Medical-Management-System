import React, { useState, useEffect } from 'react';
import { 
  Grid, Card, CardContent, Typography, Box, Button, FormControl, InputLabel, 
  Select, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Chip, Avatar, Tabs, Tab, Alert, CircularProgress, Divider
} from '@mui/material';
import {
  Analytics, TrendingUp, People, LocalHospital, School, 
  Download, Print, Assessment, BarChart, 
  Vaccines, CheckCircle, Refresh
} from '@mui/icons-material';
import {
  BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart as RechartsPieChart, Cell, Pie
} from 'recharts';
import { getSystemReports, getAdminDashboardStats, getAllStudents, getAllHealthEvents, getAllHealthCheckupRecords, getAllVaccinationRecords } from '../../utils/api';
import PageHeader from '../../components/PageHeader';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const AnalyticsReports = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [systemReports, setSystemReports] = useState(null);
  const [chartData, setChartData] = useState({
    gradeDistribution: [],
    monthlyActivity: [],
    healthSummary: []
  });

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get real data from backend
      const [stats, reports, students, healthEvents, healthCheckups, vaccinations] = await Promise.all([
        getAdminDashboardStats().catch(() => null),
        getSystemReports().catch(() => null),
        getAllStudents().catch(() => []),
        getAllHealthEvents().catch(() => []),
        getAllHealthCheckupRecords().catch(() => []),
        getAllVaccinationRecords().catch(() => [])
      ]);
      
      setDashboardStats(stats);
      setSystemReports(reports);
      
      // Process data for charts
      processChartData(students, healthEvents, healthCheckups, vaccinations, reports);
      
    } catch (err) {
      console.error('Error loading analytics data:', err);
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (students, healthEvents, healthCheckups, vaccinations, reports) => {
    // Grade distribution from real student data
    const gradeDistribution = {};
    students.forEach(student => {
      const grade = student.gradeName || 'Unknown';
      gradeDistribution[grade] = (gradeDistribution[grade] || 0) + 1;
    });
    
    const gradeChartData = Object.entries(gradeDistribution).map(([grade, count]) => ({
      name: grade,
      value: count,
      percentage: ((count / students.length) * 100).toFixed(1)
    }));

    // Monthly activity from reports or generate summary
    const monthlyActivity = reports?.monthlyActivity || [
      { month: 'Jan', checkups: 0, vaccinations: 0 },
      { month: 'Feb', checkups: 0, vaccinations: 0 },
      { month: 'Mar', checkups: 0, vaccinations: 0 },
      { month: 'Apr', checkups: 0, vaccinations: 0 },
      { month: 'May', checkups: 0, vaccinations: 0 },
      { month: 'Jun', checkups: healthCheckups.length, vaccinations: vaccinations.length }
    ];

    // Health summary
    const healthSummary = [
      { name: 'Health Events', value: healthEvents.length, color: '#0088FE' },
      { name: 'Health Checkups', value: healthCheckups.length, color: '#00C49F' },
      { name: 'Vaccinations', value: vaccinations.length, color: '#FFBB28' },
      { name: 'Students', value: students.length, color: '#FF8042' }
    ];

    setChartData({
      gradeDistribution: gradeChartData,
      monthlyActivity,
      healthSummary
    });
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card className="h-full">
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4" component="div" color={color} fontWeight="bold">
              {value || 0}
            </Typography>
            <Typography variant="h6" component="div" gutterBottom>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="p-6">
        <PageHeader 
          title="Analytics & Reports" 
          subtitle="Real-time system analytics and reporting"
          icon={<Analytics />}
        />
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Loading analytics data...
          </Typography>
        </Box>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <PageHeader 
          title="Analytics & Reports" 
          subtitle="Real-time system analytics and reporting"
          icon={<Analytics />}
        />
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
          <Button 
            onClick={loadAnalyticsData} 
            startIcon={<Refresh />}
            sx={{ ml: 2 }}
          >
            Retry
          </Button>
        </Alert>
      </div>
    );
  }

  const tabs = [
    { label: 'Overview', icon: <Assessment /> },
    { label: 'Health Data', icon: <LocalHospital /> },
    { label: 'Student Analytics', icon: <School /> },
    { label: 'System Reports', icon: <BarChart /> }
  ];

  return (
    <div className="p-6">
      <PageHeader 
        title="Analytics & Reports" 
        subtitle="Real-time system analytics and reporting"
        icon={<Analytics />}
      />

      {/* Quick Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Students"
            value={dashboardStats?.totalStudents}
            icon={<People />}
            color="#2196f3"
            subtitle="Active student accounts"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Health Events"
            value={dashboardStats?.totalHealthEvents}
            icon={<LocalHospital />}
            color="#4caf50"
            subtitle="Total health events"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Health Checkups"
            value={dashboardStats?.totalHealthCheckups}
            icon={<CheckCircle />}
            color="#ff9800"
            subtitle="Completed checkups"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Vaccinations"
            value={dashboardStats?.totalVaccinations}
            icon={<Vaccines />}
            color="#9c27b0"
            subtitle="Vaccination records"
          />
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={selectedTab} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabs.map((tab, index) => (
            <Tab 
              key={index}
              label={tab.label} 
              icon={tab.icon}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {selectedTab === 0 && (
        <Grid container spacing={3}>
          {/* Grade Distribution Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Student Distribution by Grade
                </Typography>
                <Box height={300}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={chartData.gradeDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                      >
                        {chartData.gradeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Health Summary Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Health System Summary
                </Typography>
                <Box height={300}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={chartData.healthSummary}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Monthly Activity */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Monthly Health Activity
                </Typography>
                <Box height={300}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={chartData.monthlyActivity}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="checkups" fill="#0088FE" name="Health Checkups" />
                      <Bar dataKey="vaccinations" fill="#00C49F" name="Vaccinations" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {selectedTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Health Data Summary
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <Box textAlign="center">
                      <Typography variant="h3" color="primary">
                        {dashboardStats?.totalHealthEvents || 0}
                      </Typography>
                      <Typography variant="subtitle1">
                        Total Health Events
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box textAlign="center">
                      <Typography variant="h3" color="success.main">
                        {dashboardStats?.totalHealthCheckups || 0}
                      </Typography>
                      <Typography variant="subtitle1">
                        Health Checkups Completed
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box textAlign="center">
                      <Typography variant="h3" color="warning.main">
                        {dashboardStats?.totalVaccinations || 0}
                      </Typography>
                      <Typography variant="subtitle1">
                        Vaccinations Administered
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {selectedTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Student Analytics
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Grade Level</TableCell>
                        <TableCell align="right">Student Count</TableCell>
                        <TableCell align="right">Percentage</TableCell>
                        <TableCell align="right">Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {chartData.gradeDistribution.map((grade, index) => (
                        <TableRow key={index}>
                          <TableCell component="th" scope="row">
                            {grade.name}
                          </TableCell>
                          <TableCell align="right">{grade.value}</TableCell>
                          <TableCell align="right">{grade.percentage}%</TableCell>
                          <TableCell align="right">
                            <Chip 
                              label="Active" 
                              color="success" 
                              size="small" 
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {selectedTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">
                    System Reports
                  </Typography>
                  <Box>
                    <Button 
                      startIcon={<Download />} 
                      variant="outlined" 
                      sx={{ mr: 1 }}
                      onClick={() => alert('Export functionality would be implemented here')}
                    >
                      Export Data
                    </Button>
                    <Button 
                      startIcon={<Print />} 
                      variant="outlined"
                      onClick={() => window.print()}
                    >
                      Print Report
                    </Button>
                  </Box>
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      System Health
                    </Typography>
                    <Box>
                      <Typography variant="body2">
                        Total Users: {dashboardStats?.totalUsers || 0}
                      </Typography>
                      <Typography variant="body2">
                        Active Users: {dashboardStats?.activeUsers || 0}
                      </Typography>
                      <Typography variant="body2">
                        System Uptime: {systemReports?.systemHealth?.systemUptime || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      Data Summary
                    </Typography>
                    <Box>
                      <Typography variant="body2">
                        Total Students: {dashboardStats?.totalStudents || 0}
                      </Typography>
                      <Typography variant="body2">
                        Health Records: {dashboardStats?.totalHealthCheckups || 0}
                      </Typography>
                      <Typography variant="body2">
                        Vaccination Records: {dashboardStats?.totalVaccinations || 0}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default AnalyticsReports;
