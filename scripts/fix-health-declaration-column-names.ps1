# Script hỗ trợ sửa lỗi khi lưu health declaration
# Tác giả: Copilot
# Ngày: 2025-06-18

# Hiển thị banner
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "   SCRIPT SỬA LỖI LƯU HEALTH DECLARATION" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra các file cần thiết
$checkScriptPath = "$PSScriptRoot\..\sql\check_health_declaration_tables.sql"
$updateScriptPath = "$PSScriptRoot\..\sql\update_column_names.sql"

if (-not (Test-Path $checkScriptPath)) {
    Write-Host "Không tìm thấy file script kiểm tra: $checkScriptPath" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $updateScriptPath)) {
    Write-Host "Không tìm thấy file script cập nhật: $updateScriptPath" -ForegroundColor Red
    exit 1
}

# Hiển thị hướng dẫn
Write-Host "Lỗi khi lưu health declaration có thể do sự không khớp giữa tên cột" -ForegroundColor Yellow
Write-Host "trong mã Java và tên cột trong cơ sở dữ liệu." -ForegroundColor Yellow
Write-Host ""
Write-Host "Các bước để sửa lỗi:" -ForegroundColor Yellow
Write-Host "1. Chỉnh sửa tên cột trong file entity Java (đã thực hiện)" -ForegroundColor Green
Write-Host "2. Kiểm tra tên cột trong cơ sở dữ liệu" -ForegroundColor Yellow
Write-Host "3. Cập nhật tên cột trong cơ sở dữ liệu nếu cần" -ForegroundColor Yellow
Write-Host ""

# Hiển thị nội dung script kiểm tra
Write-Host "Nội dung script kiểm tra:" -ForegroundColor Cyan
Get-Content $checkScriptPath | ForEach-Object {
    Write-Host "  $_" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Để chạy script kiểm tra, sử dụng lệnh sau:" -ForegroundColor Cyan
Write-Host "sqlcmd -S <tên_server> -d HealthSchoolDB -i `"$checkScriptPath`"" -ForegroundColor White
Write-Host ""

# Hiển thị hướng dẫn cập nhật
Write-Host "Nếu script kiểm tra cho thấy cần cập nhật tên cột, hãy chạy script cập nhật:" -ForegroundColor Cyan
Write-Host "sqlcmd -S <tên_server> -d HealthSchoolDB -i `"$updateScriptPath`"" -ForegroundColor White
Write-Host ""

Write-Host "Lưu ý: Thay <tên_server> bằng tên SQL Server của bạn" -ForegroundColor Yellow
Write-Host "Ví dụ: localhost\SQLEXPRESS" -ForegroundColor Yellow
Write-Host ""

# Hỏi người dùng có muốn chạy các script không
$runCheck = Read-Host "Bạn có muốn chạy script kiểm tra ngay bây giờ? (Y/N)"
if ($runCheck -eq "Y" -or $runCheck -eq "y") {
    $serverName = Read-Host "Nhập tên SQL Server của bạn"
    
    # Chạy script kiểm tra
    Write-Host "Đang chạy script kiểm tra..." -ForegroundColor Cyan
    $checkCmd = "sqlcmd -S $serverName -d HealthSchoolDB -i `"$checkScriptPath`" -o check_result.txt"
    Invoke-Expression $checkCmd
    
    # Hiển thị kết quả kiểm tra
    if (Test-Path "check_result.txt") {
        Write-Host "Kết quả kiểm tra:" -ForegroundColor Cyan
        Get-Content "check_result.txt" | ForEach-Object {
            Write-Host "  $_" -ForegroundColor White
        }
        
        # Hỏi người dùng có muốn chạy script cập nhật không
        $runUpdate = Read-Host "Bạn có muốn chạy script cập nhật ngay bây giờ? (Y/N)"
        if ($runUpdate -eq "Y" -or $runUpdate -eq "y") {
            # Chạy script cập nhật
            Write-Host "Đang chạy script cập nhật..." -ForegroundColor Cyan
            $updateCmd = "sqlcmd -S $serverName -d HealthSchoolDB -i `"$updateScriptPath`" -o update_result.txt"
            Invoke-Expression $updateCmd
            
            # Hiển thị kết quả cập nhật
            if (Test-Path "update_result.txt") {
                Write-Host "Kết quả cập nhật:" -ForegroundColor Cyan
                Get-Content "update_result.txt" | ForEach-Object {
                    Write-Host "  $_" -ForegroundColor White
                }
                
                Write-Host "Đã hoàn thành quá trình cập nhật!" -ForegroundColor Green
                Write-Host "Bạn có thể khởi động lại ứng dụng và thử lưu health declaration." -ForegroundColor Green
            } else {
                Write-Host "Không tìm thấy kết quả cập nhật." -ForegroundColor Red
            }
        }
    } else {
        Write-Host "Không tìm thấy kết quả kiểm tra." -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "   KẾT THÚC SCRIPT SỬA LỖI" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
