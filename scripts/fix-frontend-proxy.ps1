# Fix Frontend Proxy Configuration
# This script updates the setupProxy.js file to handle multiple port scenarios

Write-Host "Frontend Proxy Configuration Fix" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan

$setupProxyPath = "frontend/src/setupProxy.js"

if (-not (Test-Path $setupProxyPath)) {
    Write-Host "Error: setupProxy.js not found at $setupProxyPath" -ForegroundColor Red
    exit 1
}

# Backup the existing file
$backupPath = "$setupProxyPath.backup"
Copy-Item -Path $setupProxyPath -Destination $backupPath -Force
Write-Host "Created backup at $backupPath" -ForegroundColor Green

# Replace with the new proxy configuration
$newContent = @'
/**
 * Custom proxy configuration for Create React App development server
 * This file supports both 8080 and 8081 port configurations with automatic fallback
 */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  console.log('Setting up advanced proxy middleware for development server');
  
  // Configure both ports that the backend might be using
  const ports = [8081, 8080];
  
  // Track the currently working port to minimize retries
  let currentPort = ports[0];
  let lastSuccessTime = 0;
  let consecutiveFailures = 0;
  
  // Request logging middleware
  app.use((req, res, next) => {
    // Only log API requests to avoid noise
    if (req.path.startsWith('/api')) {
      console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
    }
    next();
  });
  
  // Create a function to generate proxy middleware with the current port
  const createPortSpecificProxy = (port) => {
    return createProxyMiddleware({
      target: `http://localhost:${port}`,
      changeOrigin: true,
      secure: false,
      
      // Add consistent headers for debugging
      onProxyReq: (proxyReq, req, res) => {
        // Add custom headers that might help with debugging
        proxyReq.setHeader('X-Frontend-Request-ID', Math.random().toString(36).substring(2, 15));
        
        if (req.path.includes('/auth')) {
          console.log(`Auth request to port ${port}: ${req.method} ${req.path}`);
        } else {
          console.log(`API request to port ${port}: ${req.method} ${req.path}`);
        }
      },
      
      // Log the response
      onProxyRes: (proxyRes, req, res) => {
        // Update tracking on successful responses
        lastSuccessTime = Date.now();
        consecutiveFailures = 0;
        currentPort = port;
        
        if (req.path.includes('/auth')) {
          console.log(`Auth response from port ${port}: ${proxyRes.statusCode} for ${req.path}`);
        } else {
          console.log(`API response from port ${port}: ${proxyRes.statusCode} for ${req.path}`);
        }
      },
      
      // Handle connection failures
      onError: (err, req, res) => {
        console.error(`Connection to port ${port} failed: ${err.message}`);
        consecutiveFailures++;
        
        // If this port has failed multiple times or the last success was too long ago,
        // try the next port
        if (consecutiveFailures > 3 || (Date.now() - lastSuccessTime) > 30000) {
          // Find the next port to try
          const currentIndex = ports.indexOf(port);
          const nextPort = ports[(currentIndex + 1) % ports.length];
          
          console.log(`Switching from port ${port} to ${nextPort} after ${consecutiveFailures} failures`);
          
          // Create a proxy for the next port and try the request again
          const nextProxy = createPortSpecificProxy(nextPort);
          
          // Reset tracking for the new port
          currentPort = nextPort;
          consecutiveFailures = 0;
          
          return nextProxy(req, res);
        }
        
        // If we've tried all ports or we're not ready to switch yet, return an error
        if (!res.headersSent) {
          res.writeHead(503, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: 'Backend Unavailable',
            message: 'Could not connect to the backend server. Please ensure it is running.',
            details: err.message
          }));
        }
      }
    });
  };
  
  // Create the initial proxy middleware with the current port
  const apiProxy = createPortSpecificProxy(currentPort);
  
  // Apply the proxy middleware to all API routes
  app.use('/api', apiProxy);
  
  console.log(`API proxy configured for ports: ${ports.join(', ')}`);
};
'@

# Write the new content
Set-Content -Path $setupProxyPath -Value $newContent
Write-Host "`nUpdated setupProxy.js with robust multi-port configuration" -ForegroundColor Green

# Restart instructions
Write-Host "`nTo apply changes:" -ForegroundColor Yellow
Write-Host "1. Run the start-with-java17.ps1 script to start the backend with Java 17+" -ForegroundColor White
Write-Host "2. Restart the React frontend with: cd frontend && npm start" -ForegroundColor White
Write-Host "`nIf you still experience issues, open the browser console to check for network errors" -ForegroundColor Yellow
