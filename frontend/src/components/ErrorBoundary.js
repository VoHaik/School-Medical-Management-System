import React, { Component } from 'react';
import { Button, Typography, Box, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error('ErrorBoundary caught an error', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            m: 2, 
            textAlign: 'center',
            borderRadius: 2,
            backgroundColor: (theme) => 
              theme.palette.mode === 'dark' ? '#2d3748' : '#f8fafc'
          }}
        >
          <Box sx={{ mb: 3 }}>
            <ErrorOutlineIcon color="error" sx={{ fontSize: 60 }} />
          </Box>
          <Typography variant="h5" component="h2" gutterBottom color="error">
            Something went wrong
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            {this.props.fallbackMessage || 
              "We're sorry, but there was an error loading this section."}
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={this.resetError}
            sx={{ mr: 2 }}
          >
            Try Again
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => window.location.href = '/'}
          >
            Go to Homepage
          </Button>
          {this.props.showErrorDetails && this.state.error && (
            <Box sx={{ mt: 4, textAlign: 'left' }}>
              <Typography variant="subtitle2" color="error">
                Error Details (for developers):
              </Typography>
              <Box 
                component="pre" 
                sx={{ 
                  p: 2, 
                  mt: 1, 
                  backgroundColor: (theme) => 
                    theme.palette.mode === 'dark' ? '#1a202c' : '#f1f5f9',
                  borderRadius: 1,
                  overflow: 'auto',
                  fontSize: '0.875rem'
                }}
              >
                {this.state.error.toString()}
              </Box>
            </Box>
          )}
        </Paper>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;