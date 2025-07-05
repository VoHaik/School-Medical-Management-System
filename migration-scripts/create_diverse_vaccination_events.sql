-- Create diverse vaccination events with different vaccines for testing
USE HealthSchoolDB;

-- Delete only events created by this script to avoid confusion
DELETE FROM vaccination_consents WHERE event_id IN (
    SELECT event_id FROM health_events 
    WHERE event_name IN (
        'BCG Vaccination Program 2025',
        'DPT Immunization Campaign', 
        'Polio Prevention Program',
        'Comprehensive Immunization Drive',
        'Annual Health Protection Campaign',
        'Flu Season Prevention',
        'Back-to-School Immunization'
    )
);

DELETE FROM health_event_vaccines WHERE event_id IN (
    SELECT event_id FROM health_events 
    WHERE event_name IN (
        'BCG Vaccination Program 2025',
        'DPT Immunization Campaign', 
        'Polio Prevention Program',
        'Comprehensive Immunization Drive',
        'Annual Health Protection Campaign',
        'Flu Season Prevention',
        'Back-to-School Immunization'
    )
);

DELETE FROM health_events WHERE event_name IN (
    'BCG Vaccination Program 2025',
    'DPT Immunization Campaign', 
    'Polio Prevention Program',
    'Comprehensive Immunization Drive',
    'Annual Health Protection Campaign',
    'Flu Season Prevention',
    'Back-to-School Immunization'
);

