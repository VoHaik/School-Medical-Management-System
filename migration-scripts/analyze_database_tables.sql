-- Analyze database tables for duplicates and redundancy
USE HealthSchoolDB;

-- 1. List all tables in database
SELECT TABLE_NAME, TABLE_TYPE
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_CATALOG = 'HealthSchoolDB'
ORDER BY TABLE_NAME;

PRINT '=== CHECKING FOR DUPLICATE/REDUNDANT TABLES ===';

-- 2. Check for health checkup related tables
SELECT TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_CATALOG = 'HealthSchoolDB' 
AND TABLE_NAME LIKE '%health%'
ORDER BY TABLE_NAME;

-- 3. Check for vaccination related tables  
SELECT TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_CATALOG = 'HealthSchoolDB' 
AND TABLE_NAME LIKE '%vacc%'
ORDER BY TABLE_NAME;

-- 4. Check for event related tables
SELECT TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_CATALOG = 'HealthSchoolDB' 
AND TABLE_NAME LIKE '%event%'
ORDER BY TABLE_NAME;

-- 5. Check for student related tables
SELECT TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_CATALOG = 'HealthSchoolDB' 
AND TABLE_NAME LIKE '%student%'
ORDER BY TABLE_NAME;

-- 6. Check for consent related tables
SELECT TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_CATALOG = 'HealthSchoolDB' 
AND TABLE_NAME LIKE '%consent%'
ORDER BY TABLE_NAME;

-- 7. Detailed analysis of potentially redundant tables

PRINT '=== HEALTH CHECKUP TABLES ANALYSIS ===';

-- Check if we have multiple health checkup tables
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'health_checkups')
    PRINT 'Found: health_checkups table';
    
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'student_health_checkups')
    PRINT 'Found: student_health_checkups table';
    
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'health_checkup_events')
    PRINT 'Found: health_checkup_events table';
    
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'health_events')
    PRINT 'Found: health_events table';

PRINT '=== VACCINATION TABLES ANALYSIS ===';

-- Check vaccination related tables
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'vaccinations')
    PRINT 'Found: vaccinations table';
    
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'student_vaccinations')
    PRINT 'Found: student_vaccinations table';
    
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'vaccination_events')
    PRINT 'Found: vaccination_events table';
    
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'vaccination_consents')
    PRINT 'Found: vaccination_consents table';
    
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'student_vaccination_records')
    PRINT 'Found: student_vaccination_records table';

PRINT '=== JUNCTION TABLES ANALYSIS ===';

-- Check junction tables
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'health_event_checkup_types')
    PRINT 'Found: health_event_checkup_types table';
    
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'health_checkup_event_types')
    PRINT 'Found: health_checkup_event_types table';
    
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'health_event_vaccines')
    PRINT 'Found: health_event_vaccines table';
    
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'health_event_grade_levels')
    PRINT 'Found: health_event_grade_levels table';

-- 8. Show table structures for comparison
PRINT '=== TABLE STRUCTURES COMPARISON ===';

-- Show columns of potentially duplicate tables
SELECT 
    'health_events' as table_name,
    COLUMN_NAME, 
    DATA_TYPE, 
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'health_events'
AND TABLE_CATALOG = 'HealthSchoolDB'

UNION ALL

SELECT 
    'student_health_checkups' as table_name,
    COLUMN_NAME, 
    DATA_TYPE, 
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'student_health_checkups'
AND TABLE_CATALOG = 'HealthSchoolDB'

UNION ALL

SELECT 
    'vaccination_consents' as table_name,
    COLUMN_NAME, 
    DATA_TYPE, 
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'vaccination_consents'
AND TABLE_CATALOG = 'HealthSchoolDB'

ORDER BY table_name, COLUMN_NAME;

-- 9. Count records in each table to see usage
PRINT '=== TABLE RECORD COUNTS ===';

DECLARE @sql NVARCHAR(MAX) = '';
SELECT @sql = @sql + 'SELECT ''' + TABLE_NAME + ''' as TableName, COUNT(*) as RecordCount FROM ' + TABLE_NAME + ' UNION ALL '
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_CATALOG = 'HealthSchoolDB' 
AND TABLE_TYPE = 'BASE TABLE'
AND TABLE_NAME NOT LIKE 'sys%';

-- Remove last UNION ALL
SET @sql = LEFT(@sql, LEN(@sql) - 10);
SET @sql = @sql + ' ORDER BY RecordCount DESC';

EXEC sp_executesql @sql;
