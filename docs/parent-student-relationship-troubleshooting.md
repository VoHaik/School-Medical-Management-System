# Parent-Student Relationship Troubleshooting Guide

This document outlines the steps to diagnose and fix issues with parent-student relationships in the School Medical Management System, especially regarding health declaration submissions.

## Common Issue: "You don't have permission to submit health declaration for this student"

This error can occur when there is a mismatch between the parent's authentication details and the parent-student relationship records in the database.

## Root Causes

1. **Inconsistent Authorization Methods**: Multiple methods checking parent-student relationships with slightly different approaches.
2. **Parent Code vs User Code Mismatch**: Parent code in the Parents table might not match the user_code in Users table.
3. **Missing Relationship Records**: No entry in parent_student_relationships table connecting a parent to their student.
4. **Authentication vs Authorization Confusion**: The system might be using username for authentication but parent_code for authorization.

## Fixes Implemented

1. **SecurityService Enhancement**: Updated `isParentOfStudent` method to use the consistent parent code field (username) and same repository method as other checks.
2. **Improved Logging**: Added detailed logging in the HealthDeclarationController to track relationship validation results.
3. **Validation Scripts**: Created SQL scripts to verify and fix parent-student relationship data issues.

## Troubleshooting Steps

### Step 1: Test the Relationship Validation

Run the PowerShell script to test if a parent can submit a health declaration for their child:

```powershell
.\scripts\test-parent-student-relationship.ps1
```

This script will:
- Authenticate the parent user
- Fetch and list their children
- Allow you to select a child
- Test submitting a minimal health declaration
- Show detailed error messages if the submission fails

### Step 2: Check Database Relationships

Run the SQL validation script to check for data inconsistencies:

```powershell
.\scripts\validate-fix-parent-student.ps1
```

This will:
- Check for parent-student relationships in the database
- Identify mismatches between parent_code and user_code
- Look for parents without students or students without parents
- Generate a detailed report for review

### Step 3: Fix Database Issues (if found)

If the validation identifies issues, the fix script can be run to correct them:

1. Review the validation report
2. If necessary, modify the fix script to address specific issues
3. Run the fix script through the validate-fix-parent-student.ps1 script
4. Re-validate to confirm the fixes worked

### Step 4: Check Backend Logs

After fixing the data and restarting the backend:

1. Submit a health declaration again
2. Check the backend logs for detailed information about:
   - The parent's username and user code
   - The student code being submitted
   - Results of all parent-student relationship validation methods

## Prevention

To prevent future occurrences:
1. Use consistent authorization methods throughout the codebase
2. Ensure parent_code and user_code remain synchronized
3. Validate parent-student relationships during account creation
4. Add checks in the user interface to only show students that a parent has access to

## Additional Resources

- See `SecurityService.java` for authorization methods
- Review `ParentStudentRelationshipRepository.java` for database queries
- Check `HealthDeclarationController.java` for permission validation logic

For persistent issues, check for changes in the authentication flow or user account structure that might affect the relationship validation logic.
