# Hướng Dẫn Đơn Giản Hóa Entity MedicationInventory

## Tổng quan

Tài liệu này mô tả quá trình đơn giản hóa entity `MedicationInventory` và loại bỏ entity `MedicationUsage` không cần thiết trong hệ thống quản lý thuốc.

## Các thay đổi chính

1. **Đơn giản hóa MedicationInventory**
   - Giảm số lượng trường xuống còn các trường thiết yếu
   - Loại bỏ các mối quan hệ phức tạp
   - Loại bỏ các trường ít sử dụng

2. **Loại bỏ MedicationUsage**
   - Xóa bỏ toàn bộ entity MedicationUsage
   - Loại bỏ toàn bộ logic theo dõi lịch sử sử dụng thuốc

3. **Cập nhật các lớp liên quan**
   - Đơn giản hóa MedicationInventoryDTO
   - Điều chỉnh MedicationInventoryService
   - Cập nhật MedicationInventoryController

## Hướng dẫn thực hiện

1. **Chạy script SQL để đơn giản hóa cơ sở dữ liệu**
   ```
   sql/simplify_medication_inventory.sql
   ```

2. **Xóa các file không cần thiết**
   ```
   cd scripts
   powershell -ExecutionPolicy Bypass -File cleanup-medication-entities.ps1
   ```

3. **Biên dịch và kiểm tra**
   ```
   cd backend
   mvn clean compile
   ```

## Lưu ý quan trọng

- Đảm bảo sao lưu dữ liệu trước khi thực hiện các thay đổi
- Cập nhật giao diện người dùng phía frontend để phù hợp với cấu trúc dữ liệu mới
- Kiểm tra kỹ các chức năng liên quan đến quản lý thuốc sau khi triển khai thay đổi
