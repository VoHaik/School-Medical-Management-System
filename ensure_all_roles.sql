-- Ensure all required roles exist in the database
-- This script should be run on the SQL Server database

-- Check if roles table exists
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'roles')
BEGIN
    CREATE TABLE roles (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        name VARCHAR(20) NOT NULL UNIQUE
    );
END

-- Insert all required roles if they don't exist
DECLARE @roles TABLE (role_name VARCHAR(20))
INSERT INTO @roles VALUES 
    ('ROLE_ADMIN'),
    ('ROLE_MEDICAL_STAFF'),
    ('ROLE_PARENT'),
    ('ROLE_TEACHER'),
    ('ROLE_STUDENT')

-- Insert roles that don't exist
INSERT INTO roles (name)
SELECT r.role_name
FROM @roles r
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = r.role_name)

-- Verify all roles exist
SELECT * FROM roles ORDER BY name;

-- Check if any users with Student role are mapped to wrong roles
SELECT u.username, u.role as user_role, r.name as security_role
FROM users u
LEFT JOIN user_roles ur ON u.user_id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
WHERE u.role = 'Student'
ORDER BY u.username;
