-- =============================================
-- Sample Data Insert Script for School Health Management System
-- This script inserts comprehensive test data into all tables
-- Run this after the database structure is created
-- =============================================

USE HealthSchoolDB;
GO

-- ===========================================
-- 1. Insert Grade Levels (if not exists)
-- ===========================================
IF NOT EXISTS (SELECT * FROM GradeLevels WHERE grade_name = 'Grade 6')
    INSERT INTO GradeLevels (grade_name, description) VALUES ('Grade 6', 'Lớp 6');

IF NOT EXISTS (SELECT * FROM GradeLevels WHERE grade_name = 'Grade 7')
    INSERT INTO GradeLevels (grade_name, description) VALUES ('Grade 7', 'Lớp 7');

IF NOT EXISTS (SELECT * FROM GradeLevels WHERE grade_name = 'Grade 8')
    INSERT INTO GradeLevels (grade_name, description) VALUES ('Grade 8', 'Lớp 8');

IF NOT EXISTS (SELECT * FROM GradeLevels WHERE grade_name = 'Grade 9')
    INSERT INTO GradeLevels (grade_name, description) VALUES ('Grade 9', 'Lớp 9');

-- ===========================================
-- 2. Insert Classes
-- ===========================================
DECLARE @Grade6Id INT, @Grade7Id INT, @Grade8Id INT, @Grade9Id INT;

SELECT @Grade6Id = grade_id FROM GradeLevels WHERE grade_name = 'Grade 6';
SELECT @Grade7Id = grade_id FROM GradeLevels WHERE grade_name = 'Grade 7';
SELECT @Grade8Id = grade_id FROM GradeLevels WHERE grade_name = 'Grade 8';
SELECT @Grade9Id = grade_id FROM GradeLevels WHERE grade_name = 'Grade 9';

-- Grade 6 Classes
INSERT INTO Classes (class_name, grade_id, academic_year) VALUES 
('6A1', @Grade6Id, '2024-2025'),
('6A2', @Grade6Id, '2024-2025'),
('6A3', @Grade6Id, '2024-2025');

-- Grade 7 Classes  
INSERT INTO Classes (class_name, grade_id, academic_year) VALUES 
('7A1', @Grade7Id, '2024-2025'),
('7A2', @Grade7Id, '2024-2025'),
('7A3', @Grade7Id, '2024-2025');

-- Grade 8 Classes
INSERT INTO Classes (class_name, grade_id, academic_year) VALUES 
('8A1', @Grade8Id, '2024-2025'),
('8A2', @Grade8Id, '2024-2025'),
('8A3', @Grade8Id, '2024-2025');

-- Grade 9 Classes
INSERT INTO Classes (class_name, grade_id, academic_year) VALUES 
('9A1', @Grade9Id, '2024-2025'),
('9A2', @Grade9Id, '2024-2025'),
('9A3', @Grade9Id, '2024-2025');

-- ===========================================
-- 3. Insert Students
-- ===========================================
DECLARE @Class6A1 INT, @Class6A2 INT, @Class7A1 INT, @Class7A2 INT, 
        @Class8A1 INT, @Class8A2 INT, @Class9A1 INT, @Class9A2 INT;

SELECT @Class6A1 = class_id FROM Classes WHERE class_name = '6A1';
SELECT @Class6A2 = class_id FROM Classes WHERE class_name = '6A2';
SELECT @Class7A1 = class_id FROM Classes WHERE class_name = '7A1';
SELECT @Class7A2 = class_id FROM Classes WHERE class_name = '7A2';
SELECT @Class8A1 = class_id FROM Classes WHERE class_name = '8A1';
SELECT @Class8A2 = class_id FROM Classes WHERE class_name = '8A2';
SELECT @Class9A1 = class_id FROM Classes WHERE class_name = '9A1';
SELECT @Class9A2 = class_id FROM Classes WHERE class_name = '9A2';

