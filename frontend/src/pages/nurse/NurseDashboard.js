import React, { useState, useEffect, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import axiosWithAuth from '../../utils/axiosWithAuth';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  ListItemIcon,
  ListItemText,
  List,
  ListItem,
  CircularProgress
} from '@mui/material';
import PageHeader from '../../components/PageHeader';
import { 
  Medication as MedicationIcon, 
  AssignmentLate as AssignmentLateIcon, 
  EventAvailable as EventAvailableIcon, 
  Assessment as AssessmentIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
  MedicalServices as MedicalServicesIcon
} from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';
import authHeader from '../../services/auth-header'; // Add this import for direct header testing

// Trạng thái ban đầu cho dữ liệu bảng điều khiển
const initialSummaryData = {
  pendingMedicationRequests: 0,
  pendingHealthDeclarations: 0,
  upcomingAppointments: 0,
  recentAlerts: 0,
};

function NurseDashboard() {
  const [summaryData, setSummaryData] = useState(initialSummaryData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getAuthAxios, currentUser } = useContext(AuthContext);

  // Function to fetch dashboard data
  const fetchDashboardData = async () => {
    // Don't fetch if no user is logged in
    if (!currentUser) {
      setError('You must be logged in to view this page');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null); // Clear previous errors
        // Check roles first - using role names from database (Admin, SchoolNurse)
      if (!currentUser.roles || !currentUser.roles.some(role => 
          role === 'SchoolNurse' || role === 'Admin')) {        setError('You do not have permission to access this page');
        setLoading(false);
        return;
      }
      
      // Get an authenticated axios instance using our consistent utility
      const authAxios = axiosWithAuth();
      
      // Debug auth token
      const token = localStorage.getItem('token');
      console.log('Token available:', token ? 'Yes' : 'No');
      console.log('Token first 10 characters:', token ? token.substring(0, 10) + '...' : 'N/A');
      
      // Check token validity
      if (!token) {
        console.error('No token available - triggering logout');
        setError('Your session may have expired. Please log in again.');
        setLoading(false);
        return;
      }
      
      // Debug auth headers
      const user = JSON.parse(localStorage.getItem('user'));
      console.log('User from localStorage:', user ? 'Found' : 'Not found');
      console.log('User roles:', user?.roles);
      
      // Make sure authAxios is configured with headers
      console.log('Auth headers present:', authAxios.defaults?.headers?.common?.Authorization ? 'Yes' : 'No');
      
      // Add a specific header for debugging
      authAxios.defaults.headers.common['X-Debug'] = 'NurseDashboard';
      
      try {
        // Use our new axiosWithAuth utility instead of getAuthAxios from context
        const authAxios = axiosWithAuth();
        
        // Add debug headers
        authAxios.defaults.headers.common['X-Debug'] = 'NurseDashboard';
        
        // Inspect request URL structure
        const apiUrl = '/api/medication-requests/pending/count';
        console.log('Full API URL:', window.location.origin + apiUrl);
        
        console.log('Headers being sent:', authAxios.defaults.headers);
        
        // Fetch pending medication requests with explicit error handling
        console.log('Fetching medication requests count...');
        
        try {
          const medicationResponse = await authAxios.get(apiUrl);
          console.log('Medication response:', medicationResponse.data);
        } catch (medError) {
          console.error('Medication request specific error:', medError.message);
          console.log('Status code:', medError.response?.status);
          console.log('Server response:', medError.response?.data);
          
          // Check for the specific "No static resource" error
          if (medError.response?.data?.message?.includes('No static resource')) {
            console.error('Backend is treating API endpoint as static resource!');
            throw new Error('API configuration error: Endpoint being treated as static resource. Please check backend config.');
          }
          
          throw new Error('Failed to fetch medication requests count');
        }
        
        // Fetch pending health declarations
        console.log('Fetching health declarations count...');
        try {
          const healthDeclarationResponse = await authAxios.get('/api/health-declaration/pending/count');
          console.log('Health declaration response:', healthDeclarationResponse.data);
        } catch (healthError) {
          console.error('Health declaration specific error:', healthError.message);
          console.log('Status code:', healthError.response?.status);
          console.log('Server response:', healthError.response?.data);
          throw new Error('Failed to fetch health declarations count');
        }
        
        // Update state with actual data
        setSummaryData({
          pendingMedicationRequests: medicationResponse.data || 0,
          pendingHealthDeclarations: healthDeclarationResponse.data || 0,
          upcomingAppointments: 0, // This will be implemented in future
          recentAlerts: 0, // This will be implemented in future
        });
        
        setError(null);
      } catch (apiError) {
        console.error('API call error:', apiError);
        
        // Check if it's an authorization error
        if (apiError.response?.status === 401 || apiError.response?.status === 403) {
          console.log('Auth error. Headers:', apiError.config?.headers);
          setError(`Authentication error (${apiError.response.status}): ${apiError.response.data?.message || 'Access denied'}`);
        } else {
          setError(`API Error (${apiError.response?.status || 'unknown'}): ${apiError.message}`);
        }
      }
    } catch (err) {
      console.error('General error in fetchDashboardData:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Call fetchDashboardData when component mounts
  useEffect(() => {
    // Don't fetch if no user is logged in
    if (currentUser) {
      console.log('Component mounted/updated, fetching dashboard data');
      console.log('Current user:', currentUser.username, 'roles:', currentUser.roles);
      fetchDashboardData();
    } else {
      console.log('No current user available, skipping data fetch');
    }
  }, [currentUser]);

  // Add an alternative authentication testing function
  const testApiConnectivity = async () => {
    try {
      console.log('======= AUTHENTICATION DEBUG =======');
      console.log('Current user from context:', currentUser ? `${currentUser.username} (${currentUser.roles.join(', ')})` : 'Not logged in');
      
      // Test 0: Check stored values in localStorage
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      console.log('localStorage token exists:', storedToken ? 'Yes' : 'No');
      console.log('localStorage user exists:', storedUser ? 'Yes' : 'No');
      
      if (storedToken) {
        try {
          // Check if token is valid JWT format
          const parts = storedToken.split('.');
          console.log('Token parts:', parts.length);
          console.log('First 10 chars:', storedToken.substring(0, 10) + '...');
          
          if (parts.length === 3) {
            // Try to decode the token payload
            const payload = JSON.parse(atob(parts[1]));
            console.log('Token payload:', payload);
            console.log('Token subject:', payload.sub);
            console.log('Token roles:', payload.roles);
            console.log('Token expiration:', new Date(payload.exp * 1000).toLocaleString());
            console.log('Token expired?', Date.now() > payload.exp * 1000 ? 'Yes' : 'No');
          }
        } catch (e) {
          console.error('Error parsing token:', e);
        }
      }
      
      // Test 1: Use direct authHeader()
      console.log('\nTesting with direct authHeader()');
      const headers = authHeader();
      console.log('Auth headers from authHeader():', headers);
      
      // Log auth header specific info
      if (headers.Authorization) {
        const tokenParts = headers.Authorization.split(' ');
        if (tokenParts.length === 2) {
          console.log('Token type:', tokenParts[0]);
          console.log('Token first 10 chars:', tokenParts[1].substring(0, 10) + '...');
          
          // Check if token looks like JWT (contains 2 periods)
          const periods = tokenParts[1].split('.').length - 1;
          console.log('Token looks like JWT:', periods === 2 ? 'Yes' : 'No');
        }
      }
      
      try {
        // Use our new axiosWithAuth utility for consistent auth handling
        console.log('Testing endpoint with axiosWithAuth:', '/api/medication-requests/pending/count');
        console.log('Current origin:', window.location.origin);
        
        const authAxios = axiosWithAuth();
        authAxios.defaults.headers.common['X-Debug-Request'] = 'TestApiConnectivity';
        
        console.log('Headers being sent:', authAxios.defaults.headers);
        
        const directResponse = await authAxios.get('/api/medication-requests/pending/count');
        console.log('axiosWithAuth success:', directResponse.data);
        
        // Update UI with success
        setSummaryData(prev => ({
          ...prev,
          pendingMedicationRequests: directResponse.data || 0
        }));
        
        setError(null);
        return;
      } catch (err) {
        console.log('axiosWithAuth failed:', err.message);
        console.log('Response status:', err.response?.status);
        console.log('Response data:', err.response?.data);
      }
      
      // Test 2: Try with token directly from localStorage
      const token = localStorage.getItem('token');
      if (token) {
        console.log('Testing with direct token from localStorage');
        try {
          const tokenResponse = await axios.get('/api/medication-requests/pending/count', { 
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            } 
          });
          console.log('Direct token success:', tokenResponse.data);
          return;
        } catch (err) {
          console.log('Direct token failed:', err.message);
        }
      }
      
      // Test 3: Try the user object token
      const userJson = localStorage.getItem('user');
      if (userJson) {
        const user = JSON.parse(userJson);
        if (user?.accessToken) {
          console.log('Testing with token from user object');
          try {
            const userTokenResponse = await axios.get('/api/medication-requests/pending/count', { 
              headers: { 
                'Authorization': `Bearer ${user.accessToken}`,
                'Content-Type': 'application/json'
              } 
            });
            console.log('User token success:', userTokenResponse.data);
            return;
          } catch (err) {
            console.log('User token failed:', err.message);
          }
        }
      }
      
      console.log('All authentication tests failed');
    } catch (error) {
      console.error('Error testing API connectivity:', error);
    }
  };

  // Test backend connectivity directly
  const testBackendConnection = async () => {
    try {
      setLoading(true);
      setError('Testing backend connection...');
      
      // First test if backend is up by accessing a public endpoint
      try {
        const response = await axios.get('/api/health');
        console.log('Backend health check:', response.data);
        setError(`Backend server is up: ${JSON.stringify(response.data)}`);
      } catch (healthError) {
        console.error('Health check failed:', healthError);
        setError(`Backend health check failed: ${healthError.message}`);
      }
      
      // Try to access an endpoint with current credentials
      const currentToken = localStorage.getItem('token');
      if (!currentToken) {
        setError('No token found in localStorage. Please login again.');
        setLoading(false);
        return;
      }

      try {
        // Try to get user info with our consistent auth handling
        const authAxios = axiosWithAuth();
        const userResponse = await authAxios.get('/api/auth/me');
        
        console.log('User info request succeeded:', userResponse.data);
        const userRoles = userResponse.data.roles || [];
        setError(`User authenticated successfully. Roles: ${userRoles.join(', ')}`);
        
        // Check if user has the required role
        const hasNurseRole = userRoles.some(role => 
          role === 'SchoolNurse' || role === 'ROLE_SCHOOLNURSE' || 
          role === 'Admin' || role === 'ROLE_ADMIN'
        );
        
        if (hasNurseRole) {
          setError('User has the required role. Should have access to the endpoint.');
        } else {
          setError(`User does not have the required role. Current roles: ${userRoles.join(', ')}`);
        }
      } catch (userError) {
        console.error('User info request failed:', userError);
        setError(`User authentication check failed: ${userError.message}`);
      }
    } catch (e) {
      console.error('Connection test error:', e);
      setError(`Connection test failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box sx={{ p: 3 }}>      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <PageHeader title="Nurse Dashboard" />
        <Button 
          variant="contained" 
          color="primary"
          onClick={fetchDashboardData}
          startIcon={<RefreshIcon />}
          disabled={loading}
        >
          Refresh Data
        </Button>
      </Box>
      
      {error && (
        <Box sx={{ mb: 2 }}>
          <Typography color="error" sx={{ mb: 1 }}>
            {error}
          </Typography>          <Button 
            variant="outlined" 
            color="secondary"
            onClick={testApiConnectivity}
            size="small"
            sx={{ mr: 1 }}
          >            
            Test Authentication
          </Button>
          <Button 
            variant="outlined" 
            color="primary"
            onClick={testBackendConnection}
            size="small"
          >
            Test Connection
          </Button>
        </Box>
      )}

      <Grid container spacing={3} sx={{ mb: 3 }}>        <Grid item xs={12} md={6} lg={3}>
          <Card>            <CardHeader title="Pending Medication Requests" avatar={<AssignmentLateIcon color="warning" />} />
            <CardContent>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                  <CircularProgress size={40} />
                </Box>
              ) : (
                <Typography variant="h4" component="p" gutterBottom>
                  {summaryData.pendingMedicationRequests}
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                requests pending approval.
              </Typography>
              <Button 
                variant="contained" 
                component={RouterLink} 
                to="/medical/medication-management"
                startIcon={<MedicationIcon />}
              >
                Manage Medication Requests
              </Button>
            </CardContent>
          </Card>
        </Grid>        <Grid item xs={12} md={6} lg={3}>
          <Card>            <CardHeader title="Pending Health Declarations" avatar={<AssessmentIcon color="primary" />} />
            <CardContent>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                  <CircularProgress size={40} />
                </Box>
              ) : (
                <Typography variant="h4" component="p" gutterBottom>
                  {summaryData.pendingHealthDeclarations}
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                health declarations to review.
              </Typography>
              <Button 
                variant="contained" 
                component={RouterLink} 
                to="/nurse/health-declaration-approval"
                startIcon={<AssessmentIcon />}
              >
                Review Declarations
              </Button>
            </CardContent>
          </Card>
        </Grid>        <Grid item xs={12} md={6} lg={3}>
          <Card>            <CardHeader title="Upcoming Events" avatar={<EventAvailableIcon color="info" />} />
            <CardContent>
              <Typography variant="h4" component="p" gutterBottom>
                {summaryData.upcomingAppointments} 
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                events scheduled for today.
              </Typography>
              <Button 
                variant="outlined" 
                // component={RouterLink} 
                // to="/nurse/schedule" // Example future link
                disabled // Enable when schedule page is ready
              >
                View Schedule
              </Button>
            </CardContent>
          </Card>
        </Grid>
          <Grid item xs={12} md={6} lg={3}>
          <Card>            <CardHeader title="Recent Alerts" avatar={<WarningIcon color="error" />} />
            <CardContent>
              <Typography variant="h4" component="p" gutterBottom>
                {summaryData.recentAlerts}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                important alerts.
              </Typography>
              <Button 
                variant="outlined" 
                // component={RouterLink} 
                // to="/nurse/alerts" // Example future link
                disabled // Enable when alerts page is ready
              >
                View Alerts
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Quick Access</Typography>
        <List>
          <ListItem button component={RouterLink} to="/medical/medication-management">
            <ListItemIcon><MedicationIcon /></ListItemIcon>
            <ListItemText primary="Medication Management" />
          </ListItem>
          <ListItem button component={RouterLink} to="/medical/medication-management?tab=4">
            <ListItemIcon><MedicalServicesIcon color="error" /></ListItemIcon>
            <ListItemText primary="Medical Events & Incidents" />
          </ListItem>
          <ListItem button component={RouterLink} to="/nurse/health-declaration-approval">
            <ListItemIcon><AssessmentIcon /></ListItemIcon>
            <ListItemText primary="Health Declaration Approval" />
          </ListItem>
          <ListItem button component={RouterLink} to="/nurse/health-checkup-events">
            <ListItemIcon><EventAvailableIcon /></ListItemIcon>
            <ListItemText primary="Create and Manage Events" />
          </ListItem>
          {/* Add more quick links as other nurse functionalities are developed */}
          {/* e.g., Vaccination Management */}
        </List>
      </Paper>
    </Box>
  );
}

export default NurseDashboard;
