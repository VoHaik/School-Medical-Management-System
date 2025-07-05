# Cập Nhật Quản Lý Thuốc (Medication Management)

## Thay Đổi Đã Thực Hiện

1. **Bỏ trường Generic Name**
   - Đã xóa trường "Generic Name" (tên thuốc gốc) theo yêu cầu.
   - Cập nhật giao diện bảng dữ liệu thuốc để không hiển thị cột này.
   - Cập nhật form nhập liệu để không yêu cầu thông tin này.
   - Cập nhật schema xác thực (validation schema) để loại bỏ trường này.

2. **Làm rõ nguồn dữ liệu**
   - Đã thêm chú thích rằng hiện tại chưa có bảng trong CSDL để lưu trữ thông tin thuốc.
   - Dữ liệu đang được lưu tạm thời trong localStorage của trình duyệt.
   - Đã thêm mã mẫu (đã comment) cho việc tích hợp API backend trong tương lai.

3. **Cập nhật dữ liệu mẫu**
   - Đã Việt hóa và cập nhật dữ liệu mẫu.
   - Đã xóa trường genericName khỏi dữ liệu mẫu.

## Kế Hoạch Phát Triển

1. **Tạo bảng Medication trong CSDL**
   - Cần tạo bảng Medication trong database để lưu trữ thông tin thuốc.
   - Các trường cần thiết: medicationId, medicationName, form, dosage, expiryDate, quantity, unitCost, v.v.

2. **Phát triển API Backend**
   - Tạo endpoint `/api/medications/inventory` để quản lý kho thuốc.
   - Phát triển các chức năng CRUD:
     - GET: Lấy danh sách thuốc
     - POST: Thêm thuốc mới
     - PUT: Cập nhật thông tin thuốc
     - DELETE: Xóa thuốc

3. **Hoàn thiện giao diện**
   - Tách phần quản lý kho thuốc thành một trang riêng (nếu cần).
   - Bổ sung chức năng quản lý danh mục loại thuốc.
   - Bổ sung báo cáo sử dụng thuốc.

## Lưu ý

Hiện tại, việc lưu trữ trong localStorage chỉ là giải pháp tạm thời và sẽ bị mất khi người dùng xóa cache trình duyệt. Nên ưu tiên phát triển phần CSDL và API cho chức năng này trong thời gian tới.
