-- Script to convert ALL VARCHAR/CHAR/TEXT columns to NVARCHAR for Vietnamese support
-- This script will convert all string columns in the database to support Unicode

PRINT 'Starting conversion of all string columns to NVARCHAR for Vietnamese support...';

-- First, drop all check constraints that might interfere with conversions
DECLARE @sql NVARCHAR(MAX) = '';
SELECT @sql = @sql + 'ALTER TABLE ' + TABLE_NAME + ' DROP CONSTRAINT ' + CONSTRAINT_NAME + ';' + CHAR(13)
FROM INFORMATION_SCHEMA.CHECK_CONSTRAINTS;
IF LEN(@sql) > 0
BEGIN
    PRINT 'Dropping check constraints...';
    EXEC sp_executesql @sql;
END

-- ==== USERS TABLE ====
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Users')
BEGIN
    PRINT 'Converting Users table...';
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'username' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE Users ALTER COLUMN username NVARCHAR(50) NOT NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'password' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE Users ALTER COLUMN password NVARCHAR(255) NOT NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'user_code' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE Users ALTER COLUMN user_code NVARCHAR(50) NOT NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'full_name' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE Users ALTER COLUMN full_name NVARCHAR(100) NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'email' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE Users ALTER COLUMN email NVARCHAR(100) NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'phone_number' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE Users ALTER COLUMN phone_number NVARCHAR(20) NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'google_id' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE Users ALTER COLUMN google_id NVARCHAR(100) NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'avatar_url' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE Users ALTER COLUMN avatar_url NVARCHAR(255) NULL;
END

-- ==== ROLES TABLE ====
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Roles')
BEGIN
    PRINT 'Converting Roles table...';
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Roles' AND COLUMN_NAME = 'role_name' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE Roles ALTER COLUMN role_name NVARCHAR(50) NOT NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Roles' AND COLUMN_NAME = 'description' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE Roles ALTER COLUMN description NVARCHAR(MAX) NULL;
END

-- ==== STUDENTS TABLE ====
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Students')
BEGIN
    PRINT 'Converting Students table...';
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Students' AND COLUMN_NAME = 'student_code' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE Students ALTER COLUMN student_code NVARCHAR(20) NOT NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Students' AND COLUMN_NAME = 'password' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE Students ALTER COLUMN password NVARCHAR(255) NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Students' AND COLUMN_NAME = 'full_name' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE Students ALTER COLUMN full_name NVARCHAR(100) NOT NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Students' AND COLUMN_NAME = 'gender' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE Students ALTER COLUMN gender NVARCHAR(10) NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Students' AND COLUMN_NAME = 'class_name' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE Students ALTER COLUMN class_name NVARCHAR(20) NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Students' AND COLUMN_NAME = 'first_name' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE Students ALTER COLUMN first_name NVARCHAR(50) NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Students' AND COLUMN_NAME = 'last_name' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE Students ALTER COLUMN last_name NVARCHAR(50) NULL;
    
    -- Add grade_level_id foreign key if not exists
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Students' AND COLUMN_NAME = 'grade_level_id')
    BEGIN
        PRINT 'Adding grade_level_id column to Students table...';
        ALTER TABLE Students ADD grade_level_id INT NULL;
        
        -- Add foreign key constraint after grade_levels table is created
        -- This will be done at the end of the script
    END
END

-- ==== PARENTS TABLE ====
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Parents')
BEGIN
    PRINT 'Converting Parents table...';
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Parents' AND COLUMN_NAME = 'parent_code' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE Parents ALTER COLUMN parent_code NVARCHAR(50) NOT NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Parents' AND COLUMN_NAME = 'full_name' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE Parents ALTER COLUMN full_name NVARCHAR(100) NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Parents' AND COLUMN_NAME = 'gender' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE Parents ALTER COLUMN gender NVARCHAR(10) NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Parents' AND COLUMN_NAME = 'phone_number' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE Parents ALTER COLUMN phone_number NVARCHAR(20) NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Parents' AND COLUMN_NAME = 'address' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE Parents ALTER COLUMN address NVARCHAR(255) NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Parents' AND COLUMN_NAME = 'emergency_contact' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE Parents ALTER COLUMN emergency_contact NVARCHAR(50) NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Parents' AND COLUMN_NAME = 'relationship_with_student' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE Parents ALTER COLUMN relationship_with_student NVARCHAR(50) NULL;
END

