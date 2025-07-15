-- Emergency fix for health_checkup_events and related tables
-- This addresses the "text to NCHAR conversion" error specifically

USE [HealthSchoolDB];
GO

PRINT 'Starting emergency fix for HealthCheckupEvent tables...';

-- 1. Fix main health_checkup_events table
PRINT 'Fixing health_checkup_events table...';

-- Check current structure first
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

-- Fix the columns one by one
BEGIN TRY
    -- Column 1: event_name
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'health_checkup_events' 
               AND COLUMN_NAME = 'event_name' 
               AND DATA_TYPE IN ('varchar', 'char', 'nchar'))
    BEGIN
        ALTER TABLE health_checkup_events ALTER COLUMN event_name NVARCHAR(255);
        PRINT 'Fixed event_name column';
    END

    -- Column 2: event_type (enum)
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'health_checkup_events' 
               AND COLUMN_NAME = 'event_type' 
               AND DATA_TYPE IN ('varchar', 'char', 'nchar'))
    BEGIN
        ALTER TABLE health_checkup_events ALTER COLUMN event_type NVARCHAR(50);
        PRINT 'Fixed event_type column';
    END

    -- Column 3: description (this is likely the problematic column [4] in 0-based indexing)
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'health_checkup_events' 
               AND COLUMN_NAME = 'description' 
               AND DATA_TYPE IN ('text', 'varchar', 'char', 'nchar'))
    BEGIN
        ALTER TABLE health_checkup_events ALTER COLUMN description NVARCHAR(MAX);
        PRINT 'Fixed description column (likely the problematic column [4])';
    END

    -- Column 4: location
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'health_checkup_events' 
               AND COLUMN_NAME = 'location' 
               AND DATA_TYPE IN ('varchar', 'char', 'nchar'))
    BEGIN
        ALTER TABLE health_checkup_events ALTER COLUMN location NVARCHAR(255);
        PRINT 'Fixed location column';
    END

    -- Column 5: status (enum)
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'health_checkup_events' 
               AND COLUMN_NAME = 'status' 
               AND DATA_TYPE IN ('varchar', 'char', 'nchar'))
    BEGIN
        ALTER TABLE health_checkup_events ALTER COLUMN status NVARCHAR(50);
        PRINT 'Fixed status column';
    END

    -- Column 6: target_grade_levels
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'health_checkup_events' 
               AND COLUMN_NAME = 'target_grade_levels' 
               AND DATA_TYPE IN ('varchar', 'char', 'nchar'))
    BEGIN
        ALTER TABLE health_checkup_events ALTER COLUMN target_grade_levels NVARCHAR(255);
        PRINT 'Fixed target_grade_levels column';
    END

END TRY
BEGIN CATCH
    PRINT 'Error fixing health_checkup_events table: ' + ERROR_MESSAGE();
END CATCH

-- 2. Fix health_checkup_event_types table (for @ElementCollection)
PRINT 'Fixing health_checkup_event_types table...';

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES 
           WHERE TABLE_NAME = 'health_checkup_event_types' 
           AND TABLE_SCHEMA = 'dbo')
BEGIN
    BEGIN TRY
        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
                   WHERE TABLE_NAME = 'health_checkup_event_types' 
                   AND COLUMN_NAME = 'checkup_type' 
                   AND DATA_TYPE IN ('varchar', 'char', 'nchar'))
        BEGIN
            ALTER TABLE health_checkup_event_types ALTER COLUMN checkup_type NVARCHAR(100);
            PRINT 'Fixed checkup_type column in health_checkup_event_types';
        END
    END TRY
    BEGIN CATCH
        PRINT 'Error fixing health_checkup_event_types table: ' + ERROR_MESSAGE();
    END CATCH
END
ELSE
BEGIN
    PRINT 'health_checkup_event_types table does not exist yet';
END

-- 3. Fix health_checkup_event_notifications table if it exists
PRINT 'Checking health_checkup_event_notifications table...';

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES 
           WHERE TABLE_NAME = 'health_checkup_event_notifications' 
           AND TABLE_SCHEMA = 'dbo')
BEGIN
    BEGIN TRY
        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
                   WHERE TABLE_NAME = 'health_checkup_event_notifications' 
                   AND COLUMN_NAME = 'class_id' 
                   AND DATA_TYPE IN ('varchar', 'char', 'nchar'))
        BEGIN
            ALTER TABLE health_checkup_event_notifications ALTER COLUMN class_id NVARCHAR(50);
            PRINT 'Fixed class_id column in health_checkup_event_notifications';
        END
    END TRY
    BEGIN CATCH
        PRINT 'Error fixing health_checkup_event_notifications table: ' + ERROR_MESSAGE();
    END CATCH
END

-- 4. Show final structure
PRINT 'Final structure of health_checkup_events table:';
SELECT 
    COLUMN_NAME,
    ORDINAL_POSITION,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH,
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'health_checkup_events' 
  AND TABLE_SCHEMA = 'dbo'
ORDER BY ORDINAL_POSITION;

-- 5. Check for any remaining problematic columns
PRINT 'Checking for any remaining VARCHAR/TEXT/NCHAR columns:';
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    ORDINAL_POSITION,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME IN ('health_checkup_events', 'health_checkup_event_types', 'health_checkup_event_notifications')
  AND TABLE_SCHEMA = 'dbo'
  AND DATA_TYPE IN ('text', 'varchar', 'nchar', 'char')
ORDER BY TABLE_NAME, ORDINAL_POSITION;

PRINT 'Emergency fix completed!';
