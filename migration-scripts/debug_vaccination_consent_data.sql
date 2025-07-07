-- Debug script to check vaccination consent data
-- Check if vaccination consents exist in database

-- Check all vaccination consents
SELECT 
    vc.consent_id,
    vc.student_code,
    vc.event_id,
    vc.consent_status,
    vc.sent_date,
    vc.consent_date,
    he.event_name,
    he.event_type,
    he.scheduled_date,
    s.full_name as student_name,
    s.grade_level_id,
    gl.grade_name
FROM vaccination_consents vc
LEFT JOIN health_events he ON vc.event_id = he.event_id
LEFT JOIN students s ON vc.student_code = s.student_code
LEFT JOIN grade_levels gl ON s.grade_level_id = gl.grade_id
ORDER BY vc.sent_date DESC;

-- Check if we have parent-student relationships
SELECT 
    psr.relationship_id,
    psr.parent_user_id,
    psr.student_code,
    psr.relationship_type,
    u.username as parent_username,
    s.full_name as student_name,
    s.grade_level_id,
    gl.grade_name
FROM parent_student_relationships psr
LEFT JOIN users u ON psr.parent_user_id = u.user_id
LEFT JOIN students s ON psr.student_code = s.student_code
LEFT JOIN grade_levels gl ON s.grade_level_id = gl.grade_id;

-- Check pending consents for specific student
SELECT 
    vc.*,
    he.event_name,
    he.description,
    he.scheduled_date
FROM vaccination_consents vc
LEFT JOIN health_events he ON vc.event_id = he.event_id
WHERE vc.student_code = 'STU001' 
  AND vc.consent_status = 'PENDING';
