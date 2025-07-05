/*
 * ========================================
 * FILE KHÔNG SỬ DỤNG - ĐÃ COMMENT
 * ========================================
 * File này được tạo để debug API nhưng không được sử dụng trong production.
 * Đã comment toàn bộ để tránh confusion.
 * Có thể xóa sau khi hoàn thành dự án.
 * ========================================
 
import axios from 'axios';

/**
 * Utility function to test an API endpoint and determine if it's accessible
 * and if authentication is being handled correctly.
 * 
 * @param {string} endpoint - The API endpoint to test (e.g., '/api/medication-requests/pending')
 * @param {boolean} useAuth - Whether to include authentication token in the request
 * @returns {Promise<Object>} - Object containing test results
 
export const testApiEndpoint = async (endpoint, useAuth = false) => {
  console.log(`Testing endpoint: ${endpoint} (with auth: ${useAuth})`);
  
  const result = {
    endpoint,
    useAuth,
    success: false,
    status: null,
    data: null,
    error: null,
    isApiEndpoint: false, // Will be true if it responds with 401 when no auth provided
    message: '',
  };
  
  try {
    // Prepare request config
    const config = {};
    
    if (useAuth) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };
      } else {
        result.message = 'No auth token available';
        result.error = 'No auth token available';
        return result;
      }
    }
    
    // Make the request
    const response = await axios.get(endpoint, config);
    
    // If we get here, request was successful
    result.success = true;
    result.status = response.status;
    result.data = response.data;
    result.message = 'Request successful';
    
    // If no auth and success, endpoint doesn't require auth
    if (!useAuth && result.success) {
      result.message = 'Endpoint accessible without authentication';
    }
    
    return result;
    
  } catch (error) {
    result.status = error.response?.status;
    result.error = error.message;
    
    // Handle specific responses
    if (error.response) {
      result.data = error.response.data;
      
      if (!useAuth && error.response.status === 401) {
        // This is actually good - API endpoint exists but requires auth
        result.isApiEndpoint = true;
        result.message = 'Endpoint exists and requires authentication';
      } else if (error.response.status === 404) {
        result.message = 'Endpoint not found';
      } else if (error.response.status === 403) {
        result.message = 'Forbidden - User may not have the required role';
      } else {
        result.message = `Error: ${error.response.status} ${error.response.statusText}`;
      }
    } else {
      result.message = `Network error: ${error.message}`;
    }
    
    return result;
  }
};

... (rest of the file content) ...

export default {
  testApiEndpoint,
  testMultipleEndpoints,
  diagnosePossibleAuthIssues
};

 */

// Empty export to avoid import errors
export default {};
