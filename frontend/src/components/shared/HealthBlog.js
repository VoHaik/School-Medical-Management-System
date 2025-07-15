import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Avatar,
  IconButton,
  Skeleton,
  Alert,
  Container,
  Divider,
  Paper
} from '@mui/material';
import {
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Article as ArticleIcon,
  LocalHospital as HealthIcon,
  Psychology as MentalHealthIcon,
  FitnessCenter as FitnessIcon,
  Restaurant as NutritionIcon,
  Security as SafetyIcon,
  Vaccines as PreventionIcon,
  ExpandMore as ExpandMoreIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';
import { getAllBlogPosts } from '../../services/api';

const HealthBlog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayCount, setDisplayCount] = useState(6);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const response = await getAllBlogPosts();
      setBlogPosts(response || []);
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError('Failed to load blog posts. Please try again later.');
      // Fallback to mock data if API fails
      setBlogPosts(getMockBlogPosts());
    } finally {
      setLoading(false);
    }
  };

  const getMockBlogPosts = () => [
    {
      id: 1,
      title: "Importance of Regular Health Checkups for Students",
      summary: "Regular health screenings help identify potential health issues early and ensure students stay healthy throughout the academic year.",
      content: "Regular health checkups are essential for maintaining student wellness...",
      tags: ["Prevention", "Health Checkups", "Student Health"],
      categoryId: 1,
      createdAt: "2024-01-15T10:00:00",
      updatedAt: "2024-01-15T10:00:00",
      authorName: "Dr. Sarah Johnson",
      authorRole: "SCHOOLNURSE",
      authorTitle: "School Health Director"
    },
    {
      id: 2,
      title: "Managing Food Allergies in School Environment",
      summary: "A comprehensive guide for parents and school staff on creating a safe environment for students with food allergies.",
      content: "Food allergies in schools require careful management and coordination...",
      tags: ["Safety", "Allergies", "Emergency Response"],
      categoryId: 2,
      createdAt: "2024-01-10T09:30:00",
      updatedAt: "2024-01-10T09:30:00",
      authorName: "Nurse Lisa Chen",
      authorRole: "SCHOOLNURSE",
      authorTitle: "Senior School Nurse"
    },
    {
      id: 3,
      title: "Mental Health Awareness for Students",
      summary: "Understanding the signs of mental health challenges and providing appropriate support for student wellbeing.",
      content: "Mental health is just as important as physical health for students...",
      tags: ["Mental Health", "Wellbeing", "Support"],
      categoryId: 3,
      createdAt: "2024-01-05T14:15:00",
      updatedAt: "2024-01-05T14:15:00",
      authorName: "Dr. Michael Brown",
      authorRole: "SCHOOLNURSE",
      authorTitle: "Mental Health Coordinator"
    },
    {
      id: 4,
      title: "Seasonal Flu Prevention in Schools",
      summary: "Best practices for preventing flu outbreaks and keeping the school community healthy during flu season.",
      content: "Flu season can significantly impact school attendance and learning...",
      tags: ["Prevention", "Flu", "Vaccination"],
      categoryId: 1,
      createdAt: "2024-01-01T11:00:00",
      updatedAt: "2024-01-01T11:00:00",
      authorName: "Nurse Jennifer Kim",
      authorRole: "SCHOOLNURSE",
      authorTitle: "Infection Control Specialist"
    },
    {
      id: 5,
      title: "Nutrition Guidelines for Growing Students",
      summary: "Essential nutritional requirements and healthy eating habits that support optimal growth and learning.",
      content: "Proper nutrition is fundamental to student development and academic success...",
      tags: ["Nutrition", "Diet", "Growth"],
      categoryId: 4,
      createdAt: "2023-12-28T16:45:00",
      updatedAt: "2023-12-28T16:45:00",
      authorName: "Dr. Amanda Wilson",
      authorRole: "SCHOOLNURSE",
      authorTitle: "Nutritional Health Advisor"
    },
    {
      id: 6,
      title: "Physical Activity and Student Health",
      summary: "The importance of regular physical activity for physical and mental health development in students.",
      content: "Physical activity plays a crucial role in student health and development...",
      tags: ["Fitness", "Physical Health", "Exercise"],
      categoryId: 5,
      createdAt: "2023-12-25T08:20:00",
      updatedAt: "2023-12-25T08:20:00",
      authorName: "Coach Mark Thompson",
      authorRole: "SCHOOLNURSE",
      authorTitle: "Physical Health Coordinator"
    }
  ];

  const getCategoryIcon = (tags = []) => {
    const tagStr = tags.join(' ').toLowerCase();
    if (tagStr.includes('mental') || tagStr.includes('psychology')) {
      return <MentalHealthIcon sx={{ color: '#7b1fa2' }} />;
    } else if (tagStr.includes('fitness') || tagStr.includes('exercise') || tagStr.includes('physical')) {
      return <FitnessIcon sx={{ color: '#2e7d32' }} />;
    } else if (tagStr.includes('nutrition') || tagStr.includes('diet') || tagStr.includes('food')) {
      return <NutritionIcon sx={{ color: '#f57c00' }} />;
    } else if (tagStr.includes('safety') || tagStr.includes('emergency') || tagStr.includes('allergy')) {
      return <SafetyIcon sx={{ color: '#d32f2f' }} />;
    } else if (tagStr.includes('prevention') || tagStr.includes('vaccine') || tagStr.includes('flu')) {
      return <PreventionIcon sx={{ color: '#1976d2' }} />;
    } else {
      return <HealthIcon sx={{ color: '#1976d2' }} />;
    }
  };

  const getCategoryColor = (tags = []) => {
    const tagStr = tags.join(' ').toLowerCase();
    if (tagStr.includes('mental') || tagStr.includes('psychology')) return 'secondary';
    if (tagStr.includes('fitness') || tagStr.includes('exercise')) return 'success';
    if (tagStr.includes('nutrition') || tagStr.includes('diet')) return 'warning';
    if (tagStr.includes('safety') || tagStr.includes('emergency')) return 'error';
    return 'primary';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadingTime = (content = '') => {
    const words = content.split(' ').length;
    const readingTime = Math.ceil(words / 200); // Average reading speed
    return `${readingTime} min read`;
  };

  const handleViewPost = (postId) => {
    // Navigate to blog post detail page
    navigate(`/blog/${postId}`);
  };

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 6);
  };

  const displayedPosts = blogPosts.slice(0, displayCount);

  if (loading) {
    return (
      <Box sx={{ py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
            Health Blog & Resources
          </Typography>
          <Grid container spacing={4}>
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card sx={{ height: '100%' }}>
                  <Skeleton variant="rectangular" height={200} />
                  <CardContent>
                    <Skeleton variant="text" sx={{ fontSize: '1.5rem', mb: 1 }} />
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Skeleton variant="text" width={100} />
                      <Skeleton variant="text" width={80} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    );
  }

  if (error && blogPosts.length === 0) {
    return (
      <Box sx={{ py: 6 }}>
        <Container maxWidth="lg">
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Button variant="contained" onClick={fetchBlogPosts}>
            Retry
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 6, bgcolor: 'grey.50' }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 700, 
              mb: 2, 
              background: 'linear-gradient(45deg, #1976d2, #7b1fa2)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Health Blog & Resources
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 3 }}>
            Expert health advice and resources from our medical professionals
          </Typography>
          <Divider sx={{ maxWidth: 200, mx: 'auto', bgcolor: 'primary.main', height: 3 }} />
        </Box>

        {/* Featured Post Section */}
        {displayedPosts.length > 0 && (
          <Paper elevation={3} sx={{ mb: 6, overflow: 'hidden' }}>
            <Grid container>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    height: { xs: 200, md: 400 },
                    background: 'linear-gradient(135deg, #1976d2 0%, #7b1fa2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}
                >
                  <Box sx={{ textAlign: 'center', p: 3 }}>
                    {getCategoryIcon(displayedPosts[0].tags)}
                    <Typography variant="h4" sx={{ mt: 2, fontWeight: 600 }}>
                      Featured Post
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 4 }}>
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={displayedPosts[0].tags?.[0] || 'Health'}
                      color={getCategoryColor(displayedPosts[0].tags)}
                      size="small"
                      sx={{ mb: 2 }}
                    />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                    {displayedPosts[0].title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, flexGrow: 1 }}>
                    {displayedPosts[0].summary}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                        <PersonIcon sx={{ fontSize: 18 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="caption" sx={{ display: 'block', fontWeight: 500 }}>
                          {displayedPosts[0].authorName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {displayedPosts[0].authorTitle}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      <TimeIcon sx={{ fontSize: 14, mr: 0.5 }} />
                      {getReadingTime(displayedPosts[0].content)}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => handleViewPost(displayedPosts[0].id)}
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    Read Full Article
                  </Button>
                </CardContent>
              </Grid>
            </Grid>
          </Paper>
        )}

        {/* Blog Posts Grid */}
        <Grid container spacing={4}>
          {displayedPosts.slice(1).map((post) => (
            <Grid item xs={12} md={6} lg={4} key={post.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': { 
                    boxShadow: 8,
                    transform: 'translateY(-4px)',
                    transition: 'all 0.3s ease-in-out'
                  },
                  transition: 'all 0.3s ease-in-out',
                  cursor: 'pointer'
                }}
                onClick={() => handleViewPost(post.id)}
              >
                <Box
                  sx={{
                    height: 180,
                    background: `linear-gradient(135deg, ${getCategoryColor(post.tags) === 'secondary' ? '#7b1fa2' : 
                      getCategoryColor(post.tags) === 'success' ? '#2e7d32' :
                      getCategoryColor(post.tags) === 'warning' ? '#f57c00' :
                      getCategoryColor(post.tags) === 'error' ? '#d32f2f' : '#1976d2'} 0%, #1976d2 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    position: 'relative'
                  }}
                >
                  {getCategoryIcon(post.tags)}
                  <IconButton
                    sx={{ 
                      position: 'absolute', 
                      top: 8, 
                      right: 8, 
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle bookmark functionality
                    }}
                  >
                    <BookmarkIcon />
                  </IconButton>
                </Box>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Chip
                      label={post.tags?.[0] || 'Health'}
                      size="small"
                      color={getCategoryColor(post.tags)}
                      variant="outlined"
                    />
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {getReadingTime(post.content)}
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, flexGrow: 1 }}>
                    {post.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, flexGrow: 1 }}>
                    {post.summary}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main', fontSize: 12 }}>
                        {post.authorName?.charAt(0) || 'N'}
                      </Avatar>
                      <Typography variant="caption" sx={{ fontWeight: 500 }}>
                        {post.authorName}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {formatDate(post.createdAt)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Load More Button */}
        {displayCount < blogPosts.length && (
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              variant="outlined"
              size="large"
              onClick={handleLoadMore}
              startIcon={<ExpandMoreIcon />}
            >
              Load More Articles
            </Button>
          </Box>
        )}

        {/* Call to Action for Medical Staff */}
        {currentUser && currentUser.role === 'SCHOOLNURSE' && (
          <Paper
            elevation={2}
            sx={{
              mt: 6,
              p: 4,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)'
            }}
          >
            <ArticleIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
              Share Your Expertise
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
              Help educate the school community by sharing health tips and medical insights.
            </Typography>
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/nurse/blog"
              startIcon={<ArticleIcon />}
            >
              Write New Article
            </Button>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default HealthBlog;
