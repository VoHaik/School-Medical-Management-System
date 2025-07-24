import React, { useState, useEffect, Fragment } from 'react';
import { TextField, Button, Grid, Typography, Paper, FormControl, InputLabel, Select, MenuItem, FormHelperText, Chip, OutlinedInput, Box, Snackbar, Alert, CircularProgress } from '@mui/material';
import axios from 'axios';
import apiClient, { getAllHealthCheckupTypes, getAllVaccines } from '../../utils/api';
import GradeLevelSelector from '../shared/GradeLevelSelector';
import { useUIText } from '../../hooks/useUIText';
import { useGradeLevels } from '../../hooks/useGradeLevels';
import { useAuth } from '../../context/AuthContext';

const HealthEventForm = ({ onSubmit, initialData, isEdit = false }) => {
  const { t } = useUIText();
  const { gradeLevels, loading: gradeLevelsLoading, formatGradeNumbersToString, parseGradeLevelsString } = useGradeLevels();
  const { currentUser, loading: authLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    eventName: '',
    eventType: 'HEALTH_CHECKUP',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    typesOfCheckups: [], // Ensure this is always an array
    selectedVaccines: [], // Add vaccines array for vaccination events
    targetGradeNames: [] // Changed to use names for backend compatibility
  });
  
  const [vaccines, setVaccines] = useState([]);
  const [vaccinesLoading, setVaccinesLoading] = useState(false);
  const [healthCheckupTypes, setHealthCheckupTypes] = useState([]);
  const [checkupTypesLoading, setCheckupTypesLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Fetch vaccines from API
  const fetchVaccines = async () => {
    try {
      setVaccinesLoading(true);
      const response = await getAllVaccines();
      
      if (response && Array.isArray(response) && response.length > 0) {
        setVaccines(response);
      } else {
        // Fallback vaccines data
        const fallbackVaccines = [
          { vaccineId: 1, name: 'MMR', diseaseTargeted: 'Measles, Mumps, Rubella' },
          { vaccineId: 2, name: 'DTaP', diseaseTargeted: 'Diphtheria, Tetanus, Pertussis' },
          { vaccineId: 3, name: 'Polio (IPV)', diseaseTargeted: 'Poliomyelitis' },
          { vaccineId: 4, name: 'Hepatitis B', diseaseTargeted: 'Hepatitis B' },
          { vaccineId: 5, name: 'Varicella', diseaseTargeted: 'Chickenpox' },
          { vaccineId: 6, name: 'Influenza', diseaseTargeted: 'Seasonal Flu' },
          { vaccineId: 7, name: 'HPV', diseaseTargeted: 'Human Papillomavirus' },
          { vaccineId: 8, name: 'COVID-19', diseaseTargeted: 'COVID-19' }
        ];
        setVaccines(fallbackVaccines);
      }
    } catch (error) {
      console.error('Error fetching vaccines:', error);
      
      // Use fallback data when API fails
      const fallbackVaccines = [
        { vaccineId: 1, name: 'MMR', diseaseTargeted: 'Measles, Mumps, Rubella' },
        { vaccineId: 2, name: 'DTaP', diseaseTargeted: 'Diphtheria, Tetanus, Pertussis' },
        { vaccineId: 3, name: 'Polio (IPV)', diseaseTargeted: 'Poliomyelitis' },
        { vaccineId: 4, name: 'Hepatitis B', diseaseTargeted: 'Hepatitis B' },
        { vaccineId: 5, name: 'Varicella', diseaseTargeted: 'Chickenpox' },
        { vaccineId: 6, name: 'Influenza', diseaseTargeted: 'Seasonal Flu' },
        { vaccineId: 7, name: 'HPV', diseaseTargeted: 'Human Papillomavirus' },
        { vaccineId: 8, name: 'COVID-19', diseaseTargeted: 'COVID-19' }
      ];
      setVaccines(fallbackVaccines);
      
      setSnackbarMessage('Using default vaccines list (API connection failed)');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
    } finally {
      setVaccinesLoading(false);
    }
  };

  // Fetch health checkup types from API
  const fetchHealthCheckupTypes = async () => {
    try {
      setCheckupTypesLoading(true);
      
      // Try to fetch from API first
      try {
        const response = await getAllHealthCheckupTypes();
        const transformedTypes = response?.map(type => ({
          value: type.checkupTypeId, // Use ID as value
          label: type.typeName,
          description: type.description
        })) || [];
        
        if (transformedTypes.length > 0) {
          setHealthCheckupTypes(transformedTypes);
          return;
        }
      } catch (apiError) {
        }
      
      // Fallback to hardcoded data if API fails
      const fallbackTypes = [
        { value: 1, label: 'General Physical Examination', description: 'Comprehensive physical health checkup' },
        { value: 2, label: 'Vision Test', description: 'Eye sight and vision assessment' },
        { value: 3, label: 'Hearing Test', description: 'Hearing ability assessment' },
        { value: 4, label: 'Height and Weight Measurement', description: 'Growth and development tracking' },
        { value: 5, label: 'Blood Pressure Check', description: 'Cardiovascular health monitoring' },
        { value: 6, label: 'Dental Examination', description: 'Oral health and dental checkup' },
        { value: 7, label: 'Basic Health Screening', description: 'Basic general health screening' },
        { value: 8, label: 'Vaccination Check', description: 'Immunization status verification' },
        { value: 9, label: 'Mental Health Assessment', description: 'Psychological wellbeing evaluation' },
        { value: 10, label: 'Sports Physical', description: 'Sports participation health clearance' }
      ];
      
      setHealthCheckupTypes(fallbackTypes);
      
    } catch (error) {
      console.error('Error fetching health checkup types:', error);
      setSnackbarMessage('Failed to load health checkup types');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      // Fallback to empty array if everything fails
      setHealthCheckupTypes([]);
    } finally {
      setCheckupTypesLoading(false);
    }
  };

  // Fetch vaccines and checkup types when component mounts and user is authenticated
  useEffect(() => {
    if (currentUser && !authLoading) {
      fetchVaccines();
      fetchHealthCheckupTypes();
    }
  }, [currentUser, authLoading]);
  
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
        typesOfCheckups: Array.isArray(initialData.typesOfCheckups) ? initialData.typesOfCheckups : [], // Ensure it's always an array
        selectedVaccines: Array.isArray(initialData.selectedVaccines) ? initialData.selectedVaccines : [], // Handle selected vaccines
        targetGradeNames: targetGradeNames
      });
    }
  }, [initialData, gradeLevels, parseGradeLevelsString]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleGradeLevelsChange = (selectedGrades) => {
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
      
      // Validate selectedVaccines only for VACCINATION events
      if (formData.eventType === 'VACCINATION') {
        if (!formData.selectedVaccines || formData.selectedVaccines.length === 0) {
          setSnackbarMessage('At least one vaccine type must be selected for vaccination events.');
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
      
      // Remove selectedVaccines if not needed (for HEALTH_CHECKUP events) 
      if (formData.eventType !== 'VACCINATION') {
        delete finalData.selectedVaccines;
      }
      
      // Rename fields to match backend DTO
      finalData.scheduledDate = finalData.startDate;  // Map startDate to scheduledDate
      
      onSubmit(finalData);
      
    } catch (error) {
      console.error('Error in form submission:', error);
      setSnackbarMessage('An error occurred while submitting the form. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };
  
  // Close notification
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  // Get health checkup types from state (loaded from API)
  const getHealthCheckupTypes = () => {
    return healthCheckupTypes;
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
              label={formData.eventType === 'VACCINATION' ? 'Vaccine Description' : 'Description'}
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
              placeholder={formData.eventType === 'VACCINATION' 
                ? 'Enter vaccine description or details'
                : 'Enter event description'
              }
              helperText={formData.eventType === 'VACCINATION' 
                ? 'Provide details about the vaccination event'
                : 'Provide details about the health event'
              }
            />
            
            {/* Show vaccine dropdown for VACCINATION events */}
            {formData.eventType === 'VACCINATION' && (
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="vaccines-select-label">Select Vaccines</InputLabel>
                <Select
                  labelId="vaccines-select-label"
                  multiple
                  value={Array.isArray(formData.selectedVaccines) ? formData.selectedVaccines : []}
                  onChange={(e) => {
                    const selectedVaccines = Array.isArray(e.target.value) ? e.target.value : [];
                    setFormData(prev => ({
                      ...prev,
                      selectedVaccines: selectedVaccines
                    }));
                  }}
                  input={<OutlinedInput label="Select Vaccines" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((vaccineId) => {
                        const vaccine = vaccines.find(vac => vac.vaccineId.toString() === vaccineId);
                        const label = vaccine ? vaccine.name : vaccineId;
                        return <Chip key={vaccineId} label={label} size="small" />;
                      })}
                    </Box>
                  )}
                  disabled={vaccinesLoading}
                >
                  {vaccinesLoading ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} />
                      <Typography sx={{ ml: 1 }}>Loading vaccines...</Typography>
                    </MenuItem>
                  ) : (
                    vaccines.map((vaccine) => (
                      <MenuItem key={vaccine.vaccineId} value={vaccine.vaccineId.toString()}>
                        <Typography variant="body2">
                          <strong>{vaccine.name}</strong>
                          {vaccine.diseaseTargeted && (
                            <Typography component="span" variant="caption" color="text.secondary">
                              {' - '}{vaccine.diseaseTargeted}
                            </Typography>
                          )}
                        </Typography>
                      </MenuItem>
                    ))
                  )}
                </Select>
                <FormHelperText>
                  {vaccinesLoading ? 'Loading vaccines from database...' : 'Select one or more vaccines from the database'}
                </FormHelperText>
              </FormControl>
            )}

            {/* Show checkup types for HEALTH_CHECKUP events */}
            {formData.eventType === 'HEALTH_CHECKUP' && (
              <>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel id="checkup-types-label">Checkup Types</InputLabel>
                  <Select
                    labelId="checkup-types-label"
                    multiple
                    value={Array.isArray(formData.typesOfCheckups) ? formData.typesOfCheckups : []}
                    onChange={(e) => setFormData({...formData, typesOfCheckups: Array.isArray(e.target.value) ? e.target.value : []})}
                    input={<OutlinedInput label="Checkup Types" />}
                    disabled={checkupTypesLoading}
                    renderValue={(selected) => {
                      // Ensure selected is an array before mapping
                      const selectedArray = Array.isArray(selected) ? selected : [];
                      return (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selectedArray.map((value) => {
                            const type = getHealthCheckupTypes().find(t => t.value === value);
                            return <Chip key={value} label={type ? type.label : value} />;
                          })}
                        </Box>
                      );
                    }}
                  >
                    {checkupTypesLoading ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        <Typography sx={{ ml: 1 }}>Loading checkup types...</Typography>
                      </MenuItem>
                    ) : (
                      getHealthCheckupTypes().map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          <Typography variant="body2">
                            <strong>{type.label}</strong>
                            {type.description && (
                              <Typography component="span" variant="caption" color="text.secondary" display="block">
                                {type.description}
                              </Typography>
                            )}
                          </Typography>
                        </MenuItem>
                      ))
                    )}
                  </Select>
                  <FormHelperText>
                    {checkupTypesLoading ? 'Loading checkup types from database...' : 'Select one or more checkup types from the database'}
                  </FormHelperText>
                </FormControl>
              </>
            )}
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
