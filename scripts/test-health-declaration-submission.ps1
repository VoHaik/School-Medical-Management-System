# Test script for health declaration submission
# This script tests submitting a health declaration with null and non-null medical conditions
Write-Host "Testing Health Declaration Submission..." -ForegroundColor Green

# Get token for authentication (adjust these credentials according to your system)
$loginUrl = "http://localhost:8080/api/auth/login"
$loginBody = @{
    username = "parent1"  # Replace with an actual parent username in your system
    password = "password" # Replace with the correct password
} | ConvertTo-Json

Write-Host "Logging in to get authentication token..." -ForegroundColor Cyan
$response = Invoke-RestMethod -Uri $loginUrl -Method POST -ContentType "application/json" -Body $loginBody
$token = $response.token

if (-not $token) {
    Write-Host "Failed to get authentication token. Check credentials." -ForegroundColor Red
    exit 1
}

Write-Host "Successfully obtained token: $token" -ForegroundColor Green

# Get student code (assuming parent1 has a student associated)
$studentsUrl = "http://localhost:8080/api/parents/students"
Write-Host "Retrieving student information..." -ForegroundColor Cyan
$students = Invoke-RestMethod -Uri $studentsUrl -Method GET -Headers @{Authorization="Bearer $token"}

if (-not $students -or $students.Count -eq 0) {
    Write-Host "No students found for this parent. Check parent-student relationship." -ForegroundColor Red
    exit 1
}

$studentCode = $students[0].studentCode
Write-Host "Using student code: $studentCode" -ForegroundColor Green

# Create health declaration with null medical conditions (the problematic case)
$healthDeclarationUrl = "http://localhost:8080/api/health-declarations"

# Create a declaration with empty lists explicitly (not null)
$declaration = @{
    studentCode = $studentCode
    allergies = @()
    chronicIllnesses = @()
    medicalConditions = @()  # Empty but not null
    medications = @()
    emergencyContacts = @()
    vaccinations = @()
    declarationDate = (Get-Date -Format "yyyy-MM-dd")
    consentSignature = $true
    isDraft = $false
    hasSymptoms = $false
    closeContact = $false
    travelHistory = $false
} | ConvertTo-Json

Write-Host "Submitting health declaration with empty lists..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri $healthDeclarationUrl -Method POST -ContentType "application/json" -Headers @{Authorization="Bearer $token"} -Body $declaration
    Write-Host "Successfully submitted health declaration with empty lists!" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json -Depth 3)" -ForegroundColor Green
}
catch {
    Write-Host "Error submitting health declaration with empty lists" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
}

# Test with some values to ensure it works with actual data
$declarationWithData = @{
    studentCode = $studentCode
    allergies = @("Peanuts", "Dust")
    chronicIllnesses = @("Asthma")
    medicalConditions = @("Asthma")  # Same as chronicIllnesses
    medications = @(@{
        medicationName = "Albuterol"
        dosage = "2 puffs"
        frequency = "As needed"
        startDate = (Get-Date -Format "yyyy-MM-dd")
        endDate = (Get-Date).AddDays(30).ToString("yyyy-MM-dd")
    })
    emergencyContacts = @(@{
        name = "Emergency Contact"
        relationship = "Parent"
        phone = "123-456-7890"
    })
    vaccinations = @()
    declarationDate = (Get-Date -Format "yyyy-MM-dd")
    consentSignature = $true
    isDraft = $false
    hasSymptoms = $false
    closeContact = $false
    travelHistory = $false
} | ConvertTo-Json -Depth 3

Write-Host "Submitting health declaration with actual data..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri $healthDeclarationUrl -Method POST -ContentType "application/json" -Headers @{Authorization="Bearer $token"} -Body $declarationWithData
    Write-Host "Successfully submitted health declaration with actual data!" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json -Depth 3)" -ForegroundColor Green
}
catch {
    Write-Host "Error submitting health declaration with actual data" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
}

Write-Host "Testing completed!" -ForegroundColor Green
