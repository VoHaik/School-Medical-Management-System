import React from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Avatar,
  IconButton,
  Chip,
  useTheme,
  alpha,
  Button,
} from '@mui/material';
import {
  MoreVert,
  Favorite,
  FavoriteBorder,
  Share,
  BookmarkBorder,
  Bookmark,
} from '@mui/icons-material';

const EnhancedCard = ({
  title,
  subtitle,
  description,
  image,
  avatar,
  avatarText,
  icon,
  iconColor,
  actions = [],
  chips = [],
  variant = 'default', // 'default' | 'elevated' | 'outlined' | 'gradient' | 'glass'
  size = 'medium', // 'small' | 'medium' | 'large'
  interactive = true,
  loading = false,
  bookmark = false,
  onBookmark,
  like = false,
  onLike,
  onClick,
  sx = {},
  children,
  ...props
}) => {
  const theme = useTheme();

  const getSizeProps = () => {
    switch (size) {
      case 'small':
        return { 
          padding: 2, 
          titleVariant: 'subtitle1', 
          subtitleVariant: 'body2',
          descriptionVariant: 'body2',
          avatarSize: 32 
        };
      case 'large':
        return { 
          padding: 4, 
          titleVariant: 'h5', 
          subtitleVariant: 'subtitle1',
          descriptionVariant: 'body1',
          avatarSize: 56 
        };
      default:
        return { 
          padding: 3, 
          titleVariant: 'h6', 
          subtitleVariant: 'body2',
          descriptionVariant: 'body2',
          avatarSize: 40 
        };
    }
  };

  const { padding, titleVariant, subtitleVariant, descriptionVariant, avatarSize } = getSizeProps();

  const getCardStyles = () => {
    const baseStyles = {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: 3,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: interactive && onClick ? 'pointer' : 'default',
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyles,
          elevation: 4,
          '&:hover': interactive ? {
            elevation: 8,
            transform: 'translateY(-4px)',
          } : {},
        };
      
      case 'outlined':
        return {
          ...baseStyles,
          variant: 'outlined',
          borderColor: theme.palette.divider,
          '&:hover': interactive ? {
            borderColor: theme.palette.primary.main,
            boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
          } : {},
        };
      
      case 'gradient':
        return {
          ...baseStyles,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          '&:hover': interactive ? {
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.secondary.main, 0.15)} 100%)`,
            transform: 'translateY(-2px)',
          } : {},
        };
      
      case 'glass':
        return {
          ...baseStyles,
          background: alpha(theme.palette.background.paper, 0.7),
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
          '&:hover': interactive ? {
            background: alpha(theme.palette.background.paper, 0.8),
            transform: 'translateY(-2px)',
          } : {},
        };
      
      default:
        return {
          ...baseStyles,
          '&:hover': interactive ? {
            boxShadow: theme.shadows[4],
            transform: 'translateY(-2px)',
          } : {},
        };
    }
  };

  const cardMotionProps = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
    whileHover: interactive ? { scale: 1.02 } : {},
    whileTap: interactive && onClick ? { scale: 0.98 } : {},
  };

  if (loading) {
    return (
      <Card sx={{ ...getCardStyles(), ...sx }}>
        <CardContent sx={{ p: padding }}>
          <Box display="flex" alignItems="center" mb={2}>
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Avatar sx={{ width: avatarSize, height: avatarSize, mr: 2, bgcolor: theme.palette.grey[200] }} />
            </motion.div>
            <Box flex={1}>
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
              >
                <Box sx={{ height: 20, bgcolor: theme.palette.grey[200], borderRadius: 1, mb: 1 }} />
              </motion.div>
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
              >
                <Box sx={{ height: 16, bgcolor: theme.palette.grey[200], borderRadius: 1, width: '70%' }} />
              </motion.div>
            </Box>
          </Box>
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
          >
            <Box sx={{ height: 60, bgcolor: theme.palette.grey[200], borderRadius: 1 }} />
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div {...cardMotionProps}>
      <Card
        sx={{ ...getCardStyles(), ...sx }}
        onClick={onClick}
        {...props}
      >
        {/* Header with Avatar/Icon */}
        {(avatar || avatarText || icon) && (
          <CardContent sx={{ p: padding, pb: children ? 1 : padding }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center">
                {avatar && (
                  <Avatar
                    src={avatar}
                    sx={{ width: avatarSize, height: avatarSize, mr: 2 }}
                  >
                    {avatarText}
                  </Avatar>
                )}
                {icon && !avatar && (
                  <Avatar
                    sx={{
                      width: avatarSize,
                      height: avatarSize,
                      mr: 2,
                      bgcolor: iconColor || theme.palette.primary.main,
                    }}
                  >
                    {icon}
                  </Avatar>
                )}
                <Box>
                  {title && (
                    <Typography variant={titleVariant} component="h3" fontWeight="bold">
                      {title}
                    </Typography>
                  )}
                  {subtitle && (
                    <Typography variant={subtitleVariant} color="text.secondary">
                      {subtitle}
                    </Typography>
                  )}
                </Box>
              </Box>
              
              {/* Action Menu */}
              <IconButton size="small" sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}>
                <MoreVert />
              </IconButton>
            </Box>
          </CardContent>
        )}

        {/* Image */}
        {image && (
          <Box
            component="img"
            src={image}
            alt={title}
            sx={{
              width: '100%',
              height: size === 'large' ? 200 : size === 'small' ? 120 : 160,
              objectFit: 'cover',
            }}
          />
        )}

        {/* Content */}
        <CardContent sx={{ p: padding, pt: (avatar || avatarText || icon) ? 1 : padding }}>
          {!avatar && !avatarText && !icon && title && (
            <Typography variant={titleVariant} component="h3" fontWeight="bold" gutterBottom>
              {title}
            </Typography>
          )}
          
          {!avatar && !avatarText && !icon && subtitle && (
            <Typography variant={subtitleVariant} color="text.secondary" gutterBottom>
              {subtitle}
            </Typography>
          )}

          {description && (
            <Typography variant={descriptionVariant} color="text.secondary" paragraph>
              {description}
            </Typography>
          )}

          {/* Chips */}
          {chips.length > 0 && (
            <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
              {chips.map((chip, index) => (
                <Chip
                  key={index}
                  label={chip.label}
                  size="small"
                  color={chip.color || 'default'}
                  variant={chip.variant || 'filled'}
                />
              ))}
            </Box>
          )}

          {children}
        </CardContent>

        {/* Actions */}
        {(actions.length > 0 || like !== undefined || bookmark !== undefined) && (
          <CardActions sx={{ px: padding, pb: padding, pt: 0 }}>
            <Box display="flex" justifyContent="space-between" width="100%">
              <Box display="flex" gap={1}>
                {like !== undefined && (
                  <IconButton
                    onClick={onLike}
                    color={like ? 'error' : 'default'}
                    size="small"
                  >
                    {like ? <Favorite /> : <FavoriteBorder />}
                  </IconButton>
                )}
                
                <IconButton size="small">
                  <Share />
                </IconButton>
                
                {bookmark !== undefined && (
                  <IconButton
                    onClick={onBookmark}
                    color={bookmark ? 'primary' : 'default'}
                    size="small"
                  >
                    {bookmark ? <Bookmark /> : <BookmarkBorder />}
                  </IconButton>
                )}
              </Box>

              <Box display="flex" gap={1}>
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    size="small"
                    variant={action.variant || 'text'}
                    color={action.color || 'primary'}
                    onClick={action.onClick}
                    startIcon={action.icon}
                  >
                    {action.label}
                  </Button>
                ))}
              </Box>
            </Box>
          </CardActions>
        )}
      </Card>
    </motion.div>
  );
};

export default EnhancedCard;
