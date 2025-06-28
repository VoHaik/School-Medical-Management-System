-- SQL script to create pending_registrations table
-- This table stores parent registration requests awaiting admin approval

-- Create pending_registrations table
CREATE TABLE pending_registrations (
    id INT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(50) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    full_name NVARCHAR(100) NOT NULL,
    email NVARCHAR(100) NOT NULL,
    phone_number NVARCHAR(20) NULL,
    gender NVARCHAR(10) NULL,
    address NVARCHAR(255) NULL,
    emergency_contact NVARCHAR(50) NULL,
    relationship_with_student NVARCHAR(50) NULL,
    parent_code NVARCHAR(50) NOT NULL,
    student_code NVARCHAR(50) NOT NULL,
    student_full_name NVARCHAR(100) NOT NULL,
    student_date_of_birth DATETIME NULL,
    student_class NVARCHAR(50) NULL,
    status NVARCHAR(20) NOT NULL DEFAULT 'PENDING',
    requested_at DATETIME NOT NULL DEFAULT GETDATE(),
    processed_at DATETIME NULL,
    processed_by_user_id INT NULL,
    admin_notes NVARCHAR(500) NULL,
    rejection_reason NVARCHAR(500) NULL,
    
    -- Foreign key constraints
    CONSTRAINT FK_pending_registrations_processed_by FOREIGN KEY (processed_by_user_id) 
        REFERENCES Users(user_id),
    
    -- Check constraints
    CONSTRAINT CK_pending_registrations_status 
        CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED'))
);

-- Create indexes for better performance
CREATE INDEX IX_pending_registrations_status ON pending_registrations(status);
CREATE INDEX IX_pending_registrations_student_code ON pending_registrations(student_code);
CREATE INDEX IX_pending_registrations_requested_at ON pending_registrations(requested_at);
CREATE INDEX IX_pending_registrations_email ON pending_registrations(email);

-- Add some sample test data (optional)
-- This should be removed in production
/*
INSERT INTO pending_registrations (
    username, password, full_name, email, phone_number, gender,
    address, emergency_contact, relationship_with_student,
    student_code, student_full_name, student_date_of_birth, student_class
) VALUES (
    'test.parent1', 
    '$2a$10$example.hashed.password.for.testing.purposes', 
    'Test Parent 1', 
    'test.parent1@example.com', 
    '0123456789', 
    'Male',
    '123 Test Street, Test City', 
    '0987654321', 
    'Father',
    'STU001', 
    'Test Student 1', 
    '2010-01-15 00:00:00', 
    '5A'
);
*/

PRINT 'pending_registrations table created successfully';
