-- Create sample health checkup events with checkup types
USE HealthSchoolDB;

-- Delete existing sample data to avoid duplicates
DELETE FROM health_checkup_participations WHERE event_id IN (
    SELECT event_id FROM health_checkup_events 
    WHERE event_name IN (
        'Annual Health Screening 2025',
        'Grade 1 Entry Health Check',
        'Sports Physical Examination',
        'Mid-Year Health Assessment',
        'Pre-Summer Camp Health Check'
    )
);

DELETE FROM health_checkup_event_types WHERE event_id IN (
    SELECT event_id FROM health_checkup_events 
    WHERE event_name IN (
        'Annual Health Screening 2025',
        'Grade 1 Entry Health Check',
        'Sports Physical Examination',
        'Mid-Year Health Assessment',
        'Pre-Summer Camp Health Check'
    )
);

DELETE FROM health_checkup_event_grade_levels WHERE event_id IN (
    SELECT event_id FROM health_checkup_events 
    WHERE event_name IN (
        'Annual Health Screening 2025',
        'Grade 1 Entry Health Check',
        'Sports Physical Examination',
        'Mid-Year Health Assessment',
        'Pre-Summer Camp Health Check'
    )
);

DELETE FROM health_checkup_events WHERE event_name IN (
    'Annual Health Screening 2025',
    'Grade 1 Entry Health Check',
    'Sports Physical Examination',
    'Mid-Year Health Assessment',
    'Pre-Summer Camp Health Check'
);

-- Insert sample health checkup events
INSERT INTO health_checkup_events (event_name, event_type, description, location, scheduled_date, end_date, status, checkup_type, provider, notes, created_at, updated_at, created_by_user_id)
VALUES 
-- Comprehensive annual checkup
('Annual Health Screening 2025', 'HEALTH_CHECKUP', 'Comprehensive annual health assessment for all students including physical examination, growth assessment, and screening tests', 'School Health Center', '2025-08-15 08:00:00', '2025-08-20 17:00:00', 'SCHEDULED', 'Annual', 'School Health Services', 'Annual mandatory health screening for all students', GETDATE(), GETDATE(), 1),

-- New student health check
('Grade 1 Entry Health Check', 'HEALTH_CHECKUP', 'Pre-enrollment health assessment for new Grade 1 students', 'School Health Center', '2025-07-10 09:00:00', '2025-07-12 16:00:00', 'SCHEDULED', 'Pre-enrollment', 'Pediatric Health Clinic', 'Required health check for school entry', GETDATE(), GETDATE(), 1),

-- Sports physical
('Sports Physical Examination', 'HEALTH_CHECKUP', 'Pre-participation sports medicine examination for student athletes', 'School Health Center', '2025-07-25 08:00:00', '2025-07-26 17:00:00', 'SCHEDULED', 'Sports', 'Sports Medicine Center', 'Required for sports team participation', GETDATE(), GETDATE(), 1),

-- Mid-year assessment
('Mid-Year Health Assessment', 'HEALTH_CHECKUP', 'Mid-year health check focusing on growth monitoring and vital signs', 'School Health Center', '2025-09-15 08:00:00', '2025-09-18 16:00:00', 'SCHEDULED', 'Routine', 'School Nurse Team', 'Routine health monitoring', GETDATE(), GETDATE(), 1),

-- Completed event for history
('Pre-Summer Camp Health Check', 'HEALTH_CHECKUP', 'Health assessment for summer camp participants', 'School Health Center', '2025-06-01 08:00:00', '2025-06-03 16:00:00', 'COMPLETED', 'Comprehensive', 'Camp Health Services', 'Health check for camp safety', GETDATE(), GETDATE(), 1);

-- Get the event IDs
DECLARE @AnnualEventId INT = (SELECT event_id FROM health_checkup_events WHERE event_name = 'Annual Health Screening 2025');
DECLARE @Grade1EventId INT = (SELECT event_id FROM health_checkup_events WHERE event_name = 'Grade 1 Entry Health Check');
DECLARE @SportsEventId INT = (SELECT event_id FROM health_checkup_events WHERE event_name = 'Sports Physical Examination');
DECLARE @MidYearEventId INT = (SELECT event_id FROM health_checkup_events WHERE event_name = 'Mid-Year Health Assessment');
DECLARE @SummerCampEventId INT = (SELECT event_id FROM health_checkup_events WHERE event_name = 'Pre-Summer Camp Health Check');

-- Associate checkup types with events
-- Annual Health Screening (Comprehensive)
INSERT INTO health_checkup_event_types (event_id, checkup_type_id, is_required, sequence_order, notes)
VALUES 
(@AnnualEventId, 12, 1, 1, 'Full annual comprehensive health assessment'),
(@AnnualEventId, 2, 1, 2, 'Growth tracking and BMI calculation'),
(@AnnualEventId, 4, 1, 3, 'Annual vision screening'),
(@AnnualEventId, 5, 1, 4, 'Annual hearing assessment'),
(@AnnualEventId, 6, 1, 5, 'Dental health examination');

