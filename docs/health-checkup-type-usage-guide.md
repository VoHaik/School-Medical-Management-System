# Hướng dẫn sử dụng trường "Loại khám/tiêm chủng" trong form tạo sự kiện y tế

## Tổng quan

Trường "Loại khám/tiêm chủng" trong form tạo/chỉnh sửa sự kiện y tế đã được nâng cấp để cho phép người dùng có hai cách nhập liệu:

1. **Chọn từ danh sách có sẵn**: Người dùng có thể chọn một hoặc nhiều loại khám/tiêm chủng từ danh sách đã được định nghĩa trước.
2. **Nhập thủ công**: Người dùng có thể nhập loại khám/tiêm chủng mới nếu không có trong danh sách có sẵn.

## Các tính năng chính

### 1. Danh sách loại khám/tiêm chủng động theo loại sự kiện

Danh sách các loại khám/tiêm chủng sẽ thay đổi tùy thuộc vào loại sự kiện được chọn:

- **Sự kiện khám sức khỏe (HEALTH_CHECKUP)**:
  - Kiểm tra thị lực
  - Kiểm tra thính lực
  - Khám răng miệng
  - Đo chiều cao/cân nặng
  - Khám tổng quát

- **Sự kiện tiêm vaccine (VACCINATION)**:
  - Vaccine BCG (Lao)
  - Vaccine DPT (Bạch hầu, Ho gà, Uốn ván)
  - Vaccine Polio (Bại liệt)
  - Vaccine Measles (Sởi)
  - Vaccine MMR (Sởi, Quai bị, Rubella)
  - Vaccine Viêm gan B
  - Loại vaccine khác

### 2. Thêm loại khám/tiêm chủng tùy chỉnh

Khi cần thêm loại khám/tiêm chủng không có trong danh sách:

1. Nhập tên loại khám/tiêm chủng mới vào ô văn bản "Thêm loại khám/tiêm chủng tùy chỉnh"
2. Nhấn nút "Thêm" hoặc phím Enter
3. Loại khám/tiêm chủng mới sẽ được thêm vào danh sách và tự động được chọn

### 3. Lưu trữ và hiển thị loại tùy chỉnh

- Các loại khám/tiêm chủng tùy chỉnh sẽ được lưu trữ với tiền tố "CUSTOM_" trong cơ sở dữ liệu
- Khi hiển thị trên giao diện, tiền tố "CUSTOM_" sẽ bị loại bỏ và tên sẽ được định dạng lại với chữ cái đầu viết hoa
- Các loại tùy chỉnh đã thêm sẽ vẫn xuất hiện trong danh sách khi chỉnh sửa sự kiện trong tương lai

### 4. Giao diện người dùng trực quan

- Các loại đã chọn sẽ hiển thị dưới dạng "chip" trong trường nhập liệu
- Thông báo sẽ hiện lên khi thêm loại mới thành công
- Nếu thêm một loại đã tồn tại, hệ thống sẽ thông báo và không thêm trùng lặp

## Quy trình sử dụng

1. Chọn loại sự kiện (khám sức khỏe hoặc tiêm vaccine)
2. Danh sách loại khám/tiêm chủng sẽ được cập nhật dựa trên loại sự kiện
3. Chọn một hoặc nhiều loại từ danh sách có sẵn
4. Nếu cần thêm loại mới:
   - Nhập tên loại mới vào ô văn bản
   - Nhấn nút "Thêm" hoặc phím Enter
   - Loại mới sẽ được thêm vào và tự động được chọn
5. Tiếp tục điền các thông tin khác của sự kiện
6. Nhấn nút "Tạo sự kiện" hoặc "Lưu thay đổi" để hoàn tất

## Lưu ý quan trọng

- Loại khám/tiêm chủng tùy chỉnh sẽ được lưu trữ và có thể sử dụng lại cho các sự kiện khác
- Tránh tạo các loại có tên gần giống nhau để dễ phân biệt
- Hệ thống đã có cơ chế kiểm tra trùng lặp, tuy nhiên nên kiểm tra kỹ danh sách có sẵn trước khi thêm mới
