-- SQL Script to fix varchar to NCHAR conversion issues in medication_requests table

-- First, check if the table exists
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'medication_requests')
BEGIN
    -- Update medication_name column to NVARCHAR if it's not already
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'medication_requests' 
               AND COLUMN_NAME = 'medication_name' 
               AND DATA_TYPE IN ('varchar', 'char'))
    BEGIN
        ALTER TABLE medication_requests
        ALTER COLUMN medication_name NVARCHAR(255) NOT NULL;
        PRINT 'Converted medication_name to NVARCHAR';
    END

    -- Update dosage column to NVARCHAR if it's not already
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'medication_requests' 
               AND COLUMN_NAME = 'dosage' 
               AND DATA_TYPE IN ('varchar', 'char'))
    BEGIN
        ALTER TABLE medication_requests
        ALTER COLUMN dosage NVARCHAR(100) NOT NULL;
        PRINT 'Converted dosage to NVARCHAR';
    END

    -- Update frequency column to NVARCHAR if it's not already
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'medication_requests' 
               AND COLUMN_NAME = 'frequency' 
               AND DATA_TYPE IN ('varchar', 'char'))
    BEGIN
        ALTER TABLE medication_requests
        ALTER COLUMN frequency NVARCHAR(100) NOT NULL;
        PRINT 'Converted frequency to NVARCHAR';
    END

    -- Update reason column to NVARCHAR(MAX) if it's not already
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'medication_requests' 
               AND COLUMN_NAME = 'reason' 
               AND DATA_TYPE IN ('varchar', 'char', 'text'))
    BEGIN
        ALTER TABLE medication_requests
        ALTER COLUMN reason NVARCHAR(MAX) NOT NULL;
        PRINT 'Converted reason to NVARCHAR(MAX)';
    END

    -- Update notes column to NVARCHAR(MAX) if it's not already and if it exists
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'medication_requests' 
               AND COLUMN_NAME = 'notes' 
               AND DATA_TYPE IN ('varchar', 'char', 'text'))
    BEGIN
        ALTER TABLE medication_requests
        ALTER COLUMN notes NVARCHAR(MAX) NULL;
        PRINT 'Converted notes to NVARCHAR(MAX)';
    END

    -- Update administration_notes column to NVARCHAR(MAX) if it's not already and if it exists
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'medication_requests' 
               AND COLUMN_NAME = 'administration_notes' 
               AND DATA_TYPE IN ('varchar', 'char', 'text'))
    BEGIN
        ALTER TABLE medication_requests
        ALTER COLUMN administration_notes NVARCHAR(MAX) NULL;
        PRINT 'Converted administration_notes to NVARCHAR(MAX)';
    END

    -- Check and fix status column if needed
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'medication_requests' 
               AND COLUMN_NAME = 'status' 
               AND DATA_TYPE IN ('varchar', 'char'))
    BEGIN
        ALTER TABLE medication_requests
        ALTER COLUMN status NVARCHAR(50) NOT NULL;
        PRINT 'Converted status to NVARCHAR(50)';
    END

    PRINT 'Database schema update completed successfully.';
END
ELSE
BEGIN
    PRINT 'Table medication_requests does not exist.';
END
