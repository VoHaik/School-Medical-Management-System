import React, { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios'; // Assuming axios is configured (e.g., ../../utils/axiosConfig)
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
  Autocomplete,
  CircularProgress, // Added
  DialogContentText // Added
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Medication as MedicationIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  Inventory as InventoryIcon,
  LocalPharmacy as PharmacyIcon,
  Assignment as AssignmentIcon,
  CheckCircleOutline as ApproveIcon, // Added
  CancelOutlined as RejectIcon, // Added
  Visibility as ViewIcon, // Added
  MedicalServices as AdministerIcon // Added
} from '@mui/icons-material';
import PageHeader from '../../components/PageHeader';
// import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers'; // Consider if full DateTimePicker is needed
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; // Adapter for date picker

const medicationSchema = yup.object().shape({
  medicationName: yup.string().required('Medication name is required'),
  // ... existing medicationSchema
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

const medicationAdministrationSchema = yup.object().shape({
  medicationName: yup.string().required('Medication name is required'),
  // ... existing medicationAdministrationSchema
  dosage: yup.string().required('Dosage is required'),
  administrationTime: yup.date().required('Administration time is required'),
  notes: yup.string(),
  studentCode: yup.string().required('Student is required'),
});

// Schema for rejecting a medication request
const rejectionSchema = yup.object().shape({
  rejectionReason: yup.string().required('Rejection reason is required').min(10, 'Reason must be at least 10 characters long'),
});

// Schema for administering medication for a request
const recordAdministrationSchema = yup.object().shape({
  administrationTime: yup.date().required('Administration time is required').max(new Date(), 'Administration time cannot be in the future (adjust if pre-logging needed)'),
  notes: yup.string().nullable(),
});


function MedicationManagement() {
  const [activeTab, setActiveTab] = useState(0); // Default to "Pending Requests"
  const [medicationDialogOpen, setMedicationDialogOpen] = useState(false);
  const [administrationDialogOpen, setAdministrationDialogOpen] = useState(false); // For direct administration log
  const [selectedMedication, setSelectedMedication] = useState(null);
  // const [selectedAdministration, setSelectedAdministration] = useState(null); // For direct administration log
  const [medications, setMedications] = useState([]); // Inventory
  const [administrations, setAdministrations] = useState([]); // Direct administration log
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  // const [filterStatus, setFilterStatus] = useState('all'); // May not be needed for requests if using tabs
  const [lowStockAlerts, setLowStockAlerts] = useState([]);

  // State for Medication Requests
  const [pendingRequests, setPendingRequests] = useState([]);
  const [isLoadingPendingRequests, setIsLoadingPendingRequests] = useState(false);
  const [pendingRequestsError, setPendingRequestsError] = useState(null);
  
  const [selectedRequest, setSelectedRequest] = useState(null); // For actions on a specific request
  const [viewDetailsDialogOpen, setViewDetailsDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [administerDialogOpen, setAdministerDialogOpen] = useState(false);
  const [approveConfirmationDialogOpen, setApproveConfirmationDialogOpen] = useState(false);


  const medicationForm = useForm({
    resolver: yupResolver(medicationSchema),
    // ... existing medicationForm setup
    defaultValues: {
      contraindications: [],
      sideEffects: [],
      prescriptionRequired: false
    }
  });

  const administrationForm = useForm({ // For direct administration log
    resolver: yupResolver(medicationAdministrationSchema),
    // ... existing administrationForm setup
    defaultValues: {
      administrationTime: new Date(), // Changed from array
      consentGiven: false // This field might not be relevant here
    }
  });

  const rejectForm = useForm({
    resolver: yupResolver(rejectionSchema),
    defaultValues: { rejectionReason: '' },
  });

  const recordAdministrationForm = useForm({
    resolver: yupResolver(recordAdministrationSchema),
    defaultValues: { administrationTime: new Date(), notes: '' },
  });


  const checkLowStock = useCallback(() => {
    const alerts = medications.filter(med => med.quantity < 20); // Example threshold
    setLowStockAlerts(alerts);
  }, [medications]);

  const fetchPendingMedicationRequests = useCallback(async () => {
    setIsLoadingPendingRequests(true);
    setPendingRequestsError(null);
    try {
      const response = await axios.get('/api/medication-requests/nurse/pending');
      setPendingRequests(response.data);
    } catch (error) {
      console.error('Error fetching pending medication requests:', error);
      setPendingRequestsError(error.response?.data?.message || 'Failed to fetch pending requests. Please try again.');
    } finally {
      setIsLoadingPendingRequests(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingMedicationRequests();
    fetchMedications(); // For inventory tab
    fetchAdministrations(); // For administration log tab
    fetchStudents(); // If needed for other parts
  }, [fetchPendingMedicationRequests]); // Removed checkLowStock from here, will call it where medications are updated

  useEffect(() => {
    checkLowStock();
  }, [medications, checkLowStock]);


  const fetchMedications = async () => {
    // ... existing fetchMedications (inventory)
    try {
      // Mock data - replace with actual API call for inventory
      setMedications([
        { id: '1', medicationName: 'Paracetamol Stock', genericName: 'Acetaminophen', dosage: '500mg', form: 'Tablet', manufacturer: 'Pharma Co.', batchNumber: 'PC001', expiryDate: '2025-12-31', quantity: 100, unitCost: 0.50, storageLocation: 'Cabinet A1', prescriptionRequired: false, contraindications: ['Liver disease'], sideEffects: ['Nausea', 'Skin rash'], instructions: 'Take with food'}
      ]);
    } catch (error) {
      console.error('Error fetching medications:', error);
    }
  };

  const fetchAdministrations = async () => {
    // ... existing fetchAdministrations (direct admin log)
     try {
      // Mock data - replace with actual API call for direct admin log
      setAdministrations([
        { id: '1', studentId: 'S001', studentName: 'John Doe (Direct Log)', medicationId: '1', medicationName: 'Ibuprofen (Direct)', dosage: '200mg', administrationTime: [new Date().toISOString()], notes: 'Administered for headache' }
      ]);
    } catch (error) {
      console.error('Error fetching administrations:', error);
    }
  };

  const fetchStudents = async () => {
    // ... existing fetchStudents
    try {
      // Mock data - replace with actual API call
      setStudents([
        { studentCode: 'S001', name: 'John Doe', class: '10A' },
        { studentCode: 'S002', name: 'Jane Smith', class: '9B' }
      ]);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // --- Medication Inventory Handlers ---
  const handleAddMedication = () => {
    // ... existing handleAddMedication
    setSelectedMedication(null);
    medicationForm.reset({ contraindications: [], sideEffects: [], prescriptionRequired: false, expiryDate: null, quantity: 0, unitCost: 0 });
    setMedicationDialogOpen(true);
  };

  const handleEditMedication = (medication) => {
    // ... existing handleEditMedication
    setSelectedMedication(medication);
    medicationForm.reset(medication);
    setMedicationDialogOpen(true);
  };
  
  const handleMedicationFormSubmit = async (data) => {
    // ... existing handleMedicationFormSubmit (for inventory)
    console.log('Medication inventory data:', data);
    // Replace with actual API call to add/update medication inventory
    // Example: if (selectedMedication) { await axios.put(`/api/inventory/medications/${selectedMedication.id}`, data); } else { await axios.post('/api/inventory/medications', data); }
    fetchMedications();
    setMedicationDialogOpen(false);
  };

  // --- Direct Administration Log Handlers ---
  const handleAddAdministration = () => { // For direct log
    // setSelectedAdministration(null); // Not used anymore
    administrationForm.reset({ administrationTime: new Date(), notes: '', studentCode: '' });
    setAdministrationDialogOpen(true);
  };

  // const handleEditAdministration = (adminLog) => { // For direct log
  //   setSelectedAdministration(adminLog);
  //   administrationForm.reset(adminLog);
  //   setAdministrationDialogOpen(true);
  // };

  const handleAdministrationFormSubmit = async (data) => { // For direct log
    console.log('Direct administration data:', data);
    // Replace with actual API call to log direct administration
    // Example: await axios.post('/api/medications/administrations/log', data);
    fetchAdministrations();
    setAdministrationDialogOpen(false);
  };

  // --- Medication Request Action Handlers ---
  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setViewDetailsDialogOpen(true);
  };

  const handleOpenApproveConfirmation = (request) => {
    setSelectedRequest(request);
    setApproveConfirmationDialogOpen(true);
  };

  const handleApproveRequest = async () => {
    if (!selectedRequest) return;
    try {
      await axios.put(`/api/medication-requests/${selectedRequest.id}/approve`);
      // Add success notification
      fetchPendingMedicationRequests(); // Refetch or update state locally
      // Potentially move to an "Approved" list/tab
    } catch (error) {
      console.error('Error approving request:', error);
      // Add error notification
    } finally {
      setApproveConfirmationDialogOpen(false);
      setSelectedRequest(null);
    }
  };

  const handleOpenRejectDialog = (request) => {
    setSelectedRequest(request);
    rejectForm.reset({ rejectionReason: '' });
    setRejectDialogOpen(true);
  };

  const handleRejectRequest = async (data) => {
    if (!selectedRequest) return;
    try {
      await axios.put(`/api/medication-requests/${selectedRequest.id}/reject`, { reason: data.rejectionReason });
      // Add success notification
      fetchPendingMedicationRequests(); // Refetch or update state locally
    } catch (error) {
      console.error('Error rejecting request:', error);
      // Add error notification
    } finally {
      setRejectDialogOpen(false);
      setSelectedRequest(null);
    }
  };

  const handleOpenAdministerDialog = (request) => {
    setSelectedRequest(request);
    // Pre-fill if possible, e.g., medication name, dosage from request for display
    recordAdministrationForm.reset({ administrationTime: new Date(), notes: '' });
    setAdministerDialogOpen(true);
  };

  const handleAdministerMedication = async (data) => {
    if (!selectedRequest) return;
    const administrationData = {
      administrationTime: data.administrationTime.toISOString(), // Ensure correct format for backend
      notes: data.notes,
    };
    try {
      await axios.post(`/api/medication-requests/${selectedRequest.id}/administer`, administrationData);
      // Add success notification
      fetchPendingMedicationRequests(); // Refetch or update state locally
      // Potentially update request status to ADMINISTERED or PARTIALLY_ADMINISTERED
    } catch (error) {
      console.error('Error administering medication:', error);
      // Add error notification
    } finally {
      setAdministerDialogOpen(false);
      setSelectedRequest(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    return new Date(dateTimeString).toLocaleString();
  };


  return (
    // <LocalizationProvider dateAdapter={AdapterDateFns}> // Needed if using MUI X Date/Time Pickers
    <Box sx={{ p: 3 }}>
      <PageHeader title="Medication Management" icon={<PharmacyIcon />} />
      <Tabs value={activeTab} onChange={handleTabChange} indicatorColor="primary" textColor="primary" sx={{ mb: 3 }}>
        <Tab label="Pending Requests" icon={<AssignmentIcon />} />
        <Tab label="Medication Inventory" icon={<InventoryIcon />} />
        <Tab label="Medication Administration Log" icon={<ScheduleIcon />} />
        <Tab label="Low Stock Alerts" icon={<WarningIcon />} badgeContent={lowStockAlerts.length} color="error" />
      </Tabs>

      {/* Tab 0: Pending Medication Requests */}
      {activeTab === 0 && (
        <Card>
          <CardHeader title="Pending Medication Requests" />
          <CardContent>
            {isLoadingPendingRequests && <CircularProgress />}
            {pendingRequestsError && <Alert severity="error">{pendingRequestsError}</Alert>}
            {!isLoadingPendingRequests && !pendingRequestsError && (
              <TableContainer component={Paper}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Student Name</TableCell>
                      <TableCell>Student Code</TableCell>
                      <TableCell>Medication</TableCell>
                      <TableCell>Dosage</TableCell>
                      <TableCell>Frequency</TableCell>
                      <TableCell>Start Date</TableCell>
                      <TableCell>End Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Requested By</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pendingRequests.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={10} align="center">No pending requests.</TableCell>
                      </TableRow>
                    )}
                    {pendingRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{request.studentName}</TableCell>
                        <TableCell>{request.studentCode}</TableCell>
                        <TableCell>{request.medicationName}</TableCell>
                        <TableCell>{request.dosage}</TableCell>
                        <TableCell>{request.frequency}</TableCell>
                        <TableCell>{formatDate(request.startDate)}</TableCell>
                        <TableCell>{formatDate(request.endDate)}</TableCell>
                        <TableCell><Chip label={request.status} color={request.status === 'PENDING_APPROVAL' ? 'warning' : 'default'} /></TableCell>
                        <TableCell>{request.requestedByName}</TableCell>
                        <TableCell>
                          <Tooltip title="View Details">
                            <IconButton onClick={() => handleViewDetails(request)} size="small"><ViewIcon /></IconButton>
                          </Tooltip>
                          {request.status === 'PENDING_APPROVAL' && (
                            <>
                              <Tooltip title="Approve">
                                <IconButton onClick={() => handleOpenApproveConfirmation(request)} size="small" color="success"><ApproveIcon /></IconButton>
                              </Tooltip>
                              <Tooltip title="Reject">
                                <IconButton onClick={() => handleOpenRejectDialog(request)} size="small" color="error"><RejectIcon /></IconButton>
                              </Tooltip>
                            </>
                          )}
                          {request.status === 'APPROVED' && ( // Assuming 'APPROVED' means ready to administer
                             <Tooltip title="Administer">
                                <IconButton onClick={() => handleOpenAdministerDialog(request)} size="small" color="primary"><AdministerIcon /></IconButton>
                              </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tab 1: Medication Inventory (Existing Content) */}
      {activeTab === 1 && (
        <Card>
          <CardHeader
            title="Medication Inventory"
            action={<Button variant="contained" startIcon={<AddIcon />} onClick={handleAddMedication}>Add Medication</Button>}
          />
          <CardContent>
            {/* Existing inventory table and search/filter UI would go here */}
            {/* For brevity, only showing the dialog logic was present in previous context */}
            <Typography>Medication inventory management UI goes here.</Typography>
             <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Dosage</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Expiry</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {medications.map((med) => (
                      <TableRow key={med.id}>
                        <TableCell>{med.medicationName}</TableCell>
                        <TableCell>{med.dosage}</TableCell>
                        <TableCell>{med.quantity}</TableCell>
                        <TableCell>{formatDate(med.expiryDate)}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleEditMedication(med)}><EditIcon /></IconButton>
                          {/* Add delete button if needed */}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Tab 2: Medication Administration Log (Existing Content for direct logging) */}
      {activeTab === 2 && (
        <Card>
          <CardHeader
            title="Direct Medication Administration Log"
            action={<Button variant="contained" startIcon={<AddIcon />} onClick={handleAddAdministration}>Log Administration</Button>}
          />
          <CardContent>
            {/* Existing administration log table and UI */}
            <Typography>Direct medication administration log UI goes here.</Typography>
            <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Student</TableCell>
                      <TableCell>Medication</TableCell>
                      <TableCell>Dosage</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Notes</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {administrations.map((adminLog) => ( // Ensure 'administrations' is the correct state variable
                      <TableRow key={adminLog.id}>
                        <TableCell>{adminLog.studentName || adminLog.studentId}</TableCell>
                        <TableCell>{adminLog.medicationName}</TableCell>
                        <TableCell>{adminLog.dosage}</TableCell>
                        <TableCell>{adminLog.administrationTime.map(t => formatDateTime(t)).join(', ')}</TableCell>
                        <TableCell>{adminLog.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Tab 3: Low Stock Alerts (Existing Content) */}
      {activeTab === 3 && (
        <Card>
          <CardHeader title="Low Stock Alerts" />
          <CardContent>
            {lowStockAlerts.length === 0 ? (
              <Typography>No low stock alerts.</Typography>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Medication Name</TableCell>
                      <TableCell>Quantity Left</TableCell>
                      <TableCell>Storage Location</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lowStockAlerts.map(med => (
                      <TableRow key={med.id}>
                        <TableCell>{med.medicationName}</TableCell>
                        <TableCell>{med.quantity}</TableCell>
                        <TableCell>{med.storageLocation}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      )}

      {/* Dialog for Adding/Editing Medication Inventory */}
      <Dialog open={medicationDialogOpen} onClose={() => setMedicationDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{selectedMedication ? 'Edit Medication' : 'Add New Medication'} to Inventory</DialogTitle>
        <form onSubmit={medicationForm.handleSubmit(handleMedicationFormSubmit)}>
          <DialogContent>
            {/* Simplified form fields for brevity, ensure all fields from schema are covered */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Controller name="medicationName" control={medicationForm.control} render={({ field, fieldState }) => <TextField {...field} label="Medication Name" fullWidth required error={!!fieldState.error} helperText={fieldState.error?.message} />} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller name="dosage" control={medicationForm.control} render={({ field, fieldState }) => <TextField {...field} label="Dosage (e.g., 500mg)" fullWidth required error={!!fieldState.error} helperText={fieldState.error?.message} />} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller name="form" control={medicationForm.control} render={({ field, fieldState }) => <TextField {...field} label="Form (e.g., Tablet, Syrup)" fullWidth required error={!!fieldState.error} helperText={fieldState.error?.message} />} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller name="quantity" control={medicationForm.control} render={({ field, fieldState }) => <TextField {...field} label="Quantity" type="number" fullWidth required error={!!fieldState.error} helperText={fieldState.error?.message} />} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller name="expiryDate" control={medicationForm.control} render={({ field, fieldState }) => <TextField {...field} label="Expiry Date" type="date" InputLabelProps={{ shrink: true }} fullWidth required error={!!fieldState.error} helperText={fieldState.error?.message} />} />
              </Grid>
              {/* Add other fields from medicationSchema as needed: genericName, manufacturer, batchNumber, unitCost, storageLocation, prescriptionRequired, contraindications, sideEffects, instructions */}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setMedicationDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Save</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog for Logging Direct Medication Administration */}
      <Dialog open={administrationDialogOpen} onClose={() => setAdministrationDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Log Direct Medication Administration</DialogTitle>
        <form onSubmit={administrationForm.handleSubmit(handleAdministrationFormSubmit)}>
          <DialogContent>
            <Grid container spacing={2}>
               <Grid item xs={12}>
                {/* Autocomplete for student selection might be better here */}
                <Controller name="studentCode" control={administrationForm.control} render={({ field, fieldState }) => (
                    <Autocomplete
                        options={students}
                        getOptionLabel={(option) => `${option.name} (${option.studentCode})`}
                        onChange={(e, newValue) => field.onChange(newValue ? newValue.studentCode : '')}
                        renderInput={(params) => <TextField {...params} label="Student" fullWidth required error={!!fieldState.error} helperText={fieldState.error?.message} />}
                    />
                )} />
              </Grid>
              <Grid item xs={12}>
                <Controller name="medicationName" control={administrationForm.control} render={({ field, fieldState }) => <TextField {...field} label="Medication Name" fullWidth required error={!!fieldState.error} helperText={fieldState.error?.message} />} />
              </Grid>
              <Grid item xs={12}>
                <Controller name="dosage" control={administrationForm.control} render={({ field, fieldState }) => <TextField {...field} label="Dosage Administered" fullWidth required error={!!fieldState.error} helperText={fieldState.error?.message} />} />
              </Grid>
              <Grid item xs={12}>
                 <Controller name="administrationTime" control={administrationForm.control} render={({ field, fieldState }) => <TextField {...field} label="Administration Time" type="datetime-local" InputLabelProps={{ shrink: true }} fullWidth required error={!!fieldState.error} helperText={fieldState.error?.message} value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ''} onChange={(e) => field.onChange(new Date(e.target.value))} />} />
              </Grid>
              <Grid item xs={12}>
                <Controller name="notes" control={administrationForm.control} render={({ field, fieldState }) => <TextField {...field} label="Notes" multiline rows={3} fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} />} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAdministrationDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Log Administration</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog to View Medication Request Details */}
      <Dialog open={viewDetailsDialogOpen} onClose={() => setViewDetailsDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Medication Request Details</DialogTitle>
        {selectedRequest && (
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}><Typography variant="subtitle2">Student Name:</Typography><Typography>{selectedRequest.studentName}</Typography></Grid>
              <Grid item xs={12} sm={6}><Typography variant="subtitle2">Student Code:</Typography><Typography>{selectedRequest.studentCode}</Typography></Grid>
              <Grid item xs={12} sm={6}><Typography variant="subtitle2">Medication:</Typography><Typography>{selectedRequest.medicationName}</Typography></Grid>
              <Grid item xs={12} sm={6}><Typography variant="subtitle2">Dosage:</Typography><Typography>{selectedRequest.dosage}</Typography></Grid>
              <Grid item xs={12} sm={6}><Typography variant="subtitle2">Frequency:</Typography><Typography>{selectedRequest.frequency}</Typography></Grid>
              <Grid item xs={12} sm={6}><Typography variant="subtitle2">Status:</Typography><Chip label={selectedRequest.status} /></Grid>
              <Grid item xs={12} sm={6}><Typography variant="subtitle2">Start Date:</Typography><Typography>{formatDate(selectedRequest.startDate)}</Typography></Grid>
              <Grid item xs={12} sm={6}><Typography variant="subtitle2">End Date:</Typography><Typography>{formatDate(selectedRequest.endDate)}</Typography></Grid>
              <Grid item xs={12}><Typography variant="subtitle2">Reason for Medication:</Typography><Typography>{selectedRequest.reason}</Typography></Grid>
              <Grid item xs={12}><Typography variant="subtitle2">Parent's Notes:</Typography><Typography>{selectedRequest.notes || 'N/A'}</Typography></Grid>
              <Grid item xs={12} sm={6}><Typography variant="subtitle2">Requested By:</Typography><Typography>{selectedRequest.requestedByName}</Typography></Grid>
              <Grid item xs={12} sm={6}><Typography variant="subtitle2">Requested At:</Typography><Typography>{formatDateTime(selectedRequest.requestedAt)}</Typography></Grid>
              {selectedRequest.approvedByName && (<Grid item xs={12} sm={6}><Typography variant="subtitle2">Approved By:</Typography><Typography>{selectedRequest.approvedByName}</Typography></Grid>)}
              {selectedRequest.approvedAt && (<Grid item xs={12} sm={6}><Typography variant="subtitle2">Approved At:</Typography><Typography>{formatDateTime(selectedRequest.approvedAt)}</Typography></Grid>)}
              {selectedRequest.rejectionReason && (<Grid item xs={12}><Typography variant="subtitle2">Rejection Reason:</Typography><Typography>{selectedRequest.rejectionReason}</Typography></Grid>)}
              {selectedRequest.administrationRecords && selectedRequest.administrationRecords.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{mt: 2}}>Administration History:</Typography>
                  <TableContainer component={Paper} sx={{mt:1}}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Administered At</TableCell>
                          <TableCell>Administered By</TableCell>
                          <TableCell>Notes</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedRequest.administrationRecords.map(record => (
                          <TableRow key={record.id}>
                            <TableCell>{formatDateTime(record.administrationTime)}</TableCell>
                            <TableCell>{record.administeredByNurseName}</TableCell>
                            <TableCell>{record.notes}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              )}
            </Grid>
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={() => setViewDetailsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog for Approving Request */}
      <Dialog open={approveConfirmationDialogOpen} onClose={() => setApproveConfirmationDialogOpen(false)}>
        <DialogTitle>Confirm Approval</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to approve this medication request for {selectedRequest?.studentName} ({selectedRequest?.medicationName})?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApproveConfirmationDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleApproveRequest} color="primary" variant="contained">Approve</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Rejecting Medication Request */}
      <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Reject Medication Request</DialogTitle>
        <form onSubmit={rejectForm.handleSubmit(handleRejectRequest)}>
          <DialogContent>
            <Typography>Student: {selectedRequest?.studentName}</Typography>
            <Typography>Medication: {selectedRequest?.medicationName}</Typography>
            <Controller
              name="rejectionReason"
              control={rejectForm.control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Reason for Rejection"
                  multiline
                  rows={4}
                  fullWidth
                  margin="normal"
                  required
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="error">Reject Request</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog for Administering Medication for a Request */}
      <Dialog open={administerDialogOpen} onClose={() => setAdministerDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Administer Medication</DialogTitle>
        <form onSubmit={recordAdministrationForm.handleSubmit(handleAdministerMedication)}>
          <DialogContent>
            <Typography>Student: {selectedRequest?.studentName}</Typography>
            <Typography>Medication: {selectedRequest?.medicationName} ({selectedRequest?.dosage})</Typography>
            <Controller
              name="administrationTime"
              control={recordAdministrationForm.control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Administration Time"
                  type="datetime-local"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  margin="normal"
                  required
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  // Ensure value is in 'yyyy-MM-ddThh:mm' format for the input
                  value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ''}
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                />
              )}
            />
            <Controller
              name="notes"
              control={recordAdministrationForm.control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Administration Notes"
                  multiline
                  rows={3}
                  fullWidth
                  margin="normal"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAdministerDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">Record Administration</Button>
          </DialogActions>
        </form>
      </Dialog>

    </Box>
    // </LocalizationProvider>
  );
}

export default MedicationManagement;