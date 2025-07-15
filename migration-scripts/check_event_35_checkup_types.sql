-- Check the checkup types for event ID 35
SELECT 
    he.event_id,
    he.event_name,
    hect.checkup_type_id,
    hct.type_name,
    hct.description
FROM health_events he
LEFT JOIN health_event_checkup_types hect ON he.event_id = hect.event_id
LEFT JOIN health_checkup_types hct ON hect.checkup_type_id = hct.checkup_type_id
WHERE he.event_id = 35;

-- Also check what checkup types are available in the system
SELECT 
    checkup_type_id,
    type_name,
    description
FROM health_checkup_types
WHERE is_active = 1
ORDER BY checkup_type_id;
