-- =============================================
-- Comprehensive English Data Insert Script (CORRECTED)
-- School Medical Management System
-- Date: July 17, 2025
-- All data in English for perfect system testing
-- UPDATED TO MATCH ACTUAL DATABASE SCHEMA
-- =============================================

USE HealthSchoolDB;
GO

PRINT '===========================================';
PRINT 'Starting Comprehensive English Data Installation';
PRINT 'School Health Management System';
PRINT 'Date: July 17, 2025';
PRINT 'CORRECTED VERSION - Matches actual database schema';
PRINT '===========================================';
PRINT '';

-- Check if database exists
IF DB_NAME() != 'HealthSchoolDB'
BEGIN
    PRINT 'ERROR: Not connected to HealthSchoolDB database!';
    PRINT 'Please ensure you are connected to the correct database.';
    RETURN;
END

PRINT 'Database connection verified. Starting data insertion...';
PRINT '';

-- ===========================================
-- Step 1: Insert Roles
-- ===========================================
PRINT 'Step 1: Inserting System Roles...';

-- Clear existing data if needed (using correct table name 'roles')
DELETE FROM roles WHERE role_name IN ('ROLE_ADMIN', 'ROLE_NURSE', 'ROLE_PARENT', 'ROLE_STUDENT', 'ROLE_MANAGER');

INSERT INTO roles (role_name, description) VALUES
('ROLE_ADMIN', 'System Administrator with full access'),
('ROLE_NURSE', 'School nurse with medical management access'),
('ROLE_PARENT', 'Parent with student health monitoring access'),
('ROLE_STUDENT', 'Student with limited health record access'),
('ROLE_MANAGER', 'School manager with administrative access');

PRINT 'Roles inserted successfully.';

-- ===========================================
-- Step 2: Insert Grade Levels
-- ===========================================
PRINT 'Step 2: Inserting Grade Levels...';

-- Clear existing data
DELETE FROM grade_levels WHERE grade_name IN ('Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12');

INSERT INTO grade_levels (grade_name, is_active) VALUES
('Grade 6', 1),
('Grade 7', 1),
('Grade 8', 1),
('Grade 9', 1),
('Grade 10', 1),
('Grade 11', 1),
('Grade 12', 1);

PRINT 'Grade levels inserted successfully.';

-- Get Grade IDs for reference
DECLARE @Grade6Id INT, @Grade7Id INT, @Grade8Id INT, @Grade9Id INT, @Grade10Id INT, @Grade11Id INT, @Grade12Id INT;
SELECT @Grade6Id = grade_id FROM grade_levels WHERE grade_name = 'Grade 6';
SELECT @Grade7Id = grade_id FROM grade_levels WHERE grade_name = 'Grade 7';
SELECT @Grade8Id = grade_id FROM grade_levels WHERE grade_name = 'Grade 8';
SELECT @Grade9Id = grade_id FROM grade_levels WHERE grade_name = 'Grade 9';
SELECT @Grade10Id = grade_id FROM grade_levels WHERE grade_name = 'Grade 10';
SELECT @Grade11Id = grade_id FROM grade_levels WHERE grade_name = 'Grade 11';
SELECT @Grade12Id = grade_id FROM grade_levels WHERE grade_name = 'Grade 12';

-- ===========================================
-- Step 3: Insert Users (System Accounts)
-- ===========================================
PRINT 'Step 3: Inserting System Users...';

-- Get Role IDs (using correct table name 'roles')
DECLARE @AdminRoleId INT, @NurseRoleId INT, @ParentRoleId INT, @StudentRoleId INT, @ManagerRoleId INT;
SELECT @AdminRoleId = role_id FROM roles WHERE role_name = 'ROLE_ADMIN';
SELECT @NurseRoleId = role_id FROM roles WHERE role_name = 'ROLE_NURSE';
SELECT @ParentRoleId = role_id FROM roles WHERE role_name = 'ROLE_PARENT';
SELECT @StudentRoleId = role_id FROM roles WHERE role_name = 'ROLE_STUDENT';
SELECT @ManagerRoleId = role_id FROM roles WHERE role_name = 'ROLE_MANAGER';

-- Clear existing users (including by user_code to avoid constraint violations)
DELETE FROM users WHERE username IN ('admin', 'nurse.sarah', 'nurse.mary', 'nurse.david', 'manager.johnson', 'parent.smith', 'parent.jones', 'parent.williams', 'parent.brown', 'parent.davis')
   OR user_code IN ('ADM001', 'NUR001', 'NUR002', 'NUR003', 'MGR001', 'PAR001', 'PAR002', 'PAR003', 'PAR004', 'PAR005');

INSERT INTO users (username, password, user_code, full_name, email, phone_number, role_id, is_active, created_at, updated_at) VALUES
-- Admin Account
('admin', '$2a$12$LQv3c1yqBTVVWRw8gkMrjOyFNcdCqKA3n5zJqLZsBa4Z3kKhGhK9e', 'ADM001', 'System Administrator', 'admin@healthschool.edu', '+1-555-0001', @AdminRoleId, 1, GETDATE(), GETDATE()),

-- Nurse Accounts
('nurse.sarah', '$2a$12$LQv3c1yqBTVVWRw8gkMrjOyFNcdCqKA3n5zJqLZsBa4Z3kKhGhK9e', 'NUR001', 'Sarah Johnson', 'sarah.johnson@healthschool.edu', '+1-555-0101', @NurseRoleId, 1, GETDATE(), GETDATE()),
('nurse.mary', '$2a$12$LQv3c1yqBTVVWRw8gkMrjOyFNcdCqKA3n5zJqLZsBa4Z3kKhGhK9e', 'NUR002', 'Mary Williams', 'mary.williams@healthschool.edu', '+1-555-0102', @NurseRoleId, 1, GETDATE(), GETDATE()),
('nurse.david', '$2a$12$LQv3c1yqBTVVWRw8gkMrjOyFNcdCqKA3n5zJqLZsBa4Z3kKhGhK9e', 'NUR003', 'David Brown', 'david.brown@healthschool.edu', '+1-555-0103', @NurseRoleId, 1, GETDATE(), GETDATE()),

