# PowerShell script để kiểm tra và chạy script cập nhật health_declaration
# Tác giả: Copilot
# Ngày: 2025-06-18

# Cấu hình kết nối đến database
$serverName = "(local)" # Thay đổi thành tên SQL Server của bạn
$databaseName = "HealthSchoolDB" # Thay đổi thành tên database của bạn
$userName = "" # Để trống nếu sử dụng Windows Authentication
$password = "" # Để trống nếu sử dụng Windows Authentication

# Đường dẫn đến script SQL
$updateScriptPath = "$PSScriptRoot\..\sql\update_health_declaration_schema_2025.sql"
$cleanupScriptPath = "$PSScriptRoot\..\sql\cleanup_health_declaration_schema_2025.sql"

# Hiển thị banner
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "   HEALTH DECLARATION DATABASE SCHEMA UPDATE TOOL" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra file script tồn tại
if (-not (Test-Path $updateScriptPath)) {
    Write-Host "Không tìm thấy file script cập nhật: $updateScriptPath" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $cleanupScriptPath)) {
    Write-Host "Không tìm thấy file script cleanup: $cleanupScriptPath" -ForegroundColor Red
    exit 1
}

# Hàm kết nối SQL Server và chạy query
function Run-SqlQuery {
    param (
        [string]$query,
        [string]$database = $databaseName
    )

    try {
        $connectionString = "Server=$serverName;Database=$database;Integrated Security=True;"
        if ($userName -and $password) {
            $connectionString = "Server=$serverName;Database=$database;User Id=$userName;Password=$password;"
        }

        $connection = New-Object System.Data.SqlClient.SqlConnection
        $connection.ConnectionString = $connectionString
        $connection.Open()

        $command = $connection.CreateCommand()
        $command.CommandText = $query
        $command.CommandTimeout = 120 # 2 phút timeout

        $reader = $command.ExecuteReader()
        $results = New-Object System.Collections.ArrayList

        while ($reader.Read()) {
            $row = @{}
            for ($i = 0; $i -lt $reader.FieldCount; $i++) {
                $row[$reader.GetName($i)] = $reader.GetValue($i)
            }
            $results.Add([PSCustomObject]$row) | Out-Null
        }

        $reader.Close()
        $connection.Close()

        return $results
    }
    catch {
        Write-Host "Lỗi khi chạy SQL query: $_" -ForegroundColor Red
        throw $_
    }
}

