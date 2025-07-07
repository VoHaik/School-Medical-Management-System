-- Create junction table between health_events and health_checkup_types
-- This table links health checkup events to specific types of checkups

USE HealthSchoolDB;

-- Check if the junction table exists
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'health_event_checkup_types')
BEGIN
    PRINT 'Creating health_event_checkup_types junction table...';
    
    CREATE TABLE health_event_checkup_types (
        event_id INT NOT NULL,
        checkup_type_id INT NOT NULL,
        is_required BIT DEFAULT 1, -- Is this checkup type mandatory for this event?
        sequence_order INT DEFAULT 1, -- Order in which checkups should be performed
        notes NVARCHAR(500), -- Additional notes for this checkup type in this event
        created_at DATETIME2 DEFAULT GETDATE(),
        PRIMARY KEY (event_id, checkup_type_id),
        FOREIGN KEY (event_id) REFERENCES health_events(event_id) ON DELETE CASCADE,
        FOREIGN KEY (checkup_type_id) REFERENCES health_checkup_types(checkup_type_id) ON DELETE CASCADE
    );
    
    -- Create indexes for better performance
    CREATE INDEX IX_health_event_checkup_types_event_id ON health_event_checkup_types(event_id);
    CREATE INDEX IX_health_event_checkup_types_checkup_type_id ON health_event_checkup_types(checkup_type_id);
    
    PRINT 'Junction table health_event_checkup_types created successfully.';
END
ELSE
BEGIN
    PRINT 'Junction table health_event_checkup_types already exists.';
END

-- Check if health_checkup_types table exists and has data
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'health_checkup_types')
BEGIN
    DECLARE @checkupTypeCount INT = (SELECT COUNT(*) FROM health_checkup_types);
    PRINT 'health_checkup_types table exists with ' + CAST(@checkupTypeCount AS NVARCHAR) + ' records.';
    
    -- If no data, insert some sample checkup types
    IF @checkupTypeCount = 0
    BEGIN
        PRINT 'Inserting sample checkup types...';
        
        INSERT INTO health_checkup_types (type_name, description, is_required_measurement, is_required_vital_signs, is_required_vision_test, is_required_hearing_test, estimated_duration_minutes, is_active)
        VALUES 
        ('General Physical Examination', 'Comprehensive physical examination including all body systems', 1, 1, 1, 1, 45, 1),
        ('Growth Assessment', 'Height, weight, BMI measurement and growth tracking', 1, 0, 0, 0, 15, 1),
        ('Vital Signs Check', 'Blood pressure, heart rate, temperature, respiratory rate', 0, 1, 0, 0, 10, 1),
        ('Vision Screening', 'Visual acuity testing and eye health assessment', 0, 0, 1, 0, 20, 1),
        ('Hearing Screening', 'Hearing test and audiological assessment', 0, 0, 0, 1, 15, 1),
        ('Dental Examination', 'Oral health checkup and dental screening', 0, 0, 0, 0, 25, 1),
        ('Posture and Scoliosis Screening', 'Spine and posture assessment for scoliosis detection', 0, 0, 0, 0, 20, 1),
        ('Immunization Review', 'Review of vaccination history and immunization status', 0, 0, 0, 0, 10, 1);
        
        PRINT 'Sample checkup types inserted.';
    END
END
ELSE
BEGIN
    PRINT 'WARNING: health_checkup_types table does not exist. Please create it first.';
END

-- Show current data
SELECT 'Current checkup types:' AS Info;
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'health_checkup_types')
BEGIN
    SELECT checkup_type_id, type_name, description, is_active 
    FROM health_checkup_types 
    WHERE is_active = 1
    ORDER BY checkup_type_id;
END

SELECT 'Current health events (HEALTH_CHECKUP only):' AS Info;
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'health_events')
BEGIN
    SELECT event_id, event_name, event_type, scheduled_date, status 
    FROM health_events 
    WHERE event_type = 'HEALTH_CHECKUP'
    ORDER BY scheduled_date DESC;
END

SELECT 'Current junction table data:' AS Info;
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'health_event_checkup_types')
BEGIN
    SELECT hect.event_id, he.event_name, hct.type_name, hect.is_required, hect.sequence_order
    FROM health_event_checkup_types hect
    JOIN health_events he ON hect.event_id = he.event_id
    JOIN health_checkup_types hct ON hect.checkup_type_id = hct.checkup_type_id
    ORDER BY hect.event_id, hect.sequence_order;
END