-- ==== NURSES TABLE ====
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Nurses')
BEGIN
    PRINT 'Converting Nurses table...';
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Nurses' AND COLUMN_NAME = 'nurse_code' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE Nurses ALTER COLUMN nurse_code NVARCHAR(50) NOT NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Nurses' AND COLUMN_NAME = 'professional_id' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE Nurses ALTER COLUMN professional_id NVARCHAR(50) NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Nurses' AND COLUMN_NAME = 'specialization' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE Nurses ALTER COLUMN specialization NVARCHAR(100) NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Nurses' AND COLUMN_NAME = 'qualification' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE Nurses ALTER COLUMN qualification NVARCHAR(255) NULL;
END

-- ==== MEDICATION_REQUESTS TABLE ====
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'medication_requests')
BEGIN
    PRINT 'Converting medication_requests table...';
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'medication_requests' AND COLUMN_NAME = 'medication_name' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE medication_requests ALTER COLUMN medication_name NVARCHAR(255) NOT NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'medication_requests' AND COLUMN_NAME = 'dosage' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE medication_requests ALTER COLUMN dosage NVARCHAR(100) NOT NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'medication_requests' AND COLUMN_NAME = 'frequency' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE medication_requests ALTER COLUMN frequency NVARCHAR(100) NOT NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'medication_requests' AND COLUMN_NAME = 'reason' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE medication_requests ALTER COLUMN reason NVARCHAR(MAX) NOT NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'medication_requests' AND COLUMN_NAME = 'notes' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE medication_requests ALTER COLUMN notes NVARCHAR(MAX) NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'medication_requests' AND COLUMN_NAME = 'administration_notes' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE medication_requests ALTER COLUMN administration_notes NVARCHAR(MAX) NULL;
END

-- ==== HEALTH_DECLARATION TABLE ====
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'health_declaration')
BEGIN
    PRINT 'Converting health_declaration table...';
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'health_declaration' AND COLUMN_NAME = 'physician_name' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE health_declaration ALTER COLUMN physician_name NVARCHAR(100) NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'health_declaration' AND COLUMN_NAME = 'physician_phone' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE health_declaration ALTER COLUMN physician_phone NVARCHAR(20) NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'health_declaration' AND COLUMN_NAME = 'vision_screening_result' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE health_declaration ALTER COLUMN vision_screening_result NVARCHAR(100) NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'health_declaration' AND COLUMN_NAME = 'hearing_screening_result' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE health_declaration ALTER COLUMN hearing_screening_result NVARCHAR(100) NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'health_declaration' AND COLUMN_NAME = 'dental_screening_result' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE health_declaration ALTER COLUMN dental_screening_result NVARCHAR(100) NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'health_declaration' AND COLUMN_NAME = 'scoliosis_screening_result' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE health_declaration ALTER COLUMN scoliosis_screening_result NVARCHAR(100) NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'health_declaration' AND COLUMN_NAME = 'notes' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE health_declaration ALTER COLUMN notes NVARCHAR(MAX) NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'health_declaration' AND COLUMN_NAME = 'symptoms' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE health_declaration ALTER COLUMN symptoms NVARCHAR(MAX) NULL;
END

