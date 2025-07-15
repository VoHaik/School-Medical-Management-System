-- Check the structure of health_checkup_events table
-- This will help identify column [4] and its data type

SELECT 
    COLUMN_NAME,
    ORDINAL_POSITION,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'health_checkup_events' 
  AND TABLE_SCHEMA = 'dbo'
ORDER BY ORDINAL_POSITION;

-- Check for any TEXT, VARCHAR, or NCHAR columns specifically
SELECT 
    COLUMN_NAME,
    ORDINAL_POSITION,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'health_checkup_events' 
  AND TABLE_SCHEMA = 'dbo'
  AND DATA_TYPE IN ('text', 'varchar', 'nchar', 'char')
ORDER BY ORDINAL_POSITION;

-- Check related tables that might be joined
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    ORDINAL_POSITION,
    DATA_TYPE
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME IN ('health_checkup_event_types', 'health_checkup_event_notifications')
  AND TABLE_SCHEMA = 'dbo'
  AND DATA_TYPE IN ('text', 'varchar', 'nchar', 'char')
ORDER BY TABLE_NAME, ORDINAL_POSITION;

-- Emergency fix for health_checkup_events table
-- Convert any remaining problematic columns
ALTER TABLE health_checkup_events ALTER COLUMN event_name NVARCHAR(255);
ALTER TABLE health_checkup_events ALTER COLUMN description NVARCHAR(MAX);
ALTER TABLE health_checkup_events ALTER COLUMN location NVARCHAR(255);
ALTER TABLE health_checkup_events ALTER COLUMN target_grade_levels NVARCHAR(255);

-- If event_type is causing issues (it's an enum, but just in case)
-- ALTER TABLE health_checkup_events ALTER COLUMN event_type NVARCHAR(50);
-- ALTER TABLE health_checkup_events ALTER COLUMN status NVARCHAR(50);

-- Fix health_checkup_event_types table
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'health_checkup_event_types')
BEGIN
    ALTER TABLE health_checkup_event_types ALTER COLUMN checkup_type NVARCHAR(100);
END

-- Display final structure
SELECT 
    COLUMN_NAME,
    ORDINAL_POSITION,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'health_checkup_events' 
  AND TABLE_SCHEMA = 'dbo'
ORDER BY ORDINAL_POSITION;
