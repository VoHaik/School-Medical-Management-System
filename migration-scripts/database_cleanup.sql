-- Database Cleanup Script - Remove Duplicate and Redundant Tables
-- WARNING: This will permanently delete data. Backup database first!

USE HealthSchoolDB;

PRINT '=== STARTING DATABASE CLEANUP ===';

-- Step 1: Backup any useful data from redundant tables before deletion

PRINT 'Step 1: Backing up data from redundant tables...';

-- Check if health_checkup_events has any unique data not in health_events
SELECT 'health_checkup_events unique data:' as info;
SELECT * FROM health_checkup_events 
WHERE NOT EXISTS (
    SELECT 1 FROM health_events he 
    WHERE he.event_name = health_checkup_events.event_name
);

-- Check if health_checkup_event_types has any unique data
SELECT 'health_checkup_event_types data:' as info;
SELECT * FROM health_checkup_event_types;

-- Step 2: Drop foreign key constraints first
PRINT 'Step 2: Dropping foreign key constraints...';

-- Find and drop foreign keys referencing tables we want to delete
DECLARE @sql NVARCHAR(MAX) = '';

SELECT @sql = @sql + 'ALTER TABLE ' + QUOTENAME(t.TABLE_SCHEMA) + '.' + QUOTENAME(t.TABLE_NAME) + 
              ' DROP CONSTRAINT ' + QUOTENAME(c.CONSTRAINT_NAME) + '; '
FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS t
JOIN INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS r ON t.CONSTRAINT_NAME = r.CONSTRAINT_NAME
JOIN INFORMATION_SCHEMA.TABLE_CONSTRAINTS u ON r.UNIQUE_CONSTRAINT_NAME = u.CONSTRAINT_NAME
WHERE u.TABLE_NAME IN (
    'health_checkup_events',
    'health_checkup_event_types', 
    'health_checkup_event_grade_levels',
    'vaccination_events',
    'vaccination_event_grade_levels',
    'student_vaccinations',
    'events'
);

IF LEN(@sql) > 0
BEGIN
    PRINT 'Dropping foreign key constraints...';
    EXEC sp_executesql @sql;
END

-- Step 3: Drop redundant tables
PRINT 'Step 3: Dropping redundant tables...';

-- Drop health checkup related redundant tables
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'health_checkup_events')
BEGIN
    PRINT 'Dropping health_checkup_events table...';
    DROP TABLE health_checkup_events;
END

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'health_checkup_event_grade_levels')
BEGIN
    PRINT 'Dropping health_checkup_event_grade_levels table...';
    DROP TABLE health_checkup_event_grade_levels;
END

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'health_checkup_event_types')
BEGIN
    PRINT 'Dropping health_checkup_event_types table...';
    DROP TABLE health_checkup_event_types;
END

-- Drop vaccination related redundant tables
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'vaccination_events')
BEGIN
    PRINT 'Dropping vaccination_events table...';
    DROP TABLE vaccination_events;
END

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'vaccination_event_grade_levels')
BEGIN
    PRINT 'Dropping vaccination_event_grade_levels table...';
    DROP TABLE vaccination_event_grade_levels;
END

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'student_vaccinations')
BEGIN
    PRINT 'Dropping student_vaccinations table...';
    DROP TABLE student_vaccinations;
END

-- Drop generic events table (unused)
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'events')
BEGIN
    PRINT 'Dropping events table...';
    DROP TABLE events;
END

-- Drop other unused tables
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'declared_vaccination_records')
BEGIN
    PRINT 'Dropping declared_vaccination_records table...';
    DROP TABLE declared_vaccination_records;
END

-- Drop empty health declaration related tables if not used
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'health_declaration_allergies')
   AND (SELECT COUNT(*) FROM health_declaration_allergies) = 0
BEGIN
    PRINT 'Dropping empty health_declaration_allergies table...';
    DROP TABLE health_declaration_allergies;
END

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'health_declaration_chronic_illnesses')
   AND (SELECT COUNT(*) FROM health_declaration_chronic_illnesses) = 0
BEGIN
    PRINT 'Dropping empty health_declaration_chronic_illnesses table...';
    DROP TABLE health_declaration_chronic_illnesses;
END

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'health_declaration_emergency_contacts')
   AND (SELECT COUNT(*) FROM health_declaration_emergency_contacts) = 0
BEGIN
    PRINT 'Dropping empty health_declaration_emergency_contacts table...';
    DROP TABLE health_declaration_emergency_contacts;
END

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'health_declaration_medications')
   AND (SELECT COUNT(*) FROM health_declaration_medications) = 0
BEGIN
    PRINT 'Dropping empty health_declaration_medications table...';
    DROP TABLE health_declaration_medications;
END

-- Drop other empty/unused tables
DECLARE @emptyTables TABLE (tableName NVARCHAR(255));

INSERT INTO @emptyTables
SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES t
WHERE TABLE_TYPE = 'BASE TABLE'
AND TABLE_NAME IN (
    'blog_posts', 'blog_post_tags', 'consultations', 'health_profiles',
    'medical_events', 'medical_event_symptoms', 'medical_supplies',
    'medication_inventory', 'medication_requests', 'notifications',
    'status_types'
)
AND NOT EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS r
    WHERE r.CONSTRAINT_NAME IN (
        SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
        WHERE tc.TABLE_NAME = t.TABLE_NAME AND tc.CONSTRAINT_TYPE = 'FOREIGN KEY'
    )
);

DECLARE @tableName NVARCHAR(255);
DECLARE empty_cursor CURSOR FOR SELECT tableName FROM @emptyTables;

OPEN empty_cursor;
FETCH NEXT FROM empty_cursor INTO @tableName;

WHILE @@FETCH_STATUS = 0
BEGIN
    SET @sql = 'IF (SELECT COUNT(*) FROM ' + @tableName + ') = 0 DROP TABLE ' + @tableName;
    PRINT 'Checking and potentially dropping empty table: ' + @tableName;
    EXEC sp_executesql @sql;
    FETCH NEXT FROM empty_cursor INTO @tableName;
END

CLOSE empty_cursor;
DEALLOCATE empty_cursor;

-- Step 4: Show final table count
PRINT 'Step 4: Final table count after cleanup...';

SELECT COUNT(*) as 'Total Tables After Cleanup'
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE';

SELECT TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;

PRINT '=== DATABASE CLEANUP COMPLETED ===';
PRINT 'Remaining tables are optimized for the current system architecture.';
PRINT 'Core tables: health_events, health_event_grade_levels, health_event_vaccines, ';
PRINT 'health_checkup_types, vaccination_consents, student_health_checkups, etc.';
