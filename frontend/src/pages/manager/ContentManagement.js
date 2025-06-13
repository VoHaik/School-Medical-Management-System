import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Paper,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Switch,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  Article as ArticleIcon,
  Announcement as AnnouncementIcon,
  LocalHospital as MedicalIcon,
  School as SchoolIcon,
  Search as SearchIcon,
  Schedule as ScheduleIcon,
  Public as PublicIcon,
  LockOutlined as PrivateIcon,
  Save as SaveIcon,
  CheckCircle as CheckCircleIcon,
  Favorite as HealthIcon
} from '@mui/icons-material';
import { DataTable, ConfirmationModal, FormModal } from '../../components/shared';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import PageHeader from '../../components/PageHeader';

// Form validation schemas
const contentSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  content: yup.string().required('Content is required'),
  contentType: yup.string().required('Content type is required'),
  status: yup.string().required('Status is required'),
  publishDate: yup.date().nullable(),
  author: yup.string().required('Author is required'),
  tags: yup.string(),
  isPublic: yup.boolean().default(true)
});

const ContentManagement = () => {
  // State management
  const [contentPages, setContentPages] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    contentType: '',
    status: '',
  });
  const [contentDialog, setContentDialog] = useState({
    open: false,
    mode: 'add',
    data: null
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    id: null
  });
  const [previewDialog, setPreviewDialog] = useState({
    open: false,
    data: null
  });

  // Setup form
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(contentSchema),
    defaultValues: {
      title: '',
      content: '',
      contentType: '',
      status: 'draft',
      publishDate: null,
      author: '',
      tags: '',
      isPublic: true
    }
  });

  // Sample mock data - replace with API calls in production
  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      const mockContent = [
        {
          id: 1,
          title: 'School Health Introduction',
          content: 'Our school health program focuses on preventative care and early intervention...',
          contentType: 'introduction',
          status: 'published',
          publishDate: '2025-05-15',
          author: 'Admin User',
          tags: 'health,introduction,school',
          isPublic: true,
          lastUpdated: '2025-05-14',
          section: 'introduction'
        },
        {
          id: 2,
          title: 'COVID-19 Protocols',
          content: 'Due to the ongoing pandemic, we have implemented the following safety measures...',
          contentType: 'health-information',
          status: 'published',
          publishDate: '2025-05-20',
          author: 'Medical Director',
          tags: 'covid,protocols,safety',
          isPublic: true,
          lastUpdated: '2025-05-19',
          section: 'health-information'
        },
        {
          id: 3,
          title: 'Upcoming Vaccination Drive',
          content: 'We are pleased to announce our annual vaccination drive scheduled for next month...',
          contentType: 'news',
          status: 'published',
          publishDate: '2025-06-01',
          author: 'School Nurse',
          tags: 'vaccination,event,news',
          isPublic: true,
          lastUpdated: '2025-05-30',
          section: 'news'
        },
        {
          id: 4,
          title: 'Health Tips for Students',
          content: 'Here are some important health tips for students during the academic year...',
          contentType: 'blog',
          status: 'draft',
          publishDate: null,
          author: 'Wellness Coach',
          tags: 'tips,health,students',
          isPublic: true,
          lastUpdated: '2025-06-04',
          section: 'blog'
        }
      ];

      setContentPages(mockContent);
      setFilteredContent(mockContent);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter content based on search and filters
  useEffect(() => {
    let result = [...contentPages];

    // Apply search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(item =>
        item.title.toLowerCase().includes(searchLower) ||
        item.content.toLowerCase().includes(searchLower) ||
        item.author.toLowerCase().includes(searchLower)
      );
    }

    // Apply tab filters
    switch (tabValue) {
      case 0: // All content
        break;
      case 1: // Published
        result = result.filter(item => item.status === 'published');
        break;
      case 2: // Draft
        result = result.filter(item => item.status === 'draft');
        break;
      case 3: // Introduction pages
        result = result.filter(item => item.section === 'introduction');
        break;
      case 4: // Health Information
        result = result.filter(item => item.section === 'health-information');
        break;
      default:
        break;
    }

    // Apply additional filters
    if (filters.contentType) {
      result = result.filter(item => item.contentType === filters.contentType);
    }
    if (filters.status) {
      result = result.filter(item => item.status === filters.status);
    }

    setFilteredContent(result);
  }, [contentPages, search, tabValue, filters]);

  // Event handlers
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOpenContentDialog = (mode, data = null) => {
    setContentDialog({
      open: true,
      mode,
      data
    });

    if (mode === 'edit' && data) {
      reset({
        title: data.title,
        content: data.content,
        contentType: data.contentType,
        status: data.status,
        publishDate: data.publishDate ? data.publishDate : null,
        author: data.author,
        tags: data.tags,
        isPublic: data.isPublic
      });
    } else {
      reset({
        title: '',
        content: '',
        contentType: '',
        status: 'draft',
        publishDate: null,
        author: '',
        tags: '',
        isPublic: true
      });
    }
  };

  const handleCloseContentDialog = () => {
    setContentDialog({
      open: false,
      mode: 'add',
      data: null
    });
  };

  const handleOpenDeleteDialog = (id) => {
    setDeleteDialog({
      open: true,
      id
    });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({
      open: false,
      id: null
    });
  };

  const handleOpenPreviewDialog = (data) => {
    setPreviewDialog({
      open: true,
      data
    });
  };

  const handleClosePreviewDialog = () => {
    setPreviewDialog({
      open: false,
      data: null
    });
  };

  const handleSaveContent = (data) => {
    // In a real app, you'd make an API call here
    if (contentDialog.mode === 'add') {
      // Add new content
      const newContent = {
        id: Date.now(), // Mock ID generation
        ...data,
        lastUpdated: new Date().toISOString().split('T')[0],
        section: data.contentType // For simplicity, using contentType as section
      };
      
      setContentPages(prev => [...prev, newContent]);
    } else {
      // Update existing content
      setContentPages(prev => prev.map(item => 
        item.id === contentDialog.data.id 
          ? { 
              ...item, 
              ...data,
              lastUpdated: new Date().toISOString().split('T')[0]
            } 
          : item
      ));
    }
    
    handleCloseContentDialog();
  };

  const handleDeleteContent = () => {
    // In a real app, you'd make an API call here
    setContentPages(prev => prev.filter(item => item.id !== deleteDialog.id));
    handleCloseDeleteDialog();
  };

  // Helper functions
  const getStatusChip = (status) => {
    const statusColors = {
      published: 'success',
      draft: 'default',
      archived: 'warning'
    };
    
    return (
      <Chip 
        label={status.charAt(0).toUpperCase() + status.slice(1)} 
        color={statusColors[status] || 'default'} 
        size="small" 
      />
    );
  };

  const getContentTypeChip = (type) => {
    const typeColors = {
      introduction: 'primary',
      'health-information': 'info',
      news: 'warning',
      blog: 'secondary'
    };
    
    return (
      <Chip 
        label={type.charAt(0).toUpperCase() + type.slice(1)} 
        color={typeColors[type] || 'default'} 
        size="small" 
      />
    );
  };

  const getContentTypeIcon = (type) => {
    switch (type) {
      case 'introduction': return <HomeIcon />;
      case 'health-information': return <MedicalIcon />;
      case 'news': return <AnnouncementIcon />;
      case 'blog': return <ArticleIcon />;
      default: return <InfoIcon />;
    }
  };

  // Table columns configuration
  const columns = [
    {
      field: 'title',
      headerName: 'Title',
      flex: 2,
    },
    {
      field: 'contentType',
      headerName: 'Type',
      flex: 1,
      renderCell: (row) => getContentTypeChip(row.contentType),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (row) => getStatusChip(row.status),
    },
    {
      field: 'author',
      headerName: 'Author',
      flex: 1,
    },
    {
      field: 'lastUpdated',
      headerName: 'Last Updated',
      flex: 1,
    },
    {
      field: 'isPublic',
      headerName: 'Visibility',
      flex: 1,
      renderCell: (row) => (
        <Chip
          icon={row.isPublic ? <PublicIcon /> : <PrivateIcon />}
          label={row.isPublic ? 'Public' : 'Private'}
          size="small"
          color={row.isPublic ? 'default' : 'secondary'}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (row) => (
        <Box>
          <Tooltip title="Preview">
            <IconButton size="small" onClick={() => handleOpenPreviewDialog(row)}>
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => handleOpenContentDialog('edit', row)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => handleOpenDeleteDialog(row.id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="p-6">
      <PageHeader
        title="Content Management"
        subtitle="Manage website content, health information, blogs and announcements"
        icon={<ArticleIcon />}
      />

      {/* Controls */}
      <Box className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Box className="flex items-center gap-2">
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenContentDialog('add')}
          >
            New Content
          </Button>
        </Box>
        
        <Box className="flex items-center gap-2 w-full sm:w-auto">
          <TextField
            placeholder="Search content..."
            variant="outlined"
            size="small"
            value={search}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <SearchIcon fontSize="small" className="mr-2 text-gray-400" />,
            }}
            fullWidth
            className="sm:max-w-xs"
          />
        </Box>
      </Box>

      {/* Tabs */}
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        className="mb-4"
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label={`All Content (${contentPages.length})`} />
        <Tab label={`Published (${contentPages.filter(c => c.status === 'published').length})`} />
        <Tab label={`Draft (${contentPages.filter(c => c.status === 'draft').length})`} />
        <Tab label="School Introduction" />
        <Tab label="Health Information" />
      </Tabs>

      {/* Content Table */}
      <Card>
        <CardContent>
          {filteredContent.length > 0 ? (
            <DataTable
              columns={columns}
              data={filteredContent}
              getRowId={(row) => row.id}
              pageSize={10}
            />
          ) : (
            <Box className="text-center py-8">
              <Typography variant="body1" color="textSecondary">
                No content found.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Content Form Dialog */}
      <Dialog
        open={contentDialog.open}
        onClose={handleCloseContentDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {contentDialog.mode === 'add' ? 'Create New Content' : 'Edit Content'}
        </DialogTitle>
        <form onSubmit={handleSubmit(handleSaveContent)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Title"
                      fullWidth
                      required
                      error={!!errors.title}
                      helperText={errors.title?.message}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Controller
                  name="contentType"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.contentType} required>
                      <InputLabel>Content Type</InputLabel>
                      <Select {...field}>
                        <MenuItem value="">Select Type</MenuItem>
                        <MenuItem value="introduction">Introduction</MenuItem>
                        <MenuItem value="health-information">Health Information</MenuItem>
                        <MenuItem value="news">News</MenuItem>
                        <MenuItem value="blog">Blog</MenuItem>
                      </Select>
                      {errors.contentType && (
                        <Typography variant="caption" color="error">
                          {errors.contentType.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.status} required>
                      <InputLabel>Status</InputLabel>
                      <Select {...field}>
                        <MenuItem value="draft">Draft</MenuItem>
                        <MenuItem value="published">Published</MenuItem>
                        <MenuItem value="archived">Archived</MenuItem>
                      </Select>
                      {errors.status && (
                        <Typography variant="caption" color="error">
                          {errors.status.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Controller
                  name="author"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Author"
                      fullWidth
                      required
                      error={!!errors.author}
                      helperText={errors.author?.message}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Controller
                  name="publishDate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Publish Date"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.publishDate}
                      helperText={errors.publishDate?.message}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Tags (comma-separated)"
                      fullWidth
                      error={!!errors.tags}
                      helperText={errors.tags?.message || "E.g., health,school,covid"}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Controller
                  name="content"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Content"
                      fullWidth
                      multiline
                      rows={8}
                      required
                      error={!!errors.content}
                      helperText={errors.content?.message}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Controller
                  name="isPublic"
                  control={control}
                  render={({ field }) => (
                    <FormControl component="fieldset">
                      <Switch
                        {...field}
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                      <Typography variant="body2" component="span" className="ml-2">
                        Make this content public
                      </Typography>
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseContentDialog}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {contentDialog.mode === 'add' ? 'Create' : 'Update'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog
        open={previewDialog.open}
        onClose={handleClosePreviewDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">{previewDialog.data?.title}</Typography>
            {getContentTypeChip(previewDialog.data?.contentType || '')}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box className="mb-4">
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Author:</strong> {previewDialog.data?.author}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Last Updated:</strong> {previewDialog.data?.lastUpdated}
            </Typography>
            {previewDialog.data?.publishDate && (
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <strong>Publish Date:</strong> {previewDialog.data?.publishDate}
              </Typography>
            )}
            <Box className="mt-2">
              {previewDialog.data?.tags?.split(',').map((tag, index) => (
                <Chip
                  key={index}
                  label={tag.trim()}
                  size="small"
                  className="mr-1 mb-1"
                />
              ))}
            </Box>
          </Box>
          
          <Divider className="my-4" />
          
          <Typography variant="body1">
            {previewDialog.data?.content}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreviewDialog}>Close</Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<EditIcon />}
            onClick={() => {
              handleClosePreviewDialog();
              handleOpenContentDialog('edit', previewDialog.data);
            }}
          >
            Edit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmationModal
        open={deleteDialog.open}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteContent}
        title="Delete Content"
        message="Are you sure you want to delete this content? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="error"
      />
    </Box>
  );
};

export default ContentManagement;