-- Insert sample students
INSERT INTO Students (student_code, full_name, date_of_birth, gender, address, phone_number, emergency_contact, emergency_phone, class_id, enrollment_date) VALUES 
-- Grade 6A1 Students
('ST2024001', N'Nguyễn Văn An', '2012-03-15', 'Male', N'123 Đường ABC, Quận 1, TP.HCM', '0901234567', N'Nguyễn Thị Lan (Mẹ)', '0987654321', @Class6A1, '2024-09-01'),
('ST2024002', N'Trần Thị Bình', '2012-05-20', 'Female', N'456 Đường DEF, Quận 2, TP.HCM', '0902345678', N'Trần Văn Nam (Bố)', '0976543210', @Class6A1, '2024-09-01'),
('ST2024003', N'Lê Minh Cường', '2012-08-10', 'Male', N'789 Đường GHI, Quận 3, TP.HCM', '0903456789', N'Lê Thị Mai (Mẹ)', '0965432109', @Class6A1, '2024-09-01'),
('ST2024004', N'Phạm Thị Dung', '2012-12-05', 'Female', N'321 Đường JKL, Quận 4, TP.HCM', '0904567890', N'Phạm Văn Hùng (Bố)', '0954321098', @Class6A1, '2024-09-01'),
('ST2024005', N'Hoàng Văn Em', '2012-04-22', 'Male', N'654 Đường MNO, Quận 5, TP.HCM', '0905678901', N'Hoàng Thị Lan (Mẹ)', '0943210987', @Class6A1, '2024-09-01'),

-- Grade 6A2 Students
('ST2024006', N'Vũ Thị Fang', '2012-06-18', 'Female', N'987 Đường PQR, Quận 6, TP.HCM', '0906789012', N'Vũ Văn Tài (Bố)', '0932109876', @Class6A2, '2024-09-01'),
('ST2024007', N'Đặng Minh Giang', '2012-09-30', 'Male', N'111 Đường STU, Quận 7, TP.HCM', '0907890123', N'Đặng Thị Hoa (Mẹ)', '0921098765', @Class6A2, '2024-09-01'),
('ST2024008', N'Bùi Thị Hạnh', '2012-11-12', 'Female', N'222 Đường VWX, Quận 8, TP.HCM', '0908901234', N'Bùi Văn Long (Bố)', '0910987654', @Class6A2, '2024-09-01'),

-- Grade 7A1 Students  
('ST2024009', N'Cao Văn Ích', '2011-07-25', 'Male', N'333 Đường YZ, Quận 9, TP.HCM', '0909012345', N'Cao Thị Phượng (Mẹ)', '0909876543', @Class7A1, '2024-09-01'),
('ST2024010', N'Đỗ Thị Kim', '2011-01-14', 'Female', N'444 Đường ABC, Quận 10, TP.HCM', '0910123456', N'Đỗ Văn Sơn (Bố)', '0908765432', @Class7A1, '2024-09-01'),
('ST2024011', N'Lý Minh Luân', '2011-10-08', 'Male', N'555 Đường DEF, Quận 11, TP.HCM', '0911234567', N'Lý Thị Nga (Mẹ)', '0907654321', @Class7A1, '2024-09-01'),

-- Grade 7A2 Students
('ST2024012', N'Mai Thị Minh', '2011-03-17', 'Female', N'666 Đường GHI, Quận 12, TP.HCM', '0912345678', N'Mai Văn Tuấn (Bố)', '0906543210', @Class7A2, '2024-09-01'),
('ST2024013', N'Nông Văn Nam', '2011-12-03', 'Male', N'777 Đường JKL, Thủ Đức, TP.HCM', '0913456789', N'Nông Thị Oanh (Mẹ)', '0905432109', @Class7A2, '2024-09-01'),

-- Grade 8A1 Students
('ST2024014', N'Ông Thị Oanh', '2010-08-21', 'Female', N'888 Đường MNO, Bình Thạnh, TP.HCM', '0914567890', N'Ông Văn Phúc (Bố)', '0904321098', @Class8A1, '2024-09-01'),
('ST2024015', N'Phan Minh Quân', '2010-05-11', 'Male', N'999 Đường PQR, Tân Bình, TP.HCM', '0915678901', N'Phan Thị Rơm (Mẹ)', '0903210987', @Class8A1, '2024-09-01'),

