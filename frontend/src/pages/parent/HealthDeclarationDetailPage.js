import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { 
    Typography, 
    Paper, 
    Container, 
    Box, 
    Button, 
    Grid, 
    Divider,
    List,
    ListItem,
    ListItemText,
    Chip,
    Card,
    CardContent,
    CircularProgress,
    Alert
} from '@mui/material';
import { 
    ArrowBack as ArrowBackIcon,
    Event as EventIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Schedule as PendingIcon,
    CalendarToday as DateIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

// Helper function to format dates nicely
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

// Custom component to display status badge with explanation
const StatusBadge = ({ status, reviewedBy, reviewedAt }) => {
    let color = 'default';
    let icon = <PendingIcon />;
    let label = status || 'Pending';
    let explanation = '';
    
    switch ((label || '').toLowerCase()) {
        case 'approved':
            color = 'success';
            icon = <CheckCircleIcon />;
            explanation = reviewedBy ? 
                `Approved by ${reviewedBy} on ${formatDate(reviewedAt)}` : 
                'Your declaration has been approved by the medical staff';
            break;
        case 'rejected':
            color = 'error';
            icon = <CancelIcon />;
            explanation = reviewedBy ? 
                `Rejected by ${reviewedBy} on ${formatDate(reviewedAt)}` : 
                'Changes are required for your declaration';
            break;
        case 'pending':
        default:
            color = 'warning';
            icon = <PendingIcon />;
            label = 'Pending';
            explanation = 'Your declaration is waiting for review by the medical staff';
            break;
    }
    
    return (
        <Box>
            <Chip 
                icon={icon}
                label={label}
                color={color}
                variant="outlined"
                sx={{ 
                    fontWeight: 'medium',
                    mb: 1
                }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                {explanation}
            </Typography>
        </Box>
    );
};

// Component to display info sections with title and content
const InfoSection = ({ title, children, elevation = 1, sx = {} }) => (
    <Paper elevation={elevation} sx={{ p: 3, mb: 3, ...sx }}>
        <Typography variant="h6" gutterBottom color="primary">
            {title}
        </Typography>
        <Box mt={1}>
            {children}
        </Box>
    </Paper>
);

// Component to display array items like allergies, chronic illnesses
const ItemList = ({ items, emptyMessage = "None reported" }) => {
    const filteredItems = Array.isArray(items) 
        ? items.filter(item => item && typeof item === 'string' && item.trim() !== '') 
        : [];
    
    if (!filteredItems.length) {
        return <Typography variant="body2" color="text.secondary">{emptyMessage}</Typography>;
    }
    
    return (
        <List dense disablePadding>
            {filteredItems.map((item, index) => (
                <ListItem key={index} disablePadding sx={{ py: 0.5 }}>
                    <ListItemText primary={item} />
                </ListItem>
            ))}
        </List>
    );
};

const HealthDeclarationDetailPage = () => {
    const { declarationId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);
    const [declaration, setDeclaration] = useState(null);
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch declaration data
    useEffect(() => {
        const fetchDeclarationDetails = async () => {
            // Check if declarationId is valid
            if (!declarationId || declarationId === 'undefined' || !currentUser) {
                setError('Invalid declaration ID provided');
                setLoading(false);
                return;
            }
            
            setLoading(true);
            setError(null);
            
            try {
                const token = localStorage.getItem('token');
                // Fetch declaration details
                const response = await axios.get(`/api/health-declaration/${declarationId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                setDeclaration(response.data);
                
                // Also fetch student details if we have a student code
                if (response.data?.studentCode) {
                    try {
                        const studentResponse = await axios.get(`/api/students/${response.data.studentCode}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        setStudent(studentResponse.data);
                    } catch (studentErr) {
                        console.error('Error fetching student details:', studentErr);
                        // We don't set the main error here as the declaration data was still retrieved
                    }
                }
            } catch (err) {
                console.error('Error fetching declaration details:', err);
                setError('Could not load health declaration details. ' + 
                    (err.response?.data?.message || err.message || 'Please try again later.'));
            } finally {
                setLoading(false);
            }
        };
        
        fetchDeclarationDetails();
    }, [declarationId, currentUser]);

    // Handle back navigation
    const handleBack = () => {
        navigate('/parent/health-records');
    };

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ py: 8 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', py: 8 }}>
                    <CircularProgress />
                    <Typography variant="h6" sx={{ mt: 2 }}>Loading health declaration...</Typography>
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ py: 8 }}>
                <Button 
                    startIcon={<ArrowBackIcon />} 
                    onClick={handleBack}
                    variant="outlined"
                    sx={{ mb: 3 }}
                >
                    Back to Health Records
                </Button>
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            </Container>
        );
    }

    if (!declaration) {
        return (
            <Container maxWidth="md" sx={{ py: 8 }}>
                <Button 
                    startIcon={<ArrowBackIcon />} 
                    onClick={handleBack}
                    variant="outlined"
                    sx={{ mb: 3 }}
                >
                    Back to Health Records
                </Button>
                <Alert severity="warning">
                    Health declaration not found or you may not have permission to view it.
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>            {/* Header with back button and title */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Button 
                    startIcon={<ArrowBackIcon />} 
                    onClick={handleBack}
                    sx={{ mr: 2 }}
                >
                    Back
                </Button>
                <Typography variant="h4" component="h1">
                    Health Declaration Details
                </Typography>
            </Box>
            
            {/* Status Alert */}
            {declaration.status && (
                <Alert 
                    severity={
                        declaration.status.toLowerCase() === 'approved' ? 'success' :
                        declaration.status.toLowerCase() === 'rejected' ? 'error' : 'info'
                    }
                    sx={{ mb: 4 }}
                    variant="filled"
                >
                    {declaration.status.toLowerCase() === 'approved' && "This health declaration has been reviewed and approved by medical staff."}
                    {declaration.status.toLowerCase() === 'rejected' && "This health declaration requires changes. Please review the feedback and submit a new declaration."}
                    {declaration.status.toLowerCase() === 'pending' && "This health declaration is pending review by medical staff."}
                </Alert>
            )}

            {/* Main content */}
            <Paper elevation={3} sx={{ mb: 4, overflow: 'hidden' }}>
                {/* Header with declaration status and date */}
                <Box sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12} sm={8}>
                            <Typography variant="h5">
                                {student?.fullName || 'Student'}'s Health Declaration
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <DateIcon sx={{ mr: 1, fontSize: 'small' }} />
                                <Typography variant="body2">
                                    Submitted on {formatDate(declaration.createdAt || declaration.submissionDate)}
                                </Typography>
                            </Box>
                        </Grid>                        <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: {xs: 'flex-start', sm: 'flex-end'} }}>
                            <StatusBadge 
                                status={declaration.status || 'Pending'} 
                                reviewedBy={declaration.reviewedBy} 
                                reviewedAt={declaration.reviewedAt}
                            />
                        </Grid>
                    </Grid>
                </Box>
                
                {/* Student information */}
                <Box p={3}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <InfoSection title="Student Information" elevation={0} sx={{ bgcolor: 'background.paper' }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                                        <Typography variant="body1">{student?.fullName || 'N/A'}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="text.secondary">Student Code</Typography>
                                        <Typography variant="body1">{declaration.studentCode || 'N/A'}</Typography>
                                    </Grid>
                                    {student?.dateOfBirth && (
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle2" color="text.secondary">Date of Birth</Typography>
                                            <Typography variant="body1">{formatDate(student.dateOfBirth)}</Typography>
                                        </Grid>
                                    )}
                                    {student?.classCode && (
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle2" color="text.secondary">Class</Typography>
                                            <Typography variant="body1">{student.classCode}</Typography>
                                        </Grid>
                                    )}
                                </Grid>
                            </InfoSection>
                        </Grid>

                        {/* Medical Information Sections */}
                        <Grid item xs={12} sm={6}>
                            <InfoSection title="Allergies" elevation={0} sx={{ bgcolor: 'background.paper' }}>
                                <ItemList items={declaration.allergies} />
                            </InfoSection>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <InfoSection title="Chronic Illnesses" elevation={0} sx={{ bgcolor: 'background.paper' }}>
                                <ItemList items={declaration.chronicIllnesses} />
                            </InfoSection>
                        </Grid>

                        <Grid item xs={12}>
                            <InfoSection title="Medical History" elevation={0} sx={{ bgcolor: 'background.paper' }}>
                                {declaration.medicalHistory ? (
                                    <Typography variant="body1">{declaration.medicalHistory}</Typography>
                                ) : (
                                    <Typography variant="body2" color="text.secondary">No medical history reported</Typography>
                                )}
                            </InfoSection>
                        </Grid>

                        <Grid item xs={12}>
                            <InfoSection title="Emergency Contacts" elevation={0} sx={{ bgcolor: 'background.paper' }}>
                                {declaration.emergencyContacts && declaration.emergencyContacts.length > 0 ? (
                                    <Grid container spacing={2}>
                                        {declaration.emergencyContacts.map((contact, index) => (
                                            <Grid item xs={12} sm={6} key={index}>
                                                <Card variant="outlined" sx={{ height: '100%' }}>
                                                    <CardContent>
                                                        <Typography variant="subtitle1" color="primary">
                                                            {contact.name}
                                                            {contact.isEmergency && (
                                                                <Chip 
                                                                    label="Primary" 
                                                                    size="small" 
                                                                    color="error" 
                                                                    sx={{ ml: 1 }} 
                                                                />
                                                            )}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {contact.relationship}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                                            {contact.phone}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                ) : (
                                    <Typography variant="body2" color="text.secondary">No emergency contacts provided</Typography>
                                )}
                            </InfoSection>
                        </Grid>

                        <Grid item xs={12}>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="h6" gutterBottom>Additional Health Information</Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <InfoSection title="Vision Status" elevation={0} sx={{ bgcolor: 'background.paper' }}>
                                <Typography variant="body1">
                                    {declaration.visionStatus || 'Not specified'}
                                </Typography>
                            </InfoSection>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <InfoSection title="Hearing Status" elevation={0} sx={{ bgcolor: 'background.paper' }}>
                                <Typography variant="body1">
                                    {declaration.hearingStatus || 'Not specified'}
                                </Typography>
                            </InfoSection>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <InfoSection title="Special Needs" elevation={0} sx={{ bgcolor: 'background.paper' }}>
                                <Typography variant="body1">
                                    {declaration.specialNeeds || 'None reported'}
                                </Typography>
                            </InfoSection>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <InfoSection title="Physical Limitations" elevation={0} sx={{ bgcolor: 'background.paper' }}>
                                <Typography variant="body1">
                                    {declaration.physicalLimitations || 'None reported'}
                                </Typography>
                            </InfoSection>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <InfoSection title="Mental Health Concerns" elevation={0} sx={{ bgcolor: 'background.paper' }}>
                                <Typography variant="body1">
                                    {declaration.mentalHealthConcerns || 'None reported'}
                                </Typography>
                            </InfoSection>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <InfoSection title="Dietary Restrictions" elevation={0} sx={{ bgcolor: 'background.paper' }}>
                                <Typography variant="body1">
                                    {declaration.dietaryRestrictions || 'None reported'}
                                </Typography>
                            </InfoSection>
                        </Grid>

                        {/* Vaccinations section */}
                        {declaration.vaccinations && declaration.vaccinations.length > 0 && (
                            <Grid item xs={12}>
                                <InfoSection title="Vaccinations" elevation={0} sx={{ bgcolor: 'background.paper' }}>
                                    <Grid container spacing={2}>
                                        {declaration.vaccinations.map((vaccination, index) => (
                                            <Grid item xs={12} sm={6} md={4} key={index}>
                                                <Card variant="outlined" sx={{ height: '100%' }}>
                                                    <CardContent>
                                                        <Typography variant="subtitle1" color="primary">
                                                            {vaccination.vaccineName}
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                            <EventIcon sx={{ fontSize: 'small', mr: 1, color: 'text.secondary' }} />
                                                            <Typography variant="body2">
                                                                {formatDate(vaccination.vaccinationDate)}
                                                            </Typography>
                                                        </Box>
                                                        {vaccination.notes && (
                                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                                {vaccination.notes}
                                                            </Typography>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </InfoSection>
                            </Grid>
                        )}                        {/* Review information if available */}
                        {declaration.reviewedAt && (
                            <Grid item xs={12}>
                                <Divider sx={{ my: 2 }} />
                                <InfoSection 
                                    title={`Review Information${declaration.status?.toLowerCase() === 'rejected' ? ' - Action Required' : ''}`} 
                                    elevation={0} 
                                    sx={{ 
                                        bgcolor: declaration.status?.toLowerCase() === 'rejected' ? 'error.light' : 'background.paper',
                                        borderLeft: declaration.status?.toLowerCase() === 'rejected' ? '4px solid #f44336' : 'none',
                                    }}
                                >
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle2" color="text.secondary">Reviewed On</Typography>
                                            <Typography variant="body1">{formatDate(declaration.reviewedAt)}</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle2" color="text.secondary">Reviewed By</Typography>
                                            <Typography variant="body1">{declaration.reviewedBy || 'N/A'}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle2" color="text.secondary">Review Status</Typography>
                                            <StatusBadge 
                                                status={declaration.status} 
                                                reviewedBy={declaration.reviewedBy} 
                                                reviewedAt={declaration.reviewedAt}
                                            />
                                        </Grid>
                                        {declaration.reviewNotes && (
                                            <Grid item xs={12}>
                                                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Review Notes</Typography>
                                                <Paper 
                                                    variant="outlined" 
                                                    sx={{ 
                                                        p: 2, 
                                                        mt: 1, 
                                                        bgcolor: declaration.status?.toLowerCase() === 'rejected' ? 'rgba(244, 67, 54, 0.08)' : 'inherit',
                                                    }}
                                                >
                                                    <Typography variant="body1">{declaration.reviewNotes}</Typography>
                                                </Paper>
                                            </Grid>
                                        )}
                                        
                                        {declaration.status?.toLowerCase() === 'rejected' && (
                                            <Grid item xs={12} sx={{ mt: 2 }}>
                                                <Alert severity="info">
                                                    Please submit a new health declaration addressing the feedback provided above.
                                                </Alert>
                                            </Grid>
                                        )}
                                    </Grid>
                                </InfoSection>
                            </Grid>
                        )}
                    </Grid>
                </Box>
            </Paper>
            
            {/* Back button */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBack}
                    size="large"
                >
                    Back to Health Records
                </Button>
            </Box>
        </Container>
    );
};

export default HealthDeclarationDetailPage;