-- Manager Account
('manager.johnson', '$2a$12$LQv3c1yqBTVVWRw8gkMrjOyFNcdCqKA3n5zJqLZsBa4Z3kKhGhK9e', 'MGR001', 'Robert Johnson', 'robert.johnson@healthschool.edu', '+1-555-0201', @ManagerRoleId, 1, GETDATE(), GETDATE()),

-- Parent Accounts
('parent.smith', '$2a$12$LQv3c1yqBTVVWRw8gkMrjOyFNcdCqKA3n5zJqLZsBa4Z3kKhGhK9e', 'PAR001', 'Michael Smith', 'michael.smith@email.com', '+1-555-1001', @ParentRoleId, 1, GETDATE(), GETDATE()),
('parent.jones', '$2a$12$LQv3c1yqBTVVWRw8gkMrjOyFNcdCqKA3n5zJqLZsBa4Z3kKhGhK9e', 'PAR002', 'Jennifer Jones', 'jennifer.jones@email.com', '+1-555-1002', @ParentRoleId, 1, GETDATE(), GETDATE()),
('parent.williams', '$2a$12$LQv3c1yqBTVVWRw8gkMrjOyFNcdCqKA3n5zJqLZsBa4Z3kKhGhK9e', 'PAR003', 'Christopher Williams', 'chris.williams@email.com', '+1-555-1003', @ParentRoleId, 1, GETDATE(), GETDATE()),
('parent.brown', '$2a$12$LQv3c1yqBTVVWRw8gkMrjOyFNcdCqKA3n5zJqLZsBa4Z3kKhGhK9e', 'PAR004', 'Amanda Brown', 'amanda.brown@email.com', '+1-555-1004', @ParentRoleId, 1, GETDATE(), GETDATE()),
('parent.davis', '$2a$12$LQv3c1yqBTVVWRw8gkMrjOyFNcdCqKA3n5zJqLZsBa4Z3kKhGhK9e', 'PAR005', 'Daniel Davis', 'daniel.davis@email.com', '+1-555-1005', @ParentRoleId, 1, GETDATE(), GETDATE());

PRINT 'System users inserted successfully.';

-- ===========================================
-- Step 4: Insert Students
-- ===========================================
PRINT 'Step 4: Inserting Students...';

-- Clear existing students
DELETE FROM students WHERE student_code LIKE 'ST2025%';

INSERT INTO students (student_code, password, full_name, date_of_birth, gender, grade_level_id, class_name, school_year, allergies, medical_conditions, emergency_contact_name, emergency_contact_phone, created_at, updated_at) VALUES
-- Grade 6 Students
('ST2025001', '$2a$12$LQv3c1yqBTVVWRw8gkMrjOyFNcdCqKA3n5zJqLZsBa4Z3kKhGhK9e', 'Emma Smith', '2013-03-15', 'Female', @Grade6Id, '6A', '2024-2025', 'Peanut allergy', 'None', 'Michael Smith', '+1-555-1001', GETDATE(), GETDATE()),
('ST2025002', '$2a$12$LQv3c1yqBTVVWRw8gkMrjOyFNcdCqKA3n5zJqLZsBa4Z3kKhGhK9e', 'Liam Jones', '2013-05-20', 'Male', @Grade6Id, '6A', '2024-2025', 'None', 'Mild asthma', 'Jennifer Jones', '+1-555-1002', GETDATE(), GETDATE()),
('ST2025003', '$2a$12$LQv3c1yqBTVVWRw8gkMrjOyFNcdCqKA3n5zJqLZsBa4Z3kKhGhK9e', 'Olivia Williams', '2013-08-10', 'Female', @Grade6Id, '6A', '2024-2025', 'Lactose intolerant', 'None', 'Christopher Williams', '+1-555-1003', GETDATE(), GETDATE()),
('ST2025004', '$2a$12$LQv3c1yqBTVVWRw8gkMrjOyFNcdCqKA3n5zJqLZsBa4Z3kKhGhK9e', 'Noah Brown', '2013-12-05', 'Male', @Grade6Id, '6B', '2024-2025', 'None', 'None', 'Amanda Brown', '+1-555-1004', GETDATE(), GETDATE()),
('ST2025005', '$2a$12$LQv3c1yqBTVVWRw8gkMrjOyFNcdCqKA3n5zJqLZsBa4Z3kKhGhK9e', 'Ava Davis', '2013-04-22', 'Female', @Grade6Id, '6B', '2024-2025', 'Shellfish allergy', 'None', 'Daniel Davis', '+1-555-1005', GETDATE(), GETDATE()),

-- Grade 7 Students
('ST2025006', '$2a$12$LQv3c1yqBTVVWRw8gkMrjOyFNcdCqKA3n5zJqLZsBa4Z3kKhGhK9e', 'Isabella Miller', '2012-06-18', 'Female', @Grade7Id, '7A', '2024-2025', 'None', 'Mild eczema', 'Sarah Miller', '+1-555-1006', GETDATE(), GETDATE()),
('ST2025007', '$2a$12$LQv3c1yqBTVVWRw8gkMrjOyFNcdCqKA3n5zJqLZsBa4Z3kKhGhK9e', 'Mason Wilson', '2012-09-30', 'Male', @Grade7Id, '7A', '2024-2025', 'None', 'None', 'James Wilson', '+1-555-1007', GETDATE(), GETDATE()),
('ST2025008', '$2a$12$LQv3c1yqBTVVWRw8gkMrjOyFNcdCqKA3n5zJqLZsBa4Z3kKhGhK9e', 'Sophia Moore', '2012-11-12', 'Female', @Grade7Id, '7B', '2024-2025', 'Dust allergy', 'None', 'Lisa Moore', '+1-555-1008', GETDATE(), GETDATE()),

-- Grade 8 Students
('ST2025009', '$2a$12$LQv3c1yqBTVVWRw8gkMrjOyFNcdCqKA3n5zJqLZsBa4Z3kKhGhK9e', 'Jacob Taylor', '2011-07-25', 'Male', @Grade8Id, '8A', '2024-2025', 'None', 'ADHD', 'Robert Taylor', '+1-555-1009', GETDATE(), GETDATE()),
('ST2025010', '$2a$12$LQv3c1yqBTVVWRw8gkMrjOyFNcdCqKA3n5zJqLZsBa4Z3kKhGhK9e', 'Emily Anderson', '2011-01-14', 'Female', @Grade8Id, '8A', '2024-2025', 'Seasonal allergies', 'None', 'Karen Anderson', '+1-555-1010', GETDATE(), GETDATE()),

