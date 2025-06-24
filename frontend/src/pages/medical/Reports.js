import React, { useState, useEffect } from 'react';
import { 
  Grid, Card, CardContent, Typography, Box, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, FormControl, InputLabel, 
  Select, MenuItem, Button, Chip, LinearProgress, Avatar, Divider,
  Alert, TextField, Tab, Tabs, IconButton
} from '@mui/material';
import {
  TrendingUp, Assessment, LocalHospital, Medication, Vaccines,
  School, Warning, CheckCircle, Cancel, Download, Print, FilterList,
  CalendarToday, People, BarChart, PieChart, Timeline
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart as RechartsPieChart, Cell, LineChart, 
  Line, Area, AreaChart, Pie
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Reports = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date()
  });
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [reportType, setReportType] = useState('overview');

  // Sample data for reports
  const [reportData, setReportData] = useState({
    overview: {
      totalStudents: 1250,
      activeHealthIssues: 45,
      medicationsManaged: 78,
      vaccinationCompliance: 92.5,
      checkupsCompleted: 156,
      emergencyEvents: 8
    },
    healthTrends: [
      { month: 'Jan', incidents: 12, checkups: 45, medications: 23 },
      { month: 'Feb', incidents: 8, checkups: 52, medications: 28 },
      { month: 'Mar', incidents: 15, checkups: 48, medications: 31 },
      { month: 'Apr', incidents: 6, checkups: 67, medications: 25 },
      { month: 'May', incidents: 11, checkups: 58, medications: 29 },
      { month: 'Jun', incidents: 9, checkups: 61, medications: 27 }
    ],
    vaccinationStatus: [
      { name: 'Fully Vaccinated', value: 1156, percentage: 92.5 },
      { name: 'Partially Vaccinated', value: 62, percentage: 5.0 },
      { name: 'Not Vaccinated', value: 32, percentage: 2.5 }
    ],
    medicationDistribution: [
      { category: 'Asthma Inhalers', count: 28, percentage: 35.9 },
      { category: 'EpiPens', count: 15, percentage: 19.2 },
      { category: 'ADHD Medication', count: 12, percentage: 15.4 },
      { category: 'Insulin', count: 8, percentage: 10.3 },
      { category: 'Other', count: 15, percentage: 19.2 }
    ],
    recentIncidents: [
      {
        id: 1,
        student: 'Emma Wilson',
        grade: '7A',
        type: 'Allergic Reaction',
        severity: 'Medium',
        date: '2024-01-15',
        status: 'Resolved'
      },
      {
        id: 2,
        student: 'Michael Chen',
        grade: '9B',
        type: 'Asthma Attack',
        severity: 'High',
        date: '2024-01-14',
        status: 'Resolved'
      },
      {
        id: 3,
        student: 'Sofia Rodriguez',
        grade: '6C',
        type: 'Minor Injury',
        severity: 'Low',
        date: '2024-01-13',
        status: 'Resolved'
      }
    ],
    upcomingTasks: [
      {
        id: 1,
        task: 'Annual Health Screening - Grade 8',
        dueDate: '2024-01-20',
        priority: 'High',
        type: 'Screening'
      },
      {
        id: 2,
        task: 'Medication Inventory Check',
        dueDate: '2024-01-18',
        priority: 'Medium',
        type: 'Inventory'
      },
      {
        id: 3,
        task: 'Vaccination Campaign Follow-up',
        dueDate: '2024-01-22',
        priority: 'High',
        type: 'Vaccination'
      }
    ]
  });

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High': return '#f44336';
      case 'Medium': return '#ff9800';
      case 'Low': return '#4caf50';
      default: return '#9e9e9e';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card className="h-full">
      <CardContent>
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
      {/* Key Metrics */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Students"
            value={reportData.overview.totalStudents.toLocaleString()}
            icon={<School />}
            color="#2196f3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Active Health Issues"
            value={reportData.overview.activeHealthIssues}
            icon={<Warning />}
            color="#ff9800"
            subtitle="Requires attention"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Medications Managed"
            value={reportData.overview.medicationsManaged}
            icon={<Medication />}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Vaccination Compliance"
            value={`${reportData.overview.vaccinationCompliance}%`}
            icon={<Vaccines />}
            color="#9c27b0"
            subtitle="Above target"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Checkups Completed"
            value={reportData.overview.checkupsCompleted}
            icon={<LocalHospital />}
            color="#00bcd4"
            subtitle="This month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Emergency Events"
            value={reportData.overview.emergencyEvents}
            icon={<Assessment />}
            color="#f44336"
            subtitle="This month"
          />
        </Grid>
      </Grid>

      {/* Health Trends Chart */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Health Activity Trends (Last 6 Months)
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsBarChart data={reportData.healthTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="incidents" fill="#f44336" name="Incidents" />
              <Bar dataKey="checkups" fill="#4caf50" name="Checkups" />
              <Bar dataKey="medications" fill="#2196f3" name="Medications" />
            </RechartsBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Incidents & Upcoming Tasks */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Medical Incidents
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Student</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Severity</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportData.recentIncidents.map((incident) => (
                      <TableRow key={incident.id}>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {incident.student}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {incident.grade}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{incident.type}</TableCell>
                        <TableCell>
                          <Chip
                            label={incident.severity}
                            size="small"
                            style={{
                              backgroundColor: getSeverityColor(incident.severity),
                              color: 'white'
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={incident.status}
                            size="small"
                            color="success"
                            variant="outlined"
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

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upcoming Tasks
              </Typography>
              <div className="space-y-3">
                {reportData.upcomingTasks.map((task) => (
                  <Paper key={task.id} elevation={1} className="p-3">
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box flex={1}>
                        <Typography variant="body2" fontWeight="bold">
                          {task.task}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Due: {task.dueDate}
                        </Typography>
                      </Box>
                      <Box display="flex" gap={1}>
                        <Chip
                          label={task.priority}
                          size="small"
                          color={getPriorityColor(task.priority)}
                        />
                        <Chip
                          label={task.type}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );

  const VaccinationReportsTab = () => (
    <div className="space-y-6">
      {/* Vaccination Compliance Chart */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Vaccination Status Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Tooltip />
                  <Pie
                    data={reportData.vaccinationStatus}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                  >
                    {reportData.vaccinationStatus.map((entry, index) => (
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
                Vaccination Statistics
              </Typography>
              <div className="space-y-4">
                {reportData.vaccinationStatus.map((status, index) => (
                  <Box key={status.name}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">{status.name}</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {status.value} ({status.percentage}%)
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={status.percentage}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: COLORS[index % COLORS.length]
                        }
                      }}
                    />
                  </Box>
                ))}
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Vaccination by Grade */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Vaccination Compliance by Grade
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Grade</TableCell>
                  <TableCell>Total Students</TableCell>
                  <TableCell>Fully Vaccinated</TableCell>
                  <TableCell>Partially Vaccinated</TableCell>
                  <TableCell>Not Vaccinated</TableCell>
                  <TableCell>Compliance Rate</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {['6A', '6B', '7A', '7B', '8A', '8B', '9A', '9B'].map((grade) => {
                  const total = Math.floor(Math.random() * 40) + 120;
                  const fullyVaccinated = Math.floor(total * 0.92);
                  const partiallyVaccinated = Math.floor(total * 0.05);
                  const notVaccinated = total - fullyVaccinated - partiallyVaccinated;
                  const compliance = ((fullyVaccinated / total) * 100).toFixed(1);
                  
                  return (
                    <TableRow key={grade}>
                      <TableCell fontWeight="bold">{grade}</TableCell>
                      <TableCell>{total}</TableCell>
                      <TableCell>{fullyVaccinated}</TableCell>
                      <TableCell>{partiallyVaccinated}</TableCell>
                      <TableCell>{notVaccinated}</TableCell>
                      <TableCell>
                        <Chip
                          label={`${compliance}%`}
                          color={compliance >= 90 ? 'success' : compliance >= 80 ? 'warning' : 'error'}
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
    </div>
  );

  const MedicationReportsTab = () => (
    <div className="space-y-6">
      {/* Medication Distribution */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Medication Distribution by Category
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Tooltip />
                  <Pie
                    data={reportData.medicationDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ category, percentage }) => `${category}: ${percentage}%`}
                  >
                    {reportData.medicationDistribution.map((entry, index) => (
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
                Medication Inventory Status
              </Typography>
              <div className="space-y-3">
                <Alert severity="warning">
                  <Typography variant="body2">
                    <strong>Low Stock Alert:</strong> 3 medications below minimum threshold
                  </Typography>
                </Alert>
                <Alert severity="error">
                  <Typography variant="body2">
                    <strong>Expiry Alert:</strong> 2 medications expiring within 30 days
                  </Typography>
                </Alert>
                <Alert severity="success">
                  <Typography variant="body2">
                    <strong>Well Stocked:</strong> 15 medications above safety stock
                  </Typography>
                </Alert>
              </div>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" gutterBottom>
                Quick Actions
              </Typography>
              <div className="space-y-2">
                <Button 
                  variant="outlined" 
                  size="small" 
                  fullWidth
                  startIcon={<Warning />}
                >
                  View Low Stock Items
                </Button>
                <Button 
                  variant="outlined" 
                  size="small" 
                  fullWidth
                  startIcon={<CalendarToday />}
                >
                  Check Expiry Dates
                </Button>
                <Button 
                  variant="outlined" 
                  size="small" 
                  fullWidth
                  startIcon={<Download />}
                >
                  Generate Inventory Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Medication Administration Timeline */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Daily Medication Administration
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={reportData.healthTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="medications" 
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

  const HealthScreeningTab = () => (
    <div className="space-y-6">
      {/* Screening Summary */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Screenings Completed"
            value="156"
            icon={<CheckCircle />}
            color="#4caf50"
            subtitle="This month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Follow-ups Required"
            value="23"
            icon={<Warning />}
            color="#ff9800"
            subtitle="Needs attention"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="BMI Concerns"
            value="18"
            icon={<TrendingUp />}
            color="#f44336"
            subtitle="Above/below range"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Vision Referrals"
            value="12"
            icon={<Assessment />}
            color="#9c27b0"
            subtitle="Specialist needed"
          />
        </Grid>
      </Grid>

      {/* Screening Results by Category */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Health Screening Results Summary
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Screening Type</TableCell>
                  <TableCell>Total Conducted</TableCell>
                  <TableCell>Normal</TableCell>
                  <TableCell>Attention Needed</TableCell>
                  <TableCell>Referral Required</TableCell>
                  <TableCell>Success Rate</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  { type: 'Vision Test', total: 156, normal: 132, attention: 12, referral: 12 },
                  { type: 'Hearing Test', total: 156, normal: 148, attention: 6, referral: 2 },
                  { type: 'BMI Assessment', total: 156, normal: 128, attention: 18, referral: 10 },
                  { type: 'Blood Pressure', total: 156, normal: 145, attention: 8, referral: 3 },
                  { type: 'Dental Check', total: 156, normal: 118, attention: 25, referral: 13 }
                ].map((screening) => {
                  const successRate = ((screening.normal / screening.total) * 100).toFixed(1);
                  return (
                    <TableRow key={screening.type}>
                      <TableCell fontWeight="bold">{screening.type}</TableCell>
                      <TableCell>{screening.total}</TableCell>
                      <TableCell>{screening.normal}</TableCell>
                      <TableCell>{screening.attention}</TableCell>
                      <TableCell>{screening.referral}</TableCell>
                      <TableCell>
                        <Chip
                          label={`${successRate}%`}
                          color={successRate >= 85 ? 'success' : successRate >= 70 ? 'warning' : 'error'}
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
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <Typography variant="h4" component="h1" gutterBottom>
          Medical Reports & Analytics
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Comprehensive health data analysis and reporting dashboard
        </Typography>
      </div>

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
                <InputLabel>Grade</InputLabel>
                <Select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  label="Grade"
                >
                  <MenuItem value="all">All Grades</MenuItem>
                  <MenuItem value="6">Grade 6</MenuItem>
                  <MenuItem value="7">Grade 7</MenuItem>
                  <MenuItem value="8">Grade 8</MenuItem>
                  <MenuItem value="9">Grade 9</MenuItem>
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
                  Export
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

      {/* Report Tabs */}
      <Card>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Overview" icon={<Assessment />} />
          <Tab label="Vaccination Reports" icon={<Vaccines />} />
          <Tab label="Medication Reports" icon={<Medication />} />
          <Tab label="Health Screening" icon={<LocalHospital />} />
        </Tabs>
        
        <CardContent>
          {selectedTab === 0 && <OverviewTab />}
          {selectedTab === 1 && <VaccinationReportsTab />}
          {selectedTab === 2 && <MedicationReportsTab />}
          {selectedTab === 3 && <HealthScreeningTab />}
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;