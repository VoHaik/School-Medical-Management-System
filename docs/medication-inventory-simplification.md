# Đơn Giản Hóa Quản Lý Thuốc

## Tổng Quan

Tài liệu này mô tả việc đơn giản hóa cấu trúc dữ liệu cho quản lý thuốc trong hệ thống School Medical Management System. Chúng tôi đã đơn giản hóa cấu trúc bằng cách chỉ giữ lại bảng `medication_inventory` với các trường cần thiết nhất, đồng thời loại bỏ bảng `medication_usage` và các bảng phụ khác.

## Các Thay Đổi Chính

1. **Đơn giản hóa bảng `medication_inventory`**:
   - Giữ lại chỉ những trường cần thiết: `medication_id`, `medication_name`, `dosage`, `form`, `batch_number`, `expiry_date`, `quantity`, `created_at`, `updated_at`.
   - Loại bỏ các trường ít sử dụng: `manufacturer`, `unit_cost`, `storage_location`, `prescription_required`, `created_by`, `updated_by`.
   - Loại bỏ các bảng phụ: `medication_side_effects`, `medication_contraindications`.

2. **Loại bỏ bảng `medication_usage`**:
   - Xóa toàn bộ bảng `medication_usage` vì các yêu cầu hiện tại không cần theo dõi chi tiết việc sử dụng thuốc.

3. **Cập nhật mã nguồn**:
   - Đã cập nhật class `MedicationInventory.java` để phản ánh cấu trúc mới.
   - Giữ nguyên `MedicationInventoryRepository.java` với các phương thức truy vấn hiện có.
   - Loại bỏ class `MedicationUsage.java` và `MedicationUsageRepository.java`.

## Các Bước Thực Hiện

1. **Cập nhật cơ sở dữ liệu**:
   - Chạy script SQL `simplify_medication_inventory.sql` để cập nhật cấu trúc bảng và giữ lại dữ liệu hiện có.

2. **Cập nhật mã nguồn**:
   - Đã cập nhật entity `MedicationInventory.java`.
   - Chạy script PowerShell `remove-unused-files.ps1` để xóa các file không còn sử dụng.

3. **Kiểm thử**:
   - Cần kiểm tra chức năng quản lý thuốc trên giao diện người dùng.
   - Đảm bảo các thao tác CRUD vẫn hoạt động bình thường.

## Lưu Ý

- Trước khi chạy script SQL, hãy đảm bảo đã sao lưu dữ liệu.
- Cần cập nhật giao diện người dùng để phản ánh cấu trúc dữ liệu mới (nếu cần).
- Nếu có code khác phụ thuộc vào `MedicationUsage`, cần điều chỉnh hoặc loại bỏ các tham chiếu này.
