import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  LinearProgress,
  CircularProgress
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';

const StatsCard = ({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  icon,
  color = 'primary',
  loading = false,
  progress,
  progressLabel,
  actions,
  className = ''
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getIconColor = () => {
    switch (color) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      case 'info':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendIcon = () => {
    if (trend === 'up') {
      return <TrendingUpIcon className="text-green-600" fontSize="small" />;
    } else if (trend === 'down') {
      return <TrendingDownIcon className="text-red-600" fontSize="small" />;
    }
    return null;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <Card className={`${getColorClasses()} ${className}`}>
        <CardContent>
          <Box className="flex items-center justify-center h-24">
            <CircularProgress size={24} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${getColorClasses()} ${className}`}>
      <CardContent>
        <Box className="flex items-start justify-between">
          <Box className="flex-1">
            <Typography variant="h6" className="font-semibold text-gray-700 mb-1">
              {title}
            </Typography>
            
            <Typography variant="h4" className="font-bold text-gray-900 mb-1">
              {value}
            </Typography>
            
            {subtitle && (
              <Typography variant="body2" className="text-gray-600 mb-2">
                {subtitle}
              </Typography>
            )}
            
            {(trend || trendValue) && (
              <Box className="flex items-center gap-1">
                {getTrendIcon()}
                <Typography variant="body2" className={getTrendColor()}>
                  {trendValue}
                </Typography>
              </Box>
            )}
            
            {progress !== undefined && (
              <Box className="mt-3">
                <Box className="flex justify-between items-center mb-1">
                  <Typography variant="body2" className="text-gray-600">
                    {progressLabel || 'Progress'}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    {Math.round(progress)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  className="h-2 rounded"
                  color={color}
                />
              </Box>
            )}
          </Box>
          
          <Box className="flex flex-col items-end gap-2">
            {icon && (
              <Box className={`p-2 rounded-lg ${getIconColor()}`}>
                {icon}
              </Box>
            )}
            
            {actions && (
              <IconButton size="small">
                <MoreVertIcon />
              </IconButton>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const MetricsGrid = ({ metrics = [], loading = false, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {metrics.map((metric, index) => (
        <StatsCard
          key={index}
          loading={loading}
          {...metric}
        />
      ))}
    </div>
  );
};

export { StatsCard, MetricsGrid };
export default StatsCard;
