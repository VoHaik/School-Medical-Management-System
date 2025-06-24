# Simple login test
Write-Host "Testing login with multiple accounts..." -ForegroundColor Cyan

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
    
    Write-Host "`nTesting account: $($account.username)"
    
    try {
        Write-Host "  Sending login request..."
        $response = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "application/json" -ErrorAction Stop
        
        Write-Host "  Login successful!" -ForegroundColor Green
        Write-Host "  Username: $($response.username)" -ForegroundColor Green
    } catch {
        Write-Host "  Login failed" -ForegroundColor Red
        if ($_.Exception.Response) {
            $statusCode = $_.Exception.Response.StatusCode.value__
            Write-Host "  Status Code: $statusCode" -ForegroundColor Red
        }
    }
}
