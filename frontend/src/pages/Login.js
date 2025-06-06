import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  
  const { login, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // If user is already logged in, redirect to home
  React.useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setMessage('Please enter both username and password.');
      setMessageType('error');
      return;
    }
    
    try {
      const result = await login(username, password);
      
      if (result.success) {
        setMessage('Login successful! Redirecting...');
        setMessageType('success');
        
        // Redirect to home page after a short delay
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setMessage(result.message);
        setMessageType('error');
      }
    } catch (error) {
      setMessage('An error occurred during login. Please try again.');
      setMessageType('error');
      console.error('Login error:', error);
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
              <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800 transition-all">Forgot Password?</a>
            </div>

            <button 
              type="submit" 
              className="login-btn w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-all flex justify-center items-center"
            >
              <i className="fas fa-sign-in-alt mr-2"></i> Sign In
            </button>

            <div className="relative flex items-center justify-center mt-6 mb-6">
              <div className="absolute w-full border-t border-gray-300"></div>
              <div className="relative bg-white px-4 text-sm text-gray-500">Or continue with</div>
            </div>

            <button 
              type="button" 
              className="login-btn w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-all flex justify-center items-center"
            >
              <i className="fab fa-google mr-2"></i> Google
            </button>

            <p className="text-center mt-6 text-gray-600">
              Don't have an account? 
              <Link to="/register" className="text-indigo-600 font-medium hover:text-indigo-800 transition-all ml-1">
                Register here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;