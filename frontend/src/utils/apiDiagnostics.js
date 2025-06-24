import axios from 'axios';

/**
 * Utility function to test an API endpoint and determine if it's accessible
 * and if authentication is being handled correctly.
 * 
 * @param {string} endpoint - The API endpoint to test (e.g., '/api/medication-requests/pending')
 * @param {boolean} useAuth - Whether to include authentication token in the request
 * @returns {Promise<Object>} - Object containing test results
 */
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

/**
 * Tests multiple endpoints at once and returns comprehensive results
 * 
 * @param {Array<string>} endpoints - List of endpoints to test
 * @returns {Promise<Object>} - Object containing test results for all endpoints
 */
export const testMultipleEndpoints = async (endpoints) => {
  const results = {
    timestamp: new Date().toISOString(),
    endpoints: [],
    summary: {
      total: endpoints.length,
      validApiEndpoints: 0,
      accessible: 0,
      issues: 0,
    }
  };
  
  // Test each endpoint without auth first, then with auth if appropriate
  for (const endpoint of endpoints) {
    // First test without auth
    const noAuthResult = await testApiEndpoint(endpoint, false);
    
    // If it's an API endpoint (returns 401), test with auth
    let authResult = null;
    if (noAuthResult.isApiEndpoint) {
      authResult = await testApiEndpoint(endpoint, true);
      results.summary.validApiEndpoints++;
      
      if (authResult.success) {
        results.summary.accessible++;
      }
    } else {
      results.summary.issues++;
    }
    
    results.endpoints.push({
      endpoint,
      noAuthResult,
      authResult,
    });
  }
  
  return results;
};

/**
 * Diagnoses common API auth issues
 */
export const diagnosePossibleAuthIssues = () => {
  const issues = [];
  
  // Check localStorage
  const token = localStorage.getItem('token');
  if (!token) {
    issues.push({
      severity: 'high',
      issue: 'No authentication token found in localStorage',
      fix: 'User needs to log in again'
    });
  } else {
    // Check token format
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        issues.push({
          severity: 'high',
          issue: 'Token is not in valid JWT format',
          fix: 'Check if the token is being properly generated and stored'
        });
      } else {
        // Check if token is expired
        try {
          const payload = JSON.parse(atob(tokenParts[1]));
          const expiry = payload.exp * 1000; // Convert to milliseconds
          const now = Date.now();
          
          if (now > expiry) {
            issues.push({
              severity: 'high',
              issue: 'Token is expired',
              fix: 'User needs to log in again',
              expiryTime: new Date(expiry).toLocaleString()
            });
          }
          
          // Check roles in token
          if (!payload.roles || payload.roles.length === 0) {
            issues.push({
              severity: 'high',
              issue: 'Token does not contain roles information',
              fix: 'Check if roles are being properly included in the JWT payload'
            });
          } else {
            const hasNurseRole = payload.roles.some(role => 
              ['SchoolNurse', 'ROLE_SCHOOLNURSE', 'Admin', 'ROLE_ADMIN'].includes(role)
            );
            
            if (!hasNurseRole) {
              issues.push({
                severity: 'high',
                issue: 'User does not have Nurse or Admin role in token',
                fix: 'User needs appropriate role to access nurse endpoints',
                roles: payload.roles
              });
            }
          }
        } catch (e) {
          issues.push({
            severity: 'high',
            issue: 'Could not parse token payload',
            fix: 'Token may be corrupted or in wrong format'
          });
        }
      }
    } catch (e) {
      issues.push({
        severity: 'high',
        issue: 'Error examining token',
        fix: 'Token may be corrupted'
      });
    }
  }
  
  // Check for user object
  try {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      issues.push({
        severity: 'medium',
        issue: 'No user object found in localStorage',
        fix: 'User may need to log in again'
      });
    } else {
      const user = JSON.parse(userJson);
      if (!user.roles || user.roles.length === 0) {
        issues.push({
          severity: 'medium',
          issue: 'User object does not contain roles information',
          fix: 'Check if roles are being correctly assigned in the user object'
        });
      }
    }
  } catch (e) {
    issues.push({
      severity: 'medium',
      issue: 'Error examining user object',
      fix: 'User object may be corrupted'
    });
  }
  
  return {
    timestamp: new Date().toISOString(),
    issues,
    hasCriticalIssues: issues.some(i => i.severity === 'high'),
    summary: `Found ${issues.length} potential issues with authentication`
  };
};

export default {
  testApiEndpoint,
  testMultipleEndpoints,
  diagnosePossibleAuthIssues
};
