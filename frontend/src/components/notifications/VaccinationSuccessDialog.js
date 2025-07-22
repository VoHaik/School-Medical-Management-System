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
  alpha,
  IconButton
} from '@mui/material';
import {
  Close as CloseIcon,
  VaccinesOutlined as VaccineIcon,
  CheckCircle as SuccessIcon
} from '@mui/icons-material';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const VaccinationSuccessDialog = ({
  open,
  onClose,
  title = 'Thành công',
  message = 'Yêu cầu đồng ý tiêm chủng đã được gửi thành công',
  confirmText = 'OK'
}) => {
  const theme = useTheme();

  const primaryColor = theme.palette.primary.main;
  const successColor = theme.palette.success.main;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'visible',
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)'
            : 'linear-gradient(145deg, #ffffff 0%, #f0f9ff 100%)',
          border: `3px solid ${alpha(successColor, 0.2)}`,
          position: 'relative'
        }
      }}
    >
      {/* Close button */}
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 12,
          top: 12,
          color: 'text.secondary',
          zIndex: 1,
          '&:hover': {
            backgroundColor: alpha(theme.palette.text.primary, 0.08)
          }
        }}
      >
        <CloseIcon />
      </IconButton>

      {/* Success indicator at the top */}
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: successColor,
          borderRadius: '50%',
          width: 60,
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 8px 25px ${alpha(successColor, 0.3)}`,
          border: `4px solid ${theme.palette.background.paper}`
        }}
      >
        <SuccessIcon sx={{ color: 'white', fontSize: '2rem' }} />
      </Box>

      <DialogTitle sx={{ 
        pt: 5,
        pb: 2, 
        px: 4,
        textAlign: 'center',
        fontSize: '1.6rem',
        fontWeight: 700,
        color: 'text.primary',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2
      }}>
        <VaccineIcon 
          sx={{ 
            fontSize: '3rem', 
            color: primaryColor,
            opacity: 0.8
          }} 
        />
        {title}
      </DialogTitle>
      
      <DialogContent sx={{ 
        pt: 1, 
        pb: 3,
        px: 4,
        textAlign: 'center'
      }}>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ 
            fontSize: '1.1rem',
            lineHeight: 1.7,
            fontWeight: 400,
            maxWidth: 400,
            margin: '0 auto'
          }}
        >
          {message}
        </Typography>

        {/* Decorative elements */}
        <Box sx={{ 
          mt: 3, 
          display: 'flex', 
          justifyContent: 'center',
          gap: 1
        }}>
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: alpha(primaryColor, 0.3),
                animation: `pulse 2s infinite ${i * 0.3}s`,
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 0.3 },
                  '50%': { opacity: 1 }
                }
              }}
            />
          ))}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ 
        px: 4, 
        pb: 4, 
        justifyContent: 'center'
      }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 600,
            px: 6,
            py: 1.5,
            fontSize: '1.1rem',
            backgroundColor: primaryColor,
            minWidth: 120,
            boxShadow: `0 8px 25px ${alpha(primaryColor, 0.3)}`,
            '&:hover': {
              backgroundColor: primaryColor,
              filter: 'brightness(1.1)',
              boxShadow: `0 12px 35px ${alpha(primaryColor, 0.4)}`,
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

export default VaccinationSuccessDialog;
