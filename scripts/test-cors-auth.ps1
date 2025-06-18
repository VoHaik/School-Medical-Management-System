# Test CORS Configuration and Login Flow
# This script helps diagnose and test CORS issues with the login flow

Write-Host "School Medical Management System - CORS & Authentication Test" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: First kill any existing processes
Write-Host "Killing any existing processes..." -ForegroundColor Yellow
.\kill-all-ports.ps1

# Step 2: Wait a moment for processes to fully terminate
Start-Sleep -Seconds 2

# Step 3: Start the Spring Boot backend
Write-Host "`nStarting Spring Boot backend..." -ForegroundColor Yellow
Start-Process -FilePath "java" -ArgumentList "-jar", "backend/target/SWP391-Project-1.0-SNAPSHOT.jar" -WindowStyle Normal

# Step 4: Wait for the backend to start
Write-Host "Waiting 30 seconds for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Step 5: Test backend health
Write-Host "`nTesting backend health..." -ForegroundColor Yellow
try {
    $backendUrl = "http://localhost:8081/api/test/health"
    $response = Invoke-WebRequest -Uri $backendUrl -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "Backend is up and running on port 8081! Status code: $($response.StatusCode)" -ForegroundColor Green
    $port = 8081
} catch {
    Write-Host "Backend not running on port 8081, trying port 8080..." -ForegroundColor Yellow
    try {
        $backendUrl = "http://localhost:8080/api/test/health" 
        $response = Invoke-WebRequest -Uri $backendUrl -Method GET -TimeoutSec 5 -ErrorAction Stop
        Write-Host "Backend is up and running on port 8080! Status code: $($response.StatusCode)" -ForegroundColor Green
        $port = 8080
    } catch {
        Write-Host "Backend does not appear to be running on either port." -ForegroundColor Red
        Write-Host "Error message: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

# Step 6: Test CORS headers
Write-Host "`nTesting CORS headers from backend..." -ForegroundColor Yellow
try {
    $headers = @{
        "Origin" = "http://localhost:3000"
        "Access-Control-Request-Method" = "POST"
    }
    $corsUrl = "http://localhost:$port/api/auth/signin"
    $response = Invoke-WebRequest -Uri $corsUrl -Method OPTIONS -Headers $headers -ErrorAction Stop
    
    Write-Host "CORS preflight request successful! Status code: $($response.StatusCode)" -ForegroundColor Green
    
    Write-Host "`nCORS Headers returned:" -ForegroundColor Cyan
    if ($response.Headers["Access-Control-Allow-Origin"]) {
        Write-Host "Access-Control-Allow-Origin: $($response.Headers["Access-Control-Allow-Origin"])" -ForegroundColor Green
    } else {
        Write-Host "Access-Control-Allow-Origin header is missing!" -ForegroundColor Red
    }
    
    if ($response.Headers["Access-Control-Allow-Methods"]) {
        Write-Host "Access-Control-Allow-Methods: $($response.Headers["Access-Control-Allow-Methods"])" -ForegroundColor Green
    }
    
    if ($response.Headers["Access-Control-Allow-Headers"]) {
        Write-Host "Access-Control-Allow-Headers: $($response.Headers["Access-Control-Allow-Headers"])" -ForegroundColor Green
    }
    
    if ($response.Headers["Access-Control-Allow-Credentials"]) {
        Write-Host "Access-Control-Allow-Credentials: $($response.Headers["Access-Control-Allow-Credentials"])" -ForegroundColor Green
    }
} catch {
    Write-Host "CORS preflight request failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 7: Test actual login
Write-Host "`nTesting login with parent.smith..." -ForegroundColor Yellow
try {
    $loginUrl = "http://localhost:$port/api/auth/signin"
    $body = @{
        username = "parent.smith"
        password = "Password123"
    } | ConvertTo-Json
    
    $headers = @{
        "Content-Type" = "application/json"
        "Origin" = "http://localhost:3000"
    }
    
    $response = Invoke-RestMethod -Uri $loginUrl -Method Post -Body $body -ContentType "application/json" -Headers $headers -ErrorAction Stop
    
    Write-Host "`nLogin successful!" -ForegroundColor Green
    Write-Host "User details:" -ForegroundColor Cyan
    Write-Host "  Token: $($response.token.Substring(0, 20))..." -ForegroundColor White
    Write-Host "  Full Name: $($response.fullName)" -ForegroundColor White
    Write-Host "  Email: $($response.email)" -ForegroundColor White
    Write-Host "  Roles: $($response.roles -join ', ')" -ForegroundColor White
} catch {
    Write-Host "`nLogin failed: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "HTTP Status Code: $statusCode" -ForegroundColor Red
        
        $responseBody = $null
        try {
            $streamReader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
            $responseBody = $streamReader.ReadToEnd()
            $streamReader.Close()
            if ($responseBody) {
                Write-Host "Response body: $responseBody" -ForegroundColor Red
            }
        } catch {
            Write-Host "Could not read response body." -ForegroundColor Red
        }
    }
}

# Step 8: Provide next steps
Write-Host "`nTroubleshooting Next Steps:" -ForegroundColor Cyan
Write-Host "1. Check that the backend server is running on the correct port." -ForegroundColor White
Write-Host "2. Verify that CORS headers are properly configured in WebSecurityConfig.java." -ForegroundColor White
Write-Host "3. Ensure the request is not being redirected to a login page instead of returning a 401." -ForegroundColor White
Write-Host "4. Check for any network issues or firewall blocking the requests." -ForegroundColor White
Write-Host "5. Inspect browser developer tools for detailed CORS error messages." -ForegroundColor White
