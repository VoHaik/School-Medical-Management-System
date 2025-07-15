-- Check if vaccination consents exist for STU001
SELECT 'Current Vaccination Consents for STU001' as info;
SELECT vc.consent_id, vc.event_id, vc.student_code, vc.consent_status, vc.sent_date,
       he.event_name, s.full_name, gl.grade_name
FROM vaccination_consents vc
INNER JOIN health_events he ON vc.event_id = he.event_id
INNER JOIN students s ON vc.student_code = s.student_code
INNER JOIN grade_levels gl ON s.grade_level_id = gl.grade_id
WHERE vc.student_code = 'STU001';

-- Create consents for STU001 since the service is not working
-- STU001 is in grade 9A (grade_id = 6), which is target for both events

-- If no consents exist, create them manually
-- For Event 1 (target grades: 5, 6) - STU001 is in grade 6
INSERT INTO vaccination_consents (event_id, student_code, consent_status, sent_date, reminder_count)
SELECT 1, 'STU001', 'PENDING', GETDATE(), 0
WHERE NOT EXISTS (
    SELECT 1 FROM vaccination_consents vc 
    WHERE vc.event_id = 1 AND vc.student_code = 'STU001'
);

-- For Event 2 (target grades: 1, 4, 5, 6) - STU001 is in grade 6
INSERT INTO vaccination_consents (event_id, student_code, consent_status, sent_date, reminder_count)
SELECT 2, 'STU001', 'PENDING', GETDATE(), 0
WHERE NOT EXISTS (
    SELECT 1 FROM vaccination_consents vc 
    WHERE vc.event_id = 2 AND vc.student_code = 'STU001'
);

-- Verify the consents for STU001
SELECT 'Final Vaccination Consents for STU001' as info;
SELECT vc.consent_id, vc.event_id, vc.student_code, vc.consent_status, vc.sent_date,
       he.event_name, s.full_name, gl.grade_name
FROM vaccination_consents vc
INNER JOIN health_events he ON vc.event_id = he.event_id
INNER JOIN students s ON vc.student_code = s.student_code
INNER JOIN grade_levels gl ON s.grade_level_id = gl.grade_id
WHERE vc.student_code = 'STU001'
ORDER BY vc.event_id;
