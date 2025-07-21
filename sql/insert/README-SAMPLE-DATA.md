# Sample Data Installation Guide
## School Health Management System

### Overview
This directory contains SQL scripts to populate your database with comprehensive sample data for testing and development purposes.

### Files Description

1. **`run-all-sample-data.sql`** - Master script that runs all basic data insertion
   - Grade levels and classes
   - Students and parents
   - Student-parent relationships  
   - Nurses and medical staff
   - Medications inventory
   - Basic system data

2. **`sample-data-insert.sql`** - Detailed sample data insertion
   - Comprehensive student records (20 students)
   - Parent information (10 parents)
   - Medical data (medications, vaccines)
   - Health checkup types
   - Health events

3. **`sample-health-records.sql`** - Health-related records
   - Health declarations
   - Student health checkups
   - Vaccination records
   - Medication requests
   - Blog posts for health education
   - Medication inventory transactions

### Installation Order

**Step 1: Run Master Script**
```sql
-- Execute this first for basic data structure
sqlcmd -S your_server -d HealthSchoolDB -i run-all-sample-data.sql
```

**Step 2: Run Detailed Sample Data**
```sql
-- Execute this for comprehensive sample data
sqlcmd -S your_server -d HealthSchoolDB -i sample-data-insert.sql
```

**Step 3: Run Health Records**
```sql
-- Execute this for health-related sample records
sqlcmd -S your_server -d HealthSchoolDB -i sample-health-records.sql
```

**Step 4: Create User Accounts**
```sql
-- Execute this to create system user accounts
sqlcmd -S your_server -d HealthSchoolDB -i create-user-accounts.sql
```

### Sample Data Included

#### Students (20 records)
- **Grade 6**: 8 students across classes 6A1, 6A2
- **Grade 7**: 5 students across classes 7A1, 7A2  
- **Grade 8**: 4 students across classes 8A1, 8A2
- **Grade 9**: 3 students across classes 9A1, 9A2

#### Parents (10 records)
- Diverse occupations (doctors, teachers, engineers, etc.)
- Complete contact information
- Proper student-parent relationships

#### Medical Data
- **Medications**: 10 common medications with proper inventory
- **Vaccines**: 6 vaccines for different age groups
- **Health Checkup Types**: 8 different checkup types
- **Nurses**: 3 qualified medical staff members

#### Health Records
- **Health Declarations**: 5 sample declarations with various conditions
- **Health Checkups**: 5 completed checkup records
- **Vaccination Records**: 5 vaccination entries
- **Medication Requests**: 3 medication requests (approved/pending)
- **Blog Posts**: 5 health education articles

### Test Accounts Available After Installation

| Role | Username | Password | Description |
|------|----------|----------|-------------|
| Admin | admin.user | Password123 | System administrator |
| Nurse | nurse.johnson | Password123 | School nurse |
| Parent | parent.smith | Password123 | Parent account |

### Verification Queries

After installation, run these queries to verify data:

```sql
-- Check student distribution by grade
SELECT 
    gl.grade_name,
    c.class_name,
    COUNT(s.student_id) as student_count
FROM GradeLevels gl
JOIN Classes c ON gl.grade_id = c.grade_id
LEFT JOIN Students s ON c.class_id = s.class_id
GROUP BY gl.grade_name, c.class_name
ORDER BY gl.grade_name, c.class_name;

-- Check medication inventory
SELECT 
    medication_name,
    stock_quantity,
    unit_price,
    storage_location
FROM Medications
ORDER BY medication_name;

-- Check health declarations
SELECT 
    s.full_name,
    hd.declaration_date,
    hd.declaration_status,
    hd.reviewed_by
FROM HealthDeclarations hd
JOIN Students s ON hd.student_id = s.student_id
ORDER BY hd.declaration_date DESC;
```

### Customization

To modify the sample data:

1. **Add more students**: Edit the INSERT statements in `sample-data-insert.sql`
2. **Change class structure**: Modify the grade levels and classes section
3. **Add medications**: Insert additional medications in the medications section
4. **Create health events**: Add more health events for testing

### Cleanup

To remove all sample data and start fresh:

```sql
-- WARNING: This will delete all data
DELETE FROM StudentVaccinationRecords;
DELETE FROM StudentHealthCheckups;
DELETE FROM HealthDeclarations;
DELETE FROM MedicationRequests;
DELETE FROM StudentParents;
DELETE FROM Students;
DELETE FROM Parents;
DELETE FROM Classes;
DELETE FROM GradeLevels;
DELETE FROM Medications;
DELETE FROM Vaccines;
DELETE FROM Nurses;
DELETE FROM HealthEvents;
DELETE FROM HealthCheckupTypes;
DELETE FROM BlogPosts;
```

### Support

If you encounter issues during installation:

1. Ensure you're connected to the correct database
2. Check that all required tables exist
3. Verify user permissions for data insertion
4. Review error messages for constraint violations

### Notes

- All sample data uses Vietnamese names and addresses appropriate for a Vietnamese school
- Medical data follows realistic medical standards
- All dates are set appropriately for the 2024-2025 academic year
- Phone numbers and emails follow Vietnamese formatting standards
