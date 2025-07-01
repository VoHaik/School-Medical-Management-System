import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Snackbar
} from '@mui/material';
import { VaccinesOutlined } from '@mui/icons-material';
import { 
  getUserProfile, 
  getPendingVaccinationConsents, 
  getSubmittedVaccinationConsents,
  getParentStudents,
  submitVaccinationConsent
} from '../../utils/api';

const VaccinationConsent = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [pendingConsents, setPendingConsents] = useState([]);
  const [submittedConsents, setSubmittedConsents] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleConsent = async (consentId, status) => {
    try {
      setLoading(true);
      
      // Submit the consent decision
      await submitVaccinationConsent(consentId, {
        consentStatus: status,
        parentNotes: '' // Could add a modal to collect notes if needed
      });
      
      // Refresh the data after submission
      await loadData();
      
      // Show success message
      const displayStatus = status === 'REJECTED' ? 'declined' : status.toLowerCase();
      setSnackbar({
        open: true,
        message: `Vaccination consent ${displayStatus}d successfully!`,
        severity: 'success'
      });
      
      console.log(`Consent ${consentId} ${displayStatus}d successfully`);
    } catch (error) {
      console.error('Error submitting consent:', error);
      setError(`Failed to submit consent decision: ${error.message}`);
      setSnackbar({
        open: true,
        message: `Failed to submit consent: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Try to get user profile, but handle case where endpoint might not exist yet
      let userProfile = null;
      try {
        userProfile = await getUserProfile();
      } catch (profileError) {
        console.log('User profile endpoint not available yet, using fallback data');
        // Fallback to basic data if the profile endpoint isn't implemented yet
      }
      
      setStudentData({
        name: userProfile?.fullName || userProfile?.username || 'Student Name',
        grade: 'N/A', // Grade info would need to come from student records
        birthDate: new Date().toISOString(),
        medicalAlerts: [] // Medical alerts would need to come from student health records
      });
      
      // Try to load vaccination consent data
      try {
        // Try to get parent's students first
        let students = [];
        try {
          students = await getParentStudents();
        } catch (studentsError) {
          console.log('Parent students API not available yet');
        }
        
        // Use first student or fallback to test data
        let studentCode = "STU001"; // Default fallback
        if (students && students.length > 0) {
          studentCode = students[0].studentCode;
          // Update student data with real info
          setStudentData({
            name: students[0].name || 'Student Name',
            grade: students[0].gradeLevel?.gradeName || 'N/A',
            birthDate: students[0].birthDate || new Date().toISOString(),
            medicalAlerts: students[0].medicalAlerts || []
          });
        }
        
        console.log('Loading vaccination consents for student code:', studentCode);
        
        const [pendingConsentData, submittedConsentData] = await Promise.all([
          getPendingVaccinationConsents(studentCode),
          getSubmittedVaccinationConsents(studentCode)
        ]);
        
        console.log('Pending consents:', pendingConsentData);
        console.log('Submitted consents:', submittedConsentData);
        
        // Log individual consent data for debugging
        if (pendingConsentData && pendingConsentData.length > 0) {
          console.log('First pending consent details:', pendingConsentData[0]);
          console.log('Student name from consent:', pendingConsentData[0].studentName);
          console.log('Event description from consent:', pendingConsentData[0].eventDescription);
        }
        
        if (submittedConsentData && submittedConsentData.length > 0) {
          console.log('First submitted consent details:', submittedConsentData[0]);
        }
        
        setPendingConsents(pendingConsentData || []);
        setSubmittedConsents(submittedConsentData || []);
        
        // Update student data from consent data if available and valid
        let studentNameFromConsents = null;
        
        // Try to get student name from pending consents first
        if (pendingConsentData && pendingConsentData.length > 0) {
          const firstConsent = pendingConsentData[0];
          if (firstConsent.studentName && firstConsent.studentName !== 'Student Name') {
            studentNameFromConsents = firstConsent.studentName;
          }
        }
        
        // If not found in pending, try submitted consents
        if (!studentNameFromConsents && submittedConsentData && submittedConsentData.length > 0) {
          const firstConsent = submittedConsentData[0];
          if (firstConsent.studentName && firstConsent.studentName !== 'Student Name') {
            studentNameFromConsents = firstConsent.studentName;
          }
        }
        
        // Update student data if we found a valid name
        if (studentNameFromConsents) {
          console.log('Updating student name to:', studentNameFromConsents);
          setStudentData(prev => ({
            ...prev,
            name: studentNameFromConsents
          }));
        } else {
          console.log('No valid student name found in consent data, keeping fallback');
        }
        
      } catch (apiError) {
        console.log('Vaccination consent API error:', apiError);
        setPendingConsents([]);
        setSubmittedConsents([]);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <Box className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="p-6 bg-gray-50 min-h-screen">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box className="p-6 bg-gray-50 min-h-screen">
      <Box className="mb-6">
        <Box className="flex items-center gap-3 mb-4">
          <VaccinesOutlined className="text-blue-600" sx={{ fontSize: 32 }} />
          <Typography variant="h4" className="font-bold text-gray-800">
            Vaccination Consent
          </Typography>
        </Box>
        <Typography variant="body1" className="text-gray-600">
          Review and provide consent for your child's vaccination requirements.
        </Typography>
      </Box>

      {studentData && (
        <Card className="mb-6">
          <CardContent>
            <Typography variant="h6" className="font-semibold mb-1">
              {studentData.name}
            </Typography>
            <Typography variant="body2" className="text-gray-600 mb-2">
              {studentData.grade}
            </Typography>
            <Typography variant="h4" className="font-bold text-blue-600">
              {pendingConsents.length}
            </Typography>
            <Typography variant="caption" className="text-gray-500">
              Pending Consents
            </Typography>
            {submittedConsents.length > 0 && (
              <>
                <Typography variant="body2" className="font-bold text-green-600 mt-2">
                  {submittedConsents.length}
                </Typography>
                <Typography variant="caption" className="text-gray-500">
                  Completed Consents
                </Typography>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pending Consents Section */}
      {pendingConsents.length > 0 && (
        <Box className="mb-6">
          <Typography variant="h6" className="mb-3 font-semibold">
            Pending Vaccination Consents
          </Typography>
          {pendingConsents.map((consent) => (
            <Card key={consent.consentId} className="mb-3">
              <CardContent>
                <Box className="flex flex-col gap-3">
                  <Box className="flex justify-between items-start">
                    <Box>
                      <Typography variant="h6" className="font-semibold text-blue-600">
                        {consent.eventName || 'Vaccination Event'}
                      </Typography>
                      {/* Display vaccine name prominently */}
                      {consent.eventDescription ? (
                        <Typography variant="body1" className="text-purple-700 font-semibold bg-purple-50 px-2 py-1 rounded mb-2 inline-block">
                          💉 Vaccine: {consent.eventDescription}
                        </Typography>
                      ) : (
                        <Typography variant="body1" className="text-gray-500 font-medium bg-gray-50 px-2 py-1 rounded mb-2 inline-block">
                          💉 Vaccine: Not specified
                        </Typography>
                      )}
                      <br />
                      <Typography variant="body2" className="text-gray-600">
                        📅 Event Date: {consent.scheduledDate 
                          ? new Date(consent.scheduledDate).toLocaleDateString()
                          : 'Date not specified'
                        }
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        📍 Location: {consent.location || 'Location not specified'}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600 font-medium">
                        👤 Student: {consent.studentName || studentData?.name || 'Student name not available'}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        📤 Sent Date: {consent.sentDate 
                          ? new Date(consent.sentDate).toLocaleDateString()
                          : 'Recently sent'
                        }
                      </Typography>
                    </Box>
                    <Typography 
                      variant="caption" 
                      className="px-2 py-1 bg-orange-100 text-orange-800 rounded"
                    >
                      {consent.consentStatus || 'PENDING'}
                    </Typography>
                  </Box>
                  
                  <Box className="flex gap-3 mt-3">
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={() => handleConsent(consent.consentId, 'APPROVED')}
                    >
                      Approve
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="error"
                      onClick={() => handleConsent(consent.consentId, 'REJECTED')}
                    >
                      Decline
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Submitted Consents Section */}
      {submittedConsents.length > 0 && (
        <Box className="mb-6">
          <Typography variant="h6" className="mb-3 font-semibold">
            Previous Vaccination Consents
          </Typography>
          {submittedConsents.map((consent) => (
            <Card key={consent.consentId} className="mb-3">
              <CardContent>
                <Box className="flex justify-between items-start">
                  <Box>
                    <Typography variant="h6" className="font-semibold">
                      {consent.eventName || 'Vaccination Event'}
                    </Typography>
                    {/* Display vaccine name */}
                    {consent.eventDescription ? (
                      <Typography variant="body2" className="text-blue-700 font-medium bg-blue-50 px-2 py-1 rounded mb-1 inline-block">
                        💉 Vaccine: {consent.eventDescription}
                      </Typography>
                    ) : (
                      <Typography variant="body2" className="text-gray-500 font-medium">
                        💉 Vaccine: Not specified
                      </Typography>
                    )}
                    <br />
                    <Typography variant="body2" className="text-gray-600">
                      📅 Event Date: {consent.scheduledDate 
                        ? new Date(consent.scheduledDate).toLocaleDateString()
                        : 'Date not specified'
                      }
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      ✅ Submitted: {consent.consentDate 
                        ? new Date(consent.consentDate).toLocaleDateString()
                        : 'Recently submitted'
                      }
                    </Typography>
                    <Typography variant="body2" className="text-gray-600 font-medium">
                      👤 Student: {consent.studentName || studentData?.name || 'Student name not available'}
                    </Typography>
                  </Box>
                  <Typography 
                    variant="caption" 
                    className={`px-2 py-1 rounded ${
                      consent.consentStatus === 'APPROVED' 
                        ? 'bg-green-100 text-green-800' 
                        : consent.consentStatus === 'REJECTED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {consent.consentStatus === 'REJECTED' ? 'DECLINED' : consent.consentStatus}
                  </Typography>
                </Box>
                
                {consent.parentNotes && (
                  <Typography variant="body2" className="text-gray-700 mt-2">
                    Notes: {consent.parentNotes}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* No Consents Message */}
      {pendingConsents.length === 0 && submittedConsents.length === 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" className="mb-3">
              No vaccination consents at this time.
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              When vaccination events are created for your child's grade level, 
              consent requests will appear here.
            </Typography>
          </CardContent>
        </Card>
      )}
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VaccinationConsent;
