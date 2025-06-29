-- Create vaccination_consents table
CREATE TABLE vaccination_consents (
    consent_id INT IDENTITY(1,1) PRIMARY KEY,
    event_id INT NOT NULL,
    student_code NVARCHAR(20) NOT NULL,
    consent_status NVARCHAR(20) NOT NULL DEFAULT 'PENDING',
    parent_notes NVARCHAR(MAX),
    consent_date DATETIME2,
    sent_date DATETIME2 NOT NULL DEFAULT GETDATE(),
    reminder_count INT DEFAULT 0,
    last_reminder_date DATETIME2,
    FOREIGN KEY (event_id) REFERENCES health_events(event_id) ON DELETE CASCADE,
    FOREIGN KEY (student_code) REFERENCES Students(student_code) ON DELETE CASCADE,
    UNIQUE(event_id, student_code) -- Prevent duplicate consents
);

-- Create student_vaccination_records table
CREATE TABLE student_vaccination_records (
    vaccination_record_id INT IDENTITY(1,1) PRIMARY KEY,
    event_id INT NOT NULL,
    student_code NVARCHAR(20) NOT NULL,
    vaccination_status NVARCHAR(20) NOT NULL DEFAULT 'SCHEDULED',
    scheduled_date DATE,
    vaccination_date DATE,
    vaccine_name NVARCHAR(100),
    vaccine_batch NVARCHAR(50),
    vaccine_manufacturer NVARCHAR(100),
    administered_by NVARCHAR(100),
    administration_site NVARCHAR(50),
    adverse_reactions NVARCHAR(MAX),
    notes NVARCHAR(MAX),
    consent_received_date DATETIME2,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (event_id) REFERENCES health_events(event_id) ON DELETE CASCADE,
    FOREIGN KEY (student_code) REFERENCES Students(student_code) ON DELETE CASCADE,
    UNIQUE(event_id, student_code) -- Prevent duplicate records
);

-- Add indexes for performance
CREATE INDEX IX_vaccination_consents_event_id ON vaccination_consents(event_id);
CREATE INDEX IX_vaccination_consents_student_code ON vaccination_consents(student_code);
CREATE INDEX IX_vaccination_consents_status ON vaccination_consents(consent_status);
CREATE INDEX IX_vaccination_consents_sent_date ON vaccination_consents(sent_date);

CREATE INDEX IX_student_vaccination_records_event_id ON student_vaccination_records(event_id);
CREATE INDEX IX_student_vaccination_records_student_code ON student_vaccination_records(student_code);
CREATE INDEX IX_student_vaccination_records_status ON student_vaccination_records(vaccination_status);
CREATE INDEX IX_student_vaccination_records_scheduled_date ON student_vaccination_records(scheduled_date);
CREATE INDEX IX_student_vaccination_records_vaccination_date ON student_vaccination_records(vaccination_date);

-- Add check constraints
ALTER TABLE vaccination_consents 
ADD CONSTRAINT CHK_vaccination_consents_status 
CHECK (consent_status IN ('PENDING', 'APPROVED', 'REJECTED'));

ALTER TABLE student_vaccination_records 
ADD CONSTRAINT CHK_vaccination_records_status 
CHECK (vaccination_status IN ('SCHEDULED', 'COMPLETED', 'MISSED', 'CONTRAINDICATED', 'POSTPONED'));
