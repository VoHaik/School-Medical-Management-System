-- Script to simplify health_event_vaccines table by removing unnecessary columns
-- This will drop dose_number, is_required, and notes columns

USE HealthSchoolDB;
GO

-- Check if the table has any data first
SELECT COUNT(*) as total_records FROM health_event_vaccines;

-- Drop default constraints first
ALTER TABLE health_event_vaccines DROP CONSTRAINT DF__health_ev__dose___3E1D39E1;
ALTER TABLE health_event_vaccines DROP CONSTRAINT DF__health_ev__is_re__3F115E1A;

-- Now drop the unnecessary columns
ALTER TABLE health_event_vaccines 
DROP COLUMN dose_number;

ALTER TABLE health_event_vaccines 
DROP COLUMN is_required;

ALTER TABLE health_event_vaccines 
DROP COLUMN notes;

-- Verify the new structure
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    IS_NULLABLE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'health_event_vaccines' 
ORDER BY ORDINAL_POSITION;

-- The table should now only have: id, event_id, vaccine_id, created_at
PRINT 'health_event_vaccines table has been simplified successfully!';
