import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Button,
  TextField,
  CircularProgress,
  Alert,
  MenuItem,
  FormControl,
  FormHelperText,
  InputLabel,
  Select
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Medication as MedicationIcon,
  Save as SaveIcon
} from '@mui/icons-material';

const EditMedicationRequestPage = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({
    medicationName: '',
    dosage: '',
    frequency: '',
    startDate: null,
    endDate: null,
    reason: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Fetch the medication request details when component loads
  useEffect(() => {
    const fetchRequestDetails = async () => {
      if (!currentUser || !currentUser.accessToken) {
        setError("Authentication required. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`/api/medication-requests/${requestId}`, {
          headers: { Authorization: `Bearer ${currentUser.accessToken}` },
        });

        // Check if the request is pending, otherwise we can't edit it
        const status = response.data.status || 'PENDING';
        if (status !== 'PENDING') {
          setError("This medication request cannot be edited because it has already been processed.");
          setLoading(false);
          return;
        }

        // Set the form data from the response
        setFormData({
          studentCode: response.data.student?.studentCode || response.data.studentCode,
          medicationName: response.data.medicationName || '',
          dosage: response.data.dosage || '',
          frequency: response.data.frequency || '',
          startDate: response.data.startDate ? new Date(response.data.startDate) : null,
          endDate: response.data.endDate ? new Date(response.data.endDate) : null,
          reason: response.data.reason || ''
        });
      } catch (err) {
        console.error("Error fetching medication request details:", err);
        const errorMessage = err.response?.data?.error || err.message;
        setError(`Failed to load request details: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestDetails();
  }, [requestId, currentUser]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear the error for this field if it exists
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  // Handle date changes
  const handleDateChange = (name, date) => {
    setFormData({
      ...formData,
      [name]: date
    });
    
    // Clear the error for this field if it exists
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  // Validate the form data
  const validateForm = () => {
    const errors = {};
    
    if (!formData.medicationName.trim()) {
      errors.medicationName = "Medication name is required";
    }
    
    if (!formData.dosage.trim()) {
      errors.dosage = "Dosage is required";
    }
    
    if (!formData.frequency.trim()) {
      errors.frequency = "Frequency is required";
    }
    
    if (!formData.startDate) {
      errors.startDate = "Start date is required";
    }
    
    if (!formData.endDate) {
      errors.endDate = "End date is required";
    } else if (formData.startDate && formData.endDate && formData.endDate < formData.startDate) {
      errors.endDate = "End date cannot be before start date";
    }
    
    if (!formData.reason.trim()) {
      errors.reason = "Reason is required";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate the form
    if (!validateForm()) {
      return;
    }
    
    if (!currentUser || !currentUser.accessToken) {
      setError("Authentication required. Please log in again.");
      return;
    }
    
    setSubmitLoading(true);
    setError('');
      try {
      // Format dates properly for the API and ensure studentCode is passed
      const requestData = {
        ...formData,
        studentCode: formData.studentCode, // Make sure studentCode is included
        startDate: formData.startDate ? formData.startDate.toISOString().substring(0, 10) : null,
        endDate: formData.endDate ? formData.endDate.toISOString().substring(0, 10) : null,
      };
      
      // Submit the updated request
      const response = await axios.put(
        `/api/medication-requests/${requestId}`,
        requestData,
        { headers: { Authorization: `Bearer ${currentUser.accessToken}` } }
      );
      
      // Navigate back to the detail page with a success message
      navigate(`/parent/medication-request/${requestId}`, { 
        state: { alert: { severity: 'success', message: 'Medication request updated successfully' } }
      });
    } catch (err) {
      console.error("Error updating medication request:", err);
      const errorMessage = err.response?.data?.error || err.message;
      setError(`Failed to update request: ${errorMessage}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <MedicationIcon sx={{ mr: 1, fontSize: '2.5rem' }} color="primary" />
            Edit Medication Request
          </Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            onClick={() => navigate('/parent/medication-requests')}
          >
            Cancel
          </Button>
        </Box>
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Medication Name"
                name="medicationName"
                value={formData.medicationName}
                onChange={handleInputChange}
                error={!!formErrors.medicationName}
                helperText={formErrors.medicationName}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Dosage"
                name="dosage"
                value={formData.dosage}
                onChange={handleInputChange}
                error={!!formErrors.dosage}
                helperText={formErrors.dosage}
                required
                placeholder="e.g., 5ml, 1 tablet, etc."
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Frequency"
                name="frequency"
                value={formData.frequency}
                onChange={handleInputChange}
                error={!!formErrors.frequency}
                helperText={formErrors.frequency}
                required
                placeholder="e.g., Once daily, Twice a day, Every 4 hours, etc."
              />
            </Grid>            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                name="startDate"
                value={formData.startDate ? formData.startDate.toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  handleDateChange('startDate', date);
                }}
                error={!!formErrors.startDate}
                helperText={formErrors.startDate || ''}
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                name="endDate"
                value={formData.endDate ? formData.endDate.toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  handleDateChange('endDate', date);
                }}
                error={!!formErrors.endDate}
                helperText={formErrors.endDate || ''}
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reason for Medication"
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                error={!!formErrors.reason}
                helperText={formErrors.reason}
                required
                multiline
                rows={4}
              />
            </Grid>
            
            <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={submitLoading}
                startIcon={submitLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                size="large"
              >
                {submitLoading ? "Saving..." : "Save Changes"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default EditMedicationRequestPage;
