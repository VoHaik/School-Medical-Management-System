-- Add vaccine_id column to health_events table for vaccination events
-- This allows vaccination events to reference specific vaccines

USE HealthSchoolDB;

-- Step 1: Add vaccine_id column to health_events table
IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'health_events' 
    AND COLUMN_NAME = 'vaccine_id'
)
BEGIN
    ALTER TABLE health_events
    ADD vaccine_id INT;
    
    -- Add foreign key constraint
    ALTER TABLE health_events
    ADD CONSTRAINT FK_health_events_vaccine
    FOREIGN KEY (vaccine_id) REFERENCES vaccines(vaccine_id);
    
    PRINT 'Added vaccine_id column to health_events table';
END
ELSE
BEGIN
    PRINT 'vaccine_id column already exists in health_events table';
END

-- Step 2: Check current vaccination events
SELECT 
    event_id,
    event_name,
    event_type,
    description,
    vaccine_id,
    location,
    scheduled_date
FROM health_events 
WHERE event_type = 'VACCINATION'
ORDER BY event_id;

-- Step 3: Check available vaccines
SELECT 
    vaccine_id,
    vaccine_name,
    disease_targeted,
    description
FROM vaccines
ORDER BY vaccine_id;

PRINT 'Migration completed successfully!';
PRINT 'Next steps:';
PRINT '1. Update existing vaccination events to link to appropriate vaccines';
PRINT '2. For new vaccination events, always set vaccine_id when event_type = VACCINATION';
