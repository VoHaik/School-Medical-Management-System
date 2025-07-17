-- Insert sample data for existing health checkup events
PRINT 'Adding sample checkup types to existing health checkup events...';

-- Get existing health checkup events
DECLARE @existingEvents TABLE (event_id INT, event_name NVARCHAR(255));
INSERT INTO @existingEvents (event_id, event_name)
SELECT event_id, event_name 
FROM health_events 
WHERE event_type = 'HEALTH_CHECKUP' 
  AND status IN ('SCHEDULED', 'ACTIVE');

-- Add sample checkup types based on event names
INSERT INTO health_checkup_event_types (event_id, checkup_type)
SELECT event_id, 'General Physical Examination'
FROM @existingEvents
WHERE event_name LIKE '%physical%' OR event_name LIKE '%general%' OR event_name LIKE '%annual%';

INSERT INTO health_checkup_event_types (event_id, checkup_type)
SELECT event_id, 'Vision Test'
FROM @existingEvents;

INSERT INTO health_checkup_event_types (event_id, checkup_type)
SELECT event_id, 'Hearing Test'
FROM @existingEvents
WHERE event_name NOT LIKE '%dental%';

INSERT INTO health_checkup_event_types (event_id, checkup_type)
SELECT event_id, 'Height and Weight Measurement'
FROM @existingEvents;

INSERT INTO health_checkup_event_types (event_id, checkup_type)
SELECT event_id, 'Blood Pressure Check'
FROM @existingEvents
WHERE event_name LIKE '%annual%' OR event_name LIKE '%comprehensive%';

INSERT INTO health_checkup_event_types (event_id, checkup_type)
SELECT event_id, 'Dental Examination'
FROM @existingEvents
WHERE event_name LIKE '%dental%' OR event_name LIKE '%comprehensive%' OR event_name LIKE '%annual%';

-- If no specific matches, add basic checkups to all events
INSERT INTO health_checkup_event_types (event_id, checkup_type)
SELECT e.event_id, 'Basic Health Screening'
FROM @existingEvents e
WHERE NOT EXISTS (
    SELECT 1 FROM health_checkup_event_types hcet 
    WHERE hcet.event_id = e.event_id
);

-- Show results
PRINT 'Sample data added. Summary:';
SELECT 
    he.event_id,
    he.event_name,
    he.scheduled_date,
    STRING_AGG(hcet.checkup_type, ', ') as checkup_types
FROM health_events he
LEFT JOIN health_checkup_event_types hcet ON he.event_id = hcet.event_id
WHERE he.event_type = 'HEALTH_CHECKUP'
GROUP BY he.event_id, he.event_name, he.scheduled_date
ORDER BY he.scheduled_date DESC;

PRINT 'Data population completed successfully!';
