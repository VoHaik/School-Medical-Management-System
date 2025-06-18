# Test script to verify parent-student relationship checking
# This script helps to debug the issue with health declaration submissions

# Configuration
$apiUrl = "http://localhost:8080"
$username = Read-Host "Enter parent username"
$password = Read-Host "Enter parent password" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
$passwordText = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# Step 1: Get JWT token
Write-Host "Authenticating user..." -ForegroundColor Yellow
$authPayload = @{
    username = $username
    password = $passwordText
} | ConvertTo-Json

try {
    $authResponse = Invoke-RestMethod -Uri "$apiUrl/api/auth/signin" -Method Post -Body $authPayload -ContentType "application/json"
    $token = $authResponse.token
    Write-Host "Authentication successful!" -ForegroundColor Green
} catch {
    Write-Host "Authentication failed: $_" -ForegroundColor Red
    exit 1
}

# Step 2: Get parent's children
Write-Host "`nFetching parent's children..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    $childrenResponse = Invoke-RestMethod -Uri "$apiUrl/api/parent/students" -Method Get -Headers $headers
    
    if ($childrenResponse.Count -eq 0) {
        Write-Host "Parent has no associated children in the system." -ForegroundColor Red
        exit 1
    }
    
    Write-Host "Found $($childrenResponse.Count) children:" -ForegroundColor Green
    $index = 0
    foreach ($child in $childrenResponse) {
        Write-Host "[$index] $($child.fullName) (StudentCode: $($child.studentCode))"
        $index++
    }
} catch {
    Write-Host "Failed to fetch children: $_" -ForegroundColor Red
    exit 1
}

# Step 3: Select a child for testing
Write-Host "`nSelect a student for testing:" -ForegroundColor Yellow
$selectedIndex = Read-Host "Enter the index number of the student"
try {
    $selectedStudent = $childrenResponse[$([int]$selectedIndex)]
    Write-Host "Selected student: $($selectedStudent.fullName) with code $($selectedStudent.studentCode)" -ForegroundColor Green
} catch {
    Write-Host "Invalid selection" -ForegroundColor Red
    exit 1
}

# Step 4: Try to submit a health declaration for the student
Write-Host "`nTesting health declaration submission..." -ForegroundColor Yellow

# Create a minimal health declaration object with just the student code and minimal required data
$healthDeclaration = @{
    studentCode = $selectedStudent.studentCode
    allergies = @()
    chronicIllnesses = @()
    medications = @()
    emergencyContacts = @(
        @{
            name = "Test Contact"
            relationship = "Parent"
            phone = "1234567890"
            isEmergency = $true
        }
    )
} | ConvertTo-Json -Depth 3

try {
    $response = Invoke-RestMethod -Uri "$apiUrl/api/health-declaration" -Method Post -Body $healthDeclaration -ContentType "application/json" -Headers $headers
    Write-Host "SUCCESS! Health declaration submitted successfully." -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 4
} catch {
    Write-Host "FAILED! Could not submit health declaration." -ForegroundColor Red
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "Status code: $statusCode" -ForegroundColor Red
        
        # Try to get response body for more details
        try {
            $streamReader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
            $errorBody = $streamReader.ReadToEnd() | ConvertFrom-Json
            Write-Host "Error message: $($errorBody.message)" -ForegroundColor Red
        } catch {
            Write-Host "Could not parse error response" -ForegroundColor Red
        }
    } else {
        Write-Host "Error: $_" -ForegroundColor Red
    }
}

Write-Host "`nTest completed." -ForegroundColor Yellow
