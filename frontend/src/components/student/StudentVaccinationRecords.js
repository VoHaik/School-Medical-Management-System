import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  Chip,
  Grid,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
} from '@mui/material';
import {
  Vaccines as VaccineIcon,
  CheckCircle as CompletedIcon,
  Person as NurseIcon,
  CalendarToday as DateIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { getStudentVaccinationRecords } from '../../utils/api';
import LoadingSpinner from '../shared/LoadingSpinner';
import EnhancedCard from '../shared/EnhancedCard';

const StudentVaccinationRecords = () => {
  const theme = useTheme();
  const [vaccinationRecords, setVaccinationRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVaccinationRecords = async () => {
      try {
        setLoading(true);
        const data = await getStudentVaccinationRecords();
        setVaccinationRecords(data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching vaccination records:', err);
        setError('Unable to load vaccination records. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVaccinationRecords();
  }, []);

  const getConsentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'administered':
        return 'success';
      case 'consent_given':
        return 'primary';
      case 'pending_verification':
        return 'warning';
      case 'consent_denied':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <LoadingSpinner size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ margin: 2 }}>
        {error}
      </Alert>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <Box p={3}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <Box display="flex" alignItems="center" mb={3}>
            <VaccineIcon 
              sx={{ 
                fontSize: 32, 
                color: theme.palette.primary.main, 
                mr: 2 
              }} 
            />
            <Typography variant="h4" component="h1" fontWeight="bold">
              My Vaccination Records
            </Typography>
          </Box>
        </motion.div>

        {/* Summary Cards */}
        <motion.div variants={itemVariants}>
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: theme.palette.success.main, color: 'white' }}>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <CompletedIcon sx={{ mr: 2, fontSize: 40 }} />
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {vaccinationRecords.length}
                      </Typography>
                      <Typography variant="body2">
                        Completed Vaccinations
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: theme.palette.info.main, color: 'white' }}>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <VaccineIcon sx={{ mr: 2, fontSize: 40 }} />
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {new Set(vaccinationRecords.map(v => v.vaccine?.vaccineName || v.vaccineName)).size}
                      </Typography>
                      <Typography variant="body2">
                        Different Vaccines
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </motion.div>

        {vaccinationRecords.length === 0 ? (
          <motion.div variants={itemVariants}>
            <Alert severity="info">
              No completed vaccination records found.
            </Alert>
          </motion.div>
        ) : (
          <motion.div variants={itemVariants}>
            <EnhancedCard variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={3}>
                  Vaccination History
                </Typography>
                
                <TableContainer component={Paper} elevation={0}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Vaccine</strong></TableCell>
                        <TableCell><strong>Date Administered</strong></TableCell>
                        <TableCell><strong>Dose</strong></TableCell>
                        <TableCell><strong>Location</strong></TableCell>
                        <TableCell><strong>Administered By</strong></TableCell>
                        <TableCell><strong>Status</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {vaccinationRecords.map((record, index) => (
                        <TableRow 
                          key={record.id || index}
                          sx={{ 
                            '&:hover': { 
                              backgroundColor: theme.palette.action.hover 
                            },
                            '&:last-child td, &:last-child th': { border: 0 }
                          }}
                        >
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <Avatar 
                                sx={{ 
                                  bgcolor: theme.palette.primary.main, 
                                  mr: 2, 
                                  width: 32, 
                                  height: 32,
                                  fontSize: '0.875rem'
                                }}
                              >
                                {(record.vaccine?.vaccineName || record.vaccineName || 'V').charAt(0).toUpperCase()}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  {record.vaccine?.vaccineName || record.vaccineName || 'Unknown Vaccine'}
                                </Typography>
                                {record.batchNumber && (
                                  <Typography variant="caption" color="text.secondary">
                                    Batch: {record.batchNumber}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </TableCell>
                          
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <DateIcon sx={{ mr: 1, fontSize: 16, color: theme.palette.text.secondary }} />
                              <Typography variant="body2">
                                {formatDate(record.vaccinationDate)}
                              </Typography>
                            </Box>
                          </TableCell>
                          
                          <TableCell>
                            <Typography variant="body2">
                              {record.doseNumber ? `Dose ${record.doseNumber}` : 'Single dose'}
                            </Typography>
                          </TableCell>
                          
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <LocationIcon sx={{ mr: 1, fontSize: 16, color: theme.palette.text.secondary }} />
                              <Typography variant="body2">
                                {record.administeringLocation || 'School Clinic'}
                              </Typography>
                            </Box>
                          </TableCell>
                          
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <NurseIcon sx={{ mr: 1, fontSize: 16, color: theme.palette.text.secondary }} />
                              <Typography variant="body2">
                                {record.administeredByNurse?.fullName || 
                                 record.administeredByNurse?.username || 
                                 'School Nurse'}
                              </Typography>
                            </Box>
                          </TableCell>
                          
                          <TableCell>
                            <Chip 
                              label={record.consentStatus?.replace(/_/g, ' ') || 'Administered'}
                              color={getConsentStatusColor(record.consentStatus)}
                              size="small"
                              icon={<CompletedIcon />}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Additional Notes */}
                <Box mt={3}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Note:</strong> This record shows only completed vaccinations administered at school. 
                    For a complete vaccination history, please consult with your healthcare provider.
                  </Typography>
                </Box>
              </CardContent>
            </EnhancedCard>
          </motion.div>
        )}

        {/* Next Due Vaccinations */}
        {vaccinationRecords.some(record => record.nextDueDate) && (
          <motion.div variants={itemVariants}>
            <Box mt={3}>
              <EnhancedCard variant="outlined">
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Upcoming Vaccinations
                  </Typography>
                  {vaccinationRecords
                    .filter(record => record.nextDueDate && new Date(record.nextDueDate) > new Date())
                    .map((record, index) => (
                      <Alert key={index} severity="info" sx={{ mb: 1 }}>
                        <Typography variant="body2">
                          <strong>{record.vaccine?.vaccineName || record.vaccineName}</strong> - 
                          Next dose due: {formatDate(record.nextDueDate)}
                        </Typography>
                      </Alert>
                    ))}
                </CardContent>
              </EnhancedCard>
            </Box>
          </motion.div>
        )}
      </motion.div>
    </Box>
  );
};

export default StudentVaccinationRecords;
