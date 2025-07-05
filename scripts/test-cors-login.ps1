# Test CORS and Login Functionality
# This script tests if CORS is properly configured and login works

Write-Host "Testing CORS Configuration and Authentication Flow" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Test if backend is up and running
Write-Host "Step 1: Testing if backend is available..." -ForegroundColor Yellow
try {
    $backendUrl = "http://localhost:8081/api/test/health"
    $response = Invoke-WebRequest -Uri $backendUrl -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✓ Backend is up on port 8081! Status code: $($response.StatusCode)" -ForegroundColor Green
    $backendPort = 8081
} catch {
    try {
        $backendUrl = "http://localhost:8080/api/test/health"
        $response = Invoke-WebRequest -Uri $backendUrl -Method GET -TimeoutSec 5 -ErrorAction Stop
        Write-Host "✓ Backend is up on port 8080! Status code: $($response.StatusCode)" -ForegroundColor Green
        $backendPort = 8080
    } catch {
        Write-Host "✗ Backend does not appear to be running on either port 8081 or 8080." -ForegroundColor Red
        Write-Host "  Please make sure the backend is running by executing: 'java -jar backend/target/SWP391-Project-1.0-SNAPSHOT.jar'" -ForegroundColor Yellow
        exit 1
    }
}

# Step 2: Test public endpoint for CORS
Write-Host "`nStep 2: Testing public endpoint (no auth required)..." -ForegroundColor Yellow
try {
    $publicApiUrl = "http://localhost:$backendPort/api/public/test"
    $publicResponse = Invoke-WebRequest -Uri $publicApiUrl -Method GET -TimeoutSec 5 -ErrorAction Stop
    $responseContent = $publicResponse.Content | ConvertFrom-Json
    Write-Host "✓ Public API endpoint is accessible! Response: $($responseContent.message)" -ForegroundColor Green
} catch {
    Write-Host "✗ Could not access public API endpoint: $_" -ForegroundColor Red
    exit 1
}

# Step 3: Test login
Write-Host "`nStep 3: Testing login with parent.smith/Password123..." -ForegroundColor Yellow
$loginData = @{
    username = "parent.smith"
    password = "Password123"
} | ConvertTo-Json

try {
    $loginUrl = "http://localhost:$backendPort/api/auth/signin"
    $loginHeaders = @{
        "Content-Type" = "application/json"
    }
    $loginResponse = Invoke-WebRequest -Uri $loginUrl -Method POST -Body $loginData -Headers $loginHeaders -TimeoutSec 5 -ErrorAction Stop
    $loginResult = $loginResponse.Content | ConvertFrom-Json
    Write-Host "✓ Login successful! Got JWT token and user info:" -ForegroundColor Green
    Write-Host "  Username: $($loginResult.username)" -ForegroundColor Green
    Write-Host "  Email: $($loginResult.email)" -ForegroundColor Green
    Write-Host "  Roles: $($loginResult.roles -join ', ')" -ForegroundColor Green
    
    # Extract JWT token for protected endpoint testing
    $jwtToken = $loginResult.token
} catch {
    Write-Host "✗ Login failed: $_" -ForegroundColor Red
    Write-Host "Response: $($_.Exception.Response)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response body: $responseBody" -ForegroundColor Red
    }
    exit 1
}

# Step 4: Test protected endpoint using the token
Write-Host "`nStep 4: Testing protected endpoint (auth required)..." -ForegroundColor Yellow
try {
    $protectedUrl = "http://localhost:$backendPort/api/test/user"
    $authHeaders = @{
        "Authorization" = "Bearer $jwtToken"
        "Content-Type" = "application/json"
    }
    $protectedResponse = Invoke-WebRequest -Uri $protectedUrl -Method GET -Headers $authHeaders -TimeoutSec 5 -ErrorAction Stop
    $protectedContent = $protectedResponse.Content | ConvertFrom-Json
    Write-Host "✓ Protected API endpoint is accessible! Response: $($protectedContent.message)" -ForegroundColor Green
} catch {
    Write-Host "✗ Could not access protected API endpoint: $_" -ForegroundColor Red
    exit 1
}

# Step 5: Test CORS preflight request (OPTIONS)
Write-Host "`nStep 5: Testing CORS preflight (OPTIONS) request..." -ForegroundColor Yellow
try {
    $corsUrl = "http://localhost:$backendPort/api/auth/signin"
    $corsHeaders = @{
        "Origin" = "http://localhost:3000"
        "Access-Control-Request-Method" = "POST"
        "Access-Control-Request-Headers" = "Content-Type, Authorization"
    }
    $corsResponse = Invoke-WebRequest -Uri $corsUrl -Method OPTIONS -Headers $corsHeaders -TimeoutSec 5 -ErrorAction Stop
    
    Write-Host "✓ CORS preflight request succeeded! Status code: $($corsResponse.StatusCode)" -ForegroundColor Green
    Write-Host "  Checking CORS headers:" -ForegroundColor Green
    
    $corsHeaders = @(
        "Access-Control-Allow-Origin",
        "Access-Control-Allow-Methods",
        "Access-Control-Allow-Headers",
        "Access-Control-Allow-Credentials",
        "Access-Control-Max-Age"
    )
    
    foreach ($header in $corsHeaders) {
        $value = $corsResponse.Headers[$header]
        if ($value) {
            Write-Host "  ✓ $header: $value" -ForegroundColor Green
        } else {
            Write-Host "  ✗ $header header is missing!" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "✗ CORS preflight request failed: $_" -ForegroundColor Red
    exit 1
}

# All tests passed successfully!
Write-Host "`n✓ All tests passed! CORS and authentication are working properly." -ForegroundColor Green
Write-Host "You should be able to login successfully with the web application now." -ForegroundColor Cyan
