# Test an API endpoint with proper authentication
# Usage: .\test-api-endpoint.ps1 -endpoint "/api/medication-requests/pending" [-method "GET"] [-data "{\"key\":\"value\"}"]

param(
    [Parameter(Mandatory=$true)]
    [string]$endpoint,
    
    [Parameter(Mandatory=$false)]
    [string]$method = "GET",
    
    [Parameter(Mandatory=$false)]
    [string]$data = $null
)

$baseUrl = "http://localhost:8080"
$fullUrl = "$baseUrl$endpoint"

Write-Host "Testing API endpoint: $method $fullUrl" -ForegroundColor Cyan

# Try to get the JWT token from file
$token = $null
if (Test-Path "token.txt") {
    $token = Get-Content "token.txt" -Raw
    Write-Host "Using token from file: $($token.Substring(0, 10))..." -ForegroundColor Green
}
else {
    # Try to login to get a token
    Write-Host "No token found. Logging in..." -ForegroundColor Yellow
    
    $loginData = @{
        username = "nurse1"
        password = "password123"
    } | ConvertTo-Json
    
    try {
        $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/signin" -Method POST -ContentType "application/json" -Body $loginData
        
        if ($loginResponse.accessToken) {
            $token = $loginResponse.accessToken
            $token | Out-File "token.txt"
            Write-Host "Login successful! Token saved." -ForegroundColor Green
        }
    }
    catch {
        Write-Host "Login failed: $_" -ForegroundColor Red
        exit
    }
}

# Set headers with JWT token
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
    "X-Debug" = "PowerShellApiTest"
}

# Make the API call
try {
    $params = @{
        Uri = $fullUrl
        Method = $method
        Headers = $headers
    }
    
    if ($data -and $method -ne "GET") {
        $params.Body = $data
    }
    
    $response = Invoke-RestMethod @params
    
    Write-Host "API call successful!" -ForegroundColor Green
    
    # Output the response
    Write-Host "Response:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 5
}
catch {
    Write-Host "API call failed: $($_.Exception.Message)" -ForegroundColor Red
    
    # Try to get more details from the response
    if ($_.Exception.Response) {
        Write-Host "Status code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        
        $responseStream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($responseStream)
        $responseBody = $reader.ReadToEnd()
        
        Write-Host "Response body:" -ForegroundColor Red
        $responseBody
    }
}
