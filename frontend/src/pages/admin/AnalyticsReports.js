import React, { useState, useEffect } from 'react';
import { 
  Grid, Card, CardContent, Typography, Box, Paper, Alert, CircularProgress, 
  Divider, IconButton
} from '@mui/material';
import {
  Analytics, People, LocalHospital, School, Vaccines, Refresh, Assessment
} from '@mui/icons-material';
import {
  BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart as RechartsPieChart, Cell, Pie
} from 'recharts';
import { getSystemReports, getAdminDashboardStats } from '../../utils/api';
import PageHeader from '../../components/PageHeader';

const COLORS = ['#2196F3', '#4CAF50', '#FF9800', '#F44336', '#9C27B0', '#00BCD4'];

const AnalyticsReports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [chartData, setChartData] = useState({
    gradeDistribution: [],
    monthlyActivity: [],
    overviewStats: []
  });

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get real data from backend
      const [stats, reports] = await Promise.all([
        getAdminDashboardStats().catch(() => null),
        getSystemReports().catch(() => null)
      ]);
      
      setDashboardStats(stats);
      processChartData(stats, reports);
      
    } catch (err) {
      console.error('Error loading analytics data:', err);
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (stats, reports) => {
    // Overview statistics for chart
    const overviewStats = stats ? [
      { name: 'Students', value: stats.totalStudents || 0, color: COLORS[0] },
      { name: 'Nurses', value: stats.totalNurses || 0, color: COLORS[1] },
      { name: 'Health Checkups', value: stats.totalHealthCheckups || 0, color: COLORS[2] },
      { name: 'Vaccinations', value: stats.totalVaccinations || 0, color: COLORS[3] },
      { name: 'Health Events', value: stats.totalHealthEvents || 0, color: COLORS[4] }
    ] : [];

    // Grade distribution from reports
    const gradeDistribution = reports?.gradeDistribution ? 
      Object.entries(reports.gradeDistribution).map(([grade, count]) => ({
        name: grade,
        value: count,
        percentage: ((count / Object.values(reports.gradeDistribution).reduce((a, b) => a + b, 0)) * 100).toFixed(1)
      })) : [];

    // Monthly activity from reports
    const monthlyActivity = reports?.monthlyActivity || [];

    setChartData({
      gradeDistribution,
      monthlyActivity,
      overviewStats
    });
  };

  const StatCard = ({ title, value, icon, color = '#2196F3', subtitle }) => (
    <Card sx={{ height: '100%', borderLeft: `4px solid ${color}` }}>
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
          <Box sx={{ color: color, fontSize: 40 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="p-6">
        <PageHeader 
          title="Analytics & Reports" 
          subtitle="System overview and real-time statistics"
          icon={<Analytics />}
        />
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress size={40} />
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
          subtitle="System overview and real-time statistics"
          icon={<Analytics />}
        />
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
          <IconButton onClick={loadAnalyticsData} sx={{ ml: 2 }}>
            <Refresh />
          </IconButton>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PageHeader 
        title="Analytics & Reports" 
        subtitle="System overview and real-time statistics"
        icon={<Analytics />}
        action={
          <IconButton onClick={loadAnalyticsData} color="primary">
            <Refresh />
          </IconButton>
        }
      />

      {/* Key Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard
            title="Total Students"
            value={dashboardStats?.totalStudents}
            icon={<School />}
            color={COLORS[0]}
            subtitle="Enrolled students"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard
            title="Medical Staff"
            value={dashboardStats?.totalNurses}
            icon={<People />}
            color={COLORS[1]}
            subtitle="Active nurses"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard
            title="Health Checkups"
            value={dashboardStats?.totalHealthCheckups}
            icon={<LocalHospital />}
            color={COLORS[2]}
            subtitle="Total completed"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard
            title="Vaccinations"
            value={dashboardStats?.totalVaccinations}
            icon={<Vaccines />}
            color={COLORS[3]}
            subtitle="Total administered"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard
            title="Health Events"
            value={dashboardStats?.totalHealthEvents}
            icon={<Assessment />}
            color={COLORS[4]}
            subtitle="Total organized"
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3}>
        {/* System Overview Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Assessment sx={{ mr: 1 }} />
                System Overview
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={chartData.overviewStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [value, name]}
                      labelStyle={{ color: '#333' }}
                    />
                    <Bar dataKey="value" fill="#2196F3" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Grade Distribution Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <School sx={{ mr: 1 }} />
                Student Grade Distribution
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box height={300}>
                {chartData.gradeDistribution.length > 0 ? (
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
                ) : (
                  <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <Typography color="text.secondary">No grade distribution data available</Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Monthly Activity Chart */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <LocalHospital sx={{ mr: 1 }} />
                Monthly Health Activity
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box height={300}>
                {chartData.monthlyActivity.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={chartData.monthlyActivity}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="checkups" fill={COLORS[2]} name="Health Checkups" />
                      <Bar dataKey="vaccinations" fill={COLORS[3]} name="Vaccinations" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                ) : (
                  <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <Typography color="text.secondary">No monthly activity data available</Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Footer Note */}
      <Paper sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5' }}>
        <Typography variant="body2" color="text.secondary" align="center">
          📊 All data shown above is real-time information from FPT Junior High School Health Management System
        </Typography>
      </Paper>
    </div>
  );
};

export default AnalyticsReports;
