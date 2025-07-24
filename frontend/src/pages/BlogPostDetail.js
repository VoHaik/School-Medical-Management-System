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
  Skeleton
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
  Vaccines as PreventionIcon
} from '@mui/icons-material';
import { getBlogPostById } from '../services/api';

const BlogPostDetail = () => {
  const { successAlert } = useAlert(); // Initialize useAlert hook
  const { id } = useParams();
  const navigate = useNavigate();
  const [blogPost, setBlogPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 3 }}
        >
          Back to Home
        </Button>
        <Card>
          <Box sx={{ p: 3 }}>
            <Skeleton variant="text" sx={{ fontSize: '2rem', mb: 2 }} />
            <Skeleton variant="text" width="60%" sx={{ mb: 3 }} />
            <Skeleton variant="rectangular" height={300} />
          </Box>
        </Card>
      </Container>
    );
  }

  if (error && !blogPost) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 3 }}
        >
          Back to Home
        </Button>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchBlogPost}>
          Retry
        </Button>
      </Container>
    );
  }

  if (!blogPost) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 3 }}
        >
          Back to Home
        </Button>
        <Alert severity="info">
          Blog post not found.
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Navigation */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 3 }}
        >
          Back to Home
        </Button>

        {/* Blog Post Header */}
        <Paper elevation={2} sx={{ mb: 4, overflow: 'hidden' }}>
          <Box
            sx={{
              height: 200,
              background: `linear-gradient(135deg, ${getCategoryColor(blogPost.tags) === 'secondary' ? '#7b1fa2' : 
                getCategoryColor(blogPost.tags) === 'success' ? '#2e7d32' :
                getCategoryColor(blogPost.tags) === 'warning' ? '#f57c00' :
                getCategoryColor(blogPost.tags) === 'error' ? '#d32f2f' : '#1976d2'} 0%, #1976d2 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              position: 'relative'
            }}
          >
            {getCategoryIcon(blogPost.tags)}
            <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
              <IconButton
                sx={{ color: 'white', mr: 1 }}
                onClick={handleShare}
              >
                <ShareIcon />
              </IconButton>
              <IconButton sx={{ color: 'white' }}>
                <BookmarkIcon />
              </IconButton>
            </Box>
          </Box>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ mb: 3 }}>
              {blogPost.tags?.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  color={getCategoryColor(blogPost.tags)}
                  size="small"
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
              {blogPost.title}
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 3 }}>
              {blogPost.summary}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <PersonIcon />
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
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  <TimeIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                  {getReadingTime(blogPost.content)}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {formatDate(blogPost.createdAt)}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Paper>

        {/* Blog Post Content */}
        <Paper elevation={1} sx={{ p: 4 }}>
          <Typography
            variant="body1"
            sx={{
              lineHeight: 1.8,
              '& h2': {
                fontSize: '1.5rem',
                fontWeight: 600,
                mt: 4,
                mb: 2,
                color: 'primary.main'
              },
              '& h3': {
                fontSize: '1.25rem',
                fontWeight: 600,
                mt: 3,
                mb: 1.5,
                color: 'text.primary'
              },
              '& p': {
                mb: 2
              },
              '& ul, & ol': {
                pl: 3,
                mb: 2
              },
              '& li': {
                mb: 0.5
              },
              '& strong': {
                fontWeight: 600,
                color: 'primary.main'
              }
            }}
            dangerouslySetInnerHTML={{ __html: blogPost.content }}
          />
        </Paper>

        {/* Call to Action */}
        <Paper
          elevation={1}
          sx={{
            mt: 4,
            p: 3,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)'
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Found this article helpful?
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            Share it with other parents and help spread health awareness in our school community.
          </Typography>
          <Button
            variant="contained"
            onClick={handleShare}
            startIcon={<ShareIcon />}
            sx={{ mr: 2 }}
          >
            Share Article
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/')}
          >
            Read More Articles
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default BlogPostDetail;
