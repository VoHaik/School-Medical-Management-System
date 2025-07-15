import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, Paper, CircularProgress } from '@mui/material';
import { getAllHealthEvents } from '../../utils/api';

const HealthEventsDebugger = () => {
  const [healthEvents, setHealthEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testHealthEventsAPI = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllHealthEvents();
      setHealthEvents(response || []);
    } catch (err) {
      console.error('Error testing health events API:', err);
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testHealthEventsAPI();
  }, []);

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h6" gutterBottom>
        Health Events API Debugger
      </Typography>
      
      <Button 
        variant="contained" 
        onClick={testHealthEventsAPI} 
        disabled={loading}
        sx={{ mb: 2 }}
      >
        {loading ? <CircularProgress size={20} /> : 'Test API'}
      </Button>

      {error && (
        <Box sx={{ color: 'error.main', mb: 2 }}>
          <Typography variant="body2">Error: {error}</Typography>
        </Box>
      )}

      <Typography variant="subtitle1" gutterBottom>
        Health Events Count: {healthEvents.length}
      </Typography>

      {healthEvents.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>Events:</Typography>
          {healthEvents.map((event, index) => (
            <Box key={index} sx={{ mb: 2, p: 2, border: 1, borderColor: 'grey.300' }}>
              <Typography><strong>Name:</strong> {event.eventName}</Typography>
              <Typography><strong>Type:</strong> {event.eventType}</Typography>
              <Typography><strong>Date:</strong> {event.scheduledDate || event.startDate}</Typography>
              <Typography><strong>Target Grades:</strong> {JSON.stringify(event.targetGradeNames)}</Typography>
              <Typography><strong>Description:</strong> {event.description}</Typography>
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default HealthEventsDebugger;
