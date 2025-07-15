-- Add sample checkup types to existing health checkup events
USE HealthSchoolDB;

-- Check if we have health checkup events and checkup types
DECLARE @healthEventCount INT = (SELECT COUNT(*) FROM health_events WHERE event_type = 'HEALTH_CHECKUP');
DECLARE @checkupTypeCount INT = 0;

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'health_checkup_types')
    SET @checkupTypeCount = (SELECT COUNT(*) FROM health_checkup_types WHERE is_active = 1);

PRINT 'Found ' + CAST(@healthEventCount AS NVARCHAR) + ' health checkup events';
PRINT 'Found ' + CAST(@checkupTypeCount AS NVARCHAR) + ' active checkup types';

-- If we have both health events and checkup types, create associations
IF @healthEventCount > 0 AND @checkupTypeCount > 0 AND EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'health_event_checkup_types')
BEGIN
    -- Clear existing associations to avoid duplicates
    DELETE FROM health_event_checkup_types 
    WHERE event_id IN (SELECT event_id FROM health_events WHERE event_type = 'HEALTH_CHECKUP');
    
    -- Add comprehensive checkup types to each health checkup event
    INSERT INTO health_event_checkup_types (event_id, checkup_type_id, is_required, sequence_order, notes)
    SELECT 
        he.event_id,
        hct.checkup_type_id,
        CASE 
            WHEN hct.type_name IN ('General Physical Examination', 'Growth Assessment', 'Vital Signs Check') THEN 1 
            ELSE 0 
        END as is_required,
        ROW_NUMBER() OVER (PARTITION BY he.event_id ORDER BY hct.checkup_type_id) as sequence_order,
        CASE 
            WHEN hct.type_name = 'General Physical Examination' THEN 'Comprehensive health assessment'
            WHEN hct.type_name = 'Growth Assessment' THEN 'Height, weight and BMI tracking'
            WHEN hct.type_name = 'Vision Screening' THEN 'Eye health and visual acuity check'
            WHEN hct.type_name = 'Hearing Screening' THEN 'Hearing test and assessment'
            WHEN hct.type_name = 'Dental Examination' THEN 'Oral health and dental check'
            ELSE 'Standard health screening'
        END as notes
    FROM health_events he
    CROSS JOIN health_checkup_types hct
    WHERE he.event_type = 'HEALTH_CHECKUP' 
      AND hct.is_active = 1
      AND hct.type_name IN (
          'General Physical Examination',
          'Growth Assessment', 
          'Vital Signs Check',
          'Vision Screening',
          'Hearing Screening',
          'Dental Examination'
      );
    
    PRINT 'Added checkup types to health checkup events.';
    
    -- Show what was created
    SELECT 
        he.event_name,
        he.scheduled_date,
        COUNT(hect.checkup_type_id) as checkup_types_count,
        STRING_AGG(hct.type_name, ', ') as checkup_types
    FROM health_events he
    LEFT JOIN health_event_checkup_types hect ON he.event_id = hect.event_id
    LEFT JOIN health_checkup_types hct ON hect.checkup_type_id = hct.checkup_type_id
    WHERE he.event_type = 'HEALTH_CHECKUP'
    GROUP BY he.event_id, he.event_name, he.scheduled_date
    ORDER BY he.scheduled_date DESC;
END
ELSE
BEGIN
    IF @healthEventCount = 0
        PRINT 'No health checkup events found.';
    IF @checkupTypeCount = 0
        PRINT 'No active checkup types found.';
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'health_event_checkup_types')
        PRINT 'Junction table health_event_checkup_types does not exist.';
END
