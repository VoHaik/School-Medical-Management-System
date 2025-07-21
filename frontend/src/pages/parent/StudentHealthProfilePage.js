import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { 
    Typography, 
    Paper, 
    CircularProgress, 
    Alert, 
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
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Chip
} from '@mui/material';
import { 
    ArrowBack as ArrowBackIcon,
    Vaccines as VaccinesIcon, 
    MedicalServices as MedicalIcon,
    Visibility as VisibilityIcon,
    CalendarToday as DateIcon,
    WarningAmber as AllergiesIcon,
    HealthAndSafety as HealthIcon,
    AccessibilityNew as PhysicalIcon,
    Psychology as MentalIcon,
    Restaurant as DietaryIcon,
    MedicationLiquid as MedicationIcon
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return 'Not provided';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const StudentHealthProfilePage = () => {
    const [healthProfile, setHealthProfile] = useState(null);
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

    // Fetch student health profile when a student is selected
    useEffect(() => {
        const fetchHealthProfile = async () => {
            if (selectedStudent) {
                setLoading(true);
                setError(null);
                try {
                    const token = localStorage.getItem('token');
                    
                    // First, try to get the latest approved health declaration
                    const declarationsResponse = await axios.get(`/api/health-declaration/history?studentCode=${selectedStudent}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    
                    const declarations = declarationsResponse.data || [];
                      // Find the latest approved declaration if any (handling different status formats)
                    const latestApprovedDeclaration = declarations.find(
                        d => d.status && ['approved', 'APPROVED', 'Approved'].includes(d.status)
                    ) || declarations[0]; // Fallback to the first declaration if none is approved
                      if (latestApprovedDeclaration) {                        // Get student details from the children array instead of making a separate API call
                        const selectedChild = children.find(child => child.studentCode === selectedStudent);
                        const studentDetails = {
                            fullName: selectedChild?.fullName || 'Student',
                            studentCode: selectedStudent,
                            ...selectedChild // Include other properties if available
                        };
                        
                        // Combine data to create a complete health profile
                        setHealthProfile({
                            studentDetails: studentDetails,
                            healthData: latestApprovedDeclaration,
                            latestDeclarationDate: latestApprovedDeclaration.declarationDate || new Date().toISOString(),
                            declarations: declarations
                        });
                    } else {
                        setHealthProfile(null);
                    }
                } catch (err) {
                    console.error('Error fetching health profile:', err);
                    setError('Failed to fetch health record. Please try again later.');
                } finally {
                    setLoading(false);
                }
            } else {
                setHealthProfile(null);
                setLoading(false);
            }
        };
        
        fetchHealthProfile();
    }, [selectedStudent]);

    // Handle student selection change
    const handleStudentChange = (event) => {
        setSelectedStudent(event.target.value);
    };

    // Navigate back to parent dashboard
    const handleBack = () => {
        navigate('/parent/dashboard');
    };

    // Helper to render list items for health data
    const renderListItem = (icon, primary, secondary = null) => (
        <ListItem>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText 
                primary={primary} 
                secondary={secondary} 
            />
        </ListItem>
    );

    // Helper to render info section
    const renderInfoSection = (title, content, icon) => (
        <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {icon}
                    <Typography variant="h6" component="div" sx={{ ml: 1 }}>
                        {title}
                    </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                {content}
            </CardContent>
        </Card>
    );

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
                    Student Health Profile
                </Typography>
            </Box>
            
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="body1" paragraph>
                        View your child's comprehensive health profile. This information is compiled from the latest approved health declaration.
                    </Typography>
                    
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
                        Please select a child to view their health profile.
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
                        {healthProfile ? (
                            <Box>
                                {/* Student Info and Last Update */}
                                <Card sx={{ mb: 3 }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                                            <Box>
                                                <Typography variant="h5" component="div">
                                                    {healthProfile.studentDetails?.fullName || 'Student'}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Student Code: {selectedStudent}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ textAlign: 'right' }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Last Updated: {formatDate(healthProfile.latestDeclarationDate)}
                                                </Typography>                                                <Button 
                                                    variant="text" 
                                                    size="small" 
                                                    onClick={() => navigate('/parent/health-declaration', { state: { studentCode: selectedStudent } })}
                                                    startIcon={<HealthIcon />}
                                                    sx={{ mt: 1 }}
                                                >
                                                    Update Health Information
                                                </Button>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                                
                                {/* Health Profile Sections */}
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        {/* Allergies */}
                                        {renderInfoSection(
                                            'Allergies',
                                            healthProfile.healthData.allergies && healthProfile.healthData.allergies.length > 0 ? (
                                                <List dense>
                                                    {healthProfile.healthData.allergies
                                                        .filter(item => item && item.trim())
                                                        .map((allergy, index) => (
                                                            <ListItem key={index}>
                                                                <ListItemIcon>
                                                                    <AllergiesIcon color="error" />
                                                                </ListItemIcon>
                                                                <ListItemText primary={allergy} />
                                                            </ListItem>
                                                        ))
                                                    }
                                                </List>
                                            ) : (
                                                <Typography variant="body2">No allergies recorded</Typography>
                                            ),
                                            <AllergiesIcon color="warning" />
                                        )}
                                        
                                        {/* Chronic Illnesses */}
                                        {renderInfoSection(
                                            'Chronic Illnesses',
                                            healthProfile.healthData.chronicIllnesses && healthProfile.healthData.chronicIllnesses.length > 0 ? (
                                                <List dense>
                                                    {healthProfile.healthData.chronicIllnesses
                                                        .filter(item => item && item.trim())
                                                        .map((illness, index) => (
                                                            <ListItem key={index}>
                                                                <ListItemIcon>
                                                                    <MedicalIcon color="primary" />
                                                                </ListItemIcon>
                                                                <ListItemText primary={illness} />
                                                            </ListItem>
                                                        ))
                                                    }
                                                </List>
                                            ) : (
                                                <Typography variant="body2">No chronic illnesses recorded</Typography>
                                            ),
                                            <MedicalIcon color="primary" />
                                        )}
                                    </Grid>
                                    
                                    <Grid item xs={12} md={6}>
                                        {/* Vaccinations */}
                                        {renderInfoSection(
                                            'Vaccinations',
                                            healthProfile.healthData.vaccinations && healthProfile.healthData.vaccinations.length > 0 ? (
                                                <List dense>
                                                    {healthProfile.healthData.vaccinations.map((vaccine, index) => (
                                                        <ListItem key={index}>
                                                            <ListItemIcon>
                                                                <VaccinesIcon color="success" />
                                                            </ListItemIcon>
                                                            <ListItemText 
                                                                primary={vaccine.vaccineName} 
                                                                secondary={`Date: ${formatDate(vaccine.vaccinationDate)}${vaccine.notes ? ` - ${vaccine.notes}` : ''}`}
                                                            />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            ) : (
                                                <Typography variant="body2">No vaccination records</Typography>
                                            ),
                                            <VaccinesIcon color="success" />
                                        )}
                                    </Grid>
                                    
                                    {/* Medical History */}
                                    <Grid item xs={12}>
                                        {renderInfoSection(
                                            'Medical History',
                                            healthProfile.healthData.medicalHistory ? (
                                                <Typography variant="body1">
                                                    {healthProfile.healthData.medicalHistory}
                                                </Typography>
                                            ) : (
                                                <Typography variant="body2">No medical history provided</Typography>
                                            ),
                                            <MedicalIcon color="primary" />
                                        )}
                                    </Grid>
                                    
                                    {/* Health Status */}
                                    <Grid item xs={12} md={6}>
                                        {renderInfoSection(
                                            'Health Status',
                                            <List dense>
                                                {healthProfile.healthData.visionStatus && renderListItem(
                                                    <VisibilityIcon />,
                                                    'Vision Status',
                                                    healthProfile.healthData.visionStatus
                                                )}
                                                
                                                {healthProfile.healthData.hearingStatus && renderListItem(
                                                    <HealthIcon />,
                                                    'Hearing Status',
                                                    healthProfile.healthData.hearingStatus
                                                )}
                                                
                                                {healthProfile.healthData.specialNeeds && renderListItem(
                                                    <HealthIcon />,
                                                    'Special Needs',
                                                    healthProfile.healthData.specialNeeds
                                                )}
                                                
                                                {healthProfile.healthData.physicalLimitations && renderListItem(
                                                    <PhysicalIcon />,
                                                    'Physical Limitations',
                                                    healthProfile.healthData.physicalLimitations
                                                )}
                                                
                                                {healthProfile.healthData.mentalHealthConcerns && renderListItem(
                                                    <MentalIcon />,
                                                    'Mental Health Concerns',
                                                    healthProfile.healthData.mentalHealthConcerns
                                                )}
                                                
                                                {healthProfile.healthData.dietaryRestrictions && renderListItem(
                                                    <DietaryIcon />,
                                                    'Dietary Restrictions',
                                                    healthProfile.healthData.dietaryRestrictions
                                                )}
                                            </List>,
                                            <HealthIcon color="primary" />
                                        )}
                                    </Grid>
                                    
                                    {/* Emergency Contacts */}
                                    <Grid item xs={12} md={6}>
                                        {renderInfoSection(
                                            'Emergency Contacts',
                                            healthProfile.healthData.emergencyContacts && healthProfile.healthData.emergencyContacts.length > 0 ? (
                                                <List dense>
                                                    {healthProfile.healthData.emergencyContacts.map((contact, index) => (
                                                        <ListItem key={index}>
                                                            <ListItemText 
                                                                primary={contact.name}
                                                                secondary={
                                                                    <>
                                                                        {contact.relationship && <span>Relationship: {contact.relationship}<br /></span>}
                                                                        {contact.phone && <span>Phone: {contact.phone}<br /></span>}
                                                                        {contact.isEmergency && <Chip label="Emergency Contact" size="small" color="error" sx={{ mt: 0.5 }} />}
                                                                    </>
                                                                }
                                                            />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            ) : (
                                                <Typography variant="body2">No emergency contacts provided</Typography>
                                            ),
                                            <MedicalIcon color="error" />
                                        )}
                                    </Grid>
                                </Grid>
                                
                                {/* Health Declarations History */}
                                <Box sx={{ mt: 4 }}>
                                    <Button
                                        variant="outlined"
                                        component={Link}
                                        to="/parent/health-records"
                                        startIcon={<DateIcon />}
                                    >
                                        View Health Declaration History
                                    </Button>
                                </Box>
                            </Box>
                        ) : (
                            <Alert severity="info" sx={{ mt: 2 }}>
                                No health profile available for this student. Please submit a health declaration to establish a health profile.
                                <Box sx={{ mt: 2 }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        component={Link}
                                        to={`/parent/health-declaration?studentCode=${selectedStudent}`}
                                        startIcon={<MedicalIcon />}
                                    >
                                        Create Health Declaration
                                    </Button>
                                </Box>
                            </Alert>
                        )}
                    </>
                )}
            </Paper>
        </Container>
    );
};

export default StudentHealthProfilePage;
