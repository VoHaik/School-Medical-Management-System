-- Debug vaccination consent flow
-- 1. Check vaccination events and their target grades
SELECT 'Vaccination Events and Target Grades' as info;
SELECT he.event_id, he.event_name, he.event_type, 
       hegl.grade_id as target_grade_id,
       gl.grade_name
FROM health_events he
LEFT JOIN health_event_grade_levels hegl ON he.event_id = hegl.event_id
LEFT JOIN grade_levels gl ON hegl.grade_id = gl.grade_id
WHERE he.event_type = 'VACCINATION'
ORDER BY he.event_id, hegl.grade_id;

-- 2. Check students in the database
SELECT 'Students Count by Grade' as info;
SELECT gl.grade_id, gl.grade_name, COUNT(s.student_code) as student_count
FROM grade_levels gl
LEFT JOIN students s ON gl.grade_id = s.grade_level_id
GROUP BY gl.grade_id, gl.grade_name
ORDER BY gl.grade_id;

-- 3. Check specific students in target grades
SELECT 'Students in Target Grades' as info;
SELECT s.student_code, s.full_name, gl.grade_id, gl.grade_name
FROM students s
INNER JOIN grade_levels gl ON s.grade_level_id = gl.grade_id
WHERE gl.grade_id IN (1, 4, 5, 6)  -- Target grades from events
ORDER BY gl.grade_id, s.student_code;

-- 4. Check if vaccination_consents table exists and has any data
SELECT 'Vaccination Consents Table' as info;
SELECT COUNT(*) as total_consents FROM vaccination_consents;

-- 5. Check any existing consents for our events
SELECT 'Existing Consents by Event' as info;
SELECT event_id, COUNT(*) as consent_count, consent_status
FROM vaccination_consents
WHERE event_id IN (1, 2)
GROUP BY event_id, consent_status;

-- 6. Check the relationship between students and parents (if exists)
SELECT 'Student-Parent Relationships' as info;
SELECT TOP 5 s.student_code, s.full_name, 
       CASE WHEN EXISTS(SELECT 1 FROM users u WHERE u.role = 'PARENT') 
            THEN 'Parents exist in system' 
            ELSE 'No parents found' END as parent_status
FROM students s;
