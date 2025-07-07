-- First, ensure grade_levels table has data
-- Insert grade levels if they don't exist
IF NOT EXISTS (SELECT 1 FROM grade_levels WHERE grade_name = 'Grade 1')
BEGIN
    INSERT INTO grade_levels (grade_name, description) VALUES 
    ('Grade 1', 'First Grade'),
    ('Grade 2', 'Second Grade'),
    ('Grade 3', 'Third Grade'),
    ('Grade 4', 'Fourth Grade'),
    ('Grade 5', 'Fifth Grade'),
    ('Grade 6', 'Sixth Grade'),
    ('Grade 7', 'Seventh Grade'),
    ('Grade 8', 'Eighth Grade'),
    ('Grade 9', 'Ninth Grade'),
    ('Grade 10', 'Tenth Grade'),
    ('Grade 11', 'Eleventh Grade'),
    ('Grade 12', 'Twelfth Grade');
END

-- Now link existing health events to grade levels
-- Event 46 (VACCINATION) for Grades 1-3
INSERT INTO health_event_grade_levels (event_id, grade_id)
SELECT 46, grade_id FROM grade_levels WHERE grade_name IN ('Grade 1', 'Grade 2', 'Grade 3');

-- Event 48 (VACCINATION) for Grades 1-2
INSERT INTO health_event_grade_levels (event_id, grade_id)
SELECT 48, grade_id FROM grade_levels WHERE grade_name IN ('Grade 1', 'Grade 2');

-- Event 49 (HEALTH_CHECKUP) for Grades 6-8
INSERT INTO health_event_grade_levels (event_id, grade_id)
SELECT 49, grade_id FROM grade_levels WHERE grade_name IN ('Grade 6', 'Grade 7', 'Grade 8');

-- Event 50 (VACCINATION) for all grades
INSERT INTO health_event_grade_levels (event_id, grade_id)
SELECT 50, grade_id FROM grade_levels;

-- Event 51 (HEALTH_CHECKUP) for Grades 9-12
INSERT INTO health_event_grade_levels (event_id, grade_id)
SELECT 51, grade_id FROM grade_levels WHERE grade_name IN ('Grade 9', 'Grade 10', 'Grade 11', 'Grade 12');

-- Verify the relationships
SELECT 
    he.event_id,
    he.event_name,
    he.event_type,
    gl.grade_name
FROM health_events he
JOIN health_event_grade_levels hegl ON he.event_id = hegl.event_id
JOIN grade_levels gl ON hegl.grade_id = gl.grade_id
ORDER BY he.event_id, gl.grade_name;
