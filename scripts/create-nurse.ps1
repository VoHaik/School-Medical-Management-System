# Script tạo tài khoản nurse với role SchoolNurse
Write-Host "Creating nurse account with SchoolNurse role..." -ForegroundColor Green

$baseUrl = "http://localhost:8080"
$headers = @{
    'Content-Type' = 'application/json'
}

# Thông tin tài khoản nurse
$nurseData = @{
    username = "nurse.johnson"
    password = "nurse123"
    email = "nurse.johnson@school.edu.vn"
    fullName = "Nurse Johnson"
    phoneNumber = "0123456789"
    role = "SchoolNurse"  # Đảm bảo role đúng với database
} | ConvertTo-Json

Write-Host "Request data: $nurseData" -ForegroundColor Cyan

try {
    # Tạo tài khoản nurse
    $response = Invoke-WebRequest -Uri "$baseUrl/api/auth/register" -Method POST -Body $nurseData -Headers $headers
    
    if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 201) {
        Write-Host "✅ Nurse account created successfully!" -ForegroundColor Green
        Write-Host "Username: nurse.johnson" -ForegroundColor Cyan
        Write-Host "Password: nurse123" -ForegroundColor Cyan
        Write-Host "Role: SchoolNurse" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "You can now login with this account to edit student health profiles." -ForegroundColor Yellow
    } else {
        Write-Host "❌ Failed to create nurse account. Status: $($response.StatusCode)" -ForegroundColor Red
        Write-Host "Response: $($response.Content)" -ForegroundColor Red
    }
} catch {
    $errorDetails = $_.Exception
    if ($errorDetails.Response -and $errorDetails.Response.StatusCode -eq 400) {
        Write-Host "⚠️  Account might already exist or validation failed." -ForegroundColor Yellow
        Write-Host "Try logging in with: username=nurse.johnson, password=nurse123" -ForegroundColor Cyan
        Write-Host "Error details: $($errorDetails.Message)" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Error creating nurse account: $($errorDetails.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "If the user already exists, make sure they have 'SchoolNurse' role in the database." -ForegroundColor Magenta
