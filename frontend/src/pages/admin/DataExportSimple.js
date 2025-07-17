import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Alert,
  CircularProgress,
  Box,
  Divider
} from '@mui/material';
import {
  Download,
  Backup,
  School,
  LocalHospital,
  Group,
  Event
} from '@mui/icons-material';
import { exportStudents, exportHealthEvents, exportUsers, exportHealthCheckups } from '../../utils/api';

const DataExport = () => {
  const [loading, setLoading] = useState({});
  const [alerts, setAlerts] = useState([]);

  const showAlert = (message, severity = 'success') => {
    const alert = {
      id: Date.now(),
      message,
      severity
    };
    setAlerts(prev => [...prev, alert]);
    setTimeout(() => {
      setAlerts(prev => prev.filter(a => a.id !== alert.id));
    }, 5000);
  };

  const handleExport = async (type, exportFunction, filename) => {
    try {
      setLoading(prev => ({ ...prev, [type]: true }));
      
      const data = await exportFunction();
      
      if (!data || (Array.isArray(data) && data.length === 0)) {
        showAlert(`No ${type} data available to export`, 'warning');
        return;
      }

      // Convert data to CSV format
      const csvContent = convertToCSV(data);
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showAlert(`${type} data exported successfully!`);
    } catch (error) {
      console.error(`Error exporting ${type}:`, error);
      showAlert(`Failed to export ${type} data`, 'error');
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  const convertToCSV = (data) => {
    if (!Array.isArray(data) || data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');
    
    const csvRows = data.map(row => {
      return headers.map(header => {
        const value = row[header];
        // Handle null/undefined values and escape commas/quotes
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        return stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')
          ? `"${stringValue.replace(/"/g, '""')}"`
          : stringValue;
      }).join(',');
    });
    
    return [csvHeaders, ...csvRows].join('\n');
  };

  const exportOptions = [
    {
      title: 'Students Data',
      description: 'Export all student information including personal details and grades',
      icon: <School color="primary" />,
      type: 'students',
      exportFunction: exportStudents,
      filename: 'students_export'
    },
    {
      title: 'Health Events',
      description: 'Export health checkup events and vaccination schedules',
      icon: <Event color="primary" />,
      type: 'events',
      exportFunction: exportHealthEvents,
      filename: 'health_events_export'
    },
    {
      title: 'Health Checkups',
      description: 'Export completed health checkup records and results',
      icon: <LocalHospital color="primary" />,
      type: 'checkups',
      exportFunction: exportHealthCheckups,
      filename: 'health_checkups_export'
    },
    {
      title: 'Users Data',
      description: 'Export system users including parents, staff, and admins',
      icon: <Group color="primary" />,
      type: 'users',
      exportFunction: exportUsers,
      filename: 'users_export'
    }
  ];

  const handleFullBackup = async () => {
    try {
      setLoading(prev => ({ ...prev, fullBackup: true }));
      showAlert('Starting full system backup...', 'info');
      
      // Export all data types
      for (const option of exportOptions) {
        await handleExport(option.type, option.exportFunction, option.filename);
        // Small delay between exports
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      showAlert('Full system backup completed successfully!');
    } catch (error) {
      console.error('Error during full backup:', error);
      showAlert('Full backup failed', 'error');
    } finally {
      setLoading(prev => ({ ...prev, fullBackup: false }));
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Backup color="primary" />
          Data Export & Backup
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Export system data in CSV format for backup or analysis purposes.
        </Typography>

        {/* Alert Messages */}
        {alerts.map(alert => (
          <Alert key={alert.id} severity={alert.severity} sx={{ mb: 2 }}>
            {alert.message}
          </Alert>
        ))}

        {/* Full Backup Section */}
        <Card sx={{ mb: 4, backgroundColor: '#f5f5f5' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Complete System Backup
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Export all system data at once. This will download separate CSV files for all data types.
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleFullBackup}
              disabled={loading.fullBackup}
              startIcon={loading.fullBackup ? <CircularProgress size={20} /> : <Backup />}
            >
              {loading.fullBackup ? 'Backing up...' : 'Full System Backup'}
            </Button>
          </CardActions>
        </Card>

        <Divider sx={{ my: 3 }} />

        {/* Individual Export Options */}
        <Typography variant="h6" gutterBottom>
          Individual Data Exports
        </Typography>
        
        <Grid container spacing={3}>
          {exportOptions.map((option) => (
            <Grid item xs={12} md={6} key={option.type}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    {option.icon}
                    <Typography variant="h6">
                      {option.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {option.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="outlined"
                    onClick={() => handleExport(option.type, option.exportFunction, option.filename)}
                    disabled={loading[option.type]}
                    startIcon={loading[option.type] ? <CircularProgress size={20} /> : <Download />}
                  >
                    {loading[option.type] ? 'Exporting...' : 'Export CSV'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">
            <strong>Note:</strong> All exported files will be downloaded in CSV format with today's date. 
            Files are saved locally to your computer's Downloads folder.
          </Typography>
        </Alert>
      </Paper>
    </Box>
  );
};

export default DataExport;
