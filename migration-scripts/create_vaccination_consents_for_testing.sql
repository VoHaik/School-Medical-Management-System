-- Create vaccination consents for testing
USE HealthSchoolDB;

-- First check available students and vaccination events
SELECT 'Available Students:' as Info;
SELECT student_id, student_code, full_name, grade_level_id FROM students ORDER BY student_id;

SELECT 'Available Vaccination Events:' as Info;
SELECT event_id, event_name, scheduled_date FROM health_events WHERE event_type = 'VACCINATION' ORDER BY event_id;

-- Create vaccination consents for students (linking them to vaccination events)
-- This simulates the consent requests being sent to parents

INSERT INTO vaccination_consents (event_id, student_id, consent_status, sent_date, created_at, updated_at)
SELECT 
    he.event_id,
    s.student_id,
    'PENDING' as consent_status,
    GETDATE() as sent_date,
    GETDATE() as created_at,
    GETDATE() as updated_at
FROM health_events he
CROSS JOIN students s
WHERE he.event_type = 'VACCINATION'
  AND he.event_id >= 6  -- Only use our new test events, not the old ones
  AND s.student_id <= 10  -- Limit to first 10 students for testing
ORDER BY he.event_id, s.student_id;

-- Show results
SELECT 'Created Vaccination Consents:' as Info;
SELECT 
    vc.consent_id,
    he.event_name,
    s.student_code,
    s.full_name,
    vc.consent_status,
    vc.sent_date
FROM vaccination_consents vc
JOIN health_events he ON vc.event_id = he.event_id
JOIN students s ON vc.student_id = s.student_id
WHERE he.event_type = 'VACCINATION'
ORDER BY vc.consent_id DESC;

-- Also show count summary
SELECT 
    'Total consents created: ' + CAST(COUNT(*) AS VARCHAR(10)) as Summary
FROM vaccination_consents vc
JOIN health_events he ON vc.event_id = he.event_id
WHERE he.event_type = 'VACCINATION';

PRINT 'Created vaccination consent requests for testing!';
