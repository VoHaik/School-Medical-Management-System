-- Script sửa tên cột trong các bảng liên quan đến health_declaration
USE HealthSchoolDB;
GO

PRINT 'Bắt đầu cập nhật tên cột kết nối trong các bảng liên quan đến health_declaration';

-- Kiểm tra và đổi tên cột trong bảng health_declaration_chronic_illnesses
IF EXISTS (
    SELECT 1 FROM sys.columns 
    WHERE object_id = OBJECT_ID('health_declaration_chronic_illnesses')
    AND name = 'declaration_id'
) AND NOT EXISTS (
    SELECT 1 FROM sys.columns 
    WHERE object_id = OBJECT_ID('health_declaration_chronic_illnesses')
    AND name = 'health_declaration_id'
)
BEGIN
    -- Loại bỏ các ràng buộc khóa ngoại trước khi đổi tên cột
    DECLARE @fk_chronic_illnesses NVARCHAR(255);
    SELECT @fk_chronic_illnesses = name
    FROM sys.foreign_keys
    WHERE parent_object_id = OBJECT_ID('health_declaration_chronic_illnesses')
    AND referenced_object_id = OBJECT_ID('health_declaration');

    IF @fk_chronic_illnesses IS NOT NULL
    BEGIN
        DECLARE @sql_drop_fk_chronic NVARCHAR(500);
        SET @sql_drop_fk_chronic = 'ALTER TABLE health_declaration_chronic_illnesses DROP CONSTRAINT ' + @fk_chronic_illnesses;
        EXEC sp_executesql @sql_drop_fk_chronic;
        PRINT 'Đã xóa ràng buộc khóa ngoại trong bảng health_declaration_chronic_illnesses';
    END

    -- Đổi tên cột
    EXEC sp_rename 'health_declaration_chronic_illnesses.declaration_id', 'health_declaration_id', 'COLUMN';
    PRINT 'Đã đổi tên cột declaration_id thành health_declaration_id trong bảng health_declaration_chronic_illnesses';
    
    -- Tạo lại ràng buộc khóa ngoại
    ALTER TABLE health_declaration_chronic_illnesses
    ADD CONSTRAINT FK_chronic_illnesses_health_declaration
    FOREIGN KEY (health_declaration_id) REFERENCES health_declaration(declaration_id);
    PRINT 'Đã tạo lại ràng buộc khóa ngoại trong bảng health_declaration_chronic_illnesses';
END
ELSE
BEGIN
    PRINT 'Không cần cập nhật cột trong bảng health_declaration_chronic_illnesses';
END

-- Kiểm tra và đổi tên cột trong bảng health_declaration_medications
IF EXISTS (
    SELECT 1 FROM sys.columns 
    WHERE object_id = OBJECT_ID('health_declaration_medications')
    AND name = 'declaration_id'
) AND NOT EXISTS (
    SELECT 1 FROM sys.columns 
    WHERE object_id = OBJECT_ID('health_declaration_medications')
    AND name = 'health_declaration_id'
)
BEGIN
    -- Loại bỏ các ràng buộc khóa ngoại trước khi đổi tên cột
    DECLARE @fk_medications NVARCHAR(255);
    SELECT @fk_medications = name
    FROM sys.foreign_keys
    WHERE parent_object_id = OBJECT_ID('health_declaration_medications')
    AND referenced_object_id = OBJECT_ID('health_declaration');

    IF @fk_medications IS NOT NULL
    BEGIN
        DECLARE @sql_drop_fk_med NVARCHAR(500);
        SET @sql_drop_fk_med = 'ALTER TABLE health_declaration_medications DROP CONSTRAINT ' + @fk_medications;
        EXEC sp_executesql @sql_drop_fk_med;
        PRINT 'Đã xóa ràng buộc khóa ngoại trong bảng health_declaration_medications';
    END

    -- Đổi tên cột
    EXEC sp_rename 'health_declaration_medications.declaration_id', 'health_declaration_id', 'COLUMN';
    PRINT 'Đã đổi tên cột declaration_id thành health_declaration_id trong bảng health_declaration_medications';
    
    -- Tạo lại ràng buộc khóa ngoại
    ALTER TABLE health_declaration_medications
    ADD CONSTRAINT FK_medications_health_declaration
    FOREIGN KEY (health_declaration_id) REFERENCES health_declaration(declaration_id);
    PRINT 'Đã tạo lại ràng buộc khóa ngoại trong bảng health_declaration_medications';
END
ELSE
BEGIN
    PRINT 'Không cần cập nhật cột trong bảng health_declaration_medications';
END

-- Kiểm tra và đổi tên cột trong bảng health_declaration_emergency_contacts
IF EXISTS (
    SELECT 1 FROM sys.columns 
    WHERE object_id = OBJECT_ID('health_declaration_emergency_contacts')
    AND name = 'declaration_id'
) AND NOT EXISTS (
    SELECT 1 FROM sys.columns 
    WHERE object_id = OBJECT_ID('health_declaration_emergency_contacts')
    AND name = 'health_declaration_id'
)
BEGIN
    -- Loại bỏ các ràng buộc khóa ngoại trước khi đổi tên cột
    DECLARE @fk_emergency_contacts NVARCHAR(255);
    SELECT @fk_emergency_contacts = name
    FROM sys.foreign_keys
    WHERE parent_object_id = OBJECT_ID('health_declaration_emergency_contacts')
    AND referenced_object_id = OBJECT_ID('health_declaration');

    IF @fk_emergency_contacts IS NOT NULL
    BEGIN
        DECLARE @sql_drop_fk_contact NVARCHAR(500);
        SET @sql_drop_fk_contact = 'ALTER TABLE health_declaration_emergency_contacts DROP CONSTRAINT ' + @fk_emergency_contacts;
        EXEC sp_executesql @sql_drop_fk_contact;
        PRINT 'Đã xóa ràng buộc khóa ngoại trong bảng health_declaration_emergency_contacts';
    END

    -- Đổi tên cột
    EXEC sp_rename 'health_declaration_emergency_contacts.declaration_id', 'health_declaration_id', 'COLUMN';
    PRINT 'Đã đổi tên cột declaration_id thành health_declaration_id trong bảng health_declaration_emergency_contacts';
    
    -- Tạo lại ràng buộc khóa ngoại
    ALTER TABLE health_declaration_emergency_contacts
    ADD CONSTRAINT FK_emergency_contacts_health_declaration
    FOREIGN KEY (health_declaration_id) REFERENCES health_declaration(declaration_id);
    PRINT 'Đã tạo lại ràng buộc khóa ngoại trong bảng health_declaration_emergency_contacts';
END
ELSE
BEGIN
    PRINT 'Không cần cập nhật cột trong bảng health_declaration_emergency_contacts';
END

PRINT 'Đã hoàn thành cập nhật tên cột kết nối trong các bảng liên quan đến health_declaration';
