-- Script cập nhật cấu trúc bảng health_declaration
-- Author: Copilot
-- Date: 2025-06-18
-- Description: Cập nhật cấu trúc bảng health_declaration, loại bỏ các trường dư thừa và thêm các trường mới

-- Bước 1: Sao lưu dữ liệu trước khi thực hiện thay đổi
-- Tạo bảng tạm để sao lưu
USE HealthSchoolDB;
GO

PRINT 'Bắt đầu quá trình cập nhật cấu trúc bảng health_declaration';
PRINT '------------------------------------------------------';

-- Sao lưu bảng health_declaration
SELECT *
INTO health_declaration_backup_20250618
FROM health_declaration;

PRINT 'Đã sao lưu bảng health_declaration vào bảng health_declaration_backup_20250618';

-- Bước 2: Thêm các trường mới vào bảng health_declaration
PRINT 'Thêm các trường mới vào bảng health_declaration...';

-- Kiểm tra và thêm trường vision_status nếu chưa tồn tại
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('health_declaration') AND name = 'vision_status')
BEGIN
    ALTER TABLE health_declaration
    ADD vision_status NVARCHAR(255) NULL;
    PRINT 'Đã thêm trường vision_status';
END
ELSE
BEGIN
    PRINT 'Trường vision_status đã tồn tại';
END

-- Kiểm tra và thêm trường hearing_status nếu chưa tồn tại
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('health_declaration') AND name = 'hearing_status')
BEGIN
    ALTER TABLE health_declaration
    ADD hearing_status NVARCHAR(255) NULL;
    PRINT 'Đã thêm trường hearing_status';
END
ELSE
BEGIN
    PRINT 'Trường hearing_status đã tồn tại';
END

-- Kiểm tra và thêm trường special_needs nếu chưa tồn tại
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('health_declaration') AND name = 'special_needs')
BEGIN
    ALTER TABLE health_declaration
    ADD special_needs NVARCHAR(MAX) NULL;
    PRINT 'Đã thêm trường special_needs';
END
ELSE
BEGIN
    PRINT 'Trường special_needs đã tồn tại';
END

-- Kiểm tra và thêm trường physical_limitations nếu chưa tồn tại
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('health_declaration') AND name = 'physical_limitations')
BEGIN
    ALTER TABLE health_declaration
    ADD physical_limitations NVARCHAR(MAX) NULL;
    PRINT 'Đã thêm trường physical_limitations';
END
ELSE
BEGIN
    PRINT 'Trường physical_limitations đã tồn tại';
END

-- Kiểm tra và thêm trường mental_health_concerns nếu chưa tồn tại
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('health_declaration') AND name = 'mental_health_concerns')
BEGIN
    ALTER TABLE health_declaration
    ADD mental_health_concerns NVARCHAR(MAX) NULL;
    PRINT 'Đã thêm trường mental_health_concerns';
END
ELSE
BEGIN
    PRINT 'Trường mental_health_concerns đã tồn tại';
END

-- Kiểm tra và thêm trường dietary_restrictions nếu chưa tồn tại
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('health_declaration') AND name = 'dietary_restrictions')
BEGIN
    ALTER TABLE health_declaration
    ADD dietary_restrictions NVARCHAR(MAX) NULL;
    PRINT 'Đã thêm trường dietary_restrictions';
END
ELSE
BEGIN
    PRINT 'Trường dietary_restrictions đã tồn tại';
END

-- Kiểm tra và thêm trường medical_history nếu chưa tồn tại
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('health_declaration') AND name = 'medical_history')
BEGIN
    ALTER TABLE health_declaration
    ADD medical_history NVARCHAR(MAX) NULL;
    PRINT 'Đã thêm trường medical_history';
END
ELSE
BEGIN
    PRINT 'Trường medical_history đã tồn tại';
END

-- Bước 3: Di chuyển dữ liệu từ các trường emergency_contact_name và emergency_contact_phone sang bảng health_declaration_emergency_contacts
PRINT 'Kiểm tra và di chuyển dữ liệu từ emergency_contact_name và emergency_contact_phone nếu cần...';

