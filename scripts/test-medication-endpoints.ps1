# Script to test API endpoints and check for routing issues
# Run with: .\test-medication-endpoints.ps1

$baseUrl = "http://localhost:8080"
$endpoints = @(
    "/api/medication-requests/pending",
    "/api/medication-requests/pending/count",
    "/api/health-declaration/pending"
)

# Get or create a JWT token
$token = $null
if (Test-Path "token.txt") {
    $token = Get-Content "token.txt" -Raw
    Write-Host "Using existing token: $($token.Substring(0, 10))..." -ForegroundColor Cyan
} else {
    # Login to get a token - adjust credentials as needed
    $loginBody = @{
        username = "nurse1"
        password = "password123"
    } | ConvertTo-Json

    try {
        $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/signin" -Method POST -ContentType "application/json" -Body $loginBody
        if ($loginResponse.accessToken) {
            $token = $loginResponse.accessToken
            $token | Set-Content "token.txt" -Force
            Write-Host "Successfully logged in. Token saved." -ForegroundColor Green
        }
    } catch {
        Write-Host "Login failed: $_" -ForegroundColor Red
        Write-Host "Please verify your credentials or backend status." -ForegroundColor Red
        exit
    }
}

# Test each endpoint
foreach ($endpoint in $endpoints) {
    Write-Host "`n---------------------------------------" -ForegroundColor Magenta
    Write-Host "Testing endpoint: $endpoint" -ForegroundColor Yellow
    
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
        "X-Debug" = "PowerShellTest"
    }
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl$endpoint" -Method GET -Headers $headers
        Write-Host "SUCCESS! Status: 200 OK" -ForegroundColor Green
        
        # Show data summary
        if ($response -is [array]) {
            Write-Host "Response: Array with $($response.Count) items" -ForegroundColor Cyan
        } else {
            Write-Host "Response: $response" -ForegroundColor Cyan
        }
    } catch {
        Write-Host "ERROR! Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        
        # Get response body for better diagnosis
        $responseStream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($responseStream)
        $responseBody = $reader.ReadToEnd()
        $reader.Close()
        
        Write-Host "Response body: $responseBody" -ForegroundColor Red
        
        # Check for specific error conditions
        if ($responseBody -match "No static resource") {
            Write-Host "`n[CRITICAL ISSUE DETECTED]" -ForegroundColor White -BackgroundColor Red
            Write-Host "The endpoint is being treated as a static resource!" -ForegroundColor Red
            Write-Host "This is a Spring Boot configuration issue." -ForegroundColor Red
            
            Write-Host "`nPossible fixes:" -ForegroundColor Yellow
            Write-Host "1. Check WebMvcConfig.java to ensure proper resource handling" -ForegroundColor White
            Write-Host "2. Verify application.properties has correct static resource config:" -ForegroundColor White
            Write-Host "   - spring.mvc.static-path-pattern=/static/**" -ForegroundColor White
            Write-Host "   - spring.web.resources.add-mappings=true" -ForegroundColor White
            Write-Host "3. Check WebSecurityConfig.java to ensure API endpoints are not" -ForegroundColor White
            Write-Host "   being treated as resource paths" -ForegroundColor White
        }
        elseif ($_.Exception.Response.StatusCode.value__ -eq 401) {
            Write-Host "`n[AUTHENTICATION ISSUE]" -ForegroundColor White -BackgroundColor DarkRed
            Write-Host "The endpoint requires authentication but the token was rejected." -ForegroundColor Red
            
            Write-Host "`nPossible fixes:" -ForegroundColor Yellow
            Write-Host "1. Verify token is valid and not expired" -ForegroundColor White
            Write-Host "2. Check if the user has the required authorities" -ForegroundColor White
        }
        elseif ($_.Exception.Response.StatusCode.value__ -eq 403) {
            Write-Host "`n[AUTHORIZATION ISSUE]" -ForegroundColor White -BackgroundColor DarkRed
            Write-Host "The user does not have permission to access this endpoint." -ForegroundColor Red
            
            Write-Host "`nPossible fixes:" -ForegroundColor Yellow
            Write-Host "1. Verify user has the correct role (SchoolNurse or Admin)" -ForegroundColor White
            Write-Host "2. Check @PreAuthorize annotations in the controller" -ForegroundColor White
        }
    }
}

Write-Host "`n---------------------------------------" -ForegroundColor Magenta
Write-Host "API Testing Complete" -ForegroundColor Cyan
