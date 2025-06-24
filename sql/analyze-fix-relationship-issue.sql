-- SQL script to analyze and fix the parent-student relationship issue

-- Check the parent_student_relationships table structure
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'ParentStudentRelationships'
ORDER BY ORDINAL_POSITION;

-- Check sample data from parent_student_relationships
SELECT TOP 10 * FROM ParentStudentRelationships;

-- Check parents table structure
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Parents'
ORDER BY ORDINAL_POSITION;

-- Check students table structure
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Students'
ORDER BY ORDINAL_POSITION;

-- Check users table structure
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Users'
ORDER BY ORDINAL_POSITION;

-- Display actual parent-student relationships
SELECT 
    psr.relationship_id,
    p.parent_code, 
    p.full_name AS parent_name,
    s.student_code,
    s.full_name AS student_name,
    psr.relationship_type
FROM 
    ParentStudentRelationships psr
JOIN 
    Parents p ON psr.parent_code = p.parent_code
JOIN 
    Students s ON psr.student_code = s.student_code
ORDER BY 
    p.parent_code, s.student_code;

-- Check parent user relationships
SELECT 
    p.parent_id,
    p.parent_code, 
    p.full_name AS parent_name,
    u.user_id,
    u.username,
    u.user_code
FROM 
    Parents p
LEFT JOIN 
    Users u ON p.parent_code = u.user_code
ORDER BY 
    p.parent_code;

-- Check for specific parent and student
DECLARE @parentCode NVARCHAR(50) = 'PAR001'; -- Replace with the parent_code from the logs
DECLARE @studentCode NVARCHAR(50) = 'STU001'; -- Replace with the student_code from the logs

-- Check if parent exists
SELECT * FROM Parents WHERE parent_code = @parentCode;

-- Check if student exists
SELECT * FROM Students WHERE student_code = @studentCode;

-- Check if relationship exists
SELECT * FROM ParentStudentRelationships 
WHERE parent_code = @parentCode AND student_code = @studentCode;

-- Check user account for parent
SELECT * FROM Users WHERE user_code = @parentCode OR username = @parentCode;

-- Check for username mismatches
SELECT 
    u.username, 
    u.user_code, 
    p.parent_code
FROM 
    Users u
JOIN 
    Parents p ON u.user_code = p.parent_code
WHERE 
    u.username <> p.parent_code;

-- Fix script (run only after verifying the data)
-- This is just an example - modify based on your findings

/*
-- Fix 1: Create missing parent-student relationship
INSERT INTO ParentStudentRelationships (parent_code, student_code, relationship_type)
VALUES ('PAR001', 'STU001', 'Parent');

-- Fix 2: Update username to match parent_code if that's the convention
UPDATE Users
SET username = user_code
WHERE username <> user_code AND user_code IN (SELECT parent_code FROM Parents);

-- Fix 3: Update parent_code to match username if that's the convention
UPDATE Parents
SET parent_code = (SELECT username FROM Users WHERE Users.user_code = Parents.parent_code)
WHERE parent_code IN (
    SELECT p.parent_code FROM Parents p
    JOIN Users u ON p.parent_code = u.user_code
    WHERE p.parent_code <> u.username
);
*/
