# Simple CORS and Auth Fix Script
# This is a simplified version of the fix-cors-auth.ps1 script

Write-Host "Simple CORS and Auth Fix Utility" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan

# Step 1: Update setupProxy.js file
Write-Host "Updating setupProxy.js..." -ForegroundColor Yellow
$setupProxyPath = "frontend/src/setupProxy.js"

$proxyContent = @'
/**
 * Custom proxy configuration for Create React App development server
 * This file is automatically recognized by Create React App
 */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Simple proxy configuration that tries both ports
  app.use(
    '/api',
    createProxyMiddleware({
      // Primary target port - matches application.properties
      target: 'http://localhost:8081',
      changeOrigin: true,
      secure: false,
      // Basic request logging
      onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying ${req.method} ${req.path} to ${proxyReq.path}`);
      },
      // Log response status codes
      onProxyRes: (proxyRes, req, res) => {
        console.log(`Received ${proxyRes.statusCode} from backend for ${req.method} ${req.path}`);
      },
      // Handle proxy errors by showing a message
      onError: (err, req, res) => {
        console.log(`Backend connection error: ${err.message}`);
        
        if (!res.headersSent) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            error: 'Backend Unavailable',
            message: 'Could not connect to backend server. Please ensure it is running.'
          }));
        }
      }
    })
  );
};
'@

Set-Content -Path $setupProxyPath -Value $proxyContent -Encoding UTF8
Write-Host "setupProxy.js updated successfully" -ForegroundColor Green

# Step 2: Update application.properties for CORS
Write-Host "`nUpdating application.properties..." -ForegroundColor Yellow
$appPropsPath = "backend/main/resources/application.properties"

if (Test-Path $appPropsPath) {
    $appProps = Get-Content -Path $appPropsPath -Raw
    
    # Check for existing CORS config
    if (-not ($appProps -match "spring.web.cors")) {
        $corsProps = @"

# CORS Configuration
spring.web.cors.allowed-origins=http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*
spring.web.cors.allow-credentials=true
spring.web.cors.max-age=3600
"@
        Add-Content -Path $appPropsPath -Value $corsProps
        Write-Host "CORS configuration added to application.properties" -ForegroundColor Green
    } else {
        Write-Host "CORS configuration already exists in application.properties" -ForegroundColor Green
    }
} else {
    Write-Host "application.properties file not found" -ForegroundColor Red
}

Write-Host "`nCORS configuration complete!" -ForegroundColor Green
Write-Host "Next steps:"
Write-Host "1. Restart the backend server: .\start-backend.bat"
Write-Host "2. Restart the frontend server: .\start-frontend.bat"
Write-Host "3. Try logging in with: username=parent.smith, password=Password123"
