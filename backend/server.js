const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

// Create Express app
const app = express();

// Set port
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Proxy API requests to Java backend
app.use('/api', createProxyMiddleware({
  target: process.env.JAVA_BACKEND_URL || 'http://localhost:8080',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api' // No rewrite needed as paths match
  },
  onProxyReq: (proxyReq, req, res) => {
    // Log proxy requests
    console.log(`Proxying ${req.method} request to: ${proxyReq.path}`);
  }
}));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API requests are being proxied to ${process.env.JAVA_BACKEND_URL || 'http://localhost:8080'}`);
});
