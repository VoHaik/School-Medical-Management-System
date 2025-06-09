import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Chip,
  Divider,
  Icon
} from '@mui/material';
import {
  Close as CloseIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  LocalHospital as MedicalIcon
} from '@mui/icons-material';

const DetailModal = ({
  open,
  onClose,
  title,
  data,
  fields,
  actions = [],
  maxWidth = 'md',
  fullWidth = true
}) => {
  const renderFieldValue = (field, value) => {
    if (!value && value !== 0) return '-';

    switch (field.type) {
      case 'chip':
        return (
          <Chip
            label={value}
            color={field.getColor ? field.getColor(value) : 'default'}
            size="small"
          />
        );

      case 'chips':
        return (
          <Box className="flex flex-wrap gap-1">
            {Array.isArray(value) ? value.map((item, index) => (
              <Chip
                key={index}
                label={item}
                size="small"
                variant="outlined"
              />
            )) : (
              <Chip label={value} size="small" variant="outlined" />
            )}
          </Box>
        );

      case 'date':
        return new Date(value).toLocaleDateString();

      case 'datetime':
        return new Date(value).toLocaleString();

      case 'currency':
        return `$${parseFloat(value).toFixed(2)}`;

      case 'percentage':
        return `${value}%`;

      case 'list':
        return (
          <Box>
            {Array.isArray(value) ? value.map((item, index) => (
              <Typography key={index} variant="body2" className="mb-1">
                • {item}
              </Typography>
            )) : value}
          </Box>
        );

      case 'boolean':
        return (
          <Chip
            label={value ? 'Yes' : 'No'}
            color={value ? 'success' : 'default'}
            size="small"
          />
        );

      case 'link':
        return (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {field.linkText || value}
          </a>
        );

      case 'multiline':
        return (
          <Typography variant="body2" className="whitespace-pre-wrap">
            {value}
          </Typography>
        );

      default:
        return (
          <Typography variant="body2">
            {value}
          </Typography>
        );
    }
  };

  const getFieldIcon = (iconType) => {
    switch (iconType) {
      case 'calendar':
        return <CalendarIcon className="text-gray-500" fontSize="small" />;
      case 'person':
        return <PersonIcon className="text-gray-500" fontSize="small" />;
      case 'medical':
        return <MedicalIcon className="text-gray-500" fontSize="small" />;
      default:
        return null;
    }
  };

  const groupedFields = fields.reduce((acc, field) => {
    const group = field.group || 'default';
    if (!acc[group]) acc[group] = [];
    acc[group].push(field);
    return acc;
  }, {});

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
    >
      <DialogTitle>
        <Box className="flex items-center justify-between">
          <Typography variant="h6" component="div">
            {title}
          </Typography>
          <Button
            onClick={onClose}
            className="min-w-0 p-1"
            color="inherit"
          >
            <CloseIcon />
          </Button>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {Object.entries(groupedFields).map(([groupName, groupFields], groupIndex) => (
          <Box key={groupName} className={groupIndex > 0 ? 'mt-6' : ''}>
            {groupName !== 'default' && (
              <>
                <Typography variant="h6" className="mb-3 font-semibold text-gray-800">
                  {groupName}
                </Typography>
                <Divider className="mb-4" />
              </>
            )}
            
            <Grid container spacing={3}>
              {groupFields.map((field) => (
                <Grid 
                  item 
                  xs={12} 
                  sm={field.width === 'half' ? 6 : field.width === 'third' ? 4 : 12}
                  key={field.key}
                >
                  <Box>
                    <Box className="flex items-center gap-1 mb-1">
                      {field.icon && getFieldIcon(field.icon)}
                      <Typography
                        variant="subtitle2"
                        className="font-medium text-gray-700"
                      >
                        {field.label}
                      </Typography>
                    </Box>
                    <Box className="ml-6">
                      {renderFieldValue(field, data[field.key])}
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
            
            {groupIndex < Object.keys(groupedFields).length - 1 && (
              <Divider className="my-6" />
            )}
          </Box>
        ))}
      </DialogContent>
      
      {actions.length > 0 && (
        <DialogActions className="p-4">
          <Button onClick={onClose} variant="outlined">
            Close
          </Button>
          {actions.map((action, index) => (
            <Button
              key={index}
              onClick={action.onClick}
              variant={action.variant || 'contained'}
              color={action.color || 'primary'}
              disabled={action.disabled}
              startIcon={action.icon}
            >
              {action.label}
            </Button>
          ))}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default DetailModal;
