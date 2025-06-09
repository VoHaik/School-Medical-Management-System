# PowerShell script to test authentication flow
Write-Host "Testing School Health Management System Authentication Flow" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green

$baseUrl = "http://localhost:8080"

# Test 1: Health Check
Write-Host "`n1. Testing Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/test/health" -Method GET -ContentType "application/json"
    Write-Host "✓ Health Check: $($response.status) - $($response.message)" -ForegroundColor Green
} catch {
    Write-Host "✗ Health Check Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Public Endpoint
Write-Host "`n2. Testing Public Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/test/public" -Method GET -ContentType "application/json"
    Write-Host "✓ Public Endpoint: $($response.message)" -ForegroundColor Green
} catch {
    Write-Host "✗ Public Endpoint Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Check Roles
Write-Host "`n3. Testing Roles Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/test/roles" -Method GET -ContentType "application/json"
    Write-Host "✓ Roles Found: $($response.totalRoles) roles in database" -ForegroundColor Green
    foreach ($role in $response.roles) {
        Write-Host "  - $($role.name) (ID: $($role.id))" -ForegroundColor Cyan
    }
} catch {
    Write-Host "✗ Roles Check Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Register a test user
Write-Host "`n4. Testing User Registration..." -ForegroundColor Yellow
$registerData = @{
    username = "testuser_$(Get-Date -Format 'HHmmss')"
    password = "testpass123"
    fullName = "Test User"
    email = "test_$(Get-Date -Format 'HHmmss')@example.com"
    phone = "1234567890"
    role = "Student"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/signup" -Method POST -Body $registerData -ContentType "application/json"
    Write-Host "✓ Registration: $($response.message)" -ForegroundColor Green
    $testUsername = ($registerData | ConvertFrom-Json).username
    $testPassword = ($registerData | ConvertFrom-Json).password
} catch {
    Write-Host "✗ Registration Failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorResponse = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorResponse)
        $errorContent = $reader.ReadToEnd()
        Write-Host "Error Details: $errorContent" -ForegroundColor Red
    }
    return
}

# Test 5: Login with the test user
Write-Host "`n5. Testing User Login..." -ForegroundColor Yellow
$loginData = @{
    username = $testUsername
    password = $testPassword
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/signin" -Method POST -Body $loginData -ContentType "application/json"
    Write-Host "✓ Login: Successfully authenticated user $($response.username)" -ForegroundColor Green
    Write-Host "  - JWT Token: $($response.token.Substring(0, 20))..." -ForegroundColor Cyan
    Write-Host "  - Roles: $($response.roles -join ', ')" -ForegroundColor Cyan
    $jwtToken = $response.token
} catch {
    Write-Host "✗ Login Failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorResponse = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorResponse)
        $errorContent = $reader.ReadToEnd()
        Write-Host "Error Details: $errorContent" -ForegroundColor Red
    }
    return
}

# Test 6: Access protected endpoint
Write-Host "`n6. Testing Protected Endpoint..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $jwtToken"
        "Content-Type" = "application/json"
    }
    $response = Invoke-RestMethod -Uri "$baseUrl/api/test/user" -Method GET -Headers $headers
    Write-Host "✓ Protected Access: $($response.message)" -ForegroundColor Green
    Write-Host "  - Authenticated as: $($response.user)" -ForegroundColor Cyan
} catch {
    Write-Host "✗ Protected Access Failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorResponse = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorResponse)
        $errorContent = $reader.ReadToEnd()
        Write-Host "Error Details: $errorContent" -ForegroundColor Red
    }
}

Write-Host "`n============================================================" -ForegroundColor Green
Write-Host "Authentication Flow Test Complete" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
