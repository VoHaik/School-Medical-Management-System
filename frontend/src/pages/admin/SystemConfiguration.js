import React, { useState, useEffect } from 'react';
import { 
  Grid, Card, CardContent, Typography, Box, Button, TextField, Switch,
  FormControlLabel, FormControl, InputLabel, Select, MenuItem, Divider,
  Alert, Snackbar, Tabs, Tab, Paper, List, ListItem, ListItemText,
  ListItemIcon, ListItemSecondaryAction, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import {
  Settings, Security, Notifications, Storage, Email, Backup,
  CloudUpload, Schedule, Warning, CheckCircle, Save, RestartAlt,
  ExpandMore, Edit, Delete, Add, School, LocalHospital, Info
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';

const SystemConfiguration = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [configDialog, setConfigDialog] = useState({ open: false, section: '', title: '' });
  const [systemSettings, setSystemSettings] = useState({
    general: {
      schoolName: 'Greenwood High School',
      schoolAddress: '123 Education Street, Learning City, LC 12345',
      schoolPhone: '+1 (555) 123-4567',
      schoolEmail: 'admin@greenwoodhigh.edu',
      timezone: 'America/New_York',
      language: 'en',
      academicYear: '2023-2024'
    },
    security: {
      passwordMinLength: 8,
      passwordRequireSpecialChars: true,
      passwordRequireNumbers: true,
      passwordRequireUppercase: true,
      sessionTimeout: 60,
      twoFactorRequired: false,
      maxLoginAttempts: 5,
      lockoutDuration: 30
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      emergencyAlerts: true,
      vaccinationReminders: true,
      medicationAlerts: true,
      healthScreeningReminders: true
    },
    backup: {
      autoBackup: true,
      backupFrequency: 'daily',
      backupRetention: 30,
      cloudBackup: true,
      lastBackup: '2024-01-15 02:00:00'
    },
    medical: {
      defaultVaccinationSchedule: 'CDC',
      medicationStorageTemp: '2-8°C',
      emergencyContactRequired: true,
      parentConsentRequired: true,
      healthCheckupFrequency: 'annual',
      medicationExpiryAlertDays: 30
    }
  });

  const { control, handleSubmit, reset } = useForm();

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleSaveSettings = (section, data) => {
    setSystemSettings(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
    setSnackbar({ open: true, message: 'Settings saved successfully', severity: 'success' });
    setConfigDialog({ open: false, section: '', title: '' });
  };

  const openConfigDialog = (section, title) => {
    setConfigDialog({ open: true, section, title });
    reset(systemSettings[section]);
  };

  const GeneralSettingsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="between" alignItems="center" mb={3}>
            <Typography variant="h6">School Information</Typography>
            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={() => openConfigDialog('general', 'School Information')}
            >
              Edit
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                School Name
              </Typography>
              <Typography variant="body1">{systemSettings.general.schoolName}</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Academic Year
              </Typography>
              <Typography variant="body1">{systemSettings.general.academicYear}</Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Address
              </Typography>
              <Typography variant="body1">{systemSettings.general.schoolAddress}</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Phone
              </Typography>
              <Typography variant="body1">{systemSettings.general.schoolPhone}</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Email
              </Typography>
              <Typography variant="body1">{systemSettings.general.schoolEmail}</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Timezone
              </Typography>
              <Typography variant="body1">{systemSettings.general.timezone}</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Language
              </Typography>
              <Typography variant="body1">{systemSettings.general.language}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            System Status
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText
                primary="Database Connection"
                secondary="Connected and operational"
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText
                primary="Email Service"
                secondary="SMTP configured and working"
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <Warning color="warning" />
              </ListItemIcon>
              <ListItemText
                primary="Storage Usage"
                secondary="78% used - Consider cleanup"
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText
                primary="Backup System"
                secondary="Last backup: 2024-01-15 02:00:00"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </div>
  );

  const SecuritySettingsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">Password Policy</Typography>
            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={() => openConfigDialog('security', 'Security Settings')}
            >
              Configure
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Minimum Password Length
              </Typography>
              <Typography variant="body1">{systemSettings.security.passwordMinLength} characters</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Session Timeout
              </Typography>
              <Typography variant="body1">{systemSettings.security.sessionTimeout} minutes</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Max Login Attempts
              </Typography>
              <Typography variant="body1">{systemSettings.security.maxLoginAttempts} attempts</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Lockout Duration
              </Typography>
              <Typography variant="body1">{systemSettings.security.lockoutDuration} minutes</Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle1" gutterBottom>Password Requirements</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={<Switch checked={systemSettings.security.passwordRequireSpecialChars} disabled />}
                label="Special Characters Required"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={<Switch checked={systemSettings.security.passwordRequireNumbers} disabled />}
                label="Numbers Required"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={<Switch checked={systemSettings.security.passwordRequireUppercase} disabled />}
                label="Uppercase Letters Required"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={<Switch checked={systemSettings.security.twoFactorRequired} disabled />}
                label="Two-Factor Authentication"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Security Events
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <Warning color="warning" />
              </ListItemIcon>
              <ListItemText
                primary="Multiple Failed Login Attempts"
                secondary="IP: 192.168.1.100 - 2024-01-15 08:45:00"
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText
                primary="Admin Login Successful"
                secondary="IP: 192.168.1.50 - 2024-01-15 09:15:00"
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <Info color="info" />
              </ListItemIcon>
              <ListItemText
                primary="Password Changed"
                secondary="User: emma.wilson@student.edu - 2024-01-14 14:10:00"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </div>
  );

  const NotificationSettingsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">Notification Preferences</Typography>
            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={() => openConfigDialog('notifications', 'Notification Settings')}
            >
              Configure
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Communication Channels</Typography>
              <FormControlLabel
                control={<Switch checked={systemSettings.notifications.emailNotifications} disabled />}
                label="Email Notifications"
              />
              <FormControlLabel
                control={<Switch checked={systemSettings.notifications.smsNotifications} disabled />}
                label="SMS Notifications"
              />
              <FormControlLabel
                control={<Switch checked={systemSettings.notifications.pushNotifications} disabled />}
                label="Push Notifications"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Health Alerts</Typography>
              <FormControlLabel
                control={<Switch checked={systemSettings.notifications.emergencyAlerts} disabled />}
                label="Emergency Alerts"
              />
              <FormControlLabel
                control={<Switch checked={systemSettings.notifications.vaccinationReminders} disabled />}
                label="Vaccination Reminders"
              />
              <FormControlLabel
                control={<Switch checked={systemSettings.notifications.medicationAlerts} disabled />}
                label="Medication Alerts"
              />
              <FormControlLabel
                control={<Switch checked={systemSettings.notifications.healthScreeningReminders} disabled />}
                label="Health Screening Reminders"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Email Configuration
          </Typography>
          
          <Alert severity="info" sx={{ mb: 3 }}>
            Email service is configured and operational. Test email functionality regularly.
          </Alert>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                SMTP Server
              </Typography>
              <Typography variant="body1">smtp.school.edu</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Port
              </Typography>
              <Typography variant="body1">587 (TLS)</Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                From Address
              </Typography>
              <Typography variant="body1">no-reply@greenwoodhigh.edu</Typography>
            </Grid>
          </Grid>
          
          <Box mt={3}>
            <Button variant="outlined" startIcon={<Email />}>
              Send Test Email
            </Button>
          </Box>
        </CardContent>
      </Card>
    </div>
  );

  const BackupSettingsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">Backup Configuration</Typography>
            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={() => openConfigDialog('backup', 'Backup Settings')}
            >
              Configure
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Backup Frequency
              </Typography>
              <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                {systemSettings.backup.backupFrequency}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Retention Period
              </Typography>
              <Typography variant="body1">{systemSettings.backup.backupRetention} days</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Last Backup
              </Typography>
              <Typography variant="body1">{systemSettings.backup.lastBackup}</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Cloud Backup
              </Typography>
              <Typography variant="body1">
                {systemSettings.backup.cloudBackup ? 'Enabled' : 'Disabled'}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle1" gutterBottom>Backup Options</Typography>
          <FormControlLabel
            control={<Switch checked={systemSettings.backup.autoBackup} disabled />}
            label="Automatic Backup"
          />
          <FormControlLabel
            control={<Switch checked={systemSettings.backup.cloudBackup} disabled />}
            label="Cloud Storage"
          />
          
          <Box mt={3} display="flex" gap={2}>
            <Button variant="outlined" startIcon={<Backup />}>
              Create Manual Backup
            </Button>
            <Button variant="outlined" startIcon={<CloudUpload />}>
              Upload to Cloud
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Backups
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText
                primary="Automatic Daily Backup"
                secondary="2024-01-15 02:00:00 - Size: 2.3 GB"
              />
              <ListItemSecondaryAction>
                <Button size="small">Download</Button>
              </ListItemSecondaryAction>
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText
                primary="Automatic Daily Backup"
                secondary="2024-01-14 02:00:00 - Size: 2.2 GB"
              />
              <ListItemSecondaryAction>
                <Button size="small">Download</Button>
              </ListItemSecondaryAction>
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText
                primary="Manual Backup"
                secondary="2024-01-13 14:30:00 - Size: 2.2 GB"
              />
              <ListItemSecondaryAction>
                <Button size="small">Download</Button>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </div>
  );

  const MedicalSettingsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">Medical System Configuration</Typography>
            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={() => openConfigDialog('medical', 'Medical Settings')}
            >
              Configure
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Default Vaccination Schedule
              </Typography>
              <Typography variant="body1">{systemSettings.medical.defaultVaccinationSchedule}</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Medication Storage Temperature
              </Typography>
              <Typography variant="body1">{systemSettings.medical.medicationStorageTemp}</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Health Checkup Frequency
              </Typography>
              <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                {systemSettings.medical.healthCheckupFrequency}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Medication Expiry Alert
              </Typography>
              <Typography variant="body1">{systemSettings.medical.medicationExpiryAlertDays} days before expiry</Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle1" gutterBottom>Policy Requirements</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={<Switch checked={systemSettings.medical.emergencyContactRequired} disabled />}
                label="Emergency Contact Required"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={<Switch checked={systemSettings.medical.parentConsentRequired} disabled />}
                label="Parent Consent Required"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Health Standards & Protocols
          </Typography>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>Emergency Response Procedures</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="textSecondary">
                Standard protocols for handling medical emergencies, including escalation procedures and emergency contact protocols.
              </Typography>
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>Medication Administration Guidelines</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="textSecondary">
                Guidelines for safe medication storage, administration, and documentation in accordance with healthcare standards.
              </Typography>
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>Vaccination Policy</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="textSecondary">
                School vaccination requirements, exemption procedures, and compliance tracking protocols.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <Typography variant="h4" component="h1" gutterBottom>
          System Configuration
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Configure system settings and preferences
        </Typography>
      </div>

      <Card>
        <Tabs value={selectedTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          <Tab label="General" icon={<Settings />} />
          <Tab label="Security" icon={<Security />} />
          <Tab label="Notifications" icon={<Notifications />} />
          <Tab label="Backup" icon={<Backup />} />
          <Tab label="Medical Settings" icon={<LocalHospital />} />
        </Tabs>
        
        <CardContent>
          {selectedTab === 0 && <GeneralSettingsTab />}
          {selectedTab === 1 && <SecuritySettingsTab />}
          {selectedTab === 2 && <NotificationSettingsTab />}
          {selectedTab === 3 && <BackupSettingsTab />}
          {selectedTab === 4 && <MedicalSettingsTab />}
        </CardContent>
      </Card>

      {/* Configuration Dialog */}
      <Dialog open={configDialog.open} onClose={() => setConfigDialog({ open: false, section: '', title: '' })} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit((data) => handleSaveSettings(configDialog.section, data))}>
          <DialogTitle>{configDialog.title}</DialogTitle>
          <DialogContent>
            <Alert severity="info" sx={{ mb: 3 }}>
              Configuration changes will take effect immediately. Some changes may require system restart.
            </Alert>
            
            {configDialog.section === 'general' && (
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <Controller
                    name="schoolName"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} fullWidth label="School Name" />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="schoolAddress"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} fullWidth label="School Address" multiline rows={2} />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="schoolPhone"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} fullWidth label="Phone Number" />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="schoolEmail"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} fullWidth label="Email Address" />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="timezone"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Timezone</InputLabel>
                        <Select {...field} label="Timezone">
                          <MenuItem value="America/New_York">Eastern Time</MenuItem>
                          <MenuItem value="America/Chicago">Central Time</MenuItem>
                          <MenuItem value="America/Denver">Mountain Time</MenuItem>
                          <MenuItem value="America/Los_Angeles">Pacific Time</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="academicYear"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} fullWidth label="Academic Year" />
                    )}
                  />
                </Grid>
              </Grid>
            )}

            {/* Add similar forms for other sections as needed */}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfigDialog({ open: false, section: '', title: '' })}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" startIcon={<Save />}>
              Save Changes
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SystemConfiguration;