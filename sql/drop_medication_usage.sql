-- Script to remove medication_usage table

-- Check if the medication_usage table exists before trying to drop it
IF OBJECT_ID('dbo.medication_usage', 'U') IS NOT NULL
BEGIN
    -- First drop any foreign key constraints that reference this table
    DECLARE @sql NVARCHAR(MAX) = N'';
    
    -- Find all constraints that reference medication_usage table
    SELECT @sql = @sql + N'
    ALTER TABLE ' + QUOTENAME(OBJECT_SCHEMA_NAME(parent_object_id)) + '.' + QUOTENAME(OBJECT_NAME(parent_object_id)) +
    ' DROP CONSTRAINT ' + QUOTENAME(name) + ';'
    FROM sys.foreign_keys
    WHERE referenced_object_id = OBJECT_ID('dbo.medication_usage');
    
    -- Execute the dynamic SQL to drop FK constraints
    IF LEN(@sql) > 0
    BEGIN
        EXEC sp_executesql @sql;
        PRINT 'Foreign key constraints referencing medication_usage have been dropped.'
    END
    
    -- Now drop constraints from the medication_usage table itself
    SET @sql = N'';
    
    SELECT @sql = @sql + N'
    ALTER TABLE dbo.medication_usage DROP CONSTRAINT ' + QUOTENAME(name) + ';'
    FROM sys.foreign_keys
    WHERE parent_object_id = OBJECT_ID('dbo.medication_usage');
    
    -- Execute the dynamic SQL to drop FK constraints
    IF LEN(@sql) > 0
    BEGIN
        EXEC sp_executesql @sql;
        PRINT 'Foreign key constraints of medication_usage have been dropped.'
    END
    
    -- Now drop the medication_usage table
    DROP TABLE dbo.medication_usage;
    PRINT 'Table medication_usage has been dropped.'
END
ELSE
BEGIN
    PRINT 'Table medication_usage does not exist.'
END
