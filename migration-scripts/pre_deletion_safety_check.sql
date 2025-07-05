-- Pre-deletion analysis - Check dependencies and code references
USE HealthSchoolDB;

PRINT '=== CHECKING DEPENDENCIES AND CODE REFERENCES ===';

-- 1. Check foreign key dependencies
PRINT '1. Foreign Key Dependencies:';
SELECT 
    fk.name AS 'Foreign Key Name',
    tp.name AS 'Parent Table',
    cp.name AS 'Parent Column',
    tr.name AS 'Referenced Table',
    cr.name AS 'Referenced Column'
FROM sys.foreign_keys fk
INNER JOIN sys.tables tp ON fk.parent_object_id = tp.object_id
INNER JOIN sys.tables tr ON fk.referenced_object_id = tr.object_id
INNER JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
INNER JOIN sys.columns cp ON fkc.parent_column_id = cp.column_id AND fkc.parent_object_id = cp.object_id
INNER JOIN sys.columns cr ON fkc.referenced_column_id = cr.column_id AND fkc.referenced_object_id = cr.object_id
WHERE tr.name IN (
    'health_checkup_events',
    'health_checkup_event_types', 
    'health_checkup_event_grade_levels',
    'vaccination_events',
    'vaccination_event_grade_levels',
    'student_vaccinations',
    'events'
)
ORDER BY tr.name, tp.name;

-- 2. Check if any tables reference the ones we want to delete
PRINT '2. Tables that reference tables we want to delete:';
SELECT DISTINCT
    OBJECT_NAME(fk.parent_object_id) AS 'Dependent Table',
    OBJECT_NAME(fk.referenced_object_id) AS 'Referenced Table (to be deleted)'
FROM sys.foreign_keys fk
WHERE OBJECT_NAME(fk.referenced_object_id) IN (
    'health_checkup_events',
    'health_checkup_event_types', 
    'health_checkup_event_grade_levels',
    'vaccination_events',
    'vaccination_event_grade_levels', 
    'student_vaccinations',
    'events'
);

-- 3. Check data in tables we plan to keep vs delete
PRINT '3. Data comparison - Keep vs Delete:';

-- Health Events comparison
SELECT 'KEEP: health_events' as table_name, COUNT(*) as record_count, 'HEALTH_CHECKUP events' as event_type
FROM health_events WHERE event_type = 'HEALTH_CHECKUP'
UNION ALL
SELECT 'KEEP: health_events', COUNT(*), 'VACCINATION events'
FROM health_events WHERE event_type = 'VACCINATION'
UNION ALL
SELECT 'DELETE: health_checkup_events', COUNT(*), 'All events'
FROM health_checkup_events
UNION ALL
SELECT 'DELETE: vaccination_events', COUNT(*), 'All events'  
FROM vaccination_events;

-- Grade levels comparison
SELECT 'KEEP: health_event_grade_levels' as table_name, COUNT(*) as record_count
FROM health_event_grade_levels
UNION ALL
SELECT 'DELETE: health_checkup_event_grade_levels', COUNT(*)
FROM health_checkup_event_grade_levels
UNION ALL
SELECT 'DELETE: vaccination_event_grade_levels', COUNT(*)
FROM vaccination_event_grade_levels;

-- 4. Check for any unique data in tables to be deleted
PRINT '4. Checking for unique data in tables to be deleted:';

-- Check if health_checkup_events has data not in health_events
SELECT 'Unique in health_checkup_events:' as info, COUNT(*) as count
FROM health_checkup_events hce
WHERE NOT EXISTS (
    SELECT 1 FROM health_events he 
    WHERE he.event_name = hce.event_name 
    OR (he.description = hce.description AND he.scheduled_date = hce.scheduled_date)
);

-- Check if vaccination_events has data not in health_events
SELECT 'Unique in vaccination_events:' as info, COUNT(*) as count
FROM vaccination_events ve
WHERE NOT EXISTS (
    SELECT 1 FROM health_events he 
    WHERE he.event_name = ve.event_name 
    OR (he.description = ve.description AND he.scheduled_date = ve.scheduled_date)
);

-- 5. Show critical relationships that must be preserved
PRINT '5. Critical relationships to preserve:';

-- Show which health_events have grade levels
SELECT 
    he.event_id,
    he.event_name,
    he.event_type,
    COUNT(hegl.grade_id) as assigned_grades
FROM health_events he
LEFT JOIN health_event_grade_levels hegl ON he.event_id = hegl.event_id
GROUP BY he.event_id, he.event_name, he.event_type
ORDER BY he.event_id;

-- Show which health_events have vaccines
SELECT 
    he.event_id,
    he.event_name,
    he.event_type,
    COUNT(hev.vaccine_id) as assigned_vaccines
FROM health_events he
LEFT JOIN health_event_vaccines hev ON he.event_id = hev.event_id
GROUP BY he.event_id, he.event_name, he.event_type
ORDER BY he.event_id;

-- Show which health_events have vaccination consents
SELECT 
    he.event_id,
    he.event_name,
    he.event_type,
    COUNT(vc.consent_id) as consent_requests
FROM health_events he
LEFT JOIN vaccination_consents vc ON he.event_id = vc.event_id
GROUP BY he.event_id, he.event_name, he.event_type
ORDER BY he.event_id;

PRINT '=== SAFETY CHECK COMPLETED ===';
PRINT 'Review the above results before proceeding with deletion.';
