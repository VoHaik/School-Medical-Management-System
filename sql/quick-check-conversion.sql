-- Script kiểm tra nhanh VARCHAR vs NVARCHAR
-- Chạy script này để xem tình trạng conversion

-- Kiểm tra cột VARCHAR/CHAR/TEXT còn lại (cần convert)
SELECT 'CỘT CHƯA CONVERT' as Status, TABLE_NAME, COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE DATA_TYPE IN ('varchar', 'char', 'text', 'nchar')
  AND TABLE_NAME NOT LIKE 'sys%'
ORDER BY TABLE_NAME, COLUMN_NAME;

-- Đếm số lượng
SELECT 
    'VARCHAR/CHAR/TEXT (Chưa convert)' as Type,
    COUNT(*) as Count
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE DATA_TYPE IN ('varchar', 'char', 'text', 'nchar')
  AND TABLE_NAME NOT LIKE 'sys%'

UNION ALL

SELECT 
    'NVARCHAR (Đã convert)' as Type,
    COUNT(*) as Count
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE DATA_TYPE IN ('nvarchar', 'ntext')
  AND TABLE_NAME NOT LIKE 'sys%';
