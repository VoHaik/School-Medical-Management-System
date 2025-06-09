# Test login with different user accounts
Write-Host "Testing login with multiple accounts..." -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

$accounts = @(
    @{
        username = "admin.user"
        password = "Password123"
    },
    @{
        username = "nurse.johnson"
        password = "Password123"
    },
    @{
        username = "manager.davis"
        password = "Password123"
    },
    @{
        username = "parent.smith"
        password = "Password123"
    }
)

$port = 8080
$url = "http://localhost:$port/api/auth/signin"

foreach ($account in $accounts) {
    $body = $account | ConvertTo-Json
    
    Write-Host "`nTesting account: $($account.username)" -ForegroundColor Yellow
    
    try {
        Write-Host "  Sending login request..." -ForegroundColor Gray
        $response = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "application/json" -TimeoutSec 5 -ErrorAction Stop
        
        Write-Host "  ✓ Login successful!" -ForegroundColor Green
        Write-Host "  Username: $($response.username)" -ForegroundColor Green
        if ($response.roles) {
            Write-Host "  Roles: $($response.roles -join ', ')" -ForegroundColor Green
        }
    } catch {
        Write-Host "  ✗ Login failed" -ForegroundColor Red
        if ($_.Exception.Response) {
            $statusCode = $_.Exception.Response.StatusCode.value__
            Write-Host "  Status Code: $statusCode" -ForegroundColor Red
        }
    }
}