-- Grade 1 Entry Health Check
INSERT INTO health_checkup_event_types (event_id, checkup_type_id, is_required, sequence_order, notes)
VALUES 
(@Grade1EventId, 14, 1, 1, 'Complete pre-enrollment health assessment'),
(@Grade1EventId, 16, 1, 2, 'Vaccination record review'),
(@Grade1EventId, 2, 1, 3, 'Baseline growth measurements'),
(@Grade1EventId, 4, 1, 4, 'Initial vision screening'),
(@Grade1EventId, 5, 1, 5, 'Initial hearing assessment');

-- Sports Physical Examination
INSERT INTO health_checkup_event_types (event_id, checkup_type_id, is_required, sequence_order, notes)
VALUES 
(@SportsEventId, 13, 1, 1, 'Sports medicine physical examination'),
(@SportsEventId, 8, 1, 2, 'Cardiovascular fitness assessment'),
(@SportsEventId, 9, 1, 3, 'Respiratory function evaluation'),
(@SportsEventId, 10, 1, 4, 'Musculoskeletal assessment for sports'),
(@SportsEventId, 2, 1, 5, 'Height, weight, BMI for sports categories');

-- Mid-Year Health Assessment (Basic monitoring)
INSERT INTO health_checkup_event_types (event_id, checkup_type_id, is_required, sequence_order, notes)
VALUES 
(@MidYearEventId, 2, 1, 1, 'Growth monitoring and tracking'),
(@MidYearEventId, 3, 1, 2, 'Vital signs check'),
(@MidYearEventId, 1, 0, 3, 'General physical exam if needed');

-- Pre-Summer Camp Health Check (Completed event)
INSERT INTO health_checkup_event_types (event_id, checkup_type_id, is_required, sequence_order, notes)
VALUES 
(@SummerCampEventId, 1, 1, 1, 'General physical examination for camp'),
(@SummerCampEventId, 2, 1, 2, 'Growth assessment'),
(@SummerCampEventId, 3, 1, 3, 'Vital signs check'),
(@SummerCampEventId, 16, 1, 4, 'Immunization status review');

-- Add target grade levels for events
-- Annual screening for all grades
INSERT INTO health_checkup_event_grade_levels (event_id, grade_id)
SELECT @AnnualEventId, grade_id FROM grade_levels;

-- Grade 1 check for Grade 1 only
INSERT INTO health_checkup_event_grade_levels (event_id, grade_id)
SELECT @Grade1EventId, grade_id FROM grade_levels WHERE grade_name = 'Grade 1';

-- Sports physical for Grades 6-12
INSERT INTO health_checkup_event_grade_levels (event_id, grade_id)
SELECT @SportsEventId, grade_id FROM grade_levels WHERE grade_name IN ('Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12');

-- Mid-year for Grades 1-6
INSERT INTO health_checkup_event_grade_levels (event_id, grade_id)
SELECT @MidYearEventId, grade_id FROM grade_levels WHERE grade_name IN ('Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6');

-- Summer camp for all grades
INSERT INTO health_checkup_event_grade_levels (event_id, grade_id)
SELECT @SummerCampEventId, grade_id FROM grade_levels;

-- Create participations for target students
INSERT INTO health_checkup_participations (event_id, student_code, participation_status, scheduled_time, notes)
SELECT 
    hegl.event_id,
    s.student_code,
    CASE 
        WHEN he.status = 'COMPLETED' THEN 'COMPLETED'
        ELSE 'SCHEDULED'
    END as participation_status,
    DATEADD(MINUTE, 
        (ROW_NUMBER() OVER (PARTITION BY hegl.event_id ORDER BY s.student_code) - 1) * 30,
        he.scheduled_date
    ) as scheduled_time,
    'Auto-scheduled for health checkup event' as notes
FROM health_checkup_event_grade_levels hegl
JOIN grade_levels gl ON hegl.grade_id = gl.grade_id
JOIN students s ON s.grade_level_id = gl.grade_id
JOIN health_checkup_events he ON hegl.event_id = he.event_id
WHERE NOT EXISTS (
    SELECT 1 FROM health_checkup_participations hcp 
    WHERE hcp.event_id = hegl.event_id 
    AND hcp.student_code = s.student_code
);

-- Show results with checkup types
SELECT 
    he.event_name,
    he.status,
    he.scheduled_date,
    he.end_date,
    STRING_AGG(hct.type_name, ', ') AS checkup_types,
    COUNT(DISTINCT hcp.student_code) as total_students
FROM health_checkup_events he
LEFT JOIN health_checkup_event_types het ON he.event_id = het.event_id
LEFT JOIN health_checkup_types hct ON het.checkup_type_id = hct.checkup_type_id
LEFT JOIN health_checkup_participations hcp ON he.event_id = hcp.event_id
WHERE he.event_type = 'HEALTH_CHECKUP'
GROUP BY he.event_id, he.event_name, he.status, he.scheduled_date, he.end_date
ORDER BY he.scheduled_date;

PRINT 'Created health checkup events with associated checkup types successfully!';
