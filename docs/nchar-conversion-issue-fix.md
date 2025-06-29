# NCHAR to NVARCHAR Conversion Issue Fix

## Problem Description

The system encountered the following error when trying to save health checkup events:

```
Could not extract column [4] from JDBC ResultSet [The conversion from text to NCHAR is unsupported.] [n/a]
```

This error occurs because the `target_grade_levels` column in the `health_checkup_events` table is defined as `NCHAR`, which is not compatible with the TEXT format data being sent from the frontend.

## Solution

We've implemented the following changes to fix this issue:

1. Changed the database column type from `NCHAR` to `NVARCHAR(255)` to better handle Unicode strings
2. Updated the entity mapping to ensure proper handling of the string data
3. Modified the frontend form to properly format the grade levels as a comma-separated string

## How to Apply the Fix

### Option 1: Run the Automated Script

1. Navigate to the `scripts` directory
2. Run the `fix-nchar-issue.bat` file (Windows) or `fix-nchar-issue.ps1` (PowerShell)

### Option 2: Manual Database Update

Execute the following SQL statement in your database management tool:

```sql
-- First backup the existing data
SELECT * INTO health_checkup_events_backup FROM health_checkup_events;

-- Alter the column type
ALTER TABLE health_checkup_events
ALTER COLUMN target_grade_levels NVARCHAR(255);
```

### Frontend Changes

The frontend has already been updated to ensure that:

1. The `targetGradeLevels` field is properly formatted as a comma-separated string
2. Form validation and submission handle the data correctly
3. Console logging for debugging is in place

## Verification

After applying the fix:

1. Restart your Spring Boot application
2. Try creating a new health checkup event with selected grade levels
3. Check if the event is saved correctly in the database

## Technical Details

The root cause was a mismatch between:
- Database column type: `NCHAR` (fixed-length Unicode character data)
- Actual data format: Text or variable-length string data

`NVARCHAR` is more appropriate for this use case as it handles variable-length Unicode strings efficiently.

If you continue experiencing issues, please check:
1. Spring entity mappings in `HealthCheckupEvent.java`
2. Data format in the frontend form submission
3. Database connection settings and character encoding
