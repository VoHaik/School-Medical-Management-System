import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Button,
  TextField,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Chip,
  LinearProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Tooltip,
  RadioGroup,
  Radio,
  FormLabel,
  Checkbox,
  FormGroup
} from '@mui/material';
import {
  Download as DownloadIcon,
  Schedule as ScheduleIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  CloudDownload as CloudDownloadIcon,
  Description as FileIcon,
  TableChart as TableIcon,
  PictureAsPdf as PdfIcon,
  InsertChart as ChartIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
  Info as InfoIcon,
  Storage as StorageIcon,
  Security as SecurityIcon,
  Event as EventIcon,
  People as PeopleIcon,
  LocalHospital as MedicalIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Mock data
const exportHistory = [
  {
    id: 1,
    name: 'Student Health Records Export',
    type: 'health_records',
    format: 'xlsx',
    status: 'completed',
    fileSize: '2.4 MB',
    recordCount: 450,
    requestedBy: 'Admin User',
    requestedAt: '2024-11-20 10:30:00',
    completedAt: '2024-11-20 10:32:15',
    downloadUrl: '/exports/health_records_20241120.xlsx'
  },
  {
    id: 2,
    name: 'Vaccination Report',
    type: 'vaccination',
    format: 'pdf',
    status: 'completed',
    fileSize: '1.8 MB',
    recordCount: 380,
    requestedBy: 'Medical Staff',
    requestedAt: '2024-11-19 14:15:00',
    completedAt: '2024-11-19 14:16:45',
    downloadUrl: '/exports/vaccination_report_20241119.pdf'
  },
  {
    id: 3,
    name: 'Monthly Analytics',
    type: 'analytics',
    format: 'xlsx',
    status: 'processing',
    fileSize: null,
    recordCount: null,
    requestedBy: 'Admin User',
    requestedAt: '2024-11-20 15:45:00',
    completedAt: null,
    downloadUrl: null
  },
  {
    id: 4,
    name: 'User Activity Log',
    type: 'activity_log',
    format: 'csv',
    status: 'failed',
    fileSize: null,
    recordCount: null,
    requestedBy: 'Admin User',
    requestedAt: '2024-11-18 09:20:00',
    completedAt: null,
    downloadUrl: null,
    error: 'Database connection timeout'
  }
];

const scheduledExports = [
  {
    id: 1,
    name: 'Weekly Health Summary',
    type: 'health_summary',
    format: 'pdf',
    schedule: 'Weekly (Monday 9:00 AM)',
    status: 'active',
    lastRun: '2024-11-18 09:00:00',
    nextRun: '2024-11-25 09:00:00',
    recipients: ['admin@school.edu', 'nurse@school.edu']
  },
  {
    id: 2,
    name: 'Monthly Vaccination Report',
    type: 'vaccination',
    format: 'xlsx',
    schedule: 'Monthly (1st day 10:00 AM)',
    status: 'active',
    lastRun: '2024-11-01 10:00:00',
    nextRun: '2024-12-01 10:00:00',
    recipients: ['health@school.edu']
  },
  {
    id: 3,
    name: 'Quarterly Analytics',
    type: 'analytics',
    format: 'pdf',
    schedule: 'Quarterly (1st day 15:00 PM)',
    status: 'paused',
    lastRun: '2024-10-01 15:00:00',
    nextRun: '2025-01-01 15:00:00',
    recipients: ['director@school.edu', 'admin@school.edu']
  }
];

const exportTypes = [
  {
    category: 'Student Data',
    icon: <PeopleIcon />,
    types: [
      { value: 'student_profiles', label: 'Student Profiles', description: 'Basic student information and contact details' },
      { value: 'health_records', label: 'Health Records', description: 'Complete health history and medical records' },
      { value: 'emergency_contacts', label: 'Emergency Contacts', description: 'Emergency contact information' }
    ]
  },
  {
    category: 'Medical Data',
    icon: <MedicalIcon />,
    types: [
      { value: 'vaccination', label: 'Vaccination Records', description: 'Vaccination history and status' },
      { value: 'medication', label: 'Medication Data', description: 'Medication administration and inventory' },
      { value: 'checkups', label: 'Health Checkups', description: 'Health screening and checkup results' },
      { value: 'medical_events', label: 'Medical Events', description: 'Incidents and medical events' }
    ]
  },
  {
    category: 'System Data',
    icon: <AssessmentIcon />,
    types: [
      { value: 'user_activity', label: 'User Activity Log', description: 'System usage and activity logs' },
      { value: 'analytics', label: 'System Analytics', description: 'Usage statistics and performance metrics' },
      { value: 'audit_trail', label: 'Audit Trail', description: 'Complete audit trail of system changes' }
    ]
  }
];

const exportFormats = [
  { value: 'xlsx', label: 'Excel (.xlsx)', icon: <TableIcon />, description: 'Spreadsheet format for data analysis' },
  { value: 'csv', label: 'CSV (.csv)', icon: <FileIcon />, description: 'Comma-separated values for data import' },
  { value: 'pdf', label: 'PDF (.pdf)', icon: <PdfIcon />, description: 'Formatted report for sharing' },
  { value: 'json', label: 'JSON (.json)', icon: <FileIcon />, description: 'Structured data format for systems' }
];

// Validation schema
const exportSchema = yup.object().shape({
  exportType: yup.string().required('Export type is required'),
  format: yup.string().required('Format is required'),
  dateRange: yup.string().required('Date range is required'),
  includeFields: yup.array().min(1, 'At least one field must be selected')
});

const scheduleSchema = yup.object().shape({
  name: yup.string().required('Schedule name is required'),
  exportType: yup.string().required('Export type is required'),
  format: yup.string().required('Format is required'),
  schedule: yup.string().required('Schedule is required'),
  recipients: yup.array().min(1, 'At least one recipient is required')
});

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const DataExport = () => {
  const [tabValue, setTabValue] = useState(0);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [selectedExportType, setSelectedExportType] = useState('');
  const [selectedFields, setSelectedFields] = useState([]);

  const { control, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm({
    resolver: yupResolver(exportSchema),
    defaultValues: {
      exportType: '',
      format: 'xlsx',
      dateRange: 'last_30_days',
      includeFields: []
    }
  });

  const { control: scheduleControl, handleSubmit: scheduleHandleSubmit, formState: { errors: scheduleErrors }, reset: scheduleReset } = useForm({
    resolver: yupResolver(scheduleSchema),
    defaultValues: {
      name: '',
      exportType: '',
      format: 'xlsx',
      schedule: 'weekly',
      recipients: []
    }
  });

  const watchedExportType = watch('exportType');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleExportRequest = () => {
    setExportDialogOpen(true);
  };

  const handleScheduleExport = () => {
    setScheduleDialogOpen(true);
  };

  const onExportSubmit = (data) => {
    console.log('Export requested:', data);
    setExportDialogOpen(false);
    reset();
  };

  const onScheduleSubmit = (data) => {
    console.log('Schedule created:', data);
    setScheduleDialogOpen(false);
    scheduleReset();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'processing': return 'warning';
      case 'failed': return 'error';
      case 'active': return 'success';
      case 'paused': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckIcon />;
      case 'processing': return <PendingIcon />;
      case 'failed': return <ErrorIcon />;
      case 'active': return <CheckIcon />;
      case 'paused': return <PendingIcon />;
      default: return <InfoIcon />;
    }
  };

  const getAvailableFields = (exportType) => {
    const fieldMap = {
      'student_profiles': ['Name', 'Grade', 'Date of Birth', 'Address', 'Phone', 'Email'],
      'health_records': ['Medical History', 'Allergies', 'Chronic Conditions', 'Current Medications', 'BMI', 'Blood Type'],
      'vaccination': ['Vaccine Name', 'Date Administered', 'Dose', 'Administrator', 'Batch Number', 'Expiry Date'],
      'medication': ['Medication Name', 'Dosage', 'Administration Time', 'Administrator', 'Notes'],
      'checkups': ['Date', 'Height', 'Weight', 'BMI', 'Vision', 'Hearing', 'Notes'],
      'medical_events': ['Date', 'Type', 'Description', 'Action Taken', 'Follow-up Required'],
      'user_activity': ['User', 'Action', 'Timestamp', 'IP Address', 'Device'],
      'analytics': ['Date', 'Active Users', 'System Performance', 'Error Count'],
      'audit_trail': ['User', 'Action', 'Timestamp', 'Changes Made', 'Reason']
    };
    return fieldMap[exportType] || [];
  };

  return (
    <Box className="p-6">
      <Typography variant="h4" gutterBottom className="text-blue-600 font-bold">
        Data Export & Backup
      </Typography>

      <Card>
        <CardContent>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="data export tabs">
            <Tab 
              label="Quick Export" 
              icon={<DownloadIcon />} 
              iconPosition="start"
            />
            <Tab 
              label="Scheduled Exports" 
              icon={<ScheduleIcon />} 
              iconPosition="start"
            />
            <Tab 
              label="Export History" 
              icon={<HistoryIcon />} 
              iconPosition="start"
            />
            <Tab 
              label="Settings" 
              icon={<SettingsIcon />} 
              iconPosition="start"
            />
          </Tabs>

          {/* Quick Export Tab */}
          <TabPanel value={tabValue} index={0}>
            <Box className="mb-4 flex justify-between items-center">
              <Typography variant="h6">Quick Data Export</Typography>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={handleExportRequest}
                className="bg-blue-600 hover:bg-blue-700"
              >
                New Export
              </Button>
            </Box>

            <Grid container spacing={3}>
              {exportTypes.map((category) => (
                <Grid item xs={12} key={category.category}>
                  <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box className="flex items-center">
                        {category.icon}
                        <Typography variant="h6" className="ml-2">{category.category}</Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        {category.types.map((type) => (
                          <Grid item xs={12} md={6} key={type.value}>
                            <Card variant="outlined" className="h-full">
                              <CardContent>
                                <Typography variant="subtitle1" gutterBottom>{type.label}</Typography>
                                <Typography variant="body2" color="textSecondary" className="mb-3">
                                  {type.description}
                                </Typography>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  startIcon={<DownloadIcon />}
                                  onClick={() => {
                                    setValue('exportType', type.value);
                                    setExportDialogOpen(true);
                                  }}
                                >
                                  Export
                                </Button>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          {/* Scheduled Exports Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box className="mb-4 flex justify-between items-center">
              <Typography variant="h6">Scheduled Exports</Typography>
              <Button
                variant="contained"
                startIcon={<ScheduleIcon />}
                onClick={handleScheduleExport}
                className="bg-green-600 hover:bg-green-700"
              >
                New Schedule
              </Button>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Schedule Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Format</TableCell>
                    <TableCell>Schedule</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Last Run</TableCell>
                    <TableCell>Next Run</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {scheduledExports.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell>
                        <Typography variant="subtitle2">{schedule.name}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          Recipients: {schedule.recipients.length}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={schedule.type}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={schedule.format.toUpperCase()}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{schedule.schedule}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={schedule.status}
                          color={getStatusColor(schedule.status)}
                          icon={getStatusIcon(schedule.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{schedule.lastRun}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{schedule.nextRun}</Typography>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Edit Schedule">
                          <IconButton size="small">
                            <SettingsIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Run Now">
                          <IconButton size="small" color="primary">
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* Export History Tab */}
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>Export History</Typography>
            
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Export Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Format</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Records</TableCell>
                    <TableCell>File Size</TableCell>
                    <TableCell>Requested By</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {exportHistory.map((export_item) => (
                    <TableRow key={export_item.id}>
                      <TableCell>
                        <Typography variant="subtitle2">{export_item.name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={export_item.type}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={export_item.format.toUpperCase()}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={export_item.status}
                          color={getStatusColor(export_item.status)}
                          icon={getStatusIcon(export_item.status)}
                          size="small"
                        />
                        {export_item.error && (
                          <Typography variant="caption" color="error" display="block">
                            {export_item.error}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {export_item.recordCount || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {export_item.fileSize || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{export_item.requestedBy}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{export_item.requestedAt}</Typography>
                        {export_item.completedAt && (
                          <Typography variant="caption" color="textSecondary" display="block">
                            Completed: {export_item.completedAt}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {export_item.downloadUrl && (
                          <Tooltip title="Download">
                            <IconButton size="small" color="primary">
                              <CloudDownloadIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* Settings Tab */}
          <TabPanel value={tabValue} index={3}>
            <Typography variant="h6" gutterBottom>Export Settings</Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom className="flex items-center">
                      <StorageIcon className="mr-2" />
                      Storage Settings
                    </Typography>
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Auto-delete exports after 30 days"
                    />
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Compress large exports"
                    />
                    <FormControlLabel
                      control={<Switch />}
                      label="Cloud backup for exports"
                    />
                    <TextField
                      fullWidth
                      label="Maximum file size (MB)"
                      type="number"
                      defaultValue="100"
                      className="mt-3"
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom className="flex items-center">
                      <SecurityIcon className="mr-2" />
                      Security Settings
                    </Typography>
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Encrypt sensitive exports"
                    />
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="Require approval for large exports"
                    />
                    <FormControlLabel
                      control={<Switch />}
                      label="Audit all export activities"
                    />
                    <TextField
                      fullWidth
                      label="Export retention period (days)"
                      type="number"
                      defaultValue="90"
                      className="mt-3"
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
        </CardContent>
      </Card>

      {/* Export Request Dialog */}
      <Dialog 
        open={exportDialogOpen} 
        onClose={() => setExportDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create Data Export</DialogTitle>
        <form onSubmit={handleSubmit(onExportSubmit)}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Controller
                  name="exportType"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.exportType}>
                      <InputLabel>Export Type</InputLabel>
                      <Select {...field} label="Export Type">
                        {exportTypes.map((category) =>
                          category.types.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                              {type.label}
                            </MenuItem>
                          ))
                        )}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="format"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.format}>
                      <InputLabel>Format</InputLabel>
                      <Select {...field} label="Format">
                        {exportFormats.map((format) => (
                          <MenuItem key={format.value} value={format.value}>
                            <Box className="flex items-center">
                              {format.icon}
                              <span className="ml-2">{format.label}</span>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="dateRange"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Date Range</InputLabel>
                      <Select {...field} label="Date Range">
                        <MenuItem value="last_7_days">Last 7 days</MenuItem>
                        <MenuItem value="last_30_days">Last 30 days</MenuItem>
                        <MenuItem value="last_90_days">Last 90 days</MenuItem>
                        <MenuItem value="current_year">Current year</MenuItem>
                        <MenuItem value="all_time">All time</MenuItem>
                        <MenuItem value="custom">Custom range</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              {watchedExportType && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Select Fields to Include:
                  </Typography>
                  <Controller
                    name="includeFields"
                    control={control}
                    render={({ field }) => (
                      <FormGroup>
                        {getAvailableFields(watchedExportType).map((fieldName) => (
                          <FormControlLabel
                            key={fieldName}
                            control={
                              <Checkbox
                                checked={field.value.includes(fieldName)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    field.onChange([...field.value, fieldName]);
                                  } else {
                                    field.onChange(field.value.filter(f => f !== fieldName));
                                  }
                                }}
                              />
                            }
                            label={fieldName}
                          />
                        ))}
                      </FormGroup>
                    )}
                  />
                  {errors.includeFields && (
                    <Typography variant="caption" color="error">
                      {errors.includeFields.message}
                    </Typography>
                  )}
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setExportDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Start Export
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Schedule Export Dialog */}
      <Dialog 
        open={scheduleDialogOpen} 
        onClose={() => setScheduleDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Schedule Automatic Export</DialogTitle>
        <form onSubmit={scheduleHandleSubmit(onScheduleSubmit)}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Controller
                  name="name"
                  control={scheduleControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Schedule Name"
                      error={!!scheduleErrors.name}
                      helperText={scheduleErrors.name?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="exportType"
                  control={scheduleControl}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!scheduleErrors.exportType}>
                      <InputLabel>Export Type</InputLabel>
                      <Select {...field} label="Export Type">
                        {exportTypes.map((category) =>
                          category.types.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                              {type.label}
                            </MenuItem>
                          ))
                        )}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="format"
                  control={scheduleControl}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!scheduleErrors.format}>
                      <InputLabel>Format</InputLabel>
                      <Select {...field} label="Format">
                        {exportFormats.map((format) => (
                          <MenuItem key={format.value} value={format.value}>
                            {format.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="schedule"
                  control={scheduleControl}
                  render={({ field }) => (
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Schedule Frequency</FormLabel>
                      <RadioGroup {...field} row>
                        <FormControlLabel value="daily" control={<Radio />} label="Daily" />
                        <FormControlLabel value="weekly" control={<Radio />} label="Weekly" />
                        <FormControlLabel value="monthly" control={<Radio />} label="Monthly" />
                        <FormControlLabel value="quarterly" control={<Radio />} label="Quarterly" />
                      </RadioGroup>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="recipients"
                  control={scheduleControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Email Recipients (comma-separated)"
                      placeholder="admin@school.edu, nurse@school.edu"
                      error={!!scheduleErrors.recipients}
                      helperText={scheduleErrors.recipients?.message || "Enter email addresses separated by commas"}
                      onChange={(e) => {
                        const emails = e.target.value.split(',').map(email => email.trim()).filter(email => email);
                        field.onChange(emails);
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setScheduleDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Create Schedule
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default DataExport;