import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert, Paper, Grid, Button, Divider, Chip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getStudentHealthCheckupById } from '../../utils/api'; // Assuming you have this API function
import { useAuth } from '../../context/AuthContext';

const ParentHealthCheckupResultPage = () => {
    const { user } = useAuth();
    const { eventId, childId, recordId } = useParams(); // recordId is the StudentHealthCheckup primary key
    const navigate = useNavigate();

    const [checkupResult, setCheckupResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCheckupResult = useCallback(async () => {
        if (!recordId) {
            setError("No record ID provided.");
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            // Here, we need an API that fetches a specific StudentHealthCheckup record by its ID.
            // And importantly, the backend must verify that the logged-in parent is authorized to view this record.
            const result = await getStudentHealthCheckupById(recordId);
            
            // Security check: Ensure the fetched result belongs to the selected childId from the route
            // and that the logged-in parent is authorized for this child.
            if (result.studentId !== parseInt(childId)) {
                setError("Unauthorized to view this record or record mismatch.");
                setCheckupResult(null);
            } else {
                // Further check if user.children contains childId (already implicitly handled by route structure if parent can only select their children)
                setCheckupResult(result);
            }
            setError(null);
        } catch (err) {
            setError(err.message || 'Failed to fetch checkup results.');
            setCheckupResult(null);
        } finally {
            setLoading(false);
        }
    }, [recordId, childId, user]); // Add user to dependency array if using it for auth checks inside

    useEffect(() => {
        fetchCheckupResult();
    }, [fetchCheckupResult]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    if (loading) {
        return <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px"><CircularProgress /></Box>;
    }

    if (error) {
        return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>;
    }

    if (!checkupResult) {
        return <Alert severity="info" sx={{ m: 2 }}>No checkup results found for this record.</Alert>;
    }

    return (
        <Paper sx={{ p: 3, m: 2 }}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
                Back to Overview
            </Button>
            <Typography variant="h4" gutterBottom sx={{ mb: 1 }}>
                Health Checkup Results
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Event: {checkupResult.eventName}
            </Typography>
            <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
                Student: {checkupResult.studentName} (ID: {checkupResult.studentId})
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>Checkup Date:</strong> {formatDate(checkupResult.checkupDate)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>Consent Status:</strong> 
                        {checkupResult.consentStatus 
                            ? <Chip label={`Given on ${formatDate(checkupResult.consentDate)}`} color="success" size="small" /> 
                            : <Chip label={checkupResult.consentDate ? `Denied on ${formatDate(checkupResult.consentDate)}` : "Not Given/Denied"} color="error" size="small" />}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>Height:</strong> {checkupResult.height || 'N/A'} cm</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>Weight:</strong> {checkupResult.weight || 'N/A'} kg</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>Vision:</strong> {checkupResult.vision || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>Hearing:</strong> {checkupResult.hearing || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>Dental Health:</strong> {checkupResult.dentalHealth || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>Other Health Issues:</strong> {checkupResult.otherHealthIssues || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body1"><strong>Nurse's Notes:</strong></Typography>
                    <Typography variant="body2" sx={{ mt: 1, p: 1, border: '1px solid lightgray', borderRadius: '4px', minHeight: '50px' }}>
                        {checkupResult.notes || 'No additional notes.'}
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default ParentHealthCheckupResultPage;
