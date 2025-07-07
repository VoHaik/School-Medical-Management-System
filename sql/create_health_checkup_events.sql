-- Create health checkup events system
USE HealthSchoolDB;

-- Create health checkup events table if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'health_checkup_events')
BEGIN
    CREATE TABLE health_checkup_events (
        event_id INT IDENTITY(1,1) PRIMARY KEY,
        event_name NVARCHAR(255) NOT NULL,
        event_type NVARCHAR(50) DEFAULT 'HEALTH_CHECKUP',
        description NVARCHAR(MAX),
        location NVARCHAR(255),
        scheduled_date DATETIME NOT NULL,
        end_date DATETIME,
        status NVARCHAR(50) DEFAULT 'SCHEDULED', -- SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED
        checkup_type NVARCHAR(100), -- Annual, Sports, Routine, Comprehensive, etc.
        provider NVARCHAR(255), -- Healthcare provider/doctor
        notes NVARCHAR(MAX),
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE(),
        created_by_user_id INT,
        FOREIGN KEY (created_by_user_id) REFERENCES users(user_id)
    );
END

-- Create junction table for health checkup events and grade levels
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'health_checkup_event_grade_levels')
BEGIN
    CREATE TABLE health_checkup_event_grade_levels (
        id INT IDENTITY(1,1) PRIMARY KEY,
        event_id INT NOT NULL,
        grade_id INT NOT NULL,
        FOREIGN KEY (event_id) REFERENCES health_checkup_events(event_id) ON DELETE CASCADE,
        FOREIGN KEY (grade_id) REFERENCES grade_levels(grade_id) ON DELETE CASCADE,
        UNIQUE(event_id, grade_id)
    );
END

-- Create checkup consents/participations table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'health_checkup_participations')
BEGIN
    CREATE TABLE health_checkup_participations (
        id INT IDENTITY(1,1) PRIMARY KEY,
        event_id INT NOT NULL,
        student_code NVARCHAR(20) NOT NULL,
        participation_status NVARCHAR(50) DEFAULT 'SCHEDULED', -- SCHEDULED, COMPLETED, ABSENT, CANCELLED
        checkup_result_id INT NULL, -- Link to actual health checkup result
        scheduled_time DATETIME,
        completed_time DATETIME,
        notes NVARCHAR(MAX),
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (event_id) REFERENCES health_checkup_events(event_id) ON DELETE CASCADE,
        FOREIGN KEY (student_code) REFERENCES students(student_code) ON DELETE CASCADE,
        FOREIGN KEY (checkup_result_id) REFERENCES student_health_checkups(checkup_result_id),
        UNIQUE(event_id, student_code)
    );
END

-- Create some sample health checkup events
DELETE FROM health_checkup_participations WHERE event_id IN (
    SELECT event_id FROM health_checkup_events 
    WHERE event_name IN (
        'Annual Physical Examination 2025',
        'Sports Physical Checkup',
        'Vision and Hearing Screening',
        'Comprehensive Health Assessment'
    )
);

DELETE FROM health_checkup_event_grade_levels WHERE event_id IN (
    SELECT event_id FROM health_checkup_events 
    WHERE event_name IN (
        'Annual Physical Examination 2025',
        'Sports Physical Checkup',
        'Vision and Hearing Screening',
        'Comprehensive Health Assessment'
    )
);

DELETE FROM health_checkup_events WHERE event_name IN (
    'Annual Physical Examination 2025',
    'Sports Physical Checkup',
    'Vision and Hearing Screening',
    'Comprehensive Health Assessment'
);

-- Insert sample health checkup events
INSERT INTO health_checkup_events (event_name, description, location, scheduled_date, end_date, status, checkup_type, provider, created_by_user_id)
VALUES 
('Annual Physical Examination 2025', 'Comprehensive annual health checkup for all students including physical measurements, vital signs, and general health assessment', 'School Health Center', '2025-07-15 08:00:00', '2025-07-18 17:00:00', 'SCHEDULED', 'Annual', 'Dr. Sarah Johnson', 1),
('Sports Physical Checkup', 'Mandatory sports physical examination for students participating in athletic programs', 'School Health Center', '2025-07-20 09:00:00', '2025-07-20 16:00:00', 'SCHEDULED', 'Sports', 'Dr. Michael Chen', 1),
('Vision and Hearing Screening', 'Specialized screening focused on vision and hearing assessment for early detection of issues', 'School Health Center', '2025-07-10 08:30:00', '2025-07-12 15:30:00', 'IN_PROGRESS', 'Screening', 'Nurse Lisa Wang', 1),
('Comprehensive Health Assessment', 'Detailed health assessment for Grade 12 students before graduation', 'School Health Center', '2025-06-25 08:00:00', '2025-06-28 17:00:00', 'COMPLETED', 'Comprehensive', 'Dr. Sarah Johnson', 1);

