-- Sample vaccination consent data
-- (Run this after creating a vaccination event)

-- Insert sample vaccination consents for students in grade 6A
-- Note: Replace event_id with actual vaccination event ID
INSERT INTO vaccination_consents (event_id, student_code, consent_status, sent_date)
VALUES 
(1, 'STU001', 'PENDING', GETDATE()),
(1, 'STU002', 'APPROVED', GETDATE()),
(1, 'STU003', 'PENDING', GETDATE()),
(1, 'STU004', 'REJECTED', GETDATE());

-- Insert vaccination records for approved students
INSERT INTO student_vaccination_records (
    event_id, student_code, vaccination_status, scheduled_date, 
    consent_received_date, created_at, updated_at
)
VALUES 
(1, 'STU002', 'SCHEDULED', '2025-07-01', GETDATE(), GETDATE(), GETDATE());

-- Sample completed vaccination record
INSERT INTO student_vaccination_records (
    event_id, student_code, vaccination_status, scheduled_date, vaccination_date,
    vaccine_name, vaccine_batch, vaccine_manufacturer, administered_by, 
    administration_site, consent_received_date, created_at, updated_at
)
VALUES 
(1, 'STU005', 'COMPLETED', '2025-06-25', '2025-06-25', 
'COVID-19 Vaccine', 'BATCH001', 'Pfizer', 'Nurse Johnson', 
'Left arm', GETDATE(), GETDATE(), GETDATE());
