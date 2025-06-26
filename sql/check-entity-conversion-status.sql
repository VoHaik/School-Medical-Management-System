-- Script kiểm tra tất cả entity đã chuyển đổi sang NVARCHAR chưa
-- Kiểm tra database schema hiện tại

PRINT '=================================================================';
PRINT 'KIỂM TRA CHUYỂN ĐỔI ENTITY TỪ VARCHAR/NCHAR SANG NVARCHAR';
PRINT '=================================================================';
PRINT '';

-- 1. Kiểm tra tất cả VARCHAR/CHAR/TEXT columns còn lại
PRINT '1. CÁC CỘT CHƯA CHUYỂN ĐỔI (Vẫn là VARCHAR/CHAR/TEXT):';
PRINT '--------------------------------------------------------';

SELECT 
    TABLE_NAME as 'Tên Bảng',
    COLUMN_NAME as 'Tên Cột', 
    DATA_TYPE as 'Kiểu Hiện Tại',
    CHARACTER_MAXIMUM_LENGTH as 'Độ Dài',
    IS_NULLABLE as 'Nullable',
    CASE 
        WHEN TABLE_NAME IN ('Users', 'Students', 'Parents', 'Nurses', 'Roles') THEN 'CRITICAL - Cần ưu tiên'
        WHEN TABLE_NAME LIKE '%health%' OR TABLE_NAME LIKE '%medical%' OR TABLE_NAME LIKE '%medication%' THEN 'HIGH - Quan trọng'
        ELSE 'MEDIUM - Có thể delay'
    END as 'Mức Độ Ưu Tiên'
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE DATA_TYPE IN ('varchar', 'char', 'text', 'nchar')  -- Bao gồm cả NCHAR
  AND TABLE_NAME NOT LIKE 'sys%'
  AND TABLE_NAME NOT LIKE 'MSrep%'
  AND TABLE_SCHEMA = 'dbo'
ORDER BY 
    CASE 
        WHEN TABLE_NAME IN ('Users', 'Students', 'Parents', 'Nurses', 'Roles') THEN 1
        WHEN TABLE_NAME LIKE '%health%' OR TABLE_NAME LIKE '%medical%' OR TABLE_NAME LIKE '%medication%' THEN 2
        ELSE 3
    END,
    TABLE_NAME, 
    COLUMN_NAME;

PRINT '';
PRINT '2. CÁC CỘT ĐÃ CHUYỂN ĐỔI THÀNH CÔNG (NVARCHAR):';
PRINT '------------------------------------------------';

SELECT 
    TABLE_NAME as 'Tên Bảng',
    COLUMN_NAME as 'Tên Cột',
    DATA_TYPE as 'Kiểu Đã Convert',
    CHARACTER_MAXIMUM_LENGTH as 'Độ Dài'
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE DATA_TYPE IN ('nvarchar', 'ntext')
  AND TABLE_NAME NOT LIKE 'sys%'
  AND TABLE_SCHEMA = 'dbo'
ORDER BY TABLE_NAME, COLUMN_NAME;

PRINT '';
PRINT '3. THỐNG KÊ TỔNG QUAN:';
PRINT '----------------------';

-- Đếm tổng số cột string
SELECT 
    'Tổng cột string' as 'Loại',
    COUNT(*) as 'Số Lượng'
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE DATA_TYPE IN ('varchar', 'char', 'text', 'nchar', 'nvarchar', 'ntext')
  AND TABLE_NAME NOT LIKE 'sys%'
  AND TABLE_SCHEMA = 'dbo'

UNION ALL

-- Đếm cột chưa convert
SELECT 
    'Chưa convert (VARCHAR/CHAR/TEXT/NCHAR)' as 'Loại',
    COUNT(*) as 'Số Lượng'
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE DATA_TYPE IN ('varchar', 'char', 'text', 'nchar')
  AND TABLE_NAME NOT LIKE 'sys%'
  AND TABLE_SCHEMA = 'dbo'

UNION ALL

-- Đếm cột đã convert
SELECT 
    'Đã convert (NVARCHAR/NTEXT)' as 'Loại',
    COUNT(*) as 'Số Lượng'
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE DATA_TYPE IN ('nvarchar', 'ntext')
  AND TABLE_NAME NOT LIKE 'sys%'
  AND TABLE_SCHEMA = 'dbo';

PRINT '';
PRINT '4. KIỂM TRA CÁC BẢNG QUAN TRỌNG:';
PRINT '--------------------------------';

DECLARE @important_tables TABLE (table_name NVARCHAR(128));
INSERT INTO @important_tables VALUES 
('Users'), ('Students'), ('Parents'), ('Nurses'), ('Roles'),
('medication_requests'), ('health_declaration'), ('medical_events'),
('medication_inventory'), ('vaccines'), ('notifications'),
('ParentStudentRelationships'), ('student_health_checkups'),
('health_declaration_allergies'), ('health_declaration_chronic_illnesses'),
('medical_event_symptoms');

SELECT 
    t.table_name as 'Bảng Quan Trọng',
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS c 
            WHERE c.TABLE_NAME = t.table_name 
            AND c.DATA_TYPE IN ('varchar', 'char', 'text', 'nchar')
        ) THEN '❌ CHƯA HOÀN THÀNH'
        ELSE '✅ ĐÃ CONVERT'
    END as 'Trạng Thái',
    (
        SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS c 
        WHERE c.TABLE_NAME = t.table_name 
        AND c.DATA_TYPE IN ('varchar', 'char', 'text', 'nchar')
    ) as 'Cột Chưa Convert',
    (
        SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS c 
        WHERE c.TABLE_NAME = t.table_name 
        AND c.DATA_TYPE IN ('nvarchar', 'ntext')
    ) as 'Cột Đã Convert'