-- Grade 8A2 Students  
('ST2024016', N'Quách Thị Sương', '2010-02-28', 'Female', N'1010 Đường STU, Phú Nhuận, TP.HCM', '0916789012', N'Quách Văn Tâm (Bố)', '0902109876', @Class8A2, '2024-09-01'),
('ST2024017', N'Râu Văn Tú', '2010-11-09', 'Male', N'1111 Đường VWX, Gò Vấp, TP.HCM', '0917890123', N'Râu Thị Uyên (Mẹ)', '0901098765', @Class8A2, '2024-09-01'),

-- Grade 9A1 Students
('ST2024018', N'Sử Thị Vân', '2009-04-16', 'Female', N'1212 Đường YZ, Quận 1, TP.HCM', '0918901234', N'Sử Văn Xuân (Bố)', '0900987654', @Class9A1, '2024-09-01'),
('ST2024019', N'Tạ Minh Yên', '2009-09-07', 'Male', N'1313 Đường ABC, Quận 2, TP.HCM', '0919012345', N'Tạ Thị Zen (Mẹ)', '0909876543', @Class9A1, '2024-09-01'),

-- Grade 9A2 Students
('ST2024020', N'Uy Thị An', '2009-06-24', 'Female', N'1414 Đường DEF, Quận 3, TP.HCM', '0920123456', N'Uy Văn Bình (Bố)', '0908765432', @Class9A2, '2024-09-01');

-- ===========================================
-- 4. Insert Parents
-- ===========================================
INSERT INTO Parents (parent_code, full_name, relationship, phone_number, email, address, occupation) VALUES 
('PAR001', N'Nguyễn Thị Lan', 'Mother', '0987654321', 'lan.nguyen@email.com', N'123 Đường ABC, Quận 1, TP.HCM', N'Nhân viên văn phòng'),
('PAR002', N'Trần Văn Nam', 'Father', '0976543210', 'nam.tran@email.com', N'456 Đường DEF, Quận 2, TP.HCM', N'Kỹ sư'),
('PAR003', N'Lê Thị Mai', 'Mother', '0965432109', 'mai.le@email.com', N'789 Đường GHI, Quận 3, TP.HCM', N'Giáo viên'),
('PAR004', N'Phạm Văn Hùng', 'Father', '0954321098', 'hung.pham@email.com', N'321 Đường JKL, Quận 4, TP.HCM', N'Bác sĩ'),
('PAR005', N'Hoàng Thị Lan', 'Mother', '0943210987', 'lan.hoang@email.com', N'654 Đường MNO, Quận 5, TP.HCM', N'Y tá'),
('PAR006', N'Vũ Văn Tài', 'Father', '0932109876', 'tai.vu@email.com', N'987 Đường PQR, Quận 6, TP.HCM', N'Kinh doanh'),
('PAR007', N'Đặng Thị Hoa', 'Mother', '0921098765', 'hoa.dang@email.com', N'111 Đường STU, Quận 7, TP.HCM', N'Kế toán'),
('PAR008', N'Bùi Văn Long', 'Father', '0910987654', 'long.bui@email.com', N'222 Đường VWX, Quận 8, TP.HCM', N'Thợ cơ khí'),
('PAR009', N'Cao Thị Phượng', 'Mother', '0909876543', 'phuong.cao@email.com', N'333 Đường YZ, Quận 9, TP.HCM', N'Bán hàng'),
('PAR010', N'Đỗ Văn Sơn', 'Father', '0908765432', 'son.do@email.com', N'444 Đường ABC, Quận 10, TP.HCM', N'Tài xế');

-- ===========================================
-- 5. Insert Student-Parent Relationships
-- ===========================================
DECLARE @StudentId INT, @ParentId INT;

