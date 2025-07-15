// Notification functionality removed from project
import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

const NotificationsPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Notifications
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Notification functionality has been removed from the system.
        </Typography>
      </Paper>
    </Container>
  );
};

export default NotificationsPage;
