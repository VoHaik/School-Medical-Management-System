-- Create vaccination consents for diverse events to test frontend display
USE HealthSchoolDB;

-- Create vaccination consents for parent.smith's students with various events
INSERT INTO vaccination_consents (event_id, student_code, consent_status, sent_date, reminder_count)
VALUES 
-- Single vaccine events
((SELECT event_id FROM health_events WHERE event_name = 'BCG Vaccination Program 2025'), 'ST001', 'PENDING', GETDATE(), 0),
((SELECT event_id FROM health_events WHERE event_name = 'DPT Immunization Campaign'), 'ST001', 'PENDING', GETDATE(), 0),

-- Multi-vaccine events  
((SELECT event_id FROM health_events WHERE event_name = 'Comprehensive Immunization Drive'), 'ST001', 'PENDING', GETDATE(), 0),
((SELECT event_id FROM health_events WHERE event_name = 'Annual Health Protection Campaign'), 'ST001', 'PENDING', GETDATE(), 0),
((SELECT event_id FROM health_events WHERE event_name = 'Back-to-School Immunization'), 'ST001', 'PENDING', GETDATE(), 0),

-- Flu vaccine event
((SELECT event_id FROM health_events WHERE event_name = 'Flu Season Prevention'), 'ST001', 'PENDING', GETDATE(), 0);

-- Verify created consents with vaccine details
SELECT 
    vc.consent_id,
    vc.student_code,
    he.event_name,
    STRING_AGG(v.vaccine_name, ', ') AS vaccines,
    vc.consent_status,
    vc.sent_date
FROM vaccination_consents vc
JOIN health_events he ON vc.event_id = he.event_id
LEFT JOIN health_event_vaccines hev ON he.event_id = hev.event_id
LEFT JOIN vaccines v ON hev.vaccine_id = v.vaccine_id
WHERE vc.student_code = 'ST001'
GROUP BY vc.consent_id, vc.student_code, he.event_name, vc.consent_status, vc.sent_date
ORDER BY vc.sent_date DESC;

PRINT 'Created vaccination consents for testing diverse vaccine display!';