-- Grade 9 Students
('ST2025011', '$2a$12$LQv3c1yqBTVVWRw8gkMrjOyFNcdCqKA3n5zJqLZsBa4Z3kKhGhK9e', 'Ethan Thomas', '2010-10-08', 'Male', @Grade9Id, '9A', '2024-2025', 'None', 'Type 1 Diabetes', 'Mark Thomas', '+1-555-1011', GETDATE(), GETDATE()),
('ST2025012', '$2a$12$LQv3c1yqBTVVWRw8gkMrjOyFNcdCqKA3n5zJqLZsBa4Z3kKhGhK9e', 'Madison Jackson', '2010-03-17', 'Female', @Grade9Id, '9A', '2024-2025', 'Bee sting allergy', 'None', 'Michelle Jackson', '+1-555-1012', GETDATE(), GETDATE()),

-- Grade 10 Students
('ST2025013', '$2a$12$LQv3c1yqBTVVWRw8gkMrjOyFNcdCqKA3n5zJqLZsBa4Z3kKhGhK9e', 'Alexander White', '2009-12-03', 'Male', @Grade10Id, '10A', '2024-2025', 'None', 'None', 'David White', '+1-555-1013', GETDATE(), GETDATE()),
('ST2025014', '$2a$12$LQv3c1yqBTVVWRw8gkMrjOyFNcdCqKA3n5zJqLZsBa4Z3kKhGhK9e', 'Abigail Harris', '2009-08-21', 'Female', @Grade10Id, '10A', '2024-2025', 'None', 'Migraine headaches', 'Susan Harris', '+1-555-1014', GETDATE(), GETDATE()),

-- Grade 11 Students
('ST2025015', '$2a$12$LQv3c1yqBTVVWRw8gkMrjOyFNcdCqKA3n5zJqLZsBa4Z3kKhGhK9e', 'Benjamin Martin', '2008-05-11', 'Male', @Grade11Id, '11A', '2024-2025', 'None', 'None', 'John Martin', '+1-555-1015', GETDATE(), GETDATE()),
('ST2025016', '$2a$12$LQv3c1yqBTVVWRw8gkMrjOyFNcdCqKA3n5zJqLZsBa4Z3kKhGhK9e', 'Elizabeth Garcia', '2008-02-28', 'Female', @Grade11Id, '11A', '2024-2025', 'Gluten sensitivity', 'None', 'Maria Garcia', '+1-555-1016', GETDATE(), GETDATE()),

-- Grade 12 Students
('ST2025017', '$2a$12$LQv3c1yqBTVVWRw8gkMrjOyFNcdCqKA3n5zJqLZsBa4Z3kKhGhK9e', 'William Rodriguez', '2007-11-09', 'Male', @Grade12Id, '12A', '2024-2025', 'None', 'None', 'Carlos Rodriguez', '+1-555-1017', GETDATE(), GETDATE()),
('ST2025018', '$2a$12$LQv3c1yqBTVVWRw8gkMrjOyFNcdCqKA3n5zJqLZsBa4Z3kKhGhK9e', 'Charlotte Lewis', '2007-04-16', 'Female', @Grade12Id, '12A', '2024-2025', 'None', 'Iron deficiency', 'Patricia Lewis', '+1-555-1018', GETDATE(), GETDATE());

PRINT 'Students inserted successfully.';

-- ===========================================
-- Step 5: Insert Parents
-- ===========================================
PRINT 'Step 5: Inserting Parents...';

-- Clear existing parents
DELETE FROM parents WHERE parent_code LIKE 'PAR%';

INSERT INTO parents (parent_code, full_name, gender, phone_number, address, emergency_contact, relationship_with_student, created_at, updated_at) VALUES
('PAR001', 'Michael Smith', 'Male', '+1-555-1001', '123 Oak Street, Springfield, IL 62701', 'Sarah Smith', 'Father', GETDATE(), GETDATE()),
('PAR002', 'Jennifer Jones', 'Female', '+1-555-1002', '456 Maple Avenue, Springfield, IL 62702', 'Robert Jones', 'Mother', GETDATE(), GETDATE()),
('PAR003', 'Christopher Williams', 'Male', '+1-555-1003', '789 Pine Road, Springfield, IL 62703', 'Linda Williams', 'Father', GETDATE(), GETDATE()),
('PAR004', 'Amanda Brown', 'Female', '+1-555-1004', '321 Elm Street, Springfield, IL 62704', 'Thomas Brown', 'Mother', GETDATE(), GETDATE()),
('PAR005', 'Daniel Davis', 'Male', '+1-555-1005', '654 Cedar Lane, Springfield, IL 62705', 'Nancy Davis', 'Father', GETDATE(), GETDATE()),
('PAR006', 'Sarah Miller', 'Female', '+1-555-1006', '987 Birch Drive, Springfield, IL 62706', 'Kevin Miller', 'Mother', GETDATE(), GETDATE()),
('PAR007', 'James Wilson', 'Male', '+1-555-1007', '111 Spruce Court, Springfield, IL 62707', 'Diana Wilson', 'Father', GETDATE(), GETDATE()),
('PAR008', 'Lisa Moore', 'Female', '+1-555-1008', '222 Willow Street, Springfield, IL 62708', 'Brian Moore', 'Mother', GETDATE(), GETDATE()),
('PAR009', 'Robert Taylor', 'Male', '+1-555-1009', '333 Ash Avenue, Springfield, IL 62709', 'Kelly Taylor', 'Father', GETDATE(), GETDATE()),
('PAR010', 'Karen Anderson', 'Female', '+1-555-1010', '444 Cherry Lane, Springfield, IL 62710', 'Steven Anderson', 'Mother', GETDATE(), GETDATE()),
('PAR011', 'Mark Thomas', 'Male', '+1-555-1011', '555 Poplar Road, Springfield, IL 62711', 'Jennifer Thomas', 'Father', GETDATE(), GETDATE()),
('PAR012', 'Michelle Jackson', 'Female', '+1-555-1012', '666 Hickory Drive, Springfield, IL 62712', 'Anthony Jackson', 'Mother', GETDATE(), GETDATE()),
('PAR013', 'David White', 'Male', '+1-555-1013', '777 Walnut Street, Springfield, IL 62713', 'Barbara White', 'Father', GETDATE(), GETDATE()),
('PAR014', 'Susan Harris', 'Female', '+1-555-1014', '888 Chestnut Avenue, Springfield, IL 62714', 'Matthew Harris', 'Mother', GETDATE(), GETDATE()),
('PAR015', 'John Martin', 'Male', '+1-555-1015', '999 Sycamore Lane, Springfield, IL 62715', 'Rebecca Martin', 'Father', GETDATE(), GETDATE()),
('PAR016', 'Maria Garcia', 'Female', '+1-555-1016', '101 Magnolia Court, Springfield, IL 62716', 'Jose Garcia', 'Mother', GETDATE(), GETDATE()),
('PAR017', 'Carlos Rodriguez', 'Male', '+1-555-1017', '202 Dogwood Drive, Springfield, IL 62717', 'Carmen Rodriguez', 'Father', GETDATE(), GETDATE()),
('PAR018', 'Patricia Lewis', 'Female', '+1-555-1018', '303 Redwood Street, Springfield, IL 62718', 'Richard Lewis', 'Mother', GETDATE(), GETDATE());

