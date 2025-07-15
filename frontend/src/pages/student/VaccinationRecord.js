import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Tab,
  Tabs,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import {
  VaccinesOutlined,
  ExpandMore,
  Download,
  Print,
  Share,
  Warning,
  CheckCircle,
  Schedule,
  Info,
  Close
} from '@mui/icons-material';
import { format, parseISO, differenceInDays } from 'date-fns';

// Mock data for vaccination records
const mockVaccinationData = {
  student: {
    id: 'STU-2024-001',
    name: 'John Smith',
    grade: 'Grade 10',
    birthDate: '2008-03-15',
    avatar: null
  },
  summary: {
    totalRequired: 12,
    completed: 10,
    overdue: 1,
    upcoming: 3,
    complianceRate: 83
  },
  vaccinationSchedule: [
    {
      id: 1,
      vaccine: 'Hepatitis B',
      doses: [
        { doseNumber: 1, date: '2008-03-16', status: 'completed', provider: 'City Health Center' },
        { doseNumber: 2, date: '2008-05-15', status: 'completed', provider: 'City Health Center' },
        { doseNumber: 3, date: '2008-09-15', status: 'completed', provider: 'City Health Center' }
      ],
      nextDue: null,
      category: 'routine'
    },
    {
      id: 2,
      vaccine: 'DTaP (Diphtheria, Tetanus, Pertussis)',
      doses: [
        { doseNumber: 1, date: '2008-05-15', status: 'completed', provider: 'Pediatric Clinic' },
        { doseNumber: 2, date: '2008-07-15', status: 'completed', provider: 'Pediatric Clinic' },
        { doseNumber: 3, date: '2008-09-15', status: 'completed', provider: 'Pediatric Clinic' },
        { doseNumber: 4, date: '2009-03-15', status: 'completed', provider: 'Pediatric Clinic' },
        { doseNumber: 5, date: '2013-03-15', status: 'completed', provider: 'School Health Clinic' }
      ],
      nextDue: null,
      category: 'routine'
    },
    {
      id: 3,
      vaccine: 'Polio (IPV)',
      doses: [
        { doseNumber: 1, date: '2008-05-15', status: 'completed', provider: 'City Health Center' },
        { doseNumber: 2, date: '2008-07-15', status: 'completed', provider: 'City Health Center' },
        { doseNumber: 3, date: '2008-09-15', status: 'completed', provider: 'City Health Center' },
        { doseNumber: 4, date: '2013-03-15', status: 'completed', provider: 'School Health Clinic' }
      ],
      nextDue: null,
      category: 'routine'
    },
    {
      id: 4,
      vaccine: 'MMR (Measles, Mumps, Rubella)',
      doses: [
        { doseNumber: 1, date: '2009-03-15', status: 'completed', provider: 'Pediatric Clinic' },
        { doseNumber: 2, date: '2013-03-15', status: 'completed', provider: 'School Health Clinic' }
      ],
      nextDue: null,
      category: 'routine'
    },
    {
      id: 5,
      vaccine: 'HPV (Human Papillomavirus)',
      doses: [
        { doseNumber: 1, date: '2023-09-15', status: 'completed', provider: 'School Health Clinic' },
        { doseNumber: 2, date: '2024-03-15', status: 'overdue', provider: 'School Health Clinic' }
      ],
      nextDue: '2024-03-15',
      category: 'adolescent'
    },
    {
      id: 6,
      vaccine: 'Tdap (Tetanus, Diphtheria, Pertussis Booster)',
      doses: [
        { doseNumber: 1, date: null, status: 'scheduled', provider: 'School Health Clinic' }
      ],
      nextDue: '2024-07-15',
      category: 'adolescent'
    },
    {
      id: 7,
      vaccine: 'Meningococcal',
      doses: [
        { doseNumber: 1, date: null, status: 'scheduled', provider: 'School Health Clinic' }
      ],
      nextDue: '2024-08-15',
      category: 'adolescent'
    }
  ],
  exemptions: [
    {
      id: 1,
      vaccine: 'Influenza',
      type: 'Medical',
      reason: 'Severe egg allergy',
      expiryDate: '2025-12-31',
      providedBy: 'Dr. Sarah Johnson'
    }
  ],
  campaigns: [
    {
      id: 1,
      name: 'Fall 2024 Flu Campaign',
      vaccine: 'Influenza',
      date: '2024-10-15',
      status: 'exempt',
      location: 'School Gymnasium'
    },
    {
      id: 2,
      name: 'HPV Catch-up Campaign',
      vaccine: 'HPV',
      date: '2024-06-20',
      status: 'eligible',
      location: 'School Health Clinic'
    }
  ]
};

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vaccination-tabpanel-${index}`}
      aria-labelledby={`vaccination-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const VaccinationRecord = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [data, setData] = useState(mockVaccinationData);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'overdue':
        return 'error';
      case 'scheduled':
        return 'warning';
      case 'exempt':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle />;
      case 'overdue':
        return <Warning />;
      case 'scheduled':
        return <Schedule />;
      default:
        return <Info />;
    }
  };

  const getDaysUntilDue = (dueDate) => {
    if (!dueDate) return null;
    return differenceInDays(parseISO(dueDate), new Date());
  };

  const handleViewDetails = (vaccine) => {
    setSelectedVaccine(vaccine);
    setDetailsOpen(true);
  };

  const handleDownloadRecord = () => {
    // Implement download functionality
    };

  const handlePrintRecord = () => {
    window.print();
  };

  const handleShareRecord = () => {
    // Implement share functionality
    };

  return (
    <Box className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <Box className="mb-6">
        <Box className="flex items-center justify-between mb-4">
          <Box className="flex items-center gap-3">
            <VaccinesOutlined className="text-blue-600" sx={{ fontSize: 32 }} />
            <Typography variant="h4" className="font-bold text-gray-800">
              Vaccination Record
            </Typography>
          </Box>
          <Box className="flex gap-2">
            <Tooltip title="Download Record">
              <IconButton onClick={handleDownloadRecord} className="text-blue-600">
                <Download />
              </IconButton>
            </Tooltip>
            <Tooltip title="Print Record">
              <IconButton onClick={handlePrintRecord} className="text-green-600">
                <Print />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share Record">
              <IconButton onClick={handleShareRecord} className="text-purple-600">
                <Share />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Student Info Card */}
        <Card className="mb-6">
          <CardContent>
            <Box className="flex items-center gap-4">
              <Avatar
                sx={{ width: 80, height: 80 }}
                className="bg-blue-500"
              >
                {data.student.name.split(' ').map(n => n[0]).join('')}
              </Avatar>
              <Box className="flex-1">
                <Typography variant="h5" className="font-semibold mb-1">
                  {data.student.name}
                </Typography>
                <Typography variant="body1" className="text-gray-600 mb-2">
                  {data.student.grade} • Born: {format(parseISO(data.student.birthDate), 'MMMM dd, yyyy')}
                </Typography>
                <Box className="flex gap-3">
                  <Chip
                    label={`${data.summary.completed}/${data.summary.totalRequired} Completed`}
                    color="success"
                    size="small"
                  />
                  <Chip
                    label={`${data.summary.complianceRate}% Compliance`}
                    color={data.summary.complianceRate >= 90 ? 'success' : 'warning'}
                    size="small"
                  />
                  {data.summary.overdue > 0 && (
                    <Chip
                      label={`${data.summary.overdue} Overdue`}
                      color="error"
                      size="small"
                    />
                  )}
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Vaccination Schedule" />
          <Tab label="Compliance Status" />
          <Tab label="Exemptions" />
          <Tab label="Campaigns" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={3}>
          {data.vaccinationSchedule.map((vaccine) => {
            const completedDoses = vaccine.doses.filter(d => d.status === 'completed').length;
            const totalDoses = vaccine.doses.length;
            const hasOverdue = vaccine.doses.some(d => d.status === 'overdue');
            const daysUntilDue = getDaysUntilDue(vaccine.nextDue);

            return (
              <Grid item xs={12} key={vaccine.id}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box className="flex items-center justify-between w-full mr-4">
                      <Box className="flex items-center gap-3">
                        <Typography variant="h6" className="font-semibold">
                          {vaccine.vaccine}
                        </Typography>
                        <Chip
                          label={vaccine.category}
                          size="small"
                          variant="outlined"
                          className="capitalize"
                        />
                      </Box>
                      <Box className="flex items-center gap-3">
                        <Typography variant="body2" className="text-gray-600">
                          {completedDoses}/{totalDoses} doses
                        </Typography>
                        {hasOverdue && (
                          <Chip
                            icon={<Warning />}
                            label="Overdue"
                            color="error"
                            size="small"
                          />
                        )}
                        {vaccine.nextDue && !hasOverdue && (
                          <Chip
                            label={`Due in ${daysUntilDue} days`}
                            color={daysUntilDue <= 30 ? 'warning' : 'info'}
                            size="small"
                          />
                        )}
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box className="space-y-4">
                      <LinearProgress
                        variant="determinate"
                        value={(completedDoses / totalDoses) * 100}
                        className="h-2 rounded"
                      />
                      
                      <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Dose</TableCell>
                              <TableCell>Date</TableCell>
                              <TableCell>Status</TableCell>
                              <TableCell>Provider</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {vaccine.doses.map((dose, index) => (
                              <TableRow key={index}>
                                <TableCell>Dose {dose.doseNumber}</TableCell>
                                <TableCell>
                                  {dose.date ? format(parseISO(dose.date), 'MMM dd, yyyy') : 'Not scheduled'}
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    icon={getStatusIcon(dose.status)}
                                    label={dose.status.charAt(0).toUpperCase() + dose.status.slice(1)}
                                    color={getStatusColor(dose.status)}
                                    size="small"
                                  />
                                </TableCell>
                                <TableCell>{dose.provider}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>

                      <Button
                        variant="outlined"
                        onClick={() => handleViewDetails(vaccine)}
                        size="small"
                      >
                        View Full Details
                      </Button>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            );
          })}
        </Grid>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="mb-4">Compliance Overview</Typography>
                <Box className="space-y-4">
                  <Box>
                    <Box className="flex justify-between mb-2">
                      <Typography>Overall Compliance</Typography>
                      <Typography className="font-semibold">{data.summary.complianceRate}%</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={data.summary.complianceRate}
                      className="h-3 rounded"
                      color={data.summary.complianceRate >= 90 ? 'success' : 'warning'}
                    />
                  </Box>
                  
                  <Divider />
                  
                  <Box className="grid grid-cols-2 gap-4">
                    <Box className="text-center">
                      <Typography variant="h4" className="font-bold text-green-600">
                        {data.summary.completed}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        Completed
                      </Typography>
                    </Box>
                    <Box className="text-center">
                      <Typography variant="h4" className="font-bold text-orange-600">
                        {data.summary.upcoming}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        Upcoming
                      </Typography>
                    </Box>
                  </Box>

                  {data.summary.overdue > 0 && (
                    <Alert severity="warning" className="mt-4">
                      You have {data.summary.overdue} overdue vaccination(s). Please schedule them as soon as possible.
                    </Alert>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="mb-4">Upcoming Vaccinations</Typography>
                <Box className="space-y-3">
                  {data.vaccinationSchedule
                    .filter(v => v.nextDue)
                    .sort((a, b) => new Date(a.nextDue) - new Date(b.nextDue))
                    .map((vaccine) => {
                      const daysUntilDue = getDaysUntilDue(vaccine.nextDue);
                      const isOverdue = daysUntilDue < 0;
                      
                      return (
                        <Box key={vaccine.id} className="p-3 border rounded-lg">
                          <Box className="flex justify-between items-start">
                            <Box>
                              <Typography variant="subtitle2" className="font-semibold">
                                {vaccine.vaccine}
                              </Typography>
                              <Typography variant="body2" className="text-gray-600">
                                Due: {format(parseISO(vaccine.nextDue), 'MMM dd, yyyy')}
                              </Typography>
                            </Box>
                            <Chip
                              label={isOverdue ? `${Math.abs(daysUntilDue)} days overdue` : `${daysUntilDue} days`}
                              color={isOverdue ? 'error' : daysUntilDue <= 30 ? 'warning' : 'info'}
                              size="small"
                            />
                          </Box>
                        </Box>
                      );
                    })}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <Card>
          <CardContent>
            <Typography variant="h6" className="mb-4">Medical Exemptions</Typography>
            {data.exemptions.length > 0 ? (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Vaccine</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Reason</TableCell>
                      <TableCell>Expires</TableCell>
                      <TableCell>Provided By</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.exemptions.map((exemption) => (
                      <TableRow key={exemption.id}>
                        <TableCell>{exemption.vaccine}</TableCell>
                        <TableCell>
                          <Chip label={exemption.type} color="info" size="small" />
                        </TableCell>
                        <TableCell>{exemption.reason}</TableCell>
                        <TableCell>
                          {format(parseISO(exemption.expiryDate), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>{exemption.providedBy}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="info">
                No vaccination exemptions on record.
              </Alert>
            )}
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={activeTab} index={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" className="mb-4">School Vaccination Campaigns</Typography>
            <Grid container spacing={3}>
              {data.campaigns.map((campaign) => (
                <Grid item xs={12} md={6} key={campaign.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box className="flex justify-between items-start mb-2">
                        <Typography variant="subtitle1" className="font-semibold">
                          {campaign.name}
                        </Typography>
                        <Chip
                          label={campaign.status}
                          color={getStatusColor(campaign.status)}
                          size="small"
                        />
                      </Box>
                      <Typography variant="body2" className="text-gray-600 mb-2">
                        Vaccine: {campaign.vaccine}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600 mb-2">
                        Date: {format(parseISO(campaign.date), 'MMM dd, yyyy')}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        Location: {campaign.location}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Vaccine Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box className="flex justify-between items-center">
            <Typography variant="h6">
              {selectedVaccine?.vaccine} - Detailed Information
            </Typography>
            <IconButton onClick={() => setDetailsOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedVaccine && (
            <Box className="space-y-4">
              <Typography variant="body1">
                <strong>Category:</strong> {selectedVaccine.category}
              </Typography>
              <Typography variant="body1">
                <strong>Total Doses Required:</strong> {selectedVaccine.doses.length}
              </Typography>
              <Typography variant="body1">
                <strong>Completed Doses:</strong> {selectedVaccine.doses.filter(d => d.status === 'completed').length}
              </Typography>
              {selectedVaccine.nextDue && (
                <Typography variant="body1">
                  <strong>Next Due:</strong> {format(parseISO(selectedVaccine.nextDue), 'MMMM dd, yyyy')}
                </Typography>
              )}
              
              <Typography variant="h6" className="mt-4">Dose History</Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Dose</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Provider</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedVaccine.doses.map((dose, index) => (
                      <TableRow key={index}>
                        <TableCell>Dose {dose.doseNumber}</TableCell>
                        <TableCell>
                          {dose.date ? format(parseISO(dose.date), 'MMM dd, yyyy') : 'Not scheduled'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(dose.status)}
                            label={dose.status.charAt(0).toUpperCase() + dose.status.slice(1)}
                            color={getStatusColor(dose.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{dose.provider}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VaccinationRecord;
