# Parent Registration System Implementation Guide

## Tổng Quan

Hệ thống đăng ký phụ huynh cho phép phụ huynh tự đăng ký tài khoản và chờ admin phê duyệt. Hệ thống bao gồm:

1. **Trang đăng ký phụ huynh** - Phụ huynh điền thông tin và gửi yêu cầu
2. **Trang quản lý yêu cầu đăng ký** - Admin xem và xử lý các yêu cầu
3. **Backend API** - Xử lý logic nghiệp vụ và lưu trữ dữ liệu

## Các Thành Phần Đã Tạo

### Backend Components

#### 1. Database Table
- **File**: `sql/create_parent_registration_requests_table.sql`
- **Bảng**: `parent_registration_requests`
- **Chức năng**: Lưu trữ các yêu cầu đăng ký của phụ huynh

#### 2. Model/Entity
- **File**: `backend/src/main/java/com/swp391_8/schoolhealth/model/ParentRegistrationRequest.java`
- **Chức năng**: Entity mapping với bảng database

#### 3. DTO
- **File**: `backend/src/main/java/com/swp391_8/schoolhealth/dto/ParentRegistrationRequestDTO.java`
- **Chức năng**: Data Transfer Object cho API requests/responses

#### 4. Repository
- **File**: `backend/src/main/java/com/swp391_8/schoolhealth/repository/ParentRegistrationRequestRepository.java`
- **Chức năng**: Data access layer với các query methods

#### 5. Service
- **File**: `backend/src/main/java/com/swp391_8/schoolhealth/service/ParentRegistrationRequestService.java`
- **Chức năng**: Business logic xử lý đăng ký và phê duyệt

#### 6. Controller
- **File**: `backend/src/main/java/com/swp391_8/schoolhealth/controller/ParentRegistrationController.java`
- **Chức năng**: REST API endpoints

### Frontend Components

#### 1. Parent Registration Page
- **File**: `frontend/src/pages/ParentRegistration.js`
- **Route**: `/parent-registration`
- **Chức năng**: Trang đăng ký cho phụ huynh

#### 2. Admin Management Page
- **File**: `frontend/src/pages/admin/ParentRegistrationManagement.js`
- **Route**: `/admin/parent-registration-management`
- **Chức năng**: Trang quản lý yêu cầu đăng ký cho admin

## API Endpoints

### Public Endpoints

#### POST `/api/parent-registration/submit`
- **Mô tả**: Gửi yêu cầu đăng ký mới
- **Body**: ParentRegistrationRequestDTO (không bao gồm password trong response)
- **Response**: Success/error message với request ID

### Admin Endpoints (Yêu cầu quyền ADMIN)

#### GET `/api/parent-registration/all`
- **Mô tả**: Lấy tất cả yêu cầu đăng ký
- **Response**: Array of ParentRegistrationRequestDTO

#### GET `/api/parent-registration/status/{status}`
- **Mô tả**: Lấy yêu cầu theo trạng thái
- **Parameters**: status (PENDING, APPROVED, DECLINED)
- **Response**: Array of ParentRegistrationRequestDTO

#### GET `/api/parent-registration/pending-count`
- **Mô tả**: Đếm số yêu cầu chờ duyệt
- **Response**: { "pendingCount": number }

#### POST `/api/parent-registration/{requestId}/approve`
- **Mô tả**: Phê duyệt yêu cầu và tạo user account
- **Response**: Success message với updated request

#### POST `/api/parent-registration/{requestId}/decline`
- **Mô tả**: Từ chối yêu cầu
- **Body**: { "reason": "lý do từ chối" }
- **Response**: Success message với updated request

#### GET `/api/parent-registration/{requestId}`
- **Mô tả**: Lấy chi tiết yêu cầu theo ID
- **Response**: ParentRegistrationRequestDTO

## Cách Sử Dụng

### Cho Phụ Huynh

1. Truy cập trang login: `http://localhost:3000/login`
2. Click link "Register as Parent"
3. Điền đầy đủ thông tin trong form:
   - Thông tin tài khoản (parent code, username, password)
   - Thông tin cá nhân (tên, email, số điện thoại)
   - Thông tin học sinh (mã học sinh, tên, mối quan hệ)
4. Click "Đăng Ký"
5. Chờ admin phê duyệt

### Cho Admin

1. Đăng nhập với tài khoản admin
2. Vào menu "Parent Registration" hoặc truy cập: `http://localhost:3000/admin/parent-registration-management`
3. Xem danh sách yêu cầu theo các tab:
   - **Tất Cả**: Tất cả yêu cầu
   - **Chờ Duyệt**: Yêu cầu chưa được xử lý
   - **Đã Duyệt**: Yêu cầu đã được phê duyệt
   - **Đã Từ Chối**: Yêu cầu đã bị từ chối
