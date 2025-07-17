-- Fix events that don't have vaccines by adding default vaccines
USE HealthSchoolDB;

-- Find vaccination events without vaccines
SELECT 
    he.event_id,
    he.event_name,
    he.description,
    'NO VACCINES' as issue
FROM health_events he
LEFT JOIN health_event_vaccines hev ON he.event_id = hev.event_id
WHERE he.event_type = 'VACCINATION'
AND hev.event_id IS NULL;

-- Add default vaccine (Influenza) for events without vaccines
INSERT INTO health_event_vaccines (event_id, vaccine_id, dose_number, is_required, notes)
SELECT 
    he.event_id,
    8 as vaccine_id, -- Influenza vaccine as default
    1 as dose_number,
    1 as is_required,
    'Default vaccine added - please update with correct vaccines' as notes
FROM health_events he
LEFT JOIN health_event_vaccines hev ON he.event_id = hev.event_id
WHERE he.event_type = 'VACCINATION'
AND hev.event_id IS NULL;

-- Verify fix
SELECT 
    he.event_id,
    he.event_name,
    v.vaccine_name,
    hev.notes
FROM health_events he
JOIN health_event_vaccines hev ON he.event_id = hev.event_id
JOIN vaccines v ON hev.vaccine_id = v.vaccine_id
WHERE he.event_type = 'VACCINATION'
AND hev.notes LIKE '%Default vaccine added%';

PRINT 'Added default vaccines to events that had none';
PRINT 'Please update these events with correct vaccines through the admin interface';
