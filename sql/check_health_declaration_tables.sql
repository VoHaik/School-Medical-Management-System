-- Script kiểm tra cấu trúc bảng health_declaration và các bảng liên quan
USE HealthSchoolDB;
GO

PRINT 'Kiểm tra cột kết nối trong bảng health_declaration_chronic_illnesses';
IF EXISTS (
    SELECT 1 FROM sys.columns 
    WHERE object_id = OBJECT_ID('health_declaration_chronic_illnesses')
    AND name = 'health_declaration_id'
)
BEGIN
    PRINT 'Cột health_declaration_id đã tồn tại trong bảng health_declaration_chronic_illnesses';
END
ELSE IF EXISTS (
    SELECT 1 FROM sys.columns 
    WHERE object_id = OBJECT_ID('health_declaration_chronic_illnesses')
    AND name = 'declaration_id'
)
BEGIN
    PRINT 'Cột declaration_id tồn tại trong bảng health_declaration_chronic_illnesses (cần đổi tên)';
END
ELSE
BEGIN
    PRINT 'Không tìm thấy cột kết nối trong bảng health_declaration_chronic_illnesses';
END

PRINT 'Kiểm tra cột kết nối trong bảng health_declaration_medications';
IF EXISTS (
    SELECT 1 FROM sys.columns 
    WHERE object_id = OBJECT_ID('health_declaration_medications')
    AND name = 'health_declaration_id'
)
BEGIN
    PRINT 'Cột health_declaration_id đã tồn tại trong bảng health_declaration_medications';
END
ELSE IF EXISTS (
    SELECT 1 FROM sys.columns 
    WHERE object_id = OBJECT_ID('health_declaration_medications')
    AND name = 'declaration_id'
)
BEGIN
    PRINT 'Cột declaration_id tồn tại trong bảng health_declaration_medications (cần đổi tên)';
END
ELSE
BEGIN
    PRINT 'Không tìm thấy cột kết nối trong bảng health_declaration_medications';
END

PRINT 'Kiểm tra cột kết nối trong bảng health_declaration_emergency_contacts';
IF EXISTS (
    SELECT 1 FROM sys.columns 
    WHERE object_id = OBJECT_ID('health_declaration_emergency_contacts')
    AND name = 'health_declaration_id'
)
BEGIN
    PRINT 'Cột health_declaration_id đã tồn tại trong bảng health_declaration_emergency_contacts';
END
ELSE IF EXISTS (
    SELECT 1 FROM sys.columns 
    WHERE object_id = OBJECT_ID('health_declaration_emergency_contacts')
    AND name = 'declaration_id'
)
BEGIN
    PRINT 'Cột declaration_id tồn tại trong bảng health_declaration_emergency_contacts (cần đổi tên)';
END
ELSE
BEGIN
    PRINT 'Không tìm thấy cột kết nối trong bảng health_declaration_emergency_contacts';
END
