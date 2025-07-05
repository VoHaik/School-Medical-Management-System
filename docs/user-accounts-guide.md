# School Medical Management System - User Account Creation Guide

This document explains how to create user accounts for the School Medical Management System.

## Available Account Types

The provided scripts will create the following user accounts:

1. **Admin Account**
   - Username: `admin.user`
   - Password: `Password123`
   - Role: Administrator
   - Access: Full system access

2. **Nurse Account**
   - Username: `nurse.johnson`
   - Password: `Password123` 
   - Role: School Nurse
   - Access: Medical records, health checkups, medical events

3. **Manager Account**
   - Username: `manager.davis`
   - Password: `Password123`
   - Role: Manager
   - Access: Reports, statistics, content management

4. **Parent Account**
   - Username: `parent.smith`
   - Password: `Password123`
   - Role: Parent
   - Access: Child health records, consent forms, notifications

## Creating the Accounts

### Prerequisites

- SQL Server installed and running
- The `HealthSchoolDB` database created with the schema provided
- SQL Server command-line tools (sqlcmd) installed

### Option 1: Using PowerShell Script

1. Open PowerShell
2. Navigate to the project directory
3. Run the PowerShell script:
   ```powershell
   .\create-users.ps1
   ```
4. Follow any on-screen prompts

### Option 2: Using Batch File

1. Open Command Prompt
2. Navigate to the project directory
3. Run the batch file:
   ```cmd
   create-users.bat
   ```
4. Follow any on-screen prompts

### Option 3: Using SQL Script Directly

1. Open SQL Server Management Studio (SSMS)
2. Connect to your SQL Server instance
3. Open the `create-user-accounts.sql` file
4. Execute the script against your `HealthSchoolDB` database

## Customizing the Scripts

If you need to create different users or modify existing ones:

### SQL Script (`