import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  TextField,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  Wc as GenderIcon,
  School as SchoolIcon,
  PhotoCamera as PhotoIcon,
  Verified as VerifiedIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { currentUser, getAuthAxios } = useAuth();
  const [loading, setLoading] = useState(true);  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profileExists, setProfileExists] = useState(false); // Track if profile exists
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    className: '',
    studentCode: '',
    avatarUrl: ''
  });
  const [editData, setEditData] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [avatarDialog, setAvatarDialog] = useState(false);
  const [newAvatarUrl, setNewAvatarUrl] = useState('');

  // Load profile data
  const loadProfileData = useCallback(async () => {
    try {
      setLoading(true);
      const authAxios = getAuthAxios();
      const response = await authAxios.get('/api/student-profile');
      
      const data = {
        fullName: response.data.fullName || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
        dateOfBirth: response.data.dateOfBirth ? new Date(response.data.dateOfBirth).toISOString().split('T')[0] : '',
        gender: response.data.gender || '',
        className: response.data.className || '',
        studentCode: response.data.studentCode || '',
        avatarUrl: response.data.avatarUrl || ''
      };
      
      console.log('=== LOAD PROFILE DEBUG ===');
      console.log('Raw response:', response.data);
      console.log('Processed data:', data);
      
      setProfileData(data);
      setEditData(data);
      setMessage('');
      setProfileExists(true); // Profile loaded successfully
    } catch (error) {
      console.error('Error loading profile:', error);
      
      if (error.response && error.response.data && error.response.data.message === "Student profile not found") {
        setMessage('Your profile needs to be completed. Please fill in your details.');
        setMessageType('info');
        setEditing(true);
        setProfileExists(false); // Profile doesn't exist yet
        
        // Initialize with current user data
        const initialData = {
          fullName: currentUser?.fullName || '',
          email: currentUser?.email || '',
          phone: currentUser?.phone || '',
          dateOfBirth: '',
          gender: '',
          className: '',
          studentCode: '',
          avatarUrl: currentUser?.avatarUrl || ''
        };        setProfileData(initialData);
        setEditData(initialData);      } else {
        setMessage('Error loading profile data. Please try again later.');
        setMessageType('error');
        // Don't change profileExists state for other errors - could be network/server issues
      }
    } finally {
      setLoading(false);
    }
  }, [getAuthAxios, currentUser]);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };  // Handle form submission
  const handleSave = async () => {
    // Prepare data outside try block so it's available in error handling
    const submitData = {
      ...editData,
      // Convert date to proper format if needed
      dateOfBirth: editData.dateOfBirth || null
    };
    
    // Debug log to check what we're sending
    console.log('=== SAVE PROFILE DEBUG ===');
    console.log('submitData:', submitData);
    
    try {
      setSaving(true);
      setMessage('');
      
      const authAxios = getAuthAxios();
      // Determine if we need to create or update profile based on profileExists flag
      const isNewProfile = !profileExists;
      const endpoint = '/api/student-profile';
      const method = isNewProfile ? 'post' : 'put';
      
      const response = await authAxios[method](endpoint, submitData);
      
      console.log('=== SAVE RESPONSE ===');
      console.log('response:', response.data);
      
      // If we reach here, the request was successful (status 200)
      setMessage(`Profile ${isNewProfile ? 'created' : 'updated'} successfully!`);
      setMessageType('success');
      setEditing(false);
      setProfileExists(true); // Profile now exists
      await loadProfileData(); // Reload to get updated data
    } catch (error) {
      console.error('Error saving profile:', error);
        // Check if this is a "Student profile already exists" error when trying to POST
      if (error.response && error.response.status === 400 && 
          error.response.data && error.response.data.message === "Student profile already exists") {
        
        // Profile exists but our state is wrong - update it and try PUT instead
        setProfileExists(true);
        try {
          const authAxios = getAuthAxios();
          const response = await authAxios.put('/api/student-profile', submitData);
          setMessage('Profile updated successfully!');
          setMessageType('success');
          setEditing(false);
          await loadProfileData(); // Reload to get updated data
        } catch (putError) {
          console.error('Error updating profile after POST failed:', putError);
          setMessage(putError.response?.data?.message || 'Error updating profile. Please try again.');
          setMessageType('error');
        }
      } else {
        setMessage(error.response?.data?.message || 'Error saving profile. Please try again.');
        setMessageType('error');
      }
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel editing
  const handleCancel = () => {
    setEditData(profileData);
    setEditing(false);
    setMessage('');
  };

  // Handle avatar update
  const handleAvatarUpdate = async () => {
    try {
      const authAxios = getAuthAxios();
      await authAxios.put('/api/student-profile', {
        avatarUrl: newAvatarUrl
      });
      
      setMessage('Avatar updated successfully!');
      setMessageType('success');
      setAvatarDialog(false);
      setNewAvatarUrl('');
      await loadProfileData();
    } catch (error) {
      console.error('Error updating avatar:', error);
      setMessage('Error updating avatar. Please try again.');
      setMessageType('error');
    }
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="p-6">
      <Card className="mb-6">
        <CardContent>
          <Typography variant="h4" gutterBottom className="text-blue-600 font-bold">
            My Profile
          </Typography>
          {message && (
            <Alert severity={messageType} className="mb-6">
              {message}
            </Alert>
          )}
          <Grid container spacing={4}>
            {/* Profile Overview Card */}
            <Grid item xs={12} md={4}>
              <Card className="h-fit">
                <CardContent className="text-center">
                  <Box className="relative inline-block mb-4">
                    <Avatar
                      src={profileData.avatarUrl}
                      sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                    >
                      {profileData.fullName ? profileData.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'S'}
                    </Avatar>
                    <Tooltip title="Change Avatar">
                      <IconButton
                        className="absolute bottom-0 right-0 bg-blue-600 text-white hover:bg-blue-700"
                        size="small"
                        onClick={() => setAvatarDialog(true)}
                      >
                        <PhotoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  
                  <Typography variant="h5" gutterBottom className="font-bold">
                    {profileData.fullName || 'Student Name'}
                  </Typography>
                  
                  {profileData.studentCode && (
                    <Chip
                      icon={<VerifiedIcon />}
                      label={`ID: ${profileData.studentCode}`}
                      color="primary"
                      className="mb-2"
                    />
                  )}
                  
                  {profileData.className && (
                    <Chip
                      icon={<SchoolIcon />}
                      label={profileData.className}
                      variant="outlined"
                      className="mb-4"
                    />
                  )}
                  
                  {profileData.dateOfBirth && (
                    <Typography variant="body2" color="textSecondary">
                      Age: {calculateAge(profileData.dateOfBirth)} years old
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Profile Details Card */}
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Box className="flex justify-between items-center mb-4">
                    <Typography variant="h6" className="font-bold">
                      Personal Information
                    </Typography>
                    {!editing ? (
                      <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => setEditing(true)}
                      >
                        Edit Profile
                      </Button>
                    ) : (
                      <Box className="space-x-2">
                        <Button
                          variant="outlined"
                          startIcon={<CancelIcon />}
                          onClick={handleCancel}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="contained"
                          startIcon={<SaveIcon />}
                          onClick={handleSave}
                          disabled={saving}
                        >
                          {saving ? <CircularProgress size={20} /> : 'Save'}
                        </Button>
                      </Box>
                    )}
                  </Box>

                  <Divider className="mb-4" />

                  {editing ? (
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Full Name"
                          name="fullName"
                          value={editData.fullName}
                          onChange={handleInputChange}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Email"
                          name="email"
                          type="email"
                          value={editData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Phone Number"
                          name="phone"
                          value={editData.phone}
                          onChange={handleInputChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Date of Birth"
                          name="dateOfBirth"
                          type="date"
                          value={editData.dateOfBirth}
                          onChange={handleInputChange}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Gender"
                          name="gender"
                          select
                          value={editData.gender}
                          onChange={handleInputChange}
                          SelectProps={{ native: true }}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Class Name"
                          name="className"
                          value={editData.className}
                          onChange={handleInputChange}
                        />
                      </Grid>
                    </Grid>
                  ) : (
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <PersonIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Full Name"
                          secondary={profileData.fullName || 'Not set'}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <EmailIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Email"
                          secondary={profileData.email || 'Not set'}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <PhoneIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Phone Number"
                          secondary={profileData.phone || 'Not set'}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CalendarIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Date of Birth"
                          secondary={profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toLocaleDateString() : 'Not set'}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <GenderIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Gender"
                          secondary={profileData.gender || 'Not set'}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <SchoolIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Class"
                          secondary={profileData.className || 'Not set'}
                        />
                      </ListItem>
                    </List>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Avatar Update Dialog */}
          <Dialog open={avatarDialog} onClose={() => setAvatarDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Update Avatar</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                label="Avatar URL"
                value={newAvatarUrl}
                onChange={(e) => setNewAvatarUrl(e.target.value)}
                placeholder="Enter image URL"
                className="mt-4"
              />
              {newAvatarUrl && (
                <Box className="mt-4 text-center">
                  <Typography variant="body2" className="mb-2">Preview:</Typography>
                  <Avatar
                    src={newAvatarUrl}
                    sx={{ width: 80, height: 80, mx: 'auto' }}
                  >
                    Preview
                  </Avatar>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setAvatarDialog(false)}>Cancel</Button>
              <Button
                onClick={handleAvatarUpdate}
                variant="contained"
                disabled={!newAvatarUrl}
              >
                Update Avatar
              </Button>
            </DialogActions>
          </Dialog>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;