4. Đối với yêu cầu pending, admin có thể:
   - **Xem**: Xem chi tiết yêu cầu
   - **Duyệt**: Phê duyệt và tạo tài khoản user
   - **Từ Chối**: Từ chối với lý do cụ thể

## Cài Đặt & Triển Khai

### 1. Database Setup
Chạy script SQL để tạo bảng:
```sql
-- Chạy file sql/create_parent_registration_requests_table.sql
```

### 2. Backend Setup
Không cần cài đặt thêm dependencies, tất cả đã được include trong project.

### 3. Frontend Setup
Không cần cài đặt thêm dependencies, tất cả đã được include trong project.

## Tính Năng

### Validation
- **Frontend**: Validation form đầy đủ với error messages
- **Backend**: Validation business logic và database constraints

### Security
- **Authentication**: JWT-based authentication
- **Authorization**: Role-based access (Admin only cho management functions)
- **Data Protection**: Password không được trả về trong API responses

### User Experience
- **Responsive Design**: Tương thích với mobile và desktop
- **Real-time Updates**: Statistics tự động cập nhật
- **Error Handling**: Error messages rõ ràng cho user
- **Success Feedback**: Thông báo success sau khi hoàn thành actions

### Admin Features
- **Dashboard Statistics**: Hiển thị số liệu pending/approved/declined
- **Filtering**: Filter theo status
- **Badge Notifications**: Hiển thị số pending requests
- **Bulk Operations**: Có thể mở rộng để support bulk approve/decline
- **Audit Trail**: Theo dõi ai đã review request và khi nào

## Lưu Ý Quan Trọng

1. **Password Security**: Hiện tại password được lưu plain text cho testing. Trong production cần enable BCrypt encoding.

2. **Email Notifications**: Hiện tại chưa có email notifications. Có thể mở rộng để gửi email cho parent khi request được approve/decline.

3. **Parent Code Validation**: Hệ thống giả định parent code đã tồn tại trong database. Cần đảm bảo parent codes được setup trước.

4. **Student Code Validation**: Hiện tại không validate student code có tồn tại. Có thể thêm validation này.

5. **Duplicate Checking**: Hệ thống check duplicate parent code, username, và email.

## Mở Rộng Tương Lai

1. **Email Integration**: Gửi email notification cho parent
2. **SMS Integration**: Gửi SMS confirmation
3. **Document Upload**: Cho phép upload documents để verify identity
4. **Bulk Operations**: Admin có thể approve/decline multiple requests
5. **Advanced Filtering**: Filter theo date range, parent name, etc.
6. **Export/Import**: Export danh sách requests ra Excel/PDF
7. **Parent Code Generation**: Auto-generate parent codes
8. **Student Validation**: Validate student code với database

## Troubleshooting

### Common Issues

1. **"Parent code already has a registration request"**
   - Parent code đã được sử dụng cho request khác
   - Check database xem request đã tồn tại chưa

2. **"Username already exists"**
   - Username đã được sử dụng (trong requests hoặc users table)
   - Thử username khác

3. **"Email already exists"**
   - Email đã được sử dụng
   - Thử email khác

4. **"Registration request not found"**
   - Request ID không tồn tại hoặc đã bị xóa
   - Check database

5. **"Request is not in pending status"**
   - Request đã được xử lý rồi (approved/declined)
   - Chỉ có thể xử lý requests có status PENDING

### Database Issues

1. **Foreign Key Constraint Error**
   - Ensure Users table exists trước khi tạo parent_registration_requests table
   - Ensure admin user tồn tại khi approve/decline requests

2. **Migration Issues**
   - Backup database trước khi chạy migration scripts
   - Test trên development environment trước

## Testing

### Test Cases để Verify

1. **Parent Registration Flow**
   - Submit valid registration → Success
   - Submit duplicate parent code → Error
   - Submit duplicate username → Error
   - Submit duplicate email → Error
   - Submit invalid email format → Error
   - Submit weak password → Error

2. **Admin Management Flow**
   - View all requests → Success
   - Filter by status → Success
   - View request details → Success
   - Approve pending request → Success + User created
   - Decline pending request → Success + Reason saved
   - Try to approve already processed request → Error

3. **Navigation & UI**
   - Parent registration link on login page → Works
   - Admin navigation menu → Shows Parent Registration
   - Responsive design → Works on mobile/desktop
   - Form validation → Shows appropriate errors

Hệ thống parent registration đã được implement đầy đủ và sẵn sàng để testing và deployment!
