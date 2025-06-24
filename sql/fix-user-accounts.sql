-- Fixed SQL Script with SET QUOTED_IDENTIFIER ON and proper role handling
-- Create School Medical Management System User Accounts

SET QUOTED_IDENTIFIER ON;
GO

USE [HealthSchoolDB]; 
GO

-- Step 1: Make sure required roles exist in the Roles table
-- Check if roles exist
IF NOT EXISTS (SELECT * FROM Roles WHERE role_name = 'Admin')
    INSERT INTO Roles (role_name, description) VALUES ('Admin', 'System administrator with full access');

IF NOT EXISTS (SELECT * FROM Roles WHERE role_name = 'SchoolNurse')
    INSERT INTO Roles (role_name, description) VALUES ('SchoolNurse', 'Medical staff with access to health records');

IF NOT EXISTS (SELECT * FROM Roles WHERE role_name = 'Manager')
    INSERT INTO Roles (role_name, description) VALUES ('Manager', 'School management personnel');

IF NOT EXISTS (SELECT * FROM Roles WHERE role_name = 'Parent')
    INSERT INTO Roles (role_name, description) VALUES ('Parent', 'Parent or guardian of students');

-- Step 2: Create variables for role IDs
DECLARE @AdminRoleId INT,
        @NurseRoleId INT,
        @ManagerRoleId INT,
        @ParentRoleId INT;

-- Get role IDs from the database
SELECT @AdminRoleId = role_id FROM Roles WHERE role_name = 'Admin';
SELECT @NurseRoleId = role_id FROM Roles WHERE role_name = 'SchoolNurse';
SELECT @ManagerRoleId = role_id FROM Roles WHERE role_name = 'Manager';
SELECT @ParentRoleId = role_id FROM Roles WHERE role_name = 'Parent';

-- Step 3: Create the user accounts (password is 'Password123' for all users)
-- Note: Using plain text passwords for testing. In production, use proper password hashing.
DECLARE @PlainTextPassword NVARCHAR(255) = 'Password123'; -- Plain text password for testing

-- Create Admin account (if it doesn't exist)
IF NOT EXISTS (SELECT * FROM Users WHERE username = 'admin.user')
BEGIN
    INSERT INTO Users (username, password, email, phone_number, full_name, role_id)
    VALUES ('admin.user', @PlainTextPassword, 'admin@schoolhealth.edu', '555-100-1000', 'Admin User', @AdminRoleId);
    PRINT 'Admin account created: admin.user / Password123';
END
ELSE
    PRINT 'Admin account already exists';

-- Create Nurse account (if it doesn't exist)
IF NOT EXISTS (SELECT * FROM Users WHERE username = 'nurse.johnson')
BEGIN
    INSERT INTO Users (username, password, email, phone_number, full_name, role_id)
    VALUES ('nurse.johnson', @PlainTextPassword, 'nurse.johnson@schoolhealth.edu', '555-200-2000', 'Sarah Johnson', @NurseRoleId);
    PRINT 'Nurse account created: nurse.johnson / Password123';
END
ELSE
    PRINT 'Nurse account already exists';

-- Create Manager account (if it doesn't exist)
IF NOT EXISTS (SELECT * FROM Users WHERE username = 'manager.davis')
BEGIN
    INSERT INTO Users (username, password, email, phone_number, full_name, role_id)
    VALUES ('manager.davis', @PlainTextPassword, 'manager.davis@schoolhealth.edu', '555-300-3000', 'Michael Davis', @ManagerRoleId);
    PRINT 'Manager account created: manager.davis / Password123';
END
ELSE
    PRINT 'Manager account already exists';

-- Create Parent account (if it doesn't exist)
IF NOT EXISTS (SELECT * FROM Users WHERE username = 'parent.smith')
BEGIN
    INSERT INTO Users (username, password, email, phone_number, full_name, role_id)
    VALUES ('parent.smith', @PlainTextPassword, 'parent.smith@email.com', '555-400-4000', 'Jennifer Smith', @ParentRoleId);
    PRINT 'Parent account created: parent.smith / Password123';
END
ELSE
    PRINT 'Parent account already exists';

-- Display summary of created accounts
SELECT username, full_name, r.role_name 
FROM Users u
JOIN Roles r ON u.role_id = r.role_id
WHERE username IN ('admin.user', 'nurse.johnson', 'manager.davis', 'parent.smith');
GO
