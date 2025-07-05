# Tính năng Chỉnh sửa và Xóa Medication Request

## Các tính năng đã thêm

1. **Thêm chức năng Chỉnh sửa Medication Request**
   - Chỉ cho phép chỉnh sửa các request có status "PENDING" 
   - Tạo trang EditMedicationRequestPage để chỉnh sửa thông tin yêu cầu
   - Thêm API Endpoint ở backend để cập nhật thông tin yêu cầu

2. **Thêm chức năng Xóa Medication Request**
   - Chỉ cho phép xóa các request có status "PENDING"
   - Hiển thị hộp thoại xác nhận trước khi xóa
   - Thêm API Endpoint ở backend để xóa yêu cầu

3. **Cải thiện giao diện người dùng**
   - Thêm nút Edit và Delete trong trang chi tiết medication request
   - Thêm nút Edit và Delete trong danh sách các medication request
   - Hiển thị thông báo success/error sau khi thực hiện các thao tác

## Các tệp đã thay đổi

1. **Backend:**
   - `MedicationRequestController.java`: Thêm endpoints mới cho update và delete
   - `MedicationRequestService.java`: Thêm phương thức xử lý logic update và delete

2. **Frontend:**
   - `MedicationRequestDetailPage.js`: Thêm nút Edit và Delete và hộp thoại xác nhận
   - `ViewMedicationRequestsPage.js`: Thêm nút Edit và Delete và hộp thoại xác nhận
   - `EditMedicationRequestPage.js`: Tạo trang mới cho chức năng chỉnh sửa
   - `App.js`: Thêm route mới cho trang chỉnh sửa medication request

## Lưu ý quan trọng

- Chỉ cho phép chỉnh sửa và xóa các yêu cầu có status là "PENDING"
- Tất cả các yêu cầu sau khi được phê duyệt (APPROVED) hoặc từ chối (REJECTED) sẽ không thể chỉnh sửa hoặc xóa
- Parent chỉ có quyền chỉnh sửa hoặc xóa các yêu cầu do chính họ tạo ra
