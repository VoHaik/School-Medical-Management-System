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
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import {
  LocalHospital as MedicalIcon,
  EventNote as EventIcon,
  Person as NurseIcon,
  Warning as SeverityIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { getStudentMedicalHistory } from '../../utils/api';
import LoadingSpinner from '../shared/LoadingSpinner';
import EnhancedCard from '../shared/EnhancedCard';

const StudentMedicalHistory = () => {
  const theme = useTheme();
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedicalHistory = async () => {
      try {
        setLoading(true);
        const data = await getStudentMedicalHistory();
        setMedicalHistory(data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching medical history:', err);
        setError('Unable to load medical history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalHistory();
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high':
      case 'severe':
        return theme.palette.error.main;
      case 'medium':
      case 'moderate':
        return theme.palette.warning.main;
      case 'low':
      case 'mild':
        return theme.palette.success.main;
      default:
        return theme.palette.info.main;
    }
  };

  const getEventTypeColor = (eventType) => {
    switch (eventType?.toLowerCase()) {
      case 'injury':
        return theme.palette.error.main;
      case 'illness':
        return theme.palette.warning.main;
      case 'checkup':
        return theme.palette.success.main;
      case 'medication':
        return theme.palette.info.main;
      default:
        return theme.palette.primary.main;
    }
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
            <MedicalIcon 
              sx={{ 
                fontSize: 32, 
                color: theme.palette.primary.main, 
                mr: 2 
              }} 
            />
            <Typography variant="h4" component="h1" fontWeight="bold">
              My Medical History
            </Typography>
          </Box>
        </motion.div>

        {medicalHistory.length === 0 ? (
          <motion.div variants={itemVariants}>
            <Alert severity="info">
              No medical events recorded in your history.
            </Alert>
          </motion.div>
        ) : (
          <motion.div variants={itemVariants}>
            <EnhancedCard variant="outlined">
              <CardContent>
                <Timeline>
                  {medicalHistory.map((event, index) => (
                    <TimelineItem key={event.eventId || index}>
                      <TimelineOppositeContent
                        sx={{ m: 'auto 0' }}
                        align="right"
                        variant="body2"
                        color="text.secondary"
                      >
                        {event.eventDate ? 
                          new Date(event.eventDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) : 
                          'Date not specified'
                        }
                        <br />
                        {event.eventTime ? 
                          new Date(`2000-01-01T${event.eventTime}`).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 
                          ''
                        }
                      </TimelineOppositeContent>
                      
                      <TimelineSeparator>
                        <TimelineDot 
                          sx={{ 
                            bgcolor: getEventTypeColor(event.eventType),
                            color: 'white'
                          }}
                        >
                          <EventIcon />
                        </TimelineDot>
                        {index < medicalHistory.length - 1 && <TimelineConnector />}
                      </TimelineSeparator>
                      
                      <TimelineContent sx={{ py: '12px', px: 2 }}>
                        <Card 
                          variant="outlined" 
                          sx={{ 
                            borderLeft: `4px solid ${getEventTypeColor(event.eventType)}`,
                            '&:hover': {
                              boxShadow: theme.shadows[4],
                            },
                            transition: 'box-shadow 0.3s ease',
                          }}
                        >
                          <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                              <Typography variant="h6" component="h3" fontWeight="bold">
                                {event.title || event.eventType || 'Medical Event'}
                              </Typography>
                              <Box display="flex" gap={1}>
                                {event.eventType && (
                                  <Chip 
                                    label={event.eventType} 
                                    size="small"
                                    sx={{ 
                                      bgcolor: getEventTypeColor(event.eventType),
                                      color: 'white',
                                      fontWeight: 'bold'
                                    }}
                                  />
                                )}
                                {event.severity && (
                                  <Chip 
                                    label={event.severity} 
                                    size="small"
                                    variant="outlined"
                                    icon={<SeverityIcon />}
                                    sx={{ 
                                      borderColor: getSeverityColor(event.severity),
                                      color: getSeverityColor(event.severity)
                                    }}
                                  />
                                )}
                              </Box>
                            </Box>
                            
                            {event.description && (
                              <Typography variant="body2" color="text.secondary" mb={2}>
                                {event.description}
                              </Typography>
                            )}
                            
                            <Grid container spacing={2}>
                              {event.symptoms && (
                                <Grid item xs={12} sm={6}>
                                  <Typography variant="body2" fontWeight="bold" color="text.secondary">
                                    Symptoms:
                                  </Typography>
                                  <Typography variant="body2">
                                    {event.symptoms}
                                  </Typography>
                                </Grid>
                              )}
                              
                              {event.treatment && (
                                <Grid item xs={12} sm={6}>
                                  <Typography variant="body2" fontWeight="bold" color="text.secondary">
                                    Treatment:
                                  </Typography>
                                  <Typography variant="body2">
                                    {event.treatment}
                                  </Typography>
                                </Grid>
                              )}
                              
                              {event.outcome && (
                                <Grid item xs={12}>
                                  <Typography variant="body2" fontWeight="bold" color="text.secondary">
                                    Outcome:
                                  </Typography>
                                  <Typography variant="body2">
                                    {event.outcome}
                                  </Typography>
                                </Grid>
                              )}
                              
                              {event.followUpRequired && (
                                <Grid item xs={12}>
                                  <Alert severity="info" sx={{ mt: 1 }}>
                                    Follow-up required: {event.followUpNotes || 'See school nurse'}
                                  </Alert>
                                </Grid>
                              )}
                            </Grid>
                            
                            {event.recordedByNurse && (
                              <Box display="flex" alignItems="center" mt={2} pt={2} borderTop={1} borderColor="divider">
                                <NurseIcon sx={{ color: theme.palette.text.secondary, mr: 1, fontSize: 18 }} />
                                <Typography variant="caption" color="text.secondary">
                                  Recorded by: {event.recordedByNurse.fullName || event.recordedByNurse.username || 'School Nurse'}
                                </Typography>
                              </Box>
                            )}
                          </CardContent>
                        </Card>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              </CardContent>
            </EnhancedCard>
          </motion.div>
        )}
      </motion.div>
    </Box>
  );
};

export default StudentMedicalHistory;
