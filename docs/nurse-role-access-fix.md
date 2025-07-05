# Hướng dẫn khắc phục lỗi phân quyền cho tài khoản y tá

## Vấn đề

Tài khoản y tá (nurse.johnson) không thể truy cập được trang quản lý sinh viên (/medical/student-management) do sự không nhất quán giữa tên vai trò (role) trong cơ sở dữ liệu và mã nguồn.

## Nguyên nhân

1. **Trong cơ sở dữ liệu**: Role y tá có tên là `SchoolNurse` (role_id=2)
2. **Trong backend (Java)**: Enum sử dụng `ROLE_SCHOOLNURSE` (định nghĩa trong ERole.java)
3. **Trong frontend**: Các route y tá được bảo vệ bằng `ROLE_NURSE` (không phải `ROLE_SCHOOLNURSE`)
4. **Chuyển đổi tên vai trò**: Backend sẽ tự động thêm tiền tố `ROLE_` nếu cần, vì vậy `SchoolNurse` được chuyển thành `ROLE_SCHOOLNURSE` khi gửi đến frontend

## Giải pháp đã áp dụng

### 1. Sửa frontend để chấp nhận ROLE_SCHOOLNURSE

Đã cập nhật tất cả các route trong `App.js` từ:
```jsx
<Route path="/medical/student-management" element={<ProtectedRoute roles={['ROLE_NURSE', 'ROLE_DOCTOR']}><StudentManagement /></ProtectedRoute>} />
```

Thành:
```jsx
<Route path="/medical/student-management" element={<ProtectedRoute roles={['ROLE_NURSE', 'ROLE_SCHOOLNURSE', 'ROLE_DOCTOR']}><StudentManagement /></ProtectedRoute>} />
```

### 2. Cập nhật tên vai trò trong cơ sở dữ liệu (tùy chọn)

Để đồng bộ hoàn toàn, có thể cập nhật cơ sở dữ liệu để thêm tiền tố `ROLE_` cho tất cả các vai trò:

```sql
UPDATE Roles SET role_name = 'ROLE_SCHOOLNURSE' WHERE role_name = 'SchoolNurse';
```

Đã tạo SQL script và PowerShell script để thực hiện thay đổi này nếu cần thiết.

## Cách xác nhận sửa lỗi

1. Đăng nhập với tài khoản `nurse.johnson`
2. Truy cập `/medical/student-management`
3. Xác nhận rằng trang được truy cập thành công (không bị "Access Denied")

## Tham khảo kỹ thuật

- `ERole.java`: Định nghĩa các enum cho vai trò, nên sử dụng các giá trị này trong mã
- `UserDetailsImpl.java`: Chuyển đổi từ `Role` thành `GrantedAuthority` cho Spring Security
- `ProtectedRoute.js`: Kiểm tra vai trò người dùng trong frontend
- `App.js`: Định nghĩa các route có bảo vệ và vai trò được phép

## Lưu ý phòng ngừa

Khi thay đổi vai trò hoặc cập nhật quyền truy cập, đảm bảo:

1. Kiểm tra sự nhất quán giữa cơ sở dữ liệu, backend và frontend
2. Xem xét cách vai trò được chuyển đổi từ cơ sở dữ liệu thành token JWT
3. Kiểm tra cách role được sử dụng trong logic phân quyền
