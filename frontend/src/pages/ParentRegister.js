import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';
import axios from 'axios';

const ParentRegister = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    gender: '',
    address: '',
    emergencyContact: '',
    relationshipWithStudent: '',
    parentCode: '',
    studentCode: '',
    studentFullName: '',
    studentDateOfBirth: '',
    studentClass: ''
  });

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');
  const [registrationAttempts, setRegistrationAttempts] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.username || !formData.password || !formData.confirmPassword || 
        !formData.fullName || !formData.email || !formData.relationshipWithStudent ||
        !formData.parentCode || !formData.studentCode || !formData.studentFullName || !formData.studentDateOfBirth) {
      setMessage('Please fill in all required fields.');
      setMessageType('error');
      setSnackbarMessage('Please fill in all required fields.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match.');
      setMessageType('error');
      setSnackbarMessage('Passwords do not match. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return false;
    }

    if (formData.password.length < 6) {
      setMessage('Password must be at least 6 characters long.');
      setMessageType('error');
      setSnackbarMessage('Password must be at least 6 characters long.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage('Please enter a valid email address.');
      setMessageType('error');
      setSnackbarMessage('Please enter a valid email address.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post('/api/registration/parent', {
        username: formData.username,
        password: formData.password,
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        gender: formData.gender,
        address: formData.address,
        emergencyContact: formData.emergencyContact,
        relationshipWithStudent: formData.relationshipWithStudent,
        parentCode: formData.parentCode,
        studentCode: formData.studentCode,
        studentFullName: formData.studentFullName,
        studentDateOfBirth: formData.studentDateOfBirth,
        studentClass: formData.studentClass
      });

      if (response.data.success) {
        setMessage(response.data.message);
        setMessageType('success');
        setSnackbarMessage('Registration request submitted successfully! Please wait for admin approval.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setRegistrationAttempts(0);

        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        const newAttempts = registrationAttempts + 1;
        setRegistrationAttempts(newAttempts);
        
        setMessage(response.data.message);
        setMessageType('error');
        
        if (newAttempts >= 3) {
          setSnackbarMessage('Multiple registration failures detected. Please check your information carefully or contact support.');
          setSnackbarSeverity('warning');
        } else {
          setSnackbarMessage(response.data.message || 'Registration failed. Please check your information and try again.');
          setSnackbarSeverity('error');
        }
        setSnackbarOpen(true);
      }
    } catch (error) {
      const newAttempts = registrationAttempts + 1;
      setRegistrationAttempts(newAttempts);
      
      setMessage('An error occurred during registration. Please try again.');
      setMessageType('error');
      
      if (newAttempts >= 3) {
        setSnackbarMessage('System error during registration. Please try again later or contact support.');
        setSnackbarSeverity('error');
      } else {
        const errorMessage = error.response?.data?.message || 'An error occurred during registration. Please try again.';
        setSnackbarMessage(errorMessage);
        setSnackbarSeverity('error');
      }
      setSnackbarOpen(true);
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto login-container">
          <div className="text-center mb-8 animate-fadeIn">
            <h2 className="text-4xl font-bold mb-4">Parent Registration</h2>
            <p className="text-gray-600">Register to access your child's health information</p>
            <p className="text-sm text-orange-600 mt-2">
              Your registration will be reviewed by an administrator before approval
            </p>
          </div>

          {message && (
            <div className={`mb-6 text-center font-medium rounded-lg py-3 ${
              messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg">
            {/* Account Information */}
            <h3 className="text-xl font-semibold mb-4 text-indigo-600">Account Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="username">
                  <i className="fas fa-user text-indigo-500 mr-2"></i>Username *
                </label>
                <input 
                  type="text" 
                  id="username" 
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
                  <i className="fas fa-envelope text-indigo-500 mr-2"></i>Email *
                </label>
                <input 
                  type="email" 
                  id="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
                  <i className="fas fa-lock text-indigo-500 mr-2"></i>Password *
                </label>
                <input 
                  type="password" 
                  id="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter password (min 6 characters)"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="confirmPassword">
                  <i className="fas fa-lock text-indigo-500 mr-2"></i>Confirm Password *
                </label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>

            {/* Personal Information */}
            <h3 className="text-xl font-semibold mb-4 text-indigo-600 mt-8">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="fullName">
                  <i className="fas fa-id-card text-indigo-500 mr-2"></i>Full Name *
                </label>
                <input 
                  type="text" 
                  id="fullName" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="phoneNumber">
                  <i className="fas fa-phone text-indigo-500 mr-2"></i>Phone Number
                </label>
                <input 
                  type="tel" 
                  id="phoneNumber" 
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="gender">
                  <i className="fas fa-venus-mars text-indigo-500 mr-2"></i>Gender
                </label>
                <select 
                  id="gender" 
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="emergencyContact">
                  <i className="fas fa-phone-alt text-indigo-500 mr-2"></i>Emergency Contact
                </label>
                <input 
                  type="tel" 
                  id="emergencyContact" 
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Emergency contact number"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="address">
                <i className="fas fa-home text-indigo-500 mr-2"></i>Address
              </label>
              <textarea 
                id="address" 
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your full address"
              ></textarea>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="relationshipWithStudent">
                <i className="fas fa-heart text-indigo-500 mr-2"></i>Relationship with Student *
              </label>
              <select 
                id="relationshipWithStudent" 
                name="relationshipWithStudent"
                value={formData.relationshipWithStudent}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select Relationship</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Guardian">Guardian</option>
                <option value="Grandfather">Grandfather</option>
                <option value="Grandmother">Grandmother</option>
                <option value="Uncle">Uncle</option>
                <option value="Aunt">Aunt</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="parentCode">
                <i className="fas fa-id-card text-indigo-500 mr-2"></i>Parent Code *
              </label>
              <input 
                type="text" 
                id="parentCode" 
                name="parentCode"
                value={formData.parentCode}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your parent code (e.g., PAR001)"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                <i className="fas fa-info-circle mr-1"></i>
                This will be your unique parent identifier in the system
              </p>
            </div>

            {/* Student Information for Verification */}
            <h3 className="text-xl font-semibold mb-4 text-indigo-600 mt-8">Student Information (for verification)</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                <i className="fas fa-info-circle mr-2"></i>
                Please provide accurate student information to verify your relationship. 
                This information must match our school records.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="studentCode">
                  <i className="fas fa-id-badge text-indigo-500 mr-2"></i>Student Code *
                </label>
                <input 
                  type="text" 
                  id="studentCode" 
                  name="studentCode"
                  value={formData.studentCode}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter student code (e.g., STU001)"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="studentFullName">
                  <i className="fas fa-user-graduate text-indigo-500 mr-2"></i>Student Full Name *
                </label>
                <input 
                  type="text" 
                  id="studentFullName" 
                  name="studentFullName"
                  value={formData.studentFullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter student's full name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="studentDateOfBirth">
                  <i className="fas fa-calendar text-indigo-500 mr-2"></i>Student Date of Birth *
                </label>
                <input 
                  type="date" 
                  id="studentDateOfBirth" 
                  name="studentDateOfBirth"
                  value={formData.studentDateOfBirth}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="studentClass">
                  <i className="fas fa-chalkboard text-indigo-500 mr-2"></i>Student Class
                </label>
                <input 
                  type="text" 
                  id="studentClass" 
                  name="studentClass"
                  value={formData.studentClass}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter student's class (e.g., 5A)"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out"
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Submitting Registration...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane mr-2"></i>
                  Submit Registration Request
                </>
              )}
            </button>

            <div className="text-center mt-6">
              <p className="text-gray-600">
                Already have an account? 
                <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-semibold ml-1">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </section>
  );
};

export default ParentRegister;
