import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Paper,
  Tabs,
  Tab,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Chip,
  Alert
} from '@mui/material';
import {
  PictureAsPdf as PdfIcon,
  GetApp as DownloadIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  DateRange as DateRangeIcon,
  TrendingUp as TrendingUpIcon,
  LocalHospital as MedicalIcon,
  Assessment as AssessmentIcon,
  School as SchoolIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import { ChartWidget, DataTable, StatsCard } from '../../components/shared';
import PageHeader from '../../components/PageHeader';

const ReportsAnalytics = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reportPeriod, setReportPeriod] = useState('month');
  const [reportType, setReportType] = useState('health_incidents');
  const [reportData, setReportData] = useState({
    summary: {},
    details: [],
    charts: {}
  });

  // Load mock data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockData = generateMockData();
      setReportData(mockData);
      setLoading(false);
    }, 1000);
  }, [reportPeriod, reportType]);

  const generateMockData = () => {
    // Common mock data structure
    const baseData = {
      summary: {
        totalRecords: 248,
        trendPercentage: 5.2,
        trendDirection: 'up',
        lastUpdated: '2025-06-06T08:30:00'
      },
      charts: {
        timeline: {
          data: [
            { date: '2025-05-01', count: 15 },
            { date: '2025-05-08', count: 22 },
            { date: '2025-05-15', count: 18 },
            { date: '2025-05-22', count: 25 },
            { date: '2025-05-29', count: 30 },
            { date: '2025-06-05', count: 28 }
          ]
        },
        distribution: {
          data: []
        }
      },
      details: []
    };

    // Generate report-specific mock data
    switch (reportType) {
      case 'health_incidents':
        return {
          ...baseData,
          summary: {
            ...baseData.summary,
            totalRecords: 87,
            averageResolutionTime: '45 minutes',
            criticalIncidents: 7,
          },
          charts: {
            ...baseData.charts,
            distribution: {
              data: [
                { name: 'Minor Injury', value: 42 },
                { name: 'Illness', value: 28 },
                { name: 'Emergency', value: 7 },
                { name: 'Other', value: 10 }
              ]
            }
          },
          details: [
            { id: 1, date: '2025-06-05', type: 'Injury', description: 'Playground fall - minor abrasion', student: 'Emma Thompson', grade: '3A', status: 'Resolved', resolvedBy: 'Nurse Johnson' },
            { id: 2, date: '2025-06-05', type: 'Illness', description: 'Fever and headache', student: 'David Chen', grade: '5C', status: 'Treated', resolvedBy: 'Nurse Wilson' },
            { id: 3, date: '2025-06-04', type: 'Emergency', description: 'Severe allergic reaction', student: 'Michael Rodriguez', grade: '7B', status: 'Resolved', resolvedBy: 'Nurse Johnson' },
            { id: 4, date: '2025-06-04', type: 'Illness', description: 'Stomach pain', student: 'Sophia Kim', grade: '4D', status: 'Treated', resolvedBy: 'Nurse Garcia' },
            { id: 5, date: '2025-06-03', type: 'Injury', description: 'PE class - sprained ankle', student: 'James Wilson', grade: '8A', status: 'Treated', resolvedBy: 'Nurse Johnson' },
          ]
        };
      
      case 'vaccinations':
        return {
          ...baseData,
          summary: {
            ...baseData.summary,
            totalRecords: 920,
            completionRate: '87%',
            pendingConsents: 45
          },
          charts: {
            ...baseData.charts,
            distribution: {
              data: [
                { name: 'Complete', value: 920 },
                { name: 'Incomplete', value: 110 },
                { name: 'Exempt', value: 25 },
                { name: 'Pending', value: 195 }
              ]
            }
          },
          details: [
            { id: 1, vaccine: 'MMR', dueDate: '2025-05-15', completed: '2025-05-12', grade: '6', totalStudents: 120, completedCount: 108, completionRate: '90%', status: 'Active' },
            { id: 2, vaccine: 'Tdap', dueDate: '2025-06-10', completed: '-', grade: '7', totalStudents: 125, completedCount: 92, completionRate: '74%', status: 'Active' },
            { id: 3, vaccine: 'Influenza', dueDate: '2025-04-30', completed: '2025-04-28', grade: 'All', totalStudents: 1250, completedCount: 1050, completionRate: '84%', status: 'Completed' },
            { id: 4, vaccine: 'HPV (Dose 1)', dueDate: '2025-07-15', completed: '-', grade: '8', totalStudents: 132, completedCount: 0, completionRate: '0%', status: 'Scheduled' },
            { id: 5, vaccine: 'Hepatitis B', dueDate: '2025-03-20', completed: '2025-03-18', grade: '5', totalStudents: 118, completedCount: 115, completionRate: '97%', status: 'Completed' },
          ]
        };
        
      case 'checkups':
        return {
          ...baseData,
          summary: {
            ...baseData.summary,
            totalRecords: 845,
            completionRate: '82%',
            abnormalFindings: 78
          },
          charts: {
            ...baseData.charts,
            distribution: {
              data: [
                { name: 'Normal', value: 767 },
                { name: 'Follow-up Needed', value: 55 },
                { name: 'Referred to Specialist', value: 23 }
              ]
            }
          },
          details: [
            { id: 1, checkupType: 'Annual Physical', date: '2025-05-20', grade: '3', totalStudents: 115, completedCount: 115, abnormalCount: 8, status: 'Completed' },
            { id: 2, checkupType: 'Vision Screening', date: '2025-06-10', grade: '2', totalStudents: 108, completedCount: 0, abnormalCount: 0, status: 'Scheduled' },
            { id: 3, checkupType: 'Dental Exam', date: '2025-04-15', grade: '4', totalStudents: 122, completedCount: 118, abnormalCount: 15, status: 'Completed' },
            { id: 4, checkupType: 'Hearing Test', date: '2025-05-05', grade: '1', totalStudents: 105, completedCount: 105, abnormalCount: 7, status: 'Completed' },
            { id: 5, checkupType: 'Growth Assessment', date: '2025-03-10', grade: 'All', totalStudents: 1250, completedCount: 1245, abnormalCount: 48, status: 'Completed' },
          ]
        };
        
      case 'staff_performance':
        return {
          ...baseData,
          summary: {
            ...baseData.summary,
            totalStaff: 15,
            averageResponseTime: '12 minutes',
            casesClosed: 432
          },
          charts: {
            ...baseData.charts,
            distribution: {
              data: [
                { name: 'Nurse Johnson', value: 156 },
                { name: 'Nurse Garcia', value: 143 },
                { name: 'Nurse Wilson', value: 122 },
                { name: 'Nurse Taylor', value: 98 },
                { name: 'Other', value: 119 }
              ]
            }
          },
          details: [
            { id: 1, staffName: 'Nurse Johnson', role: 'Head Nurse', casesHandled: 156, avgResponseTime: '8 mins', successRate: '98%', specialization: 'Emergency Care' },
            { id: 2, staffName: 'Nurse Garcia', role: 'School Nurse', casesHandled: 143, avgResponseTime: '10 mins', successRate: '97%', specialization: 'Pediatrics' },
            { id: 3, staffName: 'Nurse Wilson', role: 'School Nurse', casesHandled: 122, avgResponseTime: '12 mins', successRate: '96%', specialization: 'First Aid' },
            { id: 4, staffName: 'Nurse Taylor', role: 'Assistant Nurse', casesHandled: 98, avgResponseTime: '15 mins', successRate: '95%', specialization: 'General Care' },
            { id: 5, staffName: 'Nurse Martinez', role: 'Assistant Nurse', casesHandled: 89, avgResponseTime: '14 mins', successRate: '94%', specialization: 'Vaccinations' },
          ]
        };

      default:
        return baseData;
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handlePeriodChange = (event) => {
    setReportPeriod(event.target.value);
  };

  const handleReportTypeChange = (event) => {
    setReportType(event.target.value);
  };

  // Helper function to get report title
  const getReportTitle = () => {
    switch (reportType) {
      case 'health_incidents': return 'Health Incidents Report';
      case 'vaccinations': return 'Vaccination Program Report';
      case 'checkups': return 'Health Checkups Report';
      case 'staff_performance': return 'Staff Performance Report';
      default: return 'School Health Report';
    }
  };

  // Helper function to get report subtitle
  const getReportSubtitle = () => {
    let periodText;
    switch (reportPeriod) {
      case 'week': periodText = 'Last 7 days'; break;
      case 'month': periodText = 'Last 30 days'; break;
      case 'quarter': periodText = 'Last quarter'; break;
      case 'year': periodText = 'Current academic year'; break;
      default: periodText = 'Last 30 days';
    }
    return `${periodText} • ${new Date().toLocaleDateString()}`;
  };

  // Timeline Chart Data
  const timelineChartData = {
    title: "Activity Timeline",
    subtitle: getReportSubtitle(),
    chartType: "line",
    data: reportData.charts?.timeline?.data || [],
    xAxisKey: "date",
    series: [{ name: "Count", key: "count", color: "#3b82f6" }]
  };

  // Distribution Chart Data
  const distributionChartData = {
    title: "Distribution",
    subtitle: getReportSubtitle(),
    chartType: "pie",
    data: reportData.charts?.distribution?.data || []
  };

  // Column definitions for data table
  const getTableColumns = () => {
    switch (reportType) {
      case 'health_incidents':
        return [
          { id: 'date', label: 'Date', format: 'date' },
          { id: 'type', label: 'Type' },
          { id: 'description', label: 'Description' },
          { id: 'student', label: 'Student' },
          { id: 'grade', label: 'Grade' },
          { id: 'status', label: 'Status' },
          { id: 'resolvedBy', label: 'Resolved By' }
        ];
      case 'vaccinations':
        return [
          { id: 'vaccine', label: 'Vaccine' },
          { id: 'dueDate', label: 'Due Date', format: 'date' },
          { id: 'completed', label: 'Completed', format: 'date' },
          { id: 'grade', label: 'Grade' },
          { id: 'totalStudents', label: 'Total Students' },
          { id: 'completedCount', label: 'Completed' },
          { id: 'completionRate', label: 'Completion Rate' },
          { id: 'status', label: 'Status' }
        ];
      case 'checkups':
        return [
          { id: 'checkupType', label: 'Checkup Type' },
          { id: 'date', label: 'Date', format: 'date' },
          { id: 'grade', label: 'Grade' },
          { id: 'totalStudents', label: 'Total Students' },
          { id: 'completedCount', label: 'Completed' },
          { id: 'abnormalCount', label: 'Abnormal Findings' },
          { id: 'status', label: 'Status' }
        ];
      case 'staff_performance':
        return [
          { id: 'staffName', label: 'Staff Name' },
          { id: 'role', label: 'Role' },
          { id: 'casesHandled', label: 'Cases Handled' },
          { id: 'avgResponseTime', label: 'Avg. Response Time' },
          { id: 'successRate', label: 'Success Rate' },
          { id: 'specialization', label: 'Specialization' }
        ];
      default:
        return [];
    }
  };

  // Render appropriate summary cards based on report type
  const renderSummaryCards = () => {
    switch (reportType) {
      case 'health_incidents':
        return (
          <>
            <Grid item xs={12} sm={6} md={4}>
              <StatsCard 
                title="Total Incidents"
                value={reportData.summary.totalRecords || 0}
                icon={<MedicalIcon fontSize="large" color="primary" />}
                trend={reportData.summary.trendPercentage}
                trendDirection={reportData.summary.trendDirection}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatsCard 
                title="Critical Incidents"
                value={reportData.summary.criticalIncidents || 0}
                icon={<MedicalIcon fontSize="large" color="error" />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatsCard 
                title="Avg. Resolution Time"
                value={reportData.summary.averageResolutionTime || "N/A"}
                icon={<DateRangeIcon fontSize="large" color="primary" />}
              />
            </Grid>
          </>
        );
      
      case 'vaccinations':
        return (
          <>
            <Grid item xs={12} sm={6} md={4}>
              <StatsCard 
                title="Completion Rate"
                value={reportData.summary.completionRate || "0%"}
                icon={<AssessmentIcon fontSize="large" color="primary" />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatsCard 
                title="Vaccinations Administered"
                value={reportData.summary.totalRecords || 0}
                icon={<MedicalIcon fontSize="large" color="primary" />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatsCard 
                title="Pending Consents"
                value={reportData.summary.pendingConsents || 0}
                icon={<DateRangeIcon fontSize="large" color="warning" />}
              />
            </Grid>
          </>
        );
        
      case 'checkups':
        return (
          <>
            <Grid item xs={12} sm={6} md={4}>
              <StatsCard 
                title="Checkups Completed"
                value={reportData.summary.totalRecords || 0}
                icon={<MedicalIcon fontSize="large" color="primary" />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatsCard 
                title="Completion Rate"
                value={reportData.summary.completionRate || "0%"}
                icon={<AssessmentIcon fontSize="large" color="primary" />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatsCard 
                title="Abnormal Findings"
                value={reportData.summary.abnormalFindings || 0}
                icon={<MedicalIcon fontSize="large" color="warning" />}
              />
            </Grid>
          </>
        );
        
      case 'staff_performance':
        return (
          <>
            <Grid item xs={12} sm={6} md={4}>
              <StatsCard 
                title="Medical Staff Members"
                value={reportData.summary.totalStaff || 0}
                icon={<GroupIcon fontSize="large" color="primary" />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatsCard 
                title="Cases Closed"
                value={reportData.summary.casesClosed || 0}
                icon={<AssessmentIcon fontSize="large" color="primary" />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatsCard 
                title="Avg. Response Time"
                value={reportData.summary.averageResponseTime || "N/A"}
                icon={<DateRangeIcon fontSize="large" color="primary" />}
              />
            </Grid>
          </>
        );
        
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader 
        title="Reports & Analytics"
        subtitle="Comprehensive school health data analysis and reporting"
        icon={<AssessmentIcon fontSize="large" />}
      />
      
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel id="report-type-label">Report Type</InputLabel>
              <Select
                labelId="report-type-label"
                value={reportType}
                onChange={handleReportTypeChange}
                label="Report Type"
              >
                <MenuItem value="health_incidents">Health Incidents</MenuItem>
                <MenuItem value="vaccinations">Vaccination Programs</MenuItem>
                <MenuItem value="checkups">Health Checkups</MenuItem>
                <MenuItem value="staff_performance">Staff Performance</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel id="time-period-label">Time Period</InputLabel>
              <Select
                labelId="time-period-label"
                value={reportPeriod}
                onChange={handlePeriodChange}
                label="Time Period"
              >
                <MenuItem value="week">Last 7 days</MenuItem>
                <MenuItem value="month">Last 30 days</MenuItem>
                <MenuItem value="quarter">Last Quarter</MenuItem>
                <MenuItem value="year">Current Academic Year</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {getReportTitle()}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {getReportSubtitle()}
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              {renderSummaryCards()}
            </Grid>
          </Box>
        </CardContent>
      </Card>

      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
          indicatorColor="primary"
        >
          <Tab label="Details" />
          <Tab label="Charts & Visualizations" />
          <Tab label="Export Options" />
        </Tabs>
        
        {/* Details Tab */}
        {activeTab === 0 && (
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Detailed Records</Typography>
              <Box>
                <IconButton size="small">
                  <FilterIcon />
                </IconButton>
                <IconButton size="small">
                  <SearchIcon />
                </IconButton>
              </Box>
            </Box>
            
            <DataTable 
              data={reportData.details}
              columns={getTableColumns()}
              pagination={true}
              rowsPerPage={5}
              searchable={true}
            />
          </Box>
        )}
        
        {/* Charts Tab */}
        {activeTab === 1 && (
          <Box sx={{ p: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <ChartWidget 
                  {...timelineChartData}
                  height={300}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <ChartWidget 
                  {...distributionChartData}
                  height={300}
                />
              </Grid>
            </Grid>
          </Box>
        )}
        
        {/* Export Tab */}
        {activeTab === 2 && (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Export Report</Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      <PdfIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      PDF Report
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Export complete report with charts and tables in PDF format
                    </Typography>
                    <Button 
                      variant="outlined" 
                      startIcon={<DownloadIcon />} 
                      fullWidth
                    >
                      Export PDF
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      <DownloadIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Excel/CSV Data
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Export raw data in Excel or CSV format for further analysis
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Button variant="outlined" size="small" fullWidth>Excel</Button>
                      </Grid>
                      <Grid item xs={6}>
                        <Button variant="outlined" size="small" fullWidth>CSV</Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>Additional Options</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Button 
                      variant="outlined" 
                      startIcon={<PrintIcon />}
                      fullWidth
                    >
                      Print Report
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Button
                      variant="outlined"
                      startIcon={<ShareIcon />}
                      fullWidth
                    >
                      Share Report
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Button
                      variant="outlined"
                      startIcon={<DateRangeIcon />}
                      fullWidth
                    >
                      Schedule Reports
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          This report is automatically generated based on data from FPT Junior High School Health Management System.
          Last updated: {new Date(reportData.summary.lastUpdated).toLocaleString()}
        </Typography>
      </Alert>
    </Box>
  );
};

export default ReportsAnalytics;
