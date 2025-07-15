-- Insert test students for vaccination consent testing

-- Add more students in different grades
INSERT INTO Students (student_code, full_name, date_of_birth, gender, grade_level_id, contact_phone, address, enrollment_date, is_active)
VALUES 
-- Students in Grade 6A (grade_id = 1)
('STU002', N'Nguyễn Văn An', '2013-05-15', 'MALE', 1, '0901234567', N'123 Đường ABC, TP.HCM', '2024-09-01', 1),
('STU003', N'Trần Thị Bình', '2013-08-20', 'FEMALE', 1, '0901234568', N'456 Đường DEF, TP.HCM', '2024-09-01', 1),
('STU004', N'Lê Văn Cường', '2013-12-10', 'MALE', 1, '0901234569', N'789 Đường GHI, TP.HCM', '2024-09-01', 1),

-- Students in Grade 7A (grade_id = 4)  
('STU005', N'Phạm Thị Dung', '2012-03-25', 'FEMALE', 4, '0901234570', N'321 Đường JKL, TP.HCM', '2024-09-01', 1),
('STU006', N'Hoàng Văn Em', '2012-07-18', 'MALE', 4, '0901234571', N'654 Đường MNO, TP.HCM', '2024-09-01', 1),

-- Students in Grade 8A (grade_id = 5)
('STU007', N'Vũ Thị Giang', '2011-11-05', 'FEMALE', 5, '0901234572', N'987 Đường PQR, TP.HCM', '2024-09-01', 1),
('STU008', N'Đỗ Văn Hải', '2011-04-30', 'MALE', 5, '0901234573', N'147 Đường STU, TP.HCM', '2024-09-01', 1),

-- Students in Grade 9A (grade_id = 6) - thêm vào grade có sẵn student STU001
('STU009', N'Bùi Thị Hoa', '2010-09-12', 'FEMALE', 6, '0901234574', N'258 Đường VWX, TP.HCM', '2024-09-01', 1),
('STU010', N'Ngô Văn Khoa', '2010-01-28', 'MALE', 6, '0901234575', N'369 Đường YZ, TP.HCM', '2024-09-01', 1);

-- Verify the insert
SELECT 'New Students Added' as info;
SELECT s.student_code, s.full_name, gl.grade_name
FROM Students s
INNER JOIN grade_levels gl ON s.grade_level_id = gl.grade_id
WHERE s.student_code IN ('STU002', 'STU003', 'STU004', 'STU005', 'STU006', 'STU007', 'STU008', 'STU009', 'STU010')
ORDER BY gl.grade_id, s.student_code;
