-- Rename health_checkup_events table to health_events
-- This script will rename the table and update all related constraints and references

PRINT 'Starting health_checkup_events to health_events table rename...';

BEGIN TRY
    -- Step 1: Check if the old table exists and new table doesn't exist
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'health_checkup_events')
    AND NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'health_events')
    BEGIN
        PRINT 'Renaming health_checkup_events table to health_events...';
        
        -- Rename the table
        EXEC sp_rename 'health_checkup_events', 'health_events';
        
        PRINT 'Table renamed successfully';
    END
    ELSE
    BEGIN
        IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'health_checkup_events')
            PRINT 'health_checkup_events table does not exist - may have already been renamed';
        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'health_events')
            PRINT 'health_events table already exists';
    END

    -- Step 2: Update foreign key references in student_health_checkups table
    PRINT 'Updating foreign key column references...';
    
    -- Check if the column exists with old name and rename it
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'student_health_checkups' 
               AND COLUMN_NAME = 'health_checkup_event_id')
    AND NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_NAME = 'student_health_checkups' 
                    AND COLUMN_NAME = 'health_event_id')
    BEGIN
        -- First drop any foreign key constraints on the old column
        DECLARE @constraintName NVARCHAR(255);
        SELECT @constraintName = CONSTRAINT_NAME
        FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS rc
        INNER JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu ON rc.CONSTRAINT_NAME = kcu.CONSTRAINT_NAME
        WHERE kcu.TABLE_NAME = 'student_health_checkups' 
        AND kcu.COLUMN_NAME = 'health_checkup_event_id';
        
        IF @constraintName IS NOT NULL
        BEGIN
            EXEC('ALTER TABLE student_health_checkups DROP CONSTRAINT ' + @constraintName);
            PRINT 'Dropped old foreign key constraint: ' + @constraintName;
        END
        
        -- Rename the column
        EXEC sp_rename 'student_health_checkups.health_checkup_event_id', 'health_event_id', 'COLUMN';
        PRINT 'Renamed health_checkup_event_id column to health_event_id';
        
        -- Re-create the foreign key constraint
        ALTER TABLE student_health_checkups 
        ADD CONSTRAINT FK_student_health_checkups_health_event 
        FOREIGN KEY (health_event_id) REFERENCES health_events(event_id);
        PRINT 'Created new foreign key constraint';
    END

    -- Step 3: Update any other related tables that might reference the old table
    -- Add similar logic for other tables if needed

    PRINT 'health_checkup_events to health_events rename completed successfully!';

END TRY
BEGIN CATCH
    PRINT 'Error during table rename: ' + ERROR_MESSAGE();
    THROW;
END CATCH

-- Verify the changes
PRINT 'Verifying table structure:';
SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'health_events'
ORDER BY ORDINAL_POSITION;

PRINT 'Verifying foreign key relationships:';
SELECT 
    fk.name AS ForeignKeyName,
    tp.name AS ParentTable,
    cp.name AS ParentColumn,
    tr.name AS ReferencedTable,
    cr.name AS ReferencedColumn
FROM sys.foreign_keys fk
INNER JOIN sys.tables tp ON fk.parent_object_id = tp.object_id
INNER JOIN sys.tables tr ON fk.referenced_object_id = tr.object_id
INNER JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
INNER JOIN sys.columns cp ON fkc.parent_column_id = cp.column_id AND fkc.parent_object_id = cp.object_id
INNER JOIN sys.columns cr ON fkc.referenced_column_id = cr.column_id AND fkc.referenced_object_id = cr.object_id
WHERE tr.name = 'health_events' OR tp.name IN ('student_health_checkups');
