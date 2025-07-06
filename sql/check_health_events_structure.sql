-- Check exact structure of health_events table
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'health_events'
ORDER BY ORDINAL_POSITION;

-- Check sample data to see actual column values
SELECT TOP 3 * FROM health_events;
