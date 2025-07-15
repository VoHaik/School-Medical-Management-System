-- Update existing events to have future dates
UPDATE health_events 
SET scheduled_date = '2025-07-15', 
    start_date = '2025-07-15', 
    end_date = '2025-07-15' 
WHERE event_id = 46;

UPDATE health_events 
SET scheduled_date = '2025-07-20', 
    start_date = '2025-07-20', 
    end_date = '2025-07-20' 
WHERE event_id = 48;

UPDATE health_events 
SET scheduled_date = '2025-07-25', 
    start_date = '2025-07-25', 
    end_date = '2025-07-25' 
WHERE event_id = 49;

UPDATE health_events 
SET scheduled_date = '2025-08-01', 
    start_date = '2025-08-01', 
    end_date = '2025-08-01' 
WHERE event_id = 50;

UPDATE health_events 
SET scheduled_date = '2025-08-05', 
    start_date = '2025-08-05', 
    end_date = '2025-08-05' 
WHERE event_id = 51;

-- Check updated events
SELECT event_id, event_name, scheduled_date, start_date, end_date 
FROM health_events 
ORDER BY scheduled_date;
