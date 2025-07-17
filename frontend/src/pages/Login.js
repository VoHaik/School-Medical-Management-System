import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Snackbar, Alert } from '@mui/material';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');
  
  const { login, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // If user is already logged in, redirect to home
  React.useEffect(() => {
    if (currentUser) {
      // Redirect based on role if currentUser is available
      if (currentUser.roles && (currentUser.roles.includes('Parent') || currentUser.roles.includes('ROLE_PARENT'))) {
        navigate('/');
      } else {
        navigate('/'); // Default redirect for other roles or if role is not yet defined
      }
    }
  }, [currentUser, navigate]);

  // Check if there are stored failed attempts
  useEffect(() => {
    const storedAttempts = localStorage.getItem('failedLoginAttempts');
    if (storedAttempts) {
      const attempts = parseInt(storedAttempts, 10);
      setFailedAttempts(attempts);
      
      // If there are recent failed attempts, show a notification
      if (attempts > 0) {
        const lastAttemptTime = localStorage.getItem('lastFailedLoginTime');
        const now = new Date().getTime();
        
        // Only show notification if the last attempt was within the past hour
        if (lastAttemptTime && now - parseInt(lastAttemptTime, 10) < 60 * 60 * 1000) {
          setSnackbarMessage(`Warning: ${attempts} failed login attempt${attempts > 1 ? 's' : ''} detected`);
          setSnackbarSeverity('warning');
          setSnackbarOpen(true);
        }
      }
    }
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setMessage('Please enter both username and password.');
      setMessageType('error');
      return;
    }
    
    try {
      const result = await login(username, password);
      
      if (result.success && result.user) { // MODIFIED: check for result.user
        // Reset failed attempts if login is successful
        setFailedAttempts(0);
        localStorage.removeItem('failedLoginAttempts');
        localStorage.removeItem('lastFailedLoginTime');
        
        setMessage('Login successful! Redirecting...');
        setMessageType('success');
        
        setSnackbarMessage('Login successful! Welcome back.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        
        // Redirect based on role
        // setTimeout(() => { // MODIFIED: Removed setTimeout for immediate redirection based on role
          if (result.user.roles && (result.user.roles.includes('Parent') || result.user.roles.includes('ROLE_PARENT'))) {
            navigate('/');
          } else {
            navigate('/'); // Default redirect for other roles
          }
        // }, 1500); // MODIFIED: Removed setTimeout
      } else {
        // Increment and store failed attempts
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        localStorage.setItem('failedLoginAttempts', newAttempts);
        localStorage.setItem('lastFailedLoginTime', new Date().getTime().toString());
        
        setMessage(result.message);
        setMessageType('error');
        
        // Display different messages depending on the number of failed attempts
        if (newAttempts >= 5) {
          setSnackbarMessage('Security Alert: Multiple failed login attempts detected! Account may be temporarily locked for security.');
          setSnackbarSeverity('error');
        } else if (newAttempts >= 3) {
          setSnackbarMessage(`Warning: ${newAttempts} failed login attempts. Please verify your credentials carefully.`);
          setSnackbarSeverity('warning');
        } else {
          setSnackbarMessage('Login failed. Please check your credentials and try again.');
          setSnackbarSeverity('error');
        }
        setSnackbarOpen(true);
      }
    } catch (error) {
      // Also count system errors as failed attempts
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      localStorage.setItem('failedLoginAttempts', newAttempts);
      localStorage.setItem('lastFailedLoginTime', new Date().getTime().toString());
      
      setMessage('An error occurred during login. Please try again.');
      setMessageType('error');
      setSnackbarMessage('Login failed due to a system error. Please try again later.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      // console.error('Login error:', error);
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto login-container">
          <div className="text-center mb-8 animate-fadeIn">
            <h2 className="text-4xl font-bold mb-4">Account Access</h2>
            <p className="text-gray-600">Sign in to access your health management dashboard</p>
          </div>

          {message && (
            <div className={`mb-6 text-center font-medium rounded-lg py-3 ${
              messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg">
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="username">
                <i className="fas fa-user text-indigo-500 mr-2"></i>Username/Email
              </label>
              <input 
                type="text" 
                id="username" 
                className="form-input w-full p-3 border border-gray-300 rounded-lg focus:outline-none" 
                placeholder="Enter your username or email" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required 
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
                <i className="fas fa-lock text-indigo-500 mr-2"></i>Password
              </label>
              <input 
                type="password" 
                id="password" 
                className="form-input w-full p-3 border border-gray-300 rounded-lg focus:outline-none" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="remember" 
                  className="h-4 w-4 text-indigo-600"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600">Remember me</label>
              </div>
              <Link to="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-800 transition-all">Forgot Password?</Link>
            </div>

            <button 
              type="submit" 
              className="login-btn w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-all flex justify-center items-center"
            >
              <i className="fas fa-sign-in-alt mr-2"></i> Sign In
            </button>

            <p className="text-center mt-6 text-gray-600">
              Don't have an account? 
              <Link to="/parent-registration" className="text-indigo-600 font-medium hover:text-indigo-800 transition-all ml-1">
                Register as Parent
              </Link>
            </p>
          </form>
        </div>
      </div>
      
      {/* Notification Snackbar for failed login attempts */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </section>
  );
};

export default Login;