import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Typography, List, ListItem, ListItemText, Paper, CircularProgress, Alert, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ViewMedicationRequestsPage = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== 'PARENT') {
            navigate('/login'); // Redirect if not logged in as a parent
            return;
        }

        const fetchMedicationRequests = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/medication-requests/mine', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRequests(response.data);
            } catch (err) {
                console.error("Error fetching medication requests:", err);
                setError(err.response?.data?.error || err.message || 'Failed to fetch medication requests.');
            } finally {
                setLoading(false);
            }
        };

        fetchMedicationRequests();
    }, [user, navigate]);

    const getStatusChipColor = (status) => {
        switch (status) {
            case 'PENDING': return 'warning';
            case 'APPROVED': return 'success';
            case 'REJECTED': return 'error';
            case 'ADMINISTERED': return 'info';
            case 'CANCELLED': return 'default';
            default: return 'primary';
        }
    };
    
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        try {
            return new Date(dateString).toLocaleDateString(undefined, options);
        } catch (e) {
            return dateString; // fallback to original string if date is invalid
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <Paper sx={{ padding: 3, margin: 2 }}>
            <Typography variant="h4" gutterBottom>
                My Medication Requests
            </Typography>
            {requests.length === 0 ? (
                <Typography>You have not submitted any medication requests yet.</Typography>
            ) : (
                <List>
                    {requests.map((request) => (
                        <ListItem key={request.requestId} divider sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'flex-start',
                            border: '1px solid #eee',
                            borderRadius: '4px',
                            mb: 2,
                            p: 2
                        }}>
                            <ListItemText 
                                primaryTypographyProps={{variant: 'h6'}}
                                primary={`Request ID: ${request.requestId} - ${request.medicationName} for ${request.studentName || request.studentCode}`}
                                secondary={
                                    <>
                                        <Typography component="span" variant="body2" color="text.primary">
                                            Dosage: {request.dosage}<br />
                                            Reason: {request.reason}<br />
                                            Start Date: {formatDate(request.startDate)} - End Date: {formatDate(request.endDate)}<br />
                                            Submitted: {formatDate(request.requestDate)}
                                            {request.updatedAt && request.updatedAt !== request.requestDate && (
                                                <> | Last Updated: {formatDate(request.updatedAt)}</>
                                            )}
                                        </Typography>
                                        {request.nurseNotes && <><br/>Nurse Notes: {request.nurseNotes}</>}
                                        {request.rejectionReason && <><br/>Rejection Reason: {request.rejectionReason}</>}
                                    </>
                                }
                            />
                             <Chip 
                                label={request.status || 'UNKNOWN'} 
                                color={getStatusChipColor(request.status)} 
                                size="small" 
                                sx={{ mt: 1 }}
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </Paper>
    );
};

export default ViewMedicationRequestsPage;