FROM @important_tables t
WHERE EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = t.table_name)
ORDER BY 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS c 
            WHERE c.TABLE_NAME = t.table_name 
            AND c.DATA_TYPE IN ('varchar', 'char', 'text', 'nchar')
        ) THEN 0  -- Chưa hoàn thành lên đầu
        ELSE 1
    END,
    t.table_name;

PRINT '';
PRINT '5. KIỂM TRA COLLECTION TABLES (ElementCollection):';
PRINT '--------------------------------------------------';

SELECT 
    TABLE_NAME as 'Collection Table',
    COLUMN_NAME as 'Column',
    DATA_TYPE as 'Current Type',
    CASE 
        WHEN DATA_TYPE IN ('varchar', 'char', 'text', 'nchar') THEN '❌ Cần convert'
        WHEN DATA_TYPE IN ('nvarchar', 'ntext') THEN '✅ Đã convert'
        ELSE '? Unknown'
    END as 'Status'
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME LIKE '%allergies%' 
   OR TABLE_NAME LIKE '%symptoms%'
   OR TABLE_NAME LIKE '%chronic%'
   OR TABLE_NAME LIKE '%medications%'
   OR TABLE_NAME LIKE '%emergency%'
   OR TABLE_NAME LIKE '%tags%'
ORDER BY TABLE_NAME, COLUMN_NAME;

PRINT '';
PRINT '6. KẾT LUẬN VÀ HÀNH ĐỘNG CẦN THIẾT:';
PRINT '-----------------------------------';

DECLARE @varchar_count INT, @total_string_count INT, @completion_rate DECIMAL(5,2);

SELECT @varchar_count = COUNT(*) 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE DATA_TYPE IN ('varchar', 'char', 'text', 'nchar')
  AND TABLE_NAME NOT LIKE 'sys%'
  AND TABLE_SCHEMA = 'dbo';

SELECT @total_string_count = COUNT(*) 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE DATA_TYPE IN ('varchar', 'char', 'text', 'nchar', 'nvarchar', 'ntext')
  AND TABLE_NAME NOT LIKE 'sys%'
  AND TABLE_SCHEMA = 'dbo';

SET @completion_rate = CASE 
    WHEN @total_string_count > 0 
    THEN ((@total_string_count - @varchar_count) * 100.0) / @total_string_count 
    ELSE 100 
END;

SELECT 
    @varchar_count as 'Cột Chưa Convert',
    @total_string_count as 'Tổng Cột String',
    @completion_rate as 'Tỷ Lệ Hoàn Thành (%)',
    CASE 
        WHEN @varchar_count = 0 THEN '🎉 HOÀN THÀNH 100%'
        WHEN @varchar_count <= 5 THEN '⚠️ GẦN HOÀN THÀNH - Cần convert thêm ít cột'
        WHEN @varchar_count <= 20 THEN '🔄 ĐANG TIẾN TRIỂN - Cần tiếp tục convert'
        ELSE '❌ CẦN HÀNH ĐỘNG NGAY - Chạy script convert-all-to-nvarchar.sql'
    END as 'Đánh Giá';

-- Hiển thị hướng dẫn nếu còn cột chưa convert
IF @varchar_count > 0
BEGIN
    PRINT '';
    PRINT '🔧 HƯỚNG DẪN KHẮC PHỤC:';
    PRINT '1. Chạy script: convert-all-to-nvarchar.sql';
    PRINT '2. Hoặc convert từng cột quan trọng trước:';
    
    DECLARE @sql_suggestions NVARCHAR(MAX) = '';
    SELECT @sql_suggestions = @sql_suggestions + 
        'ALTER TABLE ' + TABLE_NAME + ' ALTER COLUMN ' + COLUMN_NAME + 
        ' NVARCHAR(' + 
        CASE 
            WHEN CHARACTER_MAXIMUM_LENGTH = -1 THEN 'MAX'
            WHEN CHARACTER_MAXIMUM_LENGTH IS NULL THEN '255'
            ELSE CAST(CHARACTER_MAXIMUM_LENGTH as NVARCHAR(10))
        END + ')' +
        CASE WHEN IS_NULLABLE = 'NO' THEN ' NOT NULL' ELSE ' NULL' END + ';' + CHAR(13)
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE DATA_TYPE IN ('varchar', 'char', 'text', 'nchar')
      AND TABLE_NAME IN ('Users', 'Students', 'health_declaration')
      AND TABLE_SCHEMA = 'dbo';
    
    IF LEN(@sql_suggestions) > 0
    BEGIN
        PRINT '';
        PRINT 'SCRIPT KHẨN CẤP CHO CÁC BẢNG QUAN TRỌNG:';
        PRINT @sql_suggestions;
    END
END
ELSE
BEGIN
    PRINT '';
    PRINT '🎉 CHÚC MỪNG! TẤT CẢ ENTITY ĐÃ ĐƯỢC CHUYỂN ĐỔI SANG NVARCHAR!';
    PRINT 'Database đã sẵn sàng hỗ trợ tiếng Việt hoàn toàn.';
END

PRINT '';
PRINT '=================================================================';
PRINT 'KẾT THÚC KIỂM TRA';
PRINT '=================================================================';
