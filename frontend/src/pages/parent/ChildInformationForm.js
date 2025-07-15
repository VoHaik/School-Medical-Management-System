import React, { useState, useEffect, useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  HealthAndSafety,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  MedicalServices as MedicalIcon,
  ContactPhone as ContactIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const schema = yup.object().shape({
  fullName: yup.string().required('Full name is required').min(2, 'Name must be at least 2 characters'),
  dateOfBirth: yup.date().required('Date of birth is required').max(new Date(), 'Date cannot be in the future'),
  gender: yup.string().required('Gender is required'),
  className: yup.string().required('Class is required'),
  studentCode: yup.string(),
  allergies: yup.string(),
  medicalConditions: yup.string(),
  medications: yup.string(),
  emergencyContactName: yup.string().required('Emergency contact name is required'),
  emergencyContactPhone: yup.string().required('Emergency contact phone is required'),
  emergencyContactRelation: yup.string().required('Emergency contact relation is required'),
  secondaryContactName: yup.string(),
  secondaryContactPhone: yup.string(),
  doctorName: yup.string(),
  doctorPhone: yup.string(),
  insuranceProvider: yup.string(),
  insuranceNumber: yup.string(),
  consentMedicalTreatment: yup.boolean().oneOf([true], 'Medical treatment consent is required'),
  consentDataSharing: yup.boolean().oneOf([true], 'Data sharing consent is required')
});

const ChildInformationForm = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { childId } = useParams();
  const isEdit = Boolean(childId);
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [childData, setChildData] = useState(null);
  const [successDialog, setSuccessDialog] = useState(false);
  
  const { control, handleSubmit, formState: { errors }, reset, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: '',
      dateOfBirth: '',
      gender: '',
      className: '',
      studentCode: '',
      allergies: '',
      medicalConditions: '',
      medications: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelation: '',
      secondaryContactName: '',
      secondaryContactPhone: '',
      doctorName: '',
      doctorPhone: '',
      insuranceProvider: '',
      insuranceNumber: '',
      consentMedicalTreatment: false,
      consentDataSharing: false
    }
  });

  const steps = [
    'Basic Information',
    'Medical Information',
    'Emergency Contacts',
    'Review & Submit'
  ];

  useEffect(() => {
    if (isEdit && childId) {
      fetchChildData();
    }
  }, [isEdit, childId]);

  const fetchChildData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/students/${childId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setChildData(response.data);
      
      // Populate form with existing data
      reset({
        fullName: response.data.fullName || '',
        dateOfBirth: response.data.dateOfBirth ? response.data.dateOfBirth.split('T')[0] : '',
        gender: response.data.gender || '',
        className: response.data.className || '',
        studentCode: response.data.studentCode || '',
        // Add other fields as they become available from the API
        consentMedicalTreatment: true,
        consentDataSharing: true
      });
    } catch (error) {
      console.error('Error fetching child data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      
      const submitData = {
        ...data,
        parentUserId: currentUser.id
      };

      if (isEdit) {
        await axios.put(`/api/students/${childId}`, submitData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('/api/students', submitData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      setSuccessDialog(true);
    } catch (error) {
      console.error('Error saving child information:', error);
      // Handle error (show notification, etc.)
    } finally {
      setSaving(false);
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSuccessClose = () => {
    setSuccessDialog(false);
    navigate('/parent/dashboard');
  };

  const formData = watch();

  const BasicInformationStep = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Basic Information
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Please provide your child's basic information for school health records.
        </Typography>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Controller
          name="fullName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Full Name"
              error={!!errors.fullName}
              helperText={errors.fullName?.message}
              variant="outlined"
            />
          )}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Controller
          name="dateOfBirth"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Date of Birth"
              type="date"
              InputLabelProps={{ shrink: true }}
              error={!!errors.dateOfBirth}
              helperText={errors.dateOfBirth?.message}
              variant="outlined"
            />
          )}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.gender}>
              <InputLabel>Gender</InputLabel>
              <Select {...field} label="Gender">
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
              {errors.gender && (
                <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                  {errors.gender.message}
                </Typography>
              )}
            </FormControl>
          )}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Controller
          name="className"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Class/Grade"
              placeholder="e.g., Grade 5A, Class 3B"
              error={!!errors.className}
              helperText={errors.className?.message}
              variant="outlined"
            />
          )}
        />
      </Grid>
      
      <Grid item xs={12}>
        <Controller
          name="studentCode"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Student ID/Code (if known)"
              placeholder="Leave empty if not assigned yet"
              variant="outlined"
            />
          )}
        />
      </Grid>
    </Grid>
  );

  const MedicalInformationStep = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Medical Information
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Please provide any relevant medical information for your child's safety and care.
        </Typography>
      </Grid>
      
      <Grid item xs={12}>
        <Controller
          name="allergies"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Known Allergies"
              placeholder="List any food, medication, or environmental allergies"
              multiline
              rows={3}
              variant="outlined"
            />
          )}
        />
      </Grid>
      
      <Grid item xs={12}>
        <Controller
          name="medicalConditions"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Medical Conditions"
              placeholder="List any chronic conditions, disabilities, or special needs"
              multiline
              rows={3}
              variant="outlined"
            />
          )}
        />
      </Grid>
      
      <Grid item xs={12}>
        <Controller
          name="medications"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Current Medications"
              placeholder="List any regular medications with dosage and frequency"
              multiline
              rows={3}
              variant="outlined"
            />
          )}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Controller
          name="doctorName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Primary Doctor/Pediatrician"
              variant="outlined"
            />
          )}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Controller
          name="doctorPhone"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Doctor's Phone Number"
              variant="outlined"
            />
          )}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Controller
          name="insuranceProvider"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Insurance Provider"
              variant="outlined"
            />
          )}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Controller
          name="insuranceNumber"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Insurance Number/Policy ID"
              variant="outlined"
            />
          )}
        />
      </Grid>
    </Grid>
  );

  const EmergencyContactsStep = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Emergency Contacts
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Please provide emergency contact information for your child.
        </Typography>
      </Grid>
      
      <Grid item xs={12}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Primary Emergency Contact
        </Typography>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Controller
          name="emergencyContactName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Emergency Contact Name"
              error={!!errors.emergencyContactName}
              helperText={errors.emergencyContactName?.message}
              variant="outlined"
            />
          )}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Controller
          name="emergencyContactPhone"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Emergency Contact Phone"
              error={!!errors.emergencyContactPhone}
              helperText={errors.emergencyContactPhone?.message}
              variant="outlined"
            />
          )}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Controller
          name="emergencyContactRelation"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.emergencyContactRelation}>
              <InputLabel>Relationship</InputLabel>
              <Select {...field} label="Relationship">
                <MenuItem value="Mother">Mother</MenuItem>
                <MenuItem value="Father">Father</MenuItem>
                <MenuItem value="Guardian">Guardian</MenuItem>
                <MenuItem value="Grandparent">Grandparent</MenuItem>
                <MenuItem value="Aunt/Uncle">Aunt/Uncle</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
              {errors.emergencyContactRelation && (
                <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                  {errors.emergencyContactRelation.message}
                </Typography>
              )}
            </FormControl>
          )}
        />
      </Grid>
      
      <Grid item xs={12}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'secondary.main', mt: 2 }}>
          Secondary Emergency Contact (Optional)
        </Typography>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Controller
          name="secondaryContactName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Secondary Contact Name"
              variant="outlined"
            />
          )}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Controller
          name="secondaryContactPhone"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Secondary Contact Phone"
              variant="outlined"
            />
          )}
        />
      </Grid>
    </Grid>
  );

  const ReviewStep = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Review & Consent
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Please review the information and provide necessary consents.
        </Typography>
      </Grid>
      
      <Grid item xs={12}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
              Basic Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Name:</Typography>
                <Typography variant="body1">{formData.fullName}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Date of Birth:</Typography>
                <Typography variant="body1">{formData.dateOfBirth}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Gender:</Typography>
                <Typography variant="body1">{formData.gender}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Class:</Typography>
                <Typography variant="body1">{formData.className}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
              Emergency Contact
            </Typography>
            <Typography variant="body1">
              {formData.emergencyContactName} ({formData.emergencyContactRelation})
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formData.emergencyContactPhone}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
          Required Consents
        </Typography>
        
        <FormControlLabel
          control={
            <Controller
              name="consentMedicalTreatment"
              control={control}
              render={({ field }) => (
                <Checkbox 
                  {...field} 
                  checked={field.value}
                  color="primary"
                />
              )}
            />
          }
          label="I consent to emergency medical treatment for my child if I cannot be reached"
        />
        {errors.consentMedicalTreatment && (
          <Typography variant="caption" color="error" display="block">
            {errors.consentMedicalTreatment.message}
          </Typography>
        )}
        
        <FormControlLabel
          control={
            <Controller
              name="consentDataSharing"
              control={control}
              render={({ field }) => (
                <Checkbox 
                  {...field} 
                  checked={field.value}
                  color="primary"
                />
              )}
            />
          }
          label="I consent to sharing health information with school medical staff as necessary"
        />
        {errors.consentDataSharing && (
          <Typography variant="caption" color="error" display="block">
            {errors.consentDataSharing.message}
          </Typography>
        )}
      </Grid>
    </Grid>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <BasicInformationStep />;
      case 1:
        return <MedicalInformationStep />;
      case 2:
        return <EmergencyContactsStep />;
      case 3:
        return <ReviewStep />;
      default:
        return 'Unknown step';
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
          Loading child information...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <HealthAndSafety sx={{ fontSize: 40, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              {isEdit ? 'Edit Child Information' : 'Add Child Information'}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
              {isEdit ? 'Update your child\'s information' : 'Register your child for school health services'}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Card>
        <CardContent>
          {/* Stepper */}
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Form Content */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {getStepContent(activeStep)}
            
            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                onClick={() => navigate('/parent/dashboard')}
                startIcon={<CancelIcon />}
              >
                Cancel
              </Button>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                {activeStep > 0 && (
                  <Button onClick={handleBack}>
                    Back
                  </Button>
                )}
                
                {activeStep < steps.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={saving}
                    startIcon={saving ? null : <SaveIcon />}
                  >
                    {saving ? 'Saving...' : (isEdit ? 'Update Information' : 'Submit Information')}
                  </Button>
                )}
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>

      {/* Success Dialog */}
      <Dialog open={successDialog} onClose={handleSuccessClose}>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'success.main' }}>
              <CheckIcon />
            </Avatar>
            <Typography variant="h6">
              {isEdit ? 'Information Updated' : 'Child Registered'}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            {isEdit 
              ? 'Your child\'s information has been successfully updated.'
              : 'Your child has been successfully registered for school health services.'
            }
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSuccessClose} variant="contained">
            Return to Dashboard
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChildInformationForm;
