-- Create health_checkup table for storing health checkup results
CREATE TABLE health_checkup (
    checkup_id BIGINT PRIMARY KEY IDENTITY(1,1),
    student_id VARCHAR(50) NOT NULL,
    event_id BIGINT,
    checkup_date DATE NOT NULL,
    conducted_by VARCHAR(100),
    
    -- Basic measurements
    height DECIMAL(5,2), -- cm
    weight DECIMAL(5,2), -- kg
    bmi DECIMAL(4,2),
    blood_pressure_systolic INT,
    blood_pressure_diastolic INT,
    heart_rate INT,
    temperature DECIMAL(4,2), -- celsius
    
    -- Vision and hearing
    vision_left VARCHAR(20),
    vision_right VARCHAR(20),
    hearing_left VARCHAR(20),
    hearing_right VARCHAR(20),
    
    -- General health status
    general_health_status VARCHAR(50) DEFAULT 'Normal',
    health_notes TEXT,
    recommendations TEXT,
    
    -- Follow-up requirements
    requires_follow_up BIT DEFAULT 0,
    follow_up_date DATE,
    follow_up_notes TEXT,
    
    -- Administrative fields
    status VARCHAR(20) DEFAULT 'Completed', -- Completed, Pending, Cancelled
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    created_by VARCHAR(50),
    updated_by VARCHAR(50),
    
    -- Foreign key constraints
    CONSTRAINT FK_health_checkup_student FOREIGN KEY (student_id) REFERENCES users(username),
    CONSTRAINT FK_health_checkup_event FOREIGN KEY (event_id) REFERENCES health_events(event_id)
);

-- Create indexes for better performance
CREATE INDEX IX_health_checkup_student_id ON health_checkup(student_id);
CREATE INDEX IX_health_checkup_date ON health_checkup(checkup_date);
CREATE INDEX IX_health_checkup_event_id ON health_checkup(event_id);
CREATE INDEX IX_health_checkup_status ON health_checkup(status);

-- Create trigger for updating updated_at timestamp (run separately)
GO
CREATE TRIGGER TR_health_checkup_update 
ON health_checkup
AFTER UPDATE
AS
BEGIN
    UPDATE health_checkup 
    SET updated_at = GETDATE()
    WHERE checkup_id IN (SELECT checkup_id FROM inserted);
END;
GO