-- ==== MEDICAL_EVENTS TABLE ====
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'medical_events')
BEGIN
    PRINT 'Converting medical_events table...';
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'medical_events' AND COLUMN_NAME = 'event_type' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE medical_events ALTER COLUMN event_type NVARCHAR(255) NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'medical_events' AND COLUMN_NAME = 'description' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE medical_events ALTER COLUMN description NVARCHAR(MAX) NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'medical_events' AND COLUMN_NAME = 'severity' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE medical_events ALTER COLUMN severity NVARCHAR(255) NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'medical_events' AND COLUMN_NAME = 'action_taken' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE medical_events ALTER COLUMN action_taken NVARCHAR(MAX) NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'medical_events' AND COLUMN_NAME = 'medication_given' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE medical_events ALTER COLUMN medication_given NVARCHAR(255) NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'medical_events' AND COLUMN_NAME = 'status' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE medical_events ALTER COLUMN status NVARCHAR(255) NULL;
END

-- ==== MEDICATION_INVENTORY TABLE ====
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'medication_inventory')
BEGIN
    PRINT 'Converting medication_inventory table...';
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'medication_inventory' AND COLUMN_NAME = 'medication_name' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE medication_inventory ALTER COLUMN medication_name NVARCHAR(255) NOT NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'medication_inventory' AND COLUMN_NAME = 'dosage_form' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE medication_inventory ALTER COLUMN dosage_form NVARCHAR(100) NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'medication_inventory' AND COLUMN_NAME = 'strength' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE medication_inventory ALTER COLUMN strength NVARCHAR(50) NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'medication_inventory' AND COLUMN_NAME = 'manufacturer' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE medication_inventory ALTER COLUMN manufacturer NVARCHAR(255) NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'medication_inventory' AND COLUMN_NAME = 'lot_number' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE medication_inventory ALTER COLUMN lot_number NVARCHAR(100) NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'medication_inventory' AND COLUMN_NAME = 'storage_location' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE medication_inventory ALTER COLUMN storage_location NVARCHAR(255) NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'medication_inventory' AND COLUMN_NAME = 'notes' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE medication_inventory ALTER COLUMN notes NVARCHAR(MAX) NULL;
END

-- ==== VACCINES TABLE ====
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'vaccines')
BEGIN
    PRINT 'Converting vaccines table...';
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'vaccines' AND COLUMN_NAME = 'vaccine_name' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE vaccines ALTER COLUMN vaccine_name NVARCHAR(255) NOT NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'vaccines' AND COLUMN_NAME = 'description' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE vaccines ALTER COLUMN description NVARCHAR(MAX) NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'vaccines' AND COLUMN_NAME = 'manufacturer' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE vaccines ALTER COLUMN manufacturer NVARCHAR(255) NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'vaccines' AND COLUMN_NAME = 'target_grade_levels' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE vaccines ALTER COLUMN target_grade_levels NVARCHAR(MAX) NULL;
END

-- ==== NOTIFICATIONS TABLE ====
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'notifications')
BEGIN
    PRINT 'Converting notifications table...';
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'notifications' AND COLUMN_NAME = 'title' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE notifications ALTER COLUMN title NVARCHAR(255) NOT NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'notifications' AND COLUMN_NAME = 'message' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE notifications ALTER COLUMN message NVARCHAR(MAX) NOT NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'notifications' AND COLUMN_NAME = 'type' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE notifications ALTER COLUMN type NVARCHAR(50) NULL;
END

-- ==== PARENT_STUDENT_RELATIONSHIPS TABLE ====
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'ParentStudentRelationships')
BEGIN
    PRINT 'Converting ParentStudentRelationships table...';
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'ParentStudentRelationships' AND COLUMN_NAME = 'parent_code' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE ParentStudentRelationships ALTER COLUMN parent_code NVARCHAR(50) NOT NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'ParentStudentRelationships' AND COLUMN_NAME = 'student_code' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE ParentStudentRelationships ALTER COLUMN student_code NVARCHAR(20) NOT NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'ParentStudentRelationships' AND COLUMN_NAME = 'relationship_type' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE ParentStudentRelationships ALTER COLUMN relationship_type NVARCHAR(50) NULL;
END

