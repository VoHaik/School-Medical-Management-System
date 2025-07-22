import React, { createContext, useContext, useState, useCallback } from 'react';
import { 
  Snackbar, 
  Alert, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button,
  Typography,
  Box,
  IconButton,
  Slide,
  Grow
} from '@mui/material';
import { 
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  HelpOutline as QuestionIcon
} from '@mui/icons-material';

const NotificationContext = createContext();

// Transition components for animations
const SlideTransition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const GrowTransition = React.forwardRef(function Transition(props, ref) {
  return <Grow ref={ref} {...props} />;
});

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [snackbars, setSnackbars] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null,
    confirmText: 'Xác nhận',
    cancelText: 'Hủy',
    severity: 'info'
  });

  const showNotification = useCallback((message, severity = 'info', duration = 6000) => {
    const id = Date.now() + Math.random();
    const newSnackbar = {
      id,
      message,
      severity,
      duration,
      open: true
    };
    
    setSnackbars(prev => [...prev, newSnackbar]);
    
    // Auto remove after duration
    setTimeout(() => {
      removeSnackbar(id);
    }, duration);
  }, []);

  const removeSnackbar = useCallback((id) => {
    setSnackbars(prev => prev.filter(snackbar => snackbar.id !== id));
  }, []);

  const showSuccess = useCallback((message, duration) => {
    showNotification(message, 'success', duration);
  }, [showNotification]);

  const showError = useCallback((message, duration) => {
    showNotification(message, 'error', duration);
  }, [showNotification]);

  const showWarning = useCallback((message, duration) => {
    showNotification(message, 'warning', duration);
  }, [showNotification]);

  const showInfo = useCallback((message, duration) => {
    showNotification(message, 'info', duration);
  }, [showNotification]);

  const showConfirm = useCallback((options) => {
    return new Promise((resolve) => {
      setConfirmDialog({
        open: true,
        title: options.title || 'Xác nhận',
        message: options.message,
        confirmText: options.confirmText || 'Xác nhận',
        cancelText: options.cancelText || 'Hủy',
        severity: options.severity || 'info',
        onConfirm: () => {
          setConfirmDialog(prev => ({ ...prev, open: false }));
          resolve(true);
        },
        onCancel: () => {
          setConfirmDialog(prev => ({ ...prev, open: false }));
          resolve(false);
        }
      });
    });
  }, []);

  const getIcon = (severity) => {
    const iconProps = { fontSize: 'medium', sx: { mr: 1 } };
    switch (severity) {
      case 'success':
        return <SuccessIcon {...iconProps} color="success" />;
      case 'error':
        return <ErrorIcon {...iconProps} color="error" />;
      case 'warning':
        return <WarningIcon {...iconProps} color="warning" />;
      case 'info':
        return <InfoIcon {...iconProps} color="info" />;
      default:
        return <QuestionIcon {...iconProps} color="primary" />;
    }
  };

  const getConfirmDialogColor = (severity) => {
    switch (severity) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'success':
        return 'success';
      default:
        return 'primary';
    }
  };

  const value = {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {/* Multiple Snackbars */}
      <Box sx={{ position: 'fixed', top: 16, right: 16, zIndex: 2000 }}>
        {snackbars.map((snackbar, index) => (
          <Snackbar
            key={snackbar.id}
            open={snackbar.open}
            autoHideDuration={null}
            TransitionComponent={GrowTransition}
            sx={{ 
              position: 'relative',
              mb: index > 0 ? 1 : 0,
              top: 'auto',
              right: 'auto',
              transform: 'none'
            }}
          >
            <Alert
              onClose={() => removeSnackbar(snackbar.id)}
              severity={snackbar.severity}
              variant="filled"
              sx={{
                width: 400,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                borderRadius: 2,
                fontSize: '0.95rem',
                fontWeight: 500,
                '& .MuiAlert-icon': {
                  fontSize: '1.5rem'
                },
                '& .MuiAlert-action': {
                  paddingTop: '2px'
                }
              }}
              action={
                <IconButton
                  size="small"
                  aria-label="close"
                  color="inherit"
                  onClick={() => removeSnackbar(snackbar.id)}
                  sx={{ 
                    color: 'inherit',
                    opacity: 0.8,
                    '&:hover': { opacity: 1 }
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              }
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        ))}
      </Box>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={confirmDialog.onCancel}
        TransitionComponent={SlideTransition}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
            overflow: 'visible'
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1, 
          display: 'flex', 
          alignItems: 'center',
          fontSize: '1.3rem',
          fontWeight: 600,
          color: 'text.primary'
        }}>
          {getIcon(confirmDialog.severity)}
          {confirmDialog.title}
        </DialogTitle>
        
        <DialogContent sx={{ pt: 1, pb: 3 }}>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ 
              fontSize: '1rem',
              lineHeight: 1.6
            }}
          >
            {confirmDialog.message}
          </Typography>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={confirmDialog.onCancel}
            variant="outlined"
            color="inherit"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500,
              px: 3,
              py: 1
            }}
          >
            {confirmDialog.cancelText}
          </Button>
          <Button
            onClick={confirmDialog.onConfirm}
            variant="contained"
            color={getConfirmDialogColor(confirmDialog.severity)}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500,
              px: 3,
              py: 1,
              boxShadow: 2,
              '&:hover': {
                boxShadow: 4
              }
            }}
          >
            {confirmDialog.confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
