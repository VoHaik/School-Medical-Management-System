# Script PowerShell để chạy script SQL thêm cột medication_quantity
# Đường dẫn đến sqlcmd
$sqlcmd = "sqlcmd"

# Đường dẫn đến file SQL
$sqlScript = "sql\add_medication_quantity_to_medical_events.sql"

# Kiểm tra xem file SQL có tồn tại không
if (Test-Path $sqlScript) {
    Write-Host "Đang chạy script SQL để thêm cột medication_quantity vào bảng medical_events..." -ForegroundColor Yellow
    
    # Chạy script SQL
    & $sqlcmd -S localhost -i $sqlScript
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Đã thêm cột medication_quantity thành công!" -ForegroundColor Green
    } else {
        Write-Host "Lỗi khi thêm cột medication_quantity. Mã lỗi: $LASTEXITCODE" -ForegroundColor Red
    }
} else {
    Write-Host "Không tìm thấy file SQL: $sqlScript" -ForegroundColor Red
}
