# Comprehensive Fix for Backend-Frontend Connection Issues
# This script addresses common issues with backend-frontend connectivity

Write-Host "Comprehensive Backend-Frontend Connection Fix" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan

# Step 1: Kill any processes that might interfere
Write-Host "`nStep 1: Stopping any processes using ports 3000, 8080, and 8081..." -ForegroundColor Yellow

$portsToCheck = @(3000, 8080, 8081)
foreach ($port in $portsToCheck) {
    $processes = netstat -ano | findstr ":$port " | ForEach-Object {
        $parts = $_ -split '\s+'
        if ($parts.Length -ge 5) {
            $parts[4] # PID
        }
    }
    
    foreach ($pid in $processes) {
        if ($pid -and $pid -match '^\d+$') {
            try {
                $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
                if ($process) {
                    Write-Host "Stopping process $($process.Name) (PID $pid) using port $port" -ForegroundColor Yellow
                    Stop-Process -Id $pid -Force
                }            } catch {
                Write-Host "Error stopping process with PID $pid: $($_.Exception)" -ForegroundColor Red
            }
        }
    }
}

# Step 2: Check Java version and fix CORS configuration
Write-Host "`nStep 2: Checking Java version..." -ForegroundColor Yellow

$javaVersion = $null
try {
    $versionOutput = java -version 2>&1
    $javaVersion = $versionOutput | Select-String -Pattern "version" | Select-Object -First 1
    
    # Check Java version
    if ($javaVersion -match "version `"(\d+)" -or $javaVersion -match "version `"1\.(\d+)") {
        $majorVersion = [int]$Matches[1]
        
        if ($majorVersion -lt 17) {
            Write-Host "Warning: Java $majorVersion detected. This application requires Java 17+." -ForegroundColor Red
            Write-Host "Please run the start-with-java17.ps1 script to use the correct Java version." -ForegroundColor Yellow
        } else {
            Write-Host "Java $majorVersion detected. This version is compatible." -ForegroundColor Green
        }
    }
} catch {
    Write-Host "Error checking Java version: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 3: Fix the proxy configuration
Write-Host "`nStep 3: Updating frontend proxy configuration..." -ForegroundColor Yellow

# Create the setupProxy.js fix script
$setupProxyPath = "frontend/src/setupProxy.js"
$backupPath = "$setupProxyPath.bak"

# Backup the current file if it exists
if (Test-Path $setupProxyPath) {
    Copy-Item -Path $setupProxyPath -Destination $backupPath -Force
    Write-Host "Backed up existing setupProxy.js to $backupPath" -ForegroundColor Green
}

# Create the new setupProxy.js content
$proxyContent = @'
/**
 * Enhanced proxy configuration for School Medical Management System
 * Supports automatic port detection and fallback between 8080 and 8081
 */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  console.log("Initializing enhanced proxy middleware with port fallback support");
  
  // Define both possible backend ports
  const PRIMARY_PORT = 8081;
  const SECONDARY_PORT = 8080;
  
  // Start with primary port but allow automatic switching
  let activePort = PRIMARY_PORT;
  let lastSwitchTime = Date.now();
  let consecutiveErrors = 0;
  
  // Function to create a proxy with a specific target port
  const createProxy = (targetPort) => {
    console.log(`Creating proxy middleware for port ${targetPort}`);
    
    return createProxyMiddleware({
      target: `http://localhost:${targetPort}`,
      changeOrigin: true,
      secure: false,
      
      // Add detailed request logging
      onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying ${req.method} ${req.path} to http://localhost:${targetPort}${req.path}`);
        
        // Add custom headers that might help debugging
        proxyReq.setHeader('X-Forwarded-Host', req.headers.host);
        proxyReq.setHeader('X-Frontend-Path', req.path);
      },
      
      // Log responses from the backend
      onProxyRes: (proxyRes, req, res) => {
        // Reset consecutive errors since we got a response
        consecutiveErrors = 0;
        
        console.log(`Response from port ${targetPort}: ${proxyRes.statusCode} for ${req.method} ${req.path}`);
      },
      
      // Handle connection errors with port switching
      onError: (err, req, res) => {
        console.error(`Connection error to port ${targetPort}: ${err.message}`);
        consecutiveErrors++;
        
        // Only switch ports after multiple consecutive errors
        // or if it's been a while since our last switch
        if (consecutiveErrors >= 2 || (Date.now() - lastSwitchTime > 10000)) {
          const newPort = (targetPort === PRIMARY_PORT) ? SECONDARY_PORT : PRIMARY_PORT;
          console.log(`Switching from port ${targetPort} to ${newPort} after ${consecutiveErrors} consecutive errors`);
          
          // Update active port and reset tracking
          activePort = newPort;
          lastSwitchTime = Date.now();
          
          // Create a new proxy with the alternate port
          const alternateProxy = createProxy(newPort);
          return alternateProxy(req, res);
        }
        
        // If we're not switching ports yet, return error to client
        if (!res.headersSent) {
          res.writeHead(503, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            error: 'Backend Unavailable',
            message: 'Could not connect to backend server. Please make sure it is running.',
            port: targetPort,
            attempts: consecutiveErrors
          }));
        }
      }
    });
  };
  
  // Create the initial proxy middleware with the primary port
  const apiProxy = createProxy(activePort);
  
  // Apply the middleware to all API routes
  app.use('/api', apiProxy);
  
  console.log(`Proxy configuration complete - will try ports [${PRIMARY_PORT}, ${SECONDARY_PORT}]`);
};
'@

