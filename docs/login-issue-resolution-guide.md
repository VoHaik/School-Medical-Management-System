# Login Issue Resolution Guide

## Problem Summary

Users were unable to log in with credential sets including `parent.smith` / `Password123`. The login attempts would fail even though the accounts were properly created in the database. 

## Root Causes Identified

1. **Role Name Mismatch**: Spring Security expects role names with the `ROLE_` prefix (e.g., `ROLE_PARENT`), but the database had them stored without the prefix (e.g., `Parent`).

2. **Backend Server Connectivity**: The backend server wasn't properly starting or was running on a different port than expected.

3. **Password Storage**: The system is configured to use plain text passwords in the database (for development only), while other parts of the system might expect encrypted passwords.

## Solutions

### 1. Fix Role Names in the Database

The Spring Security framework is configured to check for roles with the `ROLE_` prefix, but the database had them stored without this prefix. We updated the role names in the database:

```sql
UPDATE Roles SET role_name = 'ROLE_PARENT' WHERE role_name = 'Parent';
UPDATE Roles SET role_name = 'ROLE_ADMIN' WHERE role_name = 'Admin';
UPDATE Roles SET role_name = 'ROLE_NURSE' WHERE role_name = 'SchoolNurse' OR role_name = 'Nurse';
UPDATE Roles SET role_name = 'ROLE_MANAGER' WHERE role_name = 'Manager';
UPDATE Roles SET role_name = 'ROLE_STUDENT' WHERE role_name = 'Student';
```

### 2. Ensure Backend Server is Running

We created tools to properly start the backend server and verify it's running on the correct port (8081 as specified in application.properties). The server needs to be running for login attempts to work.

### 3. Verify Password Handling

The current system is configured to use plain text passwords (as seen in WebSecurityConfig.java with NoOpPasswordEncoder). We verified that the passwords are indeed stored in plain text in the database.

## Login Credentials

After fixing the issues, these credentials should work:

| Username | Password | Role |
|----------|----------|------|
| admin.user | Password123 | ROLE_ADMIN |
| nurse.johnson | Password123 | ROLE_NURSE |
| manager.davis | Password123 | ROLE_MANAGER |
| parent.smith | Password123 | ROLE_PARENT |

## Scripts Created to Help

1. **fix-login-issues.ps1**: A comprehensive script that:
   - Checks SQL Server is running
   - Fixes role names in the database
   - Verifies user account details
   - Restarts the backend server
   - Provides login test instructions

2. **test-login-loop.ps1**: A script that attempts to login with parent.smith/Password123 in a loop until the server is available or maximum attempts are reached.

## Future Recommendations

1. **Password Encryption**: For production use, enable BCrypt password encryption as described in password-encryption-guide.md.

2. **Consistent Role Naming**: Ensure that role names are consistent across the application, using the `ROLE_` prefix everywhere.

3. **Startup Verification**: Add verification steps during application startup to ensure role names match expectations.

4. **Logging Improvements**: Add more detailed logging around authentication failures to make troubleshooting easier.

## How to Fix Login Issues in the Future

If login issues occur again, follow these steps:

1. Run the fix-login-issues.ps1 script
2. If issues persist, check application logs for specific error messages
3. Verify database connection settings in application.properties
4. Ensure the account exists in the database with the correct role name (including the ROLE_ prefix)
5. Restart the backend server after making any changes
