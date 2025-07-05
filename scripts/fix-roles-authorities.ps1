# Script để cập nhật tất cả các controller từ hasRole() sang hasAuthority() cho phù hợp với database
# Chạy script này từ thư mục gốc của dự án

# Định nghĩa các cặp role cần thay thế
$replacements = @{
    "hasRole('SCHOOLNURSE')" = "hasAuthority('SchoolNurse')"
    "hasRole('ADMIN')" = "hasAuthority('Admin')"
    "hasRole('PARENT')" = "hasAuthority('Parent')"
    "hasRole('STUDENT')" = "hasAuthority('Student')"
    "hasRole('MANAGER')" = "hasAuthority('Manager')"
}

# Tìm tất cả các file Java trong thư mục controller
$files = Get-ChildItem -Path "$PSScriptRoot\..\backend\src\main\java\com\swp391_8\schoolhealth\controller" -Filter "*.java" -Recurse

$totalReplacements = 0

foreach ($file in $files) {
    Write-Host "Đang kiểm tra file: $($file.FullName)"
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    $replacementsMade = 0
    
    foreach ($key in $replacements.Keys) {
        $value = $replacements[$key]
        if ($content -match [regex]::Escape($key)) {
            Write-Host "  Thay thế $key -> $value"
            $content = $content -replace [regex]::Escape($key), $value
            $replacementsMade++
            $totalReplacements++
        }
    }
    
    if ($replacementsMade -gt 0) {
        Write-Host "  Đã thực hiện $replacementsMade thay đổi trong $($file.Name)"
        Set-Content -Path $file.FullName -Value $content
    }
}

Write-Host "Hoàn thành! Đã thực hiện tổng cộng $totalReplacements thay đổi."
