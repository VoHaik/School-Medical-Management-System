import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Paper, Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, CircularProgress, Alert, Grid } from '@mui/material';
import { Medication as MedicationIcon } from '@mui/icons-material';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

// Define initial empty state for the form for resetting
const initialFormData = {
  studentCode: '',
  medicationName: '',
  dosage: '',
  frequency: '',
  startDate: '',
  endDate: '',
  reason: '',
  notes: ''
};

const SubmitMedicationPage = () => {
  const { currentUser } = useContext(AuthContext);
  const [children, setChildren] = useState([]);
  const [loadingChildren, setLoadingChildren] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState(initialFormData); // Use initialFormData
  const [loadingSubmit, setLoadingSubmit] = useState(false); // New state for submission loading

  useEffect(() => {
    const fetchChildren = async () => {
      if (!currentUser || !currentUser.username) {
        setError('Parent information not available.');
        setLoadingChildren(false);
        return;
      }
      try {
        setLoadingChildren(true);
        const response = await axios.get(`/api/parent/students`, {
          headers: { Authorization: `Bearer ${currentUser.accessToken}` },
        });
        if (Array.isArray(response.data)) {
            setChildren(response.data);
        } else if (response.data && Array.isArray(response.data.students)) {
            setChildren(response.data.students);
        } else if (response.data && Array.isArray(response.data.children)) {
             setChildren(response.data.children);
        }
        else {
            setChildren([]);
        }
      } catch (err) {
        console.error("Error fetching children:", err);
        setError('Failed to fetch children list. ' + (err.response?.data?.message || err.message));
      } finally {
        setLoadingChildren(false);
      }
    };

    if (currentUser && currentUser.accessToken) {
      fetchChildren();
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Frontend Validation for required fields
    if (!formData.studentCode) {
      setError("Please select a student.");
      return;
    }
    if (!formData.medicationName.trim()) {
      setError("Medication Name cannot be empty.");
      return;
    }
    if (!formData.dosage.trim()) {
      setError("Dosage cannot be empty.");
      return;
    }
    if (!formData.frequency.trim()) {
      setError("Frequency cannot be empty.");
      return;
    }
    if (!formData.startDate) {
      setError("Start Date cannot be empty.");
      return;
    }
    if (!formData.endDate) {
      setError("End Date cannot be empty.");
      return;
    }
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setError("End Date cannot be before Start Date.");
      return;
    }
    if (!formData.reason.trim()) {
      setError("Reason for Medication cannot be empty.");
      return;
    }

    setLoadingSubmit(true);
    try {
      // Assuming API endpoint is POST /api/medication-requests
      const response = await axios.post('/api/medication-requests', formData, {
        headers: { Authorization: `Bearer ${currentUser.accessToken}` },
      });
      
      setSuccessMessage(response.data?.message || 'Medication request submitted successfully!');
      setFormData(initialFormData); // Reset form on success
    } catch (err) {
      console.error("Error submitting medication request:", err);
      setError('Failed to submit medication request. ' + (err.response?.data?.message || err.message));
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <MedicationIcon sx={{ mr: 1, fontSize: '2.5rem' }} color="primary" />
          <Typography variant="h4" component="h1">
            Submit Medication Request
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel id="student-select-label">Select Student</InputLabel>
                {loadingChildren ? (
                  <CircularProgress size={24} />
                ) : (
                  <Select
                    labelId="student-select-label"
                    id="studentCode"
                    name="studentCode"
                    value={formData.studentCode}
                    label="Select Student"
                    onChange={handleChange}
                  >
                    <MenuItem value="">
                      <em>Select a student</em>
                    </MenuItem>
                    {children.length > 0 ? (
                        children.map((child) => (
                        <MenuItem key={child.studentCode} value={child.studentCode}>
                            {child.firstName} {child.lastName} ({child.studentCode})
                        </MenuItem>
                        ))
                    ) : (
                        <MenuItem value="" disabled>
                            No children found or unable to load children.
                        </MenuItem>
                    )}
                  </Select>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="medicationName"
                name="medicationName"
                label="Medication Name"
                value={formData.medicationName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="dosage"
                name="dosage"
                label="Dosage (e.g., 1 tablet, 10ml)"
                value={formData.dosage}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="frequency"
                name="frequency"
                label="Frequency (e.g., Twice a day)"
                value={formData.frequency}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="startDate"
                name="startDate"
                label="Start Date"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="endDate"
                name="endDate"
                label="End Date"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="reason"
                name="reason"
                label="Reason for Medication"
                multiline
                rows={3}
                value={formData.reason}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="notes"
                name="notes"
                label="Additional Notes (Optional)"
                multiline
                rows={3}
                value={formData.notes}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} disabled={loadingSubmit}>
                {loadingSubmit ? <CircularProgress size={24} /> : 'Submit Request'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default SubmitMedicationPage;
