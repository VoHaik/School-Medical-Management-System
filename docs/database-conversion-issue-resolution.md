# Database Conversion Issue Resolution Guide

## Overview

This document explains the varchar to NCHAR conversion issue encountered in the medication request functionality and outlines the steps to fix it.

## Problem Description

Users are experiencing an error when trying to access medication requests:

```
Error: Could not extract column [8] from JDBC ResultSet [The conversion from varchar to NCHAR is unsupported.] [n/a]
```

This issue occurs because the Java entity model is using the `@Nationalized` annotation which expects Unicode/NCHAR columns, but the database schema still contains VARCHAR columns that don't support proper Unicode character handling.

## Root Cause

1. The Java entity `MedicationRequest.java` has been updated with `@Nationalized` annotations on string fields to support Unicode characters (like accented letters, special characters, etc.).

2. However, the database schema still has these columns defined as regular VARCHAR instead of NVARCHAR.

3. When Spring Data JPA tries to map the database columns to the entity fields, it encounters a type mismatch between VARCHAR and NCHAR (which is what the `@Nationalized` annotation expects).

## Solution

We've created a comprehensive fix that includes:

1. **SQL Script**: `fix-varchar-nchar-mismatch.sql` - Converts all relevant VARCHAR columns to NVARCHAR in the medication_requests table.

2. **PowerShell Scripts**:
   - `fix-database-conversion-issues.ps1` - Executes the SQL script to fix the database schema.
   - `fix-all-issues.ps1` - One-click solution to fix the database and restart the backend.

3. **Improved Error Handling**: The frontend has been enhanced to:
   - Detect this specific error type
   - Show user-friendly error messages
   - Provide fallback/sample data when the error occurs
   - Display technical hints for administrators

## How to Apply the Fix

### Method 1: Using the automated script (Recommended)

1. Open PowerShell as administrator
2. Navigate to the scripts directory:
   ```powershell
   cd path\to\School-Medical-Management-System\scripts
   ```
3. Run the fix script:
   ```powershell
   .\fix-all-issues.ps1
   ```
4. The script will:
   - Stop any running backend processes
   - Apply the database fixes
   - Restart the backend service

### Method 2: Manual approach

1. Execute the SQL script directly in SQL Server Management Studio:
   ```sql
   -- Path: sql/fix-varchar-nchar-mismatch.sql
   ```

2. Restart the backend application:
   ```powershell
   cd path\to\School-Medical-Management-System\backend
   mvn spring-boot:run
   ```

## Verification

After applying the fix:

1. Navigate to the Parent Dashboard
2. Click "View Medication Requests"
3. Verify that the medication requests load properly without errors
4. Check the medication request details page for a specific request

## Technical Details

The fix converts the following columns from VARCHAR to NVARCHAR:

- medication_name
- dosage
- frequency
- reason
- notes
- administration_notes
- status

This ensures proper Unicode character support that matches the Java entity model's expectations.

## Prevention

To prevent similar issues in the future:

1. Always use NVARCHAR for string columns in SQL Server that might contain Unicode characters
2. Ensure that the database schema matches the entity model annotations
3. Run database migration scripts when entity models are updated with new annotations

## Support

If you encounter any issues with this fix, please contact the system administrator or open a support ticket referencing this document.
