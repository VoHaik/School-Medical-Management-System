-- Script to update all VARCHAR columns to NVARCHAR for storing Vietnamese characters

-- Update medical_events table
ALTER TABLE medical_events ALTER COLUMN description NVARCHAR(MAX);
ALTER TABLE medical_events ALTER COLUMN event_type NVARCHAR(255);
ALTER TABLE medical_events ALTER COLUMN severity NVARCHAR(255);
ALTER TABLE medical_events ALTER COLUMN action_taken NVARCHAR(MAX);
ALTER TABLE medical_events ALTER COLUMN medication_given NVARCHAR(255);
ALTER TABLE medical_events ALTER COLUMN status NVARCHAR(255);

-- Update medical_event_symptoms table
ALTER TABLE medical_event_symptoms ALTER COLUMN symptom NVARCHAR(255);

-- Update medication_inventory table
ALTER TABLE medication_inventory ALTER COLUMN medication_name NVARCHAR(255);
ALTER TABLE medication_inventory ALTER COLUMN dosage NVARCHAR(255);
ALTER TABLE medication_inventory ALTER COLUMN form NVARCHAR(255);
ALTER TABLE medication_inventory ALTER COLUMN instructions NVARCHAR(MAX);
ALTER TABLE medication_inventory ALTER COLUMN notes NVARCHAR(MAX);

-- Update health_declarations table 
ALTER TABLE health_declarations ALTER COLUMN status NVARCHAR(255);
ALTER TABLE health_declarations ALTER COLUMN comment NVARCHAR(MAX);

-- Update medication_requests table
ALTER TABLE medication_requests ALTER COLUMN medication_name NVARCHAR(255);
ALTER TABLE medication_requests ALTER COLUMN dosage_instructions NVARCHAR(MAX);
ALTER TABLE medication_requests ALTER COLUMN reason NVARCHAR(MAX);
ALTER TABLE medication_requests ALTER COLUMN status NVARCHAR(255);
ALTER TABLE medication_requests ALTER COLUMN admin_notes NVARCHAR(MAX);

-- Update students table
ALTER TABLE students ALTER COLUMN first_name NVARCHAR(255);
ALTER TABLE students ALTER COLUMN last_name NVARCHAR(255);
ALTER TABLE students ALTER COLUMN address NVARCHAR(MAX);
ALTER TABLE students ALTER COLUMN medical_notes NVARCHAR(MAX);

-- Update users table
ALTER TABLE users ALTER COLUMN username NVARCHAR(255);
ALTER TABLE users ALTER COLUMN password NVARCHAR(255);
ALTER TABLE users ALTER COLUMN email NVARCHAR(255);
ALTER TABLE users ALTER COLUMN first_name NVARCHAR(255);
ALTER TABLE users ALTER COLUMN last_name NVARCHAR(255);
ALTER TABLE users ALTER COLUMN phone_number NVARCHAR(20);

-- Update roles table
ALTER TABLE roles ALTER COLUMN name NVARCHAR(255);

-- Update any other tables with text columns that need to store Vietnamese
-- Add more ALTER TABLE statements as needed
