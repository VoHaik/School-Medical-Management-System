-- Fix old vaccination events without vaccines
USE HealthSchoolDB;

-- Add default vaccines for old events that don't have any vaccines
-- This ensures all vaccination events have at least one vaccine

-- Add BCG vaccine for event "aaaaaa" (event_id = 1)
INSERT INTO health_event_vaccines (event_id, vaccine_id, dose_number, is_required, notes)
SELECT 1, 1, 1, 1, 'Default BCG vaccine assignment'
WHERE NOT EXISTS (SELECT 1 FROM health_event_vaccines WHERE event_id = 1);

-- Add DPT vaccine for event "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb" (event_id = 2)
INSERT INTO health_event_vaccines (event_id, vaccine_id, dose_number, is_required, notes)
SELECT 2, 2, 1, 1, 'Default DPT vaccine assignment'
WHERE NOT EXISTS (SELECT 1 FROM health_event_vaccines WHERE event_id = 2);

-- Add Polio vaccine for event "cccccccccccccc" (event_id = 3)
INSERT INTO health_event_vaccines (event_id, vaccine_id, dose_number, is_required, notes)
SELECT 3, 3, 1, 1, 'Default Polio vaccine assignment'
WHERE NOT EXISTS (SELECT 1 FROM health_event_vaccines WHERE event_id = 3);

-- Add MMR vaccine for event "zzzz" (event_id = 4)
INSERT INTO health_event_vaccines (event_id, vaccine_id, dose_number, is_required, notes)
SELECT 4, 5, 1, 1, 'Default MMR vaccine assignment'
WHERE NOT EXISTS (SELECT 1 FROM health_event_vaccines WHERE event_id = 4);

-- Add Influenza vaccine for event "yyyy" (event_id = 5)
INSERT INTO health_event_vaccines (event_id, vaccine_id, dose_number, is_required, notes)
SELECT 5, 8, 1, 1, 'Default Influenza vaccine assignment'
WHERE NOT EXISTS (SELECT 1 FROM health_event_vaccines WHERE event_id = 5);

-- Verify results
SELECT 
    he.event_id,
    he.event_name,
    STRING_AGG(v.vaccine_name, ', ') AS vaccines
FROM health_events he
LEFT JOIN health_event_vaccines hev ON he.event_id = hev.event_id
LEFT JOIN vaccines v ON hev.vaccine_id = v.vaccine_id
WHERE he.event_type = 'VACCINATION'
GROUP BY he.event_id, he.event_name
ORDER BY he.event_id;

PRINT 'Fixed old vaccination events with default vaccines!';
