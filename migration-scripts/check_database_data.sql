-- Check current data in HealthSchoolDB
USE HealthSchoolDB;

-- Check if we're using the correct database
SELECT DB_NAME() AS CurrentDatabase;

-- Check health_events table
SELECT COUNT(*) AS TotalEvents FROM health_events;
SELECT COUNT(*) AS VaccinationEvents FROM health_events WHERE event_type = 'VACCINATION';

-- Check health_event_vaccines junction table
SELECT COUNT(*) AS EventVaccineLinks FROM health_event_vaccines;

-- Check vaccination_consents
SELECT COUNT(*) AS TotalConsents FROM vaccination_consents;

-- Show current vaccination events with vaccines
SELECT 
    he.event_id,
    he.event_name,
    he.description,
    STRING_AGG(v.vaccine_name, ', ') AS vaccines,
    COUNT(hev.vaccine_id) AS vaccine_count,
    he.scheduled_date,
    he.status
FROM health_events he
LEFT JOIN health_event_vaccines hev ON he.event_id = hev.event_id
LEFT JOIN vaccines v ON hev.vaccine_id = v.vaccine_id
WHERE he.event_type = 'VACCINATION'
GROUP BY he.event_id, he.event_name, he.description, he.scheduled_date, he.status
ORDER BY he.event_id;

-- Check vaccination consents for students
SELECT 
    vc.consent_id,
    vc.student_id,
    s.student_name,
    he.event_name,
    vc.consent_status,
    vc.submitted_at
FROM vaccination_consents vc
JOIN students s ON vc.student_id = s.student_id
JOIN health_events he ON vc.event_id = he.event_id
ORDER BY vc.consent_id;

PRINT 'Database data check completed!';
