# Health Checkup Events - TEXT to NCHAR Conversion Error - Complete Fix

## Problem Analysis

The error `Could not extract column [4] from JDBC ResultSet [The conversion from text to NCHAR is unsupported.]` occurs when:

1. **Java Entity has `@Nationalized`** (expects NVARCHAR columns)
2. **Database column is still TEXT/VARCHAR/NCHAR** (not NVARCHAR)
3. **Hibernate tries to map the result** and fails due to data type mismatch

## Column [4] Investigation

Based on the `HealthCheckupEvent` entity structure, column [4] (0-based index) is likely:
- Position 0: `event_id` (Integer)
- Position 1: `event_name` (String with @Nationalized)
- Position 2: `event_type` (Enum as String with @Nationalized)
- Position 3: `description` (String with @Nationalized, defined as TEXT)
- **Position 4: `scheduled_date` (LocalDate) - NOT THE ISSUE**

The real issue is likely the **`description` field** which is defined as `columnDefinition = "TEXT"` in the entity but has `@Nationalized` annotation.

## Root Cause

The `description` field in `HealthCheckupEvent` entity:
```java
@Nationalized
@Column(name = "description", columnDefinition = "TEXT")
private String description;
```

This creates a TEXT column in the database, but `@Nationalized` tells Hibernate to expect NVARCHAR. When Hibernate tries to read TEXT data and convert it to the expected NVARCHAR format, SQL Server throws the conversion error.

## Complete Solution

### 1. Fixed Java Entity (Already Done)

Updated `HealthCheckupEvent.java` with proper annotations:
- Added `@Nationalized` to `event_type` enum
- Added `@Nationalized` to `status` enum  
- Added `@Nationalized` to `typesOfCheckups` @ElementCollection
- Kept `@Nationalized` on all String fields

### 2. Database Schema Fix

Run the provided SQL scripts in this order:

#### A. Debug and Identify (Optional)
```sql
-- Run: sql/debug-column-4-issue.sql
-- This helps identify exactly which column is problematic
```

#### B. Emergency Fix (Recommended)
```sql
-- Run: sql/comprehensive-health-checkup-fix.sql
-- This fixes all TEXT/VARCHAR columns in health checkup related tables
```

#### C. Complete System Fix (If needed)
```sql
-- Run: sql/convert-all-to-nvarchar.sql
-- This fixes ALL tables in the database
```

### 3. Key Database Changes Needed

```sql
-- Fix the main problematic column
ALTER TABLE health_checkup_events ALTER COLUMN description NVARCHAR(MAX);

-- Fix other string columns
ALTER TABLE health_checkup_events ALTER COLUMN event_name NVARCHAR(255);
ALTER TABLE health_checkup_events ALTER COLUMN event_type NVARCHAR(50);
ALTER TABLE health_checkup_events ALTER COLUMN location NVARCHAR(255);
ALTER TABLE health_checkup_events ALTER COLUMN status NVARCHAR(50);
ALTER TABLE health_checkup_events ALTER COLUMN target_grade_levels NVARCHAR(255);

-- Fix related tables
ALTER TABLE health_checkup_event_types ALTER COLUMN checkup_type NVARCHAR(100);
ALTER TABLE health_checkup_event_notifications ALTER COLUMN class_id NVARCHAR(50);
```

## Verification Steps

1. **Run the debug script** to confirm column positions and types
2. **Run the fix script** to convert all problematic columns
3. **Test the API endpoint**: `GET /api/health-checkup-events`
4. **Check for remaining issues**: `sql/quick-check-conversion.sql`

## Prevention

1. **Always use `@Nationalized` on String fields** in entities
2. **Avoid `columnDefinition = "TEXT"`** - let Hibernate decide the column type
3. **Use NVARCHAR in database** for all string columns that will store Unicode content
4. **Test API endpoints** after any schema changes

## Files Updated

### Java Files
- `backend/src/main/java/com/swp391_8/schoolhealth/model/HealthCheckupEvent.java`
  - Added `@Nationalized` to enum fields
  - Added `@Nationalized` to @ElementCollection

### SQL Scripts Created
- `sql/debug-column-4-issue.sql` - Debug which column is problematic
- `sql/comprehensive-health-checkup-fix.sql` - Fix all health checkup tables
- `sql/emergency-fix-health-checkup-events.sql` - Quick fix for this specific issue
- `sql/check-health-checkup-events-table.sql` - Verify table structure

## Expected Result

After applying the fix:
- ✅ `GET /api/health-checkup-events` works without errors
- ✅ All string columns are NVARCHAR type
- ✅ Vietnamese/Unicode text saves and displays correctly
- ✅ No more "text to NCHAR conversion" errors

## Test Commands

```bash
# Test the fixed endpoint
curl -X GET "http://localhost:8080/api/health-checkup-events" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Should return JSON array without errors
```

## Emergency Quick Fix

If you need an immediate fix, run this single SQL command:

```sql
USE [HealthSchoolDB];
ALTER TABLE health_checkup_events ALTER COLUMN description NVARCHAR(MAX);
```

This should resolve the immediate error for the `/api/health-checkup-events` endpoint.
