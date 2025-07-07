-- Check table structures and data in HealthSchoolDB
USE HealthSchoolDB;

-- Check if we're using the correct database
SELECT DB_NAME() AS CurrentDatabase;

-- Check table structures
EXEC sp_help 'health_events';
EXEC sp_help 'health_event_vaccines';
EXEC sp_help 'vaccination_consents';
EXEC sp_help 'students';

-- Check basic counts
SELECT 'health_events' AS TableName, COUNT(*) AS RecordCount FROM health_events
UNION ALL
SELECT 'health_event_vaccines', COUNT(*) FROM health_event_vaccines
UNION ALL
SELECT 'vaccination_consents', COUNT(*) FROM vaccination_consents
UNION ALL
SELECT 'vaccines', COUNT(*) FROM vaccines;

-- Show vaccination events
SELECT TOP 10 * FROM health_events WHERE event_type = 'VACCINATION';

-- Show health_event_vaccines data
SELECT TOP 10 * FROM health_event_vaccines;

-- Show vaccination_consents data
SELECT TOP 10 * FROM vaccination_consents;

PRINT 'Table structure and data check completed!';
