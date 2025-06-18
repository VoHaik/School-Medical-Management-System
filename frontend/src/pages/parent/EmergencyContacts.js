import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  IconButton,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Switch,
  FormControlLabel,
  Tooltip,
  Menu,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Home as HomeIcon,
  Work as WorkIcon,
  Person as PersonIcon,
  MoreVert as MoreVertIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Send as SendIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { format } from 'date-fns';

// Validation schema
const contactSchema = yup.object().shape({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  relationship: yup.string().required('Relationship is required'),
  phoneNumber: yup.string()
    .required('Phone number is required')
    .matches(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number format'),
  email: yup.string().email('Invalid email format'),
  address: yup.string(),
  isEmergencyContact: yup.boolean(),
  isPrimaryContact: yup.boolean(),
  canPickupStudent: yup.boolean(),
  notes: yup.string(),
});

// Mock data
const mockContacts = [
  {
    id: 1,
    name: 'John Smith',
    relationship: 'Father',
    phoneNumber: '+1234567890',
    email: 'john.smith@email.com',
    address: '123 Main St, City, State 12345',
    isEmergencyContact: true,
    isPrimaryContact: true,
    canPickupStudent: true,
    isVerified: true,
    lastUpdated: new Date('2024-01-15'),
    notes: 'Primary guardian, available 24/7'
  },
  {
    id: 2,
    name: 'Jane Smith',
    relationship: 'Mother',
    phoneNumber: '+1234567891',
    email: 'jane.smith@email.com',
    address: '123 Main St, City, State 12345',
    isEmergencyContact: true,
    isPrimaryContact: false,
    canPickupStudent: true,
    isVerified: true,
    lastUpdated: new Date('2024-01-15'),
    notes: 'Works from home, available during school hours'
  },
  {
    id: 3,
    name: 'Robert Johnson',
    relationship: 'Grandfather',
    phoneNumber: '+1234567892',
    email: 'robert.johnson@email.com',
    address: '456 Oak Ave, City, State 12345',
    isEmergencyContact: true,
    isPrimaryContact: false,
    canPickupStudent: false,
    isVerified: false,
    lastUpdated: new Date('2024-01-10'),
    notes: 'Retired, call if parents unavailable'
  },
  {
    id: 4,
    name: 'Sarah Wilson',
    relationship: 'Family Friend',
    phoneNumber: '+1234567893',
    email: 'sarah.wilson@email.com',
    address: '789 Pine St, City, State 12345',
    isEmergencyContact: false,
    isPrimaryContact: false,
    canPickupStudent: true,
    isVerified: true,
    lastUpdated: new Date('2024-01-12'),
    notes: 'Neighbor, can help with pickup in emergencies'
  },
];

const relationshipOptions = [
  'Father',
  'Mother',
  'Grandfather',
  'Grandmother',
  'Uncle',
  'Aunt',
  'Sibling',
  'Guardian',
  'Family Friend',
  'Babysitter',
  'Other'
];

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`contacts-tabpanel-${index}`}
      aria-labelledby={`contacts-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function EmergencyContacts() {
  const [tabValue, setTabValue] = useState(0);
  const [contacts, setContacts] = useState(mockContacts);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRelationship, setFilterRelationship] = useState('');
  const [verificationDialog, setVerificationDialog] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuContact, setMenuContact] = useState(null);

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(contactSchema),
    defaultValues: {
      name: '',
      relationship: '',
      phoneNumber: '',
      email: '',
      address: '',
      isEmergencyContact: false,
      isPrimaryContact: false,
      canPickupStudent: false,
      notes: '',
    }
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAddContact = () => {
    setEditingContact(null);
    reset({
      name: '',
      relationship: '',
      phoneNumber: '',
      email: '',
      address: '',
      isEmergencyContact: false,
      isPrimaryContact: false,
      canPickupStudent: false,
      notes: '',
    });
    setOpenDialog(true);
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    reset({
      name: contact.name,
      relationship: contact.relationship,
      phoneNumber: contact.phoneNumber,
      email: contact.email || '',
      address: contact.address || '',
      isEmergencyContact: contact.isEmergencyContact,
      isPrimaryContact: contact.isPrimaryContact,
      canPickupStudent: contact.canPickupStudent,
      notes: contact.notes || '',
    });
    setOpenDialog(true);
  };

  const handleDeleteContact = (contactId) => {
    setContacts(contacts.filter(contact => contact.id !== contactId));
  };

  const handleMenuClick = (event, contact) => {
    setMenuAnchor(event.currentTarget);
    setMenuContact(contact);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setMenuContact(null);
  };

  const onSubmit = (data) => {
    if (editingContact) {
      setContacts(contacts.map(contact => 
        contact.id === editingContact.id 
          ? { ...contact, ...data, lastUpdated: new Date() }
          : contact
      ));
    } else {
      const newContact = {
        id: Date.now(),
        ...data,
        isVerified: false,
        lastUpdated: new Date(),
      };
      setContacts([...contacts, newContact]);
    }
    setOpenDialog(false);
    reset();
  };

  const handleVerifyContact = (contact) => {
    setSelectedContact(contact);
    setVerificationDialog(true);
  };

  const confirmVerification = () => {
    setContacts(contacts.map(contact => 
      contact.id === selectedContact.id 
        ? { ...contact, isVerified: true }
        : contact
    ));
    setVerificationDialog(false);
    setSelectedContact(null);
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.relationship.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRelationship = !filterRelationship || contact.relationship === filterRelationship;
    return matchesSearch && matchesRelationship;
  });

  const emergencyContacts = filteredContacts.filter(contact => contact.isEmergencyContact);
  const allContacts = filteredContacts;
  const unverifiedContacts = filteredContacts.filter(contact => !contact.isVerified);

  const ContactCard = ({ contact, showActions = true }) => (
    <Card className="mb-4">
      <CardContent>
        <Box className="flex justify-between items-start mb-3">
          <Box className="flex items-center gap-3">
            <Avatar className="bg-blue-100 text-blue-600">
              <PersonIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" className="flex items-center gap-2">
                {contact.name}
                {contact.isPrimaryContact && (
                  <Chip label="Primary" size="small" color="primary" />
                )}
                {contact.isVerified ? (
                  <CheckCircleIcon className="text-green-500" fontSize="small" />
                ) : (
                  <WarningIcon className="text-orange-500" fontSize="small" />
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {contact.relationship}
              </Typography>
            </Box>
          </Box>
          {showActions && (
            <IconButton onClick={(e) => handleMenuClick(e, contact)}>
              <MoreVertIcon />
            </IconButton>
          )}
        </Box>

        <Grid container spacing={2} className="mb-3">
          <Grid item xs={12} sm={6}>
            <Box className="flex items-center gap-2 mb-2">
              <PhoneIcon className="text-gray-500" fontSize="small" />
              <Typography variant="body2">{contact.phoneNumber}</Typography>
            </Box>
            {contact.email && (
              <Box className="flex items-center gap-2">
                <EmailIcon className="text-gray-500" fontSize="small" />
                <Typography variant="body2">{contact.email}</Typography>
              </Box>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            {contact.address && (
              <Box className="flex items-center gap-2">
                <HomeIcon className="text-gray-500" fontSize="small" />
                <Typography variant="body2" className="text-right">
                  {contact.address}
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>

        <Box className="flex flex-wrap gap-1 mb-2">
          {contact.isEmergencyContact && (
            <Chip label="Emergency Contact" size="small" color="error" variant="outlined" />
          )}
          {contact.canPickupStudent && (
            <Chip label="Can Pickup" size="small" color="success" variant="outlined" />
          )}
        </Box>

        {contact.notes && (
          <Typography variant="body2" color="text.secondary" className="mt-2">
            <InfoIcon fontSize="small" className="mr-1" />
            {contact.notes}
          </Typography>
        )}

        <Typography variant="caption" color="text.secondary" className="block mt-2">
          Last updated: {format(contact.lastUpdated, 'MMM dd, yyyy')}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box className="p-6">
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h4" className="font-bold text-gray-800">
          Emergency Contacts
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddContact}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Add Contact
        </Button>
      </Box>

      <Paper className="mb-6">
        <Tabs value={tabValue} onChange={handleTabChange} className="border-b">
          <Tab label="Emergency Contacts" />
          <Tab label="All Contacts" />
          <Tab label="Verification Required" />
          <Tab label="Contact Settings" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box className="mb-4">
            <Alert severity="info" className="mb-4">
              <Typography variant="body2">
                Emergency contacts will be notified in case of medical emergencies or urgent situations.
                At least one emergency contact must be verified and available 24/7.
              </Typography>
            </Alert>

            {emergencyContacts.length === 0 ? (
              <Paper className="p-8 text-center">
                <WarningIcon className="text-orange-500 mb-2" style={{ fontSize: 48 }} />
                <Typography variant="h6" className="mb-2">
                  No Emergency Contacts
                </Typography>
                <Typography variant="body2" color="text.secondary" className="mb-4">
                  You must add at least one emergency contact for your child's safety.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddContact}
                >
                  Add Emergency Contact
                </Button>
              </Paper>
            ) : (
              emergencyContacts.map((contact) => (
                <ContactCard key={contact.id} contact={contact} />
              ))
            )}
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box className="mb-4">
            <Grid container spacing={2} className="mb-4">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Search contacts"
                  variant="outlined"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Filter by relationship</InputLabel>
                  <Select
                    value={filterRelationship}
                    onChange={(e) => setFilterRelationship(e.target.value)}
                    label="Filter by relationship"
                  >
                    <MenuItem value="">All Relationships</MenuItem>
                    {relationshipOptions.map((relationship) => (
                      <MenuItem key={relationship} value={relationship}>
                        {relationship}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {allContacts.map((contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box className="mb-4">
            <Alert severity="warning" className="mb-4">
              <Typography variant="body2">
                The following contacts require verification. Please ensure their contact information
                is accurate and they are aware of their role as emergency contacts.
              </Typography>
            </Alert>

            {unverifiedContacts.length === 0 ? (
              <Paper className="p-8 text-center">
                <CheckCircleIcon className="text-green-500 mb-2" style={{ fontSize: 48 }} />
                <Typography variant="h6" className="mb-2">
                  All Contacts Verified
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  All your emergency contacts have been verified and are up to date.
                </Typography>
              </Paper>
            ) : (
              unverifiedContacts.map((contact) => (
                <Card key={contact.id} className="mb-4">
                  <CardContent>
                    <ContactCard contact={contact} showActions={false} />
                    <Box className="flex gap-2 mt-3">
                      <Button
                        variant="contained"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleVerifyContact(contact)}
                        color="success"
                      >
                        Verify Contact
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => handleEditContact(contact)}
                      >
                        Edit Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper className="p-4">
                <Typography variant="h6" className="mb-3">
                  Notification Preferences
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Emergency Notifications"
                      secondary="Receive immediate notifications for medical emergencies"
                    />
                    <ListItemSecondaryAction>
                      <Switch defaultChecked />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Pickup Notifications"
                      secondary="Notify when someone picks up your child"
                    />
                    <ListItemSecondaryAction>
                      <Switch defaultChecked />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Contact Updates"
                      secondary="Notify when contact information is updated"
                    />
                    <ListItemSecondaryAction>
                      <Switch defaultChecked />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper className="p-4">
                <Typography variant="h6" className="mb-3">
                  Emergency Protocol
                </Typography>
                <Typography variant="body2" color="text.secondary" className="mb-3">
                  Emergency contacts will be called in the following order:
                </Typography>
                <List>
                  {emergencyContacts
                    .sort((a, b) => (b.isPrimaryContact ? 1 : 0) - (a.isPrimaryContact ? 1 : 0))
                    .map((contact, index) => (
                      <ListItem key={contact.id} divider>
                        <ListItemAvatar>
                          <Avatar className="bg-blue-100 text-blue-600">
                            {index + 1}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={contact.name}
                          secondary={`${contact.relationship} - ${contact.phoneNumber}`}
                        />
                      </ListItem>
                    ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      {/* Add/Edit Contact Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingContact ? 'Edit Contact' : 'Add New Contact'}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Full Name"
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="relationship"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.relationship}>
                      <InputLabel>Relationship</InputLabel>
                      <Select {...field} label="Relationship">
                        {relationshipOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Phone Number"
                      error={!!errors.phoneNumber}
                      helperText={errors.phoneNumber?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Email Address"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Address"
                      multiline
                      rows={2}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Box className="space-y-2">
                  <Controller
                    name="isEmergencyContact"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Switch {...field} checked={field.value} />}
                        label="Emergency Contact"
                      />
                    )}
                  />
                  <Controller
                    name="isPrimaryContact"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Switch {...field} checked={field.value} />}
                        label="Primary Contact"
                      />
                    )}
                  />
                  <Controller
                    name="canPickupStudent"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Switch {...field} checked={field.value} />}
                        label="Authorized for Student Pickup"
                      />
                    )}
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Notes"
                      multiline
                      rows={3}
                      placeholder="Any additional information about this contact..."
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingContact ? 'Update Contact' : 'Add Contact'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Verification Dialog */}
      <Dialog open={verificationDialog} onClose={() => setVerificationDialog(false)}>
        <DialogTitle>Verify Contact</DialogTitle>
        <DialogContent>
          <Typography variant="body1" className="mb-4">
            Are you sure you want to verify this contact? Please ensure:
          </Typography>
          <Box component="ul" className="list-disc list-inside space-y-2 mb-4">
            <li>The contact information is accurate and up to date</li>
            <li>The person has agreed to be an emergency contact</li>
            <li>They understand their responsibilities</li>
            <li>You have confirmed their availability</li>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Contact: {selectedContact?.name} ({selectedContact?.relationship})
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVerificationDialog(false)}>Cancel</Button>
          <Button onClick={confirmVerification} variant="contained" color="success">
            Verify Contact
          </Button>
        </DialogActions>
      </Dialog>

      {/* Contact Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          handleEditContact(menuContact);
          handleMenuClose();
        }}>
          <EditIcon className="mr-2" fontSize="small" />
          Edit Contact
        </MenuItem>
        <MenuItem onClick={() => {
          handleVerifyContact(menuContact);
          handleMenuClose();
        }}>
          <CheckCircleIcon className="mr-2" fontSize="small" />
          Verify Contact
        </MenuItem>
        <MenuItem onClick={() => {
          handleDeleteContact(menuContact.id);
          handleMenuClose();
        }}>
          <DeleteIcon className="mr-2" fontSize="small" />
          Delete Contact
        </MenuItem>
      </Menu>
    </Box>
  );
}