-- Student ST2024001 with Parent PAR001
SELECT @StudentId = student_id FROM Students WHERE student_code = 'ST2024001';
SELECT @ParentId = parent_id FROM Parents WHERE parent_code = 'PAR001';
INSERT INTO StudentParents (student_id, parent_id) VALUES (@StudentId, @ParentId);

-- Student ST2024002 with Parent PAR002  
SELECT @StudentId = student_id FROM Students WHERE student_code = 'ST2024002';
SELECT @ParentId = parent_id FROM Parents WHERE parent_code = 'PAR002';
INSERT INTO StudentParents (student_id, parent_id) VALUES (@StudentId, @ParentId);

-- Student ST2024003 with Parent PAR003
SELECT @StudentId = student_id FROM Students WHERE student_code = 'ST2024003';
SELECT @ParentId = parent_id FROM Parents WHERE parent_code = 'PAR003';
INSERT INTO StudentParents (student_id, parent_id) VALUES (@StudentId, @ParentId);

-- Student ST2024004 with Parent PAR004
SELECT @StudentId = student_id FROM Students WHERE student_code = 'ST2024004';
SELECT @ParentId = parent_id FROM Parents WHERE parent_code = 'PAR004';
INSERT INTO StudentParents (student_id, parent_id) VALUES (@StudentId, @ParentId);

-- Student ST2024005 with Parent PAR005
SELECT @StudentId = student_id FROM Students WHERE student_code = 'ST2024005';
SELECT @ParentId = parent_id FROM Parents WHERE parent_code = 'PAR005';
INSERT INTO StudentParents (student_id, parent_id) VALUES (@StudentId, @ParentId);

-- Continue for more students...
SELECT @StudentId = student_id FROM Students WHERE student_code = 'ST2024006';
SELECT @ParentId = parent_id FROM Parents WHERE parent_code = 'PAR006';
INSERT INTO StudentParents (student_id, parent_id) VALUES (@StudentId, @ParentId);

SELECT @StudentId = student_id FROM Students WHERE student_code = 'ST2024007';
SELECT @ParentId = parent_id FROM Parents WHERE parent_code = 'PAR007';
INSERT INTO StudentParents (student_id, parent_id) VALUES (@StudentId, @ParentId);

SELECT @StudentId = student_id FROM Students WHERE student_code = 'ST2024008';
SELECT @ParentId = parent_id FROM Parents WHERE parent_code = 'PAR008';
INSERT INTO StudentParents (student_id, parent_id) VALUES (@StudentId, @ParentId);

SELECT @StudentId = student_id FROM Students WHERE student_code = 'ST2024009';
SELECT @ParentId = parent_id FROM Parents WHERE parent_code = 'PAR009';
INSERT INTO StudentParents (student_id, parent_id) VALUES (@StudentId, @ParentId);

SELECT @StudentId = student_id FROM Students WHERE student_code = 'ST2024010';
SELECT @ParentId = parent_id FROM Parents WHERE parent_code = 'PAR010';
INSERT INTO StudentParents (student_id, parent_id) VALUES (@StudentId, @ParentId);

-- ===========================================
-- 6. Insert Nurses
-- ===========================================
INSERT INTO Nurses (nurse_code, full_name, phone_number, email, qualification, hire_date, is_active) VALUES 
('NUR001', N'Nguyễn Thị Sarah Johnson', '0911111111', 'nurse.johnson@schoolhealth.edu', N'Y tá chuyên khoa nhi', '2020-01-15', 1),
('NUR002', N'Trần Thị Mai', '0922222222', 'mai.tran.nurse@schoolhealth.edu', N'Y tá trưởng', '2018-03-20', 1),
('NUR003', N'Lê Văn Hùng', '0933333333', 'hung.le.nurse@schoolhealth.edu', N'Y tá chuyên khoa nội', '2021-07-10', 1);

