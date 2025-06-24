# Script to check for API routing issues
# Helps identify if API endpoints are being treated as static resources

Write-Host "Checking API routes for potential configuration issues..." -ForegroundColor Cyan

# Check if backend is running
$backendUrl = "http://localhost:8080"
$testEndpoint = "$backendUrl/api/auth/status" # Should be a simple endpoint that should return 200 or 401

Write-Host "Testing backend connectivity..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$backendUrl" -Method GET -ErrorAction Stop
    Write-Host "Backend is up and running!" -ForegroundColor Green
} catch {
    Write-Host "WARNING: Backend may not be running at $backendUrl" -ForegroundColor Red
    Write-Host "Start the backend server before continuing." -ForegroundColor Red
    exit 1
}

# Test key API endpoints to see if they're being handled correctly
$endpoints = @(
    "/api/medication-requests/pending",
    "/api/medication-requests/pending/count",
    "/api/health-declaration/pending/count"
)

Write-Host "`nTesting API endpoints without authentication (should get 401, not 404 or static resource error):" -ForegroundColor Yellow

foreach ($endpoint in $endpoints) {
    $url = "$backendUrl$endpoint"
    
    try {
        $response = Invoke-WebRequest -Uri $url -Method GET -ErrorAction SilentlyContinue
        Write-Host "  $endpoint : Response Code - $($response.StatusCode) (unexpected success)" -ForegroundColor Red
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        
        if ($statusCode -eq 401) {
            # This is good - endpoint exists but requires auth
            Write-Host "  $endpoint : Response Code - $statusCode (Correct - Requires auth)" -ForegroundColor Green
        } elseif ($statusCode -eq 404) {
            Write-Host "  $endpoint : Response Code - $statusCode (ERROR - Endpoint not found)" -ForegroundColor Red
        } else {
            # Try to get more info from response
            try {
                $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
                $responseBody = $reader.ReadToEnd()
                Write-Host "  $endpoint : Response Code - $statusCode (Unexpected status code)" -ForegroundColor Yellow
                Write-Host "    Response: $responseBody" -ForegroundColor Yellow
                $reader.Close()
            } catch {
                Write-Host "  $endpoint : Response Code - $statusCode (Could not read response)" -ForegroundColor Red
            }
        }
    }
}

Write-Host "`nChecking WebSecurityConfig for potential misconfiguration..." -ForegroundColor Yellow
$webSecurityConfigPath = "..\backend\src\main\java\com\swp391_8\schoolhealth\config\WebSecurityConfig.java"

if (Test-Path $webSecurityConfigPath) {
    $content = Get-Content $webSecurityConfigPath -Raw
    
    if ($content -match "requestMatchers\(\"/api/medication-requests") {
        Write-Host "  API medication-requests paths are explicitly configured in security config - Good!" -ForegroundColor Green
    } else {
        Write-Host "  WARNING: No explicit configuration for /api/medication-requests paths in security config" -ForegroundColor Red
        Write-Host "  Consider adding explicit .requestMatchers() rules for these API paths" -ForegroundColor Yellow
    }
    
    if ($content -match "requestMatchers\(\"/api/health-declaration") {
        Write-Host "  API health-declaration paths are explicitly configured in security config - Good!" -ForegroundColor Green
    } else {
        Write-Host "  WARNING: No explicit configuration for /api/health-declaration paths in security config" -ForegroundColor Red
        Write-Host "  Consider adding explicit .requestMatchers() rules for these API paths" -ForegroundColor Yellow
    }
} else {
    Write-Host "  Could not find WebSecurityConfig.java file at expected location" -ForegroundColor Red
}

Write-Host "`nDone checking API routing issues." -ForegroundColor Cyan
