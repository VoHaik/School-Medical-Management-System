# Hệ thống Thông báo Mới (New Notification System)

## Tổng quan

Hệ thống thông báo mới đã được tạo để thay thế các popup cơ bản `alert()` và `window.confirm()` bằng các component Material-UI đẹp hơn và có animation.

## Các component chính

### 1. NotificationProvider
- Context provider quản lý tất cả notifications
- Đã được tích hợp vào App.js

### 2. useAlert Hook
- Hook tiện lợi để sử dụng notification system
- Thay thế trực tiếp cho `alert()` và `window.confirm()`

### 3. Custom Components
- **CustomDialog**: Dialog xác nhận đẹp hơn
- **VaccinationSuccessDialog**: Dialog đặc biệt cho thông báo tiêm chủng

## Cách sử dụng

### Import hook
```javascript
import { useAlert } from '../hooks/useAlert';
```

### Trong component
```javascript
const MyComponent = () => {
  const { successAlert, errorAlert, warningAlert, infoAlert, deleteConfirm, cancelConfirm } = useAlert();

  // Thay vì: alert('Success!')
  const handleSuccess = () => {
    successAlert('Thành công!');
  };

  // Thay vì: window.confirm('Are you sure?')
  const handleDelete = async () => {
    const confirmed = await deleteConfirm('mục này');
    if (confirmed) {
      // Thực hiện xóa
      successAlert('Đã xóa thành công!');
    }
  };

  return (
    // JSX content
  );
};
```

## Các phương thức có sẵn

### Thông báo cơ bản
- `successAlert(message)` - Thông báo thành công (màu xanh)
- `errorAlert(message)` - Thông báo lỗi (màu đỏ)
- `warningAlert(message)` - Thông báo cảnh báo (màu vàng)
- `infoAlert(message)` - Thông báo thông tin (màu xanh dương)

### Dialog xác nhận
- `deleteConfirm(itemName)` - Xác nhận xóa
- `cancelConfirm(actionName)` - Xác nhận hủy
- `submitConfirm(actionName)` - Xác nhận gửi

### Tùy chỉnh
```javascript
const confirmed = await showConfirm({
  title: 'Tiêu đề tùy chỉnh',
  message: 'Nội dung tùy chỉnh',
  confirmText: 'Đồng ý',
  cancelText: 'Hủy',
  severity: 'warning' // 'info', 'warning', 'error', 'success'
});
```

## Các file đã được cập nhật

1. **MedicationSubmission.js** - Thay thế alert() và confirm()
2. **HealthDeclaration.js** - Thay thế alert() và confirm()
3. **HealthEventManagement.js** - Thêm VaccinationSuccessDialog
4. **ParentHealthCheckupOverview.js** - Thay thế alert()
5. **ParentDashboard.js** - Thay thế alert() và confirm()

## Demo

Truy cập `/demo/notifications` để xem demo các loại thông báo mới.

## Features

### Animations
- Slide in/out từ phải qua trái cho snackbars
- Fade in/up cho dialogs
- Bounce effect cho success notifications
- Pulse animation cho loading states

### Responsive Design
- Tự động điều chỉnh kích thước trên mobile
- Stack notifications khi có nhiều thông báo cùng lúc

### Dark Mode Support
- Tự động thích ứng với theme dark/light
- Backdrop blur effect

### Accessibility
- Keyboard navigation support
- Screen reader friendly
- ARIA labels

## Tùy chỉnh

### Thời gian hiển thị
```javascript
successAlert('Message', 3000); // Hiện trong 3 giây
```

### Vị trí hiển thị
Có thể chỉnh sửa trong `NotificationProvider.js`:
```javascript
// Thay đổi từ top-right sang top-left
<Box sx={{ position: 'fixed', top: 16, left: 16, zIndex: 2000 }}>
```

### Custom styling
Chỉnh sửa file `notifications.css` để thay đổi animations và styles.

## Migration Guide

### Từ alert() sang notification mới
```javascript
// Cũ
alert('Success message');

// Mới
successAlert('Success message');
```

### Từ window.confirm() sang dialog mới
```javascript
// Cũ
if (window.confirm('Are you sure?')) {
  // Do something
}

// Mới
const confirmed = await deleteConfirm('item này');
if (confirmed) {
  // Do something
}
```

## Best Practices

1. **Sử dụng đúng loại thông báo:**
   - `successAlert()` cho thành công
   - `errorAlert()` cho lỗi
   - `warningAlert()` cho cảnh báo
   - `infoAlert()` cho thông tin

2. **Message rõ ràng:**
   - Sử dụng tiếng Việt có dấu
   - Nội dung ngắn gọn, dễ hiểu
   - Tránh technical terms

3. **Confirm dialogs:**
   - Sử dụng `deleteConfirm()` cho thao tác xóa
   - Sử dụng `cancelConfirm()` cho thao tác hủy
   - Sử dụng `submitConfirm()` cho thao tác gửi

4. **Performance:**
   - Tránh hiển thị quá nhiều notifications cùng lúc
   - Sử dụng debouncing cho các actions liên tiếp

## Troubleshooting

### Notification không hiển thị
- Kiểm tra NotificationProvider đã được wrap trong App.js
- Kiểm tra hook được sử dụng trong component đúng cách

### Animation không mượt
- Kiểm tra file CSS đã được import
- Kiểm tra không có CSS conflicts

### Dark mode không hoạt động
- Kiểm tra ThemeProvider đã được setup
- Kiểm tra theme context
