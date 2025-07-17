# PowerShell Script để kiểm tra cấu trúc role trong hệ thống và kiểm tra khi login
# Script này nhằm mục đích phát hiện các vấn đề liên quan đến định dạng role
# và đảm bảo rằng họ đều đúng với bảng role trong database

$ErrorActionPreference = "Stop"

# Định nghĩa API URL
$apiBaseUrl = "http://localhost:8080/api"

# Role trong database
$dbRoles = @("Admin", "SchoolNurse", "Manager", "Parent", "Student")

Write-Host "=== Kiểm Tra Cấu Trúc Role Trong Hệ Thống ==="
Write-Host ""

# Kiểm tra endpoint API để lấy thông tin token
function Test-AuthMe {
    param(
        [string]$token
    )

    Write-Host "Kiểm tra thông tin người dùng với token hiện tại..."
    
    try {
        $headers = @{
            "Authorization" = "Bearer $token"
            "Content-Type" = "application/json"
        }
        
        $response = Invoke-RestMethod -Uri "$apiBaseUrl/auth/me" -Method Get -Headers $headers
        
        Write-Host "Thông tin người dùng từ API /auth/me:"
        Write-Host "Username: $($response.username)"
        Write-Host "Email: $($response.email)"
        Write-Host "Vai trò (roles): $($response.roles -join ', ')"
        
        # Kiểm tra định dạng vai trò
        foreach ($role in $response.roles) {
            if ($role.StartsWith("ROLE_")) {
                Write-Host "CẢNH BÁO: Định dạng vai trò '$role' chứa tiền tố ROLE_, không khớp với bảng database" -ForegroundColor Yellow
            } 
            elseif (-not $dbRoles -contains $role) {
                Write-Host "CẢNH BÁO: Vai trò '$role' không tồn tại trong bảng database" -ForegroundColor Yellow
            }
            else {
                Write-Host "Vai trò '$role' đúng định dạng và khớp với bảng database" -ForegroundColor Green
            }
        }
        
        return $response
    }
    catch {
        Write-Host "Lỗi khi kiểm tra thông tin người dùng: $_" -ForegroundColor Red
        return $null
    }
}

# Đăng nhập và lấy token
function Get-AuthToken {
    param(
        [string]$username,
        [System.Security.SecureString]$password
    )
    
    Write-Host "Đang đăng nhập với tài khoản '$username'..."
      $bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
    $plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
    
    $body = @{
        username = $username
        password = $plainPassword
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$apiBaseUrl/auth/signin" -Method Post -Body $body -ContentType "application/json"
        Write-Host "Đăng nhập thành công!" -ForegroundColor Green
        
        return $response.token
    }
    catch {
        Write-Host "Đăng nhập thất bại: $_" -ForegroundColor Red
        return $null
    }
}

# Yêu cầu thông tin đăng nhập nếu không cung cấp
$username = Read-Host "Nhập tên đăng nhập (nurse@example.com, parent@example.com, admin@example.com...)"
$password = Read-Host "Nhập mật khẩu" -AsSecureString
$bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)

# Lấy token
$token = Get-AuthToken -username $username -password $plainPassword

if ($token) {
    # Kiểm tra thông tin người dùng
    $userInfo = Test-AuthMe -token $token
    
    if ($userInfo) {
        # Kiểm tra role
        $hasSchoolNurseRole = $userInfo.roles -contains "SchoolNurse" -or $userInfo.roles -contains "ROLE_SCHOOLNURSE"
        $hasAdminRole = $userInfo.roles -contains "Admin" -or $userInfo.roles -contains "ROLE_ADMIN"
        
        # Test API endpoint
        if ($hasSchoolNurseRole -or $hasAdminRole) {
            Write-Host "`nKiểm tra quyền truy cập API Health Checkup Events..."
            
            try {
                $headers = @{
                    "Authorization" = "Bearer $token"
                    "Content-Type" = "application/json"
                }
                
                $eventsResponse = Invoke-RestMethod -Uri "$apiBaseUrl/health-checkup-events" -Method Get -Headers $headers
                Write-Host "Truy cập API Health Checkup Events thành công!" -ForegroundColor Green
                Write-Host "Số lượng sự kiện: $($eventsResponse.Count)"
                
                # Test API thêm sự kiện
                Write-Host "`nKiểm tra quyền thêm sự kiện..."
                
                # Dữ liệu sự kiện mẫu
                $eventData = @{
                    title = "Test Event from PS Script"
                    description = "Test description"
                    eventDate = (Get-Date).ToString("yyyy-MM-dd")
                    location = "Test location"
                    status = "PLANNED"
                    eventType = "HEALTH_CHECKUP"
                    classIds = @(1, 2)  # ID của các lớp (giả định)
                } | ConvertTo-Json
                
                try {
                    $createResponse = Invoke-RestMethod -Uri "$apiBaseUrl/health-checkup-events" -Method Post -Headers $headers -Body $eventData
                    Write-Host "Tạo sự kiện thành công với ID: $($createResponse.eventId)" -ForegroundColor Green
                    
                    # Xóa sự kiện vừa tạo để dọn dẹp
                    if ($hasAdminRole) {
                        try {
                            Invoke-RestMethod -Uri "$apiBaseUrl/health-checkup-events/$($createResponse.eventId)" -Method Delete -Headers $headers | Out-Null
                            Write-Host "Đã xóa sự kiện test" -ForegroundColor Green
                        } 
                        catch {
                            Write-Host "Không thể xóa sự kiện test: $_" -ForegroundColor Yellow
                        }
                    }
                }
                catch {
                    Write-Host "Lỗi khi tạo sự kiện: $_" -ForegroundColor Red
                    Write-Host "Response: $($_.Exception.Response.StatusCode.value__) $($_.Exception.Response.StatusDescription)" -ForegroundColor Red
                    
                    if ($_.Exception.Response.StatusCode.value__ -eq 403) {
                        Write-Host "LỖI QUYỀN TRUY CẬP! Có thể do vấn đề kiểm tra role không đúng!" -ForegroundColor Red
                    }
                }
            }
            catch {
                Write-Host "Lỗi khi truy cập API Health Checkup Events: $_" -ForegroundColor Red
                Write-Host "Response: $($_.Exception.Response.StatusCode.value__) $($_.Exception.Response.StatusDescription)" -ForegroundColor Red
            }
        }
        else {
            Write-Host "Tài khoản không có quyền SchoolNurse hoặc Admin, bỏ qua kiểm tra API" -ForegroundColor Yellow
        }
    }
}

Write-Host "`nKiểm tra hoàn tất."
