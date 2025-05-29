import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the auth context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');
    
    if (token && userJson) {
      try {
        const user = JSON.parse(userJson);
        setCurrentUser(user);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
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
      
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
      
      return { success: true };
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
  const register = async (username, email, password, fullName) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/api/auth/signup', {
        username,
        email,
        password,
        fullName
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
    getAuthAxios
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};