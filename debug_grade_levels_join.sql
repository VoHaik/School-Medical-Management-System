-- Debug script to check health_event_grade_levels table and joins

-- First, check if health_event_grade_levels table has data
SELECT COUNT(*) as total_records FROM health_event_grade_levels;

-- Check all records in health_event_grade_levels table
SELECT * FROM health_event_grade_levels ORDER BY event_id, grade_id;

-- Check vaccination events and their associated grade levels
SELECT 
    he.event_id,
    he.event_name,  
    he.event_type,
    he.status,
    hegl.grade_id,
    gl.grade_name
FROM health_events he
LEFT JOIN health_event_grade_levels hegl ON he.event_id = hegl.event_id
LEFT JOIN grade_levels gl ON hegl.grade_id = gl.grade_id
WHERE he.event_type = 'VACCINATION'
ORDER BY he.event_id, gl.grade_name;

-- Check for recent vaccination events specifically
SELECT 
    he.event_id,
    he.event_name,  
    he.event_type,
    he.status,
    he.created_date,
    COUNT(hegl.grade_id) as grade_count
FROM health_events he
LEFT JOIN health_event_grade_levels hegl ON he.event_id = hegl.event_id
WHERE he.event_type = 'VACCINATION'
  AND he.created_date >= DATEADD(day, -7, GETDATE())  -- Last 7 days
GROUP BY he.event_id, he.event_name, he.event_type, he.status, he.created_date
ORDER BY he.created_date DESC;

-- Test the exact query from GradeLevelRepository
DECLARE @eventId INT = (SELECT TOP 1 event_id FROM health_events WHERE event_type = 'VACCINATION' ORDER BY created_date DESC);
SELECT @eventId as test_event_id;

SELECT gl.* FROM grade_levels gl 
INNER JOIN health_event_grade_levels hegl ON gl.grade_id = hegl.grade_id 
WHERE hegl.event_id = @eventId;
