-- Create simplified junction table for health checkup events and their types
-- Only 2 main fields: event_id and checkup_type (as string)

-- Check if table exists and drop if needed for clean start
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'health_checkup_event_types')
BEGIN
    PRINT 'Dropping existing health_checkup_event_types table...';
    DROP TABLE health_checkup_event_types;
END

-- Create simplified junction table
PRINT 'Creating simplified health_checkup_event_types table...';
CREATE TABLE health_checkup_event_types (
    event_id INT NOT NULL,
    checkup_type NVARCHAR(100) NOT NULL,
    PRIMARY KEY (event_id, checkup_type),
    FOREIGN KEY (event_id) REFERENCES health_events(event_id) ON DELETE CASCADE
);

-- Create index for better performance
CREATE INDEX IX_health_checkup_event_types_event_id ON health_checkup_event_types(event_id);

PRINT 'Simplified health_checkup_event_types table created successfully.';