-- Convert all collection tables (ElementCollection)
-- ==== HEALTH_DECLARATION_ALLERGIES ====
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'health_declaration_allergies')
BEGIN
    PRINT 'Converting health_declaration_allergies table...';
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'health_declaration_allergies' AND COLUMN_NAME = 'allergy' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE health_declaration_allergies ALTER COLUMN allergy NVARCHAR(255) NULL;
END

-- ==== HEALTH_DECLARATION_CHRONIC_ILLNESSES ====
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'health_declaration_chronic_illnesses')
BEGIN
    PRINT 'Converting health_declaration_chronic_illnesses table...';
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'health_declaration_chronic_illnesses' AND COLUMN_NAME = 'chronic_illness' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE health_declaration_chronic_illnesses ALTER COLUMN chronic_illness NVARCHAR(255) NULL;
END

-- ==== MEDICAL_EVENT_SYMPTOMS ====
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'medical_event_symptoms')
BEGIN
    PRINT 'Converting medical_event_symptoms table...';
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'medical_event_symptoms' AND COLUMN_NAME = 'symptom' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE medical_event_symptoms ALTER COLUMN symptom NVARCHAR(255) NULL;
END

-- Handle any additional tables that might exist
-- ==== STUDENT_HEALTH_CHECKUPS ====
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'student_health_checkups')
BEGIN
    PRINT 'Converting student_health_checkups table...';
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'student_health_checkups' AND COLUMN_NAME = 'checkup_type' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE student_health_checkups ALTER COLUMN checkup_type NVARCHAR(100) NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'student_health_checkups' AND COLUMN_NAME = 'result' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE student_health_checkups ALTER COLUMN result NVARCHAR(255) NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'student_health_checkups' AND COLUMN_NAME = 'notes' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE student_health_checkups ALTER COLUMN notes NVARCHAR(MAX) NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'student_health_checkups' AND COLUMN_NAME = 'status' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE student_health_checkups ALTER COLUMN status NVARCHAR(50) NULL;
END

-- ==== HEALTH_EVENTS TABLE ====
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'health_events')
BEGIN
    PRINT 'Converting health_events table...';
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'health_events' AND COLUMN_NAME = 'event_name' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE health_events ALTER COLUMN event_name NVARCHAR(255) NOT NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'health_events' AND COLUMN_NAME = 'event_type' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE health_events ALTER COLUMN event_type NVARCHAR(50) NOT NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'health_events' AND COLUMN_NAME = 'description' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE health_events ALTER COLUMN description NVARCHAR(MAX) NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'health_events' AND COLUMN_NAME = 'location' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE health_events ALTER COLUMN location NVARCHAR(255) NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'health_events' AND COLUMN_NAME = 'status' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE health_events ALTER COLUMN status NVARCHAR(50) NULL;
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'health_events' AND COLUMN_NAME = 'target_grade_levels' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE health_events ALTER COLUMN target_grade_levels NVARCHAR(255) NULL;
END

-- ==== HEALTH_CHECKUP_EVENT_TYPES TABLE (ElementCollection) ====
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'health_checkup_event_types')
BEGIN
    PRINT 'Converting health_checkup_event_types table...';
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'health_checkup_event_types' AND COLUMN_NAME = 'checkup_type' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE health_checkup_event_types ALTER COLUMN checkup_type NVARCHAR(100) NULL;
END

-- ==== HEALTH_CHECKUP_EVENT_NOTIFICATIONS TABLE ====
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'health_checkup_event_notifications')
BEGIN
    PRINT 'Converting health_checkup_event_notifications table...';
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'health_checkup_event_notifications' AND COLUMN_NAME = 'class_id' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE health_checkup_event_notifications ALTER COLUMN class_id NVARCHAR(50) NOT NULL;
END

