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
    INSERT INTO Users (username, password, user_code, email, phone_number, full_name, role_id)
    VALUES ('admin.user', @PlainTextPassword, 'ADM001', 'admin@schoolhealth.edu', '555-100-1000', 'Admin User', @AdminRoleId);
    PRINT 'Admin account created: admin.user / Password123 (user_code: ADM001)';
END
ELSE
    PRINT 'Admin account already exists';

-- Create Nurse account (if it doesn't exist)
IF NOT EXISTS (SELECT * FROM Users WHERE username = 'nurse.johnson')
BEGIN
    INSERT INTO Users (username, password, user_code, email, phone_number, full_name, role_id)
    VALUES ('nurse.johnson', @PlainTextPassword, 'NUR001', 'nurse.johnson@schoolhealth.edu', '555-200-2000', 'Sarah Johnson', @NurseRoleId);
    PRINT 'Nurse account created: nurse.johnson / Password123 (user_code: NUR001)';
END
ELSE
    PRINT 'Nurse account already exists';

-- Create Manager account (if it doesn't exist)
IF NOT EXISTS (SELECT * FROM Users WHERE username = 'manager.davis')
BEGIN
    INSERT INTO Users (username, password, user_code, email, phone_number, full_name, role_id)
    VALUES ('manager.davis', @PlainTextPassword, 'MGR001', 'manager.davis@schoolhealth.edu', '555-300-3000', 'Michael Davis', @ManagerRoleId);
    PRINT 'Manager account created: manager.davis / Password123 (user_code: MGR001)';
END
ELSE
    PRINT 'Manager account already exists';

-- Create Parent account (if it doesn't exist)
IF NOT EXISTS (SELECT * FROM Users WHERE username = 'parent.smith')
BEGIN
    INSERT INTO Users (username, password, user_code, email, phone_number, full_name, role_id)
    VALUES ('parent.smith', @PlainTextPassword, 'PAR001', 'parent.smith@email.com', '555-400-4000', 'Jennifer Smith', @ParentRoleId);
    PRINT 'Parent account created: parent.smith / Password123 (user_code: PAR001)';
END
ELSE
    PRINT 'Parent account already exists';

-- Step 4: Additional test users for development
PRINT 'Creating additional test users...';

-- Additional Admin user
IF NOT EXISTS (SELECT * FROM Users WHERE username = 'admin.test')
BEGIN
    INSERT INTO Users (username, password, user_code, email, phone_number, full_name, role_id)
    VALUES ('admin.test', @PlainTextPassword, 'ADM002', 'admin.test@schoolhealth.edu', '555-100-1001', 'Test Admin', @AdminRoleId);
    PRINT 'Test Admin account created: admin.test / Password123 (user_code: ADM002)';
END

-- Additional Nurse user
IF NOT EXISTS (SELECT * FROM Users WHERE username = 'nurse.mary')
BEGIN
    INSERT INTO Users (username, password, user_code, email, phone_number, full_name, role_id)
    VALUES ('nurse.mary', @PlainTextPassword, 'NUR002', 'nurse.mary@schoolhealth.edu', '555-200-2001', 'Mary Wilson', @NurseRoleId);
    PRINT 'Additional Nurse account created: nurse.mary / Password123 (user_code: NUR002)';
END

-- Additional Parent users for testing parent registration system
IF NOT EXISTS (SELECT * FROM Users WHERE username = 'parent.jones')
BEGIN
    INSERT INTO Users (username, password, user_code, email, phone_number, full_name, role_id)
    VALUES ('parent.jones', @PlainTextPassword, 'PAR002', 'parent.jones@email.com', '555-400-4001', 'Robert Jones', @ParentRoleId);
    PRINT 'Additional Parent account created: parent.jones / Password123 (user_code: PAR002)';
END

IF NOT EXISTS (SELECT * FROM Users WHERE username = 'parent.brown')
BEGIN
    INSERT INTO Users (username, password, user_code, email, phone_number, full_name, role_id)
    VALUES ('parent.brown', @PlainTextPassword, 'PAR003', 'parent.brown@email.com', '555-400-4002', 'Lisa Brown', @ParentRoleId);
    PRINT 'Additional Parent account created: parent.brown / Password123 (user_code: PAR003)';
END

-- Step 5: Display summary of created accounts
PRINT 'USER ACCOUNTS SUMMARY:';
PRINT '====================';
SELECT 
    u.username, 
    u.user_code,
    u.full_name, 
    u.email,
    u.phone_number,
    r.role_name,
    u.is_active,
    u.created_at
FROM Users u
JOIN Roles r ON u.role_id = r.role_id
WHERE u.username IN (
    'admin.user', 'admin.test',
    'nurse.johnson', 'nurse.mary',
    'manager.davis',
    'parent.smith', 'parent.jones', 'parent.brown'
)
ORDER BY r.role_name, u.username;

-- Step 6: Verification checks
PRINT 'VERIFICATION CHECKS:';
PRINT '===================';

-- Check role distribution
SELECT 
    r.role_name,
    COUNT(u.user_id) as user_count
FROM Roles r
LEFT JOIN Users u ON r.role_id = u.role_id
WHERE r.role_name IN ('Admin', 'SchoolNurse', 'Manager', 'Parent')
GROUP BY r.role_name, r.role_id
ORDER BY r.role_name;

-- Check for any missing user_codes
SELECT 'Users without user_code:' as check_type, COUNT(*) as count
FROM Users 
WHERE user_code IS NULL OR user_code = '';

-- Check for duplicate user_codes
SELECT 'Duplicate user_codes:' as check_type, COUNT(*) as count
FROM (
    SELECT user_code 
    FROM Users 
    WHERE user_code IS NOT NULL 
    GROUP BY user_code 
    HAVING COUNT(*) > 1
) duplicates;

PRINT 'User account creation completed successfully!';
PRINT 'Default password for all accounts: Password123';
PRINT 'Note: Change passwords in production environment and implement proper password hashing.';
GO
