-- Populate health_event_checkup_types with sample data for existing health checkup events

PRINT 'Populating health_event_checkup_types with sample data...';

-- Get existing health checkup events
DECLARE @healthEvents TABLE (event_id INT, event_name NVARCHAR(255));
INSERT INTO @healthEvents (event_id, event_name)
SELECT event_id, event_name 
FROM health_events 
WHERE event_type = 'HEALTH_CHECKUP' 
  AND status IN ('SCHEDULED', 'ACTIVE');

DECLARE @eventCount INT = (SELECT COUNT(*) FROM @healthEvents);
PRINT 'Found ' + CAST(@eventCount AS VARCHAR) + ' health checkup events to populate.';

-- Get checkup type IDs for easier reference
DECLARE @generalPhysical INT = (SELECT checkup_type_id FROM checkup_types WHERE type_name = 'General Physical Examination');
DECLARE @visionTest INT = (SELECT checkup_type_id FROM checkup_types WHERE type_name = 'Vision Test');
DECLARE @hearingTest INT = (SELECT checkup_type_id FROM checkup_types WHERE type_name = 'Hearing Test');
DECLARE @heightWeight INT = (SELECT checkup_type_id FROM checkup_types WHERE type_name = 'Height and Weight Measurement');
DECLARE @bloodPressure INT = (SELECT checkup_type_id FROM checkup_types WHERE type_name = 'Blood Pressure Check');
DECLARE @dental INT = (SELECT checkup_type_id FROM checkup_types WHERE type_name = 'Dental Examination');
DECLARE @basicScreening INT = (SELECT checkup_type_id FROM checkup_types WHERE type_name = 'Basic Health Screening');

-- Clear existing data first
DELETE FROM health_event_checkup_types;

-- Add checkup types based on event names and patterns
IF @eventCount > 0
BEGIN
    -- For events with "physical" or "annual" or "comprehensive" in name
    INSERT INTO health_event_checkup_types (event_id, checkup_type_id)
    SELECT event_id, @generalPhysical
    FROM @healthEvents
    WHERE event_name LIKE '%physical%' OR event_name LIKE '%annual%' OR event_name LIKE '%comprehensive%';

    -- Add vision test to all events
    INSERT INTO health_event_checkup_types (event_id, checkup_type_id)
    SELECT event_id, @visionTest
    FROM @healthEvents;

    -- Add hearing test to non-dental events
    INSERT INTO health_event_checkup_types (event_id, checkup_type_id)
    SELECT event_id, @hearingTest
    FROM @healthEvents
    WHERE event_name NOT LIKE '%dental%';

    -- Add height/weight to all events
    INSERT INTO health_event_checkup_types (event_id, checkup_type_id)
    SELECT event_id, @heightWeight
    FROM @healthEvents;

    -- Add blood pressure to comprehensive events
    INSERT INTO health_event_checkup_types (event_id, checkup_type_id)
    SELECT event_id, @bloodPressure
    FROM @healthEvents
    WHERE event_name LIKE '%annual%' OR event_name LIKE '%comprehensive%' OR event_name LIKE '%complete%';

    -- Add dental to relevant events
    INSERT INTO health_event_checkup_types (event_id, checkup_type_id)
    SELECT event_id, @dental
    FROM @healthEvents
    WHERE event_name LIKE '%dental%' OR event_name LIKE '%comprehensive%' OR event_name LIKE '%annual%';

    -- For events without any specific checkup types, add basic screening
    INSERT INTO health_event_checkup_types (event_id, checkup_type_id)
    SELECT e.event_id, @basicScreening
    FROM @healthEvents e
    WHERE NOT EXISTS (
        SELECT 1 FROM health_event_checkup_types hect 
        WHERE hect.event_id = e.event_id
    );

    PRINT 'Sample data populated successfully.';
END
ELSE
BEGIN
    PRINT 'No health checkup events found to populate.';
END

-- Show summary of populated data
PRINT 'Population summary:';
SELECT 
    he.event_id,
    he.event_name,
    he.scheduled_date,
    STRING_AGG(ct.type_name, ', ') as checkup_types
FROM health_events he
LEFT JOIN health_event_checkup_types hect ON he.event_id = hect.event_id
LEFT JOIN checkup_types ct ON hect.checkup_type_id = ct.checkup_type_id
WHERE he.event_type = 'HEALTH_CHECKUP'
GROUP BY he.event_id, he.event_name, he.scheduled_date
ORDER BY he.scheduled_date DESC;

PRINT 'Data population completed successfully!';
