import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAlert } from '../hooks/useAlert'; // Import useAlert hook
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  Divider,
  IconButton,
  Paper,
  Alert,
  Skeleton,
  useTheme
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  LocalHospital as HealthIcon,
  Psychology as MentalHealthIcon,
  FitnessCenter as FitnessIcon,
  Restaurant as NutritionIcon,
  Security as SafetyIcon,
  Vaccines as PreventionIcon,
  Comment as CommentIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { getBlogPostById } from '../services/api';

const BlogPostDetail = () => {
  const { successAlert } = useAlert(); // Initialize useAlert hook
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme(); // Access theme
  const [blogPost, setBlogPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewCount, setViewCount] = useState(Math.floor(Math.random() * 100) + 50); // Mock view count

  useEffect(() => {
    fetchBlogPost();
  }, [id]);

  const fetchBlogPost = async () => {
    try {
      setLoading(true);
      const response = await getBlogPostById(id);
      setBlogPost(response);
    } catch (err) {
      console.error('Error fetching blog post:', err);
      setError('Failed to load blog post. Please try again later.');
      // Fallback to mock data if API fails
      setBlogPost(getMockBlogPost(id));
    } finally {
      setLoading(false);
    }
  };

  const getMockBlogPost = (postId) => ({
    id: parseInt(postId),
    title: "Importance of Regular Health Checkups for Students",
    content: `
      <h2>Why Regular Health Checkups Matter</h2>
      <p>Regular health checkups are essential for maintaining student wellness and ensuring early detection of potential health issues. These routine examinations serve as a cornerstone of preventive healthcare in educational settings.</p>

      <h3>Benefits of Regular Health Screenings</h3>
      <ul>
        <li><strong>Early Detection:</strong> Identifying health problems before they become serious</li>
        <li><strong>Preventive Care:</strong> Staying up-to-date with vaccinations and preventive measures</li>
        <li><strong>Growth Monitoring:</strong> Tracking physical and developmental milestones</li>
        <li><strong>Academic Performance:</strong> Ensuring health issues don't interfere with learning</li>
      </ul>

      <h3>What to Expect During a School Health Checkup</h3>
      <p>A comprehensive school health checkup typically includes:</p>
      <ul>
        <li>Vision and hearing screenings</li>
        <li>Height and weight measurements</li>
        <li>Blood pressure checks</li>
        <li>Review of vaccination records</li>
        <li>Assessment of overall physical development</li>
        <li>Discussion of any health concerns</li>
      </ul>

      <h3>How Parents Can Prepare</h3>
      <p>To make the most of your child's health checkup, consider the following preparation steps:</p>
      <ol>
        <li>Gather all relevant medical records and vaccination history</li>
        <li>List any current medications or supplements</li>
        <li>Note any health concerns or symptoms</li>
        <li>Prepare questions about your child's health and development</li>
        <li>Discuss the checkup with your child to reduce anxiety</li>
      </ol>

      <h3>Follow-Up Care</h3>
      <p>After the checkup, it's important to follow through on any recommendations provided by the healthcare provider. This may include scheduling additional appointments, implementing lifestyle changes, or addressing specific health concerns.</p>

      <p>Remember, regular health checkups are an investment in your child's future. By staying proactive about their health, we can ensure they have the best foundation for learning and growing.</p>
    `,
    summary: "Regular health screenings help identify potential health issues early and ensure students stay healthy throughout the academic year.",
    tags: ["Prevention", "Health Checkups", "Student Health"],
    categoryId: 1,
    createdAt: "2024-01-15T10:00:00",
    updatedAt: "2024-01-15T10:00:00",
    authorName: "Dr. Sarah Johnson",
    authorRole: "SCHOOLNURSE",
    authorTitle: "School Health Director"
  });

  const getCategoryIcon = (tags = []) => {
    const tagStr = tags.join(' ').toLowerCase();
    if (tagStr.includes('mental') || tagStr.includes('psychology')) {
      return <MentalHealthIcon sx={{ color: '#7b1fa2', fontSize: 40 }} />;
    } else if (tagStr.includes('fitness') || tagStr.includes('exercise') || tagStr.includes('physical')) {
      return <FitnessIcon sx={{ color: '#2e7d32', fontSize: 40 }} />;
    } else if (tagStr.includes('nutrition') || tagStr.includes('diet') || tagStr.includes('food')) {
      return <NutritionIcon sx={{ color: '#f57c00', fontSize: 40 }} />;
    } else if (tagStr.includes('safety') || tagStr.includes('emergency') || tagStr.includes('allergy')) {
      return <SafetyIcon sx={{ color: '#d32f2f', fontSize: 40 }} />;
    } else if (tagStr.includes('prevention') || tagStr.includes('vaccine') || tagStr.includes('flu')) {
      return <PreventionIcon sx={{ color: '#1976d2', fontSize: 40 }} />;
    } else {
      return <HealthIcon sx={{ color: '#1976d2', fontSize: 40 }} />;
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
    const words = content.replace(/<[^>]*>/g, '').split(' ').length;
    const readingTime = Math.ceil(words / 200);
    return `${readingTime} min read`;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blogPost.title,
        text: blogPost.summary,
        url: window.location.href,
      });
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      successAlert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
        pt: 3, 
        pb: 6 
      }}>
        <Container maxWidth="md">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={{ 
              mb: 3,
              borderRadius: '50px',
              px: 3,
              py: 1,
              color: theme.palette.secondary.main,
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              '&:hover': {
                bgcolor: 'white',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Back to Health Hub
          </Button>

          <Paper 
            elevation={3} 
            sx={{ 
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)'
            }}
          >
            {/* Skeleton for header */}
            <Box 
              sx={{ 
                height: 280, 
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.7) 0%, rgba(29, 78, 216, 0.8) 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 4,
                position: 'relative'
              }}
            >
              <Box sx={{ width: '100%', maxWidth: '600px', textAlign: 'center' }}>
                <Skeleton 
                  variant="circular" 
                  width={80} 
                  height={80} 
                  sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    mx: 'auto',
                    mb: 3
                  }} 
                />
                <Skeleton 
                  variant="text" 
                  sx={{ 
                    fontSize: '2.5rem', 
                    mb: 2,
                    bgcolor: 'rgba(255, 255, 255, 0.2)'
                  }} 
                />
                <Skeleton 
                  variant="text" 
                  width="80%" 
                  sx={{ 
                    mx: 'auto',
                    bgcolor: 'rgba(255, 255, 255, 0.2)'
                  }} 
                />
              </Box>
            </Box>

            <Box sx={{ p: 4 }}>
              {/* Skeleton for tags */}
              <Box sx={{ display: 'flex', mb: 3 }}>
                {[1, 2, 3].map((i) => (
                  <Skeleton 
                    key={i}
                    variant="rounded" 
                    width={80} 
                    height={32} 
                    sx={{ mr: 1, borderRadius: '16px' }} 
                  />
                ))}
              </Box>

              {/* Skeleton for summary */}
              <Skeleton 
                variant="rounded" 
                height={100} 
                sx={{ mb: 3, borderRadius: '16px' }} 
              />

              {/* Skeleton for author info */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  p: 2,
                  bgcolor: 'rgba(0,0,0,0.02)',
                  borderRadius: '16px'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Skeleton variant="circular" width={56} height={56} sx={{ mr: 2 }} />
                  <Box>
                    <Skeleton variant="text" width={120} />
                    <Skeleton variant="text" width={80} />
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Skeleton variant="text" width={100} />
                  <Skeleton variant="text" width={120} />
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Skeleton for content */}
          <Paper 
            elevation={2} 
            sx={{ 
              p: { xs: 3, md: 5 },
              borderRadius: '24px',
              mt: 4,
              mb: 4
            }}
          >
            <Skeleton variant="text" sx={{ fontSize: '1.75rem', mb: 3 }} />
            <Skeleton variant="text" />
            <Skeleton variant="text" />
            <Skeleton variant="text" />
            <Skeleton variant="text" width="80%" />

            <Skeleton variant="text" sx={{ fontSize: '1.5rem', mt: 4, mb: 2 }} />
            <Skeleton variant="text" />
            <Skeleton variant="text" />
            <Skeleton variant="text" width="90%" />

            <Skeleton variant="rectangular" height={200} sx={{ my: 4, borderRadius: '12px' }} />

            <Skeleton variant="text" />
            <Skeleton variant="text" />
            <Skeleton variant="text" width="95%" />
          </Paper>
        </Container>
      </Box>
    );
  }

  if (error && !blogPost) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
        pt: 3, 
        pb: 6 
      }}>
        <Container maxWidth="md">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={{ 
              mb: 3,
              borderRadius: '50px',
              px: 3,
              py: 1,
              color: theme.palette.secondary.main,
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              '&:hover': {
                bgcolor: 'white',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Back to Health Hub
          </Button>

          <Paper 
            elevation={3} 
            sx={{ 
              p: 5,
              borderRadius: '24px',
              textAlign: 'center',
              maxWidth: '600px',
              mx: 'auto',
              boxShadow: '0 10px 30px rgba(239, 68, 68, 0.1)'
            }}
          >
            <Box 
              sx={{ 
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: 'rgba(239, 68, 68, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3
              }}
            >
              <Typography 
                sx={{ 
                  fontSize: '2.5rem', 
                  color: theme.palette.error.main 
                }}
              >
                !
              </Typography>
            </Box>

            <Typography variant="h4" sx={{ mb: 2, color: theme.palette.error.main, fontWeight: 600 }}>
              Oops! Something went wrong
            </Typography>

            <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
              {error}
            </Typography>

            <Button 
              variant="contained" 
              onClick={fetchBlogPost}
              sx={{ 
                borderRadius: '50px',
                px: 4,
                py: 1.5,
                fontWeight: 600,
                background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
                boxShadow: `0 8px 20px ${theme.palette.error.main}40`,
                '&:hover': {
                  boxShadow: `0 10px 25px ${theme.palette.error.main}60`,
                  transform: 'translateY(-3px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Try Again
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  if (!blogPost) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
        pt: 3, 
        pb: 6 
      }}>
        <Container maxWidth="md">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={{ 
              mb: 3,
              borderRadius: '50px',
              px: 3,
              py: 1,
              color: theme.palette.secondary.main,
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              '&:hover': {
                bgcolor: 'white',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Back to Health Hub
          </Button>

          <Paper 
            elevation={3} 
            sx={{ 
              p: 5,
              borderRadius: '24px',
              textAlign: 'center',
              maxWidth: '600px',
              mx: 'auto',
              boxShadow: '0 10px 30px rgba(14, 165, 233, 0.1)'
            }}
          >
            <Box 
              sx={{ 
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: 'rgba(14, 165, 233, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3
              }}
            >
              <Typography 
                sx={{ 
                  fontSize: '2.5rem', 
                  color: theme.palette.info.main 
                }}
              >
                ?
              </Typography>
            </Box>

            <Typography variant="h4" sx={{ mb: 2, color: theme.palette.info.main, fontWeight: 600 }}>
              Article Not Found
            </Typography>

            <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
              The health article you're looking for doesn't exist or may have been removed.
            </Typography>

            <Button 
              variant="contained" 
              onClick={() => navigate('/')}
              sx={{ 
                borderRadius: '50px',
                px: 4,
                py: 1.5,
                fontWeight: 600,
                background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
                boxShadow: `0 8px 20px ${theme.palette.info.main}40`,
                '&:hover': {
                  boxShadow: `0 10px 25px ${theme.palette.info.main}60`,
                  transform: 'translateY(-3px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Browse Articles
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
      pt: 3, 
      pb: 6 
    }}>
      <Container maxWidth="md">
        {/* Navigation */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ 
            mb: 3,
            borderRadius: '50px',
            px: 3,
            py: 1,
            color: theme.palette.secondary.main,
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            '&:hover': {
              bgcolor: 'white',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          Back to Health Hub
        </Button>

        {/* Blog Post Header */}
        <Paper 
          elevation={3} 
          sx={{ 
            mb: 4, 
            overflow: 'hidden', 
            borderRadius: '24px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.15)',
              transform: 'translateY(-5px)'
            }
          }}
        >
          <Box
            sx={{
              height: 280,
              background: `linear-gradient(135deg, ${
                getCategoryColor(blogPost.tags) === 'secondary' ? theme.palette.secondary.main : 
                getCategoryColor(blogPost.tags) === 'success' ? theme.palette.success.main :
                getCategoryColor(blogPost.tags) === 'warning' ? theme.palette.warning.main :
                getCategoryColor(blogPost.tags) === 'error' ? theme.palette.error.main : 
                theme.palette.primary.main
              } 0%, ${
                getCategoryColor(blogPost.tags) === 'secondary' ? theme.palette.secondary.dark : 
                getCategoryColor(blogPost.tags) === 'success' ? theme.palette.success.dark :
                getCategoryColor(blogPost.tags) === 'warning' ? theme.palette.warning.dark :
                getCategoryColor(blogPost.tags) === 'error' ? theme.palette.error.dark : 
                theme.palette.primary.dark
              } 100%)`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              position: 'relative',
              padding: 4,
              overflow: 'hidden'
            }}
          >
            {/* Background pattern */}
            <Box 
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.1,
                background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M30 30m-10 0a10 10 0 1 1 20 0a10 10 0 1 1 -20 0M30 20v20M20 30h20'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                zIndex: 1
              }}
            />

            {/* Category Icon */}
            <Box sx={{ zIndex: 2, mb: 2 }}>
              {getCategoryIcon(blogPost.tags)}
            </Box>

            {/* Title */}
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700, 
                textAlign: 'center', 
                mb: 2,
                zIndex: 2,
                textShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              {blogPost.title}
            </Typography>

            {/* Action buttons */}
            <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 2 }}>
              <IconButton
                sx={{ 
                  color: 'white', 
                  mr: 1, 
                  bgcolor: 'rgba(255,255,255,0.2)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.3)',
                  }
                }}
                onClick={handleShare}
              >
                <ShareIcon />
              </IconButton>
              <IconButton 
                sx={{ 
                  color: 'white',
                  bgcolor: 'rgba(255,255,255,0.2)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.3)',
                  }
                }}
              >
                <BookmarkIcon />
              </IconButton>
            </Box>
          </Box>

          <CardContent sx={{ p: 4 }}>
            {/* Tags */}
            <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap' }}>
              {blogPost.tags?.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  color={getCategoryColor(blogPost.tags)}
                  size="small"
                  sx={{ 
                    mr: 1, 
                    mb: 1, 
                    borderRadius: '50px',
                    fontWeight: 500,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                />
              ))}
            </Box>

            {/* Summary */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                mb: 3, 
                bgcolor: 'rgba(16, 185, 129, 0.05)', 
                border: '1px solid rgba(16, 185, 129, 0.1)',
                borderRadius: '16px'
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'text.secondary', 
                  fontStyle: 'italic',
                  lineHeight: 1.6
                }}
              >
                {blogPost.summary}
              </Typography>
            </Paper>

            {/* Author and metadata */}
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                flexWrap: 'wrap',
                p: 2,
                bgcolor: 'rgba(0,0,0,0.02)',
                borderRadius: '16px'
              }}
            >
              {/* Author info */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: theme.palette.secondary.main,
                    width: 56,
                    height: 56,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  <PersonIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {blogPost.authorName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {blogPost.authorTitle}
                  </Typography>
                </Box>
              </Box>

              {/* Post metadata */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', mt: { xs: 2, sm: 0 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TimeIcon sx={{ fontSize: 16, mr: 0.5, color: theme.palette.text.secondary }} />
                  <Typography variant="body2" sx={{ color: 'text.secondary', mr: 2 }}>
                    {getReadingTime(blogPost.content)}
                  </Typography>

                  <VisibilityIcon sx={{ fontSize: 16, mr: 0.5, color: theme.palette.text.secondary }} />
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {viewCount} views
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Published: {formatDate(blogPost.createdAt)}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Paper>

        {/* Blog Post Content */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: { xs: 3, md: 5 },
            borderRadius: '24px',
            boxShadow: '0 5px 20px rgba(0, 0, 0, 0.05)',
            mb: 4,
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          {/* Decorative element */}
          <Box 
            sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '6px', 
              background: `linear-gradient(90deg, ${
                getCategoryColor(blogPost.tags) === 'secondary' ? theme.palette.secondary.main : 
                getCategoryColor(blogPost.tags) === 'success' ? theme.palette.success.main :
                getCategoryColor(blogPost.tags) === 'warning' ? theme.palette.warning.main :
                getCategoryColor(blogPost.tags) === 'error' ? theme.palette.error.main : 
                theme.palette.primary.main
              } 0%, ${
                getCategoryColor(blogPost.tags) === 'secondary' ? theme.palette.secondary.light : 
                getCategoryColor(blogPost.tags) === 'success' ? theme.palette.success.light :
                getCategoryColor(blogPost.tags) === 'warning' ? theme.palette.warning.light :
                getCategoryColor(blogPost.tags) === 'error' ? theme.palette.error.light : 
                theme.palette.primary.light
              } 100%)` 
            }}
          />

          <Typography
            variant="body1"
            sx={{
              fontSize: '1.05rem',
              lineHeight: 1.8,
              color: theme.palette.text.primary,
              '& h2': {
                fontSize: '1.75rem',
                fontWeight: 700,
                mt: 5,
                mb: 3,
                color: theme.palette.primary.main,
                position: 'relative',
                pb: 2,
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '60px',
                  height: '4px',
                  borderRadius: '2px',
                  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`
                }
              },
              '& h3': {
                fontSize: '1.35rem',
                fontWeight: 600,
                mt: 4,
                mb: 2,
                color: theme.palette.secondary.main
              },
              '& p': {
                mb: 3,
                textAlign: 'justify'
              },
              '& ul, & ol': {
                pl: 3,
                mb: 3,
                '& li': {
                  mb: 1.5
                }
              },
              '& strong': {
                fontWeight: 600,
                color: theme.palette.secondary.main
              },
              '& a': {
                color: theme.palette.primary.main,
                textDecoration: 'none',
                borderBottom: `2px solid ${theme.palette.primary.light}`,
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: theme.palette.primary.dark,
                  borderBottomColor: theme.palette.primary.main
                }
              },
              '& blockquote': {
                borderLeft: `4px solid ${theme.palette.secondary.light}`,
                pl: 3,
                py: 1,
                my: 3,
                fontStyle: 'italic',
                bgcolor: 'rgba(16, 185, 129, 0.05)',
                borderRadius: '0 8px 8px 0'
              },
              '& img': {
                maxWidth: '100%',
                height: 'auto',
                borderRadius: '12px',
                my: 3,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              },
              '& table': {
                width: '100%',
                borderCollapse: 'collapse',
                my: 3,
                '& th': {
                  bgcolor: 'rgba(16, 185, 129, 0.1)',
                  p: 2,
                  textAlign: 'left',
                  fontWeight: 600
                },
                '& td': {
                  p: 2,
                  borderTop: `1px solid ${theme.palette.divider}`
                }
              }
            }}
            dangerouslySetInnerHTML={{ __html: blogPost.content }}
          />

          {/* Article footer with engagement options */}
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mt: 5,
              pt: 3,
              borderTop: `1px solid ${theme.palette.divider}`,
              flexWrap: 'wrap'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', mr: 2 }}>
                Was this article helpful?
              </Typography>
              <Button 
                size="small" 
                variant="outlined" 
                sx={{ 
                  mr: 1, 
                  borderRadius: '50px',
                  minWidth: 'auto',
                  px: 2
                }}
              >
                👍 Yes
              </Button>
              <Button 
                size="small" 
                variant="outlined" 
                sx={{ 
                  borderRadius: '50px',
                  minWidth: 'auto',
                  px: 2
                }}
              >
                👎 No
              </Button>
            </Box>

            <Button
              startIcon={<CommentIcon />}
              sx={{ 
                mt: { xs: 2, sm: 0 },
                borderRadius: '50px',
                color: theme.palette.secondary.main
              }}
            >
              Leave feedback
            </Button>
          </Box>
        </Paper>

        {/* Call to Action */}
        <Paper
          elevation={3}
          sx={{
            mt: 4,
            p: { xs: 3, md: 5 },
            textAlign: 'center',
            background: `linear-gradient(135deg, ${theme.palette.primary.light}15 0%, ${theme.palette.secondary.light}20 100%)`,
            borderRadius: '24px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)'
          }}
        >
          {/* Background pattern */}
          <Box 
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.4,
              background: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23${
                getCategoryColor(blogPost.tags) === 'secondary' ? '7c3aed' : 
                getCategoryColor(blogPost.tags) === 'success' ? '22c55e' :
                getCategoryColor(blogPost.tags) === 'warning' ? 'f59e0b' :
                getCategoryColor(blogPost.tags) === 'error' ? 'ef4444' : 
                '3b82f6'
              }' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              zIndex: 0
            }}
          />

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                mb: 2,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Found this article helpful?
            </Typography>

            <Typography 
              variant="body1" 
              sx={{ 
                color: 'text.secondary', 
                mb: 4,
                maxWidth: '700px',
                mx: 'auto'
              }}
            >
              Share it with other parents and help spread health awareness in our school community.
              Together we can build a healthier environment for our students.
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="contained"
                onClick={handleShare}
                startIcon={<ShareIcon />}
                sx={{ 
                  borderRadius: '50px',
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  boxShadow: `0 8px 20px ${theme.palette.primary.main}40`,
                  '&:hover': {
                    boxShadow: `0 10px 25px ${theme.palette.primary.main}60`,
                    transform: 'translateY(-3px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Share Article
              </Button>

              <Button
                variant="outlined"
                onClick={() => navigate('/')}
                sx={{ 
                  borderRadius: '50px',
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  borderWidth: '2px',
                  borderColor: theme.palette.secondary.main,
                  color: theme.palette.secondary.main,
                  '&:hover': {
                    borderWidth: '2px',
                    borderColor: theme.palette.secondary.dark,
                    background: 'rgba(16, 185, 129, 0.05)',
                    transform: 'translateY(-3px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Read More Articles
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default BlogPostDetail;
