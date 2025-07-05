import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, CircularProgress, Alert, Paper, Grid } from '@mui/material';
import StudentHealthCheckupEventItem from '../../components/healthcheckup/StudentHealthCheckupEventItem';
import { getStudentHealthCheckupsByStudentId } from '../../utils/api'; 
import { useAuth } from '../../context/AuthContext'; // To get student ID

const StudentHealthCheckupHistory = () => {
    const { user } = useAuth(); // Assuming user object has userId when role is STUDENT
    const [studentCheckups, setStudentCheckups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStudentCheckupData = useCallback(async () => {
        if (!user || user.role !== 'STUDENT') {
            setError('This page is for students only.');
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            // Fetch all checkups for the logged-in student
            const checkupsData = await getStudentHealthCheckupsByStudentId(user.userId);
            // Sort by event start date, most recent first
            const sortedCheckups = (checkupsData || []).sort((a, b) => 
                new Date(b.healthEvent.startDate) - new Date(a.healthEvent.startDate)
            );
            setStudentCheckups(sortedCheckups);
            setError(null);
        } catch (err) {
            setError(err.message || 'Failed to fetch your health checkup history.');
            setStudentCheckups([]);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchStudentCheckupData();
    }, [fetchStudentCheckupData]);

    if (loading) {
        return <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh"><CircularProgress /></Box>;
    }

    if (error) {
        return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>;
    }

    if (!user || user.role !== 'STUDENT') {
        return <Typography sx={{p:2}}>This page is for students only.</Typography>;
    }

    return (
        <Paper sx={{ p: { xs: 1, sm: 2, md: 3 }, m: { xs: 1, sm: 2 } }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>Your Health Checkup History</Typography>
            
            {studentCheckups.length === 0 ? (
                <Typography>You have no health checkup records at this time.</Typography>
            ) : (
                <Grid container spacing={2}>
                    {studentCheckups.map(checkup => (
                        <Grid item xs={12} key={checkup.checkupId}>
                            <StudentHealthCheckupEventItem studentCheckup={checkup} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Paper>
    );
};

export default StudentHealthCheckupHistory;
