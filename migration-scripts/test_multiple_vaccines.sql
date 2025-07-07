-- Test script to verify multiple vaccines handling
-- Check event 45 vaccine details
SELECT 
    he.event_id,
    he.event_name,
    he.event_type,
    COUNT(hev.vaccine_id) as vaccine_count,
    STRING_AGG(v.vaccine_name, ', ') as vaccine_names
FROM health_events he 
LEFT JOIN health_event_vaccines hev ON he.event_id = hev.event_id 
LEFT JOIN vaccines v ON hev.vaccine_id = v.vaccine_id 
WHERE he.event_type = 'VACCINATION'
GROUP BY he.event_id, he.event_name, he.event_type
ORDER BY vaccine_count DESC;

-- Check specific event 45
SELECT 
    v.vaccine_id,
    v.vaccine_name,
    hev.created_at
FROM health_event_vaccines hev
JOIN vaccines v ON hev.vaccine_id = v.vaccine_id
WHERE hev.event_id = 45
ORDER BY hev.created_at;
