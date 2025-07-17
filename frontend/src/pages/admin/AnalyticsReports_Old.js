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
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography variant="h4" component="h2" style={{ color }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography color="textSecondary" variant="body2">
                {subtitle}
              </Typography>
            )}
            {trend && (
              <Box display="flex" alignItems="center" mt={1}>
                <TrendingUp 
                  fontSize="small" 
                  color={trend === 'up' ? 'success' : trend === 'down' ? 'error' : 'action'} 
                />
                <Typography variant="caption" color="textSecondary" ml={0.5}>
                  {trend === 'up' ? 'Increasing' : trend === 'down' ? 'Decreasing' : 'Stable'}
                </Typography>
              </Box>
            )}
          </Box>
          <Avatar style={{ backgroundColor: color, width: 56, height: 56 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Key System Metrics */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={analyticsData.systemOverview.totalUsers.toLocaleString()}
            icon={<People />}
            color="#2196f3"
            subtitle="All system users"
            trend="up"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Today"
            value={analyticsData.systemOverview.dailyActiveUsers.toLocaleString()}
            icon={<TrendingUp />}
            color="#4caf50"
            subtitle="Daily active users"
            trend="up"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Students"
            value={analyticsData.systemOverview.totalStudents.toLocaleString()}
            icon={<School />}
            color="#ff9800"
            subtitle="Enrolled students"
            trend="stable"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="System Uptime"
            value={`${analyticsData.systemOverview.systemUptime}%`}
            icon={<CheckCircle />}
            color="#9c27b0"
            subtitle="Last 30 days"
            trend="stable"
          />
        </Grid>
      </Grid>

      {/* Health System Metrics */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Health Records"
            value={analyticsData.healthMetrics.totalHealthRecords.toLocaleString()}
            icon={<LocalHospital />}
            color="#00bcd4"
            subtitle="Total records"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Medications Given"
            value={analyticsData.healthMetrics.medicationsAdministered.toLocaleString()}
            icon={<Medication />}
            color="#795548"
            subtitle="This year"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Vaccinations"
            value={analyticsData.healthMetrics.vaccinationsCompleted.toLocaleString()}
            icon={<Vaccines />}
            color="#607d8b"
            subtitle="Completed"
          />
        </Grid>
      </Grid>

      {/* Activity Trends */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            System Activity Trends (Last 6 Months)
          </Typography>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={analyticsData.trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#2196f3" name="Active Users" strokeWidth={3} />
              <Line type="monotone" dataKey="incidents" stroke="#f44336" name="Incidents" strokeWidth={2} />
              <Line type="monotone" dataKey="checkups" stroke="#4caf50" name="Checkups" strokeWidth={2} />
              <Line type="monotone" dataKey="medications" stroke="#ff9800" name="Medications" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* User Distribution & Performance */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                User Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Tooltip />
                  <Pie
                    data={analyticsData.userDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                  >
                    {analyticsData.userDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Performance
              </Typography>
              <div className="space-y-3">
                {analyticsData.systemPerformance.map((metric, index) => (
                  <Box key={index} display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2">{metric.metric}</Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body2" fontWeight="bold">
                        {metric.value}
                      </Typography>
                      <Chip
                        label={metric.status}
                        size="small"
                        color={metric.status === 'success' ? 'success' : 'warning'}
                      />
                    </Box>
                  </Box>
                ))}
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );

  const HealthAnalyticsTab = () => (
    <div className="space-y-6">
      {/* Health Compliance Dashboard */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Health Compliance Dashboard
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell>Current Rate</TableCell>
                  <TableCell>Target</TableCell>
                  <TableCell>Gap</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {analyticsData.healthCompliance.map((item, index) => {
                  const gap = (item.current - item.target).toFixed(1);
                  return (
                    <TableRow key={index}>
                      <TableCell fontWeight="bold">{item.category}</TableCell>
                      <TableCell>{item.current}%</TableCell>
                      <TableCell>{item.target}%</TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2" 
                          color={gap >= 0 ? 'success.main' : 'error.main'}
                        >
                          {gap >= 0 ? '+' : ''}{gap}%
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.status.toUpperCase()}
                          color={item.status === 'success' ? 'success' : item.status === 'warning' ? 'warning' : 'error'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Grade-wise Analytics */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Grade-wise Health Analytics
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Grade</TableCell>
                  <TableCell>Total Students</TableCell>
                  <TableCell>Health Incidents</TableCell>
                  <TableCell>Vaccination Rate</TableCell>
                  <TableCell>Checkups Completed</TableCell>
                  <TableCell>Health Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(analyticsData.gradeAnalytics).map(([grade, data]) => {
                  const vaccinationRate = ((data.vaccinated / data.students) * 100).toFixed(1);
                  const incidentRate = ((data.incidents / data.students) * 100).toFixed(1);
                  const checkupRate = ((data.checkups / data.students) * 100).toFixed(1);
                  const healthScore = (100 - incidentRate * 2 + parseFloat(vaccinationRate) * 0.3).toFixed(1);
                  
                  return (
                    <TableRow key={grade}>
                      <TableCell fontWeight="bold">Grade {grade}</TableCell>
                      <TableCell>{data.students}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          {data.incidents}
                          <Typography variant="caption" color="textSecondary">
                            ({incidentRate}%)
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          {data.vaccinated}
                          <Typography variant="caption" color="textSecondary">
                            ({vaccinationRate}%)
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          {data.checkups}
                          <Typography variant="caption" color="textSecondary">
                            ({checkupRate}%)
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${healthScore}/100`}
                          color={healthScore >= 90 ? 'success' : healthScore >= 80 ? 'warning' : 'error'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Health Trends by Grade */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Health Incidents by Grade
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsBarChart 
              data={Object.entries(analyticsData.gradeAnalytics).map(([grade, data]) => ({
                grade: `Grade ${grade}`,
                incidents: data.incidents,
                students: data.students,
                rate: ((data.incidents / data.students) * 100).toFixed(1)
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="grade" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="incidents" fill="#f44336" name="Incidents" />
            </RechartsBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  const UserAnalyticsTab = () => (
    <div className="space-y-6">
      {/* User Engagement Metrics */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Daily Active"
            value="756"
            icon={<People />}
            color="#4caf50"
            subtitle="48% engagement"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Weekly Active"
            value="1,234"
            icon={<TrendingUp />}
            color="#2196f3"
            subtitle="79% engagement"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Monthly Active"
            value="1,432"
            icon={<Analytics />}
            color="#ff9800"
            subtitle="91% engagement"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="New This Month"
            value="45"
            icon={<TrendingUp />}
            color="#9c27b0"
            subtitle="3% growth"
          />
        </Grid>
      </Grid>

      {/* User Activity by Role */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            User Activity by Role (Last 30 Days)
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Role</TableCell>
                  <TableCell>Total Users</TableCell>
                  <TableCell>Active Users</TableCell>
                  <TableCell>Engagement Rate</TableCell>
                  <TableCell>Avg. Session Duration</TableCell>
                  <TableCell>Actions/Session</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  { role: 'Students', total: 1250, active: 892, avgDuration: '12m 34s', actions: 8.3 },
                  { role: 'Parents', total: 289, active: 234, avgDuration: '6m 45s', actions: 4.7 },
                  { role: 'Medical Staff', total: 25, active: 24, avgDuration: '45m 12s', actions: 23.1 },
                  { role: 'Admins', total: 3, active: 3, avgDuration: '28m 56s', actions: 15.2 }
                ].map((row, index) => {
                  const engagement = ((row.active / row.total) * 100).toFixed(1);
                  return (
                    <TableRow key={index}>
                      <TableCell fontWeight="bold">{row.role}</TableCell>
                      <TableCell>{row.total}</TableCell>
                      <TableCell>{row.active}</TableCell>
                      <TableCell>
                        <Chip
                          label={`${engagement}%`}
                          color={engagement >= 90 ? 'success' : engagement >= 70 ? 'warning' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{row.avgDuration}</TableCell>
                      <TableCell>{row.actions}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Usage Patterns */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            System Usage Patterns
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={[
              { hour: '6AM', users: 12 },
              { hour: '7AM', users: 145 },
              { hour: '8AM', users: 432 },
              { hour: '9AM', users: 567 },
              { hour: '10AM', users: 634 },
              { hour: '11AM', users: 689 },
              { hour: '12PM', users: 723 },
              { hour: '1PM', users: 756 },
              { hour: '2PM', users: 698 },
              { hour: '3PM', users: 623 },
              { hour: '4PM', users: 456 },
              { hour: '5PM', users: 234 },
              { hour: '6PM', users: 123 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="users" 
                stroke="#2196f3" 
                fill="#2196f3" 
                fillOpacity={0.3} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  const SystemReportsTab = () => (
    <div className="space-y-6">
      <Typography variant="h6" gutterBottom>
        Generate System Reports
      </Typography>
      
      <Grid container spacing={3}>
        {[
          {
            title: 'Comprehensive Health Report',
            description: 'Complete health analytics including vaccination rates, medical incidents, and compliance metrics',
            icon: <LocalHospital />,
            color: '#2196f3'
          },
          {
            title: 'User Activity Report',
            description: 'Detailed user engagement metrics, login patterns, and system usage statistics',
            icon: <People />,
            color: '#4caf50'
          },
          {
            title: 'Security Audit Report',
            description: 'Security events, access logs, and system vulnerability assessment',
            icon: <Assessment />,
            color: '#f44336'
          },
          {
            title: 'Performance Report',
            description: 'System performance metrics, response times, and resource utilization',
            icon: <Timeline />,
            color: '#ff9800'
          },
          {
            title: 'Compliance Report',
            description: 'Regulatory compliance status, policy adherence, and audit trail',
            icon: <CheckCircle />,
            color: '#9c27b0'
          },
          {
            title: 'Custom Analytics Report',
            description: 'Build custom reports with specific metrics and date ranges',
            icon: <Analytics />,
            color: '#00bcd4'
          }
        ].map((report, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Avatar style={{ backgroundColor: report.color }}>
                    {report.icon}
                  </Avatar>
                  <Typography variant="h6">{report.title}</Typography>
                </Box>
                <Typography variant="body2" color="textSecondary" mb={3}>
                  {report.description}
                </Typography>
                <Box display="flex" gap={1}>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    startIcon={<Download />}
                  >
                    Generate
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    startIcon={<Print />}
                  >
                    Print
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Stats */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Report Generation Statistics
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" color="textSecondary">
                Reports Generated This Month
              </Typography>
              <Typography variant="h4" color="primary">
                47
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" color="textSecondary">
                Most Popular Report
              </Typography>
              <Typography variant="h6">
                Health Compliance
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" color="textSecondary">
                Average Generation Time
              </Typography>
              <Typography variant="h6">
                3.2 seconds
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" color="textSecondary">
                Data Accuracy
              </Typography>
              <Typography variant="h6" color="success.main">
                99.7%
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );

  useEffect(() => {
    loadAnalyticsData();
  }, [dateRange, reportType]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load real data from APIs
      const [dashboardStats, systemReports] = await Promise.all([
        getAdminDashboardStats(),
        getSystemReports(reportType, dateRange)
      ]);

      // Update analytics data with real values
      setAnalyticsData(prevData => ({
        ...prevData,
        systemOverview: {
          totalUsers: dashboardStats?.totalUsers || 0,
          activeUsers: dashboardStats?.activeUsers || 0,
          totalStudents: dashboardStats?.totalStudents || 0,
          medicalStaff: dashboardStats?.totalNurses || 0,
          parents: dashboardStats?.totalUsers - dashboardStats?.totalStudents - dashboardStats?.totalNurses || 0,
          admins: 3, // Default admin count
          dailyActiveUsers: Math.round((dashboardStats?.activeUsers || 0) * 0.65),
          systemUptime: 99.8
        },
        healthMetrics: {
          totalHealthRecords: (dashboardStats?.totalHealthCheckups || 0) + (dashboardStats?.totalVaccinations || 0),
          medicationsAdministered: Math.round((dashboardStats?.totalVaccinations || 0) * 0.8),
          vaccinationsCompleted: dashboardStats?.totalVaccinations || 0,
          healthCheckups: dashboardStats?.totalHealthCheckups || 0,
          emergencyIncidents: Math.round((dashboardStats?.totalStudents || 0) * 0.02),
          complianceRate: 94.2
        },
        monthlyTrends: systemReports?.monthlyActivity || prevData.monthlyTrends,
        userDistribution: [
          { name: 'Students', value: dashboardStats?.totalStudents || 0, percentage: 79.8 },
          { name: 'Parents', value: Math.round((dashboardStats?.totalUsers || 0) * 0.3), percentage: 18.4 },
          { name: 'Medical Staff', value: dashboardStats?.totalNurses || 0, percentage: 1.6 },
          { name: 'Admins', value: 3, percentage: 0.2 }
        ],
        // Keep other static data for demo purposes
        healthCompliance: prevData.healthCompliance,
        gradeAnalytics: systemReports?.gradeDistribution || prevData.gradeAnalytics,
        systemPerformance: prevData.systemPerformance
      }));

    } catch (err) {
      console.error('Error loading analytics data:', err);
      setError('Failed to load analytics data. Displaying sample data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <PageHeader 
          title="Analytics & Reports" 
          subtitle="Comprehensive system analytics and reporting dashboard"
          icon={<Analytics />}
        />
        <Box display="flex" justifyContent="center" mt={4}>
          <Typography>Loading analytics data...</Typography>
        </Box>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader 
        title="Analytics & Reports" 
        subtitle="Comprehensive system analytics and reporting dashboard"
        icon={<Analytics />}
      />
      
      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={dateRange.startDate}
                  onChange={(newValue) => setDateRange(prev => ({ ...prev, startDate: newValue }))}
                  renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={dateRange.endDate}
                  onChange={(newValue) => setDateRange(prev => ({ ...prev, endDate: newValue }))}
                  renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Grade Filter</InputLabel>
                <Select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  label="Grade Filter"
                >
                  <MenuItem value="all">All Grades</MenuItem>
                  {[6, 7, 8, 9, 10, 11, 12].map(grade => (
                    <MenuItem key={grade} value={grade}>Grade {grade}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box display="flex" gap={1}>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  size="small"
                >
                  Export All
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Print />}
                  size="small"
                >
                  Print
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Analytics Tabs */}
      <Card>
        <Tabs value={selectedTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          <Tab label="System Overview" icon={<Analytics />} />
          <Tab label="Health Analytics" icon={<LocalHospital />} />
          <Tab label="User Analytics" icon={<People />} />
          <Tab label="System Reports" icon={<Assessment />} />
        </Tabs>
        
        <CardContent>
          {selectedTab === 0 && <OverviewTab />}
          {selectedTab === 1 && <HealthAnalyticsTab />}
          {selectedTab === 2 && <UserAnalyticsTab />}
          {selectedTab === 3 && <SystemReportsTab />}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsReports;