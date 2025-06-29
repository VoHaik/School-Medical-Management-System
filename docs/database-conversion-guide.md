# Database Conversion Guide - Fix "text to NCHAR" Error

## Problem
```
Could not extract column [4] from JDBC ResultSet [The conversion from text to NCHAR is unsupported.] [n/a]
```

## Root Cause
- Java entities have `@Nationalized` annotation (expecting NVARCHAR)
- Database columns are still VARCHAR/TEXT type
- SQL Server cannot auto-convert between these types

## Solution Steps

### Step 1: Backup Database
```sql
BACKUP DATABASE [HealthSchoolDB] 
TO DISK = 'C:\Backup\HealthSchoolDB_backup.bak'
```

### Step 2: Run Conversion Script
Execute the prepared script: `sql/convert-all-to-nvarchar.sql`

```sql
-- Connect to your database and run:
USE HealthSchoolDB;
GO

-- Execute the conversion script
-- (Content is already in convert-all-to-nvarchar.sql)
```

### Step 3: Verify Conversion
```sql
-- Check converted columns
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE DATA_TYPE LIKE 'nvarchar%'
ORDER BY TABLE_NAME, COLUMN_NAME;
```

### Step 4: Test Application
1. Start the application
2. Test Vietnamese input: "Thuốc paracetamol 500mg"
3. Verify data persistence

## Alternative Solutions

### Option A: Remove @Nationalized (NOT RECOMMENDED)
If you cannot modify database, temporarily remove `@Nationalized` annotations.
**WARNING**: This loses Vietnamese support!

### Option B: Hibernate Auto-Update
Set in application.properties:
```properties
spring.jpa.hibernate.ddl-auto=update
```
**WARNING**: May cause data loss in production!

### Option C: Manual Column Fixes
For specific problematic columns only:
```sql
-- Example for specific table
ALTER TABLE Users ALTER COLUMN full_name NVARCHAR(100);
ALTER TABLE Students ALTER COLUMN full_name NVARCHAR(100);
```

## Production Deployment
1. Schedule maintenance window
2. Backup database
3. Run conversion script
4. Test critical functions
5. Monitor for issues

## Rollback Plan
If issues occur:
```sql
-- Restore from backup
RESTORE DATABASE [HealthSchoolDB] 
FROM DISK = 'C:\Backup\HealthSchoolDB_backup.bak'
```
