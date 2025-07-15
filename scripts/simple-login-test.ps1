# Simple Direct Login Test for parent.smith account

Write-Host "Simple Direct Login Test" -ForegroundColor Cyan
Write-Host "======================" -ForegroundColor Cyan

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
    Write-Host "  Username: $($response.username)" -ForegroundColor White
    if ($response.fullName) {
        Write-Host "  Full Name: $($response.fullName)" -ForegroundColor White
    }
    if ($response.email) {
        Write-Host "  Email: $($response.email)" -ForegroundColor White
    }
    if ($response.roles) {
        Write-Host "  Roles: $($response.roles -join ', ')" -ForegroundColor White
    }
    if ($response.accessToken) {
        Write-Host "  Token received" -ForegroundColor White
    }
    exit 0
} catch {
    $errorMsg = $_.ToString()
    Write-Host "Login failed on port $port" -ForegroundColor Red
    Write-Host $errorMsg -ForegroundColor Red
}
