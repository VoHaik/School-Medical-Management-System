# Test login for parent.smith account in a loop
# This script will keep trying to connect until the server is available

Write-Host "Testing login for parent.smith..." -ForegroundColor Yellow
$attempts = 0
$maxAttempts = 10
$success = $false

while ($attempts -lt $maxAttempts -and -not $success) {
    $attempts++
    Write-Host "Attempt $attempts of $maxAttempts" -ForegroundColor Cyan

    $body = @{
        username = "parent.smith"
        password = "Password123"
    } | ConvertTo-Json

    try {
        # First check if the backend is running by trying both ports
        $backendRunning = $false
        $port = 0
        
        try {
            $testUrl = "http://localhost:8081/api/test/public"
            $null = Invoke-WebRequest -Uri $testUrl -Method Get -TimeoutSec 2 -ErrorAction Stop
            Write-Host "Backend is running on port 8081" -ForegroundColor Green
            $backendRunning = $true
            $port = 8081
        } catch {
            Write-Host "Backend not available on port 8081, trying port 8080..." -ForegroundColor Yellow
            try {
                $testUrl = "http://localhost:8080/api/test/public"
                $null = Invoke-WebRequest -Uri $testUrl -Method Get -TimeoutSec 2 -ErrorAction Stop
                Write-Host "Backend is running on port 8080" -ForegroundColor Green
                $backendRunning = $true
                $port = 8080
            } catch {
                Write-Host "Backend server not available on either port. Waiting 5 seconds..." -ForegroundColor Red
                Start-Sleep -Seconds 5
                continue
            }
        }

        if (-not $backendRunning) {
            continue
        }
        
        # Attempt login
        $url = "http://localhost:$port/api/auth/signin"
        
        Write-Host "Sending login request to $url" -ForegroundColor Cyan
        $response = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "application/json" -ErrorAction Stop
        
        # Display login result
        Write-Host "`nLogin successful!" -ForegroundColor Green
        Write-Host "User details:" -ForegroundColor Cyan
        Write-Host "  Full Name: $($response.fullName)" -ForegroundColor White
        Write-Host "  Email: $($response.email)" -ForegroundColor White
        Write-Host "  Roles: $($response.roles -join ', ')" -ForegroundColor White
        
        $success = $true
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
        
        if ($attempts -lt $maxAttempts) {
            Write-Host "Waiting 5 seconds before retrying..." -ForegroundColor Yellow
            Start-Sleep -Seconds 5
        }
    }
}

if (-not $success) {
    Write-Host "`nFailed to login after $maxAttempts attempts." -ForegroundColor Red
    
    # Check what might be wrong with the database roles
    Write-Host "`nChecking database roles and users..." -ForegroundColor Yellow
    try {
        $queryResult = sqlcmd -S localhost -U sa -P 123456 -d HealthSchoolDB -Q "SELECT u.username, u.password, r.role_name FROM Users u JOIN Roles r ON u.role_id = r.role_id WHERE username = 'parent.smith'" | Out-String
        Write-Host $queryResult -ForegroundColor White
    } catch {
        Write-Host "Could not query database: $($_.Exception.Message)" -ForegroundColor Red
    }
}
