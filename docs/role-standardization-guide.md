# Hướng Dẫn Chuẩn Hóa Role Trong Hệ Thống

## Giới thiệu

Document này cung cấp hướng dẫn về việc chuẩn hóa role trong hệ thống School Medical Management System để đảm bảo tính nhất quán giữa backend và frontend.

## Cấu trúc Role trong Database

Trong database, role được định nghĩa như sau:

| role_id | role_name   | description                          |
|---------|-------------|--------------------------------------|
| 1       | Admin       | System administrator with full access |
| 2       | SchoolNurse | Medical staff with access to health records |
| 3       | Manager     | School management personnel |
| 4       | Parent      | Parent or guardian of students |
| 5       | Student     | Student account |

## Thay đổi và Chuẩn hóa

### Vấn đề

Trước đây, hệ thống sử dụng nhiều format khác nhau cho role:
- Trong frontend: `ROLE_ADMIN`, `ROLE_SCHOOLNURSE`, `ROLE_PARENT`, `ROLE_STUDENT`, v.v.
- Trong backend: Sử dụng cả `hasAnyRole('SCHOOLNURSE')` và `hasAuthority('SchoolNurse')`
- Trong UserDetailsImpl.java: Tạo cả hai dạng authorities: `ROLE_SCHOOLNURSE` và `SchoolNurse`

### Giải pháp

1. **Frontend**:
   - Đã cập nhật tất cả các file kiểm tra role để chấp nhận cả hai dạng: 
     - Ví dụ: `roles.includes('Admin') || roles.includes('ROLE_ADMIN')`
   - Đã cập nhật các file: NurseDashboard.js, AppMenu.js, Navigation.js, Login.js, StudentBlog.js, ViewMedicationRequestsPage.js, AuthDebug.js

2. **Backend**:
   - Annotation `@PreAuthorize` đã được cập nhật để chấp nhận cả hai dạng:
     - Ví dụ: `@PreAuthorize("hasAnyRole('SCHOOLNURSE', 'ADMIN') or hasAnyAuthority('ROLE_SCHOOLNURSE', 'ROLE_ADMIN', 'SchoolNurse', 'Admin')")`
   - UserDetailsImpl.java đang thêm cả hai định dạng của authority

### Kế hoạch chuẩn hóa dài hạn

1. **Backend**: 
   - Cập nhật tất cả `@PreAuthorize` annotation để chỉ sử dụng định dạng không có tiền tố ROLE_:
     - Ví dụ: `@PreAuthorize("hasAnyAuthority('SchoolNurse', 'Admin')")`
   - Cập nhật UserDetailsImpl.java để chỉ tạo authority không có tiền tố ROLE_

2. **Frontend**:
   - Cập nhật tất cả kiểm tra role để chỉ sử dụng định dạng không có tiền tố ROLE_:
     - Ví dụ: `roles.includes('Admin')`
   - Cập nhật tất cả redirect logic để sử dụng định dạng role mới

## Script kiểm tra Role

Để kiểm tra cấu trúc role và quyền trong hệ thống, chạy script PowerShell sau:

```powershell
.\scripts\check-role-formats.ps1
```

Script sẽ:
1. Yêu cầu thông tin đăng nhập
2. Kiểm tra thông tin người dùng và định dạng role
3. Kiểm tra quyền truy cập API Health Checkup Events
4. Kiểm tra quyền tạo/xóa sự kiện

## Lưu ý quan trọng

1. **KHÔNG TẠO ROLE MỚI** với tiền tố ROLE_. Sử dụng chính xác các role_name từ bảng role.
2. Khi phát triển tính năng mới, luôn sử dụng tên role không có tiền tố ROLE_.
3. Khi thêm chức năng mới, cần đảm bảo rằng cả frontend và backend đều kiểm tra role một cách nhất quán.
