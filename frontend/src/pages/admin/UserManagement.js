import React, { useState, useEffect } from 'react';
import { 
  Grid, Card, CardContent, Typography, Box, Button, TextField, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Chip, IconButton, Avatar,
  FormControl, InputLabel, Select, MenuItem, Alert, Snackbar, InputAdornment, CircularProgress
} from '@mui/material';
import {
  Search, Group, School, LocalHospital, SupervisorAccount, Person,
  CheckCircle, Block, Refresh
} from '@mui/icons-material';
import { getAllUsers, deactivateUser, activateUser } from '../../utils/api';
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
        (user.phone && user.phone.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => (user.status || 'active') === statusFilter);
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
        user.id === userId 
          ? { ...user, status: currentStatus === 'active' ? 'inactive' : 'active' }
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
                  <TableCell>Status</TableCell>                      <TableCell>Phone</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar sx={{ mr: 2, bgcolor: getRoleColor(user.role) === 'primary' ? '#1976d2' : '#666' }}>
                            {getRoleIcon(user.role)}
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
                          label={user.role} 
                          color={getRoleColor(user.role)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={user.status || 'active'} 
                          color={(user.status || 'active') === 'active' ? 'success' : 'error'}
                          size="small"
                          icon={(user.status || 'active') === 'active' ? <CheckCircle /> : <Block />}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {user.phone || user.phoneNumber || '+84 XXX XXX XXX'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleUserStatusToggle(user.id, user.status || 'active')}
                          color={(user.status || 'active') === 'active' ? 'error' : 'success'}
                          title={(user.status || 'active') === 'active' ? 'Deactivate User' : 'Activate User'}
                        >
                          {(user.status || 'active') === 'active' ? <Block /> : <CheckCircle />}
                        </IconButton>
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
    </div>
  );
};

export default UserManagement;