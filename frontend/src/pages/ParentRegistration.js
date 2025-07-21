import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { submitParentRegistration } from '../services/api';

function ParentRegistration() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);
  
  const [formData, setFormData] = useState({
    parentCode: '',
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    studentCode: '',
    studentName: '',
    relationship: ''
  });

  const [errors, setErrors] = useState({});

  const relationships = [
    { value: 'Father', label: 'Father' },
    { value: 'Mother', label: 'Mother' },
    { value: 'Guardian', label: 'Guardian' },
    { value: 'Grandparent', label: 'Grandparent' },
    { value: 'Other', label: 'Other' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    const requiredFields = [
      'parentCode', 'username', 'password', 'confirmPassword',
      'fullName', 'email', 'phoneNumber', 'studentCode', 
      'studentName', 'relationship'
    ];

    requiredFields.forEach(field => {
      if (!formData[field] || formData[field].trim() === '') {
        newErrors[field] = 'This field is required';
      }
    });

    // Password validation
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password confirmation does not match';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10,11}$/;
    if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be 10-11 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setValidationErrors([]);

    try {
      const { confirmPassword, ...submitData } = formData;
      
      const response = await submitParentRegistration(submitData);
      
      if (response.success) {
        setSuccess(true);
        setFormData({
          parentCode: '',
          username: '',
          password: '',
          confirmPassword: '',
          fullName: '',
          email: '',
          phoneNumber: '',
          studentCode: '',
          studentName: '',
          relationship: ''
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        if (errorData.errorType === 'VALIDATION_ERROR' && errorData.errors) {
          // Hiển thị validation errors dưới dạng list
          setValidationErrors(errorData.errors);
          setError('Please fix the following issues:');
        } else if (errorData.message) {
          // Hiển thị general error message
          setError(errorData.message);
        } else {
          setError('Registration failed. Please check your information and try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  if (success) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box textAlign="center">
            <Typography variant="h4" color="primary" gutterBottom>
              Registration Successful!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Your registration request has been submitted successfully. 
              Please wait for administrator approval.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              You will be able to log in after your account is activated.
            </Typography>
            <Button 
              variant="contained" 
              onClick={handleBackToLogin}
              size="large"
            >
              Back to Login Page
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom color="primary">
          Parent Account Registration
        </Typography>
        
        <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
          Please fill in all information to register your account. 
          Your account will be activated after administrator approval.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
            {validationErrors.length > 0 && (
              <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2 }}>
                {validationErrors.map((errorMsg, index) => (
                  <li key={index} style={{ marginBottom: '4px' }}>
                    {errorMsg}
                  </li>
                ))}
              </Box>
            )}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          {/* Account Information */}
          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
            Account Information
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Parent Code *"
                name="parentCode"
                value={formData.parentCode}
                onChange={handleChange}
                error={!!errors.parentCode}
                helperText={errors.parentCode}
                placeholder="Example: PAR001"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Username *"
                name="username"
                value={formData.username}
                onChange={handleChange}
                error={!!errors.username}
                helperText={errors.username}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="password"
                label="Password *"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="password"
                label="Confirm Password *"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
              />
            </Grid>
          </Grid>

          {/* Personal Information */}
          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
            Personal Information
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name *"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                error={!!errors.fullName}
                helperText={errors.fullName}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="email"
                label="Email *"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number *"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber}
                placeholder="0123456789"
              />
            </Grid>
          </Grid>

          {/* Student Information */}
          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
            Student Information
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Student Code *"
                name="studentCode"
                value={formData.studentCode}
                onChange={handleChange}
                error={!!errors.studentCode}
                helperText={errors.studentCode}
                placeholder="Example: STU001"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Student Name *"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                error={!!errors.studentName}
                helperText={errors.studentName}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.relationship}>
                <InputLabel>Relationship *</InputLabel>
                <Select
                  name="relationship"
                  value={formData.relationship}
                  onChange={handleChange}
                  label="Relationship *"
                >
                  {relationships.map((relationship) => (
                    <MenuItem key={relationship.value} value={relationship.value}>
                      {relationship.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.relationship && (
                  <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                    {errors.relationship}
                  </Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="outlined"
              onClick={handleBackToLogin}
              disabled={loading}
            >
              Back
            </Button>
            
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Submitting...' : 'Register'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default ParentRegistration;
