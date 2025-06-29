# Script để tạo bảng health_checkup_event_notifications
# Bảng này lưu thông tin về các lớp cần được thông báo cho mỗi sự kiện

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$sqlScriptPath = Join-Path (Split-Path -Parent $scriptPath) "sql\create_health_checkup_event_notifications.sql"
$dbName = "HealthSchoolDB"

Write-Host "Tạo bảng health_checkup_event_notifications..."

# Sử dụng sqlcmd để thực thi script SQL
sqlcmd -S localhost -d $dbName -i $sqlScriptPath

# Kiểm tra kết quả
if ($LASTEXITCODE -eq 0) {
    Write-Host "Đã tạo bảng health_checkup_event_notifications thành công!" -ForegroundColor Green
} else {
    Write-Host "Đã xảy ra lỗi khi tạo bảng health_checkup_event_notifications. Kiểm tra lại script." -ForegroundColor Red
}

Write-Host "Đã hoàn thành!"
