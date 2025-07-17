-- Create health_event_vaccines junction table for Many-to-Many relationship
-- Remove redundant foreign key from health_events table

USE HealthSchoolDB;

-- Step 1: Create the junction table for health_event_vaccines
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
            FOREIGN KEY (vaccine_id) REFERENCES vaccines(vaccine_id) ON DELETE CASCADE,
            
        -- Unique constraint to prevent duplicate entries
        CONSTRAINT UK_health_event_vaccines_event_vaccine 
            UNIQUE (event_id, vaccine_id)
    );
    
    PRINT 'Created health_event_vaccines junction table';
END
ELSE
BEGIN
    PRINT 'health_event_vaccines table already exists';
END

-- Step 2: Migrate existing data from health_events.vaccine_id to junction table
INSERT INTO health_event_vaccines (event_id, vaccine_id, dose_number, is_required, notes)
SELECT 
    event_id,
    vaccine_id,
    1 as dose_number,
    1 as is_required,
    'Migrated from health_events.vaccine_id' as notes
FROM health_events 
WHERE event_type = 'VACCINATION' 
    AND vaccine_id IS NOT NULL
    AND NOT EXISTS (
        SELECT 1 FROM health_event_vaccines hev 
        WHERE hev.event_id = health_events.event_id 
        AND hev.vaccine_id = health_events.vaccine_id
    );

PRINT 'Migrated existing vaccination events to junction table';

-- Step 3: Check for redundant foreign key constraint
IF EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
    JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu ON tc.CONSTRAINT_NAME = kcu.CONSTRAINT_NAME
    WHERE tc.TABLE_NAME = 'health_events' 
    AND tc.CONSTRAINT_TYPE = 'FOREIGN KEY'
    AND kcu.COLUMN_NAME = 'vaccine_id'
)
BEGIN
    -- Get the constraint name
    DECLARE @ConstraintName NVARCHAR(255);
    SELECT @ConstraintName = tc.CONSTRAINT_NAME 
    FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
    JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu ON tc.CONSTRAINT_NAME = kcu.CONSTRAINT_NAME
    WHERE tc.TABLE_NAME = 'health_events' 
    AND tc.CONSTRAINT_TYPE = 'FOREIGN KEY'
    AND kcu.COLUMN_NAME = 'vaccine_id';
    
    -- Drop the foreign key constraint
    DECLARE @DropSQL NVARCHAR(500) = 'ALTER TABLE health_events DROP CONSTRAINT ' + @ConstraintName;
    EXEC sp_executesql @DropSQL;
    
    PRINT 'Dropped redundant foreign key constraint: ' + @ConstraintName;
END

-- Step 4: Remove the redundant vaccine_id column from health_events
IF EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'health_events' 
    AND COLUMN_NAME = 'vaccine_id'
)
BEGIN
    ALTER TABLE health_events DROP COLUMN vaccine_id;
    PRINT 'Removed redundant vaccine_id column from health_events table';
END
ELSE
BEGIN
    PRINT 'vaccine_id column does not exist in health_events table';
END

-- Step 5: Show the new structure
PRINT 'New structure verification:';

-- Show health_event_vaccines data
SELECT 
    hev.id,
    hev.event_id,
    he.event_name,
    hev.vaccine_id,
    v.vaccine_name,
    hev.dose_number,
    hev.is_required,
    hev.notes
FROM health_event_vaccines hev
JOIN health_events he ON hev.event_id = he.event_id
JOIN vaccines v ON hev.vaccine_id = v.vaccine_id
ORDER BY hev.event_id, hev.vaccine_id;

PRINT 'Migration to Many-to-Many structure completed successfully!';
