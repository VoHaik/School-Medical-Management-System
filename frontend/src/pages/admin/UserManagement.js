import React, { useState, useEffect } from 'react';
import { 
  Grid, Card, CardContent, Typography, Box, Button, TextField, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Chip, IconButton, Avatar,
  FormControl, InputLabel, Select, MenuItem, Alert, Snackbar, InputAdornment, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText
} from '@mui/material';
import {
  Search, Group, School, LocalHospital, SupervisorAccount, Person,
  CheckCircle, Block, Refresh, Edit, Delete, Add
} from '@mui/icons-material';
import { getAllUsers, updateUser, deleteUser, deactivateUser, activateUser } from '../../services/api';
import PageHeader from '../../components/PageHeader';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Dialog states
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    role: '',
    isActive: true
  });

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, statusFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await getAllUsers();
      setUsers(userData || []);
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        (user.fullName && user.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.phoneNumber && user.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => 
        user.roleName && user.roleName.replace('ROLE_', '') === roleFilter
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => (user.isActive ? 'active' : 'inactive') === statusFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleUserStatusToggle = async (userId, currentStatus) => {
    try {
      if (currentStatus === 'active') {
        await deactivateUser(userId);
        showSnackbar('User deactivated successfully', 'success');
      } else {
        await activateUser(userId);
        showSnackbar('User activated successfully', 'success');
      }
      
      // Update local state
      setUsers(users.map(user => 
        user.userId === userId 
          ? { ...user, isActive: currentStatus !== 'active' }
          : user
      ));
    } catch (err) {
      console.error('Error updating user status:', err);
      showSnackbar('Failed to update user status. This feature requires backend implementation.', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditFormData({
      fullName: user.fullName || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || user.phone || '',
      role: user.roleName || '',
      isActive: (user.status || 'active') === 'active'
    });
    setEditDialog(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setDeleteDialog(true);
  };

  const handleEditFormChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditSubmit = async () => {
    try {
      await updateUser(selectedUser.userId, editFormData);
      showSnackbar('User updated successfully', 'success');
      setEditDialog(false);
      loadUsers(); // Reload users
    } catch (err) {
      console.error('Error updating user:', err);
      showSnackbar('Failed to update user. Please try again.', 'error');
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      await deleteUser(selectedUser.userId);
      showSnackbar('User deleted successfully', 'success');
      setDeleteDialog(false);
      loadUsers(); // Reload users
    } catch (err) {
      console.error('Error deleting user:', err);
      showSnackbar('Failed to delete user. Please try again.', 'error');
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'STUDENT':
        return <School />;
      case 'NURSE':
        return <LocalHospital />;
      case 'PARENT':
        return <Person />;
      case 'ADMIN':
        return <SupervisorAccount />;
      default:
        return <Person />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'STUDENT':
        return 'primary';
      case 'NURSE':
        return 'secondary';
      case 'PARENT':
        return 'info';
      case 'ADMIN':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <PageHeader 
          title="User Management" 
          subtitle="Manage system users and access"
          icon={<Group />}
        />
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <PageHeader 
          title="User Management" 
          subtitle="Manage system users and access"
          icon={<Group />}
        />
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
          <Button 
            onClick={loadUsers} 
            startIcon={<Refresh />}
            sx={{ ml: 2 }}
          >
            Retry
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PageHeader 
        title="User Management" 
        subtitle="Manage system users and access"
        icon={<Group />}
      />

      {/* Controls */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            placeholder="Search by name, username, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }}
          />
        </Grid>
        
        <Grid item xs={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={roleFilter}
              label="Role"
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <MenuItem value="all">All Roles</MenuItem>
              <MenuItem value="STUDENT">Students</MenuItem>
              <MenuItem value="NURSE">Nurses</MenuItem>
              <MenuItem value="PARENT">Parents</MenuItem>
              <MenuItem value="ADMIN">Admins</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Box display="flex" gap={2}>
            <Button 
              variant="outlined" 
              startIcon={<Refresh />}
              onClick={loadUsers}
            >
              Refresh
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Users Table */}
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Users ({filteredUsers.length})
            </Typography>
          </Box>
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.userId}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar sx={{ mr: 2, bgcolor: getRoleColor(user.roleName?.replace('ROLE_', '') || 'USER') === 'primary' ? '#1976d2' : '#666' }}>
                            {getRoleIcon(user.roleName?.replace('ROLE_', '') || 'USER')}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2">
                              {user.fullName || 'N/A'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {user.username}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={user.roleName?.replace('ROLE_', '') || 'USER'} 
                          color={getRoleColor(user.roleName?.replace('ROLE_', '') || 'USER')}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={user.isActive ? 'active' : 'inactive'} 
                          color={user.isActive ? 'success' : 'error'}
                          size="small"
                          icon={user.isActive ? <CheckCircle /> : <Block />}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {user.phoneNumber || '+84 XXX XXX XXX'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <IconButton
                            size="small"
                            onClick={() => handleEditUser(user)}
                            color="primary"
                            title="Edit User"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteUser(user)}
                            color="error"
                            title="Delete User"
                          >
                            <Delete />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleUserStatusToggle(user.userId, user.isActive ? 'active' : 'inactive')}
                            color={user.isActive ? 'warning' : 'success'}
                            title={user.isActive ? 'Deactivate User' : 'Activate User'}
                          >
                            {user.isActive ? <Block /> : <CheckCircle />}
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Box py={4}>
                        <Typography variant="h6" color="textSecondary" gutterBottom>
                          No users found
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Try adjusting your search criteria or filters
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Edit User Dialog */}
      <Dialog 
        open={editDialog} 
        onClose={() => setEditDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={editFormData.fullName}
                  onChange={(e) => handleEditFormChange('fullName', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => handleEditFormChange('email', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={editFormData.phoneNumber}
                  onChange={(e) => handleEditFormChange('phoneNumber', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={editFormData.role}
                    label="Role"
                    onChange={(e) => handleEditFormChange('role', e.target.value)}
                  >
                    <MenuItem value="STUDENT">Student</MenuItem>
                    <MenuItem value="PARENT">Parent</MenuItem>
                    <MenuItem value="NURSE">Nurse</MenuItem>
                    <MenuItem value="ADMIN">Admin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={editFormData.isActive}
                    label="Status"
                    onChange={(e) => handleEditFormChange('isActive', e.target.value)}
                  >
                    <MenuItem value={true}>Active</MenuItem>
                    <MenuItem value={false}>Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog 
        open={deleteDialog} 
        onClose={() => setDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogContentText>
          {selectedUser && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="subtitle2">User Details:</Typography>
              <Typography variant="body2">Name: {selectedUser.fullName}</Typography>
              <Typography variant="body2">Username: {selectedUser.username}</Typography>
              <Typography variant="body2">Email: {selectedUser.email}</Typography>
              <Typography variant="body2">Role: {selectedUser.roleName}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteSubmit} variant="contained" color="error">
            Delete User
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserManagement;