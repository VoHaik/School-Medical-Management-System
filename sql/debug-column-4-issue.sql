-- Debug script to identify column [4] in health_checkup_events query
-- This will help pinpoint exactly which column is causing the error

USE [HealthSchoolDB];
GO

PRINT 'Debugging HealthCheckupEvent column [4] issue...';

-- 1. Show all columns in exact order as they would appear in a SELECT * query
PRINT '=== Column positions in health_checkup_events table ===';
SELECT 
    ORDINAL_POSITION - 1 as ZERO_BASED_INDEX,
    ORDINAL_POSITION,
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH,
    IS_NULLABLE,
    CASE 
        WHEN ORDINAL_POSITION = 5 THEN '*** THIS IS COLUMN [4] (0-based) ***'
        ELSE ''
    END as COLUMN_4_INDICATOR
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'health_checkup_events' 
  AND TABLE_SCHEMA = 'dbo'
ORDER BY ORDINAL_POSITION;

-- 2. Show specifically the columns that are not NVARCHAR
PRINT '=== Non-NVARCHAR string columns (these are problematic) ===';
SELECT 
    ORDINAL_POSITION - 1 as ZERO_BASED_INDEX,
    ORDINAL_POSITION,
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH,
    CASE 
        WHEN ORDINAL_POSITION = 5 THEN '*** COLUMN [4] ***'
        ELSE ''
    END as COLUMN_4_INDICATOR
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'health_checkup_events' 
  AND TABLE_SCHEMA = 'dbo'
  AND DATA_TYPE IN ('text', 'varchar', 'char', 'nchar')
ORDER BY ORDINAL_POSITION;

-- 3. Test query to simulate the JPA findAll() behavior
PRINT '=== Testing SELECT query (this might trigger the error) ===';
BEGIN TRY
    -- This simulates what JPA findAll() would do
    SELECT TOP 1
        event_id,           -- [0]
        event_name,         -- [1] 
        event_type,         -- [2]
        description,        -- [3] - TEXT type might be the issue
        scheduled_date,     -- [4] - THIS IS COLUMN [4]!
        location,           -- [5]
        status,             -- [6]
        target_grade_levels,-- [7]
        created_at,         -- [8]
        updated_at,         -- [9]
        created_by_user_id  -- [10]
    FROM health_checkup_events;
    
    PRINT 'Query executed successfully - no immediate conversion error';
    
END TRY
BEGIN CATCH
    PRINT 'Error in SELECT query: ' + ERROR_MESSAGE();
    PRINT 'This confirms the column type mismatch issue';
END CATCH

-- 4. Check if there are any TEXT columns that might be causing implicit conversion
PRINT '=== Checking for TEXT data type specifically ===';
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    ORDINAL_POSITION
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'health_checkup_events' 
  AND TABLE_SCHEMA = 'dbo'
  AND DATA_TYPE = 'text';

-- 5. Emergency fix for suspected column [4] - but first let's see what it is
DECLARE @columnAtPosition4 NVARCHAR(100);
SELECT @columnAtPosition4 = COLUMN_NAME 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'health_checkup_events' 
  AND TABLE_SCHEMA = 'dbo'
  AND ORDINAL_POSITION = 5; -- 5 because it's 1-based, [4] is 0-based

PRINT 'Column at position [4] (0-based) is: ' + ISNULL(@columnAtPosition4, 'NOT FOUND');

-- 6. Show sample data to understand the issue better
PRINT '=== Sample data from health_checkup_events ===';
BEGIN TRY
    SELECT TOP 3
        event_id,
        event_name,
        event_type,
        LEFT(ISNULL(description, 'NULL'), 50) as description_preview,
        scheduled_date,
        location,
        status
    FROM health_checkup_events;
END TRY
BEGIN CATCH
    PRINT 'Error reading sample data: ' + ERROR_MESSAGE();
END CATCH

PRINT 'Debug analysis completed!';
