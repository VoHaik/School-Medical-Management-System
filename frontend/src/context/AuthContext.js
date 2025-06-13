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
      const token = localStorage.getItem('token');
      const userJson = localStorage.getItem('user');

      if (token && userJson) {
        try {
          const user = JSON.parse(userJson);

          // Create an axios instance with the token
          const instance = axios.create({
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          // Make a request to the auth/me endpoint to validate the token
          try {
            const response = await instance.get('/api/auth/me');
            // If the request succeeds, the token is valid
            // Update user data with the latest from the server
            const { id, username, email, fullName, roles } = response.data;
            const updatedUser = {
              id,
              username,
              email,
              fullName,
              roles
            };
            console.log('Token validation successful, user data:', updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setCurrentUser(updatedUser);
          } catch (error) {
            console.error('Token validation failed:', error);
            // If the request fails with 401, the token is invalid or expired
            if (error.response && error.response.status === 401) {
              console.log('Token expired or invalid, clearing storage');
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setCurrentUser(null);
            }
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }

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

      const { token, id, username: userName, email, fullName, roles } = response.data;

      // Store token and user info
      localStorage.setItem('token', token);
      const user = {
        id,
        username: userName,
        email,
        fullName,
        roles
      };

      console.log('Login successful, user data:', user);
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);

      return { success: true, user: user }; // MODIFIED: return user object
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

    const instance = axios.create({
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    // Add response interceptor to handle 401 errors
    instance.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          logout();
          window.location.href = '/login';
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