PRINT 'Parents inserted successfully.';

-- ===========================================
-- Step 6: Insert Parent-Student Relationships
-- ===========================================
PRINT 'Step 6: Inserting Parent-Student Relationships...';

-- Clear existing relationships using correct table name and columns
DELETE FROM parent_student_relationships;

-- Insert parent-student relationships using correct column names based on actual schema
INSERT INTO parent_student_relationships (parent_code, student_code, relationship_type, created_at) VALUES
('PAR001', 'ST2025001', 'Father', GETDATE()),
('PAR002', 'ST2025002', 'Mother', GETDATE()),
('PAR003', 'ST2025003', 'Father', GETDATE()),
('PAR004', 'ST2025004', 'Mother', GETDATE()),
('PAR005', 'ST2025005', 'Father', GETDATE()),
('PAR006', 'ST2025006', 'Mother', GETDATE()),
('PAR007', 'ST2025007', 'Father', GETDATE()),
('PAR008', 'ST2025008', 'Mother', GETDATE()),
('PAR009', 'ST2025009', 'Father', GETDATE()),
('PAR010', 'ST2025010', 'Mother', GETDATE()),
('PAR011', 'ST2025011', 'Father', GETDATE()),
('PAR012', 'ST2025012', 'Mother', GETDATE()),
('PAR013', 'ST2025013', 'Father', GETDATE()),
('PAR014', 'ST2025014', 'Mother', GETDATE()),
('PAR015', 'ST2025015', 'Father', GETDATE()),
('PAR016', 'ST2025016', 'Mother', GETDATE()),
('PAR017', 'ST2025017', 'Father', GETDATE()),
('PAR018', 'ST2025018', 'Mother', GETDATE());

PRINT 'Parent-Student relationships inserted successfully.';

-- ===========================================
-- Step 7: Insert Nurses
-- ===========================================
PRINT 'Step 7: Inserting Nurses...';

-- Clear existing nurses
DELETE FROM nurses WHERE nurse_code LIKE 'NUR%';

INSERT INTO nurses (nurse_code, full_name, gender, phone_number, professional_id, specialization, qualification, created_at, updated_at) VALUES
('NUR001', 'Sarah Johnson', 'Female', '+1-555-0101', 'RN-123456', 'Pediatric Nursing', 'Bachelor of Science in Nursing, Certified Pediatric Nurse', GETDATE(), GETDATE()),
('NUR002', 'Mary Williams', 'Female', '+1-555-0102', 'RN-234567', 'School Health', 'Master of Science in Nursing, School Health Specialist', GETDATE(), GETDATE()),
('NUR003', 'David Brown', 'Male', '+1-555-0103', 'RN-345678', 'Emergency Care', 'Bachelor of Science in Nursing, Emergency Medical Technician', GETDATE(), GETDATE());

PRINT 'Nurses inserted successfully.';

-- ===========================================
-- Step 8: Insert Medications Inventory
-- ===========================================
PRINT 'Step 8: Inserting Medication Inventory...';

-- Clear existing medications
DELETE FROM medication_inventory;

INSERT INTO medication_inventory (medication_name, dosage, form, batch_number, expiry_date, quantity, prescription_required, manufacturer, storage_location, unit_cost, created_by, created_at) VALUES
('Acetaminophen', '325mg', 'Tablet', 'ACE2025001', '2026-12-31', 500, 0, 'Johnson & Johnson', 'Cabinet A1', 0.25, 'System', GETDATE()),
('Ibuprofen', '200mg', 'Tablet', 'IBU2025001', '2026-10-15', 300, 0, 'Pfizer Inc', 'Cabinet A2', 0.35, 'System', GETDATE()),
('Aspirin', '81mg', 'Tablet', 'ASP2025001', '2026-08-20', 200, 0, 'Bayer Healthcare', 'Cabinet A3', 0.15, 'System', GETDATE()),
('Diphenhydramine', '25mg', 'Capsule', 'DIP2025001', '2025-11-30', 150, 0, 'McNeil Consumer', 'Cabinet B1', 0.45, 'System', GETDATE()),
('Loratadine', '10mg', 'Tablet', 'LOR2025001', '2026-06-15', 100, 0, 'Schering-Plough', 'Cabinet B2', 0.65, 'System', GETDATE()),
('Albuterol Inhaler', '90mcg', 'Inhaler', 'ALB2025001', '2025-09-25', 25, 1, 'GlaxoSmithKline', 'Refrigerator R1', 25.50, 'System', GETDATE()),
('Epinephrine Auto-Injector', '0.3mg', 'Auto-Injector', 'EPI2025001', '2025-12-01', 10, 1, 'Mylan Pharmaceuticals', 'Emergency Kit E1', 150.00, 'System', GETDATE()),
('Hydrocortisone Cream', '1%', 'Topical Cream', 'HYD2025001', '2026-03-10', 20, 0, 'Teva Pharmaceuticals', 'Cabinet C1', 8.75, 'System', GETDATE()),
('Antiseptic Wipes', 'N/A', 'Wipes', 'ANT2025001', '2027-01-01', 500, 0, 'First Aid Only', 'Storage S1', 0.05, 'System', GETDATE()),
('Adhesive Bandages', 'Various', 'Bandages', 'BAN2025001', '2028-06-30', 1000, 0, 'Band-Aid Brand', 'Storage S2', 0.10, 'System', GETDATE());

