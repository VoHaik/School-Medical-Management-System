# Test script to verify student name fixes in medication requests
# This script tests the API endpoint that returns pending medication requests
# to ensure it returns the proper student names and not the "Student Code: XXX" format

Write-Host "Testing student name display in medication requests..." -ForegroundColor Cyan

# Get the auth token from local storage
$localStoragePath = "$env:APPDATA\..\..\Local\Google\Chrome\User Data\Default\Local Storage\leveldb"
Write-Host "Looking for token in: $localStoragePath"

# Check if the backend is running before proceeding
try {
    $healthCheck = Invoke-RestMethod -Uri "http://localhost:8080/api/health" -Method Get -ErrorAction Stop
    Write-Host "Backend is running: $($healthCheck | ConvertTo-Json -Compress)" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Backend is not running or health endpoint is not accessible." -ForegroundColor Red
    Write-Host "Please start the backend server and try again." -ForegroundColor Red
    exit 1
}

# Get token from the user
Write-Host "Please enter your JWT token (from localStorage or browser developer tools):"
$token = Read-Host

if (-not $token) {
    Write-Host "No token provided. Aborting test." -ForegroundColor Red
    exit 1
}

Write-Host "Testing pending medication requests API..." -ForegroundColor Cyan

try {
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
        "X-Debug" = "PowerShellTest"
    }

    # Call the pending medication requests endpoint
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/medication-requests/pending" -Method Get -Headers $headers
    
    Write-Host "Successfully retrieved pending medication requests" -ForegroundColor Green
    Write-Host "Found $($response.Count) pending requests" -ForegroundColor Green
    
    # Analyze student names
    foreach ($request in $response) {
        Write-Host "`nRequest ID: $($request.requestId)" -ForegroundColor Yellow
        
        # Check different name fields
        Write-Host "studentName: $($request.studentName)"
        Write-Host "studentFullName: $($request.studentFullName)"
        Write-Host "studentCode: $($request.studentCode)"
        
        # Check for problematic prefix
        if ($request.studentName -match "Student Code:" -or $request.studentFullName -match "Student Code:") {
            Write-Host "WARNING: Found 'Student Code:' prefix in name fields!" -ForegroundColor Red
        } else {
            Write-Host "Student name format looks good" -ForegroundColor Green
        }
        
        # Check parent name fields
        Write-Host "`nParent/Requester Information:" -ForegroundColor Yellow
        Write-Host "parentName: $($request.parentName)"
        Write-Host "parentFullName: $($request.parentFullName)" 
        Write-Host "requestedByName: $($request.requestedByName)"
    }

} catch {
    Write-Host "ERROR calling API: $_" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    
    try {
        $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "Error details: $($errorDetails | ConvertTo-Json -Compress)" -ForegroundColor Red
    } catch {
        Write-Host "Raw error: $_" -ForegroundColor Red
    }
}

Write-Host "`nTest completed." -ForegroundColor Cyan
