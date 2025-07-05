# Hướng Dẫn Sửa Lỗi "Conversion from Text to NCHAR is Unsupported"

## Vấn Đề

Lỗi này xảy ra khi hệ thống cố gắng chuyển đổi một giá trị từ kiểu `TEXT` (hoặc tương tự) sang kiểu `NCHAR` trong cơ sở dữ liệu SQL Server. Cụ thể, lỗi xuất hiện khi lưu dữ liệu vào trường `target_grade_levels` trong bảng `health_checkup_events`.

Thông báo lỗi: 
```
Could not extract column [4] from JDBC ResultSet [The conversion from text to NCHAR is unsupported.] [n/a]
```

## Nguyên Nhân

Nguyên nhân chính là do sự không tương thích giữa kiểu dữ liệu trong entity Java (được đánh dấu với `@Nationalized`) và kiểu dữ liệu thực tế trong schema cơ sở dữ liệu. SQL Server không hỗ trợ chuyển đổi tự động từ kiểu dữ liệu `TEXT` sang `NCHAR`.

## Giải Pháp

Đã thực hiện các thay đổi sau để khắc phục vấn đề:

1. **Thay đổi Entity Model**:
   - Đã cập nhật annotation trong class `HealthCheckupEvent.java`:
   - Thay thế `@Nationalized` bằng `columnDefinition = "NVARCHAR(255)"` cho trường targetGradeLevels

2. **Tạo Script SQL**:
   - Đã tạo script `fix-target-grade-levels-column.sql` để sửa kiểu dữ liệu trong cơ sở dữ liệu
   - Script sẽ:
     - Sao lưu dữ liệu hiện có
     - Thay đổi kiểu dữ liệu của cột target_grade_levels thành NVARCHAR

3. **Công Cụ Thực Thi**:
   - Đã tạo script PowerShell và Batch để thực thi SQL script một cách dễ dàng

## Cách Thực Hiện Sửa Lỗi

### Cách 1: Sử dụng Script

1. Mở terminal hoặc PowerShell
2. Di chuyển đến thư mục scripts trong dự án
3. Chạy script `fix-db-nchar-issue.ps1` (PowerShell) hoặc `fix-db-nchar-issue.bat` (Windows)
4. Nhập thông tin kết nối cơ sở dữ liệu khi được yêu cầu

### Cách 2: Thực Hiện Thủ Công

1. Kết nối đến SQL Server bằng SQL Server Management Studio
2. Mở script `sql/fix-target-grade-levels-column.sql`
3. Thực thi script trên cơ sở dữ liệu HealthSchoolDB
4. Kiểm tra logs để đảm bảo không có lỗi xảy ra

## Kiểm Tra Sau Khi Sửa

1. Khởi động lại ứng dụng
2. Thử tạo một sự kiện khám sức khỏe mới với khối lớp được chọn
3. Kiểm tra xem sự kiện đã được lưu thành công chưa

## Thay Đổi UI

Ngoài việc sửa lỗi cơ sở dữ liệu, chúng tôi cũng đã cải thiện giao diện người dùng cho việc chọn khối lớp:
- Thay thế trường nhập văn bản bằng hệ thống checkbox
- Người dùng có thể chọn nhiều khối lớp một cách trực quan
- Dữ liệu được lưu theo định dạng chuỗi phù hợp với cơ sở dữ liệu

## Ghi Chú Thêm

Nếu sau khi thực hiện các bước trên mà vấn đề vẫn tồn tại, vui lòng kiểm tra:
1. Logs của ứng dụng để tìm thêm thông tin lỗi
2. Schema cơ sở dữ liệu để đảm bảo thay đổi đã được áp dụng
3. Cấu hình Hibernate và kết nối JDBC
