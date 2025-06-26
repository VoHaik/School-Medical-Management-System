import React, { useState, useEffect, Fragment } from 'react';
import { TextField, Button, Grid, Typography, Paper, FormControl, InputLabel, Select, MenuItem, FormHelperText, Chip, OutlinedInput, Box, Checkbox, FormControlLabel, FormGroup, Snackbar, Alert, CircularProgress } from '@mui/material';
import axios from 'axios';
import axiosWithAuth from '../../utils/axiosWithAuth';
import GradeLevelSelector from '../shared/GradeLevelSelector';
import { useUIText } from '../../hooks/useUIText';
import { useGradeLevels } from '../../hooks/useGradeLevels';

const HealthEventForm = ({ onSubmit, initialData, isEdit = false }) => {
  const { t } = useUIText();
  const { formatGradeNumbersToString, parseGradeLevelsString } = useGradeLevels();
  
  const [formData, setFormData] = useState({
    eventName: '',
    eventType: 'HEALTH_CHECKUP',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    typesOfCheckups: [],
    targetGradeLevels: [], // Changed to array for better handling
    classesToNotify: []
  });
  
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Load list of classes from API when component mounts
  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        // Use the newly installed classes API
        const response = await axiosWithAuth().get('/api/classes');
        console.log('Classes API response:', response.data);
        setClasses(response.data);
      } catch (error) {
        console.error('Error loading class list:', error);
        console.log('Error details:', error.response?.data || error.message);
        
        // Use sample data if API fails
        setClasses([
          { classId: '1A', className: 'Class 1A' },
          { classId: '1B', className: 'Class 1B' },
          { classId: '2A', className: 'Class 2A' },
          { classId: '2B', className: 'Class 2B' },
          { classId: '3A', className: 'Class 3A' },
        ]);
        
        // Hiển thị thông báo lỗi nhưng không làm gián đoạn trải nghiệm người dùng
        setSnackbarMessage('Không thể tải danh sách lớp. Đang sử dụng dữ liệu mẫu.');
        setSnackbarSeverity('warning');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  useEffect(() => {
    if (initialData) {
      // Handle targetGradeLevels - convert from string to array if needed
      let targetGradeLevels = [];
      if (typeof initialData.targetGradeLevels === 'string' && initialData.targetGradeLevels) {
        // Parse grade levels from string like "Grade 1, Grade 3, Grade 5"
        targetGradeLevels = parseGradeLevelsString(initialData.targetGradeLevels)
          .map(num => num.toString());
      } else if (Array.isArray(initialData.targetGradeLevels)) {
        targetGradeLevels = initialData.targetGradeLevels.map(g => g.toString());
      }
      
      setFormData({
        eventName: initialData.eventName || '',
        eventType: initialData.eventType || 'HEALTH_CHECKUP',
        description: initialData.description || '',
        startDate: initialData.startDate ? initialData.startDate.split('T')[0] : '', // Assuming ISO string, take date part
        endDate: initialData.endDate ? initialData.endDate.split('T')[0] : '', // Assuming ISO string, take date part
        location: initialData.location || '',
        typesOfCheckups: initialData.typesOfCheckups || [],
        targetGradeLevels: targetGradeLevels,
        classesToNotify: initialData.classesToNotify || []
      });
      
      console.log('Initial form data set:', {
        ...initialData,
        targetGradeLevels
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleGradeLevelsChange = (selectedGrades) => {
    setFormData(prev => ({ ...prev, targetGradeLevels: selectedGrades }));
  };
  
  const handleClassToggle = (classId) => {
    setFormData(prev => {
      const currentClasses = prev.classesToNotify || [];
      if (currentClasses.includes(classId)) {
        return { ...prev, classesToNotify: currentClasses.filter(id => id !== classId) };
      } else {
        return { ...prev, classesToNotify: [...currentClasses, classId] };
      }
    });
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
      
      // Prepare data for submission
      const finalData = {...formData};
      
      // Convert targetGradeLevels array to string format for backend
      if (Array.isArray(finalData.targetGradeLevels)) {
        // Convert grade numbers back to grade names and join as string
        const gradeNames = finalData.targetGradeLevels.map(gradeNum => `Grade ${gradeNum}`);
        finalData.targetGradeLevels = gradeNames.join(', ');
      } else if (typeof finalData.targetGradeLevels !== 'string') {
        finalData.targetGradeLevels = '';
      }
      
      // Rename fields to match backend DTO
      finalData.scheduledDate = finalData.startDate;  // Map startDate to scheduledDate
      
      // For vaccination events, always need to select classes to manage
      if (formData.eventType === 'VACCINATION') {
        if (!finalData.classesToNotify || finalData.classesToNotify.length === 0) {
          setSnackbarMessage('Please select at least one class to manage the vaccination.');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
          return;
        }
      } else {
        // For health checkup events, no need to notify by class
        finalData.classesToNotify = [];
      }
      
      console.log('Submitting health checkup event data:', finalData);
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
              value={formData.targetGradeLevels}
              onChange={handleGradeLevelsChange}
              multiple={true}
              label={t.targetGradeLevels}
              helperText="Select one or more grade levels for this event (Grades 1-12 available)"
              required={true}
              sx={{ mb: 2 }}
            />
          </Grid>
          
          {formData.eventType === 'VACCINATION' && (
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Select Classes for Vaccination Management:</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Parents will receive vaccination notifications through the "Vaccine Consent" section
              </Typography>
              <FormGroup row>
                {loading ? (
                  <FormHelperText>Loading class list...</FormHelperText>
                ) : (
                  classes.map((cls) => (
                    <FormControlLabel
                      key={cls.classId}
                      control={
                        <Checkbox
                          checked={formData.classesToNotify?.includes(cls.classId) || false}
                          onChange={() => handleClassToggle(cls.classId)}
                        />
                      }
                      label={cls.className}
                    />
                  ))
                )}
              </FormGroup>
            </Grid>
          )}
          
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
