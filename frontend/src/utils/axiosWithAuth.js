import axios from 'axios';

/**
 * Creates an axios instance with authentication headers
 * This utility function centralizes auth header creation for API requests
 * @returns {AxiosInstance} Axios instance with auth headers
 */
const axiosWithAuth = () => {
  console.log('[axiosWithAuth] Creating authenticated axios instance');
  
  // Get token from localStorage - try multiple possible locations
  const token = localStorage.getItem('token');
  console.log('[axiosWithAuth] Direct token from localStorage:', token ? 'Found' : 'Not Found');
  
  let userToken = null;
  
  // Also try to get token from user object as a fallback
  try {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      userToken = user?.accessToken || user?.token;
      console.log('[axiosWithAuth] User token from localStorage:', userToken ? 'Found' : 'Not Found');
      console.log('[axiosWithAuth] User roles:', user?.roles);
    }
  } catch (e) {
    console.error('[axiosWithAuth] Error parsing user JSON:', e);
  }
  
  // Use the most reliable token source
  const finalToken = token || userToken;
  console.log('[axiosWithAuth] Final token being used:', finalToken ? `${finalToken.substring(0, 10)}...` : 'None');
  
  // Create and return the axios instance
  const instance = axios.create({
    headers: {
      'Content-Type': 'application/json',
      'Authorization': finalToken ? `Bearer ${finalToken}` : undefined
    }
  });
  
  console.log('[axiosWithAuth] Initial headers:', instance.defaults.headers);
    // Add request interceptor to always get fresh token
  instance.interceptors.request.use(
    config => {
      // Always check for the latest token at request time
      const currentToken = localStorage.getItem('token');
      console.log(`[axiosWithAuth] Request to ${config.url} - Token present:`, currentToken ? 'Yes' : 'No');
      
      if (currentToken) {
        config.headers.Authorization = `Bearer ${currentToken}`;
        console.log('[axiosWithAuth] Updated Authorization header with fresh token');
      }
      
      // Add custom debugging header
      config.headers['X-Client-Debug'] = 'axiosWithAuth';
      
      console.log('[axiosWithAuth] Final request headers:', config.headers);
      return config;
    },
    error => {
      console.error('[axiosWithAuth] Request interceptor error:', error);
      return Promise.reject(error);
    }
  );
  
  // Add response interceptor to handle 401 errors
  instance.interceptors.response.use(
    response => {
      console.log(`[axiosWithAuth] Response from ${response.config.url} - Status:`, response.status);
      return response;
    },
    error => {
      console.error(`[axiosWithAuth] Response error from ${error.config?.url || 'unknown'}:`, error.message);
      
      if (error.response) {
        console.error('[axiosWithAuth] Response status:', error.response.status);
        console.error('[axiosWithAuth] Response data:', error.response.data);
        
        if (error.response.status === 401) {
          console.error('[axiosWithAuth] 401 Unauthorized - Session expired or invalid token');
          // Clear localStorage to trigger re-login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Redirect to login
          setTimeout(() => {
            window.location.href = '/login?error=session_expired';
          }, 1000); // Give a small delay to allow logs to be seen
        } else if (error.response.status === 500) {
          console.error('[axiosWithAuth] 500 Server Error:', error.response.data);
        }
      }
      
      return Promise.reject(error);
    }
  );
  
  return instance;
};

export default axiosWithAuth;
