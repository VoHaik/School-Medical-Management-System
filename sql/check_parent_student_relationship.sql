-- Check parent-student relationship and consent visibility issue

-- 1. Check current parent user and their students
SELECT 'Parent Users' as info;
SELECT user_id, username, email, full_name, role 
FROM users 
WHERE role = 'PARENT';

-- 2. Check if there's a parent-student relationship table
-- (This might be in a different table name)
IF OBJECT_ID('parent_student_relationships', 'U') IS NOT NULL
BEGIN
    SELECT 'Parent-Student Relationships' as info;
    SELECT * FROM parent_student_relationships;
END
ELSE
BEGIN
    SELECT 'No parent_student_relationships table found' as info;
END

-- 3. Check if students table has parent_id field
SELECT 'Students with Parent Info' as info;
SELECT s.student_code, s.full_name, s.parent_id, 
       u.username as parent_username, u.email as parent_email
FROM students s
LEFT JOIN users u ON s.parent_id = u.user_id
WHERE s.student_code = 'STU001';

-- 4. Check vaccination consents for STU001
SELECT 'Vaccination Consents for STU001' as info;
SELECT vc.*, he.event_name
FROM vaccination_consents vc
INNER JOIN health_events he ON vc.event_id = he.event_id
WHERE vc.student_code = 'STU001';

-- 5. Check what the parent API should return
SELECT 'What Parent API Should Return' as info;
SELECT vc.consent_id, vc.event_id, vc.student_code, vc.consent_status,
       he.event_name, he.description, he.target_date,
       s.full_name as student_name
FROM vaccination_consents vc
INNER JOIN health_events he ON vc.event_id = he.event_id  
INNER JOIN students s ON vc.student_code = s.student_code
WHERE vc.student_code = 'STU001' 
  AND vc.consent_status = 'PENDING';
