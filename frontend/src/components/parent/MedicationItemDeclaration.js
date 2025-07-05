import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Button,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import authHeader from '../../services/auth-header';

/**
 * Enhanced component for editing a medication item within the Health Declaration form.
 * This component allows parents to select from approved medications for their children.
 * It also allows parents to enter custom medication information when no approved medications
 * are available, which will automatically create a medication request.
 * 
 * @param {Object} medication - The medication object with properties: name, dosage, frequency, instructions
 * @param {Number} index - The index of this medication in the array
 * @param {Function} onChange - Function to call when a medication field changes
 * @param {Function} onRemove - Function to call to remove this medication from the array
 * @param {String} studentCode - The student code to fetch approved medications for
 */
const MedicationItemDeclaration = ({ medication = {}, index, onChange, onRemove, studentCode }) => {
  const [approvedMedications, setApprovedMedications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  const [selectedMedicationId, setSelectedMedicationId] = useState(medication.medicationId || '');
  const fetchApprovedMedications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {      const response = await axios.get(
        `/api/health-declaration/approved-medications?studentCode=${studentCode}`,
        { headers: authHeader() }
      );
      setApprovedMedications(response.data);
    } catch (err) {
      console.error('Error fetching approved medications:', err);
      setError('Could not load approved medications. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [studentCode]);
  
  useEffect(() => {
    // Chỉ tải khi có studentCode
    if (studentCode) {
      fetchApprovedMedications();
    }
  }, [studentCode, fetchApprovedMedications]);
  // When user selects a medication from approved list
  const handleMedicationSelect = (e) => {
    const medicationId = e.target.value;
    setSelectedMedicationId(medicationId);
    
    // Find the selected medication
    const selected = approvedMedications.find(med => med.medicationId === medicationId);
    
    if (selected) {
      // Update all medication information from selected medication
      onChange(index, { target: { name: 'medicationId', value: selected.medicationId } });
      onChange(index, { target: { name: 'name', value: selected.medicationName } });
      onChange(index, { target: { name: 'dosage', value: selected.dosage } });
      onChange(index, { target: { name: 'frequency', value: selected.frequency } });
      onChange(index, { target: { name: 'instructions', value: selected.notes || '' } });
      onChange(index, { target: { name: 'isCustomMedication', value: false } });
    }
  };
    if (typeof onChange !== 'function') {
    console.error('MedicationItemDeclaration: onChange is not a function');
    return null;
  }

  const handleChange = (property) => (e) => {
    onChange(index, { target: { name: property, value: e.target.value } });
  };
  return (
    <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: 'background.paper', position: 'relative' }}>
      <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
        <IconButton 
          aria-label="delete medication" 
          onClick={() => onRemove(index)}
          size="small"
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      </Box>
      
      <Typography variant="subtitle1" fontWeight="medium" mb={2}>
        Medication #{index + 1}
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 2 }}>
          <CircularProgress size={24} />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
            Loading approved medications...
          </Typography>
        </Box>
      ) : error ? (
        <Box sx={{ color: 'error.main', mb: 2 }}>
          <Typography variant="body2" color="error" gutterBottom>
            {error}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Button 
              variant="outlined" 
              color="primary" 
              size="small"
              onClick={fetchApprovedMedications}
              sx={{ mr: 1 }}
            >
              Retry
            </Button>
          </Box>          <Box sx={{ mt: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="small"
              onClick={() => window.location.href = '/parent/medication-request'}
            >
              Create New Medication Request
            </Button>
          </Box>
        </Box>
      ) : (        <FormControl fullWidth sx={{ mb: 2, mt: 2 }}>
          <InputLabel id={`select-approved-medication-${index}`}>Select Approved Medication</InputLabel>
          <Select
            labelId={`select-approved-medication-${index}`}
            value={selectedMedicationId}
            label="Select Approved Medication"
            onChange={handleMedicationSelect}
          >
            {approvedMedications.length === 0 ? (
              <MenuItem disabled value="">
                <em>No approved medications found. Please submit a medication request first.</em>
              </MenuItem>
            ) : (
              approvedMedications.map((med) => (
                <MenuItem key={med.medicationId} value={med.medicationId}>
                  {med.medicationName} - {med.dosage} ({med.frequency})
                </MenuItem>
              ))
            )}
          </Select>
          <FormHelperText>
            Only medications approved by the school nurse appear here.
          </FormHelperText>
          {approvedMedications.length === 0 && (
            <Button 
              variant="contained" 
              color="primary" 
              size="small" 
              fullWidth
              sx={{ mt: 1 }}
              onClick={() => window.location.href = '/parent/medication-request'}
            >
              Create New Medication Request
            </Button>
          )}
        </FormControl>
      )}
        {/* Display medication details */}
      <Grid container spacing={2}>        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Medication Name"
            name="name"
            value={medication.name || ''}
            onChange={handleChange('name')}
            placeholder="Enter medication name"
            size="small"
            required
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Dosage"
            name="dosage"
            value={medication.dosage || ''}
            onChange={handleChange('dosage')}
            placeholder="e.g., 250mg"
            size="small"
            required
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Frequency"
            name="frequency"
            value={medication.frequency || ''}
            onChange={handleChange('frequency')}
            placeholder="e.g., Twice daily"
            size="small"
            required
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Special Instructions"
            name="instructions"
            value={medication.instructions || ''}
            onChange={handleChange('instructions')}
            placeholder="Any special instructions (optional)"
            size="small"
            multiline
            rows={2}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default MedicationItemDeclaration;
