-- SQL Script to check and fix parent-student relationships

-- Step 1: Check the structure of the parent_student_relationships table
PRINT 'Checking parent_student_relationships table structure:'
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    CHARACTER_MAXIMUM_LENGTH 
FROM 
    INFORMATION_SCHEMA.COLUMNS 
WHERE 
    TABLE_NAME = 'ParentStudentRelationships';

-- Step 2: Check current relationships in the database
PRINT 'Current parent-student relationships:'
SELECT 
    psr.relationship_id,
    psr.parent_code,
    psr.student_code, 
    psr.relationship_type,
    p.full_name AS parent_name,
    s.full_name AS student_name,
    u.username,
    u.user_code
FROM 
    ParentStudentRelationships psr
JOIN 
    Parents p ON psr.parent_code = p.parent_code
JOIN 
    Students s ON psr.student_code = s.student_code
LEFT JOIN
    Users u ON p.parent_code = u.user_code;

-- Step 3: Check for inconsistencies between username and user_code
PRINT 'Checking for username/user_code inconsistencies:'
SELECT 
    u.user_id,
    u.username,
    u.user_code,
    p.parent_id,
    p.parent_code,
    p.full_name,
    CASE 
        WHEN u.username <> u.user_code THEN 'MISMATCH: username ≠ user_code'
        WHEN p.parent_code <> u.user_code THEN 'MISMATCH: parent_code ≠ user_code'
        ELSE 'OK'
    END AS status
FROM 
    Users u
JOIN 
    Parents p ON u.user_code = p.parent_code
WHERE 
    u.username <> u.user_code OR p.parent_code <> u.user_code;

-- Step 4: Update user_code to match parent_code if needed
-- CAUTION: Only run this after reviewing the previous results
/*
BEGIN TRANSACTION;

PRINT 'Fixing username/user_code inconsistencies...';

-- Option 1: Update user_code to match username
UPDATE u
SET u.user_code = u.username
FROM Users u
JOIN Parents p ON u.user_id = (SELECT user_id FROM Users WHERE user_code = p.parent_code)
WHERE u.username <> u.user_code;

-- Option 2: Update username to match user_code
UPDATE u
SET u.username = u.user_code
FROM Users u
JOIN Parents p ON u.user_id = (SELECT user_id FROM Users WHERE user_code = p.parent_code)
WHERE u.username <> u.user_code;

-- Check the changes
SELECT 
    u.user_id,
    u.username,
    u.user_code,
    p.parent_id,
    p.parent_code
FROM 
    Users u
JOIN 
    Parents p ON u.user_code = p.parent_code;

COMMIT TRANSACTION;
*/

-- Step 5: Check specific parent and student
DECLARE @parentUsername NVARCHAR(50) = 'parent.smith'; -- Change to match the username from logs
DECLARE @studentCode NVARCHAR(50) = 'STU001'; -- Change to match the student code from logs

PRINT 'Checking specific parent and student:';
-- Find parent details
SELECT 
    u.user_id,
    u.username,
    u.user_code,
    p.parent_id,
    p.parent_code,
    p.full_name AS parent_name
FROM 
    Users u
JOIN 
    Parents p ON u.user_code = p.parent_code
WHERE 
    u.username = @parentUsername;

-- Find student details
SELECT 
    s.student_id,
    s.student_code,
    s.full_name AS student_name
FROM 
    Students s
WHERE 
    s.student_code = @studentCode;

-- Check if relationship exists
SELECT 
    psr.relationship_id,
    psr.parent_code,
    psr.student_code,
    psr.relationship_type
FROM 
    ParentStudentRelationships psr
JOIN 
    Parents p ON psr.parent_code = p.parent_code
JOIN 
    Users u ON p.parent_code = u.user_code
WHERE 
    u.username = @parentUsername 
    AND psr.student_code = @studentCode;

-- Step 6: Add missing relationship if needed
-- CAUTION: Only run this after confirming the missing relationship
/*
DECLARE @parentCode NVARCHAR(50) = (
    SELECT p.parent_code 
    FROM Parents p 
    JOIN Users u ON p.parent_code = u.user_code 
    WHERE u.username = @parentUsername
);

IF @parentCode IS NOT NULL AND NOT EXISTS (
    SELECT 1 
    FROM ParentStudentRelationships 
    WHERE parent_code = @parentCode AND student_code = @studentCode
)
BEGIN
    PRINT 'Adding missing parent-student relationship:';
    INSERT INTO ParentStudentRelationships (parent_code, student_code, relationship_type, created_at)
    VALUES (@parentCode, @studentCode, 'Parent', GETDATE());
    
    PRINT 'Relationship added.';
END
ELSE
BEGIN
    PRINT 'No need to add relationship - Either parent not found or relationship already exists.';
END
*/
