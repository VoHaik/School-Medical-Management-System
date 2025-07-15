# Script xóa các file entity và repository không cần thiết sau khi đơn giản hóa

# Danh sách file cần xóa
$filesToRemove = @(
    "$PSScriptRoot\..\backend\src\main\java\com\swp391_8\schoolhealth\model\MedicationUsage.java",
    "$PSScriptRoot\..\backend\src\main\java\com\swp391_8\schoolhealth\repository\MedicationUsageRepository.java"
)

# Thực hiện xóa từng file
foreach ($file in $filesToRemove) {
    if (Test-Path -Path $file) {
        Write-Host "Đang xóa file: $file"
        Remove-Item -Path $file -Force
        Write-Host "Đã xóa thành công: $file"
    } else {
        Write-Host "File không tồn tại: $file"
    }
}

Write-Host "Đã hoàn tất việc xóa các file không cần thiết."
