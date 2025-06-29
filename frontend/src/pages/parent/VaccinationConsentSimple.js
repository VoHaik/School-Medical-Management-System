import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import { VaccinesOutlined } from '@mui/icons-material';
import { 
  getUserProfile, 
  getPendingVaccinationConsents, 
  getSubmittedVaccinationConsents,
  getParentStudents
} from '../../utils/api';

const VaccinationConsent = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [pendingConsents, setPendingConsents] = useState([]);
  const [submittedConsents, setSubmittedConsents] = useState([]);

  useEffect(() => {
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
          
          setPendingConsents(pendingConsentData || []);
          setSubmittedConsents(submittedConsentData || []);
          
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
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent>
          <Typography variant="h6" className="mb-3">
            No pending vaccination consents at this time.
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            When vaccination events are created for your child's grade level, 
            consent requests will appear here.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default VaccinationConsent;
