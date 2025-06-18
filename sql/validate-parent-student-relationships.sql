-- SQL Script to validate parent-student relationships

-- First, check all parent-student relationships
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

-- Check for parents without any students
SELECT 
    p.parent_id, 
    p.parent_code, 
    p.full_name,
    u.username,
    u.user_code
FROM 
    parents p
LEFT JOIN 
    parent_student_relationships psr ON p.parent_id = psr.parent_id
LEFT JOIN 
    users u ON p.parent_code = u.user_code
WHERE 
    psr.relationship_id IS NULL;

-- Check for students without any parents
SELECT 
    s.student_id, 
    s.student_code, 
    s.full_name
FROM 
    students s
LEFT JOIN 
    parent_student_relationships psr ON s.student_id = psr.student_id
WHERE 
    psr.relationship_id IS NULL;

-- Check for mismatch between parent_code and user_code
SELECT 
    p.parent_id, 
    p.parent_code, 
    p.full_name AS parent_name,
    u.username,
    u.user_code
FROM 
    parents p
LEFT JOIN 
    users u ON p.parent_code = u.user_code
WHERE 
    u.user_code IS NULL OR p.parent_code != u.user_code;

-- Check for inconsistencies in user codes between tables
SELECT 
    p.parent_id, 
    p.parent_code AS parent_code,
    u.user_code AS user_code,
    u.username,
    CASE 
        WHEN p.parent_code = u.user_code THEN 'Match'
        ELSE 'MISMATCH'
    END AS status
FROM 
    parents p
JOIN 
    users u ON u.username = p.parent_code
ORDER BY 
    status, p.parent_code;
