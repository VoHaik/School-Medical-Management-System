import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Typography,
  Grid,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tab,
  Tabs,
  Badge,
  Tooltip,
  Autocomplete
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Medication as MedicationIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  Inventory as InventoryIcon,
  LocalPharmacy as PharmacyIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import PageHeader from '../../components/PageHeader';

const medicationSchema = yup.object().shape({
  medicationName: yup.string().required('Medication name is required'),
  genericName: yup.string(),
  dosage: yup.string().required('Dosage is required'),
  form: yup.string().required('Medication form is required'),
  manufacturer: yup.string(),
  batchNumber: yup.string(),
  expiryDate: yup.date().required('Expiry date is required').min(new Date(), 'Expiry date must be in the future'),
  quantity: yup.number().required('Quantity is required').min(1, 'Quantity must be at least 1'),
  unitCost: yup.number().min(0, 'Unit cost must be positive'),
  storageLocation: yup.string(),
  prescriptionRequired: yup.boolean(),
  contraindications: yup.array().of(yup.string()),
  sideEffects: yup.array().of(yup.string()),
  instructions: yup.string()
});

const administrationSchema = yup.object().shape({
  studentId: yup.string().required('Student is required'),
  medicationId: yup.string().required('Medication is required'),
  dosage: yup.string().required('Dosage is required'),
  frequency: yup.string().required('Frequency is required'),
  startDate: yup.date().required('Start date is required'),
  endDate: yup.date().required('End date is required'),
  administrationTime: yup.array().of(yup.string()).min(1, 'At least one administration time is required'),
  instructions: yup.string(),
  prescribedBy: yup.string().required('Prescribing doctor is required'),
  consentGiven: yup.boolean().oneOf([true], 'Parent consent is required')
});

