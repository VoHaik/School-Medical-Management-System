# Script để thêm trường event_type vào bảng health_checkup_events
# Thực thi SQL script để thêm trường mới và cập nhật dữ liệu

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$sqlScriptPath = Join-Path (Split-Path -Parent $scriptPath) "sql\add_event_type_to_health_checkup_events.sql"
$dbName = "HealthSchoolDB"

Write-Host "Thêm trường event_type vào bảng health_checkup_events..."

# Sử dụng sqlcmd để thực thi script SQL
sqlcmd -S localhost -d $dbName -i $sqlScriptPath

# Kiểm tra kết quả
if ($LASTEXITCODE -eq 0) {
    Write-Host "Đã thêm trường event_type thành công!" -ForegroundColor Green
} else {
    Write-Host "Đã xảy ra lỗi khi thêm trường event_type. Kiểm tra lại script." -ForegroundColor Red
}

Write-Host "Đã hoàn thành!"
