-- Update existing vaccination events to link with appropriate vaccines
USE HealthSchoolDB;

-- Step 1: Update vaccination events based on event name and description patterns
-- This is a smart mapping based on keywords in event names and descriptions

PRINT 'Updating existing vaccination events with vaccine references...';

-- Map events containing "BCG" to BCG Vaccine
UPDATE health_events 
SET vaccine_id = 1 
WHERE event_type = 'VACCINATION' 
AND vaccine_id IS NULL
AND (event_name LIKE '%BCG%' OR description LIKE '%BCG%' OR description LIKE '%tuberculosis%');

-- Map events containing "DPT" or "Diphtheria" to DPT Vaccine  
UPDATE health_events 
SET vaccine_id = 2 
WHERE event_type = 'VACCINATION' 
AND vaccine_id IS NULL
AND (event_name LIKE '%DPT%' OR event_name LIKE '%Diphtheria%' 
     OR description LIKE '%DPT%' OR description LIKE '%diphtheria%' 
     OR description LIKE '%pertussis%' OR description LIKE '%tetanus%');

-- Map events containing "Polio" to Polio Vaccine
UPDATE health_events 
SET vaccine_id = 3 
WHERE event_type = 'VACCINATION' 
AND vaccine_id IS NULL
AND (event_name LIKE '%Polio%' OR description LIKE '%polio%');

-- Map events containing "Measles" (but not MMR) to Measles Vaccine
UPDATE health_events 
SET vaccine_id = 4 
WHERE event_type = 'VACCINATION' 
AND vaccine_id IS NULL
AND (event_name LIKE '%Measles%' OR description LIKE '%measles%')
AND event_name NOT LIKE '%MMR%' AND description NOT LIKE '%MMR%'
AND description NOT LIKE '%mumps%' AND description NOT LIKE '%rubella%';

-- Map events containing "MMR" to MMR Vaccine
UPDATE health_events 
SET vaccine_id = 5 
WHERE event_type = 'VACCINATION' 
AND vaccine_id IS NULL
AND (event_name LIKE '%MMR%' OR description LIKE '%MMR%'
     OR (description LIKE '%measles%' AND description LIKE '%mumps%' AND description LIKE '%rubella%'));

-- Map events containing "Hepatitis B" to Hepatitis B Vaccine
UPDATE health_events 
SET vaccine_id = 6 
WHERE event_type = 'VACCINATION' 
AND vaccine_id IS NULL
AND (event_name LIKE '%Hepatitis B%' OR description LIKE '%hepatitis B%');

-- Map events containing "Japanese Encephalitis" to Japanese Encephalitis Vaccine
UPDATE health_events 
SET vaccine_id = 7 
WHERE event_type = 'VACCINATION' 
AND vaccine_id IS NULL
AND (event_name LIKE '%Japanese Encephalitis%' OR description LIKE '%Japanese Encephalitis%');

-- Map events containing "Influenza" or "Flu" to Influenza Vaccine
UPDATE health_events 
SET vaccine_id = 8 
WHERE event_type = 'VACCINATION' 
AND vaccine_id IS NULL
AND (event_name LIKE '%Influenza%' OR event_name LIKE '%Flu%' 
     OR description LIKE '%influenza%' OR description LIKE '%flu%');

-- Map events containing "Tetanus" (standalone) to Tetanus Vaccine
UPDATE health_events 
SET vaccine_id = 9 
WHERE event_type = 'VACCINATION' 
AND vaccine_id IS NULL
AND (event_name LIKE '%Tetanus%' OR description LIKE '%tetanus%')
AND event_name NOT LIKE '%DPT%' AND description NOT LIKE '%DPT%'
AND description NOT LIKE '%diphtheria%' AND description NOT LIKE '%pertussis%';

-- Map events containing "Varicella" or "Chickenpox" to Varicella Vaccine
UPDATE health_events 
SET vaccine_id = 10 
WHERE event_type = 'VACCINATION' 
AND vaccine_id IS NULL
AND (event_name LIKE '%Varicella%' OR event_name LIKE '%Chickenpox%'
     OR description LIKE '%varicella%' OR description LIKE '%chickenpox%');

-- Step 2: For remaining unmapped vaccination events, assign a default vaccine (e.g., Influenza)
-- This ensures all vaccination events have a vaccine reference
UPDATE health_events 
SET vaccine_id = 8  -- Default to Influenza vaccine
WHERE event_type = 'VACCINATION' 
AND vaccine_id IS NULL;

-- Step 3: Show results
PRINT 'Updated vaccination events with vaccine references:';

SELECT 
    he.event_id,
    he.event_name,
    he.description,
    he.vaccine_id,
    v.vaccine_name,
    v.disease_targeted,
    he.location,
    he.scheduled_date
FROM health_events he
LEFT JOIN vaccines v ON he.vaccine_id = v.vaccine_id
WHERE he.event_type = 'VACCINATION'
ORDER BY he.event_id;

PRINT 'Migration completed successfully! All vaccination events now have vaccine references.';
