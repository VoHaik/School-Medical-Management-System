import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, Typography, Paper, Alert, CircularProgress } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import axiosWithAuth from '../utils/axiosWithAuth';

// Debugging component for authorization issues
const AuthDebugger = () => {
  const { currentUser, getAuthAxios } = useContext(AuthContext);
  const [tokenInfo, setTokenInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [error, setError] = useState(null);
  
  // Function to decode JWT token (client-side only, not secure for sensitive operations)
  const decodeJwt = (token) => {
    try {
      if (!token) return null;
      
      // Split the token and get the payload part (second part)
      const base64Url = token.split('.')[1];
      if (!base64Url) return null;
      
      // Convert base64 to base64url by replacing characters
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      
      // Decode the base64 string and parse JSON
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      return JSON.parse(jsonPayload);
    } catch (err) {
      console.error('Error decoding JWT:', err);
      return null;
    }
  };
  
  // Get token information when component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = decodeJwt(token);
      setTokenInfo({
        token: token.substring(0, 20) + '...',
        decoded: decoded,
        exp: decoded?.exp ? new Date(decoded.exp * 1000).toLocaleString() : 'Not found'
      });
    }
  }, []);
  
  // Test API endpoints to debug authorization
  const runAuthTest = async () => {
    setLoading(true);
    setError(null);
    setTestResult(null);
    
    try {
      // Get authenticated axios instance
      const authAxios = getAuthAxios();
      
      // Log the headers being sent
      console.log('Headers for request:', authAxios.defaults.headers);
      
      // Test the /api/auth/me endpoint
      const meResponse = await authAxios.get('/api/auth/me');
      
      // Test health checkup events endpoint
      const eventsResponse = await authAxios.get('/api/health-checkup-events');
      
      // Save test results
      setTestResult({
        me: meResponse.data,
        events: eventsResponse.data,
        timestamp: new Date().toLocaleString()
      });
    } catch (err) {
      console.error('Authorization test failed:', err);
      setError({
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Test event creation
  const testCreateEvent = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const authAxios = getAuthAxios();
      
      // Create a test event
      const testEvent = {
        eventName: "Test Event " + new Date().toLocaleString(),
        eventType: "HEALTH_CHECKUP",
        description: "This is a test event created for debugging.",
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        location: "Test Location",
        typesOfCheckups: ["VISION", "HEARING"],
        targetGradeLevels: "Grade 1",
        classesToNotify: []
      };
      
      console.log('Creating test event:', testEvent);
      console.log('Headers:', authAxios.defaults.headers);
      
      const response = await authAxios.post('/api/health-checkup-events', testEvent);
      
      setTestResult((prev) => ({
        ...prev,
        createdEvent: response.data,
        createSuccess: true,
        createTimestamp: new Date().toLocaleString()
      }));
    } catch (err) {
      console.error('Event creation test failed:', err);
      setError({
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
      });
      
      setTestResult((prev) => ({
        ...prev,
        createSuccess: false,
        createError: err.message,
        createTimestamp: new Date().toLocaleString()
      }));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box sx={{ p: 3, maxWidth: '800px', mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>Trang Kiểm Tra Xác Thực</Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Thông Tin Người Dùng Hiện Tại</Typography>
        {currentUser ? (
          <Box>
            <Typography><strong>Username:</strong> {currentUser.username}</Typography>
            <Typography><strong>Email:</strong> {currentUser.email}</Typography>
            <Typography><strong>Full Name:</strong> {currentUser.fullName}</Typography>
            <Typography><strong>Roles:</strong> {currentUser.roles?.join(', ') || 'No roles'}</Typography>
          </Box>
        ) : (
          <Alert severity="warning">Không có người dùng nào đăng nhập</Alert>
        )}
      </Paper>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Thông Tin Token</Typography>
        {tokenInfo ? (
          <Box>
            <Typography><strong>Token:</strong> {tokenInfo.token}</Typography>
            <Typography><strong>Subject:</strong> {tokenInfo.decoded?.sub || 'Not found'}</Typography>
            <Typography><strong>Roles in Token:</strong> {tokenInfo.decoded?.roles?.join(', ') || 'Not found'}</Typography>
            <Typography><strong>User ID:</strong> {tokenInfo.decoded?.userId || 'Not found'}</Typography>
            <Typography><strong>Expiration:</strong> {tokenInfo.exp}</Typography>
          </Box>
        ) : (
          <Alert severity="warning">Không tìm thấy token JWT</Alert>
        )}
      </Paper>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={runAuthTest}
          disabled={loading || !currentUser}
        >
          Kiểm Tra API Xác Thực
        </Button>
        
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={testCreateEvent}
          disabled={loading || !currentUser}
        >
          Thử Tạo Sự Kiện
        </Button>
      </Box>
      
      {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      
      {error && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: '#fff4f4' }}>
          <Typography variant="h6" color="error">Lỗi Gặp Phải</Typography>
          <Typography><strong>Message:</strong> {error.message}</Typography>
          <Typography><strong>Status:</strong> {error.status} {error.statusText}</Typography>
          <Box sx={{ mt: 1 }}>
            <Typography><strong>Response Data:</strong></Typography>
            <pre style={{ overflow: 'auto', maxHeight: '200px', padding: '8px', background: '#f5f5f5' }}>
              {JSON.stringify(error.data, null, 2)}
            </pre>
          </Box>
        </Paper>
      )}
      
      {testResult && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" color="primary">Kết Quả Kiểm Tra</Typography>
          <Typography><strong>Timestamp:</strong> {testResult.timestamp}</Typography>
          
          {testResult.me && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Thông Tin Người Dùng từ API:</Typography>
              <Typography><strong>Username:</strong> {testResult.me.username}</Typography>
              <Typography><strong>Email:</strong> {testResult.me.email}</Typography>
              <Typography><strong>Roles:</strong> {testResult.me.roles?.join(', ') || 'None'}</Typography>
            </Box>
          )}
          
          {testResult.events && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Sự Kiện Y Tế:</Typography>
              <Typography><strong>Số lượng sự kiện:</strong> {testResult.events.length}</Typography>
            </Box>
          )}
          
          {testResult.createSuccess !== undefined && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">
                Kết quả tạo sự kiện: {testResult.createSuccess ? (
                  <span style={{ color: 'green' }}>Thành công</span>
                ) : (
                  <span style={{ color: 'red' }}>Thất bại - {testResult.createError}</span>
                )}
              </Typography>
              {testResult.createdEvent && (
                <Typography><strong>ID sự kiện tạo mới:</strong> {testResult.createdEvent.eventId}</Typography>
              )}
              <Typography><strong>Thời gian:</strong> {testResult.createTimestamp}</Typography>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default AuthDebugger;
