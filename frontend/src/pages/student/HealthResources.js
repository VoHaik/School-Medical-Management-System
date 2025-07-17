import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Tab,
  Tabs,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  TextField,
  InputAdornment,
  Divider,
  Paper,
  Avatar,
  Badge
} from '@mui/material';
import {
  HealthAndSafety,
  ExpandMore,
  Search,
  Download,
  Bookmark,
  Share,
  LocalHospital,
  Warning,
  Info,
  School,
  FamilyRestroom,
  Psychology,
  Restaurant,
  FitnessCenter,
  Visibility,
  Close
} from '@mui/icons-material';

// Mock data for health resources
const mockHealthResources = {
  categories: [
    {
      id: 'general',
      name: 'General Health',
      icon: <HealthAndSafety />,
      color: 'blue',
      count: 15
    },
    {
      id: 'emergency',
      name: 'Emergency Information',
      icon: <LocalHospital />,
      color: 'red',
      count: 8
    },
    {
      id: 'mental-health',
      name: 'Mental Health',
      icon: <Psychology />,
      color: 'purple',
      count: 12
    },
    {
      id: 'nutrition',
      name: 'Nutrition & Diet',
      icon: <Restaurant />,
      color: 'green',
      count: 10
    },
    {
      id: 'fitness',
      name: 'Physical Fitness',
      icon: <FitnessCenter />,
      color: 'orange',
      count: 9
    },
    {
      id: 'safety',
      name: 'Safety & Prevention',
      icon: <Warning />,
      color: 'yellow',
      count: 7
    }
  ],
  resources: [
    {
      id: 1,
      title: 'Understanding Adolescent Growth and Development',
      category: 'general',
      type: 'article',
      description: 'A comprehensive guide to physical and emotional changes during teenage years.',
      content: 'This article covers the normal patterns of growth and development during adolescence, including physical changes, emotional development, and what to expect during this important period.',
      author: 'Dr. Sarah Johnson, Pediatrician',
      lastUpdated: '2024-01-15',
      readTime: '8 min',
      tags: ['development', 'adolescence', 'growth'],
      featured: true,
      downloads: 245,
      views: 1532
    },
    {
      id: 2,
      title: 'Emergency Contact Information',
      category: 'emergency',
      type: 'quick-reference',
      description: 'Essential emergency numbers and procedures for health emergencies.',
      content: `Emergency Contacts:
      
      School Nurse: (555) 123-4567
      Emergency Services: 911
      Poison Control: 1-800-222-1222
      Mental Health Crisis Line: 988
      
      Basic Emergency Procedures:
      1. Stay calm and assess the situation
      2. Call for help immediately if needed
      3. Provide first aid if trained
      4. Contact parents/guardians
      5. Follow up with school administration`,
      author: 'School Health Department',
      lastUpdated: '2024-02-01',
      readTime: '3 min',
      tags: ['emergency', 'contacts', 'procedures'],
      featured: true,
      downloads: 567,
      views: 2145
    },
    {
      id: 3,
      title: 'Managing Stress and Anxiety in School',
      category: 'mental-health',
      type: 'guide',
      description: 'Practical strategies for dealing with academic and social stress.',
      content: 'Learn effective techniques for managing stress and anxiety, including breathing exercises, time management strategies, and when to seek help from counselors.',
      author: 'School Counseling Team',
      lastUpdated: '2024-01-20',
      readTime: '12 min',
      tags: ['stress', 'anxiety', 'mental-health', 'coping'],
      featured: false,
      downloads: 189,
      views: 987
    },
    {
      id: 4,
      title: 'Healthy Eating for Students',
      category: 'nutrition',
      type: 'guide',
      description: 'Nutrition guidelines and meal planning tips for growing teenagers.',
      content: 'A comprehensive guide to maintaining a balanced diet during the school years, including information about essential nutrients, healthy snacking, and meal planning.',
      author: 'School Nutritionist',
      lastUpdated: '2024-01-10',
      readTime: '10 min',
      tags: ['nutrition', 'diet', 'healthy-eating'],
      featured: false,
      downloads: 156,
      views: 743
    },
    {
      id: 5,
      title: 'Sleep Hygiene for Better Academic Performance',
      category: 'general',
      type: 'tips',
      description: 'The importance of good sleep habits and tips for better rest.',
      content: 'Understanding the connection between quality sleep and academic performance, with practical tips for establishing healthy sleep routines.',
      author: 'Dr. Michael Chen, Sleep Specialist',
      lastUpdated: '2024-01-25',
      readTime: '6 min',
      tags: ['sleep', 'health', 'performance'],
      featured: false,
      downloads: 134,
      views: 656
    },
    {
      id: 6,
      title: 'Physical Activity Guidelines for Teens',
      category: 'fitness',
      type: 'guidelines',
      description: 'Recommended physical activity levels and exercise safety tips.',
      content: 'Guidelines for maintaining physical fitness during teenage years, including recommended activity levels, sports safety, and injury prevention.',
      author: 'Physical Education Department',
      lastUpdated: '2024-01-18',
      readTime: '7 min',
      tags: ['fitness', 'exercise', 'safety'],
      featured: false,
      downloads: 98,
      views: 445
    },
    {
      id: 7,
      title: 'Preventing Common School Injuries',
      category: 'safety',
      type: 'prevention',
      description: 'Tips for staying safe during school activities and sports.',
      content: 'A guide to preventing common injuries that occur in school settings, including sports injuries, playground accidents, and classroom safety.',
      author: 'School Safety Committee',
      lastUpdated: '2024-02-05',
      readTime: '5 min',
      tags: ['safety', 'prevention', 'injuries'],
      featured: false,
      downloads: 87,
      views: 321
    },
    {
      id: 8,
      title: 'Understanding Mental Health Warning Signs',
      category: 'mental-health',
      type: 'awareness',
      description: 'Recognizing signs of mental health concerns in yourself and others.',
      content: 'Learn to identify warning signs of mental health issues and understand when and how to seek help from school counselors or mental health professionals.',
      author: 'School Psychology Team',
      lastUpdated: '2024-01-30',
      readTime: '9 min',
      tags: ['mental-health', 'awareness', 'warning-signs'],
      featured: true,
      downloads: 201,
      views: 1123
    }
  ],
  bookmarks: [1, 2, 8], // IDs of bookmarked resources
  recentlyViewed: [1, 3, 2, 5] // IDs of recently viewed resources
};

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`resources-tabpanel-${index}`}
      aria-labelledby={`resources-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const HealthResources = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResource, setSelectedResource] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [data, setData] = useState(mockHealthResources);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const filteredResources = data.resources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredResources = data.resources.filter(resource => resource.featured);
  const bookmarkedResources = data.resources.filter(resource => data.bookmarks.includes(resource.id));
  const recentlyViewedResources = data.recentlyViewed.map(id => 
    data.resources.find(resource => resource.id === id)
  ).filter(Boolean);

  const handleViewResource = (resource) => {
    setSelectedResource(resource);
    setDetailsOpen(true);
    
    // Add to recently viewed if not already there
    if (!data.recentlyViewed.includes(resource.id)) {
      setData(prev => ({
        ...prev,
        recentlyViewed: [resource.id, ...prev.recentlyViewed.slice(0, 9)]
      }));
    }
  };

  const handleBookmark = (resourceId) => {
    setData(prev => ({
      ...prev,
      bookmarks: prev.bookmarks.includes(resourceId)
        ? prev.bookmarks.filter(id => id !== resourceId)
        : [...prev.bookmarks, resourceId]
    }));
  };

  const handleDownload = (resource) => {
    // Implement download functionality
    };

  const handleShare = (resource) => {
    // Implement share functionality
    };

  const getCategoryInfo = (categoryId) => {
    return data.categories.find(cat => cat.id === categoryId);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'article':
        return <Info />;
      case 'guide':
        return <School />;
      case 'quick-reference':
        return <LocalHospital />;
      case 'tips':
        return <Visibility />;
      default:
        return <Info />;
    }
  };

  return (
    <Box className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <Box className="mb-6">
        <Box className="flex items-center gap-3 mb-4">
          <HealthAndSafety className="text-blue-600" sx={{ fontSize: 32 }} />
          <Typography variant="h4" className="font-bold text-gray-800">
            Health Resources
          </Typography>
        </Box>
        <Typography variant="body1" className="text-gray-600">
          Access comprehensive health information, guides, and resources to support your wellbeing.
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="All Resources" />
          <Tab label="Featured" />
          <Tab label="My Bookmarks" />
          <Tab label="Recently Viewed" />
        </Tabs>
      </Box>

      {/* Search and Filter */}
      <Box className="mb-6">
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search resources..."
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
          <Grid item xs={12} md={6}>
            <Box className="flex gap-2 flex-wrap">
              <Chip
                label="All Categories"
                onClick={() => setSelectedCategory('all')}
                color={selectedCategory === 'all' ? 'primary' : 'default'}
                variant={selectedCategory === 'all' ? 'filled' : 'outlined'}
              />
              {data.categories.map((category) => (
                <Chip
                  key={category.id}
                  label={category.name}
                  onClick={() => setSelectedCategory(category.id)}
                  color={selectedCategory === category.id ? 'primary' : 'default'}
                  variant={selectedCategory === category.id ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Tab Content */}
      <TabPanel value={activeTab} index={0}>
        {/* Categories Overview */}
        <Grid container spacing={3} className="mb-6">
          {data.categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category.id}>
              <Card 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedCategory(category.id)}
              >
                <CardContent className="text-center">
                  <Box className={`text-${category.color}-600 mb-2`}>
                    {React.cloneElement(category.icon, { sx: { fontSize: 40 } })}
                  </Box>
                  <Typography variant="h6" className="font-semibold mb-1">
                    {category.name}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    {category.count} resources
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Resources List */}
        <Grid container spacing={3}>
          {filteredResources.map((resource) => {
            const categoryInfo = getCategoryInfo(resource.category);
            const isBookmarked = data.bookmarks.includes(resource.id);
            
            return (
              <Grid item xs={12} md={6} lg={4} key={resource.id}>
                <Card className="h-full flex flex-col">
                  <CardContent className="flex-1">
                    <Box className="flex justify-between items-start mb-2">
                      <Chip
                        icon={categoryInfo?.icon}
                        label={categoryInfo?.name}
                        size="small"
                        className={`bg-${categoryInfo?.color}-100 text-${categoryInfo?.color}-800`}
                      />
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookmark(resource.id);
                        }}
                        className={isBookmarked ? 'text-yellow-500' : 'text-gray-400'}
                      >
                        <Bookmark />
                      </IconButton>
                    </Box>
                    
                    <Typography variant="h6" className="font-semibold mb-2 line-clamp-2">
                      {resource.title}
                    </Typography>
                    
                    <Typography variant="body2" className="text-gray-600 mb-3 line-clamp-3">
                      {resource.description}
                    </Typography>
                    
                    <Box className="flex items-center gap-2 mb-3">
                      {getTypeIcon(resource.type)}
                      <Typography variant="caption" className="text-gray-500">
                        {resource.type} • {resource.readTime}
                      </Typography>
                    </Box>
                    
                    <Box className="flex flex-wrap gap-1 mb-3">
                      {resource.tags.slice(0, 3).map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          variant="outlined"
                          className="text-xs"
                        />
                      ))}
                    </Box>
                    
                    <Typography variant="caption" className="text-gray-500 block mb-3">
                      By {resource.author} • Updated {new Date(resource.lastUpdated).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                  
                  <Box className="p-3 pt-0">
                    <Box className="flex justify-between items-center">
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleViewResource(resource)}
                        className="flex-1 mr-2"
                      >
                        Read More
                      </Button>
                      <IconButton
                        size="small"
                        onClick={() => handleDownload(resource)}
                        className="text-blue-600"
                      >
                        <Download />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleShare(resource)}
                        className="text-green-600"
                      >
                        <Share />
                      </IconButton>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <Grid container spacing={3}>
          {featuredResources.map((resource) => {
            const categoryInfo = getCategoryInfo(resource.category);
            const isBookmarked = data.bookmarks.includes(resource.id);
            
            return (
              <Grid item xs={12} md={6} key={resource.id}>
                <Card className="h-full">
                  <CardContent>
                    <Box className="flex justify-between items-start mb-3">
                      <Box className="flex items-center gap-2">
                        <Badge badgeContent="Featured" color="error">
                          <Chip
                            icon={categoryInfo?.icon}
                            label={categoryInfo?.name}
                            size="small"
                            className={`bg-${categoryInfo?.color}-100 text-${categoryInfo?.color}-800`}
                          />
                        </Badge>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => handleBookmark(resource.id)}
                        className={isBookmarked ? 'text-yellow-500' : 'text-gray-400'}
                      >
                        <Bookmark />
                      </IconButton>
                    </Box>
                    
                    <Typography variant="h6" className="font-semibold mb-2">
                      {resource.title}
                    </Typography>
                    
                    <Typography variant="body2" className="text-gray-600 mb-3">
                      {resource.description}
                    </Typography>
                    
                    <Box className="flex items-center justify-between mb-3">
                      <Box className="flex items-center gap-1 text-gray-500">
                        <Visibility fontSize="small" />
                        <Typography variant="caption">{resource.views} views</Typography>
                      </Box>
                      <Box className="flex items-center gap-1 text-gray-500">
                        <Download fontSize="small" />
                        <Typography variant="caption">{resource.downloads} downloads</Typography>
                      </Box>
                    </Box>
                    
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => handleViewResource(resource)}
                    >
                      Read Article
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        {bookmarkedResources.length > 0 ? (
          <Grid container spacing={3}>
            {bookmarkedResources.map((resource) => {
              const categoryInfo = getCategoryInfo(resource.category);
              
              return (
                <Grid item xs={12} md={6} key={resource.id}>
                  <Card>
                    <CardContent>
                      <Box className="flex justify-between items-start mb-2">
                        <Chip
                          icon={categoryInfo?.icon}
                          label={categoryInfo?.name}
                          size="small"
                          className={`bg-${categoryInfo?.color}-100 text-${categoryInfo?.color}-800`}
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleBookmark(resource.id)}
                          className="text-yellow-500"
                        >
                          <Bookmark />
                        </IconButton>
                      </Box>
                      
                      <Typography variant="h6" className="font-semibold mb-2">
                        {resource.title}
                      </Typography>
                      
                      <Typography variant="body2" className="text-gray-600 mb-3">
                        {resource.description}
                      </Typography>
                      
                      <Button
                        variant="outlined"
                        onClick={() => handleViewResource(resource)}
                        size="small"
                      >
                        Read More
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Paper className="p-8 text-center">
            <Bookmark className="text-gray-400 mb-4" sx={{ fontSize: 48 }} />
            <Typography variant="h6" className="text-gray-600 mb-2">
              No Bookmarks Yet
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              Bookmark resources to access them quickly later.
            </Typography>
          </Paper>
        )}
      </TabPanel>

      <TabPanel value={activeTab} index={3}>
        {recentlyViewedResources.length > 0 ? (
          <List>
            {recentlyViewedResources.map((resource, index) => {
              const categoryInfo = getCategoryInfo(resource.category);
              
              return (
                <ListItem
                  key={resource.id}
                  className="border rounded-lg mb-2 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleViewResource(resource)}
                >
                  <ListItemIcon>
                    <Avatar className={`bg-${categoryInfo?.color}-100 text-${categoryInfo?.color}-800`}>
                      {categoryInfo?.icon}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={resource.title}
                    secondary={
                      <Box>
                        <Typography variant="body2" className="text-gray-600">
                          {resource.description}
                        </Typography>
                        <Typography variant="caption" className="text-gray-500">
                          {categoryInfo?.name} • {resource.readTime}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        ) : (
          <Paper className="p-8 text-center">
            <Visibility className="text-gray-400 mb-4" sx={{ fontSize: 48 }} />
            <Typography variant="h6" className="text-gray-600 mb-2">
              No Recent Activity
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              Resources you view will appear here for quick access.
            </Typography>
          </Paper>
        )}
      </TabPanel>

      {/* Resource Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box className="flex justify-between items-center">
            <Typography variant="h6">
              {selectedResource?.title}
            </Typography>
            <IconButton onClick={() => setDetailsOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedResource && (
            <Box className="space-y-4">
              <Box className="flex items-center gap-2 mb-4">
                <Chip
                  icon={getCategoryInfo(selectedResource.category)?.icon}
                  label={getCategoryInfo(selectedResource.category)?.name}
                  size="small"
                />
                <Chip
                  icon={getTypeIcon(selectedResource.type)}
                  label={selectedResource.type}
                  size="small"
                  variant="outlined"
                />
                <Typography variant="caption" className="text-gray-500">
                  {selectedResource.readTime}
                </Typography>
              </Box>
              
              <Typography variant="body1" className="text-gray-600 mb-4">
                {selectedResource.description}
              </Typography>
              
              <Divider />
              
              <Typography variant="body1" className="whitespace-pre-wrap">
                {selectedResource.content}
              </Typography>
              
              <Divider />
              
              <Box className="flex flex-wrap gap-1">
                {selectedResource.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
              
              <Typography variant="caption" className="text-gray-500 block">
                By {selectedResource.author} • Last updated {new Date(selectedResource.lastUpdated).toLocaleDateString()}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            startIcon={<Bookmark />}
            onClick={() => handleBookmark(selectedResource?.id)}
            color={data.bookmarks.includes(selectedResource?.id) ? 'warning' : 'primary'}
          >
            {data.bookmarks.includes(selectedResource?.id) ? 'Remove Bookmark' : 'Bookmark'}
          </Button>
          <Button
            startIcon={<Download />}
            onClick={() => handleDownload(selectedResource)}
          >
            Download
          </Button>
          <Button
            startIcon={<Share />}
            onClick={() => handleShare(selectedResource)}
          >
            Share
          </Button>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HealthResources;
