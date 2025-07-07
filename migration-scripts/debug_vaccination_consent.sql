-- Debug vaccination consent issue

-- Check if there are any health events
SELECT 'Health Events Count' as table_name, COUNT(*) as count FROM health_events;

-- Check vaccination events specifically
SELECT 'Vaccination Events' as info, event_id, event_name, event_type, target_date
FROM health_events 
WHERE event_type = 'VACCINATION';

-- Check grade levels for vaccination events
SELECT 'Grade Levels for Vaccination Events' as info, he.event_id, he.event_name, gl.grade_name
FROM health_events he
JOIN health_event_grade_levels hegl ON he.event_id = hegl.event_id
JOIN grade_levels gl ON hegl.grade_level_id = gl.grade_id
WHERE he.event_type = 'VACCINATION';

-- Check students count
SELECT 'Students Count' as table_name, COUNT(*) as count FROM students;

-- Check students with grade levels
SELECT 'Students with Grade Levels' as info, s.student_code, s.full_name, gl.grade_name
FROM students s
JOIN grade_levels gl ON s.grade_level_id = gl.grade_id
LIMIT 10;

-- Check vaccination consents
SELECT 'Vaccination Consents Count' as table_name, COUNT(*) as count FROM vaccination_consents;

-- Show all vaccination consents if any
SELECT * FROM vaccination_consents;
