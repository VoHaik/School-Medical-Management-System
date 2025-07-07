-- Insert sample health events for testing
INSERT INTO health_events (
    event_name, 
    event_type, 
    description, 
    scheduled_date, 
    start_date, 
    end_date, 
    location, 
    target_grade_names, 
    types_of_checkups, 
    created_by_user_name, 
    created_at, 
    updated_at
) VALUES 
(
    'Annual Health Checkup 2025', 
    'HEALTH_CHECKUP', 
    'Comprehensive annual health screening for all students', 
    '2025-08-15', 
    '2025-08-15', 
    '2025-08-20', 
    'School Health Center', 
    '["Grade 1", "Grade 2", "Grade 3"]', 
    '[1, 2, 3, 4]', 
    'admin', 
    GETDATE(), 
    GETDATE()
),
(
    'Grade 6-8 Vision and Hearing Test', 
    'HEALTH_CHECKUP', 
    'Vision and hearing assessment for middle school students', 
    '2025-07-20', 
    '2025-07-20', 
    '2025-07-22', 
    'School Clinic', 
    '["Grade 6", "Grade 7", "Grade 8"]', 
    '[2, 3]', 
    'nurse.johnson', 
    GETDATE(), 
    GETDATE()
),
(
    'MMR Vaccination Campaign', 
    'VACCINATION', 
    'MMR vaccination for kindergarten and first grade students', 
    '2025-07-25', 
    '2025-07-25', 
    '2025-07-25', 
    'School Health Center', 
    '["Grade 1", "Grade 2"]', 
    NULL, 
    'admin', 
    GETDATE(), 
    GETDATE()
),
(
    'High School Sports Physical', 
    'HEALTH_CHECKUP', 
    'Required physical examination for high school athletes', 
    '2025-08-01', 
    '2025-08-01', 
    '2025-08-05', 
    'Gymnasium', 
    '["Grade 9", "Grade 10", "Grade 11", "Grade 12"]', 
    '[1, 5, 10]', 
    'nurse.smith', 
    GETDATE(), 
    GETDATE()
),
(
    'Flu Vaccination 2025', 
    'VACCINATION', 
    'Annual flu vaccination for all students', 
    '2025-09-01', 
    '2025-09-01', 
    '2025-09-10', 
    'School Health Center', 
    '["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"]', 
    NULL, 
    'admin', 
    GETDATE(), 
    GETDATE()
);

-- Check if data was inserted
SELECT * FROM health_events ORDER BY created_at DESC;
