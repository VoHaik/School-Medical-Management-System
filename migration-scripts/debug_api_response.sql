-- Debug script to check what data the API should return
-- This shows what data is available for the DTO construction

SELECT 
    vc.consent_id,
    vc.student_code,
    s.full_name as student_name,
    vc.event_id,
    he.event_name,
    he.description as event_description,
    he.scheduled_date,
    he.location,
    vc.consent_status,
    vc.parent_notes,
    vc.consent_date,
    vc.sent_date,
    vc.reminder_count,
    vc.last_reminder_date
FROM vaccination_consents vc
LEFT JOIN students s ON vc.student_code = s.student_code
LEFT JOIN health_events he ON vc.event_id = he.event_id
WHERE vc.consent_status = 'PENDING'
ORDER BY vc.sent_date DESC;

-- Also check if there are any null values in key fields
SELECT 
    COUNT(*) as total_consents,
    COUNT(s.full_name) as consents_with_student_name,
    COUNT(he.description) as consents_with_event_description,
    COUNT(he.event_name) as consents_with_event_name
FROM vaccination_consents vc
LEFT JOIN students s ON vc.student_code = s.student_code
LEFT JOIN health_events he ON vc.event_id = he.event_id
WHERE vc.consent_status = 'PENDING';
