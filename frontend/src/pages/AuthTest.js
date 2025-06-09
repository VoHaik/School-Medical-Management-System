import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AuthTest = () => {
  const { login, register, logout, currentUser, loading, error } = useContext(AuthContext);
  const [testResults, setTestResults] = useState([]);
  
  const addTestResult = (test, result, success = true) => {
    setTestResults(prev => [...prev, {
      timestamp: new Date().toLocaleTimeString(),
      test,
      result,
      success
    }]);
  };

  const testRegistration = async () => {
    try {
      const testUser = {
        username: `testuser_${Date.now()}`,
        email: `test_${Date.now()}@example.com`,
        password: 'Password123',
        fullName: 'Test User',
        phone: '123-456-7890',
        role: 'Student'
      };

      const result = await register(
        testUser.username,
        testUser.email,
        testUser.password,
        testUser.fullName,
        testUser.phone,
        testUser.role
      );

      addTestResult('Registration Test', result, result.success);
      
      // Store test user for login test
      if (result.success) {
        sessionStorage.setItem('testUser', JSON.stringify({
          username: testUser.username,
          password: testUser.password
        }));
      }
    } catch (err) {
      addTestResult('Registration Test', { error: err.message }, false);
    }
  };

  const testLogin = async () => {
    try {
      const testUser = JSON.parse(sessionStorage.getItem('testUser') || '{}');
      
      if (!testUser.username) {
        addTestResult('Login Test', { error: 'No test user found. Run registration test first.' }, false);
        return;
      }

      const result = await login(testUser.username, testUser.password);
      addTestResult('Login Test', result, result.success);
    } catch (err) {
      addTestResult('Login Test', { error: err.message }, false);
    }
  };

  const testLogout = () => {
    logout();
    addTestResult('Logout Test', { message: 'User logged out successfully' });
  };

  const checkAuthStatus = () => {
    const status = {
      isAuthenticated: !!currentUser,
      currentUser: currentUser,
      token: localStorage.getItem('token'),
      loading: loading,
      error: error
    };
    addTestResult('Auth Status Check', status);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">React Authentication Test</h1>
      
      {/* Current Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">Current Authentication Status</h2>
        <div className="space-y-2">
          <p><strong>Authenticated:</strong> {currentUser ? 'Yes' : 'No'}</p>
          {currentUser && (
            <>
              <p><strong>Username:</strong> {currentUser.username}</p>
              <p><strong>Email:</strong> {currentUser.email}</p>
              <p><strong>Full Name:</strong> {currentUser.fullName}</p>
              <p><strong>Roles:</strong> {currentUser.roles?.join(', ')}</p>
            </>
          )}
          <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
          {error && <p className="text-red-600"><strong>Error:</strong> {error}</p>}
        </div>
      </div>

      {/* Test Controls */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <button
            onClick={testRegistration}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Test Registration
          </button>
          <button
            onClick={testLogin}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Test Login
          </button>
          <button
            onClick={testLogout}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Test Logout
          </button>
          <button
            onClick={checkAuthStatus}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
          >
            Check Status
          </button>
          <button
            onClick={clearResults}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Clear Results
          </button>
        </div>
      </div>

      {/* Test Results */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Test Results</h2>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {testResults.length === 0 ? (
            <p className="text-gray-500">No test results yet. Run some tests above.</p>
          ) : (
            testResults.map((result, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${
                  result.success 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{result.test}</h3>
                  <span className="text-sm text-gray-500">{result.timestamp}</span>
                </div>
                <pre className="text-sm bg-white p-3 rounded border overflow-x-auto">
                  {JSON.stringify(result.result, null, 2)}
                </pre>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthTest;
