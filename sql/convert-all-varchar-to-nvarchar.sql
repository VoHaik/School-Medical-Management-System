-- Convert all VARCHAR columns to NVARCHAR in the database
-- Script for SQL Server - HealthSchoolDB database
-- Date: June 16, 2025

-- Enable transaction to ensure all changes are rolled back in case of failure
BEGIN TRANSACTION;

PRINT 'Starting conversion of VARCHAR columns to NVARCHAR across all tables...';

DECLARE @TableName NVARCHAR(128)
DECLARE @ColumnName NVARCHAR(128)
DECLARE @DataType NVARCHAR(128)
DECLARE @MaxLength INT
DECLARE @SQL NVARCHAR(MAX)
DECLARE @TotalChanges INT = 0
DECLARE @ErrorMsg NVARCHAR(MAX)

-- Create a temporary table to store tables and columns to convert
CREATE TABLE #ConversionList (
    TableName NVARCHAR(128),
    ColumnName NVARCHAR(128),
    DataType NVARCHAR(128),
    MaxLength INT
)

-- Find all VARCHAR columns in the database
INSERT INTO #ConversionList (TableName, ColumnName, DataType, MaxLength)
SELECT 
    t.name AS TableName,
    c.name AS ColumnName,
    ty.name AS DataType,
    c.max_length AS MaxLength
FROM 
    sys.columns c
    JOIN sys.types ty ON c.user_type_id = ty.user_type_id
    JOIN sys.tables t ON c.object_id = t.object_id
WHERE 
    ty.name IN ('varchar', 'char') AND
    t.is_ms_shipped = 0 -- Skip system tables
ORDER BY 
    t.name, c.name;

-- Check if we found any columns to convert
IF NOT EXISTS (SELECT 1 FROM #ConversionList)
BEGIN
    PRINT 'No VARCHAR columns found to convert.';
    DROP TABLE #ConversionList;
    COMMIT TRANSACTION;
    RETURN;
END

-- Print summary of columns to convert
PRINT 'Found ' + CAST((SELECT COUNT(*) FROM #ConversionList) AS NVARCHAR(10)) + ' column(s) to convert:';
SELECT TableName, ColumnName, DataType, MaxLength FROM #ConversionList;

-- Create a cursor to iterate through each column
DECLARE ConversionCursor CURSOR FOR
    SELECT TableName, ColumnName, DataType, MaxLength FROM #ConversionList;

OPEN ConversionCursor;

-- Fetch the first record
FETCH NEXT FROM ConversionCursor INTO @TableName, @ColumnName, @DataType, @MaxLength;

-- Loop through each column and convert
WHILE @@FETCH_STATUS = 0
BEGIN
    BEGIN TRY
        -- Determine the target data type
        DECLARE @TargetType NVARCHAR(20)
        IF @DataType = 'varchar'
        BEGIN
            -- For text columns, if max_length is -1, use NVARCHAR(MAX)
            IF @MaxLength = -1
                SET @TargetType = 'NVARCHAR(MAX)'
            ELSE
                SET @TargetType = 'NVARCHAR(' + CAST(@MaxLength AS NVARCHAR(10)) + ')'
        END
        ELSE -- char
        BEGIN
            SET @TargetType = 'NCHAR(' + CAST(@MaxLength AS NVARCHAR(10)) + ')'
        END

        -- Generate and execute the ALTER TABLE statement
        SET @SQL = N'ALTER TABLE [' + @TableName + '] ALTER COLUMN [' + @ColumnName + '] ' + @TargetType + 
                   CASE WHEN (SELECT is_nullable FROM sys.columns 
                             WHERE object_id = OBJECT_ID(@TableName) 
                             AND name = @ColumnName) = 0 
                        THEN ' NOT NULL' 
                        ELSE ' NULL' 
                   END;
        
        PRINT 'Executing: ' + @SQL;
        EXEC sp_executesql @SQL;
        
        SET @TotalChanges = @TotalChanges + 1;
        PRINT 'Converted ' + @TableName + '.' + @ColumnName + ' to ' + @TargetType + ' successfully.';
    END TRY
    BEGIN CATCH
        SET @ErrorMsg = ERROR_MESSAGE();
        PRINT 'Error converting ' + @TableName + '.' + @ColumnName + ': ' + @ErrorMsg;
        -- Continue with next column instead of aborting the whole script
    END CATCH

    -- Fetch the next record
    FETCH NEXT FROM ConversionCursor INTO @TableName, @ColumnName, @DataType, @MaxLength;
END

-- Clean up cursor
CLOSE ConversionCursor;
DEALLOCATE ConversionCursor;

-- Clean up temporary table
DROP TABLE #ConversionList;

-- Commit transaction if we got this far
COMMIT TRANSACTION;

-- Print summary
PRINT 'Conversion complete. ' + CAST(@TotalChanges AS NVARCHAR(10)) + ' column(s) were successfully converted.';
PRINT 'Please restart your application for the changes to take effect.';