PRINT 'Medication inventory inserted successfully.';

-- ===========================================
-- Step 9: Insert Vaccines
-- ===========================================
PRINT 'Step 9: Inserting Vaccines...';

-- Clear existing vaccines
DELETE FROM vaccines;

INSERT INTO vaccines (vaccine_name, disease_targeted, description, manufacturer, standard_doses) VALUES
('MMR Vaccine', 'Measles, Mumps, Rubella', 'Combined vaccine protecting against measles, mumps, and rubella', 'Merck & Co', 2),
('DTaP Vaccine', 'Diphtheria, Tetanus, Pertussis', 'Combined vaccine protecting against diphtheria, tetanus, and pertussis', 'GlaxoSmithKline', 5),
('Polio Vaccine (IPV)', 'Poliomyelitis', 'Inactivated poliovirus vaccine preventing polio', 'Sanofi Pasteur', 4),
('Hepatitis B Vaccine', 'Hepatitis B', 'Vaccine preventing hepatitis B virus infection', 'Merck & Co', 3),
('Varicella Vaccine', 'Chickenpox', 'Vaccine preventing varicella (chickenpox)', 'Merck & Co', 2),
('HPV Vaccine', 'Human Papillomavirus', 'Vaccine preventing human papillomavirus infections', 'Merck & Co', 3),
('Meningococcal Vaccine', 'Meningococcal Disease', 'Vaccine preventing meningococcal meningitis', 'Sanofi Pasteur', 2),
('Influenza Vaccine', 'Seasonal Influenza', 'Annual vaccine preventing seasonal flu', 'Various Manufacturers', 1),
('Tdap Vaccine', 'Tetanus, Diphtheria, Pertussis', 'Booster vaccine for adolescents and adults', 'GlaxoSmithKline', 1),
('COVID-19 Vaccine', 'SARS-CoV-2', 'Vaccine preventing COVID-19 infection', 'Pfizer-BioNTech', 2);

PRINT 'Vaccines inserted successfully.';

-- ===========================================
-- Step 10: Insert Health Checkup Types
-- ===========================================
PRINT 'Step 10: Inserting Health Checkup Types...';

-- Clear existing checkup types
DELETE FROM health_checkup_types;

INSERT INTO health_checkup_types (type_name, description, is_required_measurement, is_required_vital_signs, is_required_vision_test, is_required_hearing_test, estimated_duration_minutes, is_active, created_at, updated_at) VALUES
('Annual Physical Examination', 'Comprehensive annual health examination for all students', 1, 1, 1, 1, 45, 1, GETDATE(), GETDATE()),
('BMI Screening', 'Body Mass Index screening for weight management', 1, 0, 0, 0, 15, 1, GETDATE(), GETDATE()),
('Vision Screening', 'Comprehensive eye examination and vision testing', 0, 0, 1, 0, 20, 1, GETDATE(), GETDATE()),
('Hearing Screening', 'Audiometric testing for hearing assessment', 0, 0, 0, 1, 25, 1, GETDATE(), GETDATE()),
('Sports Physical', 'Medical examination required for sports participation', 1, 1, 0, 0, 30, 1, GETDATE(), GETDATE()),
('Scoliosis Screening', 'Spinal examination for scoliosis detection', 1, 0, 0, 0, 15, 1, GETDATE(), GETDATE()),
('Dental Checkup', 'Basic dental health examination', 0, 0, 0, 0, 20, 1, GETDATE(), GETDATE()),
('Mental Health Assessment', 'Basic mental health and wellness evaluation', 0, 1, 0, 0, 40, 1, GETDATE(), GETDATE());

PRINT 'Health checkup types inserted successfully.';

-- ===========================================
-- Step 11: Insert Health Events
-- ===========================================
PRINT 'Step 11: Inserting Health Events...';

-- Clear existing health events
DELETE FROM health_events;

INSERT INTO health_events (event_name, event_type, description, scheduled_date, location, status, created_at, updated_at) VALUES
('Fall 2024 Annual Physical Examinations', 'HEALTH_CHECKUP', 'Comprehensive annual health examinations for all grade levels', '2024-09-15', 'School Health Center - Room 101', 'COMPLETED', GETDATE(), GETDATE()),
('Spring 2025 Vision Screening', 'HEALTH_CHECKUP', 'Vision and eye health screening for grades 6-9', '2025-03-10', 'School Health Center - Room 102', 'SCHEDULED', GETDATE(), GETDATE()),
('Winter 2024 Influenza Vaccination', 'VACCINATION', 'Annual influenza vaccination campaign', '2024-11-01', 'School Gymnasium', 'COMPLETED', GETDATE(), GETDATE()),
('Spring 2025 HPV Vaccination - First Dose', 'VACCINATION', 'HPV vaccine first dose for eligible students', '2025-04-15', 'School Health Center - Room 103', 'SCHEDULED', GETDATE(), GETDATE()),
('Fall 2024 Sports Physical Examinations', 'HEALTH_CHECKUP', 'Medical examinations for student athletes', '2024-08-20', 'School Health Center - Room 101', 'COMPLETED', GETDATE(), GETDATE()),
('Spring 2025 Hearing Screening', 'HEALTH_CHECKUP', 'Audiometric testing for all students', '2025-05-05', 'School Health Center - Room 104', 'SCHEDULED', GETDATE(), GETDATE()),
('Summer 2025 Tdap Booster Vaccination', 'VACCINATION', 'Tetanus, diphtheria, and pertussis booster shots', '2025-07-10', 'School Health Center - Room 103', 'SCHEDULED', GETDATE(), GETDATE());

