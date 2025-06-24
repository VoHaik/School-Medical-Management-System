Write-Host "Backend Connection Check" -ForegroundColor Cyan
Write-Host "======================" -ForegroundColor Cyan

# Test various endpoint combinations
$urls = @(
    "http://localhost:8081",
    "http://localhost:8080",
    "http://localhost:8081/",
    "http://localhost:8080/"
)

foreach ($url in $urls) {
    Write-Host "`nTesting connection to: $url" -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri $url -Method GET -TimeoutSec 3
        Write-Host "✅ Success! Status: $($response.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed! Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Now try a Spring Boot Actuator endpoint, which Spring Boot usually enables
$actuatorUrls = @(
    "http://localhost:8081/actuator/health",
    "http://localhost:8080/actuator/health"
)

foreach ($url in $actuatorUrls) {
    Write-Host "`nTesting Spring Boot health endpoint: $url" -ForegroundColor Magenta
    try {
        $response = Invoke-WebRequest -Uri $url -Method GET -TimeoutSec 3
        Write-Host "✅ Success! Status: $($response.StatusCode)" -ForegroundColor Green
        Write-Host $response.Content -ForegroundColor Gray
    } catch {
        Write-Host "❌ Failed! Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Check if port is actually in use
Write-Host "`nChecking if ports are in use:" -ForegroundColor Cyan
$ports = @(8080, 8081)

foreach ($port in $ports) {
    $connections = netstat -ano | findstr ":$port "
    if ($connections) {
        Write-Host "Port $port is in use by these processes:" -ForegroundColor Green
        $connections
    } else {
        Write-Host "Port $port is not in use by any process" -ForegroundColor Red
    }
}

# Check if Java processes are running
Write-Host "`nChecking for running Java processes:" -ForegroundColor Cyan
$javaProcesses = Get-Process -Name "java" -ErrorAction SilentlyContinue
if ($javaProcesses) {
    Write-Host "Found Java processes running:" -ForegroundColor Green
    $javaProcesses | Select-Object Id, ProcessName, Path, StartTime | Format-Table -AutoSize
} else {
    Write-Host "No Java processes found running!" -ForegroundColor Red
}
