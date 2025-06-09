# Test login for parent.smith account
Write-Host "Testing login for parent.smith..." -ForegroundColor Yellow

$body = @{
    username = "parent.smith"
    password = "Password123"
} | ConvertTo-Json

try {    # First check if the backend is running
    $backendUrl = "http://localhost:8081"
    $backendRunning = $false

    try {
        $null = Invoke-WebRequest -Uri $backendUrl -Method Get -TimeoutSec 5 -ErrorAction SilentlyContinue
        Write-Host "Backend is running on port 8081" -ForegroundColor Green
        $backendRunning = $true
    } catch {
        Write-Host "Backend is not running on port 8081. Trying port 8080..." -ForegroundColor Yellow
        try {
            $backendUrl = "http://localhost:8080"            $null = Invoke-WebRequest -Uri $backendUrl -Method Get -TimeoutSec 5 -ErrorAction SilentlyContinue
            Write-Host "Backend is running on port 8080" -ForegroundColor Green
            $backendRunning = $true
            $port = 8080
        } catch {
            # Try one more time with direct check to the login endpoint
            try {
                $testUrl = "http://localhost:8080/api/auth/signin"
                $null = Invoke-WebRequest -Uri $testUrl -Method Options -TimeoutSec 5 -ErrorAction SilentlyContinue
                Write-Host "Backend is running on port 8080 (auth endpoint accessible)" -ForegroundColor Green
                $backendRunning = $true
                $port = 8080
                $backendUrl = "http://localhost:8080"
            } catch {
                Write-Host "Backend server does not appear to be running." -ForegroundColor Red
                exit 1
            }
        }
    }

    # Determine which port to use
    $port = if ($backendRunning) { 
        if ($backendUrl -like "*:8081*") { 8081 } else { 8080 } 
    } else { 8081 }

    Write-Host "Using port $port for API calls" -ForegroundColor Cyan
    $url = "http://localhost:$port/api/auth/signin"
    
    # Attempt login
    Write-Host "Sending login request to $url" -ForegroundColor Cyan
    $response = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "application/json" -ErrorAction Stop
    
    # Display login result
    Write-Host "`nLogin successful!" -ForegroundColor Green
    Write-Host "User details:" -ForegroundColor Cyan
    Write-Host "  Full Name: $($response.fullName)" -ForegroundColor White
    Write-Host "  Email: $($response.email)" -ForegroundColor White
    Write-Host "  Roles: $($response.roles -join ', ')" -ForegroundColor White
} catch {
    Write-Host "`nLogin failed: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "HTTP Status Code: $statusCode" -ForegroundColor Red
        
        $responseBody = $_.ErrorDetails.Message
        if (-not $responseBody) {
            $responseStream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($responseStream)
            $responseBody = $reader.ReadToEnd()
        }
        
        Write-Host "Response: $responseBody" -ForegroundColor Red
    }
}
