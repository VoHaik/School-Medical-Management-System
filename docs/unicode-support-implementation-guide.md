# Unicode Support Implementation Guide

## Overview

This document provides comprehensive information on implementing full Unicode support (including Vietnamese characters) throughout the School Medical Management System.

## Problem: VARCHAR to NVARCHAR Conversion Issues

### The Issue

Users were experiencing the following error when accessing medication requests:

```
Error: Could not extract column [8] from JDBC ResultSet [The conversion from varchar to NCHAR is unsupported.] [n/a]
```

This error occurs because of a mismatch between:

1. **Java Entity Classes**: Using `@Nationalized` annotation which expects Unicode (NCHAR/NVARCHAR) storage
2. **Database Schema**: Using regular VARCHAR columns which don't properly support Unicode characters

### Impact

The database character encoding mismatch prevents:
- Displaying Vietnamese characters correctly
- Viewing medication requests data
- Saving data with special characters
- Proper functioning of the medication request module

## Solution: Full Unicode Implementation

Our solution encompasses three integrated components:

1. **Java Entity Updates**: Add `@Nationalized` annotations to all String fields
2. **Database Schema Updates**: Convert all VARCHAR columns to NVARCHAR
3. **Application Configuration**: Ensure proper Unicode handling in Spring Boot

## Implementation Steps

We've provided scripts to automate the entire conversion process:

### Step 1: Run the Master Conversion Script

The simplest approach is to run our all-in-one script:

```powershell
# Navigate to scripts directory
cd c:\Users\Khai\Documents\GitHub\School-Medical-Management-System\scripts

# Run the master script
.\full-unicode-conversion.ps1
```

This script will:
- Stop running backend processes
- Add `@Nationalized` annotations to Java entities
- Convert database VARCHAR columns to NVARCHAR
- Rebuild the backend application
- Restart the service

### Step 2: Verify the Changes

After running the conversion script:
1. Wait for the backend to fully start
2. Login to the application
3. Navigate to the Parent Dashboard
4. Access Medication Requests
5. Verify that data displays correctly with no errors

### Manual Implementation (if needed)

If the automated script doesn't work in your environment, follow these steps manually:

#### 1. Add @Nationalized Annotations

Run the annotation script:
```powershell
.\scripts\add-nationalized-annotations.ps1
```

This adds the `@Nationalized` annotation to all String fields in entity classes.

#### 2. Convert Database Columns

Run the SQL script in SQL Server Management Studio:
```sql
-- File location: sql\convert-all-varchar-to-nvarchar.sql
```

This converts all VARCHAR columns to NVARCHAR.

#### 3. Rebuild and Restart

```powershell
cd backend
mvn clean package -DskipTests
java -jar target\SWP391-Project-1.0-SNAPSHOT.jar
```

## Technical Details

### Entity Class Changes

Before:
```java
@Column(name = "medication_name", nullable = false, length = 255)
private String medicationName;
```

After:
```java
@Nationalized
@Column(name = "medication_name", nullable = false, length = 255)
private String medicationName;
```

### Database Column Changes

Before:
```sql
medication_name VARCHAR(255) NOT NULL
```

After:
```sql
medication_name NVARCHAR(255) NOT NULL
```

### Hibernate Settings

The following settings in `application.yaml` ensure proper Unicode handling:

```yaml
spring:
  datasource:
    url: jdbc:sqlserver://localhost:1433;databaseName=HealthSchoolDB;encrypt=true;trustServerCertificate=true;characterEncoding=UTF-8;useUnicode=true
  jpa:
    properties:
      hibernate:
        connection.characterEncoding: UTF-8
        connection.useUnicode: true
```

## Troubleshooting

### Common Issues

1. **Error: "Could not load class org.hibernate.annotations.Nationalized"**
   - Ensure hibernate-core dependency is properly included in pom.xml

2. **Error: "Invalid column name" after conversion**
   - Check for any hardcoded SQL queries that might reference the old column types

3. **Frontend still not displaying characters correctly**
   - Verify that the frontend is set to use UTF-8 encoding
   - Check Content-Type headers in API responses

### Error Logs to Monitor

- Backend application logs for any new exceptions
- Database error logs for conversion issues
- Frontend console logs for character rendering problems

## Support for Future Development

When adding new entity classes or string fields:

1. Always use the `@Nationalized` annotation for String fields
2. Define database columns as NVARCHAR instead of VARCHAR
3. Use proper input validation to handle Unicode character sets

## References

- [Hibernate @Nationalized Documentation](https://docs.jboss.org/hibernate/orm/5.4/javadocs/org/hibernate/annotations/Nationalized.html)
- [SQL Server Unicode Support](https://docs.microsoft.com/en-us/sql/relational-databases/collations/collation-and-unicode-support)
- [Spring Boot Internationalization](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.internationalization)
