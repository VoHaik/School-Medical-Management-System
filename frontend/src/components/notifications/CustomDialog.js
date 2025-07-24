import React from 'react';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Slide,
  useTheme,
  alpha
} from '@mui/material';
import {
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  HelpOutline as QuestionIcon
} from '@mui/icons-material';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CustomDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  severity = 'info',
  maxWidth = 'sm',
  showCancel = true
}) => {
  const theme = useTheme();

  const getIcon = () => {
    const iconProps = { 
      fontSize: 'large', 
      sx: { 
        mr: 2,
        p: 1,
        borderRadius: '50%',
        backgroundColor: alpha(getColor(), 0.1)
      } 
    };
    
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

  const getColor = () => {
    switch (severity) {
      case 'success':
        return theme.palette.success.main;
      case 'error':
        return theme.palette.error.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'info':
        return theme.palette.info.main;
      default:
        return theme.palette.primary.main;
    }
  };

  const getBorderColor = () => {
    return alpha(getColor(), 0.2);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      maxWidth={maxWidth}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'visible',
          border: `2px solid ${getBorderColor()}`,
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)'
            : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)'
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: 2, 
        pt: 4,
        px: 4,
        display: 'flex', 
        alignItems: 'center',
        fontSize: '1.4rem',
        fontWeight: 600,
        color: 'text.primary',
        borderBottom: `1px solid ${alpha(getColor(), 0.1)}`
      }}>
        {getIcon()}
        <Box>
          {title}
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ 
        pt: 3, 
        pb: 2,
        px: 4,
        minHeight: 80
      }}>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ 
            fontSize: '1.1rem',
            lineHeight: 1.7,
            fontWeight: 400
          }}
        >
          {message}
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ 
        px: 4, 
        pb: 4, 
        gap: 2,
        justifyContent: 'flex-end'
      }}>
        {showCancel && (
          <Button
            onClick={onClose}
            variant="outlined"
            color="inherit"
            sx={{
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
                backgroundColor: alpha(theme.palette.text.primary, 0.04)
              }
            }}
          >
            {cancelText}
          </Button>
        )}
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 600,
            px: 4,
            py: 1.5,
            fontSize: '1rem',
            backgroundColor: getColor(),
            boxShadow: `0 8px 25px ${alpha(getColor(), 0.3)}`,
            '&:hover': {
              backgroundColor: getColor(),
              filter: 'brightness(1.1)',
              boxShadow: `0 12px 35px ${alpha(getColor(), 0.4)}`,
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomDialog;
