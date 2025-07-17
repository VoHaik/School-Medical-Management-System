##################################################
#   Test Health Declaration with Custom Medications
#   This script tests the feature of adding custom medications in health declarations
##################################################

# Set the API base URL
$baseUrl = "http://localhost:8080"

# Function to check if the backend API is running
function Test-BackendRunning {
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl/api/auth/test/all" -Method GET
        if ($response.StatusCode -eq 200) {
            Write-Host "Backend is running." -ForegroundColor Green
            return $true
        }
    }
    catch {
        Write-Host "Backend is not running. Please start the backend first." -ForegroundColor Red
        return $false
    }
}

# Function to authenticate and get token
function Get-AuthToken($username, $password) {
    $loginBody = @{
        username = $username
        password = $password
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/signin" -Method POST -Body $loginBody -ContentType "application/json"
        Write-Host "Login successful for $username" -ForegroundColor Green
        return $response.token
    }
    catch {
        Write-Host "Login failed for $username: $_" -ForegroundColor Red
        return $null
    }
}

# Function to get student code for a parent
function Get-StudentCode($token) {
    try {
        $headers = @{
            Authorization = "Bearer $token"
        }
        
        $response = Invoke-RestMethod -Uri "$baseUrl/api/parent/students" -Method GET -Headers $headers
        if ($response.Count -gt 0) {
            $studentCode = $response[0].studentCode
            Write-Host "Found student with code: $studentCode" -ForegroundColor Green
            return $studentCode
        }
        else {
            Write-Host "No students found for this parent" -ForegroundColor Yellow
            return $null
        }
    }
    catch {
        Write-Host "Failed to get student code: $_" -ForegroundColor Red
        return $null
    }
}

# Function to check approved medications
function Get-ApprovedMedications($token, $studentCode) {
    try {
        $headers = @{
            Authorization = "Bearer $token"
        }
        
        $response = Invoke-RestMethod -Uri "$baseUrl/api/health-declaration/approved-medications?studentCode=$studentCode" -Method GET -Headers $headers
        Write-Host "Found $($response.Count) approved medications" -ForegroundColor Cyan
        return $response
    }
    catch {
        Write-Host "Failed to get approved medications: $_" -ForegroundColor Red
        return @()
    }
}

# Function to simulate creating a health declaration with a custom medication
function Create-HealthDeclarationWithCustomMedication($token, $studentCode) {
    try {
        $headers = @{
            Authorization = "Bearer $token"
        }
        
        # Current date
        $today = Get-Date -Format "yyyy-MM-dd"
        
        # Create health declaration with a custom medication
        $healthDeclaration = @{
            studentCode = $studentCode
            medicalHistory = "Test medical history"
            visionStatus = "Normal"
            hearingStatus = "Normal"
            medications = @(
                @{
                    isCustomMedication = $true
                    name = "Test Custom Medication"
                    dosage = "10mg"
                    frequency = "Once a day"
                    instructions = "Take with water"
                    startDate = $today
                    endDate = (Get-Date).AddDays(30).ToString("yyyy-MM-dd")
                    reason = "Test condition"
                }
            )
            allergies = @("Pollen")
            chronicIllnesses = @("None")
            emergencyContacts = @(
                @{
                    name = "Emergency Contact"
                    relationship = "Parent"
                    phone = "123-456-7890"
                    isEmergency = $true
                }
            )
            isDraft = $false
        }
        
        Write-Host "Creating health declaration with custom medication..." -ForegroundColor Cyan
        $declarationJson = $healthDeclaration | ConvertTo-Json -Depth 10
        Write-Host $declarationJson -ForegroundColor Gray
        
        $response = Invoke-RestMethod -Uri "$baseUrl/api/health-declaration" -Method POST -Body $declarationJson -Headers $headers -ContentType "application/json"
        Write-Host "Health Declaration created successfully!" -ForegroundColor Green
        return $response
    }
    catch {
        Write-Host "Failed to create health declaration: $_" -ForegroundColor Red
        return $null
    }
}

# Function to check if medication requests were created
function Check-MedicationRequests($token) {
    try {
        $headers = @{
            Authorization = "Bearer $token"
        }
        
        $response = Invoke-RestMethod -Uri "$baseUrl/api/medication-requests/mine" -Method GET -Headers $headers
        Write-Host "Found $($response.Count) medication requests" -ForegroundColor Cyan
        if ($response.Count -gt 0) {
            $latestRequest = $response | Sort-Object -Property requestDate -Descending | Select-Object -First 1
            Write-Host "Latest request: $($latestRequest.medicationName) - $($latestRequest.status)" -ForegroundColor Green
            return $true
        }
        return $false
    }
    catch {
        Write-Host "Failed to check medication requests: $_" -ForegroundColor Red
        return $false
    }
}

# Main test script
Write-Host "Starting test for Health Declaration with Custom Medications" -ForegroundColor Cyan
Write-Host "----------------------------------------------------" -ForegroundColor Cyan

# Check if backend is running
if (-not (Test-BackendRunning)) {
    exit
}

# Authentication
$parentUsername = "parent1"
$parentPassword = "password"
$token = Get-AuthToken $parentUsername $parentPassword

if (-not $token) {
    exit
}

# Get student code
$studentCode = Get-StudentCode $token

if (-not $studentCode) {
    exit
}

# Check approved medications
$approvedMedications = Get-ApprovedMedications $token $studentCode

# Create health declaration with custom medication
$declaration = Create-HealthDeclarationWithCustomMedication $token $studentCode

# Check if medication requests were created
$requestsCreated = Check-MedicationRequests $token

if ($requestsCreated) {
    Write-Host "TEST PASSED: Custom medication was successfully added and medication request was created!" -ForegroundColor Green
}
else {
    Write-Host "TEST FAILED: Medication request might not have been created." -ForegroundColor Red
}

Write-Host "Test complete." -ForegroundColor Cyan
