import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Grid,
} from '@mui/material';
import MedicationIcon from '@mui/icons-material/Medication';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DescriptionIcon from '@mui/icons-material/Description';

/**
 * Component for displaying a medication item in a read-only mode
 * Used for showing current medications in various pages
 * 
 * @param {Object} medication - The medication object with properties: name, dosage, frequency, instructions
 */
const MedicationItemFixed = ({ medication = {}, className }) => {
  if (!medication) return null;
  
  return (
    <Paper 
      elevation={1} 
      sx={{ 
        p: 2, 
        mb: 2, 
        bgcolor: 'background.paper', 
        borderLeft: '4px solid', 
        borderColor: 'primary.main' 
      }} 
      className={className}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} mb={1}>
          <Box display="flex" alignItems="center">
            <MedicationIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="subtitle1" fontWeight="medium">
              {medication.name || 'Unnamed Medication'}
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Dosage:</strong> {medication.dosage || 'Not specified'}
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box display="flex" alignItems="center">
            <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {medication.frequency || 'No frequency specified'}
            </Typography>
          </Box>
        </Grid>
        
        {medication.instructions && (
          <Grid item xs={12}>
            <Box display="flex" alignItems="flex-start">
              <DescriptionIcon fontSize="small" sx={{ mr: 1, mt: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {medication.instructions}
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default MedicationItemFixed;
