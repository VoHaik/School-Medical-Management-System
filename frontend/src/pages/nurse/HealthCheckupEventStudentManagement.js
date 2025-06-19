import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Grid,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip
} from '@mui/material';
import { AddCircleOutline as AddIcon, Edit as EditIcon, ArrowBack as ArrowBackIcon, Visibility as ViewIcon } from '@mui/icons-material';
import StudentHealthCheckupForm from '../../components/healthcheckup/StudentHealthCheckupForm';
import { 
    getHealthCheckupEventById, 
    getStudentHealthCheckupsByEventId, 
    createStudentHealthCheckup, 
    updateStudentHealthCheckup, 
    // deleteStudentHealthCheckup, // If needed
    getAllStudents // To list students to add to the event
} from '../../utils/api';

// Modal style (can be shared or defined locally)
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 700,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: '90vh',
  overflowY: 'auto'
};

const HealthCheckupEventStudentManagement = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [eventDetails, setEventDetails] = useState(null);
  const [studentCheckups, setStudentCheckups] = useState([]);
  const [allStudents, setAllStudents] = useState([]); // For adding students not yet in checkup
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [selectedCheckup, setSelectedCheckup] = useState(null); // For editing a checkup
  const [selectedStudentForNewCheckup, setSelectedStudentForNewCheckup] = useState(null); // For creating a new checkup
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchEventData = useCallback(async () => {
    setLoading(true);
    try {
      const [eventData, checkupsData, studentsData] = await Promise.all([
        getHealthCheckupEventById(eventId),
        getStudentHealthCheckupsByEventId(eventId),
        getAllStudents() // Fetch all students to allow adding them
      ]);
      setEventDetails(eventData);
      setStudentCheckups(checkupsData || []);
      setAllStudents(studentsData || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch event or student checkup data.');
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchEventData();
  }, [fetchEventData]);

  const handleOpenCreateModal = (student) => {
    setSelectedStudentForNewCheckup(student); // Pass the whole student object
    setSelectedCheckup(null);
    setIsEditMode(false);
    setOpenFormModal(true);
  };

  const handleOpenEditModal = (checkup) => {
    setSelectedCheckup(checkup);
    setSelectedStudentForNewCheckup(null); // Not creating, but editing
    setIsEditMode(true);
    setOpenFormModal(true);
  };

  const handleCloseModal = () => {
    setOpenFormModal(false);
    setSelectedCheckup(null);
    setSelectedStudentForNewCheckup(null);
    setIsEditMode(false);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (isEditMode && selectedCheckup) {
        await updateStudentHealthCheckup(selectedCheckup.checkupId, formData);
      } else if (selectedStudentForNewCheckup) {
        const payload = {
          ...formData,
          student: { userId: selectedStudentForNewCheckup.userId }, // Send student ID
          healthCheckupEvent: { eventId: parseInt(eventId) } // Send event ID
        };
        await createStudentHealthCheckup(payload);
      }
      fetchEventData();
      handleCloseModal();
    } catch (err) {
      setError(err.message || `Failed to ${isEditMode ? 'update' : 'record'} student checkup.`);
    }
  };
  
  // Students who do not have a checkup record for this event yet
  const studentsNotYetInCheckup = allStudents.filter(
    student => !studentCheckups.some(sc => sc.student.userId === student.userId)
  );

  if (loading) {
    return <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh"><CircularProgress /></Box>;
  }

  return (
    <Paper sx={{ p: { xs: 1, sm: 2, md: 3 }, m: { xs: 1, sm: 2 } }}>
      <Button startIcon={<ArrowBackIcon />} component={RouterLink} to="/nurse/health-checkup-events" sx={{ mb: 2 }}>
        Back to Events
      </Button>
      <Typography variant="h4" gutterBottom>
        Manage Students for: {eventDetails?.eventName || 'Loading event...'}
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Typography variant="h6" sx={{mt:3, mb:1}}>Students with Recorded Checkups</Typography>
      {studentCheckups.length > 0 ? (
        <TableContainer component={Paper} elevation={2} sx={{mb:3}}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student Name</TableCell>
                <TableCell>Height</TableCell>
                <TableCell>Weight</TableCell>
                <TableCell>Vision</TableCell>
                <TableCell>Consent</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {studentCheckups.map((checkup) => (
                <TableRow key={checkup.checkupId}>
                  <TableCell>{checkup.student?.firstName} {checkup.student?.lastName}</TableCell>
                  <TableCell>{checkup.height || 'N/A'}</TableCell>
                  <TableCell>{checkup.weight || 'N/A'}</TableCell>
                  <TableCell>{checkup.vision || 'N/A'}</TableCell>
                  <TableCell>{checkup.consentStatus}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit Checkup Record">
                      <IconButton onClick={() => handleOpenEditModal(checkup)} color="primary">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    {/* Add View details button if needed */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography sx={{mb:3}}>No student checkups recorded for this event yet.</Typography>
      )}

      <Typography variant="h6" sx={{mt:3, mb:1}}>Add Checkup for Student</Typography>
      {studentsNotYetInCheckup.length > 0 ? (
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student Name</TableCell>
                <TableCell>Class</TableCell> {/* Assuming student object has class info */}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {studentsNotYetInCheckup.map((student) => (
                <TableRow key={student.userId}>
                  <TableCell>{student.firstName} {student.lastName}</TableCell>
                  <TableCell>{student.clazz?.name || 'N/A'}</TableCell> {/* Adjust based on actual student object structure */}
                  <TableCell>
                    <Button 
                      variant="outlined" 
                      startIcon={<AddIcon />} 
                      onClick={() => handleOpenCreateModal(student)}
                    >
                      Add Checkup Record
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>All students have a checkup record for this event or no students available.</Typography>
      )}

      <Modal open={openFormModal} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <StudentHealthCheckupForm
            onSubmit={handleFormSubmit}
            initialData={selectedCheckup} // This will be the full checkup object for edit
            isEdit={isEditMode}
            // Pass studentId and eventId if your form needs them directly, 
            // though often it's better to handle this in the submit logic as done above.
            studentId={isEditMode ? selectedCheckup?.student?.userId : selectedStudentForNewCheckup?.userId}
            eventId={parseInt(eventId)}
          />
        </Box>
      </Modal>
    </Paper>
  );
};

export default HealthCheckupEventStudentManagement;
