const handleApiError = (error, defaultMessage = 'An error occurred') => {
  // Network errors
  if (error.code === 'ERR_NETWORK') {
    return {
      message: 'Unable to connect to the server. Please check your connection.',
      type: 'error',
      details: error.message
    };
  }
  
  // Server errors with response
  if (error.response) {
    // Authentication errors
    if (error.response.status === 401) {
      return {
        message: 'Your session has expired. Please log in again.',
        type: 'error',
        details: error.response.data?.message || 'Authentication failed'
      };
    }
    
    // Not found errors
    if (error.response.status === 404) {
      return {
        message: 'The requested resource was not found.',
        type: 'error',
        details: error.response.data?.message || 'Resource not found'
      };
    }
    
    // Validation errors
    if (error.response.status === 400) {
      return {
        message: error.response.data?.message || 'Invalid data provided',
        type: 'error',
        details: error.response.data?.details || ''
      };
    }
    
    // Server errors
    if (error.response.status >= 500) {
      return {
        message: 'A server error occurred. Please try again later.',
        type: 'error',
        details: error.response.data?.message || 'Server error'
      };
    }
    
    // Other status codes
    return {
      message: error.response.data?.message || defaultMessage,
      type: 'error',
      details: `Status: ${error.response.status}`
    };
  }
  
  // Default error handling
  return {
    message: defaultMessage,
    type: 'error',
    details: error.message || 'Unknown error'
  };
};

export { handleApiError };