-- Database Restructuring Script for School Health System - June 12, 2025

-- 1. Add user_code column to Users table
ALTER TABLE Users
ADD user_code NVARCHAR(50) NULL;

-- Make sure user_code is unique
CREATE UNIQUE INDEX UX_Users_UserCode ON Users(user_code) WHERE user_code IS NOT NULL;

-- Update existing users with unique user codes (for demonstration)
-- In production, you should have a proper way to assign meaningful codes
UPDATE Users SET user_code = 'USER_' + CAST(user_id AS NVARCHAR(10)) WHERE user_code IS NULL;

-- Make user_code NOT NULL after populating existing records
ALTER TABLE Users ALTER COLUMN user_code NVARCHAR(50) NOT NULL;

-- 2. Create Parent table with parent_code
CREATE TABLE Parents (
    parent_id INT IDENTITY(1,1) PRIMARY KEY,
    parent_code NVARCHAR(50) NOT NULL UNIQUE,
    user_id INT NOT NULL UNIQUE,
    address NVARCHAR(255) NULL,
    emergency_contact NVARCHAR(50) NULL,
    relationship_with_student NVARCHAR(50) NULL,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Parents_Users FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- 3. Create Nurse table with nurse_code
CREATE TABLE Nurses (
    nurse_id INT IDENTITY(1,1) PRIMARY KEY,
    nurse_code NVARCHAR(50) NOT NULL UNIQUE,
    user_id INT NOT NULL UNIQUE,
    professional_id NVARCHAR(50) NULL,
    specialization NVARCHAR(100) NULL,
    qualification NVARCHAR(255) NULL,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Nurses_Users FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- 4. Modify Students table to add password for direct login
-- (First, check if password column already exists)
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'Students' AND COLUMN_NAME = 'password')
BEGIN
    ALTER TABLE Students 
    ADD password NVARCHAR(255) NULL;
END

-- 5. Create ParentStudentRelationships intermediate table (if not exists)
-- We'll drop it first if it exists, since we're restructuring it
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'ParentStudentRelationships')
BEGIN
    DROP TABLE ParentStudentRelationships;
END

-- Create new intermediate table with references to parent_code and student_code
CREATE TABLE ParentStudentRelationships (
    relationship_id INT IDENTITY(1,1) PRIMARY KEY,
    parent_code NVARCHAR(50) NOT NULL,
    student_code NVARCHAR(20) NOT NULL,
    relationship_type NVARCHAR(50) NULL,
    created_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_ParentStudentRel_Parents FOREIGN KEY (parent_code) 
        REFERENCES Parents(parent_code) ON UPDATE CASCADE,
    CONSTRAINT FK_ParentStudentRel_Students FOREIGN KEY (student_code) 
        REFERENCES Students(student_code) ON UPDATE CASCADE
);

-- Create index on the relationship for faster lookup
CREATE INDEX IX_ParentStudentRel_ParentStudent ON ParentStudentRelationships(parent_code, student_code);

-- 6. Create trigger to update updated_at columns (for tables with this column)
-- For Students table
CREATE OR ALTER TRIGGER trg_Students_UpdatedAt
ON Students
AFTER UPDATE
AS
BEGIN
    UPDATE Students
    SET updated_at = GETDATE()
    FROM Students s
    INNER JOIN inserted i ON s.student_code = i.student_code;
END;

-- For Parents table
CREATE OR ALTER TRIGGER trg_Parents_UpdatedAt
ON Parents
AFTER UPDATE
AS
BEGIN
    UPDATE Parents
    SET updated_at = GETDATE()
    FROM Parents p
    INNER JOIN inserted i ON p.parent_id = i.parent_id;
END;

-- For Nurses table
CREATE OR ALTER TRIGGER trg_Nurses_UpdatedAt
ON Nurses
AFTER UPDATE
AS
BEGIN
    UPDATE Nurses
    SET updated_at = GETDATE()
    FROM Nurses n
    INNER JOIN inserted i ON n.nurse_id = i.nurse_id;
END;

-- Script to restructure User, Nurse, and Parent table relationships
-- Date: June 13, 2025
-- Version 2: Using prefixes for user_codes of other roles

-- Section 1: Prepare Users table (No changes needed if user_code is already NVARCHAR(50) UNIQUE NOT NULL)

-- Section 2: Update Users.user_code for existing Nurses
PRINT 'Updating user_code for Nurses...';
UPDATE u
SET u.user_code = n.nurse_code
FROM Users u
JOIN Nurses n ON u.user_id = n.user_id
WHERE u.role_id = (SELECT role_id FROM Roles WHERE role_name = 'ROLE_SCHOOLNURSE');

