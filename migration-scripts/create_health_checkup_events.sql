-- Create diverse health checkup events for testing
USE HealthSchoolDB;

-- Delete existing health checkup events created by this script
DELETE FROM health_checkup_event_types WHERE event_id IN (
    SELECT event_id FROM health_events 
    WHERE event_name IN (
        'Annual Health Screening 2025',
        'Pre-Sports Physical Examination',
        'Monthly Health Check - July',
        'Vision and Hearing Assessment',
        'Comprehensive Health Evaluation'
    )
);

DELETE FROM health_event_grade_levels WHERE event_id IN (
    SELECT event_id FROM health_events 
    WHERE event_name IN (
        'Annual Health Screening 2025',
        'Pre-Sports Physical Examination',
        'Monthly Health Check - July',
        'Vision and Hearing Assessment',
        'Comprehensive Health Evaluation'
    )
);

DELETE FROM health_events WHERE event_name IN (
    'Annual Health Screening 2025',
    'Pre-Sports Physical Examination',
    'Monthly Health Check - July',
    'Vision and Hearing Assessment',
    'Comprehensive Health Evaluation'
);

-- Insert health checkup events
INSERT INTO health_events (event_name, event_type, description, location, scheduled_date, status, created_at, updated_at, created_by_user_id)
VALUES 
-- Health checkup events for different grades and purposes
('Annual Physical Health Checkup 2025', 'HEALTH_CHECKUP', 'Annual comprehensive physical health examination for all students', 'School Health Center', '2025-07-15', 'SCHEDULED', GETDATE(), GETDATE(), 1),
('Dental Health Screening', 'HEALTH_CHECKUP', 'Dental health screening and oral hygiene assessment for Grade 1-3 students', 'School Dental Clinic', '2025-07-22', 'SCHEDULED', GETDATE(), GETDATE(), 1),
('Vision and Hearing Assessment', 'HEALTH_CHECKUP', 'Vision and hearing screening for Grade 4-6 students', 'School Health Center', '2025-07-29', 'SCHEDULED', GETDATE(), GETDATE(), 1),
('Growth and Development Monitoring', 'HEALTH_CHECKUP', 'Height, weight, and developmental assessment for Grade 7-9 students', 'School Health Center', '2025-08-05', 'SCHEDULED', GETDATE(), GETDATE(), 1),
('Comprehensive Health Assessment', 'HEALTH_CHECKUP', 'Complete health checkup including all systems for Grade 10-12 students', 'School Health Center', '2025-08-12', 'SCHEDULED', GETDATE(), GETDATE(), 1);

-- Get the event IDs for junction table inserts
DECLARE @AnnualCheckupId INT = (SELECT event_id FROM health_events WHERE event_name = 'Annual Physical Health Checkup 2025');
DECLARE @DentalScreeningId INT = (SELECT event_id FROM health_events WHERE event_name = 'Dental Health Screening');
DECLARE @VisionHearingId INT = (SELECT event_id FROM health_events WHERE event_name = 'Vision and Hearing Assessment');
DECLARE @GrowthMonitoringId INT = (SELECT event_id FROM health_events WHERE event_name = 'Growth and Development Monitoring');
DECLARE @ComprehensiveAssessmentId INT = (SELECT event_id FROM health_events WHERE event_name = 'Comprehensive Health Assessment');

-- Add checkup types for each event (assuming checkup type IDs exist)
-- Link appropriate checkup types to events
-- Annual checkup - all types
INSERT INTO health_checkup_event_types (event_id, checkup_type_id)
SELECT @AnnualCheckupId, checkup_type_id FROM health_checkup_types WHERE checkup_type_id IN (1, 2, 3, 4, 5);

-- Dental screening - dental examination
INSERT INTO health_checkup_event_types (event_id, checkup_type_id)
SELECT @DentalScreeningId, checkup_type_id FROM health_checkup_types WHERE checkup_type_id = 3; -- Assuming 3 is dental

-- Vision and hearing - specific assessments
INSERT INTO health_checkup_event_types (event_id, checkup_type_id)
SELECT @VisionHearingId, checkup_type_id FROM health_checkup_types WHERE checkup_type_id IN (1, 2); -- Vision and hearing

-- Growth monitoring - height/weight measurement
INSERT INTO health_checkup_event_types (event_id, checkup_type_id)
SELECT @GrowthMonitoringId, checkup_type_id FROM health_checkup_types WHERE checkup_type_id = 4; -- Assuming 4 is height/weight

-- Comprehensive - all types
INSERT INTO health_checkup_event_types (event_id, checkup_type_id)
SELECT @ComprehensiveAssessmentId, checkup_type_id FROM health_checkup_types WHERE checkup_type_id IN (1, 2, 3, 4, 5);

-- Add target grade levels for events
-- Annual checkup for all grades
INSERT INTO health_event_grade_levels (event_id, grade_id)
SELECT @AnnualCheckupId, grade_id FROM grade_levels;

-- Dental screening for Grades 1-3
INSERT INTO health_event_grade_levels (event_id, grade_id)
SELECT @DentalScreeningId, grade_id FROM grade_levels WHERE grade_name IN ('Grade 1', 'Grade 2', 'Grade 3');

-- Vision and hearing for Grades 4-6
INSERT INTO health_event_grade_levels (event_id, grade_id)
SELECT @VisionHearingId, grade_id FROM grade_levels WHERE grade_name IN ('Grade 4', 'Grade 5', 'Grade 6');

-- Growth monitoring for Grades 7-9
INSERT INTO health_event_grade_levels (event_id, grade_id)
SELECT @GrowthMonitoringId, grade_id FROM grade_levels WHERE grade_name IN ('Grade 7', 'Grade 8', 'Grade 9');

-- Comprehensive assessment for Grades 10-12
INSERT INTO health_event_grade_levels (event_id, grade_id)
SELECT @ComprehensiveAssessmentId, grade_id FROM grade_levels WHERE grade_name IN ('Grade 10', 'Grade 11', 'Grade 12');

-- Show results
SELECT 
    he.event_id,
    he.event_name,
    he.description,
    he.location,
    he.scheduled_date,
    COUNT(hegl.grade_id) as target_grades_count
FROM health_events he
LEFT JOIN health_event_grade_levels hegl ON he.event_id = hegl.event_id
WHERE he.event_type = 'HEALTH_CHECKUP'
GROUP BY he.event_id, he.event_name, he.description, he.location, he.scheduled_date
ORDER BY he.scheduled_date;

PRINT 'Created health checkup events for testing upcoming checkups feature!';

-- Show which students should see each event
SELECT 
    he.event_name,
    gl.grade_name,
    COUNT(s.student_code) as students_count
FROM health_events he
JOIN health_event_grade_levels hegl ON he.event_id = hegl.event_id
JOIN grade_levels gl ON hegl.grade_id = gl.grade_id
LEFT JOIN students s ON s.grade_level_id = gl.grade_id
WHERE he.event_type = 'HEALTH_CHECKUP'
GROUP BY he.event_name, gl.grade_name
ORDER BY he.event_name, gl.grade_name;
