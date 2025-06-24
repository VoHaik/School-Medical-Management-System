-- Script to fix the created_by and updated_by fields in medication_inventory table

-- Check if the column exists and is INT type
IF EXISTS (
    SELECT * FROM sys.columns c
    INNER JOIN sys.types t ON c.system_type_id = t.system_type_id
    WHERE c.object_id = OBJECT_ID('dbo.medication_inventory')
    AND c.name = 'created_by'
    AND t.name = 'int'
)
BEGIN
    -- Create a temporary column to hold the values as strings
    ALTER TABLE dbo.medication_inventory ADD created_by_new NVARCHAR(100) NULL;
    
    -- Copy data with conversion if possible
    UPDATE dbo.medication_inventory 
    SET created_by_new = CAST(created_by AS NVARCHAR(100))
    WHERE created_by IS NOT NULL;
    
    -- Drop the old column
    ALTER TABLE dbo.medication_inventory DROP COLUMN created_by;
    
    -- Rename the new column to match the original name
    EXEC sp_rename 'dbo.medication_inventory.created_by_new', 'created_by', 'COLUMN';
    
    PRINT 'created_by column fixed - changed from INT to NVARCHAR(100)';
END
ELSE IF NOT EXISTS (
    SELECT * FROM sys.columns c
    WHERE c.object_id = OBJECT_ID('dbo.medication_inventory')
    AND c.name = 'created_by'
)
BEGIN
    -- Add the column if it doesn't exist
    ALTER TABLE dbo.medication_inventory ADD created_by NVARCHAR(100) NULL;
    PRINT 'created_by column added as NVARCHAR(100)';
END
ELSE
BEGIN
    PRINT 'created_by column is already correctly configured';
END

-- Similarly check for updated_by
IF EXISTS (
    SELECT * FROM sys.columns c
    INNER JOIN sys.types t ON c.system_type_id = t.system_type_id
    WHERE c.object_id = OBJECT_ID('dbo.medication_inventory')
    AND c.name = 'updated_by'
    AND t.name = 'int'
)
BEGIN
    -- Create a temporary column to hold the values as strings
    ALTER TABLE dbo.medication_inventory ADD updated_by_new NVARCHAR(100) NULL;
    
    -- Copy data with conversion if possible
    UPDATE dbo.medication_inventory 
    SET updated_by_new = CAST(updated_by AS NVARCHAR(100))
    WHERE updated_by IS NOT NULL;
    
    -- Drop the old column
    ALTER TABLE dbo.medication_inventory DROP COLUMN updated_by;
    
    -- Rename the new column to match the original name
    EXEC sp_rename 'dbo.medication_inventory.updated_by_new', 'updated_by', 'COLUMN';
    
    PRINT 'updated_by column fixed - changed from INT to NVARCHAR(100)';
END
ELSE IF NOT EXISTS (
    SELECT * FROM sys.columns c
    WHERE c.object_id = OBJECT_ID('dbo.medication_inventory')
    AND c.name = 'updated_by'
)
BEGIN
    -- Add the column if it doesn't exist
    ALTER TABLE dbo.medication_inventory ADD updated_by NVARCHAR(100) NULL;
    PRINT 'updated_by column added as NVARCHAR(100)';
END
ELSE
BEGIN
    PRINT 'updated_by column is already correctly configured';
END
