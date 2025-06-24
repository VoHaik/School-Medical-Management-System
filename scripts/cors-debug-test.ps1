Write-Host "CORS Debug Test Script" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan

# Test parameters
$baseUrl = "http://localhost:8081"
$endpoint = "/api/auth/signin"
$fullUrl = "$baseUrl$endpoint"

$loginPayload = @{
    username = "parent.smith"
    password = "Password123"
} | ConvertTo-Json

Write-Host "`nTesting POST request to: $fullUrl" -ForegroundColor Yellow

# Try with explicit CORS headers
$headers = @{
    "Content-Type" = "application/json"
    "Origin" = "http://localhost:3000"
    "Access-Control-Request-Method" = "POST"
    "Access-Control-Request-Headers" = "content-type,authorization"
}

# First try OPTIONS request (preflight)
Write-Host "`n1. Testing OPTIONS preflight request..." -ForegroundColor Magenta
try {
    $optionsResponse = Invoke-WebRequest -Uri $fullUrl -Method OPTIONS -Headers $headers -TimeoutSec 5
    Write-Host "✅ OPTIONS request successful! Status: $($optionsResponse.StatusCode)" -ForegroundColor Green
    Write-Host "Response Headers:" -ForegroundColor Gray
    $optionsResponse.Headers | Format-Table -AutoSize
} catch {
    Write-Host "❌ OPTIONS request failed! Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    }
}

# Then try actual POST request
Write-Host "`n2. Testing actual POST request..." -ForegroundColor Magenta
try {
    $response = Invoke-WebRequest -Uri $fullUrl -Method POST -Body $loginPayload -Headers $headers -TimeoutSec 5
    Write-Host "✅ POST request successful! Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Gray
    $response.Content | ConvertFrom-Json | Format-List
} catch {
    Write-Host "❌ POST request failed! Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        
        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $reader.BaseStream.Position = 0
            $reader.DiscardBufferedData()
            $responseBody = $reader.ReadToEnd()
            Write-Host "Response Body: $responseBody" -ForegroundColor Red
        } catch {
            Write-Host "Could not read response body" -ForegroundColor Red
        }
    }
}

# Test without CORS headers
Write-Host "`n3. Testing POST request WITHOUT CORS headers..." -ForegroundColor Magenta
try {
    $simpleHeaders = @{ "Content-Type" = "application/json" }
    $response = Invoke-WebRequest -Uri $fullUrl -Method POST -Body $loginPayload -Headers $simpleHeaders -TimeoutSec 5
    Write-Host "✅ Basic POST request successful! Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Gray
    $response.Content | ConvertFrom-Json | Format-List
} catch {
    Write-Host "❌ Basic POST request failed! Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    }
}

Write-Host "`nTest complete!" -ForegroundColor Cyan
Write-Host "If all tests failed, check if the backend server is running." -ForegroundColor Yellow
Write-Host "If OPTIONS succeeded but POST failed, you likely have a CORS issue." -ForegroundColor Yellow
Write-Host "If the basic POST worked but CORS POST failed, check your CORS configuration." -ForegroundColor Yellow
