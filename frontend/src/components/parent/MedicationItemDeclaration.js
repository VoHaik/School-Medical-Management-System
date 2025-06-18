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
 * Component for editing a medication item within the Health Declaration form.
 * This component allows parents to select from approved medications for their children.
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
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/health-declaration/approved-medications?studentCode=${studentCode}`,
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
  
  // Khi người dùng chọn một loại thuốc từ danh sách
  const handleMedicationSelect = (e) => {
    const medicationId = e.target.value;
    setSelectedMedicationId(medicationId);
    
    // Tìm thuốc được chọn từ danh sách
    const selected = approvedMedications.find(med => med.medicationId === medicationId);
    
    if (selected) {
      // Cập nhật tất cả thông tin thuốc từ thuốc được chọn
      onChange(index, { target: { name: 'medicationId', value: selected.medicationId } });
      onChange(index, { target: { name: 'name', value: selected.medicationName } });
      onChange(index, { target: { name: 'dosage', value: selected.dosage } });
      onChange(index, { target: { name: 'frequency', value: selected.frequency } });
      onChange(index, { target: { name: 'instructions', value: selected.notes || '' } });
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
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress size={24} />
        </Box>
      ) : error ? (
        <Box sx={{ color: 'error.main', mb: 2 }}>
          {error}
          <Button 
            variant="outlined" 
            color="primary" 
            size="small" 
            sx={{ mt: 1 }}
            onClick={() => window.location.href = '/parent/medication-request'}
          >
            Create Medication Request
          </Button>
        </Box>
      ) : (<FormControl fullWidth sx={{ mb: 2 }}>
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
            Only medications approved by the school nurse will appear here. 
            If you need a new medication, please submit a medication request first.
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
