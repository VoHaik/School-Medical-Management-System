import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useFetch } from '../../hooks/useFetch'; // Assuming useFetch can be used for authenticated GET requests
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Button,
  Breadcrumbs,
  Container
} from '@mui/material';
import { Home as HomeIcon, NavigateNext as NavigateNextIcon, EventNote as EventNoteIcon } from '@mui/icons-material';

const ChildMedicalHistory = () => {
  const { childId } = useParams();
  const { currentUser, getAuthAxios } = useContext(AuthContext);
  const [medicalEvents, setMedicalEvents] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch student details to get name (optional, could be passed as prop or fetched from a student context)
  useEffect(() => {
    const fetchStudentDetails = async () => {
      if (currentUser && childId) {
        try {
          const axiosInstance = getAuthAxios();
          const response = await axiosInstance.get(`/api/students/${childId}`);
          setStudentName(response.data.fullName || response.data.name || 'Your Child');
        } catch (err) {
          console.error("Failed to fetch student details:", err);
          setStudentName('Your Child'); // Fallback name
        }
      }
    };
    fetchStudentDetails();
  }, [childId, currentUser, getAuthAxios]);

  // Fetch medical events
  useEffect(() => {
    const fetchMedicalEvents = async () => {
      if (currentUser && childId) {
        setLoading(true);
        setError(null);
        try {
          const axiosInstance = getAuthAxios();
          // Ensure the endpoint matches the backend controller
          const response = await axiosInstance.get(`/api/medical-events/student/${childId}`);
          setMedicalEvents(response.data);
        } catch (err) {
          console.error("Failed to fetch medical events:", err);
          setError(err.response?.data?.message || "Failed to load medical history. Please ensure you have permission to view this child\'s records.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMedicalEvents();
  }, [childId, currentUser, getAuthAxios]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link to="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Dashboard
        </Link>
        <Link to="/parent/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
          Parent Dashboard
        </Link>
        <Typography color="text.primary">
          <EventNoteIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Medical History for {studentName}
        </Typography>
      </Breadcrumbs>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <EventNoteIcon sx={{ mr: 1, fontSize: '2.5rem' }} />
          Medical Event History for {studentName}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!error && medicalEvents.length === 0 && (
          <Alert severity="info">No medical events found for {studentName}.</Alert>
        )}

        {!error && medicalEvents.length > 0 && (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="medical events table">
              <TableHead sx={{ backgroundColor: 'primary.main' }}>
                <TableRow>
                  <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Event Type</TableCell>
                  <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Description</TableCell>
                  <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Location</TableCell>
                  <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Staff Involved</TableCell>
                  <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Medications Administered</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {medicalEvents.map((event) => (
                  <TableRow
                    key={event.eventId}
                    sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}
                  >
                    <TableCell component="th" scope="row">
                      {new Date(event.eventDate).toLocaleDateString()} {new Date(event.eventDate).toLocaleTimeString()}
                    </TableCell>
                    <TableCell>{event.eventType}</TableCell>
                    <TableCell>{event.description}</TableCell>
                    <TableCell>{event.location}</TableCell>
                    <TableCell>{event.staffInvolved?.map(s => s.fullName).join(', ') || 'N/A'}</TableCell>
                    <TableCell>
                      {event.medicationsAdministered?.length > 0
                        ? event.medicationsAdministered.map(med => `${med.medicationName} (${med.dosage})`).join(', ')
                        : 'None'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-start' }}>
          <Button component={Link} to="/parent/dashboard" variant="outlined">
            Back to Parent Dashboard
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ChildMedicalHistory;
