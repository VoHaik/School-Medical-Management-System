-- Query to check health_events table structure and data
SELECT TOP 10 
    event_id,
    event_name,
    event_type,
    description,
    scheduled_date,
    start_date,
    end_date,
    location,
    target_grade_names,
    types_of_checkups,
    created_by_user_name,
    created_at,
    updated_at
FROM health_events
ORDER BY created_at DESC;

-- Check if table exists and has data
SELECT COUNT(*) as total_events FROM health_events;

-- Check target grade names format
SELECT DISTINCT target_grade_names 
FROM health_events 
WHERE target_grade_names IS NOT NULL;
