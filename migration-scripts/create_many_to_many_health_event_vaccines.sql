-- Create proper Many-to-Many relationship between HealthEvent and Vaccine
USE HealthSchoolDB;

-- Step 1: Create junction table for health_event_vaccines
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'health_event_vaccines')
BEGIN
    CREATE TABLE health_event_vaccines (
        id INT IDENTITY(1,1) PRIMARY KEY,
        event_id INT NOT NULL,
        vaccine_id INT NOT NULL,
        dose_number INT DEFAULT 1,
        is_required BIT DEFAULT 1,
        notes NVARCHAR(500),
        created_at DATETIME2 DEFAULT GETDATE(),
        
        -- Foreign keys
        CONSTRAINT FK_health_event_vaccines_event 
            FOREIGN KEY (event_id) REFERENCES health_events(event_id) ON DELETE CASCADE,
        CONSTRAINT FK_health_event_vaccines_vaccine 
            FOREIGN KEY (vaccine_id) REFERENCES vaccines(vaccine_id),
            
        -- Unique constraint to prevent duplicate vaccine in same event
        CONSTRAINT UQ_health_event_vaccines_event_vaccine 
            UNIQUE (event_id, vaccine_id)
    );
    
    PRINT 'Created health_event_vaccines junction table';
END
ELSE
BEGIN
    PRINT 'health_event_vaccines table already exists';
END

-- Step 2: Remove vaccine_id from health_events if it exists
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'health_events' AND COLUMN_NAME = 'vaccine_id')
BEGIN
    -- First drop foreign key constraint
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE CONSTRAINT_NAME = 'FK_health_events_vaccine')
    BEGIN
        ALTER TABLE health_events DROP CONSTRAINT FK_health_events_vaccine;
        PRINT 'Dropped FK_health_events_vaccine constraint';
    END
    
    -- Drop the column
    ALTER TABLE health_events DROP COLUMN vaccine_id;
    PRINT 'Removed vaccine_id column from health_events';
END

-- Step 3: Clear existing data and create sample events with multiple vaccines
DELETE FROM vaccination_consents WHERE health_event_id IN (SELECT event_id FROM health_events WHERE event_type = 'VACCINATION');
DELETE FROM health_events WHERE event_type = 'VACCINATION';

-- Insert diverse vaccination events
INSERT INTO health_events (event_name, event_type, description, location, scheduled_date, status, created_at, updated_at, created_by_user_id)
VALUES 
-- Multi-vaccine campaign events
('Summer Vaccination Campaign 2025', 'VACCINATION', 'Comprehensive vaccination program for all grade levels', 'School Health Center', '2025-07-10', 'SCHEDULED', GETDATE(), GETDATE(), 1),
('Back-to-School Health Drive', 'VACCINATION', 'Pre-school year vaccination requirements', 'School Health Center', '2025-07-15', 'SCHEDULED', GETDATE(), GETDATE(), 1),
('Grade 1-3 Immunization Program', 'VACCINATION', 'Essential vaccines for primary grade students', 'School Health Center', '2025-07-20', 'SCHEDULED', GETDATE(), GETDATE(), 1),
('Grade 4-6 Health Protection', 'VACCINATION', 'Intermediate grade vaccination schedule', 'School Health Center', '2025-07-25', 'SCHEDULED', GETDATE(), GETDATE(), 1),
('High School Vaccination Update', 'VACCINATION', 'Booster shots and new vaccines for high school students', 'School Health Center', '2025-07-30', 'SCHEDULED', GETDATE(), GETDATE(), 1);

-- Step 4: Get the event IDs for linking vaccines
DECLARE @Event1 INT = (SELECT event_id FROM health_events WHERE event_name = 'Summer Vaccination Campaign 2025');
DECLARE @Event2 INT = (SELECT event_id FROM health_events WHERE event_name = 'Back-to-School Health Drive');
DECLARE @Event3 INT = (SELECT event_id FROM health_events WHERE event_name = 'Grade 1-3 Immunization Program');
DECLARE @Event4 INT = (SELECT event_id FROM health_events WHERE event_name = 'Grade 4-6 Health Protection');
DECLARE @Event5 INT = (SELECT event_id FROM health_events WHERE event_name = 'High School Vaccination Update');

-- Step 5: Link vaccines to events (Many-to-Many relationships)
INSERT INTO health_event_vaccines (event_id, vaccine_id, dose_number, is_required, notes)
VALUES 
-- Summer Campaign (multiple vaccines)
(@Event1, 1, 1, 1, 'BCG for tuberculosis prevention'),
(@Event1, 2, 1, 1, 'DPT primary series'),
(@Event1, 8, 1, 1, 'Annual flu shot'),
(@Event1, 6, 1, 1, 'Hepatitis B series'),

-- Back-to-School Drive (different combination)
(@Event2, 3, 1, 1, 'Polio vaccine requirement'),
(@Event2, 4, 1, 1, 'Measles protection'),
(@Event2, 8, 1, 1, 'Seasonal influenza'),
(@Event2, 10, 1, 1, 'Chickenpox prevention'),

-- Grade 1-3 Program (age-appropriate vaccines)
(@Event3, 1, 1, 1, 'BCG for new students'),
(@Event3, 2, 1, 1, 'DPT first dose'),
(@Event3, 3, 1, 1, 'Polio oral vaccine'),

-- Grade 4-6 Protection (intermediate vaccines)
(@Event4, 5, 1, 1, 'MMR combination vaccine'),
(@Event4, 6, 2, 1, 'Hepatitis B second dose'),
(@Event4, 7, 1, 1, 'Japanese Encephalitis'),

-- High School Update (boosters and new vaccines)
(@Event5, 2, 2, 1, 'DPT booster shot'),
(@Event5, 9, 1, 1, 'Tetanus booster'),
(@Event5, 8, 1, 1, 'Annual flu vaccination'),
(@Event5, 6, 3, 1, 'Hepatitis B final dose');

-- Step 6: Show the results with proper Many-to-Many relationships
SELECT 
    he.event_id,
    he.event_name,
    he.description as event_description,
    he.location,
    he.scheduled_date,
    v.vaccine_id,
    v.vaccine_name,
    v.disease_targeted,
    hev.dose_number,
    hev.is_required,
    hev.notes as vaccine_notes
FROM health_events he
INNER JOIN health_event_vaccines hev ON he.event_id = hev.event_id
INNER JOIN vaccines v ON hev.vaccine_id = v.vaccine_id
WHERE he.event_type = 'VACCINATION'
ORDER BY he.event_id, v.vaccine_id;

-- Summary statistics
SELECT 
    he.event_name,
    COUNT(hev.vaccine_id) as total_vaccines
FROM health_events he
INNER JOIN health_event_vaccines hev ON he.event_id = hev.event_id
WHERE he.event_type = 'VACCINATION'
GROUP BY he.event_id, he.event_name
ORDER BY he.event_name;

PRINT 'Successfully created Many-to-Many relationship between Health Events and Vaccines!';
PRINT 'Each vaccination event can now have multiple vaccines.';
PRINT 'Each vaccine can be part of multiple events.';
