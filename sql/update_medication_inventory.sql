-- Script to update the medication_inventory table to match the revised entity model
-- This script assumes the table already exists with some non-nullable fields

-- First check if prescription_required column exists and set a default value if it does
IF COL_LENGTH('medication_inventory', 'prescription_required') IS NOT NULL
BEGIN
    -- Set default value for existing rows
    UPDATE medication_inventory
    SET prescription_required = 0
    WHERE prescription_required IS NULL;
    
    -- Make the column NOT NULL
    ALTER TABLE medication_inventory
    ALTER COLUMN prescription_required BIT NOT NULL;
END
ELSE
BEGIN
    -- Add the column with a NOT NULL constraint and default value
    ALTER TABLE medication_inventory
    ADD prescription_required BIT NOT NULL DEFAULT(0);
END

-- Check and add other columns if they don't exist
IF COL_LENGTH('medication_inventory', 'manufacturer') IS NULL
BEGIN
    ALTER TABLE medication_inventory
    ADD manufacturer NVARCHAR(255) NULL;
END

IF COL_LENGTH('medication_inventory', 'storage_location') IS NULL
BEGIN
    ALTER TABLE medication_inventory
    ADD storage_location NVARCHAR(100) NULL;
END

IF COL_LENGTH('medication_inventory', 'unit_cost') IS NULL
BEGIN
    ALTER TABLE medication_inventory
    ADD unit_cost FLOAT NULL;
END

IF COL_LENGTH('medication_inventory', 'created_by') IS NULL
BEGIN
    ALTER TABLE medication_inventory
    ADD created_by NVARCHAR(100) NULL;
END

IF COL_LENGTH('medication_inventory', 'updated_by') IS NULL
BEGIN
    ALTER TABLE medication_inventory
    ADD updated_by NVARCHAR(100) NULL;
END

-- Print confirmation message
PRINT 'Database schema updated successfully for medication_inventory table';
