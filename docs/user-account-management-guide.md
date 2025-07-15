# School Medical Management System - User Account Management Guide

## Introduction

This document provides a complete guide to user accounts management in the School Medical Management System. It includes information about the default accounts, how to verify that they're properly created, and how to log in with them.

## Default User Accounts

The system comes with four pre-configured user accounts representing different roles:

| Role      | Username       | Password    | Access Rights                                  |
|-----------|---------------|-------------|-----------------------------------------------|
| Admin     | admin.user    | Password123 | Full system access, user management           |
| Nurse     | nurse.johnson | Password123 | Medical records, health checkups, medications |
| Manager   | manager.davis | Password123 | Reports, statistics, system configuration     |
| Parent    | parent.smith  | Password123 | Child health records, consent forms           |

## Account Creation Process

The user accounts are created in one of two ways:

1. **Automatic Creation**: When the backend application starts, it automatically checks for and creates default user accounts via the `UserAccountInitializer` class.
2. **Manual Creation**: Using the provided SQL scripts or PowerShell scripts.

### How User Account Initialization Works

The system uses a Spring Boot component called `UserAccountInitializer` that implements `CommandLineRunner` to create default user accounts when the application starts. This ensures that:

- Default roles (Admin, SchoolNurse, Manager, Parent) are created if they don't exist
- Default user accounts with appropriate roles are created if they don't exist
- Existing accounts are not modified or duplicated

The password for all default accounts is "Password123" and is stored in **plain text** for testing purposes. 

**⚠️ SECURITY WARNING**: Password encryption has been disabled for development/testing. In production, enable BCrypt password encoding in the `WebSecurityConfig` class.

## Setting Up User Accounts

### Prerequisites

- SQL Server installed and running
- The database server is accessible (default: localhost:1433)
- Valid database credentials (default: sa/123456)

### Option 1: Let the Backend Application Create Accounts (Recommended)

1. Start the backend application:
   ```
   .\start-backend.bat
   ```
   
2. The application will automatically:
   - Connect to the database
   - Create roles if they don't exist
   - Create default user accounts if they don't exist
   - Log the actions in the application logs

### Option 2: Use the PowerShell Scripts

1. Open PowerShell
2. Run the verification script:
   ```powershell
   .\verify-user-accounts.ps1
   ```
   
3. This script will:
   - Check SQL Server status
   - Check database existence
   - Create user accounts using create-users.ps1
   - List created accounts
   - Test login functionality for all accounts

### Option 3: Use SQL Scripts Directly

1. Open SQL Server Management Studio
2. Connect to your SQL Server
3. Open and execute:
   ```
   create-user-accounts.sql
   ```
4. To verify accounts, execute:
   ```
   list-user-accounts.sql
   ```

## Verifying User Accounts

After creating the accounts, you should verify they are properly created and functional:

1. List all accounts to ensure they exist in the database:
   ```powershell
   .\list-users.ps1
   ```
   
2. Try logging in with each account through:
   - The web interface: http://localhost:3000/login
   - The verification script: .\verify-user-accounts.ps1
   - API testing tools using: POST http://localhost:8080/api/auth/signin

## Security Considerations

- **Change Default Passwords**: In a production environment, require users to change default passwords upon first login
- **Password Policy**: Implement a password policy requiring strong passwords
- **Account Monitoring**: Monitor failed login attempts and implement lockout mechanisms
- **Regular Audits**: Regularly audit user accounts and remove unnecessary access rights

## Troubleshooting

### Common Issues and Solutions

1. **Account doesn't exist in database**
   - Run the create-users.ps1 script to add the missing accounts
   - Check database connection settings

2. **Cannot log in with correct credentials**
   - Verify account exists using list-users.ps1
   - Check if account is marked as active in database
   - Ensure correct role is assigned to the account

3. **Role permissions don't match expectations**
   - Check role assigned to user in database
   - Review permission mappings in system configuration

4. **Database connection errors**
   - Verify SQL Server is running
   - Check connection string in application.properties/application.yaml
   - Ensure database credentials are correct

## Modifying User Accounts

To modify existing user accounts:

1. **Via Admin Interface**: Log in as admin and use the User Management panel
2. **Via SQL**: Use SQL commands to update account details
3. **Via API**: Use the User Management API endpoints

## API References

The system provides the following authentication endpoints:

- **Login**: POST /api/auth/signin
  - Request body: `{"username": "admin.user", "password": "Password123"}`
  - Returns JWT token and user details

- **User Info**: GET /api/auth/me
  - Requires authentication header with JWT token
  - Returns current user details

- **Register User**: POST /api/auth/signup
  - Requires admin permissions
  - Creates a new user account

## Conclusion

User account management is a critical aspect of the School Medical Management System. By following this guide, you can ensure that all required accounts are properly created, maintained, and secured within your installation.

For additional support, please refer to the system documentation or contact technical support.
