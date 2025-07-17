import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Snackbar, Alert } from '@mui/material';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    role: 'Student' // Đặt giá trị mặc định thành 'Student'
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');
  const [registrationAttempts, setRegistrationAttempts] = useState(0);

  const { register, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // If user is already logged in, redirect to home
  React.useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword || !formData.fullName) {
      setMessage('Please fill in all fields.');
      setMessageType('error');
      setSnackbarMessage('Please fill in all required fields.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match.');
      setMessageType('error');
      setSnackbarMessage('Passwords do not match. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (formData.password.length < 6) {
      setMessage('Password must be at least 6 characters long.');
      setMessageType('error');
      setSnackbarMessage('Password must be at least 6 characters long.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      const result = await register(formData.username, formData.email, formData.password, formData.fullName, formData.phone, formData.role);

      if (result.success) {
        setMessage(result.message || 'Registration successful! Please login.');
        setMessageType('success');
        setSnackbarMessage('Registration successful! Redirecting to login page...');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setRegistrationAttempts(0);

        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        // Increment failed registration attempts
        const newAttempts = registrationAttempts + 1;
        setRegistrationAttempts(newAttempts);
        
        setMessage(result.message);
        setMessageType('error');
        
        // Display different messages based on the number of failed attempts
        if (newAttempts >= 3) {
          setSnackbarMessage(`Multiple registration failures detected. Please check your information carefully or contact support.`);
          setSnackbarSeverity('warning');
        } else {
          setSnackbarMessage(result.message || 'Registration failed. Please check your information and try again.');
          setSnackbarSeverity('error');
        }
        setSnackbarOpen(true);
      }
    } catch (error) {
      // Also count system errors as failed attempts
      const newAttempts = registrationAttempts + 1;
      setRegistrationAttempts(newAttempts);
      
      setMessage('An error occurred during registration. Please try again.');
      setMessageType('error');
      
      // Display different messages based on the number of failed attempts
      if (newAttempts >= 3) {
        setSnackbarMessage(`System error during registration. Please try again later or contact support.`);
        setSnackbarSeverity('error');
      } else {
        setSnackbarMessage('An error occurred during registration. Please try again.');
        setSnackbarSeverity('error');
      }
      setSnackbarOpen(true);
      console.error('Registration error:', error);
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto login-container">
          <div className="text-center mb-8 animate-fadeIn">
            <h2 className="text-4xl font-bold mb-4">Create Account</h2>
            <p className="text-gray-600">Join FPT Junior High School Health Management System</p>
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
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="fullName">
                <i className="fas fa-user text-indigo-500 mr-2"></i>Full Name
              </label>
              <input 
                type="text" 
                id="fullName" 
                name="fullName"
                className="form-input w-full p-3 border border-gray-300 rounded-lg focus:outline-none" 
                placeholder="Enter your full name" 
                value={formData.fullName}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="username">
                <i className="fas fa-user-tag text-indigo-500 mr-2"></i>Username
              </label>
              <input 
                type="text" 
                id="username" 
                name="username"
                className="form-input w-full p-3 border border-gray-300 rounded-lg focus:outline-none" 
                placeholder="Choose a username" 
                value={formData.username}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
                <i className="fas fa-envelope text-indigo-500 mr-2"></i>Email
              </label>
              <input 
                type="email" 
                id="email" 
                name="email"
                className="form-input w-full p-3 border border-gray-300 rounded-lg focus:outline-none" 
                placeholder="Enter your email address" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="phone">
                <i className="fas fa-phone text-indigo-500 mr-2"></i>Phone Number
              </label>
              <input 
                type="tel" 
                id="phone" 
                name="phone"
                className="form-input w-full p-3 border border-gray-300 rounded-lg focus:outline-none" 
                placeholder="Enter your phone number (optional)" 
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
                <i className="fas fa-lock text-indigo-500 mr-2"></i>Password
              </label>
              <input 
                type="password" 
                id="password" 
                name="password"
                className="form-input w-full p-3 border border-gray-300 rounded-lg focus:outline-none" 
                placeholder="Create a password" 
                value={formData.password}
                onChange={handleChange}
                required 
              />
              <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="confirmPassword">
                <i className="fas fa-lock text-indigo-500 mr-2"></i>Confirm Password
              </label>
              <input 
                type="password" 
                id="confirmPassword" 
                name="confirmPassword"
                className="form-input w-full p-3 border border-gray-300 rounded-lg focus:outline-none" 
                placeholder="Confirm your password" 
                value={formData.confirmPassword}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="role">
                <i className="fas fa-user-tag text-indigo-500 mr-2"></i>Role
              </label>
              <select
                id="role"
                name="role"
                className="form-select w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="Student">Student</option>
                <option value="Parent">Parent</option>
                <option value="SchoolNurse">School Nurse</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Select your role in the system</p>
            </div>

            <button 
              type="submit" 
              className="login-btn w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-all flex justify-center items-center"
            >
              <i className="fas fa-user-plus mr-2"></i> Create Account
            </button>

            <p className="text-center mt-6 text-gray-600">
              Already have an account? 
              <Link to="/login" className="text-indigo-600 font-medium hover:text-indigo-800 transition-all ml-1">
                Sign in here
              </Link>
            </p>
          </form>
        </div>
      </div>
      
      {/* Snackbar for notifications */}
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

export default Register;
