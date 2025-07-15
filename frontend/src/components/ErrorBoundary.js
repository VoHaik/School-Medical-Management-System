// NOTE VN: Component ErrorBoundary - React Error Boundary để catch JavaScript errors
// - Sử dụng Class Component để implement error boundary
// - Hiển thị fallback UI khi có error
// - Logging errors và error recovery functionality
import React, { Component } from 'react';
import { Button, Typography, Box, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    // NOTE VN: Initial state với error tracking
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  // NOTE VN: Static method để update state khi có error
  static getDerivedStateFromError(error) {
    // Update state để render fallback UI
    return { hasError: true };
  }

  // NOTE VN: Lifecycle method để catch và log errors
  componentDidCatch(error, errorInfo) {
    // Log error to error reporting service hoặc console
    console.error('ErrorBoundary caught an error', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  // NOTE VN: Function để reset error state và retry
  resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // NOTE VN: Render custom fallback UI khi có error
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
          {/* NOTE VN: Error icon với large size */}
          <Box sx={{ mb: 3 }}>
            <ErrorOutlineIcon color="error" sx={{ fontSize: 60 }} />
          </Box>
          
          {/* NOTE VN: Error message heading */}
          <Typography variant="h5" component="h2" gutterBottom color="error">
            Something went wrong
          </Typography>
          
          {/* NOTE VN: Fallback message từ props hoặc default */}
          <Typography variant="body1" color="textSecondary" paragraph>
            {this.props.fallbackMessage || 
              "We're sorry, but there was an error loading this section."}
          </Typography>
          
          {/* NOTE VN: Action buttons - Try again và Go home */}
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
          
          {/* NOTE VN: Conditional error details cho development */}
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

    // NOTE VN: Render children nếu không có error
    return this.props.children;
  }
}

// NOTE VN: Export ErrorBoundary component
// CHỨC NĂNG CHÍNH:
// 1. JavaScript error boundary cho React components
// 2. Fallback UI với user-friendly error messages
// 3. Error logging và reporting
// 4. Recovery actions (Try Again, Go Home)
// 5. Development error details display
// 6. Material-UI styling với dark/light theme support
// 7. Customizable fallback messages via props

export default ErrorBoundary;