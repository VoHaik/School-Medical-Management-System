Write-Host "Basic Port Check" -ForegroundColor Cyan
Write-Host "===============" -ForegroundColor Cyan

# Check if ports 8080 or 8081 are in use
Write-Host "Checking port usage:" -ForegroundColor Yellow
Write-Host "netstat -ano | findstr :8080" -ForegroundColor Gray
netstat -ano | findstr :8080

Write-Host "`nnetstat -ano | findstr :8081" -ForegroundColor Gray
netstat -ano | findstr :8081

# List Java processes
Write-Host "`nListing Java processes:" -ForegroundColor Yellow
Get-Process java -ErrorAction SilentlyContinue | Format-Table Id, ProcessName, Path, StartTime

# Try a simple connection test
Write-Host "`nAttempting connection to backend:" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8081" -Method GET -TimeoutSec 2
    Write-Host "Response from port 8081: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Error connecting to port 8081: $($_.Exception.Message)" -ForegroundColor Red
}

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080" -Method GET -TimeoutSec 2
    Write-Host "Response from port 8080: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Error connecting to port 8080: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nCheck complete" -ForegroundColor Cyan
