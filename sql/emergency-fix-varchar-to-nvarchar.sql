-- EMERGENCY FIX: Convert most critical VARCHAR columns to NVARCHAR
-- Run this if you need immediate fix for the error

PRINT 'EMERGENCY FIX: Converting critical VARCHAR columns to NVARCHAR...';

-- Disable foreign key checks temporarily
EXEC sp_msforeachtable "ALTER TABLE ? NOCHECK CONSTRAINT all"

-- USERS table - most critical
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Users')
BEGIN
    PRINT 'Converting Users table (critical)...';
    
    -- Convert critical user fields
    IF COL_LENGTH('Users', 'username') IS NOT NULL AND EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'username' AND DATA_TYPE = 'varchar')
        ALTER TABLE Users ALTER COLUMN username NVARCHAR(50) NOT NULL;
    
    IF COL_LENGTH('Users', 'full_name') IS NOT NULL AND EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'full_name' AND DATA_TYPE = 'varchar')
        ALTER TABLE Users ALTER COLUMN full_name NVARCHAR(100) NULL;
    
    IF COL_LENGTH('Users', 'email') IS NOT NULL AND EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'email' AND DATA_TYPE = 'varchar')
        ALTER TABLE Users ALTER COLUMN email NVARCHAR(100) NULL;
END

-- STUDENTS table - very critical
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Students')
BEGIN
    PRINT 'Converting Students table (critical)...';
    
    IF COL_LENGTH('Students', 'student_code') IS NOT NULL AND EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Students' AND COLUMN_NAME = 'student_code' AND DATA_TYPE = 'varchar')
        ALTER TABLE Students ALTER COLUMN student_code NVARCHAR(20) NOT NULL;
    
    IF COL_LENGTH('Students', 'full_name') IS NOT NULL AND EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Students' AND COLUMN_NAME = 'full_name' AND DATA_TYPE = 'varchar')
        ALTER TABLE Students ALTER COLUMN full_name NVARCHAR(100) NOT NULL;
    
    IF COL_LENGTH('Students', 'class_name') IS NOT NULL AND EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Students' AND COLUMN_NAME = 'class_name' AND DATA_TYPE = 'varchar')
        ALTER TABLE Students ALTER COLUMN class_name NVARCHAR(20) NULL;
END

-- PARENTS table
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Parents')
BEGIN
    PRINT 'Converting Parents table...';
    
    IF COL_LENGTH('Parents', 'parent_code') IS NOT NULL AND EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Parents' AND COLUMN_NAME = 'parent_code' AND DATA_TYPE = 'varchar')
        ALTER TABLE Parents ALTER COLUMN parent_code NVARCHAR(50) NOT NULL;
    
    IF COL_LENGTH('Parents', 'full_name') IS NOT NULL AND EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Parents' AND COLUMN_NAME = 'full_name' AND DATA_TYPE = 'varchar')
        ALTER TABLE Parents ALTER COLUMN full_name NVARCHAR(100) NULL;
END

-- MEDICATION_REQUESTS table
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'medication_requests')
BEGIN
    PRINT 'Converting medication_requests table...';
    
    IF COL_LENGTH('medication_requests', 'medication_name') IS NOT NULL AND EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'medication_requests' AND COLUMN_NAME = 'medication_name' AND DATA_TYPE = 'varchar')
        ALTER TABLE medication_requests ALTER COLUMN medication_name NVARCHAR(255) NOT NULL;
    
    IF COL_LENGTH('medication_requests', 'reason') IS NOT NULL AND EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'medication_requests' AND COLUMN_NAME = 'reason' AND DATA_TYPE IN ('varchar', 'text'))
        ALTER TABLE medication_requests ALTER COLUMN reason NVARCHAR(MAX) NOT NULL;
END

-- HEALTH_DECLARATION table
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'health_declaration')
BEGIN
    PRINT 'Converting health_declaration table...';
    
    IF COL_LENGTH('health_declaration', 'physician_name') IS NOT NULL AND EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'health_declaration' AND COLUMN_NAME = 'physician_name' AND DATA_TYPE = 'varchar')
        ALTER TABLE health_declaration ALTER COLUMN physician_name NVARCHAR(100) NULL;
    
    IF COL_LENGTH('health_declaration', 'notes') IS NOT NULL AND EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'health_declaration' AND COLUMN_NAME = 'notes' AND DATA_TYPE IN ('varchar', 'text'))
        ALTER TABLE health_declaration ALTER COLUMN notes NVARCHAR(MAX) NULL;
END

-- Re-enable foreign key checks
EXEC sp_msforeachtable "ALTER TABLE ? WITH CHECK CHECK CONSTRAINT all"

PRINT 'EMERGENCY FIX completed! Critical columns converted to NVARCHAR.';
PRINT 'Test the application now. If still errors, run the full conversion script.';

-- Verify what was converted
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME IN ('Users', 'Students', 'Parents', 'medication_requests', 'health_declaration')
    AND DATA_TYPE LIKE 'nvarchar%'
ORDER BY TABLE_NAME, COLUMN_NAME;
