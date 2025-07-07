-- Create Parent Registration Requests table
-- This table stores pending, approved, and declined parent registration requests

USE [HealthSchoolDB]
GO

-- Drop table if exists (for development only)
IF OBJECT_ID('dbo.parent_registration_requests', 'U') IS NOT NULL
    DROP TABLE dbo.parent_registration_requests;
GO

-- Create the table
CREATE TABLE parent_registration_requests (
    request_id INT IDENTITY(1,1) PRIMARY KEY,
    parent_code NVARCHAR(50) NOT NULL,
    username NVARCHAR(50) NOT NULL,
    password NVARCHAR(255) NOT NULL,
    full_name NVARCHAR(100) NOT NULL,
    email NVARCHAR(100) NOT NULL,
    phone_number NVARCHAR(20) NOT NULL,
    student_code NVARCHAR(50) NOT NULL,
    student_name NVARCHAR(100) NOT NULL,
    relationship NVARCHAR(50) NULL,
    status NVARCHAR(20) NOT NULL DEFAULT 'PENDING',
    decline_reason NVARCHAR(500) NULL,
    reviewed_by INT NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    reviewed_at DATETIME2 NULL,
    
    -- Constraints
    CONSTRAINT CK_ParentRequest_Status CHECK (status IN ('PENDING', 'APPROVED', 'DECLINED')),
    CONSTRAINT CK_ParentRequest_Relationship CHECK (relationship IN ('Cha', 'Mẹ', 'Người giám hộ', 'Ông bà', 'Khác') OR relationship IS NULL)
);
GO

-- Create indexes for better performance
CREATE INDEX IX_ParentRequest_Status ON parent_registration_requests(status);
CREATE INDEX IX_ParentRequest_ParentCode ON parent_registration_requests(parent_code);
CREATE INDEX IX_ParentRequest_Username ON parent_registration_requests(username);
CREATE INDEX IX_ParentRequest_Email ON parent_registration_requests(email);
CREATE INDEX IX_ParentRequest_CreatedAt ON parent_registration_requests(created_at);
CREATE INDEX IX_ParentRequest_ReviewedBy ON parent_registration_requests(reviewed_by);
GO

-- Add foreign key constraint for reviewed_by (references Users table)
-- Note: This assumes the Users table exists and has user_id as primary key
IF OBJECT_ID('dbo.Users', 'U') IS NOT NULL
BEGIN
    ALTER TABLE parent_registration_requests
    ADD CONSTRAINT FK_ParentRequest_ReviewedBy 
    FOREIGN KEY (reviewed_by) REFERENCES Users(user_id);
END
GO

-- Insert some sample data for testing (optional)
/*
INSERT INTO parent_registration_requests (
    parent_code, username, password, full_name, email, phone_number,
    student_code, student_name, relationship, status
) VALUES 
('PAR001', 'nguyenvanA', 'password123', N'Nguyễn Văn A', 'nguyenvana@email.com', '0123456789',
 'HS001', N'Nguyễn Thị B', N'Cha', 'PENDING'),
('PAR002', 'tranthic', 'password123', N'Trần Thị C', 'tranthic@email.com', '0987654321',
 'HS002', N'Trần Văn D', N'Mẹ', 'PENDING'),
('PAR003', 'levane', 'password123', N'Lê Văn E', 'levane@email.com', '0111222333',
 'HS003', N'Lê Thị F', N'Người giám hộ', 'APPROVED');
*/

PRINT 'Parent Registration Requests table created successfully!';
GO
