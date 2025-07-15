-- Create vaccination consents for testing the UI
USE HealthSchoolDB;

-- First, let's check what students exist and what vaccination events are available
SELECT TOP 5 student_code, full_name, class_name FROM students;

SELECT event_id, event_name, scheduled_date 
FROM health_events 
WHERE event_type = 'VACCINATION' 
ORDER BY scheduled_date;

-- Create vaccination consents for existing students
-- We'll create consents for the first few vaccination events

-- Get some student codes
DECLARE @Student1 NVARCHAR(40) = (SELECT TOP 1 student_code FROM students WHERE class_name LIKE '%9A%');
DECLARE @Student2 NVARCHAR(40) = (SELECT TOP 1 student_code FROM students WHERE student_code != @Student1);

-- Get vaccination event IDs
DECLARE @BCGEventId INT = (SELECT event_id FROM health_events WHERE event_name = 'BCG Vaccination Program 2025');
DECLARE @DPTEventId INT = (SELECT event_id FROM health_events WHERE event_name = 'DPT Immunization Campaign');
DECLARE @ComprehensiveEventId INT = (SELECT event_id FROM health_events WHERE event_name = 'Comprehensive Immunization Drive');

-- Insert vaccination consents
INSERT INTO vaccination_consents (student_code, event_id, consent_status, sent_date, consent_date, parent_notes)
VALUES 
-- Student 1 consents
(@Student1, @BCGEventId, 'PENDING', GETDATE(), NULL, NULL),
(@Student1, @DPTEventId, 'APPROVED', DATEADD(day, -1, GETDATE()), DATEADD(hour, -2, GETDATE()), 'Đồng ý cho con tiêm vaccine BCG'),
(@Student1, @ComprehensiveEventId, 'PENDING', GETDATE(), NULL, NULL),

-- Student 2 consents  
(@Student2, @BCGEventId, 'APPROVED', DATEADD(day, -2, GETDATE()), DATEADD(day, -1, GETDATE()), 'Agree to vaccination'),
(@Student2, @DPTEventId, 'PENDING', GETDATE(), NULL, NULL);

-- Show results
SELECT 
    vc.consent_id,
    vc.student_code,
    s.full_name as student_name,
    he.event_name,
    vc.consent_status,
    vc.sent_date,
    vc.consent_date,
    vc.parent_notes
FROM vaccination_consents vc
JOIN students s ON vc.student_code = s.student_code
JOIN health_events he ON vc.event_id = he.event_id
ORDER BY vc.consent_id;

PRINT 'Created vaccination consents for testing!';