-- Kiểm tra xem có dữ liệu trong các trường cũ không
IF EXISTS (
    SELECT 1 
    FROM health_declaration 
    WHERE emergency_contact_name IS NOT NULL OR emergency_contact_phone IS NOT NULL
)
BEGIN
    PRINT 'Di chuyển dữ liệu từ emergency_contact_name và emergency_contact_phone sang bảng health_declaration_emergency_contacts';
    
    -- Kiểm tra xem các dòng đã có trong bảng health_declaration_emergency_contacts chưa, nếu chưa thì thêm vào
    INSERT INTO health_declaration_emergency_contacts (
        health_declaration_id, 
        contact_name, 
        phone_number,
        is_primary
    )
    SELECT 
        declaration_id, 
        emergency_contact_name, 
        emergency_contact_phone,
        1 -- Đánh dấu là liên hệ chính
    FROM health_declaration
    WHERE 
        declaration_id NOT IN (
            SELECT health_declaration_id 
            FROM health_declaration_emergency_contacts
        )
        AND (emergency_contact_name IS NOT NULL OR emergency_contact_phone IS NOT NULL);
        
    PRINT 'Đã di chuyển dữ liệu sang bảng health_declaration_emergency_contacts';
END
ELSE
BEGIN
    PRINT 'Không có dữ liệu cần di chuyển từ emergency_contact_name và emergency_contact_phone';
END

-- Bước 4: Di chuyển dữ liệu từ bảng health_declaration_conditions sang health_declaration_chronic_illnesses
PRINT 'Kiểm tra và di chuyển dữ liệu từ health_declaration_conditions sang health_declaration_chronic_illnesses nếu cần...';

-- Kiểm tra nếu bảng health_declaration_conditions tồn tại
IF OBJECT_ID('health_declaration_conditions', 'U') IS NOT NULL
BEGIN
    -- Kiểm tra xem có dữ liệu trong bảng health_declaration_conditions không
    DECLARE @conditionCount INT;
    SELECT @conditionCount = COUNT(*) FROM health_declaration_conditions;
    
    IF @conditionCount > 0
    BEGIN
        PRINT 'Di chuyển dữ liệu từ health_declaration_conditions sang health_declaration_chronic_illnesses';
        
        -- Di chuyển dữ liệu từ conditions sang chronic_illnesses nếu chưa tồn tại
        INSERT INTO health_declaration_chronic_illnesses (
            health_declaration_id, 
            chronic_illness
        )
        SELECT 
            declaration_id,
            medical_condition
        FROM health_declaration_conditions c
        WHERE NOT EXISTS (
            SELECT 1 
            FROM health_declaration_chronic_illnesses ci 
            WHERE ci.health_declaration_id = c.declaration_id 
            AND ci.chronic_illness = c.medical_condition
        );
        
        PRINT 'Đã di chuyển ' + CAST(@@ROWCOUNT AS VARCHAR) + ' bản ghi từ health_declaration_conditions sang health_declaration_chronic_illnesses';
    END
    ELSE
    BEGIN
        PRINT 'Không có dữ liệu trong bảng health_declaration_conditions';
    END
END
ELSE
BEGIN
    PRINT 'Bảng health_declaration_conditions không tồn tại';
END

-- Bước 5: Đánh dấu các trường sẽ loại bỏ sau khi đã kiểm tra kỹ
PRINT 'Các trường sau đây có thể loại bỏ sau khi kiểm tra kỹ (chưa thực hiện trong script này):';
PRINT '- emergency_contact_name';
PRINT '- emergency_contact_phone';
PRINT '- Bảng health_declaration_conditions (thay bằng health_declaration_chronic_illnesses)';

-- Comment các lệnh xóa trường - CHỈ NÊN THỰC HIỆN SAU KHI ĐÃ KIỂM TRA KỸ LƯỠNG
/*
-- Loại bỏ các trường không còn cần thiết
PRINT 'Loại bỏ các trường không còn cần thiết...';

-- Loại bỏ các trường liên quan đến thông tin liên hệ khẩn cấp (đã di chuyển sang bảng riêng)
ALTER TABLE health_declaration
DROP COLUMN emergency_contact_name, emergency_contact_phone;

-- Loại bỏ bảng health_declaration_conditions (đã được thay thế bởi health_declaration_chronic_illnesses)
-- Lưu ý: chỉ thực hiện sau khi đã xác nhận dữ liệu đã được di chuyển an toàn
IF OBJECT_ID('health_declaration_conditions', 'U') IS NOT NULL
BEGIN
    DROP TABLE health_declaration_conditions;
    PRINT 'Đã loại bỏ bảng health_declaration_conditions';
END
*/

PRINT '------------------------------------------------------';
PRINT 'Quá trình cập nhật cấu trúc bảng health_declaration đã hoàn tất';
PRINT 'Vui lòng kiểm tra dữ liệu kỹ lưỡng trước khi loại bỏ các trường cũ';
PRINT 'Xem xét chạy script riêng biệt để loại bỏ các trường cũ sau khi đã xác nhận dữ liệu an toàn';
