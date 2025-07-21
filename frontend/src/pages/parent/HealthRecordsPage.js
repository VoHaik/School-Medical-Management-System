import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { 
    Typography, 
    List, 
    ListItem, 
    ListItemText, 
    Paper, 
    CircularProgress, 
    Alert, 
    Chip, 
    Container,
    Button,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Divider,
    Card,
    CardContent,
    Grid
} from '@mui/material';
import { 
    ArrowBack as ArrowBackIcon, 
    Visibility as VisibilityIcon,
    AssignmentLate as PendingIcon,
    CheckCircle as ApprovedIcon,
    Cancel as RejectedIcon,
    CalendarToday as DateIcon,
    Person as PersonIcon,
    HealthAndSafety as HealthIcon
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';

// Helper function to format dates
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Helper function to render status chip with tooltips
const StatusChip = ({ status }) => {
  let color = 'default';
  let icon = <PendingIcon />;
  let label = status || 'Pending';
  let tooltip = '';
  
  switch ((status || 'pending').toLowerCase()) {
    case 'approved':
      color = 'success';
      icon = <ApprovedIcon />;
      tooltip = 'This declaration has been reviewed and approved by medical staff';
      break;
    case 'rejected':
      color = 'error';
      icon = <RejectedIcon />;
      tooltip = 'This declaration has been reviewed and requires changes';
      break;
    case 'pending':
    default:
      color = 'warning';
      icon = <PendingIcon />;
      label = 'Pending';
      tooltip = 'This declaration is waiting for review by medical staff';
      break;
  }
  
  return (
    <Chip 
      icon={icon} 
      label={label} 
      color={color} 
      size="small" 
      variant="outlined"
      title={tooltip}
      sx={{ 
        fontWeight: 'medium',
        '&:hover': {
          opacity: 0.9,
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
        }
      }}
    />
  );
};

const HealthRecordsPage = () => {
    const [healthDeclarations, setHealthDeclarations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [children, setChildren] = useState([]);
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    // Fetch children list
    useEffect(() => {
        const fetchChildren = async () => {
            if (currentUser?.username) {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get('/api/parent/students', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setChildren(response.data || []);
                    
                    // If there's only one child, select it automatically
                    if (response.data?.length === 1) {
                        setSelectedStudent(response.data[0].studentCode);
                    }
                } catch (err) {
                    console.error('Error fetching children:', err);
                    setError('Failed to fetch children. Please try again later.');
                }
            }
        };
        
        fetchChildren();
    }, [currentUser]);

    // Fetch health declarations when a student is selected
    useEffect(() => {
        const fetchHealthDeclarations = async () => {
            if (selectedStudent) {
                setLoading(true);
                setError(null);                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`/api/health-declaration/history?studentCode=${selectedStudent}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setHealthDeclarations(response.data || []);
                } catch (err) {
                    console.error('Error fetching health declarations:', err);
                    setError('Failed to fetch health records. Please try again later.');
                } finally {
                    setLoading(false);
                }
            } else {
                // No student selected, clear the health declarations
                setHealthDeclarations([]);
                setLoading(false);
            }
        };
        
        fetchHealthDeclarations();
    }, [selectedStudent]);

    // Handle student selection change
    const handleStudentChange = (event) => {
        setSelectedStudent(event.target.value);
    };

    // Navigate back to parent dashboard
    const handleBack = () => {
        navigate('/parent/dashboard');
    };

    // Render health declaration details
    const renderDeclarationDetails = (declaration) => {
        return (
            <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" component="div">
                            Health Declaration
                        </Typography>
                        <StatusChip status={declaration.status || 'Pending'} />
                    </Box>
                    
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                                <DateIcon sx={{ mr: 1, fontSize: 'small', color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                    Submitted: {formatDate(declaration.createdAt || declaration.submissionDate)}
                                </Typography>
                            </Box>
                            
                            {declaration.reviewedAt && (
                                <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                                    <DateIcon sx={{ mr: 1, fontSize: 'small', color: 'text.secondary' }} />
                                    <Typography variant="body2" color="text.secondary">
                                        Reviewed: {formatDate(declaration.reviewedAt)}
                                    </Typography>
                                </Box>
                            )}
                        </Grid>
                        
                        <Grid item xs={12}>
                            <Divider sx={{ my: 1 }} />
                            
                            {/* Summary of key health information */}
                            {declaration.allergies && declaration.allergies.length > 0 && (
                                <Box sx={{ my: 1 }}>
                                    <Typography variant="subtitle2">Allergies:</Typography>
                                    <Typography variant="body2">
                                        {declaration.allergies.filter(a => a && a.trim()).join(', ') || 'None'}
                                    </Typography>
                                </Box>
                            )}
                            
                            {declaration.chronicIllnesses && declaration.chronicIllnesses.length > 0 && (
                                <Box sx={{ my: 1 }}>
                                    <Typography variant="subtitle2">Chronic Illnesses:</Typography>
                                    <Typography variant="body2">
                                        {declaration.chronicIllnesses.filter(ci => ci && ci.trim()).join(', ') || 'None'}
                                    </Typography>
                                </Box>
                            )}
                            
                            {declaration.dietaryRestrictions && (
                                <Box sx={{ my: 1 }}>
                                    <Typography variant="subtitle2">Dietary Restrictions:</Typography>
                                    <Typography variant="body2">{declaration.dietaryRestrictions}</Typography>
                                </Box>
                            )}
                              {/* View Full Details Button with link to the detail page */}
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<VisibilityIcon />}
                                    component={Link}
                                    to={`/parent/health-declaration-detail/${declaration.declarationId}`}
                                >
                                    View Full Details
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        );
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Button 
                    startIcon={<ArrowBackIcon />} 
                    onClick={handleBack}
                    sx={{ mr: 2 }}
                >
                    Back
                </Button>
                <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
                    Health Declaration Records
                </Typography>
                <Button 
                    color="primary" 
                    component={Link} 
                    to="/parent/student-health-profile"
                    startIcon={<HealthIcon />}
                >
                    View Health Profile
                </Button>
            </Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="body1">
                    This page shows the history of all health declarations submitted for your child. To view a comprehensive health profile based on the latest approved declarations, use the "View Health Profile" button above.
                </Typography>
            </Box>
            
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="body1" paragraph>
                        View and manage your child's health declaration records. Select a child to see their health records.
                    </Typography>
                    
                    {/* Status explanation section */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, mt: 1 }}>
                        <Typography variant="body2" fontWeight="medium">Declaration Status:</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                            <Chip 
                                icon={<PendingIcon />} 
                                label="Pending" 
                                color="warning" 
                                size="small" 
                                variant="outlined"
                                sx={{ mr: 1 }}
                            />
                            <Typography variant="body2">Waiting for review</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                            <Chip 
                                icon={<ApprovedIcon />} 
                                label="Approved" 
                                color="success" 
                                size="small" 
                                variant="outlined"
                                sx={{ mr: 1 }}
                            />
                            <Typography variant="body2">Reviewed and approved</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Chip 
                                icon={<RejectedIcon />} 
                                label="Rejected" 
                                color="error" 
                                size="small" 
                                variant="outlined"
                                sx={{ mr: 1 }}
                            />
                            <Typography variant="body2">Changes required</Typography>
                        </Box>
                    </Box>
                    
                    <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                        <InputLabel>Select Child</InputLabel>
                        <Select
                            value={selectedStudent}
                            onChange={handleStudentChange}
                            label="Select Child"
                        >
                            <MenuItem value="">
                                <em>-- Select a child --</em>
                            </MenuItem>
                            {children.map((child) => (
                                <MenuItem key={child.studentCode} value={child.studentCode}>
                                    {child.fullName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                
                {!selectedStudent && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                        Please select a child to view their health records.
                    </Alert>
                )}
                
                {selectedStudent && loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress />
                    </Box>
                )}
                
                {selectedStudent && error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}
                
                {selectedStudent && !loading && !error && (
                    <>
                        {healthDeclarations.length > 0 ? (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Health Declarations
                                </Typography>
                                {healthDeclarations.map((declaration) => (
                                    <Box key={declaration.declarationId} sx={{ mb: 3 }}>
                                        {renderDeclarationDetails(declaration)}
                                    </Box>
                                ))}
                            </Box>
                        ) : (
                            <Alert severity="info" sx={{ mt: 2 }}>
                                No health declaration records found for this child.
                            </Alert>
                        )}
                        
                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                component={Link}
                                to="/parent/health-declaration"
                                startIcon={<HealthIcon />}
                            >
                                Create New Health Declaration
                            </Button>
                        </Box>
                    </>
                )}
            </Paper>
        </Container>
    );
};

export default HealthRecordsPage;