-- Insert vaccination events (without vaccine_id since it's now in junction table)
INSERT INTO health_events (event_name, event_type, description, location, scheduled_date, status, created_at, updated_at, created_by_user_id)
VALUES 
-- Single vaccine events
('BCG Vaccination Program 2025', 'VACCINATION', 'Annual BCG vaccination for tuberculosis prevention - Grade 1 students', 'School Health Center', '2025-07-10', 'SCHEDULED', GETDATE(), GETDATE(), 1),
('DPT Immunization Campaign', 'VACCINATION', 'DPT vaccine for diphtheria, pertussis, and tetanus protection - Grade 2 students', 'School Health Center', '2025-07-15', 'SCHEDULED', GETDATE(), GETDATE(), 1),
('Polio Prevention Program', 'VACCINATION', 'Oral polio vaccine administration - Grade 3 students', 'School Health Center', '2025-07-20', 'SCHEDULED', GETDATE(), GETDATE(), 1),

-- Multi-vaccine events (combination vaccines)
('Comprehensive Immunization Drive', 'VACCINATION', 'Multi-vaccine event for Grades 4-6: MMR, Hepatitis B, and Japanese Encephalitis', 'School Health Center', '2025-07-25', 'SCHEDULED', GETDATE(), GETDATE(), 1),
('Annual Health Protection Campaign', 'VACCINATION', 'Complete vaccination package: Influenza, Tetanus booster, and Varicella for all grades', 'School Health Center', '2025-08-01', 'SCHEDULED', GETDATE(), GETDATE(), 1),

-- Seasonal vaccination events
('Flu Season Prevention', 'VACCINATION', 'Seasonal influenza vaccination for all students', 'School Health Center', '2025-08-15', 'SCHEDULED', GETDATE(), GETDATE(), 1),
('Back-to-School Immunization', 'VACCINATION', 'Essential vaccines for new academic year: DPT, MMR, and Hepatitis B', 'School Health Center', '2025-08-20', 'SCHEDULED', GETDATE(), GETDATE(), 1);

-- Get the event IDs for junction table inserts
DECLARE @BCGEventId INT = (SELECT event_id FROM health_events WHERE event_name = 'BCG Vaccination Program 2025');
DECLARE @DPTEventId INT = (SELECT event_id FROM health_events WHERE event_name = 'DPT Immunization Campaign');
DECLARE @PolioEventId INT = (SELECT event_id FROM health_events WHERE event_name = 'Polio Prevention Program');
DECLARE @ComprehensiveEventId INT = (SELECT event_id FROM health_events WHERE event_name = 'Comprehensive Immunization Drive');
DECLARE @HealthProtectionEventId INT = (SELECT event_id FROM health_events WHERE event_name = 'Annual Health Protection Campaign');
DECLARE @FluEventId INT = (SELECT event_id FROM health_events WHERE event_name = 'Flu Season Prevention');
DECLARE @BackToSchoolEventId INT = (SELECT event_id FROM health_events WHERE event_name = 'Back-to-School Immunization');

-- Insert vaccine associations in junction table
INSERT INTO health_event_vaccines (event_id, vaccine_id, dose_number, is_required, notes)
VALUES 
-- Single vaccine events
(@BCGEventId, 1, 1, 1, 'Single dose BCG vaccine for tuberculosis prevention'),
(@DPTEventId, 2, 1, 1, 'First dose of DPT vaccine series'),
(@PolioEventId, 3, 1, 1, 'Oral polio vaccine administration'),

-- Multi-vaccine events
(@ComprehensiveEventId, 5, 1, 1, 'MMR vaccine - measles, mumps, rubella protection'),
(@ComprehensiveEventId, 6, 1, 1, 'Hepatitis B vaccine - liver protection'),
(@ComprehensiveEventId, 7, 1, 1, 'Japanese Encephalitis vaccine - endemic area protection'),

(@HealthProtectionEventId, 8, 1, 1, 'Annual influenza vaccine'),
(@HealthProtectionEventId, 9, 1, 1, 'Tetanus booster for older students'),
(@HealthProtectionEventId, 10, 1, 1, 'Varicella vaccine for chickenpox prevention'),

-- Seasonal events
(@FluEventId, 8, 1, 1, 'Seasonal flu vaccine for all students'),

-- Back-to-school combination
(@BackToSchoolEventId, 2, 2, 1, 'Second dose of DPT vaccine series'),
(@BackToSchoolEventId, 5, 1, 1, 'MMR vaccine for new students'),
(@BackToSchoolEventId, 6, 2, 1, 'Hepatitis B second dose');

-- Show results with vaccine details
SELECT 
    he.event_id,
    he.event_name,
    he.description,
    STRING_AGG(v.vaccine_name, ', ') AS vaccines,
    COUNT(hev.vaccine_id) AS vaccine_count,
    he.location,
    he.scheduled_date
FROM health_events he
LEFT JOIN health_event_vaccines hev ON he.event_id = hev.event_id
LEFT JOIN vaccines v ON hev.vaccine_id = v.vaccine_id
WHERE he.event_type = 'VACCINATION'
GROUP BY he.event_id, he.event_name, he.description, he.location, he.scheduled_date
ORDER BY he.event_id;

PRINT 'Created diverse vaccination events with multiple vaccine combinations!';

-- Step 2: Add target grade levels for events
-- BCG for Grade 1
INSERT INTO health_event_grade_levels (event_id, grade_id)
SELECT @BCGEventId, grade_id FROM grade_levels WHERE grade_name = 'Grade 1';

-- DPT for Grade 2  
INSERT INTO health_event_grade_levels (event_id, grade_id)
SELECT @DPTEventId, grade_id FROM grade_levels WHERE grade_name = 'Grade 2';

-- Polio for Grade 3
INSERT INTO health_event_grade_levels (event_id, grade_id)
SELECT @PolioEventId, grade_id FROM grade_levels WHERE grade_name = 'Grade 3';

-- Comprehensive for Grades 4-6
INSERT INTO health_event_grade_levels (event_id, grade_id)
SELECT @ComprehensiveEventId, grade_id FROM grade_levels WHERE grade_name IN ('Grade 4', 'Grade 5', 'Grade 6');

-- Health Protection for all grades
INSERT INTO health_event_grade_levels (event_id, grade_id)
SELECT @HealthProtectionEventId, grade_id FROM grade_levels;

-- Flu for all grades
INSERT INTO health_event_grade_levels (event_id, grade_id)
SELECT @FluEventId, grade_id FROM grade_levels;

-- Back to School for all grades
INSERT INTO health_event_grade_levels (event_id, grade_id)
SELECT @BackToSchoolEventId, grade_id FROM grade_levels;

-- Step 3: Create vaccination consents for target students
INSERT INTO vaccination_consents (event_id, student_code, consent_status, sent_date, reminder_count)
SELECT 
    hegl.event_id,
    s.student_code,
    'PENDING' as consent_status,
    GETDATE() as sent_date,
    0 as reminder_count
FROM health_event_grade_levels hegl
JOIN grade_levels gl ON hegl.grade_id = gl.grade_id
JOIN students s ON s.grade_level_id = gl.grade_id
JOIN health_events he ON hegl.event_id = he.event_id
WHERE he.event_type = 'VACCINATION'
AND NOT EXISTS (
    SELECT 1 FROM vaccination_consents vc 
    WHERE vc.event_id = hegl.event_id 
    AND vc.student_code = s.student_code
);

-- Show final results with consents created
SELECT 
    he.event_name,
    COUNT(DISTINCT vc.student_code) as students_with_consents,
    STRING_AGG(DISTINCT v.vaccine_name, ', ') AS vaccines
FROM health_events he
LEFT JOIN vaccination_consents vc ON he.event_id = vc.event_id
LEFT JOIN health_event_vaccines hev ON he.event_id = hev.event_id
LEFT JOIN vaccines v ON hev.vaccine_id = v.vaccine_id
WHERE he.event_type = 'VACCINATION'
GROUP BY he.event_id, he.event_name
ORDER BY he.event_id;

PRINT 'Created vaccination consents for all target students!';
