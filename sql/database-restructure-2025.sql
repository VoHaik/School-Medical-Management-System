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
