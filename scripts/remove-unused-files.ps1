# Script để xóa các file không còn sử dụng
# Sau khi đơn giản hóa cấu trúc dữ liệu medication_inventory

# Đường dẫn tới các file cần xóa
$files = @(
    "..\backend\src\main\java\com\swp391_8\schoolhealth\model\MedicationUsage.java",
    "..\backend\src\main\java\com\swp391_8\schoolhealth\repository\MedicationUsageRepository.java"
)

# Xóa từng file
foreach ($file in $files) {
    $fullPath = Join-Path $PSScriptRoot $file
    
    if (Test-Path $fullPath) {
        Write-Host "Removing file: $fullPath"
        Remove-Item $fullPath
        Write-Host "File removed successfully!"
    } else {
        Write-Host "File not found: $fullPath"
    }
}

Write-Host "`nFile cleanup completed!"
Write-Host "Files removed:"
foreach ($file in $files) {
    Write-Host "- $file"
}
