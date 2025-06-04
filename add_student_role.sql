-- Add ROLE_STUDENT to the database (SQL Server syntax)
IF NOT EXISTS (SELECT 1 FROM roles WHERE name = 'ROLE_STUDENT')
BEGIN
    INSERT INTO roles (name) VALUES ('ROLE_STUDENT');
END

-- Check existing users table structure first before updating user_roles
IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'user_roles')
BEGIN
    -- Update existing users with Student role to have ROLE_STUDENT
    UPDATE ur
    SET ur.role_id = (SELECT id FROM roles WHERE name = 'ROLE_STUDENT')
    FROM user_roles ur
    INNER JOIN users u ON ur.user_id = u.user_id
    WHERE u.role = 'Student' AND ur.role_id = (SELECT id FROM roles WHERE name = 'ROLE_PARENT');
END