-- Get event IDs for setting up grade levels and participations
DECLARE @AnnualEventId INT = (SELECT event_id FROM health_checkup_events WHERE event_name = 'Annual Physical Examination 2025');
DECLARE @SportsEventId INT = (SELECT event_id FROM health_checkup_events WHERE event_name = 'Sports Physical Checkup');
DECLARE @ScreeningEventId INT = (SELECT event_id FROM health_checkup_events WHERE event_name = 'Vision and Hearing Screening');
DECLARE @ComprehensiveEventId INT = (SELECT event_id FROM health_checkup_events WHERE event_name = 'Comprehensive Health Assessment');

-- Set target grade levels for events
-- Annual checkup for all grades
INSERT INTO health_checkup_event_grade_levels (event_id, grade_id)
SELECT @AnnualEventId, grade_id FROM grade_levels;

-- Sports checkup for Grades 9-12 (high school)
INSERT INTO health_checkup_event_grade_levels (event_id, grade_id)
SELECT @SportsEventId, grade_id FROM grade_levels WHERE grade_name IN ('Grade 9', 'Grade 10', 'Grade 11', 'Grade 12');

-- Vision/Hearing screening for Grades 6-8 (middle school)
INSERT INTO health_checkup_event_grade_levels (event_id, grade_id)
SELECT @ScreeningEventId, grade_id FROM grade_levels WHERE grade_name IN ('Grade 6', 'Grade 7', 'Grade 8');

-- Comprehensive for Grade 12 only
INSERT INTO health_checkup_event_grade_levels (event_id, grade_id)
SELECT @ComprehensiveEventId, grade_id FROM grade_levels WHERE grade_name = 'Grade 12';

-- Create participations for target students
INSERT INTO health_checkup_participations (event_id, student_code, participation_status, scheduled_time)
SELECT 
    hegl.event_id,
    s.student_code,
    CASE 
        WHEN he.status = 'COMPLETED' THEN 'COMPLETED'
        WHEN he.status = 'IN_PROGRESS' THEN 'SCHEDULED'
        ELSE 'SCHEDULED'
    END as participation_status,
    DATEADD(MINUTE, (ROW_NUMBER() OVER (PARTITION BY hegl.event_id ORDER BY s.student_code) - 1) * 15, he.scheduled_date) as scheduled_time
FROM health_checkup_event_grade_levels hegl
JOIN grade_levels gl ON hegl.grade_id = gl.grade_id
JOIN students s ON s.grade_level_id = gl.grade_id
JOIN health_checkup_events he ON hegl.event_id = he.event_id
WHERE NOT EXISTS (
    SELECT 1 FROM health_checkup_participations hcp 
    WHERE hcp.event_id = hegl.event_id 
    AND hcp.student_code = s.student_code
);

-- Show results
SELECT 
    he.event_name,
    he.checkup_type,
    he.status as event_status,
    he.scheduled_date,
    he.end_date,
    COUNT(DISTINCT hcp.student_code) as total_students,
    COUNT(CASE WHEN hcp.participation_status = 'COMPLETED' THEN 1 END) as completed_students,
    COUNT(CASE WHEN hcp.participation_status = 'SCHEDULED' THEN 1 END) as scheduled_students
FROM health_checkup_events he
LEFT JOIN health_checkup_participations hcp ON he.event_id = hcp.event_id
LEFT JOIN health_checkup_event_grade_levels hegl ON he.event_id = hegl.event_id
LEFT JOIN grade_levels gl ON hegl.grade_id = gl.grade_id
GROUP BY he.event_id, he.event_name, he.checkup_type, he.status, he.scheduled_date, he.end_date
ORDER BY he.scheduled_date;

PRINT 'Created health checkup events system successfully!';
