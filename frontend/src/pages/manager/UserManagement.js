import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Paper,
  Tabs,
  Tab,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Switch,
  Tooltip,
  Divider,
  InputAdornment,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  LocalHospital as MedicalIcon,
  SupervisorAccount as ManagerIcon,
  Group as GroupIcon,
  VerifiedUser as VerifiedIcon,
  Block as BlockIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  ManageAccounts as ManageAccountsIcon
} from '@mui/icons-material';
import { DataTable } from '../../components/shared';
import PageHeader from '../../components/PageHeader';

const UserManagement = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add', 'edit', 'view', 'delete'
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  
  // Form state for add/edit user
  const [userForm, setUserForm] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    role: '',
    schoolClass: '',
    department: '',
    isActive: true
  });
  
  // Load mock data
  useEffect(() => {
    setTimeout(() => {
      const mockUsers = [
        {
          id: 1,
          fullName: 'Dr. Sarah Johnson',
          username: 'sjohnson',
          email: 'sjohnson@schoolhealth.edu',
          phone: '555-123-4567',
          role: 'medical_staff',
          title: 'Head School Nurse',
          department: 'Health Services',
          isActive: true,
          lastLogin: '2025-06-06T08:30:00',
          photo: 'https://randomuser.me/api/portraits/women/44.jpg'
        },
        {
          id: 2,
          fullName: 'James Wilson',
          username: 'jwilson',
          email: 'jwilson@schoolhealth.edu',
          phone: '555-234-5678',
          role: 'medical_staff',
          title: 'School Nurse',
          department: 'Health Services',
          isActive: true,
          lastLogin: '2025-06-05T14:20:00',
          photo: 'https://randomuser.me/api/portraits/men/32.jpg'
        },
        {
          id: 3,
          fullName: 'Michelle Garcia',
          username: 'mgarcia',
          email: 'mgarcia@schoolhealth.edu',
          phone: '555-345-6789',
          role: 'manager',
          title: 'Health Program Manager',
          department: 'Administration',
          isActive: true,
          lastLogin: '2025-06-06T09:15:00',
          photo: 'https://randomuser.me/api/portraits/women/68.jpg'
        },
        {
          id: 4,
          fullName: 'Robert Chen',
          username: 'rchen',
          email: 'rchen@schoolhealth.edu',
          phone: '555-456-7890',
          role: 'parent',
          children: ['Emma Chen (Grade 4)', 'Michael Chen (Grade 2)'],
          isActive: true,
          lastLogin: '2025-06-04T18:45:00',
          photo: 'https://randomuser.me/api/portraits/men/42.jpg'
        },
        {
          id: 5,
          fullName: 'Emma Chen',
          username: 'echen',
          email: 'echen@students.schoolhealth.edu',
          phone: '',
          role: 'student',
          schoolClass: 'Grade 4A',
          isActive: true,
          lastLogin: '2025-06-05T15:30:00',
          photo: 'https://randomuser.me/api/portraits/women/33.jpg'
        },
        {
          id: 6,
          fullName: 'David Thompson',
          username: 'dthompson',
          email: 'dthompson@schoolhealth.edu',
          phone: '555-567-8901',
          role: 'admin',
          title: 'System Administrator',
          department: 'IT Department',
          isActive: true,
          lastLogin: '2025-06-06T08:00:00',
          photo: 'https://randomuser.me/api/portraits/men/22.jpg'
        },
        {
          id: 7,
          fullName: 'Jennifer Lee',
          username: 'jlee',
          email: 'jlee@schoolhealth.edu',
          phone: '555-678-9012',
          role: 'medical_staff',
          title: 'School Nurse Assistant',
          department: 'Health Services',
          isActive: false, // inactive user
          lastLogin: '2025-05-25T10:15:00',
          photo: 'https://randomuser.me/api/portraits/women/25.jpg'
        },
        {
          id: 8,
          fullName: 'Michael Rodriguez',
          username: 'mrodriguez',
          email: 'mrodriguez@students.schoolhealth.edu',
          phone: '',
          role: 'student',
          schoolClass: 'Grade 7B',
          isActive: true,
          lastLogin: '2025-06-03T14:25:00',
          photo: 'https://randomuser.me/api/portraits/men/67.jpg'
        },
        {
          id: 9,
          fullName: 'Lisa Martinez',
          username: 'lmartinez',
          email: 'lmartinez@schoolhealth.edu',
          phone: '555-789-0123',
          role: 'parent',
          children: ['Carlos Martinez (Grade 6)', 'Sofia Martinez (Grade 3)'],
          isActive: true,
          lastLogin: '2025-06-02T19:10:00',
          photo: 'https://randomuser.me/api/portraits/women/75.jpg'
        },
        {
          id: 10,
          fullName: 'Thomas Wilson',
          username: 'twilson',
          email: 'twilson@schoolhealth.edu',
          phone: '555-890-1234',
          role: 'manager',
          title: 'Health Education Coordinator',
          department: 'Education',
          isActive: true,
          lastLogin: '2025-06-04T11:30:00',
          photo: 'https://randomuser.me/api/portraits/men/52.jpg'
        }
      ];
      
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);
  
  // Handler for tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handler for search query change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  
  // Handler for filter change
  const handleFilterChange = (event) => {
    setUserFilter(event.target.value);
  };
  
  // Filter users based on search query and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = userFilter === 'all' || user.role === userFilter;
    
    const matchesActiveStatus = tabValue === 0 ? user.isActive : !user.isActive;
    
    return matchesSearch && matchesFilter && matchesActiveStatus;
  });
  
  // Open dialog for add, edit, view or delete user
  const handleOpenDialog = (mode, user = null) => {
    setDialogMode(mode);
    setSelectedUser(user);
    
    if (mode === 'add') {
      // Reset form for new user
      setUserForm({
        fullName: '',
        username: '',
        email: '',
        phone: '',
        role: '',
        schoolClass: '',
        department: '',
        isActive: true
      });
    } else if (mode === 'edit' && user) {
      // Pre-fill form with user data
      setUserForm({
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        schoolClass: user.schoolClass || '',
        department: user.department || '',
        isActive: user.isActive
      });
    }
    
    setOpenDialog(true);
  };
  
  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  // Handle form field changes
  const handleFormChange = (field) => (event) => {
    setUserForm({
      ...userForm,
      [field]: field === 'isActive' ? event.target.checked : event.target.value
    });
  };
  
  // Handle form submission
  const handleSubmitForm = () => {
    // In a real application, you would send this to your API
    // Mock implementation for UI demonstration
    if (dialogMode === 'add') {
      // Mock adding new user
      const newUser = {
        id: users.length + 1,
        ...userForm,
        lastLogin: null,
        photo: 'https://randomuser.me/api/portraits/lego/1.jpg' // Placeholder image
      };
      setUsers([...users, newUser]);
    } else if (dialogMode === 'edit' && selectedUser) {
      // Mock updating user
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id ? { ...user, ...userForm } : user
      );
      setUsers(updatedUsers);
    } else if (dialogMode === 'delete' && selectedUser) {
      // Mock deleting user (in real app, you might soft-delete instead)
      const updatedUsers = users.filter(user => user.id !== selectedUser.id);
      setUsers(updatedUsers);
    }
    
    handleCloseDialog();
  };
  
  // Toggle user active status
  const handleToggleActive = (user) => {
    const updatedUsers = users.map(u => {
      if (u.id === user.id) {
        return { ...u, isActive: !u.isActive };
      }
      return u;
    });
    setUsers(updatedUsers);
  };
  
  // Get role label and color
  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return { label: 'Administrator', color: '#d32f2f', icon: <VerifiedIcon /> };
      case 'manager':
        return { label: 'Manager', color: '#7b1fa2', icon: <ManagerIcon /> };
      case 'medical_staff':
        return { label: 'Medical Staff', color: '#1976d2', icon: <MedicalIcon /> };
      case 'parent':
        return { label: 'Parent', color: '#388e3c', icon: <PersonIcon /> };
      case 'student':
        return { label: 'Student', color: '#f57c00', icon: <SchoolIcon /> };
      default:
        return { label: 'User', color: '#757575', icon: <PersonIcon /> };
    }
  };
  
  // Get avatar for user in list view
  const getUserAvatar = (user) => {
    return user.photo ? (
      <Avatar src={user.photo} alt={user.fullName} />
    ) : (
      <Avatar>{user.fullName.charAt(0)}</Avatar>
    );
  };
  
  // Render user dialog content based on mode
  const renderDialogContent = () => {
    switch (dialogMode) {
      case 'add':
      case 'edit':
        return (
          <>
            <DialogTitle>{dialogMode === 'add' ? 'Add New User' : 'Edit User'}</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <TextField
                    label="Full Name"
                    fullWidth
                    value={userForm.fullName}
                    onChange={handleFormChange('fullName')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Username"
                    fullWidth
                    value={userForm.username}
                    onChange={handleFormChange('username')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={userForm.role}
                      onChange={handleFormChange('role')}
                      label="Role"
                    >
                      <MenuItem value="medical_staff">Medical Staff</MenuItem>
                      <MenuItem value="student">Student</MenuItem>
                      <MenuItem value="parent">Parent</MenuItem>
                      <MenuItem value="manager">Manager</MenuItem>
                      <MenuItem value="admin">Administrator</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    value={userForm.email}
                    onChange={handleFormChange('email')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone Number"
                    fullWidth
                    value={userForm.phone}
                    onChange={handleFormChange('phone')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  {userForm.role === 'student' ? (
                    <TextField
                      label="Class/Grade"
                      fullWidth
                      value={userForm.schoolClass}
                      onChange={handleFormChange('schoolClass')}
                    />
                  ) : (
                    <TextField
                      label="Department"
                      fullWidth
                      value={userForm.department}
                      onChange={handleFormChange('department')}
                    />
                  )}
                </Grid>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item>
                        <Switch
                          checked={userForm.isActive}
                          onChange={handleFormChange('isActive')}
                        />
                      </Grid>
                      <Grid item>
                        <Typography variant="body2">
                          User is {userForm.isActive ? 'active' : 'inactive'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </FormControl>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleSubmitForm}
              >
                {dialogMode === 'add' ? 'Add User' : 'Save Changes'}
              </Button>
            </DialogActions>
          </>
        );
        
      case 'view':
        if (!selectedUser) return null;
        const roleBadge = getRoleBadge(selectedUser.role);
        return (
          <>
            <DialogTitle>User Profile</DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar 
                  src={selectedUser.photo} 
                  alt={selectedUser.fullName}
                  sx={{ width: 80, height: 80, mr: 2 }}
                />
                <Box>
                  <Typography variant="h6">{selectedUser.fullName}</Typography>
                  <Chip 
                    icon={roleBadge.icon}
                    label={roleBadge.label} 
                    sx={{ backgroundColor: roleBadge.color, color: 'white' }}
                    size="small"
                  />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {selectedUser.title || selectedUser.schoolClass || ''}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" gutterBottom>Contact Information</Typography>
              <Box sx={{ mb: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <MailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">{selectedUser.email}</Typography>
                    </Box>
                  </Grid>
                  {selectedUser.phone && (
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">{selectedUser.phone}</Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Box>
              
              {selectedUser.role === 'parent' && selectedUser.children && (
                <>
                  <Typography variant="subtitle2" gutterBottom>Children</Typography>
                  <Box sx={{ mb: 2 }}>
                    <List dense>
                      {selectedUser.children.map((child, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={child} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </>
              )}
              
              <Divider sx={{ my: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>Account Status</Typography>
                  <Chip 
                    icon={selectedUser.isActive ? <VerifiedIcon /> : <BlockIcon />}
                    label={selectedUser.isActive ? 'Active' : 'Inactive'}
                    color={selectedUser.isActive ? 'success' : 'default'}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>Last Login</Typography>
                  <Typography variant="body2">
                    {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString() : 'Never'}
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button 
                color="primary"
                onClick={() => {
                  handleCloseDialog();
                  handleOpenDialog('edit', selectedUser);
                }}
              >
                Edit
              </Button>
            </DialogActions>
          </>
        );
        
      case 'delete':
        return (
          <>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <Alert severity="warning" sx={{ mb: 2 }}>
                This action cannot be undone.
              </Alert>
              <Typography>
                Are you sure you want to delete the user account for{' '}
                <strong>{selectedUser?.fullName}</strong>?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button 
                variant="contained" 
                color="error"
                onClick={handleSubmitForm}
              >
                Delete
              </Button>
            </DialogActions>
          </>
        );
        
      default:
        return null;
    }
  };
  
  // Column definitions for the data table
  const columns = [
    { 
      id: 'fullName', 
      label: 'Name',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {getUserAvatar(row)}
          <Box sx={{ ml: 2 }}>
            <Typography variant="body2" fontWeight="medium">{row.fullName}</Typography>
            <Typography variant="caption" color="text.secondary">@{row.username}</Typography>
          </Box>
        </Box>
      )
    },
    { 
      id: 'role', 
      label: 'Role',
      render: (row) => {
        const roleBadge = getRoleBadge(row.role);
        return (
          <Chip 
            icon={roleBadge.icon}
            label={roleBadge.label} 
            size="small"
            sx={{ backgroundColor: roleBadge.color, color: 'white' }}
          />
        );
      }
    },
    { id: 'email', label: 'Email' },
    { 
      id: 'info', 
      label: 'Details',
      render: (row) => (
        row.role === 'student' ? row.schoolClass : 
        row.role === 'parent' ? `${row.children?.length || 0} children` : 
        row.title
      )
    },
    { 
      id: 'lastLogin', 
      label: 'Last Login',
      render: (row) => row.lastLogin ? new Date(row.lastLogin).toLocaleDateString() : 'Never'
    },
    { 
      id: 'actions', 
      label: 'Actions',
      render: (row) => (
        <Box>
          <Tooltip title="View">
            <IconButton size="small" onClick={() => handleOpenDialog('view', row)}>
              <PersonIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => handleOpenDialog('edit', row)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => handleOpenDialog('delete', row)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={row.isActive ? 'Deactivate' : 'Activate'}>
            <Switch
              size="small"
              checked={row.isActive}
              onChange={() => handleToggleActive(row)}
            />
          </Tooltip>
        </Box>
      )
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader 
        title="User Management"
        subtitle="Manage system users, roles and permissions"
        icon={<ManageAccountsIcon fontSize="large" />}
      />
      
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
          indicatorColor="primary"
        >
          <Tab label="Active Users" />
          <Tab label="Inactive Users" />
        </Tabs>
        
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <TextField
                label="Search Users"
                variant="outlined"
                size="small"
                fullWidth
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl variant="outlined" size="small" fullWidth>
                <InputLabel>Filter by Role</InputLabel>
                <Select
                  value={userFilter}
                  onChange={handleFilterChange}
                  label="Filter by Role"
                >
                  <MenuItem value="all">All Roles</MenuItem>
                  <MenuItem value="medical_staff">Medical Staff</MenuItem>
                  <MenuItem value="student">Students</MenuItem>
                  <MenuItem value="parent">Parents</MenuItem>
                  <MenuItem value="manager">Managers</MenuItem>
                  <MenuItem value="admin">Administrators</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog('add')}
              >
                Add User
              </Button>
            </Grid>
          </Grid>
          
          <Typography variant="subtitle2" gutterBottom>
            {filteredUsers.length} {tabValue === 0 ? 'Active' : 'Inactive'} Users
          </Typography>
          
          <DataTable 
            data={filteredUsers}
            columns={columns}
            pagination={true}
            rowsPerPage={8}
            loading={loading}
          />
        </Box>
      </Paper>
      
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        {renderDialogContent()}
      </Dialog>
    </Box>
  );
};

export default UserManagement;
