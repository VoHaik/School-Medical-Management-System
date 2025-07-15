-- Script loại bỏ các trường dư thừa trong bảng health_declaration
-- CẢNH BÁO: Chỉ chạy script này sau khi đã chạy script update_health_declaration_schema_2025.sql 
-- và đã kiểm tra kỹ lưỡng rằng dữ liệu đã được di chuyển an toàn
-- Author: Copilot
-- Date: 2025-06-18

USE HealthSchoolDB;
GO

PRINT 'BẮT ĐẦU QUÁ TRÌNH LOẠI BỎ CÁC TRƯỜNG DƯ THỪA';
PRINT '------------------------------------------------------';
PRINT '!!! CẢNH BÁO: SCRIPT NÀY SẼ XÓA DỮ LIỆU VÀ CẤU TRÚC !!!';
PRINT 'Hãy đảm bảo bạn đã sao lưu đầy đủ và kiểm tra kỹ lưỡng.';
PRINT '------------------------------------------------------';

-- Xác nhận thủ công - cần nhập giá trị CONFIRM ở đây để tiếp tục
DECLARE @confirm NVARCHAR(10) = 'NO';  -- Thay đổi thành 'CONFIRM' để chạy script

IF @confirm <> 'CONFIRM'
BEGIN
    PRINT 'Script đã bị hủy. Để tiếp tục, hãy đặt giá trị @confirm = ''CONFIRM''';
    RETURN;
END

-- Bước 1: Kiểm tra lại xem dữ liệu đã được di chuyển đầy đủ chưa
PRINT 'Đang kiểm tra dữ liệu di chuyển...';

-- Kiểm tra emergency_contact
DECLARE @missingEmergencyContacts INT;
SELECT @missingEmergencyContacts = COUNT(*)
FROM health_declaration hd
WHERE (hd.emergency_contact_name IS NOT NULL OR hd.emergency_contact_phone IS NOT NULL)
AND NOT EXISTS (
    SELECT 1 
    FROM health_declaration_emergency_contacts ec 
    WHERE ec.health_declaration_id = hd.declaration_id
);

IF @missingEmergencyContacts > 0
BEGIN
    PRINT 'CẢNH BÁO: ' + CAST(@missingEmergencyContacts AS VARCHAR) + ' bản ghi chưa được di chuyển từ emergency_contact_name/phone sang bảng health_declaration_emergency_contacts';
    PRINT 'Script bị hủy. Vui lòng chạy script update_health_declaration_schema_2025.sql trước.';
    RETURN;
END

-- Kiểm tra medical conditions
IF OBJECT_ID('health_declaration_conditions', 'U') IS NOT NULL
BEGIN
    DECLARE @missingConditions INT;
    SELECT @missingConditions = COUNT(*)
    FROM health_declaration_conditions c
    WHERE NOT EXISTS (
        SELECT 1
        FROM health_declaration_chronic_illnesses ci
        WHERE ci.health_declaration_id = c.declaration_id
        AND ci.chronic_illness = c.medical_condition
    );
    
    IF @missingConditions > 0
    BEGIN
        PRINT 'CẢNH BÁO: ' + CAST(@missingConditions AS VARCHAR) + ' bản ghi chưa được di chuyển từ health_declaration_conditions sang health_declaration_chronic_illnesses';
        PRINT 'Script bị hủy. Vui lòng chạy script update_health_declaration_schema_2025.sql trước.';
        RETURN;
    END
END

-- Bước 2: Loại bỏ các trường emergency_contact_name và emergency_contact_phone
PRINT 'Loại bỏ các trường emergency_contact_name và emergency_contact_phone...';

-- Kiểm tra xem các trường có tồn tại không
IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('health_declaration') AND name = 'emergency_contact_name')
BEGIN
    ALTER TABLE health_declaration DROP COLUMN emergency_contact_name;
    PRINT 'Đã loại bỏ trường emergency_contact_name';
END
ELSE
BEGIN
    PRINT 'Trường emergency_contact_name không tồn tại';
END

IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('health_declaration') AND name = 'emergency_contact_phone')
BEGIN
    ALTER TABLE health_declaration DROP COLUMN emergency_contact_phone;
    PRINT 'Đã loại bỏ trường emergency_contact_phone';
END
ELSE
BEGIN
    PRINT 'Trường emergency_contact_phone không tồn tại';
END

-- Bước 3: Loại bỏ bảng health_declaration_conditions
IF OBJECT_ID('health_declaration_conditions', 'U') IS NOT NULL
BEGIN
    -- Tạo bảng sao lưu trước khi xóa
    SELECT * INTO health_declaration_conditions_backup_20250618
    FROM health_declaration_conditions;
    
    PRINT 'Đã sao lưu bảng health_declaration_conditions vào health_declaration_conditions_backup_20250618';

    -- Kiểm tra ràng buộc khóa ngoại và loại bỏ nếu cần
    DECLARE @constraintName NVARCHAR(128);
    
    SELECT @constraintName = name
    FROM sys.foreign_keys
    WHERE parent_object_id = OBJECT_ID('health_declaration_conditions');
    
    IF @constraintName IS NOT NULL
    BEGIN
        DECLARE @sql NVARCHAR(500) = N'ALTER TABLE health_declaration_conditions DROP CONSTRAINT ' + @constraintName;
        EXEC sp_executesql @sql;
        PRINT 'Đã loại bỏ ràng buộc khóa ngoại ' + @constraintName;
    END

    -- Xóa bảng
    DROP TABLE health_declaration_conditions;
    PRINT 'Đã loại bỏ bảng health_declaration_conditions';
END
ELSE
BEGIN
    PRINT 'Bảng health_declaration_conditions không tồn tại';
END

-- Bước 4: Xem xét có cần loại bỏ các trường liên quan đến COVID-19 không
-- Những trường này có thể vẫn hữu ích cho theo dõi sức khỏe học sinh, 
-- nên chỉ loại bỏ nếu thực sự không cần thiết nữa
/*
PRINT 'Xem xét loại bỏ các trường liên quan đến COVID-19...';

-- Hỏi người dùng có muốn loại bỏ các trường này không
DECLARE @removeCovid NVARCHAR(10) = 'NO';  -- Thay đổi thành 'YES' để loại bỏ

IF @removeCovid = 'YES'
BEGIN
    -- Loại bỏ các trường
    ALTER TABLE health_declaration
    DROP COLUMN close_contact, travel_history, has_symptoms, symptoms;
    
    PRINT 'Đã loại bỏ các trường close_contact, travel_history, has_symptoms, symptoms';
END
ELSE
BEGIN
    PRINT 'Giữ lại các trường liên quan đến COVID-19';
END
*/

PRINT '------------------------------------------------------';
PRINT 'QUÁ TRÌNH LOẠI BỎ CÁC TRƯỜNG DƯ THỪA ĐÃ HOÀN TẤT';
PRINT 'Đã loại bỏ các trường không cần thiết từ bảng health_declaration';
PRINT 'Một số trường liên quan đến COVID-19 vẫn được giữ lại (close_contact, travel_history, has_symptoms, symptoms)';
PRINT 'Để loại bỏ các trường này, bỏ comment phần code tương ứng và đặt @removeCovid = ''YES''';
