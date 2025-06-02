import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentProfile from './pages/StudentProfile';
import StudentBlog from './pages/StudentBlog';
import { AuthProvider } from './context/AuthContext';

// Prevent direct execution with Node.js
if (typeof window === 'undefined') {
  console.error(
    'Error: This file contains JSX and is intended to be run with React.\n' +
    'Please use the correct method to run this application:\n' +
    '1. Navigate to the frontend directory: cd frontend\n' +
    '2. Run the React development server: npm start\n' +
    'For more information, please refer to the README.md file.'
  );
  process.exit(1);
}

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/student-profile" element={
              <ProtectedRoute>
                <StudentProfile />
              </ProtectedRoute>
            } />
            <Route path="/student-blog" element={
              <ProtectedRoute>
                <StudentBlog />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

// Protected route component to handle authentication
function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('token') !== null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default App;
