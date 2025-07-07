-- Migration script to create individual vaccination records for each vaccine in an event
-- This ensures each vaccine can be tracked separately while maintaining event relationship

-- Step 1: Create new records for each vaccine in multi-vaccine events
INSERT INTO student_vaccination_records (
  event_id,
  student_code,
  vaccination_status,
  scheduled_date,
  vaccine_name,
  created_at,
  updated_at
)
SELECT DISTINCT
  svr.event_id,
  svr.student_code,
  svr.vaccination_status,
  svr.scheduled_date,
  TRIM(v.vaccine_name) as vaccine_name,
  NOW() as created_at,
  NOW() as updated_at
FROM student_vaccination_records svr
CROSS JOIN (
  SELECT DISTINCT 
    TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(hev.vaccine_name, ',', numbers.n), ',', -1)) as vaccine_name
  FROM health_event_vaccines hev
  CROSS JOIN (
    SELECT 1 n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5
  ) numbers
  INNER JOIN health_events he ON hev.event_id = he.event_id
  WHERE CHAR_LENGTH(hev.vaccine_name) - CHAR_LENGTH(REPLACE(hev.vaccine_name, ',', '')) >= numbers.n - 1
) v
INNER JOIN health_event_vaccines hev2 ON svr.event_id = hev2.event_id
WHERE svr.vaccine_name IS NULL OR svr.vaccine_name = ''
  AND TRIM(v.vaccine_name) != '';

-- Step 2: Update existing records to use individual vaccine names
UPDATE student_vaccination_records svr
INNER JOIN health_event_vaccines hev ON svr.event_id = hev.event_id
SET svr.vaccine_name = (
  SELECT v.vaccine_name 
  FROM vaccines v 
  WHERE v.vaccine_id = hev.vaccine_id 
  LIMIT 1
)
WHERE svr.vaccine_name IS NULL OR svr.vaccine_name = '';

-- Step 3: Add event_group_id to help group vaccines by event
ALTER TABLE student_vaccination_records 
ADD COLUMN event_group_id VARCHAR(50) GENERATED ALWAYS AS (CONCAT('EVT-', event_id)) STORED;

-- Step 4: Add index for better performance
CREATE INDEX idx_vaccination_records_event_group ON student_vaccination_records(event_group_id);
CREATE INDEX idx_vaccination_records_event_student ON student_vaccination_records(event_id, student_code);
