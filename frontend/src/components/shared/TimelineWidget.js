import React from 'react';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/lab';
import {
  Typography,
  Paper,
  Box,
  Chip,
  Tooltip
} from '@mui/material';

const TimelineWidget = ({
  events = [],
  maxItems = 10,
  showOppositeContent = true,
  iconMap = {},
  colorMap = {},
  onEventClick = null
}) => {
  // If more than maxItems, only show the most recent ones
  const displayEvents = events.slice(0, maxItems);

  // Default color based on event type
  const getEventColor = (type) => {
    if (colorMap[type]) return colorMap[type];
    
    // Default color mapping
    switch (type) {
      case 'checkup': return 'primary';
      case 'medication': return 'secondary';
      case 'vaccination': return 'success';
      case 'incident': return 'error';
      case 'emergency': return 'error';
      case 'screening': return 'warning';
      default: return 'default';
    }
  };

  // Default icon based on event type
  const getEventIcon = (type) => {
    if (iconMap[type]) return iconMap[type];
    return null; // Default to no icon
  };

  if (events.length === 0) {
    return (
      <Paper elevation={0} className="p-4 text-center bg-gray-50">
        <Typography variant="body2" color="textSecondary">
          No events to display
        </Typography>
      </Paper>
    );
  }

  return (
    <Timeline position={showOppositeContent ? "alternate" : "right"}>
      {displayEvents.map((event, index) => (
        <TimelineItem key={event.id || index}>
          {showOppositeContent && (
            <TimelineOppositeContent color="text.secondary">
              <Typography variant="body2">{event.date}</Typography>
              {event.time && (
                <Typography variant="caption">{event.time}</Typography>
              )}
            </TimelineOppositeContent>
          )}
          <TimelineSeparator>
            <TimelineDot color={getEventColor(event.type)}>
              {getEventIcon(event.type)}
            </TimelineDot>
            {index < displayEvents.length - 1 && <TimelineConnector />}
          </TimelineSeparator>
          <TimelineContent>
            <Paper 
              elevation={1} 
              className="p-3 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onEventClick && onEventClick(event)}
            >
              <Typography variant="h6" component="div" className="mb-1">
                {event.title}
              </Typography>
              <Typography variant="body2" color="textSecondary" className="mb-2">
                {event.description}
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {event.tags && event.tags.map((tag, idx) => (
                  <Chip 
                    key={idx} 
                    label={tag} 
                    size="small" 
                    variant="outlined"
                  />
                ))}
                {event.status && (
                  <Chip 
                    label={event.status} 
                    size="small"
                    color={getEventColor(event.status)}
                  />
                )}
              </Box>
            </Paper>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
};

export default TimelineWidget;
