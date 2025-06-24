import React from 'react';
import { Typography, Paper, Box } from '@mui/material';

/**
 * PageHeader component for displaying page titles with optional actions
 * @param {Object} props - Component properties
 * @param {string} props.title - The main title of the page
 * @param {string} props.subtitle - Optional subtitle for the page
 * @param {React.ReactNode} props.actions - Optional action buttons to display on the right side
 * @param {React.ReactNode} props.icon - Optional icon to display next to the title
 * @param {string} props.variant - Page header variant ('default', 'compact')
 * @returns {JSX.Element}
 */
const PageHeader = ({ title, subtitle, actions, icon, variant = 'default' }) => {
  const isCompact = variant === 'compact';
  
  return (
    <Paper 
      elevation={0}
      sx={{
        p: isCompact ? 2 : 3,
        mb: isCompact ? 2 : 4,
        borderRadius: '8px',
        backgroundColor: 'background.paper',
      }}
    >
      <Box 
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {icon && <Box sx={{ mr: 2, color: 'primary.main' }}>{icon}</Box>}
          <Box>
            <Typography variant={isCompact ? 'h6' : 'h5'} component="h1" fontWeight="bold">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
        
        {actions && <Box>{actions}</Box>}
      </Box>
    </Paper>
  );
};

export default PageHeader;