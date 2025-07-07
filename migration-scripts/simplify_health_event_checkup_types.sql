-- Simplify health_event_checkup_types table to only essential fields
-- Keep: event_id and checkup_type_id

-- First check if we have a checkup types reference table
PRINT 'Checking for checkup types reference table...';

-- Create simple checkup types table if not exists
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'checkup_types')
BEGIN
    PRINT 'Creating checkup_types reference table...';
    CREATE TABLE checkup_types (
        checkup_type_id INT IDENTITY(1,1) PRIMARY KEY,
        type_name NVARCHAR(100) NOT NULL UNIQUE,
        description NVARCHAR(255),
        created_at DATETIME2 DEFAULT GETDATE()
    );
    
    -- Insert common checkup types
    INSERT INTO checkup_types (type_name, description) VALUES
    ('General Physical Examination', 'Comprehensive physical health checkup'),
    ('Vision Test', 'Eye sight and vision assessment'),
    ('Hearing Test', 'Hearing ability assessment'),
    ('Height and Weight Measurement', 'Growth and development tracking'),
    ('Blood Pressure Check', 'Cardiovascular health monitoring'),
    ('Dental Examination', 'Oral health and dental checkup'),
    ('Basic Health Screening', 'Basic general health screening'),
    ('Vaccination Check', 'Immunization status verification'),
    ('Mental Health Assessment', 'Psychological wellbeing evaluation'),
    ('Sports Physical', 'Sports participation health clearance');
    
    PRINT 'Checkup types reference table created with sample data.';
END
ELSE
BEGIN
    PRINT 'Checkup types reference table already exists.';
END

-- Now simplify the junction table by removing unnecessary columns
PRINT 'Simplifying health_event_checkup_types table...';

-- Backup existing data if any
SELECT * INTO health_event_checkup_types_backup FROM health_event_checkup_types;
PRINT 'Backed up existing data.';

-- Drop and recreate with simple structure
DROP TABLE health_event_checkup_types;

CREATE TABLE health_event_checkup_types (
    event_id INT NOT NULL,
    checkup_type_id INT NOT NULL,
    PRIMARY KEY (event_id, checkup_type_id),
    FOREIGN KEY (event_id) REFERENCES health_events(event_id) ON DELETE CASCADE,
    FOREIGN KEY (checkup_type_id) REFERENCES checkup_types(checkup_type_id) ON DELETE CASCADE
);

-- Create index for better performance
CREATE INDEX IX_health_event_checkup_types_event_id ON health_event_checkup_types(event_id);

PRINT 'Simplified health_event_checkup_types table created successfully.';

-- Restore essential data from backup (event_id and checkup_type_id only)
INSERT INTO health_event_checkup_types (event_id, checkup_type_id)
SELECT DISTINCT event_id, checkup_type_id 
FROM health_event_checkup_types_backup
WHERE event_id IS NOT NULL AND checkup_type_id IS NOT NULL;

PRINT 'Restored essential data from backup.';

-- Show current structure
PRINT 'Current table structure:';
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'health_event_checkup_types'
ORDER BY ORDINAL_POSITION;