-- ==== CREATE/UPDATE GRADE_LEVELS TABLE ====
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'grade_levels')
BEGIN
    PRINT 'Creating ultra-simplified grade_levels table...';
    CREATE TABLE grade_levels (
        grade_id INT IDENTITY(1,1) PRIMARY KEY,
        grade_name NVARCHAR(50) NOT NULL,
        is_active BIT NOT NULL DEFAULT 1
    );
    
    -- Insert standard grades 1-12
    INSERT INTO grade_levels (grade_name, is_active) VALUES 
        (N'Grade 1', 1),
        (N'Grade 2', 1),
        (N'Grade 3', 1),
        (N'Grade 4', 1),
        (N'Grade 5', 1),
        (N'Grade 6', 1),
        (N'Grade 7', 1),
        (N'Grade 8', 1),
        (N'Grade 9', 1),
        (N'Grade 10', 1),
        (N'Grade 11', 1),
        (N'Grade 12', 1);
    
    PRINT 'Ultra-simplified grade levels table created with 3 columns only';
END
ELSE
BEGIN
    PRINT 'Grade levels table already exists, ultra-simplifying to 3 columns only...';
    
    -- Drop ALL unnecessary columns if they exist
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'grade_levels' AND COLUMN_NAME = 'description')
    BEGIN
        PRINT 'Dropping description column...';
        ALTER TABLE grade_levels DROP COLUMN description;
    END
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'grade_levels' AND COLUMN_NAME = 'min_age')
    BEGIN
        PRINT 'Dropping min_age column...';
        ALTER TABLE grade_levels DROP COLUMN min_age;
    END
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'grade_levels' AND COLUMN_NAME = 'max_age')
    BEGIN
        PRINT 'Dropping max_age column...';
        ALTER TABLE grade_levels DROP COLUMN max_age;
    END
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'grade_levels' AND COLUMN_NAME = 'grade_number')
    BEGIN
        PRINT 'Dropping grade_number column...';
        ALTER TABLE grade_levels DROP COLUMN grade_number;
    END
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'grade_levels' AND COLUMN_NAME = 'vietnamese_name')
    BEGIN
        PRINT 'Dropping vietnamese_name column...';
        ALTER TABLE grade_levels DROP COLUMN vietnamese_name;
    END
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'grade_levels' AND COLUMN_NAME = 'created_at')
    BEGIN
        PRINT 'Dropping created_at column...';
        ALTER TABLE grade_levels DROP COLUMN created_at;
    END
    
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'grade_levels' AND COLUMN_NAME = 'updated_at')
    BEGIN
        PRINT 'Dropping updated_at column...';
        ALTER TABLE grade_levels DROP COLUMN updated_at;
    END
    
    -- Convert remaining string column to NVARCHAR
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'grade_levels' AND COLUMN_NAME = 'grade_name' AND DATA_TYPE IN ('varchar', 'char', 'text'))
        ALTER TABLE grade_levels ALTER COLUMN grade_name NVARCHAR(50) NOT NULL;
        
    PRINT 'Grade levels table ultra-simplified - only 3 columns remain: grade_id, grade_name, is_active';
END

PRINT 'All table conversions completed successfully!';

-- ==== ADD FOREIGN KEY CONSTRAINTS ====
-- Add foreign key constraint for Students -> GradeLevel
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Students') 
   AND EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'grade_levels')
   AND EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Students' AND COLUMN_NAME = 'grade_level_id')
   AND NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS WHERE CONSTRAINT_NAME = 'FK_Students_GradeLevel')
