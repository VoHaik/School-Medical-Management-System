import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  Pagination
} from '@mui/material';
import { VaccinesOutlined, PendingActions, CheckCircle, Person } from '@mui/icons-material';
import { 
  getPendingVaccinationConsents, 
  getSubmittedVaccinationConsents,
  getParentStudents,
  submitVaccinationConsent,
  getStudentVaccinationHistory
} from '../../utils/api';

const VaccinationConsent = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [pendingConsents, setPendingConsents] = useState([]);
  const [submittedConsents, setSubmittedConsents] = useState([]);
  const [vaccinationHistory, setVaccinationHistory] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Pagination states
  const [submittedConsentsPage, setSubmittedConsentsPage] = useState(1);
  const [vaccinationHistoryPage, setVaccinationHistoryPage] = useState(1);
  const itemsPerPage = 10;

  const handleConsent = async (consentId, status) => {
    try {
      setLoading(true);
      
      // Submit the consent decision
      await submitVaccinationConsent(consentId, {
        consentStatus: status,
        parentNotes: '' // Could add a modal to collect notes if needed
      });
      
      // Refresh the consent data for the selected student
      if (selectedStudent) {
        await loadConsentData(selectedStudent);
      }
      
      // Show success message
      const displayStatus = status === 'REJECTED' ? 'declined' : status.toLowerCase();
      setSnackbar({
        open: true,
        message: `Vaccination consent ${displayStatus}d successfully!`,
        severity: 'success'
      });
      
      } catch (error) {
      console.error('Error submitting consent:', error);
      setSnackbar({
        open: true,
        message: `Failed to submit consent: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadConsentData = async (studentCode) => {
    try {
      const [pendingConsentData, submittedConsentData, vaccinationHistoryData] = await Promise.all([
        getPendingVaccinationConsents(studentCode),
        getSubmittedVaccinationConsents(studentCode),
        getStudentVaccinationHistory(studentCode)
      ]);
      
      setPendingConsents(pendingConsentData || []);
      setSubmittedConsents(submittedConsentData || []);
      setVaccinationHistory(vaccinationHistoryData || []);
    } catch (error) {
      console.error('Error loading consent data:', error);
      setPendingConsents([]);
      setSubmittedConsents([]);
      setVaccinationHistory([]);
    }
  };

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const studentsData = await getParentStudents();
      
      if (studentsData && studentsData.length > 0) {
        setStudents(studentsData);
        // Reset pagination when loading students
        setSubmittedConsentsPage(1);
        setVaccinationHistoryPage(1);
        // Auto-select first student and load their consent data
        const firstStudent = studentsData[0];
        setSelectedStudent(firstStudent.studentCode);
        await loadConsentData(firstStudent.studentCode);
      } else {
        setError('No students found for this parent account.');
      }
    } catch (err) {
      console.error('Error loading students:', err);
      setError('Failed to load student information. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleStudentChange = async (event) => {
    const studentCode = event.target.value;
    setSelectedStudent(studentCode);
    
    // Reset pagination when student changes
    setSubmittedConsentsPage(1);
    setVaccinationHistoryPage(1);
    
    if (studentCode) {
      setLoading(true);
      await loadConsentData(studentCode);
      setLoading(false);
    }
  };

  const getSelectedStudentInfo = () => {
    return students.find(student => student.studentCode === selectedStudent);
  };

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

  const selectedStudentInfo = getSelectedStudentInfo();

  return (
    <Box className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
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

      {/* Student Selection Dropdown - Always show when there are students */}
      {students.length > 0 ? (
        <Card className="mb-6 border-l-4 border-blue-400">
          <CardContent>
            <Typography variant="h6" className="mb-3 font-semibold text-blue-700">
              {students.length > 1 
                ? `Select Your Child (${students.length} children)` 
                : 'Your Child'
              }
            </Typography>
            <FormControl fullWidth>
              <InputLabel>
                {students.length > 1 
                  ? 'Choose which child to view vaccination consents for'
                  : 'Student information'
                }
              </InputLabel>
              <Select
                value={selectedStudent}
                onChange={handleStudentChange}
                label={students.length > 1 
                  ? 'Choose which child to view vaccination consents for'
                  : 'Student information'
                }
                sx={{ 
                  '& .MuiSelect-select': { 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 2
                  }
                }}
              >
                {students.map((student) => (
                  <MenuItem key={student.studentCode} value={student.studentCode}>
                    <Typography variant="body1" className="font-semibold text-gray-800">
                      {student.fullName}
                    </Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {students.length > 1 && !selectedStudent && (
              <Box className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <Typography variant="body2" className="text-amber-700 flex items-center gap-2">
                  Please select one of your children to view their vaccination consent information.
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      ) : (
        // No students found
        <Card className="mb-6 border-l-4 border-red-400">
          <CardContent className="text-center py-8">
            <Person sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" className="mb-2 text-red-700">
              No Students Found
            </Typography>
            <Typography variant="body2" className="text-red-500">
              No student records found for this parent account. Please contact the school administration.
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Show message when no student selected (multiple children case) */}
      {students.length > 1 && !selectedStudent && (
        <Card className="mb-6 border-l-4 border-amber-400">
          <CardContent className="text-center py-8">
            <Person sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" className="mb-2 text-gray-700">
              Please Select Your Child
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              You have {students.length} children. Please use the dropdown above to select which child's vaccination consent information you want to view.
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Student Info and Summary Card - Always show when student is selected */}
      {selectedStudentInfo && (
        <Card className="mb-6 border-l-4 border-blue-400">
          <CardContent>
            {/* Student Header */}
            <Box className="mb-4">
              <Typography variant="h6" className="font-bold text-gray-800 mb-1">
                {selectedStudentInfo.fullName}
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                {selectedStudentInfo.gradeName || 'Grade not specified'}
              </Typography>
            </Box>
            
            <Divider className="my-4" />
            
            <Box className="grid grid-cols-3 gap-4">
              {/* Pending Consents */}
              <Box className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <PendingActions className="text-orange-600" sx={{ fontSize: 32 }} />
                <Box>
                  <Typography variant="h4" className="font-bold text-orange-600">
                    {pendingConsents.length}
                  </Typography>
                  <Typography variant="body2" className="text-orange-700 font-medium">
                    Pending Consents
                  </Typography>
                </Box>
              </Box>
              
              {/* Completed Consents */}
              <Box className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="text-green-600" sx={{ fontSize: 32 }} />
                <Box>
                  <Typography variant="h4" className="font-bold text-green-600">
                    {submittedConsents.length}
                  </Typography>
                  <Typography variant="body2" className="text-green-700 font-medium">
                    Completed Consents
                  </Typography>
                </Box>
              </Box>
              
              {/* Vaccination History */}
              <Box className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <VaccinesOutlined className="text-blue-600" sx={{ fontSize: 32 }} />
                <Box>
                  <Typography variant="h4" className="font-bold text-blue-600">
                    {vaccinationHistory.length}
                  </Typography>
                  <Typography variant="body2" className="text-blue-700 font-medium">
                    Vaccines Received
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Pending Consents Section */}
      {pendingConsents.length > 0 && (
        <Box className="mb-6">
          <Box className="flex items-center gap-2 mb-4">
            <PendingActions className="text-orange-600" />
            <Typography variant="h6" className="font-semibold text-orange-700">
              Pending Vaccination Consents
            </Typography>
            <Chip 
              label={pendingConsents.length} 
              size="small" 
              className="bg-orange-100 text-orange-800"
            />
          </Box>
          {pendingConsents.map((consent) => (
            <Card key={consent.consentId} className="mb-4 border-l-4 border-orange-400">
              <CardContent>
                <Box className="flex flex-col gap-3">
                  <Box className="flex justify-between items-start">
                    <Box className="flex-1">
                      <Typography variant="h6" className="font-semibold text-blue-600 mb-2">
                        {consent.eventName || 'Vaccination Event'}
                      </Typography>
                      
                      {/* Vaccine Information - Prominent Display */}
                      <Box className="mb-3">
                        {(consent.vaccineNames && consent.vaccineNames.length > 0) ? (
                          <Box className="flex flex-wrap gap-2">
                            {consent.vaccineNames.map((vaccineName, index) => (
                              <Chip
                                key={index}
                                icon={<VaccinesOutlined />}
                                label={vaccineName}
                                className="bg-purple-100 text-purple-800 font-medium"
                                size="medium"
                              />
                            ))}
                          </Box>
                        ) : (consent.vaccineName || consent.eventDescription) ? (
                          <Chip
                            icon={<VaccinesOutlined />}
                            label={`Vaccine: ${consent.vaccineName || consent.eventDescription}`}
                            className="bg-purple-100 text-purple-800 font-medium"
                            size="medium"
                          />
                        ) : (
                          <Chip
                            icon={<VaccinesOutlined />}
                            label="Vaccine: Not specified"
                            className="bg-gray-100 text-gray-600"
                            size="medium"
                          />
                        )}
                      </Box>

                      {/* Event Details */}
                      <Box className="space-y-2">
                        <Typography variant="body2" className="text-gray-600 flex items-center gap-1">
                          <strong>Event Date:</strong> {consent.scheduledDate 
                            ? new Date(consent.scheduledDate).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })
                            : 'Date not specified'
                          }
                        </Typography>
                        <Typography variant="body2" className="text-gray-600 flex items-center gap-1">
                          <strong>Location:</strong> {consent.location || 'School Health Center'}
                        </Typography>
                        <Typography variant="body2" className="text-gray-600 flex items-center gap-1">
                          <strong>Sent:</strong> {consent.sentDate 
                            ? new Date(consent.sentDate).toLocaleDateString()
                            : 'Recently sent'
                          }
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Chip
                      label="PENDING RESPONSE"
                      className="bg-orange-100 text-orange-800 font-medium"
                      size="small"
                    />
                  </Box>
                  
                  <Divider />
                  
                  <Box className="flex gap-3 pt-2">
                    <Button 
                      variant="contained" 
                      color="success"
                      size="large"
                      onClick={() => handleConsent(consent.consentId, 'APPROVED')}
                      className="flex-1"
                      startIcon={<CheckCircle />}
                    >
                      Give Consent
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="error"
                      size="large"
                      onClick={() => handleConsent(consent.consentId, 'REJECTED')}
                      className="flex-1"
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
          <Box className="flex items-center gap-2 mb-4">
            <CheckCircle className="text-green-600" />
            <Typography variant="h6" className="font-semibold text-green-700">
              Previous Vaccination Consents
            </Typography>
            <Chip 
              label={submittedConsents.length} 
              size="small" 
              className="bg-green-100 text-green-800"
            />
          </Box>
          
          {/* Paginated Submitted Consents */}
          {submittedConsents
            .slice((submittedConsentsPage - 1) * itemsPerPage, submittedConsentsPage * itemsPerPage)
            .map((consent) => (
            <Card key={consent.consentId} className="mb-3 border-l-4 border-green-400">
              <CardContent>
                <Box className="flex justify-between items-start">
                  <Box className="flex-1">
                    <Typography variant="h6" className="font-semibold mb-2">
                      {consent.eventName || 'Vaccination Event'}
                    </Typography>
                    
                    {/* Vaccine Information */}
                    <Box className="mb-3">
                      {(consent.vaccineNames && consent.vaccineNames.length > 0) ? (
                        <Box className="flex flex-wrap gap-2">
                          {consent.vaccineNames.map((vaccineName, index) => (
                            <Chip
                              key={index}
                              icon={<VaccinesOutlined />}
                              label={vaccineName}
                              className="bg-blue-100 text-blue-800"
                              size="medium"
                            />
                          ))}
                        </Box>
                      ) : (consent.vaccineName || consent.eventDescription) ? (
                        <Chip
                          icon={<VaccinesOutlined />}
                          label={`Vaccine: ${consent.vaccineName || consent.eventDescription}`}
                          className="bg-blue-100 text-blue-800"
                          size="medium"
                        />
                      ) : (
                        <Chip
                          icon={<VaccinesOutlined />}
                          label="Vaccine: Not specified"
                          className="bg-gray-100 text-gray-600"
                          size="medium"
                        />
                      )}
                    </Box>

                    {/* Event Details */}
                    <Box className="space-y-1">
                      <Typography variant="body2" className="text-gray-600 flex items-center gap-1">
                        <strong>Event Date:</strong> {consent.scheduledDate 
                          ? new Date(consent.scheduledDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : 'Date not specified'
                        }
                      </Typography>
                      <Typography variant="body2" className="text-gray-600 flex items-center gap-1">
                        <strong>Response Submitted:</strong> {consent.consentDate 
                          ? new Date(consent.consentDate).toLocaleDateString()
                          : 'Recently submitted'
                        }
                      </Typography>
                    </Box>

                    {consent.parentNotes && (
                      <Box className="mt-3 p-2 bg-gray-50 rounded">
                        <Typography variant="body2" className="text-gray-700">
                          <strong>Your Notes:</strong> {consent.parentNotes}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  
                  <Chip
                    label={consent.consentStatus === 'REJECTED' ? 'DECLINED' : consent.consentStatus}
                    className={`font-medium ${
                      consent.consentStatus === 'APPROVED' 
                        ? 'bg-green-100 text-green-800' 
                        : consent.consentStatus === 'REJECTED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  />
                </Box>
              </CardContent>
            </Card>
          ))}
          
          {/* Pagination for Submitted Consents */}
          {submittedConsents.length > itemsPerPage && (
            <Box className="flex flex-col items-center mt-4 gap-2">
              <Typography variant="caption" className="text-gray-600">
                Showing {((submittedConsentsPage - 1) * itemsPerPage) + 1} - {Math.min(submittedConsentsPage * itemsPerPage, submittedConsents.length)} of {submittedConsents.length} consents
              </Typography>
              <Pagination
                count={Math.ceil(submittedConsents.length / itemsPerPage)}
                page={submittedConsentsPage}
                onChange={(event, value) => setSubmittedConsentsPage(value)}
                color="primary"
                shape="rounded"
                showFirstButton
                showLastButton
                size="medium"
              />
            </Box>
          )}
        </Box>
      )}

      {/* Vaccination History Section */}
      {vaccinationHistory.length > 0 && (
        <Box className="mb-6">
          <Box className="flex items-center gap-2 mb-4">
            <VaccinesOutlined className="text-blue-600" />
            <Typography variant="h6" className="font-semibold text-blue-700">
              Vaccination History
            </Typography>
            <Chip 
              label={vaccinationHistory.length} 
              size="small" 
              className="bg-blue-100 text-blue-800"
            />
          </Box>
          <Typography variant="body2" className="text-gray-600 mb-4">
            Complete record of vaccinations your child has received at school.
          </Typography>
          
          {/* Paginated Vaccination History */}
          {vaccinationHistory
            .slice((vaccinationHistoryPage - 1) * itemsPerPage, vaccinationHistoryPage * itemsPerPage)
            .map((record) => (
            <Card key={`${record.eventId}-${record.eventDate}`} className="mb-3 border-l-4 border-blue-400">
              <CardContent>
                <Box className="flex justify-between items-start mb-4">
                  <Box className="flex-1">
                    <Typography variant="h6" className="font-semibold mb-2 text-blue-600">
                      {record.eventName || 'Vaccination Event'}
                    </Typography>
                    
                    {/* Vaccine Information - Group display */}
                    <Box className="mb-3">
                      {record.vaccineNames && record.vaccineNames.length > 0 ? (
                        <Box className="flex flex-wrap gap-2">
                          {record.vaccineNames.map((vaccineName, index) => (
                            <Chip
                              key={index}
                              icon={<VaccinesOutlined />}
                              label={vaccineName}
                              className="bg-green-100 text-green-800 font-medium"
                              size="medium"
                            />
                          ))}
                        </Box>
                      ) : (
                        <Chip
                          icon={<VaccinesOutlined />}
                          label="Vaccine information not available"
                          className="bg-gray-100 text-gray-600"
                          size="medium"
                        />
                      )}
                    </Box>
                  </Box>
                  
                  <Chip
                    label="COMPLETED"
                    className="bg-green-100 text-green-800 font-medium"
                    size="small"
                  />
                </Box>

                {/* Detailed Information Grid */}
                <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Left Column */}
                  <Box className="space-y-3">
                    <Box>
                      <Typography variant="body2" className="text-gray-600 font-semibold">
                        📅 Vaccination Date:
                      </Typography>
                      <Typography variant="body2" className="text-gray-800 ml-2">
                        {record.eventDate || record.vaccinationDate
                          ? new Date(record.eventDate || record.vaccinationDate).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : 'Date not available'
                        }
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2" className="text-gray-600 font-semibold">
                        🏥 Location:
                      </Typography>
                      <Typography variant="body2" className="text-gray-800 ml-2">
                        {record.location || 'School Health Center'}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2" className="text-gray-600 font-semibold">
                        💉 Dose Information:
                      </Typography>
                      <Typography variant="body2" className="text-gray-800 ml-2">
                        {record.dose || 'Standard dose'}
                      </Typography>
                    </Box>

                    {record.administeredBy && (
                      <Box>
                        <Typography variant="body2" className="text-gray-600 font-semibold">
                          👩‍⚕️ Administered By:
                        </Typography>
                        <Typography variant="body2" className="text-gray-800 ml-2">
                          {record.administeredBy}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Right Column */}
                  <Box className="space-y-3">
                    {/* Next Due Date */}
                    <Box>
                      <Typography variant="body2" className="text-gray-600 font-semibold">
                        📆 Next Due Date:
                      </Typography>
                      <Typography variant="body2" className={`ml-2 ${record.nextDueDate ? 'text-orange-600 font-medium' : 'text-gray-500'}`}>
                        {record.nextDueDate 
                          ? new Date(record.nextDueDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : 'Not applicable'
                        }
                      </Typography>
                    </Box>

                    {/* Adverse Reactions */}
                    <Box>
                      <Typography variant="body2" className="text-gray-600 font-semibold">
                        ⚠️ Adverse Reactions:
                      </Typography>
                      <Box className="ml-2 mt-1">
                        {record.adverseReactions ? (
                          record.adverseReactions.split(',').map((reaction, index) => (
                            <Chip
                              key={index}
                              label={reaction.trim()}
                              size="small"
                              className={`mr-1 mb-1 ${
                                reaction.trim().toLowerCase() === 'none' || reaction.trim().toLowerCase() === 'no reactions'
                                  ? 'bg-green-50 text-green-700 border border-green-200'
                                  : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                              }`}
                            />
                          ))
                        ) : record.reactions && record.reactions.length > 0 ? (
                          record.reactions.map((reaction, index) => (
                            <Chip
                              key={index}
                              label={reaction}
                              size="small"
                              className={`mr-1 mb-1 ${
                                reaction.toLowerCase() === 'none' || reaction.toLowerCase() === 'no reactions'
                                  ? 'bg-green-50 text-green-700 border border-green-200'
                                  : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                              }`}
                            />
                          ))
                        ) : (
                          <Chip
                            label="None reported"
                            size="small"
                            className="bg-green-50 text-green-700 border border-green-200"
                          />
                        )}
                      </Box>
                    </Box>

                    {/* Batch Number if available */}
                    {record.batchNumber && (
                      <Box>
                        <Typography variant="body2" className="text-gray-600 font-semibold">
                          🏷️ Batch Number:
                        </Typography>
                        <Typography variant="body2" className="text-gray-800 ml-2 font-mono text-sm">
                          {record.batchNumber}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>

                {/* Notes Section */}
                {record.notes && (
                  <Box className="mt-4 p-3 bg-gray-50 rounded-lg border">
                    <Typography variant="body2" className="text-gray-600 font-semibold mb-1">
                      📝 Additional Notes:
                    </Typography>
                    <Typography variant="body2" className="text-gray-700">
                      {record.notes}
                    </Typography>
                  </Box>
                )}

                {/* Vaccination Status Summary */}
                <Divider className="my-3" />
                <Box className="flex items-center justify-between">
                  <Typography variant="caption" className="text-gray-500">
                    Record ID: {record.recordId || record.eventId || 'N/A'}
                  </Typography>
                  <Box className="flex items-center gap-2">
                    {record.nextDueDate && new Date(record.nextDueDate) > new Date() && (
                      <Chip
                        label={`Next due in ${Math.ceil((new Date(record.nextDueDate) - new Date()) / (1000 * 60 * 60 * 24))} days`}
                        size="small"
                        className="bg-blue-50 text-blue-700 border border-blue-200"
                      />
                    )}
                    <Typography variant="caption" className="text-gray-500">
                      Status: Completed ✅
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
          
          {/* Pagination for Vaccination History */}
          {vaccinationHistory.length > itemsPerPage && (
            <Box className="flex flex-col items-center mt-4 gap-2">
              <Typography variant="caption" className="text-gray-600">
                Showing {((vaccinationHistoryPage - 1) * itemsPerPage) + 1} - {Math.min(vaccinationHistoryPage * itemsPerPage, vaccinationHistory.length)} of {vaccinationHistory.length} vaccination records
              </Typography>
              <Pagination
                count={Math.ceil(vaccinationHistory.length / itemsPerPage)}
                page={vaccinationHistoryPage}
                onChange={(event, value) => setVaccinationHistoryPage(value)}
                color="primary"
                shape="rounded"
                showFirstButton
                showLastButton
                size="medium"
              />
            </Box>
          )}
        </Box>
      )}

      {/* No Consents Message or No Student Selected */}
      {!selectedStudentInfo && students.length > 1 ? (
        <Card className="text-center">
          <CardContent className="py-12">
            <Person sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" className="mb-3 text-gray-600">
              Please select a student
            </Typography>
            <Typography variant="body2" className="text-gray-500 max-w-md mx-auto">
              Choose your child from the dropdown above to view their vaccination consent information.
            </Typography>
          </CardContent>
        </Card>
      ) : pendingConsents.length === 0 && submittedConsents.length === 0 && vaccinationHistory.length === 0 && selectedStudentInfo ? (
        <Card className="text-center">
          <CardContent className="py-12">
            <VaccinesOutlined sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" className="mb-3 text-gray-600">
              No vaccination consents at this time
            </Typography>
            <Typography variant="body2" className="text-gray-500 max-w-md mx-auto">
              When vaccination events are created for {selectedStudentInfo.name}'s grade level, 
              consent requests will appear here for your review.
            </Typography>
          </CardContent>
        </Card>
      ) : null}
      
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