PRINT 'Health events inserted successfully.';

-- ===========================================
-- Step 12: Insert Health Event Grade Level Associations
-- ===========================================
PRINT 'Step 12: Inserting Health Event Grade Level Associations...';

-- Clear existing associations
DELETE FROM health_event_grade_levels;

-- Get Health Event IDs
DECLARE @Event1 INT, @Event2 INT, @Event3 INT, @Event4 INT, @Event5 INT, @Event6 INT, @Event7 INT;
SELECT @Event1 = event_id FROM health_events WHERE event_name = 'Fall 2024 Annual Physical Examinations';
SELECT @Event2 = event_id FROM health_events WHERE event_name = 'Spring 2025 Vision Screening';
SELECT @Event3 = event_id FROM health_events WHERE event_name = 'Winter 2024 Influenza Vaccination';
SELECT @Event4 = event_id FROM health_events WHERE event_name = 'Spring 2025 HPV Vaccination - First Dose';
SELECT @Event5 = event_id FROM health_events WHERE event_name = 'Fall 2024 Sports Physical Examinations';
SELECT @Event6 = event_id FROM health_events WHERE event_name = 'Spring 2025 Hearing Screening';
SELECT @Event7 = event_id FROM health_events WHERE event_name = 'Summer 2025 Tdap Booster Vaccination';

-- Associate events with grade levels
INSERT INTO health_event_grade_levels (event_id, grade_id) VALUES
-- Annual Physical for all grades
(@Event1, @Grade6Id), (@Event1, @Grade7Id), (@Event1, @Grade8Id), (@Event1, @Grade9Id), (@Event1, @Grade10Id), (@Event1, @Grade11Id), (@Event1, @Grade12Id),
-- Vision Screening for grades 6-9
(@Event2, @Grade6Id), (@Event2, @Grade7Id), (@Event2, @Grade8Id), (@Event2, @Grade9Id),
-- Flu vaccination for all grades
(@Event3, @Grade6Id), (@Event3, @Grade7Id), (@Event3, @Grade8Id), (@Event3, @Grade9Id), (@Event3, @Grade10Id), (@Event3, @Grade11Id), (@Event3, @Grade12Id),
-- HPV vaccination for grades 9-12 (age appropriate)
(@Event4, @Grade9Id), (@Event4, @Grade10Id), (@Event4, @Grade11Id), (@Event4, @Grade12Id),
-- Sports Physical for all grades
(@Event5, @Grade6Id), (@Event5, @Grade7Id), (@Event5, @Grade8Id), (@Event5, @Grade9Id), (@Event5, @Grade10Id), (@Event5, @Grade11Id), (@Event5, @Grade12Id),
-- Hearing Screening for all grades
(@Event6, @Grade6Id), (@Event6, @Grade7Id), (@Event6, @Grade8Id), (@Event6, @Grade9Id), (@Event6, @Grade10Id), (@Event6, @Grade11Id), (@Event6, @Grade12Id),
-- Tdap Booster for grades 11-12
(@Event7, @Grade11Id), (@Event7, @Grade12Id);

PRINT 'Health event grade level associations inserted successfully.';

-- ===========================================
-- Step 13: Insert Sample Health Checkups
-- ===========================================
PRINT 'Step 13: Inserting Sample Health Checkups...';

-- Clear existing health checkups
DELETE FROM health_checkup;

INSERT INTO health_checkup (student_id, event_id, checkup_date, conducted_by, height, weight, bmi, blood_pressure_systolic, blood_pressure_diastolic, heart_rate, temperature, vision_left, vision_right, hearing_left, hearing_right, general_health_status, health_notes, recommendations, requires_follow_up, created_at, updated_at, created_by) VALUES
('ST2025001', @Event1, '2024-09-16', 'Sarah Johnson, RN', 140.5, 35.2, 17.8, 105, 65, 85, 98.6, '20/20', '20/20', 'Normal', 'Normal', 'Excellent', 'Student is in excellent health with normal growth patterns.', 'Continue healthy diet and regular exercise.', 0, GETDATE(), GETDATE(), 'NUR001'),
('ST2025002', @Event1, '2024-09-16', 'Sarah Johnson, RN', 138.0, 33.8, 17.7, 110, 70, 92, 98.4, '20/25', '20/20', 'Normal', 'Normal', 'Good', 'Mild vision issue in left eye. Otherwise healthy.', 'Follow up with optometrist for left eye vision.', 1, GETDATE(), GETDATE(), 'NUR001'),
('ST2025003', @Event1, '2024-09-17', 'Mary Williams, RN', 142.0, 36.1, 17.9, 108, 68, 88, 98.7, '20/20', '20/20', 'Normal', 'Normal', 'Excellent', 'Healthy student with normal development.', 'Maintain current health habits.', 0, GETDATE(), GETDATE(), 'NUR002'),
('ST2025004', @Event1, '2024-09-17', 'Mary Williams, RN', 145.2, 38.5, 18.3, 112, 72, 90, 98.5, '20/20', '20/20', 'Normal', 'Normal', 'Good', 'Slightly elevated BMI but within normal range.', 'Monitor diet and increase physical activity.', 0, GETDATE(), GETDATE(), 'NUR002'),
('ST2025005', @Event1, '2024-09-18', 'David Brown, RN', 139.8, 34.7, 17.7, 106, 66, 86, 98.8, '20/20', '20/20', 'Normal', 'Normal', 'Excellent', 'Student shows excellent health markers.', 'Continue current lifestyle choices.', 0, GETDATE(), GETDATE(), 'NUR003'),
('ST2025011', @Event1, '2024-09-20', 'Sarah Johnson, RN', 165.5, 52.3, 19.1, 118, 75, 78, 98.2, '20/20', '20/20', 'Normal', 'Normal', 'Good', 'Student with Type 1 Diabetes managing well.', 'Continue diabetes management plan. Regular monitoring.', 1, GETDATE(), GETDATE(), 'NUR001'),
('ST2025012', @Event1, '2024-09-20', 'Mary Williams, RN', 160.2, 48.6, 18.9, 115, 73, 82, 98.4, '20/20', '20/20', 'Normal', 'Normal', 'Excellent', 'Healthy adolescent with normal development.', 'Continue healthy lifestyle habits.', 0, GETDATE(), GETDATE(), 'NUR002');

