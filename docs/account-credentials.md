# School Medical Management System - Account Credentials

This document provides the login credentials for the predefined accounts in the School Medical Management System.

## Account Credentials

| Role      | Username       | Password    | Access Rights                                  |
|-----------|---------------|-------------|-----------------------------------------------|
| Admin     | admin.user    | Password123 | Full system access, user management           |
| Nurse     | nurse.johnson | Password123 | Medical records, health checkups, medications |
| Manager   | manager.davis | Password123 | Reports, statistics, system configuration     |
| Parent    | parent.smith  | Password123 | Child health records, consent forms           |

## How to Check Database Accounts

To view all accounts currently in the database:

1. Open PowerShell and run:
   ```powershell
   .\list-users.ps1
   ```
   
2. Or use Command Prompt:
   ```cmd
   list-users.bat
   ```

## Security Notice

- These are plain text passwords for testing purposes only
- **WARNING**: Password encryption has been disabled for development/testing
- For production systems, enable BCrypt password encoding and change all passwords
- The system should enforce password changes on first login
- Passwords in production environments should follow your organization's security policies

## Access Instructions

1. Start the application:
   ```
   .\start-frontend.bat
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000/login
   ```

3. Enter the credentials for the desired account role

## Notes

- If you need to create additional users, use the `create-users.ps1` script
- To modify existing users, use SQL Server Management Studio or run SQL commands directly
