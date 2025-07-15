// Grade Level Management Demo Component
// File: frontend/src/components/admin/GradeLevelManagement.jsx

import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Button,
  Box,
  Grid,
  Alert,
  Divider
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import GradeLevelSelector from '../shared/GradeLevelSelector';
import { useGradeLevels } from '../../hooks/useGradeLevels';
import { useUIText } from '../../hooks/useUIText';
import { initializeStandardGradeLevels } from '../../utils/api';

const GradeLevelManagement = () => {
  const { t } = useUIText();
  const { 
    gradeLevels, 
    loading, 
    error, 
    formatGradeNumbersToString,
    refetch 
  } = useGradeLevels();
  
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [singleGrade, setSingleGrade] = useState('');
  const [initLoading, setInitLoading] = useState(false);
  const [initMessage, setInitMessage] = useState('');

  const handleInitializeGrades = async () => {
    try {
      setInitLoading(true);
      setInitMessage('');
      
      await initializeStandardGradeLevels();
      setInitMessage('Standard grade levels (1-12) initialized successfully!');
      
      // Refresh the grade levels
      setTimeout(() => {
        refetch();
      }, 1000);
      
    } catch (err) {
      console.error('Error initializing grade levels:', err);
      setInitMessage('Error initializing grade levels: ' + err.message);
    } finally {
      setInitLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h4" gutterBottom>
        Grade Level Management
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {initMessage && (
        <Alert 
          severity={initMessage.includes('Error') ? 'error' : 'success'} 
          sx={{ mb: 2 }}
          onClose={() => setInitMessage('')}
        >
          {initMessage}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleInitializeGrades}
          disabled={initLoading}
          sx={{ mb: 2 }}
        >
          {initLoading ? 'Initializing...' : 'Initialize Standard Grades (1-12)'}
        </Button>
        
        <Typography variant="body2" color="textSecondary">
          This will create grade levels 1-12 if they don't already exist in the database.
        </Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Multiple Grade Selection
          </Typography>
          
          <GradeLevelSelector
            value={selectedGrades}
            onChange={setSelectedGrades}
            multiple={true}
            label="Select Target Grades"
            helperText="Choose one or more grade levels"
            sx={{ mb: 2 }}
          />
          
          <Typography variant="body2" color="textSecondary">
            Selected: {formatGradeNumbersToString(selectedGrades.map(g => parseInt(g)))}
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Single Grade Selection
          </Typography>
          
          <GradeLevelSelector
            value={singleGrade}
            onChange={setSingleGrade}
            multiple={false}
            label="Select Grade"
            helperText="Choose one grade level"
            sx={{ mb: 2 }}
          />
          
          <Typography variant="body2" color="textSecondary">
            Selected: {singleGrade || 'None'}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Vietnamese Names
          </Typography>
          
          <GradeLevelSelector
            value={selectedGrades}
            onChange={setSelectedGrades}
            multiple={true}
            label="Chọn Khối Lớp"
            helperText="Chọn một hoặc nhiều khối lớp"
            useVietnamese={true}
            sx={{ mb: 2 }}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        Available Grade Levels
      </Typography>
      
      {loading ? (
        <Typography>Loading grade levels...</Typography>
      ) : (
        <Box>
          <Typography variant="body2" gutterBottom>
            Total grades: {gradeLevels.length}
          </Typography>
          
          <Grid container spacing={1}>
            {gradeLevels.map((grade) => (
              <Grid item key={grade.gradeId}>
                <Paper 
                  sx={{ 
                    p: 1.5, 
                    textAlign: 'center',
                    backgroundColor: grade.isActive ? 'primary.light' : 'grey.300',
                    color: grade.isActive ? 'white' : 'text.secondary'
                  }}
                >
                  <Typography variant="body2" fontWeight="bold">
                    {grade.gradeName}
                  </Typography>
                  <Typography variant="caption" display="block">
                    {grade.gradeName.startsWith('Grade ') 
                      ? `Lớp ${grade.gradeName.substring(6)}`
                      : grade.gradeName
                    }
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Paper>
  );
};

export default GradeLevelManagement;