PRINT 'Sample health checkups inserted successfully.';

-- ===========================================
-- Step 14: Insert Sample Medication Requests
-- ===========================================
PRINT 'Step 14: Inserting Sample Medication Requests...';

-- Clear existing medication requests
DELETE FROM medication_requests;

-- Get User IDs for parents and nurses
DECLARE @ParentUser1 INT, @ParentUser2 INT, @ParentUser3 INT, @NurseUser1 INT, @NurseUser2 INT;
SELECT @ParentUser1 = user_id FROM users WHERE username = 'parent.smith';
SELECT @ParentUser2 = user_id FROM users WHERE username = 'parent.jones';
SELECT @ParentUser3 = user_id FROM users WHERE username = 'parent.williams';
SELECT @NurseUser1 = user_id FROM users WHERE username = 'nurse.sarah';
SELECT @NurseUser2 = user_id FROM users WHERE username = 'nurse.mary';

INSERT INTO medication_requests (student_code, requested_by_user_id, medication_name, dosage, frequency, start_date, end_date, reason, status, request_date, approved_by_nurse_id, approval_date, notes) VALUES
('ST2025002', @ParentUser2, 'Albuterol Inhaler', '90mcg', 'As needed for asthma symptoms', '2024-09-01', '2025-06-30', 'Student has mild asthma and may need inhaler during physical activities or allergy season.', 'APPROVED', '2024-08-25 10:30:00', @NurseUser1, '2024-08-26 14:15:00', 'Approved for school use. Parent has provided proper inhaler training documentation.'),
('ST2025005', @ParentUser1, 'Epinephrine Auto-Injector', '0.3mg', 'Emergency use only', '2024-09-01', '2025-06-30', 'Student has severe shellfish allergy and requires emergency epinephrine access.', 'APPROVED', '2024-08-20 09:15:00', @NurseUser1, '2024-08-21 11:30:00', 'Critical medication approved. All staff trained on administration protocol.'),
('ST2025011', @ParentUser3, 'Glucose Tablets', '4g each', 'As needed for low blood sugar', '2024-09-01', '2025-06-30', 'Student has Type 1 Diabetes and may experience hypoglycemic episodes.', 'APPROVED', '2024-08-22 15:45:00', @NurseUser2, '2024-08-23 09:00:00', 'Approved as part of diabetes management plan. Parent provided detailed care instructions.'),
('ST2025001', @ParentUser1, 'Acetaminophen', '325mg', 'Twice daily with meals', '2024-10-15', '2024-10-25', 'Student experiencing headaches due to stress from upcoming exams.', 'PENDING', '2024-10-14 16:20:00', NULL, NULL, NULL),
('ST2025008', @ParentUser2, 'Loratadine', '10mg', 'Once daily in morning', '2024-11-01', '2025-05-31', 'Student has seasonal allergies and dust sensitivity affecting concentration.', 'PENDING', '2024-10-30 13:10:00', NULL, NULL, NULL);

PRINT 'Sample medication requests inserted successfully.';

-- ===========================================
-- Step 15: Insert Sample Blog Posts
-- ===========================================
PRINT 'Step 15: Inserting Sample Blog Posts...';

-- Clear existing blog posts
DELETE FROM blog_posts;
DELETE FROM blog_post_tags;

-- Get admin and nurse user IDs for blog post authors
DECLARE @AdminUserId INT, @NurseUserId INT;
SELECT @AdminUserId = user_id FROM users WHERE username = 'admin';
SELECT @NurseUserId = user_id FROM users WHERE username = 'nurse.sarah';

INSERT INTO blog_posts (title, content, summary, category_id, user_id, created_at, updated_at) VALUES
('Back to School Health Tips', 'As we begin the new school year, it''s important to establish healthy habits that will help students succeed academically and maintain their well-being. Here are some essential health tips for students and parents: 1. Ensure adequate sleep - Students need 8-10 hours of sleep per night. 2. Pack nutritious lunches with fruits, vegetables, and whole grains. 3. Stay hydrated by drinking plenty of water throughout the day. 4. Practice good hand hygiene to prevent illness. 5. Keep up with regular physical activity and exercise. 6. Maintain current vaccinations and health checkups. Remember, a healthy student is a successful student!', 'Essential health guidelines for students starting the new school year, covering sleep, nutrition, hygiene, and wellness practices.', 1, @AdminUserId, GETDATE(), GETDATE()),

('Understanding Seasonal Allergies in Children', 'Seasonal allergies affect many school-age children and can significantly impact their academic performance and quality of life. Common symptoms include sneezing, runny nose, itchy eyes, and congestion. Here''s what parents and educators should know: Identification: Watch for persistent symptoms during specific seasons, typically spring (tree pollen) and fall (ragweed). Management: Work with healthcare providers to develop an allergy action plan. This may include antihistamines, nasal sprays, or other medications. School Environment: Ensure classroom air filters are clean and windows remain closed during high pollen days. Communication: Keep school nurses informed about your child''s allergy medications and triggers. With proper management, students with allergies can thrive in the school environment.', 'Comprehensive guide to identifying, managing, and treating seasonal allergies in school-age children.', 2, @NurseUserId, GETDATE(), GETDATE()),

('Emergency Preparedness: What Every Parent Should Know', 'School health emergencies can happen at any time, and preparation is key to ensuring student safety. Here''s essential information every parent should provide to their child''s school: Medical Information: Complete emergency contact forms with current phone numbers and alternative contacts. List all medications, allergies, and medical conditions clearly. Medical Action Plans: For students with chronic conditions (asthma, diabetes, severe allergies), provide detailed action plans from your healthcare provider. Emergency Supplies: Ensure your child has necessary medications (inhalers, EpiPens, etc.) at school with proper labeling and expiration dates. Communication: Establish clear communication channels with school nurses and administrators. Regular Updates: Review and update all medical information at the beginning of each school year and whenever changes occur.', 'Essential emergency preparedness information for parents to ensure their children''s safety at school.', 3, @NurseUserId, GETDATE(), GETDATE()),

