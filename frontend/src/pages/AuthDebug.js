import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const AuthDebug = () => {
  const { currentUser, isAuthenticated, loading, error } = useContext(AuthContext);
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    // Collect debug information
    const token = localStorage.getItem('token');
    const userFromStorage = localStorage.getItem('user');
    
    setDebugInfo({
      token: token ? 'Present' : 'Missing',
      tokenLength: token ? token.length : 0,
      userFromStorage: userFromStorage ? JSON.parse(userFromStorage) : null,
      isAuthenticatedResult: isAuthenticated(),
      currentUserFromContext: currentUser,
      loading,
      error
    });
  }, [currentUser, isAuthenticated, loading, error]);
  const showHeaderCondition = () => {
    const condition1 = isAuthenticated();
    const condition2 = currentUser !== null;
    const condition3 = currentUser && currentUser.roles && (
      currentUser.roles.includes('Student') || 
      currentUser.roles.includes('ROLE_STUDENT') ||
      currentUser.roles.includes('Parent') ||
      currentUser.roles.includes('ROLE_PARENT')
    );
    
    return {
      condition1: `isAuthenticated(): ${condition1}`,
      condition2: `currentUser exists: ${condition2}`,
      condition3: `has STUDENT/PARENT role: ${condition3}`,
      shouldShowBlogButton: condition1 && condition2 && condition3
    };
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Authentication Debug Panel</h1>
        
        {/* Current State */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Current Authentication State</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-600 mb-2">Token Status</h3>
              <p className="text-sm">Token: <span className="font-mono">{debugInfo.token}</span></p>
              <p className="text-sm">Length: <span className="font-mono">{debugInfo.tokenLength}</span></p>
            </div>
            <div>
              <h3 className="font-medium text-gray-600 mb-2">Loading & Error</h3>
              <p className="text-sm">Loading: <span className="font-mono">{loading ? 'true' : 'false'}</span></p>
              <p className="text-sm">Error: <span className="font-mono">{error || 'none'}</span></p>
            </div>
          </div>
        </div>

        {/* User from localStorage */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">User from localStorage</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(debugInfo.userFromStorage, null, 2)}
          </pre>
        </div>

        {/* User from Context */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">User from AuthContext</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(debugInfo.currentUserFromContext, null, 2)}
          </pre>
        </div>

        {/* Header Button Logic */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Header "My Blog" Button Logic</h2>
          <div className="space-y-2">
            {Object.entries(showHeaderCondition()).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-gray-600">{key}:</span>
                <span className={`font-mono ${key === 'shouldShowBlogButton' && value ? 'text-green-600 font-bold' : 'text-gray-800'}`}>
                  {value.toString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Manual Tests */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Manual Tests</h2>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Reload Page
            </button>
            <button 
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }} 
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-3"
            >
              Clear Storage & Reload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthDebug;