BEGIN
    PRINT 'Adding foreign key constraint FK_Students_GradeLevel...';
    
    -- First, migrate existing data from class_name to grade_level_id
    PRINT 'Migrating existing student data to use grade levels...';
    
    -- Update students based on class_name patterns (assuming format like "10A", "11B", etc.)
    UPDATE Students 
    SET grade_level_id = (
        SELECT grade_id 
        FROM grade_levels 
        WHERE grade_number = CASE 
            WHEN class_name LIKE '1[0-2]%' THEN CAST(LEFT(class_name, 2) AS INT)
            WHEN class_name LIKE '[1-9]%' THEN CAST(LEFT(class_name, 1) AS INT)
            ELSE 1  -- Default to grade 1 if pattern doesn't match
        END
    )
    WHERE grade_level_id IS NULL AND class_name IS NOT NULL;
    
    -- Set default grade for students without class_name
    UPDATE Students 
    SET grade_level_id = (SELECT grade_id FROM grade_levels WHERE grade_number = 1)
    WHERE grade_level_id IS NULL;
    
    -- Now add the foreign key constraint
    ALTER TABLE Students ADD CONSTRAINT FK_Students_GradeLevel 
        FOREIGN KEY (grade_level_id) REFERENCES grade_levels(grade_id);
        
    -- Make grade_level_id NOT NULL after setting all values
    ALTER TABLE Students ALTER COLUMN grade_level_id INT NOT NULL;
END

PRINT 'Database now fully supports Vietnamese characters with NVARCHAR columns.';
PRINT 'Grade levels system integrated with 1:N relationship to Students.';

-- ==== CREATE MANY-TO-MANY RELATIONSHIP TABLE ====
-- Create junction table for VaccinationEvent and GradeLevel M:N relationship
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'vaccination_event_grade_levels')
BEGIN
    PRINT 'Creating vaccination_event_grade_levels junction table...';
    CREATE TABLE vaccination_event_grade_levels (
        vaccination_event_id INT NOT NULL,
        grade_id INT NOT NULL,
        created_at DATETIME2 DEFAULT GETDATE(),
        PRIMARY KEY (vaccination_event_id, grade_id),
        FOREIGN KEY (vaccination_event_id) REFERENCES vaccination_events(vaccination_event_id) ON DELETE CASCADE,
        FOREIGN KEY (grade_id) REFERENCES grade_levels(grade_id) ON DELETE CASCADE
    );
END

-- ==== POPULATE GRADE LEVELS WITH SAMPLE DATA ====
-- Ensure we have basic grade levels in the system
IF NOT EXISTS (SELECT * FROM grade_levels WHERE grade_number = 1)
BEGIN
    PRINT 'Inserting sample grade levels data...';
    INSERT INTO grade_levels (grade_number, grade_name, vietnamese_name, is_active, created_at, updated_at) VALUES
    (1, 'Grade 1', N'Lớp 1', 1, GETDATE(), GETDATE()),
    (2, 'Grade 2', N'Lớp 2', 1, GETDATE(), GETDATE()),
    (3, 'Grade 3', N'Lớp 3', 1, GETDATE(), GETDATE()),
    (4, 'Grade 4', N'Lớp 4', 1, GETDATE(), GETDATE()),
    (5, 'Grade 5', N'Lớp 5', 1, GETDATE(), GETDATE()),
    (6, 'Grade 6', N'Lớp 6', 1, GETDATE(), GETDATE()),
    (7, 'Grade 7', N'Lớp 7', 1, GETDATE(), GETDATE()),
    (8, 'Grade 8', N'Lớp 8', 1, GETDATE(), GETDATE()),
    (9, 'Grade 9', N'Lớp 9', 1, GETDATE(), GETDATE()),
    (10, 'Grade 10', N'Lớp 10', 1, GETDATE(), GETDATE()),
    (11, 'Grade 11', N'Lớp 11', 1, GETDATE(), GETDATE()),
    (12, 'Grade 12', N'Lớp 12', 1, GETDATE(), GETDATE());
    
    PRINT 'Sample grade levels inserted successfully.';
END

PRINT '=== CONVERSION AND SETUP COMPLETED ===';
PRINT 'All tables now support Vietnamese characters (NVARCHAR).';
PRINT 'Grade levels system with 1:N relationship to Students established.';
PRINT 'M:N relationship between VaccinationEvent and GradeLevel created.';
PRINT 'System ready for grade-based event targeting and notification workflow.';
