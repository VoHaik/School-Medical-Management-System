-- Initialize Grade Levels Script
-- File: sql/initialize-grade-levels.sql
-- This script creates and populates the grade_levels table with grades 1-12

USE [HealthSchoolDB]
GO

-- Create grade_levels table if it doesn't exist
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'grade_levels')
BEGIN
    PRINT 'Creating grade_levels table...';
    CREATE TABLE grade_levels (
        grade_id INT IDENTITY(1,1) PRIMARY KEY,
        grade_number INT NOT NULL UNIQUE,
        grade_name NVARCHAR(50) NOT NULL,
        vietnamese_name NVARCHAR(50),
        description NVARCHAR(MAX),
        min_age INT,
        max_age INT,
        is_active BIT NOT NULL DEFAULT 1,
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME2 DEFAULT GETDATE()
    );
    PRINT 'Grade levels table created successfully.';
END
ELSE
BEGIN
    PRINT 'Grade levels table already exists.';
END

-- Insert standard grades 1-12 if they don't exist
PRINT 'Inserting grade levels 1-12...';

-- Grade 1
IF NOT EXISTS (SELECT * FROM grade_levels WHERE grade_number = 1)
    INSERT INTO grade_levels (grade_number, grade_name, vietnamese_name, description, min_age, max_age, is_active)
    VALUES (1, 'Grade 1', N'Lớp 1', N'Grade 1 - Primary school', 6, 7, 1);

-- Grade 2
IF NOT EXISTS (SELECT * FROM grade_levels WHERE grade_number = 2)
    INSERT INTO grade_levels (grade_number, grade_name, vietnamese_name, description, min_age, max_age, is_active)
    VALUES (2, 'Grade 2', N'Lớp 2', N'Grade 2 - Primary school', 7, 8, 1);

-- Grade 3
IF NOT EXISTS (SELECT * FROM grade_levels WHERE grade_number = 3)
    INSERT INTO grade_levels (grade_number, grade_name, vietnamese_name, description, min_age, max_age, is_active)
    VALUES (3, 'Grade 3', N'Lớp 3', N'Grade 3 - Primary school', 8, 9, 1);

-- Grade 4
IF NOT EXISTS (SELECT * FROM grade_levels WHERE grade_number = 4)
    INSERT INTO grade_levels (grade_number, grade_name, vietnamese_name, description, min_age, max_age, is_active)
    VALUES (4, 'Grade 4', N'Lớp 4', N'Grade 4 - Primary school', 9, 10, 1);

-- Grade 5
IF NOT EXISTS (SELECT * FROM grade_levels WHERE grade_number = 5)
    INSERT INTO grade_levels (grade_number, grade_name, vietnamese_name, description, min_age, max_age, is_active)
    VALUES (5, 'Grade 5', N'Lớp 5', N'Grade 5 - Primary school', 10, 11, 1);

-- Grade 6
IF NOT EXISTS (SELECT * FROM grade_levels WHERE grade_number = 6)
    INSERT INTO grade_levels (grade_number, grade_name, vietnamese_name, description, min_age, max_age, is_active)
    VALUES (6, 'Grade 6', N'Lớp 6', N'Grade 6 - Secondary school', 11, 12, 1);

-- Grade 7
IF NOT EXISTS (SELECT * FROM grade_levels WHERE grade_number = 7)
    INSERT INTO grade_levels (grade_number, grade_name, vietnamese_name, description, min_age, max_age, is_active)
    VALUES (7, 'Grade 7', N'Lớp 7', N'Grade 7 - Secondary school', 12, 13, 1);

-- Grade 8
IF NOT EXISTS (SELECT * FROM grade_levels WHERE grade_number = 8)
    INSERT INTO grade_levels (grade_number, grade_name, vietnamese_name, description, min_age, max_age, is_active)
    VALUES (8, 'Grade 8', N'Lớp 8', N'Grade 8 - Secondary school', 13, 14, 1);

-- Grade 9
IF NOT EXISTS (SELECT * FROM grade_levels WHERE grade_number = 9)
    INSERT INTO grade_levels (grade_number, grade_name, vietnamese_name, description, min_age, max_age, is_active)
    VALUES (9, 'Grade 9', N'Lớp 9', N'Grade 9 - Secondary school', 14, 15, 1);

-- Grade 10
IF NOT EXISTS (SELECT * FROM grade_levels WHERE grade_number = 10)
    INSERT INTO grade_levels (grade_number, grade_name, vietnamese_name, description, min_age, max_age, is_active)
    VALUES (10, 'Grade 10', N'Lớp 10', N'Grade 10 - High school', 15, 16, 1);

-- Grade 11
IF NOT EXISTS (SELECT * FROM grade_levels WHERE grade_number = 11)
    INSERT INTO grade_levels (grade_number, grade_name, vietnamese_name, description, min_age, max_age, is_active)
    VALUES (11, 'Grade 11', N'Lớp 11', N'Grade 11 - High school', 16, 17, 1);

-- Grade 12
IF NOT EXISTS (SELECT * FROM grade_levels WHERE grade_number = 12)
    INSERT INTO grade_levels (grade_number, grade_name, vietnamese_name, description, min_age, max_age, is_active)
    VALUES (12, 'Grade 12', N'Lớp 12', N'Grade 12 - High school', 17, 18, 1);

PRINT 'Grade levels initialization completed!';

-- Display the inserted grades
SELECT 
    grade_id,
    grade_number,
    grade_name,
    vietnamese_name,
    description,
    min_age,
    max_age,
    is_active,
    created_at
FROM grade_levels 
ORDER BY grade_number;

PRINT 'Grade levels 1-12 are now available in the system.';
