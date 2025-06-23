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
  Add, Edit, Delete, Search, FilterList, Group, Security,
  School, LocalHospital, SupervisorAccount, Person, Email, Phone,
  CheckCircle, Cancel, Block, VpnKey, History, Visibility, VisibilityOff
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import apiClient from '../../utils/api';

// Mock data for users
const mockUsers = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Admin',
    email: 'admin@schoolhealth.com',
    phone: '+84-912-345-678',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-01-15 10:30:00',
    createdAt: '2024-01-01',
    permissions: ['full_access']
  },
  {
    id: 2,
    firstName: 'Dr. Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@schoolhealth.com',
    phone: '+84-987-654-321',
    role: 'medical_staff',
    status: 'active',
    lastLogin: '2024-01-15 09:45:00',
    createdAt: '2024-01-05',
    permissions: ['view_students', 'manage_medications', 'create_reports']
  },
  {
    id: 3,
    firstName: 'Michael',
    lastName: 'Smith',
    email: 'michael.smith@parent.com',
    phone: '+84-901-234-567',
    role: 'parent',
    status: 'active',
    lastLogin: '2024-01-14 20:15:00',
    createdAt: '2024-01-10',
    permissions: ['view_own_child', 'submit_declarations']
  },
  {
    id: 4,
    firstName: 'Emma',
    lastName: 'Wilson',
    email: 'emma.wilson@student.edu',
    phone: '+84-923-456-789',
    role: 'student',
    status: 'active',
    lastLogin: '2024-01-15 08:20:00',
    createdAt: '2024-01-12',
    permissions: ['view_own_profile', 'view_health_resources']
  },
  {
    id: 5,
    firstName: 'Dr. James',
    lastName: 'Brown',
    email: 'james.brown@schoolhealth.com',
    phone: '+84-934-567-890',
    role: 'medical_staff',
    status: 'active',
    lastLogin: '2024-01-15 07:30:00',
    createdAt: '2024-01-08',
    permissions: ['view_students', 'manage_medications', 'create_reports']
  },
  {
    id: 6,
    firstName: 'Lisa',
    lastName: 'Davis',
    email: 'lisa.davis@parent.com',
    phone: '+84-945-678-901',
    role: 'parent',
    status: 'inactive',
    lastLogin: '2024-01-10 18:45:00',
    createdAt: '2024-01-03',
    permissions: ['view_own_child', 'submit_declarations']
  },
  {
    id: 7,
    firstName: 'Alex',
    lastName: 'Chen',
    email: 'alex.chen@student.edu',
    phone: '+84-956-789-012',
    role: 'student',
    status: 'active',
    lastLogin: '2024-01-14 16:10:00',
    createdAt: '2024-01-11',
    permissions: ['view_own_profile', 'view_health_resources']
  },
  {
    id: 8,
    firstName: 'Maria',
    lastName: 'Garcia',
    email: 'maria.garcia@parent.com',
    phone: '+84-967-890-123',
    role: 'parent',
    status: 'active',
    lastLogin: '2024-01-15 12:00:00',
    createdAt: '2024-01-06',
    permissions: ['view_own_child', 'submit_declarations']
  }
];

const UserManagement = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [users, setUsers] = useState(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [userDialog, setUserDialog] = useState({ open: false, mode: 'add', user: null });
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

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

  // Initialize with mock data
  useEffect(() => {
    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
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
                startIcon={<Add />}
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
        </Tabs>
        
        <CardContent>
          {selectedTab === 0 && <UserListTab />}
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
