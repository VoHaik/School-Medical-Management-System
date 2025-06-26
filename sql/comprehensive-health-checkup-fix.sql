-- Comprehensive fix for TEXT to NCHAR conversion error
-- Focus on health_checkup_events and related tables

USE [HealthSchoolDB];
GO

PRINT 'Starting comprehensive fix for TEXT/VARCHAR to NVARCHAR conversion...';

-- Step 1: Identify all problematic columns across all tables
PRINT '=== Finding all problematic columns ===';
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    ORDINAL_POSITION,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'dbo'
  AND DATA_TYPE IN ('text', 'varchar', 'char', 'nchar')
  AND TABLE_NAME LIKE '%health%checkup%'
ORDER BY TABLE_NAME, ORDINAL_POSITION;

-- Step 2: Fix health_checkup_events table specifically
PRINT '=== Fixing health_checkup_events table ===';

-- Handle TEXT columns first (these are the most problematic)
DECLARE @sql NVARCHAR(4000);

-- Fix description column if it's TEXT
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
           WHERE TABLE_NAME = 'health_checkup_events' 
           AND COLUMN_NAME = 'description' 
           AND DATA_TYPE = 'text')
BEGIN
    PRINT 'Converting description from TEXT to NVARCHAR(MAX)...';
    
    -- First, update any NULL values to empty string to avoid conversion issues
    UPDATE health_checkup_events SET description = '' WHERE description IS NULL;
    
    -- Then convert the column type
    ALTER TABLE health_checkup_events ALTER COLUMN description NVARCHAR(MAX);
    PRINT 'Successfully converted description column';
END

-- Fix all other VARCHAR/CHAR columns
DECLARE column_cursor CURSOR FOR
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'health_checkup_events' 
  AND TABLE_SCHEMA = 'dbo'
  AND DATA_TYPE IN ('varchar', 'char', 'nchar')
  AND COLUMN_NAME NOT IN ('event_id', 'scheduled_date', 'created_at', 'updated_at', 'created_by_user_id'); -- Skip non-string columns

DECLARE @columnName NVARCHAR(100), @dataType NVARCHAR(50), @maxLength INT;

OPEN column_cursor;
FETCH NEXT FROM column_cursor INTO @columnName, @dataType, @maxLength;

WHILE @@FETCH_STATUS = 0
BEGIN
    -- Determine appropriate NVARCHAR length
    DECLARE @newLength NVARCHAR(20);
    IF @maxLength = -1 OR @maxLength > 4000
        SET @newLength = 'MAX';
    ELSE IF @maxLength IS NULL
        SET @newLength = '255'; -- Default length
    ELSE
        SET @newLength = CAST(@maxLength AS NVARCHAR(20));
    
    SET @sql = 'ALTER TABLE health_checkup_events ALTER COLUMN [' + @columnName + '] NVARCHAR(' + @newLength + ')';
    
    BEGIN TRY
        EXEC sp_executesql @sql;
        PRINT 'Converted column: ' + @columnName + ' to NVARCHAR(' + @newLength + ')';
    END TRY
    BEGIN CATCH
        PRINT 'Error converting column ' + @columnName + ': ' + ERROR_MESSAGE();
    END CATCH
    
    FETCH NEXT FROM column_cursor INTO @columnName, @dataType, @maxLength;
END

CLOSE column_cursor;
DEALLOCATE column_cursor;

-- Step 3: Fix health_checkup_event_types table
PRINT '=== Fixing health_checkup_event_types table ===';
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'health_checkup_event_types')
BEGIN
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'health_checkup_event_types' 
               AND COLUMN_NAME = 'checkup_type' 
               AND DATA_TYPE IN ('varchar', 'char', 'nchar', 'text'))
    BEGIN
        ALTER TABLE health_checkup_event_types ALTER COLUMN checkup_type NVARCHAR(100);
        PRINT 'Fixed checkup_type column in health_checkup_event_types';
    END
END

-- Step 4: Fix health_checkup_event_notifications table
PRINT '=== Fixing health_checkup_event_notifications table ===';
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'health_checkup_event_notifications')
BEGIN
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'health_checkup_event_notifications' 
               AND COLUMN_NAME = 'class_id' 
               AND DATA_TYPE IN ('varchar', 'char', 'nchar', 'text'))
    BEGIN
        ALTER TABLE health_checkup_event_notifications ALTER COLUMN class_id NVARCHAR(50);
        PRINT 'Fixed class_id column in health_checkup_event_notifications';
    END
END

-- Step 5: Final verification
PRINT '=== Final verification ===';
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    ORDINAL_POSITION,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'dbo'
  AND TABLE_NAME IN ('health_checkup_events', 'health_checkup_event_types', 'health_checkup_event_notifications')
ORDER BY TABLE_NAME, ORDINAL_POSITION;

-- Step 6: Test the query that was failing
PRINT '=== Testing the problematic query ===';
BEGIN TRY
    SELECT TOP 1 * FROM health_checkup_events;
    PRINT 'SUCCESS: health_checkup_events query now works!';
END TRY
BEGIN CATCH
    PRINT 'STILL FAILING: ' + ERROR_MESSAGE();
    PRINT 'Additional investigation needed.';
END CATCH

PRINT 'Comprehensive fix completed!';
