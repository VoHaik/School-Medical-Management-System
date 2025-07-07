-- Modify student_vaccination_records table
-- Remove unnecessary columns and add next_due column

USE HealthSchoolDB;

-- First, check if the columns exist before dropping them
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'student_vaccination_records' AND COLUMN_NAME = 'administration_site')
BEGIN
    ALTER TABLE student_vaccination_records DROP COLUMN administration_site;
    PRINT 'Dropped administration_site column';
END

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'student_vaccination_records' AND COLUMN_NAME = 'vaccine_batch')
BEGIN
    ALTER TABLE student_vaccination_records DROP COLUMN vaccine_batch;
    PRINT 'Dropped vaccine_batch column';
END

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'student_vaccination_records' AND COLUMN_NAME = 'vaccine_manufacturer')
BEGIN
    ALTER TABLE student_vaccination_records DROP COLUMN vaccine_manufacturer;
    PRINT 'Dropped vaccine_manufacturer column';
END

-- Add next_due_date column if it doesn't exist
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'student_vaccination_records' AND COLUMN_NAME = 'next_due_date')
BEGIN
    ALTER TABLE student_vaccination_records ADD next_due_date DATE NULL;
    PRINT 'Added next_due_date column';
END

-- Verify the changes
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'student_vaccination_records'
ORDER BY ORDINAL_POSITION;

PRINT 'Table modification completed successfully';