function MedicationManagement() {
  const [activeTab, setActiveTab] = useState(0);
  const [medicationDialogOpen, setMedicationDialogOpen] = useState(false);
  const [administrationDialogOpen, setAdministrationDialogOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [selectedAdministration, setSelectedAdministration] = useState(null);
  const [medications, setMedications] = useState([]);
  const [administrations, setAdministrations] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [lowStockAlerts, setLowStockAlerts] = useState([]);

  const medicationForm = useForm({
    resolver: yupResolver(medicationSchema),
    defaultValues: {
      contraindications: [],
      sideEffects: [],
      prescriptionRequired: false
    }
  });

  const administrationForm = useForm({
    resolver: yupResolver(administrationSchema),
    defaultValues: {
      administrationTime: [],
      consentGiven: false
    }
  });

  useEffect(() => {
    fetchMedications();
    fetchAdministrations();
    fetchStudents();
    checkLowStock();
  }, []);

  const fetchMedications = async () => {
    try {
      // Mock data - replace with actual API call
      setMedications([
        {
          id: '1',
          medicationName: 'Paracetamol',
          genericName: 'Acetaminophen',
          dosage: '500mg',
          form: 'Tablet',
          manufacturer: 'Pharma Co.',
          batchNumber: 'PC001',
          expiryDate: '2025-12-31',
          quantity: 100,
          unitCost: 0.50,
          storageLocation: 'Cabinet A1',
          prescriptionRequired: false,
          contraindications: ['Liver disease'],
          sideEffects: ['Nausea', 'Skin rash'],
          instructions: 'Take with food'
        }
      ]);
    } catch (error) {
      console.error('Error fetching medications:', error);
    }
  };

  const fetchAdministrations = async () => {
    try {
      // Mock data - replace with actual API call
      setAdministrations([
        {
          id: '1',
          studentId: 'S001',
          studentName: 'John Doe',
          medicationId: '1',
          medicationName: 'Paracetamol',
          dosage: '250mg',
          frequency: 'Twice daily',
          startDate: '2024-01-15',
          endDate: '2024-01-22',
          administrationTime: ['08:00', '20:00'],
          instructions: 'Take with meals',
          prescribedBy: 'Dr. Smith',
          consentGiven: true,
          status: 'active'
        }
      ]);
    } catch (error) {
      console.error('Error fetching administrations:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      // Mock data - replace with actual API call
      setStudents([
        { id: 'S001', name: 'John Doe', class: '10A' },
        { id: 'S002', name: 'Jane Smith', class: '9B' }
      ]);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const checkLowStock = () => {
    const alerts = medications.filter(med => med.quantity < 20);
    setLowStockAlerts(alerts);
  };

  const handleAddMedication = () => {
    setSelectedMedication(null);
    medicationForm.reset();
    setMedicationDialogOpen(true);
  };

  const handleEditMedication = (medication) => {
    setSelectedMedication(medication);
    medicationForm.reset(medication);
    setMedicationDialogOpen(true);
  };

  const handleAddAdministration = () => {
    setSelectedAdministration(null);
    administrationForm.reset();
    setAdministrationDialogOpen(true);
  };

  const handleEditAdministration = (administration) => {
    setSelectedAdministration(administration);
    administrationForm.reset(administration);
    setAdministrationDialogOpen(true);
  };

  const onMedicationSubmit = async (data) => {
    try {
      if (selectedMedication) {
        // Update existing medication
        console.log('Updating medication:', data);
      } else {
        // Add new medication
        console.log('Adding medication:', data);
      }
      setMedicationDialogOpen(false);
      fetchMedications();
    } catch (error) {
      console.error('Error saving medication:', error);
    }
  };

  const onAdministrationSubmit = async (data) => {
    try {
      if (selectedAdministration) {
        // Update existing administration
        console.log('Updating administration:', data);
      } else {
        // Add new administration
        console.log('Adding administration:', data);
      }
      setAdministrationDialogOpen(false);
      fetchAdministrations();
    } catch (error) {
      console.error('Error saving administration:', error);
    }
  };

  const filteredMedications = medications.filter(med =>
    med.medicationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.genericName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAdministrations = administrations.filter(admin => {
    const matchesSearch = admin.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.medicationName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || admin.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'completed': return 'primary';
      case 'discontinued': return 'error';
      default: return 'default';
    }
  };

  return (
    <div className="p-6">
      <PageHeader
        title="Medication Management"
        subtitle="Manage school medications and student administrations"
        icon={<MedicationIcon />}
      />

      {/* Low Stock Alerts */}
      {lowStockAlerts.length > 0 && (
        <Alert severity="warning" className="mb-4">
          <Typography variant="h6">Low Stock Alert</Typography>
          <Typography>
            {lowStockAlerts.length} medication(s) are running low: {' '}
            {lowStockAlerts.map(med => med.medicationName).join(', ')}
          </Typography>
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent className="text-center">
              <InventoryIcon className="text-4xl text-blue-500 mb-2" />
              <Typography variant="h4">{medications.length}</Typography>
              <Typography color="textSecondary">Total Medications</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent className="text-center">
              <ScheduleIcon className="text-4xl text-green-500 mb-2" />
              <Typography variant="h4">{administrations.filter(a => a.status === 'active').length}</Typography>
              <Typography color="textSecondary">Active Administrations</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent className="text-center">
              <WarningIcon className="text-4xl text-orange-500 mb-2" />
              <Typography variant="h4">{lowStockAlerts.length}</Typography>
              <Typography color="textSecondary">Low Stock Alerts</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent className="text-center">
              <PharmacyIcon className="text-4xl text-purple-500 mb-2" />
              <Typography variant="h4">{medications.filter(m => m.prescriptionRequired).length}</Typography>
              <Typography color="textSecondary">Prescription Required</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label="Medication Inventory" />
            <Tab label="Student Administrations" />
            <Tab label="Reports" />
          </Tabs>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <Box className="flex gap-4 mb-4">
            <TextField
              placeholder="Search medications or students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon className="mr-2 text-gray-500" />
              }}
              className="flex-1"
            />
            {activeTab === 1 && (
              <FormControl className="min-w-32">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  label="Status"
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="discontinued">Discontinued</MenuItem>
                </Select>
              </FormControl>
            )}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={activeTab === 0 ? handleAddMedication : handleAddAdministration}
            >
              {activeTab === 0 ? 'Add Medication' : 'Add Administration'}
            </Button>
          </Box>

          {/* Tab Content */}
          {activeTab === 0 && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Medication</TableCell>
                    <TableCell>Dosage</TableCell>
                    <TableCell>Form</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Expiry Date</TableCell>
                    <TableCell>Storage</TableCell>
                    <TableCell>Prescription</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredMedications.map((medication) => (
                    <TableRow key={medication.id}>
                      <TableCell>
                        <div>
                          <Typography variant="subtitle2">{medication.medicationName}</Typography>
                          {medication.genericName && (
                            <Typography variant="caption" color="textSecondary">
                              ({medication.genericName})
                            </Typography>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{medication.dosage}</TableCell>
                      <TableCell>{medication.form}</TableCell>
                      <TableCell>
                        <Badge
                          badgeContent={medication.quantity < 20 ? '!' : null}
                          color="error"
                        >
                          {medication.quantity}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(medication.expiryDate).toLocaleDateString()}</TableCell>
                      <TableCell>{medication.storageLocation}</TableCell>
                      <TableCell>
                        <Chip
                          label={medication.prescriptionRequired ? 'Required' : 'Not Required'}
                          color={medication.prescriptionRequired ? 'error' : 'success'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Edit">
                          <IconButton onClick={() => handleEditMedication(medication)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {activeTab === 1 && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student</TableCell>
                    <TableCell>Medication</TableCell>
                    <TableCell>Dosage</TableCell>
                    <TableCell>Frequency</TableCell>
                    <TableCell>Period</TableCell>
                    <TableCell>Times</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAdministrations.map((administration) => (
                    <TableRow key={administration.id}>
                      <TableCell>
                        <Typography variant="subtitle2">{administration.studentName}</Typography>
                      </TableCell>
                      <TableCell>{administration.medicationName}</TableCell>
                      <TableCell>{administration.dosage}</TableCell>
                      <TableCell>{administration.frequency}</TableCell>
                      <TableCell>
                        {new Date(administration.startDate).toLocaleDateString()} - {' '}
                        {new Date(administration.endDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {administration.administrationTime.map((time, index) => (
                          <Chip key={index} label={time} size="small" className="mr-1" />
                        ))}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={administration.status}
                          color={getStatusColor(administration.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Edit">
                          <IconButton onClick={() => handleEditAdministration(administration)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {activeTab === 2 && (
            <div className="text-center py-8">
              <AssignmentIcon className="text-6xl text-gray-400 mb-4" />
              <Typography variant="h6" color="textSecondary">
                Medication Reports
              </Typography>
              <Typography color="textSecondary" className="mb-4">
                Generate comprehensive reports on medication usage, inventory, and administration records.
              </Typography>
              <Button variant="outlined" startIcon={<AssignmentIcon />}>
                Generate Report
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Medication Dialog */}
      <Dialog open={medicationDialogOpen} onClose={() => setMedicationDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedMedication ? 'Edit Medication' : 'Add New Medication'}
        </DialogTitle>
        <form onSubmit={medicationForm.handleSubmit(onMedicationSubmit)}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Medication Name"
                  {...medicationForm.register('medicationName')}
                  error={!!medicationForm.formState.errors.medicationName}
                  helperText={medicationForm.formState.errors.medicationName?.message}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Generic Name"
                  {...medicationForm.register('genericName')}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Dosage"
                  {...medicationForm.register('dosage')}
                  error={!!medicationForm.formState.errors.dosage}
                  helperText={medicationForm.formState.errors.dosage?.message}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Form</InputLabel>
                  <Select
                    {...medicationForm.register('form')}
                    error={!!medicationForm.formState.errors.form}
                  >
                    <MenuItem value="Tablet">Tablet</MenuItem>
                    <MenuItem value="Capsule">Capsule</MenuItem>
                    <MenuItem value="Liquid">Liquid</MenuItem>
                    <MenuItem value="Injection">Injection</MenuItem>
                    <MenuItem value="Cream">Cream</MenuItem>
                    <MenuItem value="Inhaler">Inhaler</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Manufacturer"
                  {...medicationForm.register('manufacturer')}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setMedicationDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              {selectedMedication ? 'Update' : 'Add'} Medication
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Administration Dialog */}
      <Dialog open={administrationDialogOpen} onClose={() => setAdministrationDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedAdministration ? 'Edit Administration' : 'Add New Administration'}
        </DialogTitle>
        <form onSubmit={administrationForm.handleSubmit(onAdministrationSubmit)}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={students}
                  getOptionLabel={(option) => `${option.name} (${option.class})`}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Student"
                      error={!!administrationForm.formState.errors.studentId}
                      helperText={administrationForm.formState.errors.studentId?.message}
                    />
                  )}
                  onChange={(event, value) => {
                    administrationForm.setValue('studentId', value?.id || '');
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={medications}
                  getOptionLabel={(option) => `${option.medicationName} (${option.dosage})`}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Medication"
                      error={!!administrationForm.formState.errors.medicationId}
                      helperText={administrationForm.formState.errors.medicationId?.message}
                    />
                  )}
                  onChange={(event, value) => {
                    administrationForm.setValue('medicationId', value?.id || '');
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAdministrationDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              {selectedAdministration ? 'Update' : 'Add'} Administration
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default MedicationManagement;