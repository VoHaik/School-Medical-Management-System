# Test Complete Authorization Flow
Write-Host "Testing Complete Authorization Flow for School Medical Management System" -ForegroundColor Cyan
Write-Host "============================================================================" -ForegroundColor Cyan

# Test different user roles and their access levels
$baseUrl = "http://localhost:8080"
$testUsers = @(
    @{ username = "admin.user"; password = "Password123"; expectedRole = "ROLE_ADMIN" },
    @{ username = "nurse.johnson"; password = "Password123"; expectedRole = "ROLE_SCHOOLNURSE" },
    @{ username = "manager.davis"; password = "Password123"; expectedRole = "ROLE_TEACHER" },
    @{ username = "parent.smith"; password = "Password123"; expectedRole = "ROLE_PARENT" }
)

foreach ($user in $testUsers) {
    Write-Host "`n--- Testing User: $($user.username) ---" -ForegroundColor Yellow
    
    try {
        # 1. Login Test
        $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/signin" -Method POST -ContentType "application/json" -Body (@{
            username = $user.username
            password = $user.password
        } | ConvertTo-Json)
        
        Write-Host "✓ Login successful" -ForegroundColor Green
        Write-Host "  - User ID: $($loginResponse.id)" -ForegroundColor Gray
        Write-Host "  - Full Name: $($loginResponse.fullName)" -ForegroundColor Gray
        Write-Host "  - Email: $($loginResponse.email)" -ForegroundColor Gray
        Write-Host "  - Roles: $($loginResponse.roles -join ', ')" -ForegroundColor Gray
        Write-Host "  - Token Length: $($loginResponse.token.Length) characters" -ForegroundColor Gray
        
        # Verify expected role
        if ($loginResponse.roles -contains $user.expectedRole) {
            Write-Host "✓ Role assignment correct: $($user.expectedRole)" -ForegroundColor Green
        } else {
            Write-Host "✗ Role assignment incorrect. Expected: $($user.expectedRole), Got: $($loginResponse.roles -join ', ')" -ForegroundColor Red
        }
        
        # 2. Protected Endpoint Test
        try {
            $protectedResponse = Invoke-RestMethod -Uri "$baseUrl/api/test/user" -Method GET -Headers @{
                "Authorization" = "Bearer $($loginResponse.token)"
            }
            Write-Host "✓ Protected endpoint access successful" -ForegroundColor Green
            Write-Host "  - Response: $($protectedResponse.message)" -ForegroundColor Gray
        } catch {
            Write-Host "✗ Protected endpoint access failed: $($_.Exception.Message)" -ForegroundColor Red
        }
        
        # 3. Token Validation Test
        try {
            $meResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/me" -Method GET -Headers @{
                "Authorization" = "Bearer $($loginResponse.token)"
            }
            Write-Host "✓ Token validation successful" -ForegroundColor Green
            Write-Host "  - Validated user: $($meResponse.username)" -ForegroundColor Gray
        } catch {
            Write-Host "✗ Token validation failed: $($_.Exception.Message)" -ForegroundColor Red
        }
        
    } catch {
        Write-Host "✗ Login failed for $($user.username): $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test unauthorized access
Write-Host "`n--- Testing Unauthorized Access ---" -ForegroundColor Yellow
try {
    Invoke-RestMethod -Uri "$baseUrl/api/test/user" -Method GET
    Write-Host "✗ Unauthorized access should have been denied!" -ForegroundColor Red
} catch {
    Write-Host "✓ Unauthorized access properly denied" -ForegroundColor Green
    Write-Host "  - Error: Access denied without authentication token" -ForegroundColor Gray
}

# Test invalid token
Write-Host "`n--- Testing Invalid Token ---" -ForegroundColor Yellow
try {
    Invoke-RestMethod -Uri "$baseUrl/api/test/user" -Method GET -Headers @{
        "Authorization" = "Bearer invalid.token.here"
    }
    Write-Host "✗ Invalid token should have been rejected!" -ForegroundColor Red
} catch {
    Write-Host "✓ Invalid token properly rejected" -ForegroundColor Green
    Write-Host "  - Error: Invalid JWT token rejected" -ForegroundColor Gray
}

Write-Host "`n============================================================================" -ForegroundColor Cyan
Write-Host "Authorization Flow Testing Complete" -ForegroundColor Cyan
Write-Host "============================================================================" -ForegroundColor Cyan
