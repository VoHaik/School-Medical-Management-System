# Tạo chức năng quản lý sự kiện và gửi thông báo

Tài liệu này hướng dẫn về các tính năng mới được thêm vào hệ thống để quản lý sự kiện khám sức khỏe và tiêm vaccine, đồng thời gửi thông báo cho phụ huynh theo lớp.

## Các tính năng đã được thêm

1. **Phân loại sự kiện**
   - Sự kiện khám sức khỏe tổng quát
   - Sự kiện tiêm vaccine

2. **Gửi thông báo cho phụ huynh theo lớp**
   - Cho phép chọn các lớp cần gửi thông báo
   - Thông báo tự động được gửi đến phụ huynh của tất cả học sinh trong các lớp được chọn

## Cấu trúc cơ sở dữ liệu

### Bảng `health_checkup_events` 
- Đã thêm trường `event_type` để phân loại loại sự kiện (HEALTH_CHECKUP, VACCINATION)

### Bảng `health_checkup_event_notifications` (mới)
- Lưu trữ thông tin về các lớp cần nhận thông báo cho từng sự kiện
- Theo dõi trạng thái đã gửi thông báo hay chưa

## Hướng dẫn sử dụng

### Tạo sự kiện mới
1. Truy cập vào "Create and Organize Event" từ menu hoặc dashboard
2. Nhấn nút "Create New Event"
3. Chọn loại sự kiện: "Khám sức khỏe tổng quát" hoặc "Tiêm vaccine"
4. Điền các thông tin cần thiết
5. Nếu muốn gửi thông báo, bật option "Gửi thông báo đến phụ huynh theo lớp" và chọn các lớp

### Chỉnh sửa sự kiện
1. Nhấn vào biểu tượng chỉnh sửa (bút) của sự kiện
2. Cập nhật thông tin
3. Có thể thay đổi lựa chọn các lớp nhận thông báo

## Cài đặt hệ thống

### Bước 1: Cập nhật cơ sở dữ liệu
Chạy script PowerShell để thêm trường `event_type` vào bảng `health_checkup_events`:
```
.\scripts\add-event-type-to-health-checkup-events.ps1
```

### Bước 2: Tạo bảng thông báo
Chạy script PowerShell để tạo bảng `health_checkup_event_notifications`:
```
.\scripts\create-health-checkup-event-notifications.ps1
```

## Chuẩn bị dữ liệu

Đối với chức năng gửi thông báo theo lớp, cần đảm bảo:
1. Dữ liệu về lớp học đã được cập nhật
2. Thông tin về mối quan hệ giữa học sinh và phụ huynh đã được thiết lập chính xác
3. Mỗi học sinh đã được gán vào một lớp cụ thể

## Lưu ý kỹ thuật

1. Trường `event_type` mặc định là "HEALTH_CHECKUP" cho các sự kiện cũ
2. Khi cập nhật giao diện, các mục liên quan đến loại khám/tiêm chủng sẽ thay đổi dựa trên loại sự kiện được chọn
3. Thông báo sẽ được gửi ngay sau khi sự kiện được tạo hoặc cập nhật (nếu có chọn lớp)
