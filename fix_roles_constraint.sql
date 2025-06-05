-- Fix roles table constraint to include ROLE_STUDENT
-- This will allow the roles table to accept ROLE_STUDENT entries

-- Step 1: Drop the existing constraint
ALTER TABLE roles DROP CONSTRAINT CK__roles__name__412EB0B6;

-- Step 2: Add the updated constraint that includes ROLE_STUDENT
ALTER TABLE roles ADD CONSTRAINT CK__roles__name__412EB0B6 
CHECK ([name]='ROLE_TEACHER' OR [name]='ROLE_PARENT' OR [name]='ROLE_MEDICAL_STAFF' OR [name]='ROLE_ADMIN' OR [name]='ROLE_STUDENT');

-- Step 3: Insert ROLE_STUDENT if it doesn't exist
IF NOT EXISTS (SELECT 1 FROM roles WHERE name = 'ROLE_STUDENT')
BEGIN
    INSERT INTO roles (name) VALUES ('ROLE_STUDENT');
    PRINT 'ROLE_STUDENT has been added to the roles table.';
END
ELSE
BEGIN
    PRINT 'ROLE_STUDENT already exists in the roles table.';
END

-- Step 4: Verify the constraint was updated correctly
SELECT 
    TABLE_NAME,
    CONSTRAINT_NAME,
    CHECK_CLAUSE
FROM INFORMATION_SCHEMA.CHECK_CONSTRAINTS 
WHERE CONSTRAINT_NAME = 'CK__roles__name__412EB0B6';

-- Step 5: Verify ROLE_STUDENT exists
SELECT * FROM roles WHERE name = 'ROLE_STUDENT';
