-- Check if health_event_grade_levels table exists and has data
SELECT * FROM health_event_grade_levels;

-- Check grade_levels table
SELECT * FROM grade_levels;

-- Check if any events have target grades
SELECT 
    he.event_id,
    he.event_name,
    COUNT(hegl.grade_id) as grade_count
FROM health_events he
LEFT JOIN health_event_grade_levels hegl ON he.event_id = hegl.event_id
GROUP BY he.event_id, he.event_name
ORDER BY he.event_id;