('Mental Health Awareness: Supporting Student Wellbeing', 'Mental health is just as important as physical health for student success. Schools play a crucial role in supporting student mental wellness. Here are ways we can work together: Recognition: Learn to recognize signs of stress, anxiety, or depression in students. These may include changes in behavior, academic performance, or social interactions. Resources: Our school provides access to counselors and mental health resources. Don''t hesitate to reach out if you have concerns about your child. Strategies: Encourage open communication, regular exercise, adequate sleep, and healthy coping mechanisms. Stigma Reduction: Help normalize conversations about mental health and seeking help when needed. Community Support: Building a supportive school community benefits everyone''s mental health. If you notice any concerning changes in your child''s mood or behavior, please contact our school counseling team immediately.', 'Important information about recognizing, addressing, and supporting student mental health and wellbeing.', 4, @AdminUserId, GETDATE(), GETDATE()),

('Nutrition Guidelines for Growing Students', 'Proper nutrition is fundamental to student health, growth, and academic performance. Here are evidence-based nutrition guidelines for school-age children: Balanced Meals: Include foods from all food groups - fruits, vegetables, whole grains, lean proteins, and dairy or dairy alternatives. Breakfast Importance: Never skip breakfast! It provides essential energy for learning and concentration. Healthy Snacks: Choose nutrient-dense snacks like fruits, vegetables with hummus, nuts, or yogurt instead of processed snacks. Hydration: Water should be the primary beverage. Limit sugary drinks and excessive caffeine. Portion Awareness: Teach children to recognize appropriate portion sizes for their age and activity level. Special Considerations: Students with food allergies, intolerances, or dietary restrictions should work with our nutrition team to ensure their needs are met safely. Our school cafeteria follows USDA nutrition standards and can accommodate various dietary needs.', 'Comprehensive nutrition guidelines to support optimal growth, health, and academic performance in students.', 5, @NurseUserId, GETDATE(), GETDATE());

-- Insert blog post tags
INSERT INTO blog_post_tags (post_id, tag) VALUES
(1, 'health tips'), (1, 'back to school'), (1, 'wellness'), (1, 'student health'),
(2, 'allergies'), (2, 'seasonal health'), (2, 'respiratory health'), (2, 'medication management'),
(3, 'emergency preparedness'), (3, 'safety'), (3, 'parent resources'), (3, 'medical information'),
(4, 'mental health'), (4, 'student wellbeing'), (4, 'counseling'), (4, 'stress management'),
(5, 'nutrition'), (5, 'healthy eating'), (5, 'school meals'), (5, 'dietary guidelines');

PRINT 'Sample blog posts inserted successfully.';

-- ===========================================
-- Step 16: Insert Sample Notifications
-- ===========================================
PRINT 'Step 16: Inserting Sample Notifications...';

-- Clear existing notifications
DELETE FROM notifications;

-- Get additional user IDs for notifications (reuse existing variables)
DECLARE @AdminUser INT;
SELECT @AdminUser = user_id FROM users WHERE username = 'admin';

INSERT INTO notifications (user_id, student_id, message, type, is_read, created_at, link_to) VALUES
(@ParentUser1, 'ST2025001', 'Reminder: Annual health screenings will begin on September 15th. Please ensure your child has completed all required forms and has eaten breakfast before their appointment.', 'HEALTH_REMINDER', 0, GETDATE(), '/health-events'),

(@ParentUser1, 'ST2025001', 'The annual influenza vaccination campaign will begin on November 1st in the school gymnasium. Consent forms must be returned by October 25th.', 'VACCINATION_NOTICE', 0, GETDATE(), '/vaccinations'),

(@ParentUser2, 'ST2025002', 'Your medication request for emergency albuterol inhaler has been approved. Please review the administration guidelines and contact the health office with any questions.', 'MEDICATION_UPDATE', 0, GETDATE(), '/medication-requests'),

(@ParentUser3, 'ST2025011', 'Your child''s diabetes management plan has been updated. Please review the new glucose monitoring schedule and contact the school nurse with any questions.', 'MEDICAL_UPDATE', 1, GETDATE(), '/health-records'),

(@AdminUser, NULL, 'Spring vision screening for grades 6-9 is scheduled for March 10th. Students who wear glasses should bring them to school that day.', 'HEALTH_EVENT', 1, GETDATE(), '/health-events');

PRINT 'Sample notifications inserted successfully.';

-- ===========================================
-- Final Summary
-- ===========================================
PRINT '';
PRINT '===========================================';
PRINT 'DATA INSERTION COMPLETED SUCCESSFULLY!';
PRINT '===========================================';
PRINT '';
PRINT 'Summary of inserted data:';
PRINT '- System Roles: 5 roles';
PRINT '- Grade Levels: 7 grade levels (6-12)';
PRINT '- Users: 10+ system accounts';
PRINT '- Students: 18 students across all grades';
PRINT '- Parents: 18 parents with relationships';
PRINT '- Nurses: 3 professional nurses';
PRINT '- Medications: 10 common school medications';
PRINT '- Vaccines: 10 standard school vaccines';
PRINT '- Health Checkup Types: 8 different types';
PRINT '- Health Events: 7 scheduled events';
PRINT '- Sample Health Checkups: 7 completed checkups';
PRINT '- Medication Requests: 5 sample requests';
PRINT '- Blog Posts: 5 health education articles';
PRINT '- Notifications: 5 user-specific notifications';
PRINT '';
PRINT 'All data has been inserted in English and follows';
PRINT 'realistic patterns for a school health management system.';
PRINT '';
PRINT 'Test Accounts (Password: admin123):';
PRINT '- Admin: admin / admin123';
PRINT '- Nurse: nurse.sarah / admin123';
PRINT '- Parent: parent.smith / admin123';
PRINT '- Manager: manager.johnson / admin123';
PRINT '';
PRINT 'The system is now ready for comprehensive testing!';
PRINT '===========================================';

GO
