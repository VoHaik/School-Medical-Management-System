-- Check if health_checkup_types table exists
SELECT * FROM health_checkup_types;

-- Check if health_event_types relationship table exists
SELECT * FROM health_event_types;

-- Insert sample health checkup types if they don't exist
IF NOT EXISTS (SELECT 1 FROM health_checkup_types WHERE type_name = 'General Physical Examination')
BEGIN
    INSERT INTO health_checkup_types (type_name, description) VALUES
    ('General Physical Examination', 'Comprehensive physical health checkup'),
    ('Vision Test', 'Eye sight and vision assessment'),
    ('Hearing Test', 'Hearing ability assessment'),
    ('Height and Weight Measurement', 'Growth and development tracking'),
    ('Blood Pressure Check', 'Cardiovascular health monitoring'),
    ('Dental Examination', 'Oral health and dental checkup'),
    ('Basic Health Screening', 'Basic general health screening'),
    ('Vaccination Check', 'Immunization status verification'),
    ('Mental Health Assessment', 'Psychological wellbeing evaluation'),
    ('Sports Physical', 'Sports participation health clearance');
END

-- Link health checkup events to checkup types
-- Event 49 (HEALTH_CHECKUP for grades 6-8) - Vision and Hearing Test
INSERT INTO health_event_types (event_id, checkup_type_id, sequence_order)
SELECT 49, checkup_type_id, 1 FROM health_checkup_types WHERE type_name = 'Vision Test';

INSERT INTO health_event_types (event_id, checkup_type_id, sequence_order)
SELECT 49, checkup_type_id, 2 FROM health_checkup_types WHERE type_name = 'Hearing Test';

-- Event 51 (HEALTH_CHECKUP for grades 9-12) - General Physical and Sports Physical
INSERT INTO health_event_types (event_id, checkup_type_id, sequence_order)
SELECT 51, checkup_type_id, 1 FROM health_checkup_types WHERE type_name = 'General Physical Examination';

INSERT INTO health_event_types (event_id, checkup_type_id, sequence_order)
SELECT 51, checkup_type_id, 2 FROM health_checkup_types WHERE type_name = 'Sports Physical';

-- Verify the checkup type relationships
SELECT 
    he.event_id,
    he.event_name,
    hct.type_name,
    het.sequence_order
FROM health_events he
JOIN health_event_types het ON he.event_id = het.event_id
JOIN health_checkup_types hct ON het.checkup_type_id = hct.checkup_type_id
ORDER BY he.event_id, het.sequence_order;