-- Section 3: Update Users.user_code for existing Parents
PRINT 'Updating user_code for Parents...';
UPDATE u
SET u.user_code = p.parent_code
FROM Users u
JOIN Parents p ON u.user_id = p.user_id
WHERE u.role_id = (SELECT role_id FROM Roles WHERE role_name = 'ROLE_PARENT');

-- Section 4: Update Users.user_code for other roles with prefixes

-- Example for Admin users
PRINT 'Updating user_code for Admins...';
DECLARE @AdminRoleName NVARCHAR(50) = 'ROLE_ADMIN'; -- Adjust if your role name is different
DECLARE @AdminPrefix NVARCHAR(10) = 'ADM';
DECLARE @AdminRoleId INT = (SELECT role_id FROM Roles WHERE role_name = @AdminRoleName);

IF @AdminRoleId IS NOT NULL
BEGIN
    WITH AdminUsers AS (
        SELECT
            user_id,
            ROW_NUMBER() OVER (ORDER BY user_id) as rn
        FROM Users
        WHERE role_id = @AdminRoleId
          AND user_code NOT LIKE 'NRS%' -- Avoid re-updating if codes were similar by chance
          AND user_code NOT LIKE 'PAR%'
          AND user_code NOT LIKE @AdminPrefix + '%' -- Avoid re-updating if script is run multiple times
    )
    UPDATE u
    SET u.user_code = @AdminPrefix + RIGHT('000' + CAST(au.rn AS NVARCHAR(10)), 3) -- Generates ADM001, ADM002, etc.
    FROM Users u
    JOIN AdminUsers au ON u.user_id = au.user_id;
END
ELSE
BEGIN
    PRINT 'Admin role not found, skipping user_code update for Admins.';
END

-- Example for Student users
PRINT 'Updating user_code for Students...';
DECLARE @StudentRoleName NVARCHAR(50) = 'ROLE_STUDENT'; -- Adjust if your role name is different
DECLARE @StudentPrefix NVARCHAR(10) = 'STU';
DECLARE @StudentRoleId INT = (SELECT role_id FROM Roles WHERE role_name = @StudentRoleName);

IF @StudentRoleId IS NOT NULL
BEGIN
    WITH StudentUsers AS (
        SELECT
            user_id,
            ROW_NUMBER() OVER (ORDER BY user_id) as rn
        FROM Users
        WHERE role_id = @StudentRoleId
          AND user_code NOT LIKE 'NRS%'
          AND user_code NOT LIKE 'PAR%'
          AND user_code NOT LIKE @StudentPrefix + '%'
    )
    UPDATE u
    SET u.user_code = @StudentPrefix + RIGHT('0000' + CAST(su.rn AS NVARCHAR(10)), 4) -- Generates STU0001, STU0002, etc. (4 digits for students)
    FROM Users u
    JOIN StudentUsers su ON u.user_id = su.user_id;
END
ELSE
BEGIN
    PRINT 'Student role not found, skipping user_code update for Students.';
END

-- Add similar blocks for other roles (e.g., Teacher) if needed, adjusting prefix and number of digits.
-- DECLARE @TeacherRoleName NVARCHAR(50) = 'ROLE_TEACHER';
-- DECLARE @TeacherPrefix NVARCHAR(10) = 'TEA';
-- ... and so on ...

-- Section 5: Remove user_id foreign key from Nurses and Parents tables
PRINT 'Dropping foreign key constraints and user_id columns from Nurses and Parents tables...';
-- Drop foreign key constraints first
IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Nurses_Users')
BEGIN
    ALTER TABLE Nurses DROP CONSTRAINT FK_Nurses_Users;
    PRINT 'Dropped FK_Nurses_Users.';
END

IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Parents_Users')
BEGIN
    ALTER TABLE Parents DROP CONSTRAINT FK_Parents_Users;
    PRINT 'Dropped FK_Parents_Users.';
END

-- Drop the user_id column from Nurses
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Nurses' AND COLUMN_NAME = 'user_id')
BEGIN
    ALTER TABLE Nurses DROP COLUMN user_id;
    PRINT 'Dropped user_id column from Nurses.';
END

-- Drop the user_id column from Parents
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Parents' AND COLUMN_NAME = 'user_id')
BEGIN
    ALTER TABLE Parents DROP COLUMN user_id;
    PRINT 'Dropped user_id column from Parents.';
END

PRINT 'Database restructuring for User, Nurse, Parent relationships (Version 2) completed.';

-- Note: After these changes, ensure your application logic for creating new users
-- correctly generates and assigns user_code according to the new conventions (prefix + sequence).
-- The sequential part of the user_code for new users (ADM00x, STU000x) will need to be handled
-- by application logic (e.g., querying the max current number for that prefix and incrementing).
