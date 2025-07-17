import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  CircularProgress,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Person as PersonIcon,
  LocalHospital as HealthIcon,
  Medication as MedicationIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { getStudentHealthProfile } from '../../utils/api';
import LoadingSpinner from '../shared/LoadingSpinner';
import EnhancedCard from '../shared/EnhancedCard';

const StudentHealthProfile = () => {
  const theme = useTheme();
  const [healthProfile, setHealthProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHealthProfile = async () => {
      try {
        setLoading(true);
        const data = await getStudentHealthProfile();
        setHealthProfile(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching health profile:', err);
        setError('Unable to load health profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchHealthProfile();
  }, []);

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

  if (!healthProfile) {
    return (
      <Alert severity="info" sx={{ margin: 2 }}>
        No health profile found. Please contact the school nurse to set up your health declaration.
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
            <HealthIcon 
              sx={{ 
                fontSize: 32, 
                color: theme.palette.primary.main, 
                mr: 2 
              }} 
            />
            <Typography variant="h4" component="h1" fontWeight="bold">
              My Health Profile
            </Typography>
          </Box>
        </motion.div>

        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12} md={6}>
            <motion.div variants={itemVariants}>
              <EnhancedCard variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <PersonIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                    <Typography variant="h6" fontWeight="bold">
                      Basic Information
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Student Code
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {healthProfile.studentCode}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Grade Level
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {healthProfile.gradeLevel || 'Not specified'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Blood Type
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {healthProfile.bloodType || 'Not specified'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Height/Weight
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {healthProfile.height ? `${healthProfile.height}cm` : 'Not specified'} / {healthProfile.weight ? `${healthProfile.weight}kg` : 'Not specified'}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </EnhancedCard>
            </motion.div>
          </Grid>

          {/* Health Status */}
          <Grid item xs={12} md={6}>
            <motion.div variants={itemVariants}>
              <EnhancedCard variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <AssignmentIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                    <Typography variant="h6" fontWeight="bold">
                      Health Status
                    </Typography>
                  </Box>
                  <Box mb={2}>
                    <Chip 
                      label={healthProfile.status || 'Unknown'} 
                      color={healthProfile.status === 'APPROVED' ? 'success' : 'default'}
                      variant="outlined"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    Declaration Date
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {healthProfile.declarationDate ? 
                      new Date(healthProfile.declarationDate).toLocaleDateString() : 
                      'Not specified'
                    }
                  </Typography>
                </CardContent>
              </EnhancedCard>
            </motion.div>
          </Grid>

          {/* Allergies */}
          <Grid item xs={12}>
            <motion.div variants={itemVariants}>
              <EnhancedCard variant="outlined">
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <MedicationIcon sx={{ color: theme.palette.warning.main, mr: 1 }} />
                    <Typography variant="h6" fontWeight="bold">
                      Allergies & Medical Conditions
                    </Typography>
                  </Box>
                  {healthProfile.allergies && healthProfile.allergies.length > 0 ? (
                    <List>
                      {healthProfile.allergies.map((allergy, index) => (
                        <React.Fragment key={index}>
                          <ListItem>
                            <ListItemText
                              primary={allergy.allergen || 'Unknown allergen'}
                              secondary={
                                <Box>
                                  <Typography variant="body2" component="span">
                                    Severity: {allergy.severity || 'Not specified'}
                                  </Typography>
                                  {allergy.reaction && (
                                    <Typography variant="body2" component="div">
                                      Reaction: {allergy.reaction}
                                    </Typography>
                                  )}
                                </Box>
                              }
                            />
                          </ListItem>
                          {index < healthProfile.allergies.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <Typography color="text.secondary">
                      No allergies recorded
                    </Typography>
                  )}
                </CardContent>
              </EnhancedCard>
            </motion.div>
          </Grid>

          {/* Medications */}
          {healthProfile.medications && healthProfile.medications.length > 0 && (
            <Grid item xs={12}>
              <motion.div variants={itemVariants}>
                <EnhancedCard variant="outlined">
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <MedicationIcon sx={{ color: theme.palette.info.main, mr: 1 }} />
                      <Typography variant="h6" fontWeight="bold">
                        Current Medications
                      </Typography>
                    </Box>
                    <List>
                      {healthProfile.medications.map((medication, index) => (
                        <React.Fragment key={index}>
                          <ListItem>
                            <ListItemText
                              primary={medication.medicationName || 'Unknown medication'}
                              secondary={
                                <Box>
                                  {medication.dosage && (
                                    <Typography variant="body2" component="div">
                                      Dosage: {medication.dosage}
                                    </Typography>
                                  )}
                                  {medication.frequency && (
                                    <Typography variant="body2" component="div">
                                      Frequency: {medication.frequency}
                                    </Typography>
                                  )}
                                  {medication.instructions && (
                                    <Typography variant="body2" component="div">
                                      Instructions: {medication.instructions}
                                    </Typography>
                                  )}
                                </Box>
                              }
                            />
                          </ListItem>
                          {index < healthProfile.medications.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  </CardContent>
                </EnhancedCard>
              </motion.div>
            </Grid>
          )}

          {/* Emergency Contact */}
          {healthProfile.emergencyContact && (
            <Grid item xs={12}>
              <motion.div variants={itemVariants}>
                <EnhancedCard variant="outlined">
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" mb={2}>
                      Emergency Contact
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          Name
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {healthProfile.emergencyContact.name || 'Not specified'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          Phone
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {healthProfile.emergencyContact.phone || 'Not specified'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          Relationship
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {healthProfile.emergencyContact.relationship || 'Not specified'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </EnhancedCard>
              </motion.div>
            </Grid>
          )}
        </Grid>
      </motion.div>
    </Box>
  );
};

export default StudentHealthProfile;
