# Test Script for CORS and API Accessibility
# This script tests if the API is accessible from a local client

Write-Host "Testing API Accessibility" -ForegroundColor Cyan
Write-Host "======================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if backend is running on port 8081 or 8080
$port = $null
$backendUrl = ""

Write-Host "Checking backend availability..." -ForegroundColor Yellow
try {
    Write-Host "Attempting to connect to localhost:8081..." -ForegroundColor Yellow
    $testUrl = "http://localhost:8081/api/public/test"
    $response = Invoke-WebRequest -Uri $testUrl -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "Response Status: $($response.StatusCode)" -ForegroundColor Yellow
    $port = 8081
    $backendUrl = "http://localhost:8081"
    Write-Host "✓ Backend is running on port 8081" -ForegroundColor Green
} catch {
    Write-Host "Error connecting to port 8081: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "Backend not found on port 8081, trying port 8080..." -ForegroundColor Yellow
    try {
        Write-Host "Attempting to connect to localhost:8080..." -ForegroundColor Yellow
        $testUrl = "http://localhost:8080/api/public/test"
        $response = Invoke-WebRequest -Uri $testUrl -Method GET -TimeoutSec 5 -ErrorAction Stop
        Write-Host "Response Status: $($response.StatusCode)" -ForegroundColor Yellow
        $port = 8080
        $backendUrl = "http://localhost:8080"
        Write-Host "✓ Backend is running on port 8080" -ForegroundColor Green
    } catch {
        Write-Host "Error connecting to port 8080: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "✗ Backend not found on either port" -ForegroundColor Red
    }
}

if (-not $port) {
    Write-Host "No backend found. Please start the backend application." -ForegroundColor Red
    exit 1
}

# Step 2: Test login endpoint with the parent.smith credentials
Write-Host "`nTesting login with parent.smith/Password123..." -ForegroundColor Yellow
$loginUrl = "$backendUrl/api/auth/signin"
$loginBody = @{
    username = "parent.smith"
    password = "Password123"
} | ConvertTo-Json

Write-Host "POST $loginUrl" -ForegroundColor Yellow
Write-Host "Request body: $loginBody" -ForegroundColor Yellow

$headers = @{
    "Content-Type" = "application/json"
    "Origin" = "http://localhost:3000"  # Add origin header to simulate browser request
}

Write-Host "Headers: $($headers | ConvertTo-Json -Compress)" -ForegroundColor Yellow

try {
    $loginResponse = Invoke-RestMethod -Uri $loginUrl -Method Post -Body $loginBody -Headers $headers -ErrorAction Stop -Verbose
    Write-Host "✓ Login successful!" -ForegroundColor Green
    Write-Host "  Username: $($loginResponse.username)" -ForegroundColor Green
    Write-Host "  Email: $($loginResponse.email)" -ForegroundColor Green
    Write-Host "  Token: $($loginResponse.token.Substring(0, 20))..." -ForegroundColor Green
    
    # Save the token for future requests
    $token = $loginResponse.token
    
    # Test an authenticated endpoint
    Write-Host "`nTesting authenticated endpoint..." -ForegroundColor Yellow
    $authHeaders = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    try {
        $userResponse = Invoke-RestMethod -Uri "$backendUrl/api/test/user" -Method Get -Headers $authHeaders
        Write-Host "✓ Authenticated endpoint access successful!" -ForegroundColor Green
        Write-Host "  Response: $($userResponse.message)" -ForegroundColor Green
    } catch {
        Write-Host "✗ Failed to access authenticated endpoint:" -ForegroundColor Red
        Write-Host "  $($_.Exception.Response.StatusCode.value__) $($_.Exception.Response.StatusDescription)" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Login failed:" -ForegroundColor Red
    
    Write-Host "Exception details:" -ForegroundColor Red
    Write-Host $_.Exception.GetType().FullName -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        
        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $reader.BaseStream.Position = 0
            $reader.DiscardBufferedData()
            $responseBody = $reader.ReadToEnd()
            Write-Host "Response body: $responseBody" -ForegroundColor Red
            
            try {
                $errorResponse = $responseBody | ConvertFrom-Json
                Write-Host "Error message: $($errorResponse.message)" -ForegroundColor Red
            } catch {
                Write-Host "Could not parse error response as JSON" -ForegroundColor Red
            }
        } catch {
            Write-Host "Could not read error response body: $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "No response received from server" -ForegroundColor Red
    }
}

Write-Host "`nSuggested next steps:" -ForegroundColor Cyan
Write-Host "1. If login failed, check database credentials and user accounts" -ForegroundColor White
Write-Host "2. If CORS errors appear in browser, check WebSecurityConfig.java and CorsFilter.java" -ForegroundColor White
Write-Host "3. Make sure setupProxy.js is properly configured in the frontend" -ForegroundColor White
