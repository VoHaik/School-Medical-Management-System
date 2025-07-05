-- Debug script: Find VARCHAR columns that should be NVARCHAR
-- Run this to identify problematic columns

PRINT 'Checking for VARCHAR/TEXT columns that may cause conversion errors...';

-- Find all VARCHAR/CHAR/TEXT columns
SELECT 
    t.TABLE_NAME,
    c.COLUMN_NAME,
    c.DATA_TYPE,
    c.CHARACTER_MAXIMUM_LENGTH,
    c.IS_NULLABLE,
    CASE 
        WHEN c.DATA_TYPE IN ('varchar', 'char', 'text') THEN 'NEEDS CONVERSION'
        WHEN c.DATA_TYPE IN ('nvarchar', 'nchar', 'ntext') THEN 'ALREADY CONVERTED'
        ELSE 'NOT APPLICABLE'
    END as STATUS
FROM INFORMATION_SCHEMA.TABLES t
INNER JOIN INFORMATION_SCHEMA.COLUMNS c ON t.TABLE_NAME = c.TABLE_NAME
WHERE 
    t.TABLE_TYPE = 'BASE TABLE'
    AND c.DATA_TYPE IN ('varchar', 'char', 'text', 'nvarchar', 'nchar', 'ntext')
    AND t.TABLE_NAME IN (
        'Users', 'Roles', 'Students', 'Parents', 'Nurses',
        'medication_requests', 'health_declaration', 'medical_events',
        'medication_inventory', 'vaccines', 'notifications',
        'ParentStudentRelationships', 'student_health_checkups'
    )
ORDER BY 
    t.TABLE_NAME, 
    CASE WHEN c.DATA_TYPE IN ('varchar', 'char', 'text') THEN 1 ELSE 2 END,
    c.COLUMN_NAME;

-- Count summary
SELECT 
    'VARCHAR/TEXT columns (need conversion)' as Category,
    COUNT(*) as Count
FROM INFORMATION_SCHEMA.COLUMNS c
INNER JOIN INFORMATION_SCHEMA.TABLES t ON c.TABLE_NAME = t.TABLE_NAME
WHERE 
    t.TABLE_TYPE = 'BASE TABLE'
    AND c.DATA_TYPE IN ('varchar', 'char', 'text')

UNION ALL

SELECT 
    'NVARCHAR columns (already converted)' as Category,
    COUNT(*) as Count
FROM INFORMATION_SCHEMA.COLUMNS c
INNER JOIN INFORMATION_SCHEMA.TABLES t ON c.TABLE_NAME = t.TABLE_NAME
WHERE 
    t.TABLE_TYPE = 'BASE TABLE'
    AND c.DATA_TYPE IN ('nvarchar', 'nchar', 'ntext');
