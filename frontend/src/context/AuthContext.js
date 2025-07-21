import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create the auth context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on component mount and validate token
  useEffect(() => {
    const validateToken = async () => {
      console.log('[AuthContext] Starting token validation...');
      const token = localStorage.getItem('token');
      const userJson = localStorage.getItem('user');
      console.log('[AuthContext] Token exists:', !!token);
      console.log('[AuthContext] User data exists:', !!userJson);

      if (token) {
        try {
          // Create an axios instance with the token
          const instance = axios.create({
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          // If we have cached user data, use it immediately
          if (userJson) {
            try {
              const cachedUser = JSON.parse(userJson);
              console.log('[AuthContext] Using cached user data:', cachedUser.username);
              setCurrentUser({
                ...cachedUser,
                accessToken: token
              });
            } catch (parseError) {
              console.error('[AuthContext] Error parsing cached user data:', parseError);
              localStorage.removeItem('user');
            }
          }

          // Make a request to the auth/me endpoint to validate the token and get fresh data
          try {
            const response = await instance.get('/api/auth/me');
            console.log('[AuthContext] Token validation successful');
            // If the request succeeds, the token is valid
            // Update user data with the latest from the server
            const { id, username, email, fullName, roles, userCode } = response.data;
            const updatedUser = {
              id,
              username,
              email,
              fullName,
              roles,
              userCode,
              accessToken: token
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setCurrentUser(updatedUser);
          } catch (error) {
            console.error('[AuthContext] Token validation failed:', error);
            // If the request fails with 401, the token is invalid or expired
            if (error.response && error.response.status === 401) {
              console.log('[AuthContext] Token expired/invalid, clearing auth data');
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setCurrentUser(null);
            } else if (!userJson) {
              console.log('[AuthContext] No cached user data and token validation failed, clearing auth');
              // If we don't have cached user data and can't validate token, clear everything
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setCurrentUser(null);
            } else {
              console.log('[AuthContext] Network error but keeping cached user data');
            }
            // If we have cached user data and it's just a network error, keep the user logged in
          }
        } catch (error) {
          console.error('[AuthContext] Error processing stored user data during token validation:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setCurrentUser(null); // Clear user if there's an error
        }
      } else {
        console.log('[AuthContext] No token found, user not authenticated');
      }

      console.log('[AuthContext] Token validation complete, setting loading to false');
      setLoading(false);
    };

    validateToken();
  }, []);

  // Login function
  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post('/api/auth/signin', {
        username,
        password
      });

      const { token, id, username: userName, email, fullName, roles, userCode } = response.data;

      // Store token and user info
      localStorage.setItem('token', token);
      const user = {
        id,
        username: userName,
        email,
        fullName,
        roles,
        userCode,
        accessToken: token // Include the token in the currentUser object
      };

      localStorage.setItem('user', JSON.stringify(user)); // Store user (with token)
      setCurrentUser(user);

      return { success: true, user }; // MODIFIED: return user object
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed. Please check your credentials.' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (username, email, password, fullName, phone, role) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post('/api/auth/signup', {
        username,
        email,
        password,
        fullName,
        phone: phone || '', // Default to empty string if not provided
        role: role || 'Student' // Default to Student if not provided
      });

      return { 
        success: true, 
        message: response.data.message 
      };
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed. Please try again.' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  // Get authenticated axios instance
  const getAuthAxios = () => {
    const token = localStorage.getItem('token');
    // Also try to get token from user object as a fallback
    let userToken = null;
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        userToken = user?.accessToken || user?.token;
        } catch (e) {
        console.error('[getAuthAxios] Error parsing user JSON:', e);
      }
    }
    
    // Use the most reliable token source
    const finalToken = token || userToken;
    const instance = axios.create({
      headers: {
        'Content-Type': 'application/json',
        'Authorization': finalToken ? `Bearer ${finalToken}` : undefined
      }
    });
    
    // Log headers for debugging
    // Add request interceptor for dynamic token check
    instance.interceptors.request.use(
      config => {
        // Check token again at request time (in case it was updated)
        const currentToken = localStorage.getItem('token');
        if (currentToken && (!config.headers.Authorization || config.headers.Authorization !== `Bearer ${currentToken}`)) {
          config.headers.Authorization = `Bearer ${currentToken}`;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle 401 errors
    instance.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          logout();
          window.location.href = '/login?error=session_expired';
        }
        return Promise.reject(error);
      }
    );

    return instance;
  };

  // Context value
  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
    getAuthAxios,
  };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