# Write the new content to setupProxy.js
Set-Content -Path $setupProxyPath -Value $proxyContent -Encoding UTF8
Write-Host "Updated setupProxy.js with enhanced proxy configuration" -ForegroundColor Green

# Step 4: Fix the application.properties CORS configuration
Write-Host "`nStep 4: Updating backend CORS configuration..." -ForegroundColor Yellow

$appPropertiesPath = "backend/main/resources/application.properties"
if (Test-Path $appPropertiesPath) {
    $appPropsContent = Get-Content -Path $appPropertiesPath -Raw
    
    # Check if CORS config exists
    if (-not ($appPropsContent -match "spring\.web\.cors")) {
        $corsConfig = @"

# CORS Configuration for frontend communication
spring.web.cors.allowed-origins=http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*
spring.web.cors.exposed-headers=Authorization,Content-Type,Access-Control-Allow-Origin
spring.web.cors.allow-credentials=true
spring.web.cors.max-age=3600

# Add more debug logs for CORS and security
logging.level.org.springframework.web.cors=TRACE
logging.level.org.springframework.security.web.csrf=DEBUG
logging.level.com.swp391_8.schoolhealth.security=DEBUG
"@
        Add-Content -Path $appPropertiesPath -Value $corsConfig
        Write-Host "Added CORS configuration to application.properties" -ForegroundColor Green
    } else {
        Write-Host "CORS configuration already exists in application.properties" -ForegroundColor Green
    }
} else {
    Write-Host "Warning: Could not find application.properties at $appPropertiesPath" -ForegroundColor Red
}

# Step 5: Provide instructions
Write-Host "`nAll fixes have been applied!" -ForegroundColor Green
Write-Host "`nFollow these steps to restart the application:" -ForegroundColor Yellow
Write-Host "1. Start the backend:" -ForegroundColor White
Write-Host "   - If you have Java 17+: ./start-backend.bat" -ForegroundColor White
Write-Host "   - If you have Java 8: ./start-with-java17.ps1 (will help you find Java 17+)" -ForegroundColor White
Write-Host "`n2. Wait for the backend to start completely (usually takes 10-15 seconds)" -ForegroundColor White
Write-Host "`n3. Start the frontend:" -ForegroundColor White
Write-Host "   - In a new terminal: cd frontend && npm start" -ForegroundColor White
Write-Host "   - Or use: ./start-frontend.bat" -ForegroundColor White
Write-Host "`n4. Try to login with:" -ForegroundColor White
Write-Host "   - Username: parent.smith" -ForegroundColor White
Write-Host "   - Password: Password123" -ForegroundColor White
Write-Host "`nIf you still experience issues, check the browser console for errors" -ForegroundColor Yellow
