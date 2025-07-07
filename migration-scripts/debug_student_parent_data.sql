-- Debug script to check student and parent data
-- Check student information
SELECT 
    s.student_code,
    s.full_name,
    s.grade_level_id,
    gl.grade_name,
    s.class_name
FROM students s
LEFT JOIN grade_levels gl ON s.grade_level_id = gl.grade_id
WHERE s.student_code = 'STU001';

-- Check parent-student relationships
SELECT 
    psr.relationship_id,
    psr.parent_user_id,
    psr.student_code,
    u.username as parent_username,
    u.full_name as parent_name,
    s.full_name as student_name
FROM parent_student_relationships psr
LEFT JOIN users u ON psr.parent_user_id = u.user_id
LEFT JOIN students s ON psr.student_code = s.student_code;

-- Check vaccination consent data with full details
SELECT 
    vc.consent_id,
    vc.student_code,
    s.full_name as student_name,
    he.event_name,
    he.description as event_description,
    he.scheduled_date,
    he.location,
    vc.consent_status,
    vc.sent_date
FROM vaccination_consents vc
LEFT JOIN students s ON vc.student_code = s.student_code
LEFT JOIN health_events he ON vc.event_id = he.event_id
WHERE vc.consent_status = 'PENDING';
