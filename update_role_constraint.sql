-- Script để cập nhật ràng buộc CHECK cho phép vai trò 'Student'

-- 1. Xóa ràng buộc CHECK hiện tại
ALTER TABLE users DROP CONSTRAINT CK__users__role__5CD6CB2B;

-- 2. Thêm ràng buộc CHECK mới chấp nhận cả 'Student'
-- Giả định rằng các giá trị hiện tại là 'Parent', 'SchoolNurse', 'Admin', 'Manager'
-- Thêm 'Student' vào danh sách các giá trị hợp lệ
ALTER TABLE users
ADD CONSTRAINT CK__users__role__new CHECK
(role IN ('Parent', 'SchoolNurse', 'Admin', 'Manager', 'Student'));

-- 3. Kiểm tra xem ràng buộc đã được cập nhật chưa
SELECT name, definition FROM sys.check_constraints WHERE parent_object_id = OBJECT_ID('users');
