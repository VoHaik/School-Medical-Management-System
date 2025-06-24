-- Script to ensure medication_inventory table has proper NOT NULL constraints
-- for Name, Form, Dosage, Quantity, and Expiry fields

-- Check if the table exists first
IF OBJECT_ID('dbo.medication_inventory', 'U') IS NOT NULL
BEGIN
    -- Ensure medication_name is NOT NULL
    IF EXISTS (
        SELECT * FROM sys.columns 
        WHERE Name = 'medication_name'
            AND Object_ID = OBJECT_ID('dbo.medication_inventory')
            AND is_nullable = 1
    )
    BEGIN
        PRINT 'Updating medication_name to be NOT NULL';
        ALTER TABLE dbo.medication_inventory ALTER COLUMN medication_name NVARCHAR(255) NOT NULL;
    END
    ELSE
    BEGIN
        PRINT 'medication_name is already NOT NULL';
    END
    
    -- Ensure form is NOT NULL
    IF EXISTS (
        SELECT * FROM sys.columns 
        WHERE Name = 'form'
            AND Object_ID = OBJECT_ID('dbo.medication_inventory')
            AND is_nullable = 1
    )
    BEGIN
        PRINT 'Updating form to be NOT NULL';
        ALTER TABLE dbo.medication_inventory ALTER COLUMN form NVARCHAR(50) NOT NULL;
    END
    ELSE
    BEGIN
        PRINT 'form is already NOT NULL';
    END
    
    -- Ensure dosage is NOT NULL
    IF EXISTS (
        SELECT * FROM sys.columns 
        WHERE Name = 'dosage'
            AND Object_ID = OBJECT_ID('dbo.medication_inventory')
            AND is_nullable = 1
    )
    BEGIN
        PRINT 'Updating dosage to be NOT NULL';
        ALTER TABLE dbo.medication_inventory ALTER COLUMN dosage NVARCHAR(100) NOT NULL;
    END
    ELSE
    BEGIN
        PRINT 'dosage is already NOT NULL';
    END
    
    -- Ensure quantity is NOT NULL
    IF EXISTS (
        SELECT * FROM sys.columns 
        WHERE Name = 'quantity'
            AND Object_ID = OBJECT_ID('dbo.medication_inventory')
            AND is_nullable = 1
    )
    BEGIN
        PRINT 'Updating quantity to be NOT NULL';
        ALTER TABLE dbo.medication_inventory ALTER COLUMN quantity INT NOT NULL;
    END
    ELSE
    BEGIN
        PRINT 'quantity is already NOT NULL';
    END
    
    -- Ensure expiry_date is NOT NULL
    IF EXISTS (
        SELECT * FROM sys.columns 
        WHERE Name = 'expiry_date'
            AND Object_ID = OBJECT_ID('dbo.medication_inventory')
            AND is_nullable = 1
    )
    BEGIN
        PRINT 'Updating expiry_date to be NOT NULL';
        ALTER TABLE dbo.medication_inventory ALTER COLUMN expiry_date DATE NOT NULL;
    END
    ELSE
    BEGIN
        PRINT 'expiry_date is already NOT NULL';
    END
    
    -- Make sure all batch_number field is NOT NULL
    UPDATE dbo.medication_inventory 
    SET batch_number = '' 
    WHERE batch_number IS NULL;
    
    PRINT 'All constraints have been verified and applied to medication_inventory table.';
END
ELSE
BEGIN
    PRINT 'Table medication_inventory does not exist!';
END
