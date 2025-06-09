Write-Host "Simple API Test" -ForegroundColor Cyan
Write-Host "==============" -ForegroundColor Cyan

# Check backend on port 8081
Write-Host "Checking backend on port 8081..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8081" -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "Response from 8081: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Error on port 8081: $($_.Exception.Message)" -ForegroundColor Red
}

# Check backend on port 8080
Write-Host "`nChecking backend on port 8080..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080" -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "Response from 8080: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Error on port 8080: $($_.Exception.Message)" -ForegroundColor Red
}

# Try to access the login endpoint
Write-Host "`nTesting login endpoint..." -ForegroundColor Yellow
$loginUrl = "http://localhost:8081/api/auth/signin"
$loginBody = @{
    username = "parent.smith"
    password = "Password123"
} | ConvertTo-Json

Write-Host "POST $loginUrl" -ForegroundColor Yellow
$headers = @{
    "Content-Type" = "application/json"
    "Origin" = "http://localhost:3000"
}

try {
    $loginResponse = Invoke-RestMethod -Uri $loginUrl -Method Post -Body $loginBody -Headers $headers -ErrorAction Stop
    Write-Host "Login successful!" -ForegroundColor Green
    $loginResponse | Format-List
} catch {
    Write-Host "Login failed: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    }
}

Write-Host "`nTest completed." -ForegroundColor Cyan
