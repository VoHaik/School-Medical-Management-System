import React, { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom'; // Added for URL query parameters
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import apiClient from '../../utils/api'; // Import the api client
import MedicalEventTab from '../../components/medical/MedicalEventTab'; // Import MedicalEventTab component
import { useAlert } from '../../hooks/useAlert'; // Import useAlert hook
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
  CheckCircleOutline as ApproveIcon,
  CancelOutlined as RejectIcon,
  Visibility as ViewIcon,
  MedicalServices as AdministerIcon,
  MedicalInformation as MedicalEventIcon // Added for Medical Event tab
} from '@mui/icons-material';
import PageHeader from '../../components/PageHeader';
// import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers'; // Consider if full DateTimePicker is needed
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; // Adapter for date picker

const medicationSchema = yup.object().shape({
  medicationName: yup.string().required('Medication name is required'),
  // Removed genericName as per requirements
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
  rejectionReason: yup.string().nullable(), // Make it optional so the form can be submitted without a reason
});

// Schema for administering medication for a request
const recordAdministrationSchema = yup.object().shape({
  administrationTime: yup.date().required('Administration time is required').max(new Date(), 'Administration time cannot be in the future (adjust if pre-logging needed)'),
  notes: yup.string().nullable(),
});


function MedicationManagement() {
  const { successAlert, errorAlert, deleteConfirm } = useAlert(); // Initialize useAlert hook
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') ? parseInt(searchParams.get('tab'), 10) : 0;
  const [activeTab, setActiveTab] = useState(initialTab); // Read initial tab from URL if available
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
    defaultValues: {
      medicationName: '',
      // Removed genericName as per requirements
      dosage: '',
      form: '',
      manufacturer: '',
      batchNumber: '',
      expiryDate: null,
      quantity: 0,
      unitCost: 0,
      storageLocation: '',
      contraindications: [],
      sideEffects: [],
      prescriptionRequired: false,
      instructions: ''
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
    mode: 'onSubmit', // Only validate on submit to allow empty values
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
      // Use apiClient as authenticated axios instance
      const authAxios = apiClient;
      // Add debugging info to help trace the request
      authAxios.defaults.headers.common['X-Debug'] = 'MedicationManagement-FetchPending';
      // Use the correct endpoint path - this is the API URL configured in the controller
      // Always include details to get full parent and student names
      const response = await authAxios.get('/medication-requests/pending?includeDetails=true');
      // Process the data to ensure we have the full names available for display
      const processedData = response.data.map(request => {
        // Log the original data to help with debugging
        // Use the new studentFullName field if available
        let displayStudentName;
        
        if (request.studentFullName) {
          displayStudentName = request.studentFullName;
        } else if (request.studentName && !request.studentName.startsWith('Student Code:')) {
          displayStudentName = request.studentName;
        } else {
          displayStudentName = `Student (${request.studentCode})`;
        }
        
        // Use the new parentFullName field if available
        let displayParentName = request.parentFullName || 
                               request.requestedByName || 
                               request.parentName || 
                               'Parent';
        
        // Ensure id is mapped to requestId for consistency
        return {
          ...request,
          id: request.requestId, // Map backend requestId to id for frontend compatibility
          studentFullName: displayStudentName,
          parentFullName: displayParentName
        };
      });
      
      setPendingRequests(processedData);
    } catch (error) {
      console.error('Error fetching pending medication requests:', error);
      // More detailed error logging
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        console.error('Request URL:', error.config.url);
        console.error('Request headers:', error.config.headers);
      }
      setPendingRequestsError(
        error.response?.data?.message || 
        `Failed to fetch pending requests (${error.response?.status || 'unknown error'}). Please try again.`
      );
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
    try {
      const authAxios = apiClient;
      
      // Add debugging headers
      authAxios.defaults.headers.common['X-Debug-Request'] = 'FetchMedications';
      
      // Call API to get medication data from backend
      const response = await authAxios.get('/medications/inventory');
      if (Array.isArray(response.data)) {
        // Convert API response to a format compatible with the UI
        // Make sure we map medicationId to id for frontend compatibility
        const medications = response.data.map(med => ({
          ...med,
          id: med.medicationId // Ensure frontend compatibility
        }));
        
        setMedications(medications);
      } else {
        console.error('API returned non-array data:', response.data);
        setAlertMessage({
          message: 'Error: API returned invalid data format',
          severity: 'error',
          show: true
        });
        // Set empty array to avoid UI errors
        setMedications([]);
      }
    } catch (error) {
      console.error('Error fetching medications:', error);
      
      // Log detailed error information for debugging
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      
      // Show error message to user
      setAlertMessage({
        message: `Error fetching medications: ${error.response?.data?.error || error.message}`,
        severity: 'error',
        show: true
      });
      
      // Set empty array to avoid UI errors
      setMedications([]);
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
    setSearchParams({ tab: newValue.toString() });
  };

  // --- Medication Inventory Handlers ---
  const handleAddMedication = () => {
    setSelectedMedication(null);
    
    // Reset form with default values
    medicationForm.reset({
      medicationName: '',
      // Removed genericName as per requirements
      dosage: '',
      form: '',
      manufacturer: '',
      batchNumber: '',
      expiryDate: new Date().toISOString().split('T')[0], // Set today's date in YYYY-MM-DD format
      quantity: 0,
      unitCost: 0,
      storageLocation: '',
      contraindications: [],
      sideEffects: [],
      prescriptionRequired: false,
      instructions: ''
    });
    
    setMedicationDialogOpen(true);
  };

  const handleEditMedication = (medication) => {
    setSelectedMedication(medication);
    
    // Format date to match the expected input format (YYYY-MM-DD)
    let formattedData = { ...medication };
    
    if (medication.expiryDate) {
      if (typeof medication.expiryDate === 'string') {
        formattedData.expiryDate = new Date(medication.expiryDate).toISOString().split('T')[0];
      } else {
        formattedData.expiryDate = medication.expiryDate.toISOString().split('T')[0];
      }
    }
    
    // Ensure we're using the correct ID field from the backend
    if (medication.medicationId && !medication.id) {
      formattedData.id = medication.medicationId;
    }
    
    // Ensure other fields are properly initialized
    formattedData.contraindications = formattedData.contraindications || [];
    formattedData.sideEffects = formattedData.sideEffects || [];
    
    medicationForm.reset(formattedData);
    setMedicationDialogOpen(true);
  };
  
  const [alertMessage, setAlertMessage] = useState({ message: '', severity: 'info', show: false });
  
  const handleMedicationFormSubmit = async (data) => {
    try {
      const authAxios = apiClient;
      
      // Format date properly before submitting
      if (data.expiryDate) {
        // Ensure expiryDate is a proper Date object
        data.expiryDate = new Date(data.expiryDate);
      }
      
      // Prepare the medication data to match the backend DTO
      const medicationDTO = {
        medicationId: selectedMedication ? selectedMedication.medicationId : null,
        medicationName: data.medicationName,
        dosage: data.dosage,
        form: data.form,
        batchNumber: data.batchNumber || "",
        expiryDate: data.expiryDate,
        quantity: data.quantity,
        prescriptionRequired: false, // Always set a default value (false) for this required field
        manufacturer: data.manufacturer || "",
        storageLocation: data.storageLocation || "",
        unitCost: data.unitCost || 0
      };
      
      // Use the actual backend API endpoints to save medication data
      if (selectedMedication) {
        await authAxios.put(`/medications/inventory/${selectedMedication.medicationId}`, medicationDTO);
        setAlertMessage({
          message: `Medication "${data.medicationName}" updated successfully!`,
          severity: 'success',
          show: true
        });
      } else {
        await authAxios.post('/medications/inventory', medicationDTO);
        setAlertMessage({
          message: `New medication "${data.medicationName}" added to inventory!`,
          severity: 'success',
          show: true
        });
      }
      
      // Update UI by fetching the latest data from the backend
      fetchMedications();
      setMedicationDialogOpen(false);
      
      // Auto-hide message after 5 seconds
      setTimeout(() => {
        setAlertMessage(prev => ({ ...prev, show: false }));
      }, 5000);
    } catch (error) {
      console.error('Error saving medication:', error);
      
      // More detailed error logging for debugging
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      
      setAlertMessage({
        message: `Error: ${error.response?.data?.error || error.message || 'Failed to save medication'}`,
        severity: 'error',
        show: true
      });
    }
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
      // Use requestId which is the correct field from the backend DTO
      const requestId = selectedRequest.requestId;
      
      if (!requestId) {
        console.error('Error: Request ID is undefined or null', selectedRequest);
        errorAlert('Error: Cannot approve request - missing request ID');
        return;
      }
      
      const authAxios = apiClient;
      
      // First let's check if the API endpoint is accessible
      // Ensure we're using the correct endpoint from the MedicationRequestController
      const response = await authAxios.put(`/medication-requests/${requestId}/approve`);
      // Add success notification - we should show this in the UI
      successAlert('Medication request approved successfully'); // Modern notification
      
      // Update the UI by fetching the latest data
      fetchPendingMedicationRequests();
    } catch (error) {
      console.error('Error approving request:', error);
      
      // Detailed error logging for debugging
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        console.error('Request URL:', error.config.url);
        console.error('Request headers:', error.config.headers);
        
        // Show error message to the user
        errorAlert(`Error approving request: ${error.response.data?.error || error.message}`);
      } else {
        errorAlert(`Error approving request: ${error.message}`);
      }
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
      const authAxios = apiClient;
      
      // Extract the rejection reason, providing an empty string if null or undefined
      const rejectionReason = data.rejectionReason || '';
      
      // Debug logging to identify the correct ID field
      // Use requestId which is the correct field from the backend DTO
      const requestId = selectedRequest.requestId;
      
      if (!requestId) {
        console.error('Error: Request ID is undefined or null', selectedRequest);
        errorAlert('Error: Cannot reject request - missing request ID');
        return;
      }
      
      console.log(`Rejecting request ID: ${requestId} with reason: ${rejectionReason || '(No reason provided)'}`);
      
      // The backend controller expects "reason" as the parameter name
      const response = await authAxios.put(`/medication-requests/${requestId}/reject`, { 
        reason: rejectionReason
      });
      
      // Show a success message to the user
      successAlert('Medication request rejected successfully');
      
      // Update the UI by fetching the latest data
      fetchPendingMedicationRequests();
    } catch (error) {
      console.error('Error rejecting request:', error);
      
      // Detailed error logging
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        console.error('Request URL:', error.config.url);
        console.error('Request payload:', error.config.data);
        
        // Show error message to the user
        errorAlert(`Error rejecting request: ${error.response.data?.error || error.message}`);
      } else {
        errorAlert(`Error rejecting request: ${error.message}`);
      }
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
    
    // Use requestId which is the correct field from the backend DTO
    const requestId = selectedRequest.requestId;
    
    if (!requestId) {
      console.error('Error: Request ID is undefined or null', selectedRequest);
      errorAlert('Error: Cannot administer medication - missing request ID');
      return;
    }
    
    const administrationData = {
      administrationTime: data.administrationTime.toISOString(), // Ensure correct format for backend
      notes: data.notes,
      // Use the field name expected by the backend controller
      administrationNotes: data.notes
    };
    try {
      const authAxios = apiClient;
      await authAxios.post(`/medication-requests/${requestId}/administer`, administrationData);
      
      // Add success notification
      successAlert('Medication administered successfully');
      
      fetchPendingMedicationRequests(); // Refetch to update the UI
    } catch (error) {
      console.error('Error administering medication:', error);
      // More detailed error logging for debugging
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        console.error('Request URL:', error.config.url);
        console.error('Request payload:', error.config.data);
        
        // Show error message to the user
        errorAlert(`Error administering medication: ${error.response.data?.error || error.message}`);
      } else {
        errorAlert(`Error administering medication: ${error.message}`);
      }
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


  // Function to test medication API connection
  const testMedicationAPI = async () => {
    try {
      setAlertMessage({
        message: 'Testing medication inventory API connection...',
        severity: 'info',
        show: true
      });
      
      const authAxios = apiClient;
      
      // Add debugging headers
      authAxios.defaults.headers.common['X-Debug'] = 'TestMedicationAPI';
      // Test GET endpoint
      const getResponse = await authAxios.get('/medications/inventory');
      // Test POST endpoint with a test medication (if there's no data)
      if (Array.isArray(getResponse.data) && getResponse.data.length === 0) {
        const testMedication = {
          medicationName: 'Test Medication API',
          dosage: '10mg',
          form: 'Tablet',
          batchNumber: 'TEST123',
          expiryDate: new Date(new Date().getFullYear() + 1, 0, 1), // Next year
          quantity: 50,
          prescriptionRequired: false,
          manufacturer: 'Test Manufacturer',
          storageLocation: 'Test Location',
          unitCost: 10.0
        };
        
        const postResponse = await authAxios.post('/medications/inventory', testMedication);
        }
      
      // Show success message
      setAlertMessage({
        message: 'Medication API connection successful! Refreshing data...',
        severity: 'success',
        show: true
      });
      
      // Refresh the medication data
      fetchMedications();
      
    } catch (error) {
      console.error('API test error:', error);
      
      // Log detailed error information
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        console.error('Request URL:', error.config.url);
        console.error('Request headers:', error.config.headers);
        console.error('Request data:', error.config.data);
      }
      
      setAlertMessage({
        message: `API test failed: ${error.response?.data?.error || error.message}`,
        severity: 'error',
        show: true
      });
    }
  };

  return (
    // <LocalizationProvider dateAdapter={AdapterDateFns}> // Needed if using MUI X Date/Time Pickers
    <Box sx={{ p: 3 }}>
      <PageHeader title="Medication Management" icon={<PharmacyIcon />} />
      <Tabs value={activeTab} onChange={handleTabChange} indicatorColor="primary" textColor="primary" sx={{ mb: 3 }}>
        <Tab label="Pending Requests" icon={<AssignmentIcon />} />
        <Tab label="Medication Inventory" icon={<InventoryIcon />} />
        {/* <Tab label="Medication Administration Log" icon={<ScheduleIcon />} /> */}
        <Tab label="Low Stock Alerts" icon={<WarningIcon />} badgeContent={lowStockAlerts.length} color="error" />
        <Tab label="Medical Events" icon={<MedicalEventIcon />} />
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
                      <TableCell>Student Full Name</TableCell>
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
                        <TableCell>{request.studentFullName}</TableCell>
                        <TableCell>{request.studentCode}</TableCell>
                        <TableCell>{request.medicationName}</TableCell>
                        <TableCell>{request.dosage}</TableCell>
                        <TableCell>{request.frequency}</TableCell>
                        <TableCell>{formatDate(request.startDate)}</TableCell>
                        <TableCell>{formatDate(request.endDate)}</TableCell>
                        <TableCell>
                          <Chip 
                            label={request.status} 
                            color={request.status === 'PENDING' || request.status === 'PENDING_APPROVAL' ? 'warning' : 
                                 request.status === 'APPROVED' ? 'success' :
                                 request.status === 'REJECTED' ? 'error' : 'default'} 
                          />
                        </TableCell>
                        <TableCell>{request.parentFullName}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="View Details">
                              <IconButton onClick={() => handleViewDetails(request)} size="small"><ViewIcon /></IconButton>
                            </Tooltip>
                            {(request.status === 'PENDING_APPROVAL' || request.status === 'PENDING') && (
                              <>
                                <Tooltip title="Approve">
                                  <IconButton 
                                    onClick={() => handleOpenApproveConfirmation(request)} 
                                    size="small" 
                                    color="success"
                                    aria-label="Approve medication request"
                                  >
                                    <ApproveIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Reject">
                                  <IconButton 
                                    onClick={() => handleOpenRejectDialog(request)} 
                                    size="small" 
                                    color="error"
                                    aria-label="Reject medication request"
                                  >
                                    <RejectIcon />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                            {request.status === 'APPROVED' && ( // Assuming 'APPROVED' means ready to administer
                              <Tooltip title="Administer">
                                <IconButton 
                                  onClick={() => handleOpenAdministerDialog(request)} 
                                  size="small" 
                                  color="primary"
                                  aria-label="Administer medication"
                                >
                                  <AdministerIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
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
            action={
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="outlined" onClick={testMedicationAPI}>
                  Test API Connection
                </Button>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddMedication}>
                  Add Medication
                </Button>
              </Box>
            }
          />
          <CardContent>
            {/* Success/Error Alert */}
            {alertMessage.show && (
              <Alert 
                severity={alertMessage.severity} 
                sx={{ mb: 2 }}
                onClose={() => setAlertMessage(prev => ({...prev, show: false}))}
              >
                {alertMessage.message}
              </Alert>
            )}
            
            {/* Search bar and filters for inventory */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search medications..."
                  size="small"
                  InputProps={{
                    startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
                  }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Grid>
            </Grid>
            
            <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Form</TableCell>
                      <TableCell>Dosage</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Expiry</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {medications.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">No medications in inventory.</TableCell>
                      </TableRow>
                    ) : (
                      medications.map((med) => (
                        <TableRow key={med.medicationId || med.id}>
                          <TableCell>{med.medicationName}</TableCell>
                          <TableCell>{med.form || '-'}</TableCell>
                          <TableCell>{med.dosage}</TableCell>
                          <TableCell>
                            <Chip 
                              label={med.quantity} 
                              color={med.quantity < 20 ? 'warning' : 'default'} 
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{formatDate(med.expiryDate)}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Tooltip title="Edit">
                                <IconButton onClick={() => handleEditMedication(med)} size="small">
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              {/* Add delete button if needed */}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Tab 2: Medication Administration Log (Disabled) */}
      {/* {activeTab === 2 && (
        <Card>
          <CardHeader
            title="Direct Medication Administration Log"
            action={<Button variant="contained" startIcon={<AddIcon />} onClick={handleAddAdministration}>Log Administration</Button>}
          />
          <CardContent>
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
                    {administrations.map((adminLog) => ( 
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
      )} */}

      {/* Tab 2: Low Stock Alerts (Updated index) */}
      {activeTab === 2 && (
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

      {/* Tab 3: Medical Events (Updated index) */}
      {activeTab === 3 && (
        <Card>
          <CardHeader title="Medical Event Management" />
          <CardContent>
            <MedicalEventTab />
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
                <Controller 
                  name="expiryDate" 
                  control={medicationForm.control} 
                  render={({ field, fieldState }) => (
                    <TextField 
                      {...field} 
                      label="Expiry Date" 
                      type="date" 
                      InputLabelProps={{ shrink: true }} 
                      fullWidth 
                      required 
                      error={!!fieldState.error} 
                      helperText={fieldState.error?.message || "Format: YYYY-MM-DD"}
                    />
                  )} 
                />
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
              <Grid item xs={12} sm={6}><Typography variant="subtitle2">Student Name:</Typography><Typography>{selectedRequest.studentFullName}</Typography></Grid>
              <Grid item xs={12} sm={6}><Typography variant="subtitle2">Student Code:</Typography><Typography>{selectedRequest.studentCode}</Typography></Grid>
              <Grid item xs={12} sm={6}><Typography variant="subtitle2">Medication:</Typography><Typography>{selectedRequest.medicationName}</Typography></Grid>
              <Grid item xs={12} sm={6}><Typography variant="subtitle2">Dosage:</Typography><Typography>{selectedRequest.dosage}</Typography></Grid>
              <Grid item xs={12} sm={6}><Typography variant="subtitle2">Frequency:</Typography><Typography>{selectedRequest.frequency}</Typography></Grid>
              <Grid item xs={12} sm={6}><Typography variant="subtitle2">Status:</Typography>
                <Chip 
                  label={selectedRequest.status} 
                  color={
                    selectedRequest.status === 'PENDING' || selectedRequest.status === 'PENDING_APPROVAL' ? 'warning' : 
                    selectedRequest.status === 'APPROVED' ? 'success' :
                    selectedRequest.status === 'REJECTED' ? 'error' : 'default'
                  } 
                />
              </Grid>
              <Grid item xs={12} sm={6}><Typography variant="subtitle2">Start Date:</Typography><Typography>{formatDate(selectedRequest.startDate)}</Typography></Grid>
              <Grid item xs={12} sm={6}><Typography variant="subtitle2">End Date:</Typography><Typography>{formatDate(selectedRequest.endDate)}</Typography></Grid>
              <Grid item xs={12}><Typography variant="subtitle2">Reason for Medication:</Typography><Typography>{selectedRequest.reason || 'N/A'}</Typography></Grid>
              <Grid item xs={12}><Typography variant="subtitle2">Parent's Notes:</Typography><Typography>{selectedRequest.notes || 'N/A'}</Typography></Grid>
              <Grid item xs={12} sm={6}><Typography variant="subtitle2">Requested By:</Typography><Typography>{selectedRequest.parentFullName}</Typography></Grid>
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
                            <TableCell>{record.notes || '-'}</TableCell>
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
          {selectedRequest && (selectedRequest.status === 'PENDING' || selectedRequest.status === 'PENDING_APPROVAL') && (
            <>
              <Button 
                onClick={() => {
                  setViewDetailsDialogOpen(false);
                  handleOpenApproveConfirmation(selectedRequest);
                }}
                color="success" 
                variant="contained" 
                startIcon={<ApproveIcon />}
              >
                Approve
              </Button>
              <Button 
                onClick={() => {
                  setViewDetailsDialogOpen(false);
                  handleOpenRejectDialog(selectedRequest);
                }}
                color="error" 
                variant="contained" 
                startIcon={<RejectIcon />}
              >
                Reject
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog for Approving Request */}
      <Dialog open={approveConfirmationDialogOpen} onClose={() => setApproveConfirmationDialogOpen(false)}>
        <DialogTitle>Confirm Medication Request Approval</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <DialogContentText>
                Are you sure you want to approve this medication request?
              </DialogContentText>
            </Grid>
            {selectedRequest && (
              <>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Student:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{selectedRequest.studentFullName}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Requested By:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{selectedRequest.parentFullName}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Medication:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{selectedRequest.medicationName}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Dosage:</Typography>
                  <Typography variant="body1">{selectedRequest.dosage}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Schedule:</Typography>
                  <Typography variant="body1">{selectedRequest.frequency}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Duration:</Typography>
                  <Typography variant="body1">{formatDate(selectedRequest.startDate)} - {formatDate(selectedRequest.endDate)}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Alert severity="info" sx={{ mt: 2 }}>
                    By approving this request, you confirm that the medication can be safely administered to the student according to school policy.
                  </Alert>
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApproveConfirmationDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleApproveRequest} 
            color="success" 
            variant="contained" 
            startIcon={<ApproveIcon />}
            aria-label="Approve medication request"
          >
            Approve Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Rejecting Medication Request */}
      <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Reject Medication Request</DialogTitle>
        <form onSubmit={rejectForm.handleSubmit(handleRejectRequest)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Student:</Typography>
                <Typography variant="body1">{selectedRequest?.studentFullName}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Requested By:</Typography>
                <Typography variant="body1">{selectedRequest?.parentFullName}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Medication:</Typography>
                <Typography variant="body1">{selectedRequest?.medicationName} ({selectedRequest?.dosage})</Typography>
              </Grid>
              <Grid item xs={12}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  You can provide a reason for rejecting this medication request.
                  The parent will receive this information if provided.
                </Alert>
                <Controller
                  name="rejectionReason"
                  control={rejectForm.control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Reason for Rejection (Optional)"
                      multiline
                      rows={3}
                      fullWidth
                      autoFocus
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message || 'Leave blank if no reason needed'}
                      placeholder="Example: Doctor's prescription required"
                      onChange={(e) => {
                        field.onChange(e);
                        // Always clear any validation errors as this is optional
                        rejectForm.clearErrors('rejectionReason');
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="error" 
              startIcon={<RejectIcon />}
              aria-label="Submit rejection with reason"
              // Never disable the button since rejection reason is optional
            >
              Reject Request
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog for Administering Medication for a Request */}
      <Dialog open={administerDialogOpen} onClose={() => setAdministerDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Administer Medication</DialogTitle>
        <form onSubmit={recordAdministrationForm.handleSubmit(handleAdministerMedication)}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Student:</Typography>
                <Typography>{selectedRequest?.studentFullName}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Medication:</Typography>
                <Typography>{selectedRequest?.medicationName} ({selectedRequest?.dosage})</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Frequency:</Typography>
                <Typography>{selectedRequest?.frequency}</Typography>
              </Grid>
            </Grid>
            
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
                  placeholder="Optional notes about this medication administration"
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAdministerDialogOpen(false)}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              startIcon={<AdministerIcon />}
            >
              Record Administration
            </Button>
          </DialogActions>
        </form>
      </Dialog>

    </Box>
    // </LocalizationProvider>
  );
}

export default MedicationManagement;