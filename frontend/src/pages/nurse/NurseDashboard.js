import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  ListItemIcon,
  ListItemText,
  List,
  ListItem
} from '@mui/material';
import PageHeader from '../../components/PageHeader';
import { Medication as MedicationIcon, AssignmentLate as AssignmentLateIcon, EventAvailable as EventAvailableIcon } from '@mui/icons-material';

// Mock data - replace with actual data fetching later
const summaryData = {
  pendingMedicationRequests: 5, // Example: fetch this from an API endpoint
  upcomingAppointments: 3,
  recentAlerts: 1,
};

function NurseDashboard() {
  return (
    <Box sx={{ p: 3 }}>
      <PageHeader title="Nurse Dashboard" />

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Pending Medication Requests" avatar={<AssignmentLateIcon color="warning" />} />
            <CardContent>
              <Typography variant="h4" component="p" gutterBottom>
                {summaryData.pendingMedicationRequests}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                requests require your attention.
              </Typography>
              <Button 
                variant="contained" 
                component={RouterLink} 
                to="/nurse/medication-management" // Ensure this route is correct
                startIcon={<MedicationIcon />}
              >
                Manage Medication Requests
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Upcoming Health Checks/Events" avatar={<EventAvailableIcon color="info" />} />
            <CardContent>
              <Typography variant="h4" component="p" gutterBottom>
                {summaryData.upcomingAppointments} 
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                scheduled events today.
              </Typography>
              <Button 
                variant="outlined" 
                // component={RouterLink} 
                // to="/nurse/schedule" // Example future link
                disabled // Enable when schedule page is ready
              >
                View Schedule
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Recent Alerts" avatar={<WarningIcon color="error" />} />
            <CardContent>
              <Typography variant="h4" component="p" gutterBottom>
                {summaryData.recentAlerts}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                important alerts.
              </Typography>
              <Button 
                variant="outlined" 
                // component={RouterLink} 
                // to="/nurse/alerts" // Example future link
                disabled // Enable when alerts page is ready
              >
                View Alerts
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Quick Links</Typography>
        <List>
          <ListItem button component={RouterLink} to="/nurse/medication-management">
            <ListItemIcon><MedicationIcon /></ListItemIcon>
            <ListItemText primary="Full Medication Management" />
          </ListItem>
          {/* Add more quick links as other nurse functionalities are developed */}
          {/* e.g., Student Health Records, Vaccination Management, Health Checkups */}
        </List>
      </Paper>
    </Box>
  );
}

export default NurseDashboard;
