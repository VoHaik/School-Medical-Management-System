# Fix CORS and Authentication Issues Script
# This script helps fix CORS and authentication issues in the School Medical Management System

Write-Host "School Medical Management System - CORS & Authentication Fix Utility" -ForegroundColor Cyan
Write-Host "=============================================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: First kill any existing processes
Write-Host "Killing any existing processes..." -ForegroundColor Yellow
.\kill-all-ports.ps1

# Step 2: Wait a moment for processes to fully terminate
Start-Sleep -Seconds 2

# Step 3: Check if frontend setupProxy.js file exists and update it if needed
Write-Host "`nChecking and updating frontend proxy configuration..." -ForegroundColor Yellow
$setupProxyPath = "frontend/src/setupProxy.js"

if (Test-Path $setupProxyPath) {
    Write-Host "Found setupProxy.js file. Updating to handle CORS properly..." -ForegroundColor Green
    $proxyContent = @'
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Log all proxy activity
  const loggerFn = (req, res, next) => {
    console.log(`Proxy request: ${req.method} ${req.path}`);
    next();
  };

  // Create proxy middleware for /api endpoints
  const apiProxy = createProxyMiddleware({
    target: 'http://localhost:8081',  // Default primary target
    changeOrigin: true,
    secure: false,
    onProxyReq: (proxyReq, req, res) => {
      // Log the request headers for debugging
      console.log(`Proxying ${req.method} ${req.url} to ${proxyReq.host}`);
    },
    onProxyRes: (proxyRes, req, res) => {
      // Log response status
      console.log(`Received ${proxyRes.statusCode} from proxy for ${req.method} ${req.url}`);
    },
    onError: (err, req, res) => {
      // Try the secondary port if primary fails
      console.log(`Error connecting to primary backend. Error: ${err.message}`);
      console.log(`Retrying with secondary port 8080...`);
      
      // Update the proxy target to use the secondary port
      apiProxy.options.target = 'http://localhost:8080';
      console.log(`Proxy target updated to ${apiProxy.options.target}`);
    }
  });

  // Apply the middleware
  app.use(loggerFn);
  app.use('/api', apiProxy);
};
'@

    Set-Content -Path $setupProxyPath -Value $proxyContent -Encoding UTF8
} else {
    Write-Host "setupProxy.js file not found. Creating file..." -ForegroundColor Yellow
    New-Item -Path "frontend/src" -Name "setupProxy.js" -ItemType "file" -Value $proxyContent -Force
}

# Step 4: Update application.properties to ensure CORS configuration
Write-Host "`nUpdating application.properties for CORS support..." -ForegroundColor Yellow
$appPropsPath = "backend/main/resources/application.properties"

if (Test-Path $appPropsPath) {
    $appProps = Get-Content -Path $appPropsPath -Raw
    
    # Add CORS settings if they don't exist
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
        Write-Host "Added CORS configuration to application.properties" -ForegroundColor Green
    } else {
        Write-Host "CORS configuration already exists in application.properties" -ForegroundColor Green
    }
} else {
    Write-Host "application.properties file not found at $appPropsPath" -ForegroundColor Red
}

# Step 5: Rebuild and start the backend
Write-Host "`nRebuilding and starting the backend..." -ForegroundColor Yellow
Start-Process -FilePath "java" -ArgumentList "-jar", "backend/target/SWP391-Project-1.0-SNAPSHOT.jar" -WindowStyle Normal

# Step 6: Wait for backend to start
Write-Host "Waiting 15 seconds for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Step 7: Verify backend is running and provide instructions
Write-Host "`nVerifying backend status..." -ForegroundColor Yellow
try {
    $backendUrl = "http://localhost:8081/api/test/health"
    $response = Invoke-WebRequest -Uri $backendUrl -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "Backend is up and running on port 8081! Status code: $($response.StatusCode)" -ForegroundColor Green
    $port = 8081
} catch {
    try {
        $backendUrl = "http://localhost:8080/api/test/health" 
        $response = Invoke-WebRequest -Uri $backendUrl -Method GET -TimeoutSec 5 -ErrorAction Stop
        Write-Host "Backend is up and running on port 8080! Status code: $($response.StatusCode)" -ForegroundColor Green
        $port = 8080
    } catch {
        Write-Host "Backend does not appear to be running on either port." -ForegroundColor Red
    }
}

# Step 8: Instructions
Write-Host "`nCORS Fix Complete!" -ForegroundColor Cyan
Write-Host "Next steps:" -ForegroundColor White
Write-Host "1. Run the frontend with: npm start (in the frontend directory)" -ForegroundColor White
Write-Host "2. Try logging in with: username=parent.smith, password=Password123" -ForegroundColor White
Write-Host "3. If issues persist, run test-cors-auth.ps1 for detailed diagnostics" -ForegroundColor White
Write-Host "4. Check browser console for any remaining CORS errors" -ForegroundColor White
