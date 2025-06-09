import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Tab,
  Tabs,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  TextField,
  Alert,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  VaccinesOutlined,
  CheckCircle,
  Warning,
  Info,
  Assignment,
  Person,
  ExpandMore,
  Download,
  Close,
  Schedule,
  MedicalServices
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { format, parseISO } from 'date-fns';

// Validation schema
const consentSchema = yup.object().shape({
  consent: yup.string().required('Please select a consent option'),
  parentSignature: yup.string().required('Parent signature is required'),
  parentName: yup.string().required('Parent name is required'),
  relationship: yup.string().required('Relationship is required'),
  date: yup.string().required('Date is required'),
  emergencyContact: yup.string().when('consent', {
    is: 'approve',
    then: (schema) => schema.required('Emergency contact is required for vaccination consent'),
    otherwise: (schema) => schema
  }),
  additionalNotes: yup.string()
});

// Mock data
const mockConsentData = {
  student: {
    id: 'STU-2024-001',
    name: 'John Smith',
    grade: 'Grade 10',
    birthDate: '2008-03-15',
    medicalAlerts: ['Egg allergy']
  },
  pendingConsents: [
    {
      id: 1,
      vaccine: 'HPV (Human Papillomavirus)',
      campaign: 'Fall 2024 HPV Campaign',
      scheduledDate: '2024-06-20',
      dueDate: '2024-06-15',
      description: 'Human Papillomavirus vaccine to prevent HPV-related cancers',
      doses: 2,
      currentDose: 2,
      location: 'School Health Clinic',
      provider: 'School Health Services',
      sideEffects: ['Mild pain at injection site', 'Low-grade fever', 'Headache'],
      contraindications: ['Severe illness', 'Pregnancy', 'Severe allergic reaction to previous dose'],
      status: 'pending'
    },
    {
      id: 2,
      vaccine: 'Meningococcal ACWY',
      campaign: 'Grade 10 Meningococcal Campaign',
      scheduledDate: '2024-07-15',
      dueDate: '2024-07-10',
      description: 'Vaccine to prevent meningococcal disease caused by serogroups A, C, W, and Y',
      doses: 1,
      currentDose: 1,
      location: 'School Gymnasium',
      provider: 'County Health Department',
      sideEffects: ['Redness at injection site', 'Mild fever', 'Fatigue'],
      contraindications: ['Severe illness', 'History of Guillain-Barré Syndrome'],
      status: 'pending'
    }
  ],
  submittedConsents: [
    {
      id: 3,
      vaccine: 'Tdap Booster',
      campaign: 'Annual Tdap Booster',
      submittedDate: '2024-02-15',
      scheduledDate: '2024-03-20',
      consent: 'approve',
      status: 'completed',
      vaccinationDate: '2024-03-20'
    },
    {
      id: 4,
      vaccine: 'Influenza',
      campaign: 'Fall 2023 Flu Campaign',
      submittedDate: '2023-09-10',
      scheduledDate: '2023-10-15',
      consent: 'decline',
      reason: 'Egg allergy',
      status: 'declined'
    }
  ]
};

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`consent-tabpanel-${index}`}
      aria-labelledby={`consent-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const VaccinationConsent = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedConsent, setSelectedConsent] = useState(null);
  const [consentDialogOpen, setConsentDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState(mockConsentData);

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(consentSchema),
    defaultValues: {
      consent: '',
      parentSignature: '',
      parentName: '',
      relationship: '',
      date: new Date().toISOString().split('T')[0],
      emergencyContact: '',
      additionalNotes: ''
    }
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleOpenConsent = (consent) => {
    setSelectedConsent(consent);
    setConsentDialogOpen(true);
    setCurrentStep(0);
    reset();
  };

  const handleCloseConsent = () => {
    setConsentDialogOpen(false);
    setSelectedConsent(null);
    setCurrentStep(0);
  };

  const onSubmit = (formData) => {
    console.log('Consent form submitted:', formData);
    
    // Update the consent status
    setData(prev => ({
      ...prev,
      pendingConsents: prev.pendingConsents.filter(c => c.id !== selectedConsent.id),
      submittedConsents: [
        ...prev.submittedConsents,
        {
          ...selectedConsent,
          submittedDate: new Date().toISOString().split('T')[0],
          consent: formData.consent,
          reason: formData.additionalNotes,
          status: formData.consent === 'approve' ? 'approved' : 'declined'
        }
      ]
    }));

    handleCloseConsent();
  };

  const steps = ['Review Information', 'Provide Consent', 'Confirmation'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'approved':
        return 'success';
      case 'declined':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <Box className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <Box className="mb-6">
        <Box className="flex items-center gap-3 mb-4">
          <VaccinesOutlined className="text-blue-600" sx={{ fontSize: 32 }} />
          <Typography variant="h4" className="font-bold text-gray-800">
            Vaccination Consent
          </Typography>
        </Box>
        <Typography variant="body1" className="text-gray-600">
          Review and provide consent for your child's vaccination requirements.
        </Typography>
      </Box>

      {/* Student Info */}
      <Card className="mb-6">
        <CardContent>
          <Box className="flex items-center justify-between">
            <Box>
              <Typography variant="h6" className="font-semibold mb-1">
                {data.student.name}
              </Typography>
              <Typography variant="body2" className="text-gray-600 mb-2">
                {data.student.grade} • Born: {format(parseISO(data.student.birthDate), 'MMMM dd, yyyy')}
              </Typography>
              {data.student.medicalAlerts.length > 0 && (
                <Box className="flex gap-1">
                  <Warning className="text-orange-500" fontSize="small" />
                  <Typography variant="caption" className="text-orange-600">
                    Medical Alerts: {data.student.medicalAlerts.join(', ')}
                  </Typography>
                </Box>
              )}
            </Box>
            <Box className="text-right">
              <Typography variant="h4" className="font-bold text-blue-600">
                {data.pendingConsents.length}
              </Typography>
              <Typography variant="caption" className="text-gray-600">
                Pending Consents
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label={`Pending Consent (${data.pendingConsents.length})`} />
          <Tab label={`Consent History (${data.submittedConsents.length})`} />
          <Tab label="Information & Resources" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <TabPanel value={activeTab} index={0}>
        {data.pendingConsents.length > 0 ? (
          <Grid container spacing={3}>
            {data.pendingConsents.map((consent) => (
              <Grid item xs={12} md={6} key={consent.id}>
                <Card className={`border-l-4 ${isOverdue(consent.dueDate) ? 'border-l-red-500' : 'border-l-yellow-500'}`}>
                  <CardContent>
                    <Box className="flex justify-between items-start mb-3">
                      <Typography variant="h6" className="font-semibold">
                        {consent.vaccine}
                      </Typography>
                      {isOverdue(consent.dueDate) && (
                        <Chip
                          icon={<Warning />}
                          label="Overdue"
                          color="error"
                          size="small"
                        />
                      )}
                    </Box>
                    
                    <Typography variant="body2" className="text-gray-600 mb-3">
                      {consent.description}
                    </Typography>
                    
                    <Box className="space-y-2 mb-4">
                      <Box className="flex justify-between">
                        <Typography variant="caption" className="text-gray-500">Campaign:</Typography>
                        <Typography variant="caption">{consent.campaign}</Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="caption" className="text-gray-500">Scheduled Date:</Typography>
                        <Typography variant="caption">
                          {format(parseISO(consent.scheduledDate), 'MMM dd, yyyy')}
                        </Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="caption" className="text-gray-500">Consent Due:</Typography>
                        <Typography variant="caption" className={isOverdue(consent.dueDate) ? 'text-red-600 font-semibold' : ''}>
                          {format(parseISO(consent.dueDate), 'MMM dd, yyyy')}
                        </Typography>
                      </Box>
                      <Box className="flex justify-between">
                        <Typography variant="caption" className="text-gray-500">Location:</Typography>
                        <Typography variant="caption">{consent.location}</Typography>
                      </Box>
                    </Box>
                    
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => handleOpenConsent(consent)}
                      className={isOverdue(consent.dueDate) ? 'bg-red-600 hover:bg-red-700' : ''}
                    >
                      Provide Consent
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper className="p-8 text-center">
            <CheckCircle className="text-green-500 mb-4" sx={{ fontSize: 48 }} />
            <Typography variant="h6" className="text-gray-600 mb-2">
              No Pending Consents
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              All vaccination consents are up to date.
            </Typography>
          </Paper>
        )}
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <Box className="space-y-3">
          {data.submittedConsents.map((consent) => (
            <Card key={consent.id} variant="outlined">
              <CardContent>
                <Box className="flex justify-between items-start">
                  <Box className="flex-1">
                    <Typography variant="h6" className="font-semibold mb-1">
                      {consent.vaccine}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600 mb-2">
                      {consent.campaign}
                    </Typography>
                    <Box className="flex gap-4 text-sm text-gray-500">
                      <span>Submitted: {format(parseISO(consent.submittedDate), 'MMM dd, yyyy')}</span>
                      <span>Scheduled: {format(parseISO(consent.scheduledDate), 'MMM dd, yyyy')}</span>
                      {consent.vaccinationDate && (
                        <span>Vaccinated: {format(parseISO(consent.vaccinationDate), 'MMM dd, yyyy')}</span>
                      )}
                    </Box>
                    {consent.reason && (
                      <Typography variant="body2" className="text-gray-600 mt-2">
                        <strong>Reason:</strong> {consent.reason}
                      </Typography>
                    )}
                  </Box>
                  <Chip
                    label={consent.consent === 'approve' ? 'Approved' : 'Declined'}
                    color={getStatusColor(consent.status)}
                    size="small"
                  />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="mb-3">Understanding Vaccination Consent</Typography>
                <Typography variant="body2" className="text-gray-600 mb-3">
                  As a parent or guardian, you have the right to make informed decisions about your child's vaccinations.
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><CheckCircle className="text-green-500" /></ListItemIcon>
                    <ListItemText 
                      primary="Review vaccine information carefully"
                      secondary="Read about benefits, risks, and side effects"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircle className="text-green-500" /></ListItemIcon>
                    <ListItemText 
                      primary="Consult with healthcare providers"
                      secondary="Discuss any concerns with your child's doctor"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircle className="text-green-500" /></ListItemIcon>
                    <ListItemText 
                      primary="Consider your child's medical history"
                      secondary="Factor in allergies and previous reactions"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="mb-3">Important Resources</Typography>
                <Box className="space-y-3">
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Download />}
                    onClick={() => console.log('Download vaccine information')}
                  >
                    Vaccine Information Sheets
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<MedicalServices />}
                    onClick={() => console.log('Contact school nurse')}
                  >
                    Contact School Nurse
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Info />}
                    onClick={() => console.log('CDC vaccine information')}
                  >
                    CDC Vaccine Information
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Consent Dialog */}
      <Dialog
        open={consentDialogOpen}
        onClose={handleCloseConsent}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box className="flex justify-between items-center">
            <Typography variant="h6">
              Vaccination Consent - {selectedConsent?.vaccine}
            </Typography>
            <IconButton onClick={handleCloseConsent}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Stepper activeStep={currentStep} className="mb-6">
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {currentStep === 0 && selectedConsent && (
            <Box className="space-y-4">
              <Typography variant="h6">Vaccination Information</Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box className="space-y-2">
                    <Typography variant="subtitle2">Vaccine Details</Typography>
                    <Typography variant="body2"><strong>Vaccine:</strong> {selectedConsent.vaccine}</Typography>
                    <Typography variant="body2"><strong>Description:</strong> {selectedConsent.description}</Typography>
                    <Typography variant="body2"><strong>Dose:</strong> {selectedConsent.currentDose} of {selectedConsent.doses}</Typography>
                    <Typography variant="body2"><strong>Date:</strong> {format(parseISO(selectedConsent.scheduledDate), 'MMMM dd, yyyy')}</Typography>
                    <Typography variant="body2"><strong>Location:</strong> {selectedConsent.location}</Typography>
                    <Typography variant="body2"><strong>Provider:</strong> {selectedConsent.provider}</Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="subtitle2">Possible Side Effects</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List dense>
                        {selectedConsent.sideEffects.map((effect, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={effect} />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                  
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="subtitle2">Contraindications</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List dense>
                        {selectedConsent.contraindications.map((contra, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={contra} />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              </Grid>

              {data.student.medicalAlerts.length > 0 && (
                <Alert severity="warning">
                  <Typography variant="subtitle2">Medical Alerts for {data.student.name}:</Typography>
                  <Typography variant="body2">{data.student.medicalAlerts.join(', ')}</Typography>
                </Alert>
              )}
            </Box>
          )}

          {currentStep === 1 && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Typography variant="h6">Consent Decision</Typography>
              
              <Controller
                name="consent"
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field} className="mb-4">
                    <FormControlLabel
                      value="approve"
                      control={<Radio />}
                      label="I give consent for my child to receive this vaccination"
                    />
                    <FormControlLabel
                      value="decline"
                      control={<Radio />}
                      label="I decline consent for my child to receive this vaccination"
                    />
                  </RadioGroup>
                )}
              />
              {errors.consent && (
                <Typography variant="caption" className="text-red-600">
                  {errors.consent.message}
                </Typography>
              )}

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="parentName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Parent/Guardian Name"
                        error={!!errors.parentName}
                        helperText={errors.parentName?.message}
                      />
                    )}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Controller
                    name="relationship"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Relationship to Student"
                        error={!!errors.relationship}
                        helperText={errors.relationship?.message}
                      />
                    )}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Controller
                    name="emergencyContact"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Emergency Contact Number"
                        error={!!errors.emergencyContact}
                        helperText={errors.emergencyContact?.message}
                      />
                    )}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Controller
                    name="date"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="date"
                        label="Date"
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.date}
                        helperText={errors.date?.message}
                      />
                    )}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Controller
                    name="additionalNotes"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        rows={3}
                        label="Additional Notes or Concerns (Optional)"
                        error={!!errors.additionalNotes}
                        helperText={errors.additionalNotes?.message}
                      />
                    )}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Controller
                    name="parentSignature"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Digital Signature (Type your full name)"
                        error={!!errors.parentSignature}
                        helperText={errors.parentSignature?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </form>
          )}

          {currentStep === 2 && (
            <Box className="text-center space-y-4">
              <CheckCircle className="text-green-500 mx-auto" sx={{ fontSize: 64 }} />
              <Typography variant="h6">Consent Submitted Successfully</Typography>
              <Typography variant="body2" className="text-gray-600">
                Your consent has been recorded and the school health team has been notified.
              </Typography>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions>
          {currentStep > 0 && currentStep < 2 && (
            <Button onClick={() => setCurrentStep(prev => prev - 1)}>
              Back
            </Button>
          )}
          {currentStep < 1 && (
            <Button
              variant="contained"
              onClick={() => setCurrentStep(prev => prev + 1)}
            >
              Next
            </Button>
          )}
          {currentStep === 1 && (
            <Button
              variant="contained"
              onClick={handleSubmit((data) => {
                onSubmit(data);
                setCurrentStep(2);
              })}
            >
              Submit Consent
            </Button>
          )}
          {currentStep === 2 && (
            <Button
              variant="contained"
              onClick={handleCloseConsent}
            >
              Close
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VaccinationConsent;
