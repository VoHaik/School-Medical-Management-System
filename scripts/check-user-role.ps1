# Check User Role
Write-Host "Test User Role in School Medical Management System" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

# Base URL
$baseUrl = "http://localhost:8080"

# Test credentials
$loginCredentials = @{
    username = "nurse.johnson"
    password = "Password123"
}

# Step 1: Login to get JWT token
Write-Host "`nStep 1: Login to get token with nurse.johnson account" -ForegroundColor Yellow
try {
    $loginResult = Invoke-RestMethod -Uri "$baseUrl/api/auth/signin" -Method Post -Body ($loginCredentials | ConvertTo-Json) -ContentType "application/json"
    Write-Host "Login successful" -ForegroundColor Green
    Write-Host "Username: $($loginResult.username)" -ForegroundColor Green
    Write-Host "Role(s): $($loginResult.roles -join ', ')" -ForegroundColor Green
    $token = $loginResult.token
    
    # Store token for subsequent requests
    if ($token) {
        Write-Host "JWT Token: $($token.Substring(0, 20))..." -ForegroundColor Green
    } else {
        Write-Host "No token received!" -ForegroundColor Red
        exit
    }
} catch {
    Write-Host "Login failed with error: $_" -ForegroundColor Red
    exit
}

# Step 2: Get current user info (ME endpoint)
Write-Host "`nStep 2: Verify current user with /api/auth/me endpoint" -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    $userInfo = Invoke-RestMethod -Uri "$baseUrl/api/auth/me" -Method Get -Headers $headers
    Write-Host "User verification successful" -ForegroundColor Green
    Write-Host "Username: $($userInfo.username)" -ForegroundColor Green
    Write-Host "Role(s): $($userInfo.roles -join ', ')" -ForegroundColor Green
    
    # Also check TestController /api/test/user endpoint for another verification
    $testResult = Invoke-RestMethod -Uri "$baseUrl/api/test/user" -Method Get -Headers $headers
    Write-Host "`nTest endpoint verification successful" -ForegroundColor Green
    Write-Host "Message: $($testResult.message)" -ForegroundColor Green
    Write-Host "User from principal: $($testResult.user)" -ForegroundColor Green
} catch {
    Write-Host "User verification failed with error: $_" -ForegroundColor Red
}

# Step 3: Try a health checkup event endpoint
Write-Host "`nStep 3: Test access to health checkup events endpoint" -ForegroundColor Yellow
try {
    $events = Invoke-RestMethod -Uri "$baseUrl/api/health-checkup-events" -Method Get -Headers $headers
    Write-Host "Successfully accessed health checkup events" -ForegroundColor Green
    Write-Host "Number of events retrieved: $($events.Count)" -ForegroundColor Green
} catch {
    Write-Host "Failed to access health checkup events: $_" -ForegroundColor Red
}

# Step 4: Create a new health checkup event
Write-Host "`nStep 4: Try creating a health checkup event" -ForegroundColor Yellow
$newEvent = @{
    eventName = "Test Health Checkup"
    eventType = "HEALTH_CHECKUP"
    description = "Test event created via PowerShell script"
    startDate = (Get-Date).ToString("yyyy-MM-dd")
    endDate = (Get-Date).AddDays(7).ToString("yyyy-MM-dd")
    location = "School Medical Center"
    typesOfCheckups = @("VISION", "HEARING")
    targetGradeLevels = "Grade 1, Grade 2"
    classesToNotify = @("1A", "1B")
}

try {
    $createdEvent = Invoke-RestMethod -Uri "$baseUrl/api/health-checkup-events" -Method Post -Body ($newEvent | ConvertTo-Json) -ContentType "application/json" -Headers $headers
    Write-Host "Successfully created new health checkup event" -ForegroundColor Green
    Write-Host "Created event ID: $($createdEvent.eventId), Name: $($createdEvent.eventName)" -ForegroundColor Green
} catch {
    Write-Host "Failed to create health checkup event" -ForegroundColor Red
    
    # Try to get response details for better diagnosis
    try {
        if ($_.Exception.Response) {
            $responseStream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($responseStream)
            $responseBody = $reader.ReadToEnd()
            Write-Host "Response Body: $responseBody" -ForegroundColor Red
        }
        Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    } catch {
        Write-Host "Could not extract error details: $_" -ForegroundColor Red
    }
}
