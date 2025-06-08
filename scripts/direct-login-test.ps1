# Direct Login Test for parent.smith account
# This script directly tests the login endpoint for both port 8080 and 8081

Write-Host "Direct Login Test for parent.smith account" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Login credentials
$body = @{
    username = "parent.smith"
    password = "Password123"
} | ConvertTo-Json

# First try port 8080
$port = 8080
$url = "http://localhost:$port/api/auth/signin"
Write-Host "`nAttempting login on port $port..." -ForegroundColor Yellow

try {
    Write-Host "Sending login request to $url" -ForegroundColor Cyan
    $response = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "application/json" -ErrorAction Stop
    
    # Display login result
    Write-Host "`nLogin successful on port $port!" -ForegroundColor Green
    Write-Host "User details:" -ForegroundColor Cyan
    Write-Host "  Full Name: $($response.fullName)" -ForegroundColor White
    Write-Host "  Email: $($response.email)" -ForegroundColor White
    Write-Host "  Roles: $($response.roles -join ', ')" -ForegroundColor White
    Write-Host "  Token: $($response.accessToken.Substring(0, 20))..." -ForegroundColor White
    exit 0
} catch {
    Write-Host "Login failed on port $port: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "  HTTP Status Code: $statusCode" -ForegroundColor Red
    }
}

# If first attempt failed, try port 8081
$port = 8081
$url = "http://localhost:$port/api/auth/signin"
Write-Host "`nAttempting login on port $port..." -ForegroundColor Yellow

try {
    Write-Host "Sending login request to $url" -ForegroundColor Cyan
    $response = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "application/json" -ErrorAction Stop
    
    # Display login result
    Write-Host "`nLogin successful on port $port!" -ForegroundColor Green
    Write-Host "User details:" -ForegroundColor Cyan
    Write-Host "  Full Name: $($response.fullName)" -ForegroundColor White
    Write-Host "  Email: $($response.email)" -ForegroundColor White
    Write-Host "  Roles: $($response.roles -join ', ')" -ForegroundColor White
    Write-Host "  Token: $($response.accessToken.Substring(0, 20))..." -ForegroundColor White
    exit 0
} catch {
    Write-Host "Login failed on port $port: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "  HTTP Status Code: $statusCode" -ForegroundColor Red
        
        $responseBody = $_.ErrorDetails.Message
        if (-not $responseBody) {
            try {
                $responseStream = $_.Exception.Response.GetResponseStream()
                $reader = New-Object System.IO.StreamReader($responseStream)
                $responseBody = $reader.ReadToEnd()
                Write-Host "  Response: $responseBody" -ForegroundColor Red
            } catch {
                # If can't read response
            }
        } else {
            Write-Host "  Response: $responseBody" -ForegroundColor Red
        }
    }
}

Write-Host "`nBoth login attempts failed. Please check if the backend server is running and accessible." -ForegroundColor Red
