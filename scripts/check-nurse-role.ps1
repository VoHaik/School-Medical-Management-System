# Script kiểm tra role của user nurse.johnson
Write-Host "Checking nurse.johnson role..." -ForegroundColor Green

try {
    # Kết nối database và query
    $query = "SELECT u.username, u.full_name, r.role_name FROM [User] u LEFT JOIN Role r ON u.role_id = r.role_id WHERE u.username = 'nurse.johnson';"
    
    Write-Host "SQL Query: $query" -ForegroundColor Cyan
    
    # Nếu có SQL Server tools, chạy query
    # Nếu không, hiển thị hướng dẫn
    Write-Host ""
    Write-Host "Please run the following SQL query in your database management tool:" -ForegroundColor Yellow
    Write-Host $query -ForegroundColor White
    Write-Host ""
    Write-Host "Expected result should show:" -ForegroundColor Magenta
    Write-Host "username: nurse.johnson" -ForegroundColor White
    Write-Host "role_name: SchoolNurse (or Admin)" -ForegroundColor White
    Write-Host ""
    Write-Host "If the user doesn't exist or doesn't have the right role, that's the problem!" -ForegroundColor Red
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