-- ===========================================
-- 7. Insert Medications
-- ===========================================
INSERT INTO Medications (medication_name, description, dosage_form, strength, manufacturer, expiry_date, stock_quantity, unit_price, storage_location) VALUES 
(N'Paracetamol', N'Thuốc hạ sốt, giảm đau', 'Tablet', '500mg', N'Công ty Dược ABC', '2025-12-31', 1000, 2000.00, N'Tủ thuốc A1'),
(N'Ibuprofen', N'Thuốc chống viêm, giảm đau', 'Tablet', '200mg', N'Công ty Dược DEF', '2025-10-15', 500, 3000.00, N'Tủ thuốc A2'),
(N'Amoxicillin', N'Kháng sinh điều trị nhiễm khuẩn', 'Capsule', '250mg', N'Công ty Dược GHI', '2025-08-20', 300, 5000.00, N'Tủ thuốc B1'),
(N'Vitamin C', N'Bổ sung vitamin C', 'Tablet', '1000mg', N'Công ty Dược JKL', '2026-06-30', 2000, 1500.00, N'Tủ thuốc C1'),
(N'Cetirizine', N'Thuốc chống dị ứng', 'Tablet', '10mg', N'Công ty Dược MNO', '2025-09-25', 800, 2500.00, N'Tủ thuốc A3'),
(N'Salbutamol', N'Thuốc xịt hen suyễn', 'Inhaler', '100mcg', N'Công ty Dược PQR', '2025-11-18', 200, 15000.00, N'Tủ thuốc B2'),
(N'ORS', N'Muối bù điện giải', 'Powder', '20.5g', N'Công ty Dược STU', '2026-03-10', 1500, 3500.00, N'Tủ thuốc C2'),
(N'Betadine', N'Dung dịch sát khuẩn', 'Solution', '10%', N'Công ty Dược VWX', '2025-07-22', 100, 8000.00, N'Tủ thuốc D1'),
(N'Bandage', N'Băng y tế', 'Roll', '5cm x 5m', N'Công ty Y tế YZ', '2027-01-01', 500, 4000.00, N'Kệ vật tư E1'),
(N'Alcohol', N'Cồn y tế 70%', 'Solution', '70%', N'Công ty Hóa chất ABC', '2026-02-14', 50, 6000.00, N'Tủ hóa chất F1');

-- ===========================================
-- 8. Insert Health Checkup Types
-- ===========================================
INSERT INTO HealthCheckupTypes (type_name, description, duration_minutes, required_equipment, preparation_notes) VALUES 
(N'Khám tổng quát', N'Khám sức khỏe tổng quát định kỳ', 30, N'Stethoscope, Blood pressure monitor, Scale, Height measure', N'Học sinh cần mặc trang phục thoải mái'),
(N'Khám răng miệng', N'Kiểm tra sức khỏe răng miệng', 20, N'Dental mirror, Dental probe, Dental chair', N'Học sinh cần đánh răng sạch trước khi khám'),
(N'Khám mắt', N'Kiểm tra thị lực và sức khỏe mắt', 15, N'Snellen chart, Ophthalmoscope, Autorefractor', N'Không đeo kính áp tròng trong ngày khám'),
(N'Khám tai mũi họng', N'Kiểm tra sức khỏe tai mũi họng', 15, N'Otoscope, Rhinoscope, Tongue depressor', N'Không sử dụng thuốc nhỏ tai/mũi trước 24h'),
(N'Đo chiều cao cân nặng', N'Theo dõi phát triển thể chất', 10, N'Digital scale, Stadiometer', N'Cởi giày và đồ nặng trước khi đo'),
(N'Kiểm tra tim mạch', N'Khám tim và đo huyết áp', 20, N'Stethoscope, ECG machine, Blood pressure monitor', N'Nghỉ ngơi 10 phút trước khi đo huyết áp'),
(N'Xét nghiệm máu', N'Xét nghiệm máu cơ bản', 15, N'Blood collection kit, Centrifuge, Refrigerator', N'Nhịn ăn 8-12 tiếng trước khi xét nghiệm'),
(N'Chụp X-quang', N'Chụp X-quang phổi', 10, N'X-ray machine, Lead apron', N'Cởi đồ trang sức và đồ kim loại');

