import React, { useState, useEffect, Fragment } from 'react';
import { TextField, Button, Grid, Typography, Paper, FormControl, InputLabel, Select, MenuItem, FormHelperText, Chip, OutlinedInput, Box, Snackbar, Alert, CircularProgress } from '@mui/material';
import axios from 'axios';
import axiosWithAuth from '../../utils/axiosWithAuth';
import GradeLevelSelector from '../shared/GradeLevelSelector';
import { useUIText } from '../../hooks/useUIText';
import { useGradeLevels } from '../../hooks/useGradeLevels';

const HealthEventForm = ({ onSubmit, initialData, isEdit = false }) => {
  const { t } = useUIText();
  const { gradeLevels, loading: gradeLevelsLoading, formatGradeNumbersToString, parseGradeLevelsString } = useGradeLevels();
  
  // Debug logging
  console.log('HealthEventForm - gradeLevels:', gradeLevels);
  console.log('HealthEventForm - gradeLevelsLoading:', gradeLevelsLoading);
  console.log('HealthEventForm - initialData:', initialData);
  console.log('HealthEventForm - isEdit:', isEdit);
  
  const [formData, setFormData] = useState({
    eventName: '',
    eventType: 'HEALTH_CHECKUP',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    typesOfCheckups: [],
    targetGradeNames: [] // Changed to use names for backend compatibility
  });
  
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    if (initialData && gradeLevels.length > 0) {
      // Handle targetGradeNames - convert from existing data
      let targetGradeNames = [];
      if (initialData.targetGradeNames && Array.isArray(initialData.targetGradeNames)) {
        targetGradeNames = initialData.targetGradeNames;
      } else if (initialData.targetGradeIds && Array.isArray(initialData.targetGradeIds)) {
        // Convert grade IDs to names if needed
        targetGradeNames = initialData.targetGradeIds.map(id => {
          const gradeLevel = gradeLevels.find(gl => gl.gradeId === id);
          return gradeLevel ? gradeLevel.gradeName : null;
        }).filter(name => name !== null);
      } else if (typeof initialData.targetGradeLevels === 'string' && initialData.targetGradeLevels) {
        // Legacy support for string format
        const gradeNumbers = parseGradeLevelsString(initialData.targetGradeLevels);
        targetGradeNames = gradeNumbers.map(gradeNum => `Grade ${gradeNum}`);
      }
      
      // Handle dates - support both scheduledDate and startDate/endDate
      let startDate = '';
      let endDate = '';
      
      if (initialData.scheduledDate) {
        // If scheduledDate exists, use it for both start and end
        const dateStr = typeof initialData.scheduledDate === 'string' ? 
          initialData.scheduledDate.split('T')[0] : 
          initialData.scheduledDate;
        startDate = dateStr;
        endDate = dateStr;
      } else {
        // Use individual start/end dates if available
        startDate = initialData.startDate ? 
          (typeof initialData.startDate === 'string' ? initialData.startDate.split('T')[0] : initialData.startDate) : '';
        endDate = initialData.endDate ? 
          (typeof initialData.endDate === 'string' ? initialData.endDate.split('T')[0] : initialData.endDate) : '';
      }
      
      setFormData({
        eventName: initialData.eventName || '',
        eventType: initialData.eventType || 'HEALTH_CHECKUP',
        description: initialData.description || '',
        startDate: startDate,
        endDate: endDate,
        location: initialData.location || '',
        typesOfCheckups: initialData.typesOfCheckups || [],
        targetGradeNames: targetGradeNames
      });
      
      console.log('Form populated with initial data:', {
        ...initialData,
        targetGradeNames,
        startDate,
        endDate
      });
    }
  }, [initialData, gradeLevels, parseGradeLevelsString]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleGradeLevelsChange = (selectedGrades) => {
    console.log('Grade levels changed to:', selectedGrades);
    setFormData(prev => ({ ...prev, targetGradeNames: selectedGrades }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      // Basic validation
      if (!formData.eventName || !formData.startDate || !formData.endDate) {
        setSnackbarMessage('Event name, start date and end date are required.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }
      
      if (!formData.targetGradeNames || formData.targetGradeNames.length === 0) {
        setSnackbarMessage('At least one target grade level must be selected.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }
      
      // Validate typesOfCheckups only for HEALTH_CHECKUP events
      if (formData.eventType === 'HEALTH_CHECKUP') {
        if (!formData.typesOfCheckups || formData.typesOfCheckups.length === 0) {
          setSnackbarMessage('At least one checkup type must be selected for health checkup events.');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
          return;
        }
      }
      
      // Prepare data for submission - targetGradeIds is already in correct format
      const finalData = {...formData};
      
      // Remove typesOfCheckups if not needed (for VACCINATION events)
      if (formData.eventType !== 'HEALTH_CHECKUP') {
        delete finalData.typesOfCheckups;
      }
      
      // Rename fields to match backend DTO
      finalData.scheduledDate = finalData.startDate;  // Map startDate to scheduledDate
      
      console.log('Submitting health checkup event data:', finalData);
      console.log('Target grade names being sent:', finalData.targetGradeNames);
      onSubmit(finalData);
      
    } catch (error) {
      console.error('Error in form submission:', error);
      setSnackbarMessage('An error occurred while submitting the form. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // State để lưu giá trị nhập thủ công của loại khám/tiêm chủng
  const [customCheckupType, setCustomCheckupType] = useState('');
  
  // Xử lý thêm loại khám/tiêm chủng tùy chỉnh
  const handleAddCustomCheckupType = () => {
    if (customCheckupType && customCheckupType.trim() !== '') {
      // Tạo giá trị duy nhất cho loại tùy chỉnh bằng cách chuyển đổi thành UPPERCASE và thay thế khoảng trắng bằng dấu gạch dưới
      const customValue = 'CUSTOM_' + customCheckupType.trim().toUpperCase().replace(/\s+/g, '_');
      
      // Kiểm tra xem đã tồn tại trong danh sách chưa
      if (!formData.typesOfCheckups.includes(customValue)) {
        setFormData(prev => ({
          ...prev,
          typesOfCheckups: [...prev.typesOfCheckups, customValue]
        }));
        
        // Display success message
        setSnackbarMessage(`Added "${customCheckupType.trim()}" to the list.`);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } else {
        // Display already exists message
        setSnackbarMessage(`"${customCheckupType.trim()}" is already in the list.`);
        setSnackbarSeverity('info');
        setSnackbarOpen(true);
      }
      
      // Clear input value after adding
      setCustomCheckupType('');
    }
  };
  
  // Handle Enter key when inputting custom checkup/vaccine type
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && customCheckupType.trim() !== '') {
      e.preventDefault(); // Prevent form submission
      handleAddCustomCheckupType();
    }
  };
  
  // Close notification
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  // Types of checkups that can be chosen based on event type
  const getCheckupTypes = () => {
    // Default list
    const defaultTypes = formData.eventType === 'HEALTH_CHECKUP' 
      ? [
          { value: 'VISION', label: 'Vision Check' },
          { value: 'HEARING', label: 'Hearing Test' },
          { value: 'DENTAL', label: 'Dental Examination' },
          { value: 'HEIGHT_WEIGHT', label: 'Height/Weight Measurement' },
          { value: 'GENERAL', label: 'General Checkup' }
        ]
      : [
          { value: 'BCG', label: 'BCG Vaccine (Tuberculosis)' },
          { value: 'DPT', label: 'DPT Vaccine (Diphtheria, Pertussis, Tetanus)' },
          { value: 'POLIO', label: 'Polio Vaccine' },
          { value: 'MEASLES', label: 'Measles Vaccine' },
          { value: 'MMR', label: 'MMR Vaccine (Measles, Mumps, Rubella)' },
          { value: 'HEP_B', label: 'Hepatitis B Vaccine' },
          { value: 'OTHER', label: 'Other Vaccine Types' }
        ];
    
    // Add custom types to the list
    const customTypes = formData.typesOfCheckups
      .filter(type => type.startsWith('CUSTOM_'))
      .map(type => ({
        value: type,
        label: type.replace('CUSTOM_', '').replace(/_/g, ' ').toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      }));
    
    return [...defaultTypes, ...customTypes];
  };

  return (
    <Fragment>
      <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          {isEdit ? 'Edit Event' : 'Create New Event'}
        </Typography>
        
        {gradeLevelsLoading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
            <Typography variant="body2" sx={{ ml: 2 }}>
              Loading grade levels...
            </Typography>
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Event Name"
              name="eventName"
              value={formData.eventName}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel id="event-type-label">Event Type</InputLabel>
              <Select
                labelId="event-type-label"
                id="eventType"
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                label="Event Type"
              >
                <MenuItem value="HEALTH_CHECKUP">General Health Checkup</MenuItem>
                <MenuItem value="VACCINATION">Vaccination</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="checkup-types-label">Checkup/Vaccination Types</InputLabel>
              <Select
                labelId="checkup-types-label"
                multiple
                value={formData.typesOfCheckups || []}
                onChange={(e) => setFormData({...formData, typesOfCheckups: e.target.value})}
                input={<OutlinedInput label="Checkup/Vaccination Types" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const type = getCheckupTypes().find(t => t.value === value);
                      return <Chip key={value} label={type ? type.label : value} />;
                    })}
                  </Box>
                )}
              >
                {getCheckupTypes().map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Select one or more types</FormHelperText>
            </FormControl>
            
            {/* Custom checkup/vaccination type input */}
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={9}>
                <TextField
                  fullWidth
                  label="Add Custom Checkup/Vaccination Type"
                  value={customCheckupType}
                  onChange={(e) => setCustomCheckupType(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter new checkup/vaccination type"
                />
              </Grid>
              <Grid item xs={3}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddCustomCheckupType}
                  fullWidth
                  disabled={!customCheckupType.trim()}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="End Date"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          
          <Grid item xs={12}>
            <GradeLevelSelector
              value={formData.targetGradeNames}
              onChange={handleGradeLevelsChange}
              multiple={true}
              label={t.targetGradeLevels}
              helperText="Select one or more grade levels for this event (Grades 1-12 available)"
              required={true}
              sx={{ mb: 2 }}
            />
          </Grid>
          
          {formData.eventType === 'HEALTH_CHECKUP' && (
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="primary" gutterBottom>
                <strong>Automatic Notification:</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Health checkup events will automatically appear in the "Upcoming Checkups" section for parents
              </Typography>
            </Grid>
          )}
          
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              {isEdit ? 'Save Changes' : 'Create Event'}
            </Button>
          </Grid>
        </Grid>
      </form>
        )}
      </Paper>
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Fragment>
  );
};

export default HealthEventForm;
