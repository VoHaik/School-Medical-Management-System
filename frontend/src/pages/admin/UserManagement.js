import React, { useState, useEffect } from 'react';
import { 
  Grid, Card, CardContent, Typography, Box, Button, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Chip, IconButton, Avatar,
  FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel,
  Alert, Snackbar, Tabs, Tab, Divider, List, ListItem, ListItemText,
  ListItemIcon, ListItemSecondaryAction, InputAdornment
} from '@mui/material';
import {
  Add, Edit, Delete, Search, FilterList, PersonAdd, Group, Security,
  School, LocalHospital, SupervisorAccount, Person, Email, Phone,
  CheckCircle, Cancel, Block, VpnKey, History, Visibility, VisibilityOff
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import PendingRegistrationManagement from './PendingRegistrationManagement';

const UserManagement = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [userDialog, setUserDialog] = useState({ open: false, mode: 'add', user: null });
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [pendingRegistrationsCount, setPendingRegistrationsCount] = useState(0);

  // Form validation schema
  const userSchema = yup.object().shape({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phone: yup.string().required('Phone number is required'),
    role: yup.string().required('Role is required'),
    password: userDialog.mode === 'add' ? yup.string().min(6).required('Password is required') : yup.string(),
    status: yup.string().required('Status is required')
  });

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: '',
      password: '',
      status: 'active'
    }
  });

  // Sample user data
  useEffect(() => {
    const sampleUsers = [
      {
        id: 1,
        firstName: 'Dr. Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@school.edu',
        phone: '+1 (555) 123-4567',
        role: 'medical_staff',
        status: 'active',
        lastLogin: '2024-01-15 10:30:00',
        createdAt: '2023-09-01',
        permissions: ['view_students', 'manage_medications', 'create_reports']
      },
      {
        id: 2,
        firstName: 'Michael',
        lastName: 'Chen',
        email: 'michael.chen@parent.com',
        phone: '+1 (555) 234-5678',
        role: 'parent',
        status: 'active',
        lastLogin: '2024-01-14 18:45:00',
        createdAt: '2023-08-15',
        permissions: ['view_own_child', 'submit_declarations']
      },
      {
        id: 3,
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@school.edu',
        phone: '+1 (555) 345-6789',
        role: 'admin',
        status: 'active',
        lastLogin: '2024-01-15 09:15:00',
        createdAt: '2023-07-01',
        permissions: ['full_access']
      },
      {
        id: 4,
        firstName: 'Emma',
        lastName: 'Wilson',
        email: 'emma.wilson@student.edu',
        phone: '+1 (555) 456-7890',
        role: 'student',
        status: 'active',
        lastLogin: '2024-01-13 16:20:00',
        createdAt: '2023-09-15',
        permissions: ['view_own_profile', 'view_health_resources']
      },
      {
        id: 5,
        firstName: 'John',
        lastName: 'Davis',
        email: 'john.davis@parent.com',
        phone: '+1 (555) 567-8901',
        role: 'parent',
        status: 'inactive',
        lastLogin: '2023-12-20 14:30:00',
        createdAt: '2023-08-20',
        permissions: ['view_own_child', 'submit_declarations']
      }
    ];
    setUsers(sampleUsers);
    setFilteredUsers(sampleUsers);
  }, []);

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter, statusFilter]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <SupervisorAccount />;
      case 'medical_staff': return <LocalHospital />;
      case 'parent': return <Group />;
      case 'student': return <Person />;
      default: return <Group />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#f44336';
      case 'medical_staff': return '#2196f3';
      case 'parent': return '#4caf50';
      case 'student': return '#ff9800';
      default: return '#9e9e9e';
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'success' : 'error';
  };

  const openUserDialog = (mode, user = null) => {
    setUserDialog({ open: true, mode, user });
    if (user) {
      reset(user);
    } else {
      reset({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: '',
        password: '',
        status: 'active'
      });
    }
  };

  const closeUserDialog = () => {
    setUserDialog({ open: false, mode: 'add', user: null });
    reset();
  };

  const onSubmit = (data) => {
    if (userDialog.mode === 'add') {
      const newUser = {
        ...data,
        id: users.length + 1,
        lastLogin: 'Never',
        createdAt: new Date().toISOString().split('T')[0],
        permissions: getDefaultPermissions(data.role)
      };
      setUsers([...users, newUser]);
      setSnackbar({ open: true, message: 'User created successfully', severity: 'success' });
    } else {
      setUsers(users.map(user => 
        user.id === userDialog.user.id ? { ...user, ...data } : user
      ));
      setSnackbar({ open: true, message: 'User updated successfully', severity: 'success' });
    }
    closeUserDialog();
  };

  const getDefaultPermissions = (role) => {
    switch (role) {
      case 'admin': return ['full_access'];
      case 'medical_staff': return ['view_students', 'manage_medications', 'create_reports'];
      case 'parent': return ['view_own_child', 'submit_declarations'];
      case 'student': return ['view_own_profile', 'view_health_resources'];
      default: return [];
    }
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
    setSnackbar({ open: true, message: 'User deleted successfully', severity: 'success' });
  };

  const handleStatusToggle = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
    setSnackbar({ open: true, message: 'User status updated', severity: 'success' });
  };

  const UserListTab = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  label="Role"
                >
                  <MenuItem value="all">All Roles</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="medical_staff">Medical Staff</MenuItem>
                  <MenuItem value="parent">Parent</MenuItem>
                  <MenuItem value="student">Student</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<PersonAdd />}
                onClick={() => openUserDialog('add')}
              >
                Add User
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Users ({filteredUsers.length})
          </Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Login</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar style={{ backgroundColor: getRoleColor(user.role) }}>
                          {getRoleIcon(user.role)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {user.firstName} {user.lastName}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            ID: {user.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.role.replace('_', ' ').toUpperCase()}
                        size="small"
                        style={{
                          backgroundColor: getRoleColor(user.role),
                          color: 'white'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" display="flex" alignItems="center" gap={1}>
                          <Email fontSize="small" color="action" />
                          {user.email}
                        </Typography>
                        <Typography variant="body2" display="flex" alignItems="center" gap={1}>
                          <Phone fontSize="small" color="action" />
                          {user.phone}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.status.toUpperCase()}
                        color={getStatusColor(user.status)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {user.lastLogin}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <IconButton 
                          size="small" 
                          onClick={() => openUserDialog('edit', user)}
                          color="primary"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleStatusToggle(user.id)}
                          color={user.status === 'active' ? 'error' : 'success'}
                        >
                          {user.status === 'active' ? <Block /> : <CheckCircle />}
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteUser(user.id)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </div>
  );

  const RolePermissionsTab = () => (
    <div className="space-y-6">
      <Typography variant="h6" gutterBottom>
        Role-Based Permissions Management
      </Typography>
      
      {['admin', 'medical_staff', 'parent', 'student'].map((role) => (
        <Card key={role}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Avatar style={{ backgroundColor: getRoleColor(role) }}>
                {getRoleIcon(role)}
              </Avatar>
              <Typography variant="h6">
                {role.replace('_', ' ').toUpperCase()} Permissions
              </Typography>
            </Box>
            
            <Grid container spacing={2}>
              {getPermissionsList(role).map((permission, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <FormControlLabel
                    control={<Switch defaultChecked={permission.enabled} />}
                    label={
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {permission.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {permission.description}
                        </Typography>
                      </Box>
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const getPermissionsList = (role) => {
    const allPermissions = {
      admin: [
        { name: 'Full System Access', description: 'Complete access to all features', enabled: true },
        { name: 'User Management', description: 'Create, edit, delete users', enabled: true },
        { name: 'System Configuration', description: 'Modify system settings', enabled: true },
        { name: 'Data Export', description: 'Export system data', enabled: true },
        { name: 'Analytics & Reports', description: 'View all reports and analytics', enabled: true },
        { name: 'Health Programs', description: 'Manage health programs', enabled: true }
      ],
      medical_staff: [
        { name: 'View All Students', description: 'Access student health profiles', enabled: true },
        { name: 'Manage Medications', description: 'Handle medication inventory and administration', enabled: true },
        { name: 'Vaccination Management', description: 'Manage vaccination records and campaigns', enabled: true },
        { name: 'Health Checkups', description: 'Conduct and record health screenings', enabled: true },
        { name: 'Create Reports', description: 'Generate health reports and analytics', enabled: true },
        { name: 'Medical Events', description: 'Record and manage medical incidents', enabled: true }
      ],
      parent: [
        { name: 'View Own Child', description: 'Access own child\'s health information', enabled: true },
        { name: 'Submit Health Declarations', description: 'Submit daily health declarations', enabled: true },
        { name: 'Medication Submissions', description: 'Submit medication requests', enabled: true },
        { name: 'Vaccination Consent', description: 'Provide vaccination consent', enabled: true },
        { name: 'View Checkup History', description: 'View child\'s health checkup records', enabled: true },
        { name: 'Emergency Contacts', description: 'Manage emergency contact information', enabled: true }
      ],
      student: [
        { name: 'View Own Profile', description: 'Access personal health profile', enabled: true },
        { name: 'View Medical History', description: 'View own medical history', enabled: true },
        { name: 'Health Resources', description: 'Access health education resources', enabled: true },
        { name: 'Vaccination Records', description: 'View vaccination status', enabled: true },
        { name: 'Submit Health Updates', description: 'Update personal health information', enabled: false },
        { name: 'Request Medical Attention', description: 'Request medical assistance', enabled: true }
      ]
    };
    
    return allPermissions[role] || [];
  };

  const SystemLogsTab = () => (
    <div className="space-y-6">
      <Typography variant="h6" gutterBottom>
        System Activity Logs
      </Typography>
      
      <Card>
        <CardContent>
          <List>
            {[
              { action: 'User Login', user: 'Dr. Sarah Johnson', time: '2024-01-15 10:30:00', type: 'info' },
              { action: 'User Created', user: 'Admin User', time: '2024-01-15 09:15:00', type: 'success' },
              { action: 'Failed Login Attempt', user: 'Unknown', time: '2024-01-15 08:45:00', type: 'warning' },
              { action: 'User Status Changed', user: 'John Davis', time: '2024-01-14 16:20:00', type: 'info' },
              { action: 'Password Reset', user: 'Emma Wilson', time: '2024-01-14 14:10:00', type: 'warning' }
            ].map((log, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemIcon>
                    <History color={log.type === 'success' ? 'success' : log.type === 'warning' ? 'warning' : 'action'} />
                  </ListItemIcon>
                  <ListItemText
                    primary={log.action}
                    secondary={`User: ${log.user} | Time: ${log.time}`}
                  />
                  <ListItemSecondaryAction>
                    <Chip 
                      label={log.type.toUpperCase()} 
                      size="small" 
                      color={log.type === 'success' ? 'success' : log.type === 'warning' ? 'warning' : 'default'}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                {index < 4 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
    </div>
  );

  const PendingRegistrationsTab = () => (
    <div className="space-y-6">
      <PendingRegistrationManagement onRegistrationProcessed={loadPendingRegistrationsCount} />
    </div>
  );

  // Load pending registrations count
  useEffect(() => {
    loadPendingRegistrationsCount();
  }, []);

  const loadPendingRegistrationsCount = async () => {
    try {
      // Import getAuthAxios from AuthContext if needed
      const response = await fetch('/api/registration/pending/count', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const count = await response.json();
        setPendingRegistrationsCount(count);
      }
    } catch (error) {
      console.error('Error loading pending registrations count:', error);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <Typography variant="h4" component="h1" gutterBottom>
          User Management
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Manage system users, roles, and permissions
        </Typography>
      </div>

      <Card>
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab label="User List" icon={<Group />} />
          <Tab 
            label={
              <Box display="flex" alignItems="center">
                Parent Registrations
                {pendingRegistrationsCount > 0 && (
                  <Chip 
                    label={pendingRegistrationsCount} 
                    color="warning" 
                    size="small" 
                    sx={{ ml: 1 }}
                  />
                )}
              </Box>
            } 
            icon={<PersonAdd />} 
          />
          <Tab label="Role Permissions" icon={<Security />} />
          <Tab label="System Logs" icon={<History />} />
        </Tabs>
        
        <CardContent>
          {selectedTab === 0 && <UserListTab />}
          {selectedTab === 1 && <PendingRegistrationsTab />}
          {selectedTab === 2 && <RolePermissionsTab />}
          {selectedTab === 3 && <SystemLogsTab />}
        </CardContent>
      </Card>

      {/* User Dialog */}
      <Dialog open={userDialog.open} onClose={closeUserDialog} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            {userDialog.mode === 'add' ? 'Add New User' : 'Edit User'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="First Name"
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Last Name"
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Email"
                      type="email"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Phone Number"
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.role}>
                      <InputLabel>Role</InputLabel>
                      <Select {...field} label="Role">
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="medical_staff">Medical Staff</MenuItem>
                        <MenuItem value="parent">Parent</MenuItem>
                        <MenuItem value="student">Student</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              {userDialog.mode === 'add' && (
                <Grid item xs={12}>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select {...field} label="Status">
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeUserDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {userDialog.mode === 'add' ? 'Create User' : 'Update User'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default UserManagement;