# Hàm chạy script SQL
function Run-SqlScript {
    param (
        [string]$scriptPath
    )

    try {
        # Đọc nội dung script
        $scriptContent = Get-Content $scriptPath -Raw

        # Sử dụng sqlcmd để chạy script
        $sqlcmdPath = "sqlcmd"
        $arguments = @(
            "-S", $serverName
            "-d", $databaseName
            "-E" # Windows Authentication
        )
        
        # Nếu có username và password
        if ($userName -and $password) {
            $arguments = @(
                "-S", $serverName
                "-d", $databaseName
                "-U", $userName
                "-P", $password
            )
        }
        
        # Thêm input file
        $arguments += @("-i", $scriptPath)
        
        # Chạy script và hiển thị output
        Write-Host "Đang chạy script $scriptPath..." -ForegroundColor Yellow
        $process = Start-Process -FilePath $sqlcmdPath -ArgumentList $arguments -Wait -NoNewWindow -PassThru
        
        # Kiểm tra kết quả
        if ($process.ExitCode -eq 0) {
            Write-Host "Script đã chạy thành công" -ForegroundColor Green
            return $true
        } else {
            Write-Host "Lỗi khi chạy script: Exit code $($process.ExitCode)" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "Lỗi khi chạy script: $_" -ForegroundColor Red
        return $false
    }
}

# Kiểm tra kết nối tới database
try {
    Write-Host "Đang kiểm tra kết nối tới database..." -ForegroundColor Yellow
    $testQuery = "SELECT DB_NAME() AS DatabaseName"
    $result = Run-SqlQuery -query $testQuery
    
    if ($result.Count -gt 0) {
        $dbName = $result[0].DatabaseName
        Write-Host "Kết nối thành công tới database: $dbName" -ForegroundColor Green
    } else {
        Write-Host "Không thể kết nối tới database" -ForegroundColor Red
        exit 1
    }
}
catch {
    Write-Host "Lỗi khi kết nối tới database: $_" -ForegroundColor Red
    exit 1
}

# Kiểm tra các bảng liên quan
Write-Host "`nĐang kiểm tra cấu trúc bảng health_declaration..." -ForegroundColor Yellow
try {
    # Kiểm tra bảng health_declaration
    $tableQuery = "SELECT COUNT(*) AS TableCount FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'health_declaration'"
    $tableResult = Run-SqlQuery -query $tableQuery
    
    if ($tableResult[0].TableCount -eq 0) {
        Write-Host "Bảng health_declaration không tồn tại trong database" -ForegroundColor Red
        exit 1
    }
    
    # Kiểm tra số lượng bản ghi trong health_declaration
    $countQuery = "SELECT COUNT(*) AS RecordCount FROM health_declaration"
    $countResult = Run-SqlQuery -query $countQuery
    $recordCount = $countResult[0].RecordCount
    
    Write-Host "Bảng health_declaration có $recordCount bản ghi" -ForegroundColor Cyan
    
    # Kiểm tra các trường trong health_declaration
    $columnsQuery = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'health_declaration'"
    $columns = Run-SqlQuery -query $columnsQuery
    
    Write-Host "Các trường hiện có trong bảng health_declaration:" -ForegroundColor Cyan
    foreach ($column in $columns) {
        Write-Host "  - $($column.COLUMN_NAME)"
    }
}
catch {
    Write-Host "Lỗi khi kiểm tra cấu trúc bảng: $_" -ForegroundColor Red
}

# Hỏi người dùng có muốn tiếp tục không
Write-Host "`n============================================================" -ForegroundColor Yellow
Write-Host "CẢNH BÁO: Script cập nhật và cleanup sẽ thay đổi cấu trúc bảng" -ForegroundColor Yellow
Write-Host "Hãy đảm bảo đã sao lưu dữ liệu trước khi tiếp tục" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Yellow

$confirmation = Read-Host "Bạn có muốn tiếp tục cập nhật cấu trúc bảng? (Y/N)"
if ($confirmation -ne "Y" -and $confirmation -ne "y") {
    Write-Host "Quá trình cập nhật đã bị hủy" -ForegroundColor Yellow
    exit 0
}

# Chạy script cập nhật
Write-Host "`nBắt đầu chạy script cập nhật cấu trúc bảng..." -ForegroundColor Cyan
$updateSuccess = Run-SqlScript -scriptPath $updateScriptPath

if (-not $updateSuccess) {
    Write-Host "Quá trình cập nhật không thành công. Script cleanup sẽ không được chạy." -ForegroundColor Red
    exit 1
}

# Hiển thị cấu trúc bảng sau khi cập nhật
try {
    Write-Host "`nCấu trúc bảng health_declaration sau khi cập nhật:" -ForegroundColor Cyan
    $updatedColumnsQuery = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'health_declaration'"
    $updatedColumns = Run-SqlQuery -query $updatedColumnsQuery
    
    foreach ($column in $updatedColumns) {
        Write-Host "  - $($column.COLUMN_NAME)"
    }
}
catch {
    Write-Host "Lỗi khi kiểm tra cấu trúc bảng sau khi cập nhật: $_" -ForegroundColor Red
}

# Hỏi người dùng có muốn chạy script cleanup không
Write-Host "`n============================================================" -ForegroundColor Red
Write-Host "CẢNH BÁO: Script cleanup sẽ XÓA các trường và bảng cũ" -ForegroundColor Red
Write-Host "Chỉ chạy sau khi đã kiểm tra kỹ lưỡng dữ liệu đã được di chuyển đầy đủ" -ForegroundColor Red
Write-Host "============================================================" -ForegroundColor Red

$cleanupConfirmation = Read-Host "Bạn có muốn chạy script cleanup ngay bây giờ? (Y/N)"
if ($cleanupConfirmation -eq "Y" -or $cleanupConfirmation -eq "y") {
    Write-Host "`nTrước khi chạy script cleanup, bạn cần chỉnh sửa file script để xác nhận:" -ForegroundColor Yellow
    Write-Host "1. Mở file $cleanupScriptPath" -ForegroundColor Yellow
    Write-Host "2. Thay đổi dòng @confirm = 'NO' thành @confirm = 'CONFIRM'" -ForegroundColor Yellow
    Write-Host "3. Lưu file và chạy lại script này" -ForegroundColor Yellow
    
    $editConfirmation = Read-Host "Bạn đã chỉnh sửa file script cleanup để xác nhận chưa? (Y/N)"
    if ($editConfirmation -eq "Y" -or $editConfirmation -eq "y") {
        Write-Host "`nBắt đầu chạy script cleanup..." -ForegroundColor Cyan
        $cleanupSuccess = Run-SqlScript -scriptPath $cleanupScriptPath
        
        if ($cleanupSuccess) {
            Write-Host "`nQuá trình cập nhật và cleanup đã hoàn tất thành công!" -ForegroundColor Green
        } else {
            Write-Host "`nProcess cleanup không thành công. Vui lòng kiểm tra lỗi và thử lại." -ForegroundColor Red
        }
    } else {
        Write-Host "`nQuá trình cleanup đã bị hủy. Bạn có thể chạy lại script này sau khi đã chỉnh sửa file cleanup." -ForegroundColor Yellow
    }
} else {
    Write-Host "`nQuá trình cập nhật cấu trúc bảng đã hoàn tất." -ForegroundColor Green
    Write-Host "Bạn có thể chạy script cleanup sau khi đã kiểm tra kỹ dữ liệu." -ForegroundColor Green
}

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "   KẾT THÚC QUÁ TRÌNH CẬP NHẬT CẤU TRÚC BẢNG" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
