# Script sửa tất cả các annotation role trong controller Java từ hasRole sang hasAuthority
# và cập nhật tên role theo đúng với database (Admin, SchoolNurse, Manager, Parent, Student)

param (
    [string]$baseDir = "C:\Users\Khai\Documents\GitHub\School-Medical-Management-System\backend\src\main\java\com\swp391_8\schoolhealth\controller"
)

# Kiểm tra thư mục tồn tại
if (-not (Test-Path $baseDir)) {
    Write-Error "Thư mục $baseDir không tồn tại!"
    exit 1
}

# Các mapping role cần thay đổi
$roleMappings = @{
    "hasRole('ADMIN')" = "hasAuthority('Admin')"
    "hasRole('SCHOOLNURSE')" = "hasAuthority('SchoolNurse')"
    "hasRole('NURSE')" = "hasAuthority('SchoolNurse')"  # NURSE -> SchoolNurse
    "hasRole('MANAGER')" = "hasAuthority('Manager')"
    "hasRole('TEACHER')" = "hasAuthority('Manager')"    # TEACHER -> Manager
    "hasRole('PARENT')" = "hasAuthority('Parent')"
    "hasRole('STUDENT')" = "hasAuthority('Student')"
    
    # Các variant có thể có khác
    "hasAnyRole('ADMIN')" = "hasAuthority('Admin')"
    "hasAnyRole('NURSE')" = "hasAuthority('SchoolNurse')"
    "hasAnyRole('SCHOOLNURSE')" = "hasAuthority('SchoolNurse')"
    "hasAnyRole('NURSE', 'ADMIN')" = "hasAuthority('SchoolNurse') or hasAuthority('Admin')"
    "hasAnyRole('PARENT', 'ADMIN')" = "hasAuthority('Parent') or hasAuthority('Admin')"
}

# Tìm tất cả các file Java trong thư mục controller
$javaFiles = Get-ChildItem -Path $baseDir -Filter "*.java" -Recurse

$changedFiles = 0
foreach ($file in $javaFiles) {    $content = Get-Content $file.FullName -Raw
    $changed = $false
    
    # Thực hiện thay thế cho từng mapping
    foreach ($key in $roleMappings.Keys) {
        if ($content -match [regex]::Escape($key)) {
            $content = $content -replace [regex]::Escape($key), $roleMappings[$key]
            $changed = $true
        }
    }
    
    # Nếu có thay đổi, ghi file
    if ($changed) {
        $changedFiles++
        Set-Content -Path $file.FullName -Value $content
        Write-Host "Đã sửa file: $($file.FullName)"
    }
}

Write-Host "Đã sửa $changedFiles file controller."

# Hướng dẫn build lại backend sau khi sửa đổi
Write-Host "Hãy build lại backend sau khi đã sửa đổi các annotation bằng lệnh: mvn clean package -DskipTests"
