import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Icon
} from '@mui/material';
import {
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

const ConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
  loading = false
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <SuccessIcon className="text-green-500" fontSize="large" />;
      case 'error':
        return <ErrorIcon className="text-red-500" fontSize="large" />;
      case 'info':
        return <InfoIcon className="text-blue-500" fontSize="large" />;
      default:
        return <WarningIcon className="text-yellow-500" fontSize="large" />;
    }
  };

  const getConfirmButtonColor = () => {
    switch (type) {
      case 'error':
        return 'error';
      case 'success':
        return 'success';
      case 'info':
        return 'primary';
      default:
        return 'warning';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>
        <Box className="flex items-center gap-2">
          {getIcon()}
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body1" className="text-gray-700">
          {message}
        </Typography>
      </DialogContent>
      
      <DialogActions className="p-4">
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={loading}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={getConfirmButtonColor()}
          disabled={loading}
          className={loading ? 'opacity-50 cursor-not-allowed' : ''}
        >
          {loading ? 'Processing...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
