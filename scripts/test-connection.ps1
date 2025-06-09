Write-Host "Testing Frontend-Backend Connection" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if backend is running
Write-Host "Step 1: Checking if backend is running..." -ForegroundColor Yellow

$ports = @(8081, 8080)
$backendFound = $false
$workingPort = $null
$publicEndpoint = "/api/public/test"
$authEndpoint = "/api/auth/signin"

foreach ($port in $ports) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$port$publicEndpoint" -Method GET -TimeoutSec 3 -ErrorAction Stop
        $backendFound = $true
        $workingPort = $port
        Write-Host "✅ Backend found on port $port with status $($response.StatusCode)" -ForegroundColor Green
        break
    } catch {
        Write-Host "❌ Backend not found on port $port: $($_.Exception.Message)" -ForegroundColor Red
    }
}

if (-not $backendFound) {
    Write-Host "`nBackend is not running or not accessible. Starting it now..." -ForegroundColor Yellow
    
    # Try to start the backend
    Start-Process -FilePath "powershell" -ArgumentList "-ExecutionPolicy Bypass -File .\start-with-java17.ps1" -WindowStyle Normal
    
    Write-Host "`nWaiting 10 seconds for backend to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    
    # Check again if backend is running
    foreach ($port in $ports) {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:$port$publicEndpoint" -Method GET -TimeoutSec 3 -ErrorAction Stop
            $backendFound = $true
            $workingPort = $port
            Write-Host "✅ Backend started successfully on port $port" -ForegroundColor Green
            break
        } catch {
            Write-Host "❌ Backend still not accessible on port $port" -ForegroundColor Red
        }
    }
    
    if (-not $backendFound) {
        Write-Host "`nFailed to start backend. Please start it manually:" -ForegroundColor Red
        Write-Host "1. Run .\start-with-java17.ps1 script" -ForegroundColor Yellow
        Write-Host "2. Or run .\start-backend.bat if you have Java 17+ installed" -ForegroundColor Yellow
        exit 1
    }
}

# Step 2: Test authentication
Write-Host "`nStep 2: Testing authentication with parent.smith/Password123..." -ForegroundColor Yellow

$loginBody = @{
    username = "parent.smith"
    password = "Password123"
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
    "Origin" = "http://localhost:3000"
}

$token = $null
try {
    $authUrl = "http://localhost:$workingPort$authEndpoint"
    Write-Host "Sending POST request to $authUrl" -ForegroundColor Yellow
    
    $authResponse = Invoke-RestMethod -Uri $authUrl -Method Post -Body $loginBody -Headers $headers -ErrorAction Stop
    Write-Host "✅ Authentication successful!" -ForegroundColor Green
    
    # Extract the token
    $token = $authResponse.token -or $authResponse.accessToken
    if ($token) {
        Write-Host "✅ Received authentication token: $($token.Substring(0, 20))..." -ForegroundColor Green
    } else {
        Write-Host "❓ Authentication succeeded but no token was returned. Response:" -ForegroundColor Yellow
        $authResponse | Format-List
    }
} catch {
    Write-Host "❌ Authentication failed:" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        
        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $reader.BaseStream.Position = 0
            $reader.DiscardBufferedData()
            $responseBody = $reader.ReadToEnd()
            Write-Host "Error Response: $responseBody" -ForegroundColor Red
        } catch {
            Write-Host "Could not read error response body" -ForegroundColor Red
        }
    } else {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Step 3: Test frontend proxy
Write-Host "`nStep 3: Testing frontend proxy configuration..." -ForegroundColor Yellow
$setupProxyPath = "frontend/src/setupProxy.js"

if (Test-Path $setupProxyPath) {
    # Check the proxy target
    $proxyContent = Get-Content $setupProxyPath -Raw
    
    if ($proxyContent -match "target.*?http://localhost:(\d+)") {
        $proxyPort = $Matches[1]
        if ($proxyPort -eq $workingPort) {
            Write-Host "✅ Proxy is correctly configured to use port $proxyPort" -ForegroundColor Green
        } else {
            Write-Host "❌ Proxy is configured to use port $proxyPort, but backend is on port $workingPort" -ForegroundColor Red
            Write-Host "   Running fix-connection-issues.ps1 will fix this issue" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❓ Could not determine proxy target port from setupProxy.js" -ForegroundColor Yellow
    }
    
    # Check if proxy has port fallback logic
    if ($proxyContent -match "8080.*?8081|8081.*?8080") {
        Write-Host "✅ Proxy has fallback logic to try both ports" -ForegroundColor Green
    } else {
        Write-Host "❓ Proxy might not have proper port fallback logic" -ForegroundColor Yellow
        Write-Host "   Running fix-connection-issues.ps1 will add this functionality" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ setupProxy.js not found at $setupProxyPath" -ForegroundColor Red
    Write-Host "   Running fix-connection-issues.ps1 will create it" -ForegroundColor Yellow
}

# Summary and recommendations
Write-Host "`nConnection Test Summary:" -ForegroundColor Cyan
if ($backendFound) {
    Write-Host "✅ Backend is running on port $workingPort" -ForegroundColor Green
} else {
    Write-Host "❌ Backend is not running" -ForegroundColor Red
}

if ($token) {
    Write-Host "✅ Authentication is working" -ForegroundColor Green
} else {
    Write-Host "❌ Authentication is not working" -ForegroundColor Red
}

Write-Host "`nRecommendations:" -ForegroundColor Cyan
if (-not $backendFound) {
    Write-Host "1. Start the backend using .\start-with-java17.ps1" -ForegroundColor Yellow
}

if (-not $token -or -not (Test-Path $setupProxyPath)) {
    Write-Host "1. Run .\fix-connection-issues.ps1 to update proxy configuration" -ForegroundColor Yellow
}

if ($backendFound -and $token) {
    Write-Host "1. Start the frontend: cd frontend && npm start" -ForegroundColor Green
    Write-Host "2. Login with username: parent.smith, password: Password123" -ForegroundColor Green
}
