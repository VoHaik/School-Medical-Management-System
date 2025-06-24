-- Fix parent-student relationship issues script

-- This script addresses common issues with parent-student relationships that might be 
-- causing the "You don't have permission to submit health declaration for this student" error.

-- 1. Fix parent_code/user_code mismatches
-- This updates the parent_code in Parents table to match the user_code in Users table
-- when they refer to the same parent account.
BEGIN TRANSACTION;

-- Create temporary table to track updates
CREATE TABLE #ParentUserCodeFixes (
    parent_id INT,
    old_parent_code NVARCHAR(50),
    new_parent_code NVARCHAR(50),
    username NVARCHAR(50)
);

-- Find and update parent_code/user_code mismatches
-- Case 1: username and parent_code match, but user_code differs
INSERT INTO #ParentUserCodeFixes (parent_id, old_parent_code, new_parent_code, username)
SELECT 
    p.parent_id,
    p.parent_code,
    u.user_code,
    u.username
FROM 
    parents p
JOIN 
    users u ON u.username = p.parent_code
WHERE 
    p.parent_code != u.user_code;

-- Update parent codes
UPDATE p
SET p.parent_code = f.new_parent_code
FROM parents p
JOIN #ParentUserCodeFixes f ON p.parent_id = f.parent_id;

-- Display changes made
SELECT * FROM #ParentUserCodeFixes;

-- Clean up
DROP TABLE #ParentUserCodeFixes;

-- 2. Fix missing parent-student relationships
-- This identifies parent-student pairs without relationships and creates them if needed
-- Uncomment and edit this section to add missing relationships if needed
/*
INSERT INTO parent_student_relationships (parent_id, student_id, relationship_type)
SELECT 
    p.parent_id,
    s.student_id,
    'Parent' -- Default relationship type
FROM 
    parents p
CROSS JOIN 
    students s
WHERE 
    p.parent_code = 'PARENT_CODE_HERE' AND s.student_code = 'STUDENT_CODE_HERE'
    AND NOT EXISTS (
        SELECT 1 
        FROM parent_student_relationships psr 
        WHERE psr.parent_id = p.parent_id AND psr.student_id = s.student_id
    );
*/

COMMIT TRANSACTION;

-- Verify relationships after fixes
SELECT 
    p.parent_id, 
    p.parent_code, 
    s.student_id, 
    s.student_code,
    p.full_name AS parent_name,
    s.full_name AS student_name,
    psr.relationship_id,
    psr.relationship_type,
    u.user_id,
    u.user_code,
    u.username
FROM 
    parent_student_relationships psr
JOIN 
    parents p ON psr.parent_id = p.parent_id
JOIN 
    students s ON psr.student_id = s.student_id
LEFT JOIN 
    users u ON p.parent_code = u.user_code
ORDER BY 
    p.parent_code, s.student_code;
