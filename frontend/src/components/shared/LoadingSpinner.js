import React from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  CircularProgress,
  Typography,
  useTheme,
  alpha,
  Paper,
  Skeleton,
  Grid,
  Avatar,
} from '@mui/material';
import { FavoriteOutlined } from '@mui/icons-material';

const LoadingSpinner = ({ 
  variant = 'default', // 'default' | 'page' | 'card' | 'skeleton' | 'pulse'
  size = 'medium', // 'small' | 'medium' | 'large'
  message = 'Loading...',
  overlay = false,
  fullHeight = false,
  ...props 
}) => {
  const theme = useTheme();

  const getSizeProps = () => {
    switch (size) {
      case 'small':
        return { size: 32, fontSize: '0.875rem' };
      case 'large':
        return { size: 64, fontSize: '1.25rem' };
      default:
        return { size: 48, fontSize: '1rem' };
    }
  };

  const { size: spinnerSize, fontSize } = getSizeProps();

  const containerVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const heartbeatVariants = {
    animate: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const renderSkeletonLoader = () => (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={2}>
        {[...Array(3)].map((_, index) => (
          <Grid item xs={12} key={index}>
            <Box display="flex" alignItems="center" mb={2}>
              <Skeleton 
                variant="circular" 
                width={40} 
                height={40} 
                sx={{ mr: 2 }}
                animation="wave"
              />
              <Box flex={1}>
                <Skeleton 
                  variant="text" 
                  width="60%" 
                  height={24}
                  animation="wave"
                />
                <Skeleton 
                  variant="text" 
                  width="40%" 
                  height={20}
                  animation="wave"
                />
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderPulseLoader = () => (
    <motion.div
      variants={pulseVariants}
      animate="animate"
    >
      <Avatar
        sx={{
          width: spinnerSize,
          height: spinnerSize,
          bgcolor: theme.palette.primary.main,
          mx: 'auto',
          mb: 2
        }}
      >
        <motion.div variants={heartbeatVariants} animate="animate">
          <FavoriteOutlined fontSize={size === 'large' ? 'large' : 'medium'} />
        </motion.div>
      </Avatar>
    </motion.div>
  );

  const renderCardLoader = () => (
    <Paper
      elevation={2}
      sx={{
        p: 4,
        textAlign: 'center',
        borderRadius: 3,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <CircularProgress
          size={spinnerSize}
          thickness={4}
          sx={{
            mb: 2,
            color: theme.palette.primary.main,
          }}
        />
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontSize }}
        >
          {message}
        </Typography>
      </motion.div>
    </Paper>
  );

  const renderDefaultLoader = () => (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={2}
      >
        <CircularProgress
          size={spinnerSize}
          thickness={4}
          sx={{ color: theme.palette.primary.main }}
        />
        {message && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize }}
          >
            {message}
          </Typography>
        )}
      </Box>
    </motion.div>
  );

  const renderPageLoader = () => (
    <Box
      sx={{
        position: overlay ? 'fixed' : 'relative',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: fullHeight ? '100vh' : '200px',
        background: overlay 
          ? `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`
          : 'transparent',
        backdropFilter: overlay ? 'blur(4px)' : 'none',
        zIndex: overlay ? theme.zIndex.modal : 'auto',
        ...props.sx
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <Box
          textAlign="center"
          sx={{
            p: 4,
            borderRadius: 3,
            background: overlay 
              ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`
              : 'transparent',
            boxShadow: overlay ? theme.shadows[8] : 'none',
          }}
        >
          <CircularProgress
            size={spinnerSize}
            thickness={4}
            sx={{
              mb: 3,
              color: theme.palette.primary.main,
            }}
          />
          <Typography
            variant="h6"
            color="text.primary"
            fontWeight="medium"
            gutterBottom
          >
            {message}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ opacity: 0.8 }}
          >
            Please wait while we load your content...
          </Typography>
        </Box>
      </motion.div>
    </Box>
  );

  switch (variant) {
    case 'skeleton':
      return renderSkeletonLoader();
    case 'pulse':
      return renderPulseLoader();
    case 'card':
      return renderCardLoader();
    case 'page':
      return renderPageLoader();
    default:
      return renderDefaultLoader();
  }
};

export default LoadingSpinner;
