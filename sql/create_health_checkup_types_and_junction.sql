-- Create health checkup types and junction table for M:N relationship
USE HealthSchoolDB;

-- Create health checkup types table
CREATE TABLE health_checkup_types (
    checkup_type_id INT IDENTITY(1,1) PRIMARY KEY,
    type_name NVARCHAR(100) NOT NULL UNIQUE,
    description NVARCHAR(500),
    is_required_measurement BIT DEFAULT 0, -- Does this checkup require height/weight measurements?
    is_required_vital_signs BIT DEFAULT 0, -- Does this checkup require vital signs (BP, HR, temp)?
    is_required_vision_test BIT DEFAULT 0, -- Does this checkup require vision testing?
    is_required_hearing_test BIT DEFAULT 0, -- Does this checkup require hearing testing?
    estimated_duration_minutes INT DEFAULT 30, -- Estimated time needed for this checkup
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);

-- Create junction table for M:N relationship between health checkup events and checkup types
CREATE TABLE health_checkup_event_types (
    event_id INT NOT NULL,
    checkup_type_id INT NOT NULL,
    is_required BIT DEFAULT 1, -- Is this checkup type mandatory for this event?
    sequence_order INT DEFAULT 1, -- Order in which checkups should be performed
    notes NVARCHAR(500), -- Additional notes for this checkup type in this event
    PRIMARY KEY (event_id, checkup_type_id),
    FOREIGN KEY (event_id) REFERENCES health_checkup_events(event_id) ON DELETE CASCADE,
    FOREIGN KEY (checkup_type_id) REFERENCES health_checkup_types(checkup_type_id) ON DELETE CASCADE
);

-- Insert common health checkup types
INSERT INTO health_checkup_types (type_name, description, is_required_measurement, is_required_vital_signs, is_required_vision_test, is_required_hearing_test, estimated_duration_minutes)
VALUES 
-- Basic checkups
('General Physical Examination', 'Comprehensive physical examination including all body systems', 1, 1, 1, 1, 45),
('Growth Assessment', 'Height, weight, BMI measurement and growth tracking', 1, 0, 0, 0, 15),
('Vital Signs Check', 'Blood pressure, heart rate, temperature, respiratory rate', 0, 1, 0, 0, 10),

-- Specialized screenings
('Vision Screening', 'Visual acuity testing and eye health assessment', 0, 0, 1, 0, 20),
('Hearing Screening', 'Audiometric testing and hearing assessment', 0, 0, 0, 1, 25),
('Dental Examination', 'Oral health assessment and dental screening', 0, 0, 0, 0, 30),
('Mental Health Screening', 'Psychological wellbeing and mental health assessment', 0, 0, 0, 0, 40),

-- Specific medical screenings
('Cardiovascular Screening', 'Heart health assessment including ECG if needed', 0, 1, 0, 0, 35),
('Respiratory Assessment', 'Lung function and respiratory health evaluation', 0, 1, 0, 0, 25),
('Musculoskeletal Check', 'Posture, spine, joint and muscle assessment', 1, 0, 0, 0, 30),
('Skin Health Assessment', 'Dermatological examination and skin condition screening', 0, 0, 0, 0, 20),

-- Annual/periodic checkups
('Annual Health Checkup', 'Comprehensive yearly health assessment', 1, 1, 1, 1, 60),
('Sports Physical', 'Pre-participation sports medicine examination', 1, 1, 0, 0, 45),
('Pre-enrollment Health Check', 'Required health screening for new students', 1, 1, 1, 1, 50),

-- Specialized programs
('Nutrition Assessment', 'Dietary habits and nutritional status evaluation', 1, 0, 0, 0, 30),
('Immunization Status Review', 'Vaccination record review and catch-up planning', 0, 0, 0, 0, 15);

-- Show created checkup types
SELECT 
    checkup_type_id,
    type_name,
    description,
    CASE WHEN is_required_measurement = 1 THEN 'Height/Weight' ELSE '' END +
    CASE WHEN is_required_vital_signs = 1 THEN CASE WHEN is_required_measurement = 1 THEN ', Vitals' ELSE 'Vitals' END ELSE '' END +
    CASE WHEN is_required_vision_test = 1 THEN CASE WHEN is_required_measurement = 1 OR is_required_vital_signs = 1 THEN ', Vision' ELSE 'Vision' END ELSE '' END +
    CASE WHEN is_required_hearing_test = 1 THEN CASE WHEN is_required_measurement = 1 OR is_required_vital_signs = 1 OR is_required_vision_test = 1 THEN ', Hearing' ELSE 'Hearing' END ELSE '' END AS required_tests,
    estimated_duration_minutes
FROM health_checkup_types
WHERE is_active = 1
ORDER BY checkup_type_id;

PRINT 'Created health checkup types and junction table successfully!';

-- Create indexes for better performance
CREATE INDEX IX_health_checkup_event_types_event_id ON health_checkup_event_types(event_id);
CREATE INDEX IX_health_checkup_event_types_checkup_type_id ON health_checkup_event_types(checkup_type_id);
CREATE INDEX IX_health_checkup_types_type_name ON health_checkup_types(type_name);
CREATE INDEX IX_health_checkup_types_active ON health_checkup_types(is_active);

PRINT 'Created indexes for optimal performance!';