-- ===========================================
-- 9. Insert Vaccines
-- ===========================================
INSERT INTO Vaccines (vaccine_name, description, manufacturer, lot_number, expiry_date, storage_temperature, doses_required, interval_days, age_group, stock_quantity) VALUES 
(N'Vắc xin HPV', N'Vắc xin phòng ung thư cổ tử cung', N'GSK Pharma', 'HPV2024A', '2025-12-31', '2-8°C', 2, 180, N'11-13 tuổi', 500),
(N'Vắc xin Hepatitis B', N'Vắc xin phòng viêm gan B', N'Sanofi Pasteur', 'HEP2024B', '2025-10-15', '2-8°C', 3, 30, N'Mọi lứa tuổi', 300),
(N'Vắc xin Tetanus', N'Vắc xin phòng uốn ván', N'Biological E', 'TET2024C', '2025-08-20', '2-8°C', 1, 0, N'10+ tuổi', 400),
(N'Vắc xin MMR', N'Vắc xin phòng sởi, quai bị, rubella', N'Merck & Co', 'MMR2024D', '2025-09-25', '2-8°C', 2, 28, N'12 tháng - 15 tuổi', 200),
(N'Vắc xin Varicella', N'Vắc xin phòng thủy đậu', N'GSK Pharma', 'VAR2024E', '2025-11-18', '2-8°C', 2, 84, N'12 tháng - 18 tuổi', 150),
(N'Vắc xin Flu', N'Vắc xin phòng cúm mùa', N'Sanofi Pasteur', 'FLU2024F', '2025-07-22', '2-8°C', 1, 365, N'6 tháng+', 600);

-- ===========================================
-- 10. Insert Health Events
-- ===========================================
INSERT INTO HealthEvents (event_name, event_type, event_date, location, description, organizer, max_participants, registration_deadline, is_active) VALUES 
(N'Khám sức khỏe định kỳ học kỳ 1', 'Health Checkup', '2024-10-15', N'Phòng y tế trường', N'Khám sức khỏe tổng quát cho tất cả học sinh', N'Y tá Sarah Johnson', 500, '2024-10-10', 1),
(N'Tiêm vắc xin HPV cho nữ sinh lớp 6', 'Vaccination', '2024-11-20', N'Phòng y tế trường', N'Tiêm vắc xin HPV mũi 1 cho học sinh nữ lớp 6', N'Y tá Mai Trần', 50, '2024-11-15', 1),
(N'Khám răng miệng định kỳ', 'Health Checkup', '2024-12-05', N'Phòng nha khoa', N'Khám răng miệng cho học sinh lớp 7-9', N'Bác sĩ nha khoa Hùng Lê', 200, '2024-11-30', 1),
(N'Tầm soát thị lực học sinh', 'Health Screening', '2025-01-10', N'Phòng khám mắt', N'Kiểm tra thị lực và phát hiện sớm các vấn đề về mắt', N'Bác sĩ nhãn khoa', 300, '2025-01-05', 1),
(N'Chương trình giáo dục sức khỏe', 'Health Education', '2025-02-14', N'Hội trường chính', N'Giáo dục về dinh dưỡng và lối sống lành mạnh', N'Y tá Sarah Johnson', 800, '2025-02-10', 1),
(N'Tiêm vắc xin cúm mùa', 'Vaccination', '2025-03-20', N'Phòng y tế trường', N'Tiêm vắc xin phòng cúm cho toàn trường', N'Y tá Mai Trần', 600, '2025-03-15', 1);

PRINT 'Sample data insertion completed successfully!';
PRINT 'Total records inserted:';
PRINT '- Grade Levels: 4';
PRINT '- Classes: 12'; 
PRINT '- Students: 20';
PRINT '- Parents: 10';
PRINT '- Student-Parent Relationships: 10';
PRINT '- Nurses: 3';
PRINT '- Medications: 10';
PRINT '- Health Checkup Types: 8';
PRINT '- Vaccines: 6';
PRINT '- Health Events: 6';
GO
