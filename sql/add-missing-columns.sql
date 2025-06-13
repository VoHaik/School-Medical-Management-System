-- Add missing columns to Students table
-- These columns are defined in the Student entity but missing from the database

-- Add first_name column
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'students' AND COLUMN_NAME = 'first_name')
BEGIN
    ALTER TABLE students ADD first_name NVARCHAR(100) NULL;
END

-- Add last_name column  
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'students' AND COLUMN_NAME = 'last_name')
BEGIN
    ALTER TABLE students ADD last_name NVARCHAR(100) NULL;
END

-- Add parent_user_id column
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'students' AND COLUMN_NAME = 'parent_user_id')
BEGIN
    ALTER TABLE students ADD parent_user_id INT NULL;
    
    -- Add foreign key constraint to Users table
    ALTER TABLE students ADD CONSTRAINT FK_students_parent_user 
    FOREIGN KEY (parent_user_id) REFERENCES users(id);
END

-- Optional: Update existing records to populate first_name and last_name from full_name
-- This is a one-time data migration script
UPDATE students 
SET 
    first_name = CASE 
        WHEN CHARINDEX(' ', full_name) > 0 
        THEN SUBSTRING(full_name, 1, CHARINDEX(' ', full_name) - 1)
        ELSE full_name 
    END,
    last_name = CASE 
        WHEN CHARINDEX(' ', full_name) > 0 
        THEN SUBSTRING(full_name, CHARINDEX(' ', full_name) + 1, LEN(full_name))
        ELSE ''
    END
WHERE first_name IS NULL OR last_name IS NULL;