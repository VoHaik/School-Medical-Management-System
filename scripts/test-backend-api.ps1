Write-Host "Backend API Connection Test" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan

# Define the base URLs to test
$urls = @(
    "http://localhost:8081",
    "http://localhost:8080"
)

# Define endpoints to test
$endpoints = @(
    "/api/public/test",
    "/api/auth/signin"
)

# Define the login payload
$loginPayload = @{
    username = "parent.smith"
    password = "Password123"
} | ConvertTo-Json

# Function to test connection to a URL
function Test-Connection($url) {
    try {
        $response = Invoke-WebRequest -Uri $url -Method GET -TimeoutSec 5 -ErrorAction Stop
        Write-Host "✅ Connected to $url - Status: $($response.StatusCode)" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "❌ Failed to connect to $url - Error: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Function to test login endpoint
function Test-Login($baseUrl) {
    $loginUrl = "$baseUrl/api/auth/signin"
    
    Write-Host "`nTesting login at $loginUrl" -ForegroundColor Yellow
    
    $headers = @{
        "Content-Type" = "application/json"
        "Origin" = "http://localhost:3000" 
    }
    
    try {
        Write-Host "Request Headers:" -ForegroundColor Gray
        $headers | Format-Table -AutoSize
        
        Write-Host "Request Payload:" -ForegroundColor Gray
        Write-Host $loginPayload -ForegroundColor Gray
        
        $response = Invoke-WebRequest -Uri $loginUrl -Method POST -Body $loginPayload -Headers $headers -TimeoutSec 5
        
        Write-Host "✅ Login successful - Status: $($response.StatusCode)" -ForegroundColor Green
        Write-Host "Response Headers:" -ForegroundColor Gray
        $response.Headers | Format-Table -AutoSize
        
        Write-Host "Response Content:" -ForegroundColor Gray
        Write-Host $response.Content -ForegroundColor Gray
        
        return $true
    } catch {
        Write-Host "❌ Login failed - Error: $($_.Exception.Message)" -ForegroundColor Red
        
        if ($_.Exception.Response) {
            Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
            
            try {
                $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
                $reader.BaseStream.Position = 0
                $reader.DiscardBufferedData()
                $responseBody = $reader.ReadToEnd()
                Write-Host "Response Body: $responseBody" -ForegroundColor Red
            } catch {
                Write-Host "Could not read response body: $($_.Exception.Message)" -ForegroundColor Red
            }
        }
        
        return $false
    }
}

# Main testing logic
foreach ($baseUrl in $urls) {
    Write-Host "`nTesting base URL: $baseUrl" -ForegroundColor Cyan
    
    # First test basic connectivity
    $connected = Test-Connection -url $baseUrl
    
    if ($connected) {
        # Test each endpoint
        foreach ($endpoint in $endpoints) {
            $endpointUrl = "$baseUrl$endpoint"
            Write-Host "`nTesting endpoint: $endpointUrl" -ForegroundColor Yellow
            Test-Connection -url $endpointUrl
        }
        
        # Test login functionality
        Test-Login -baseUrl $baseUrl
    }
}

Write-Host "`nTest run complete" -ForegroundColor Cyan
