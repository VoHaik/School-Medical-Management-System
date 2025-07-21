-- =============================================
-- Additional Sample Data for Health Records
-- Run this after sample-data-insert.sql
-- =============================================

USE HealthSchoolDB;
GO

-- ===========================================
-- 11. Insert Health Declarations
-- ===========================================
DECLARE @Student1 INT, @Student2 INT, @Student3 INT, @Student4 INT, @Student5 INT;
SELECT @Student1 = student_id FROM Students WHERE student_code = 'ST2024001';
SELECT @Student2 = student_id FROM Students WHERE student_code = 'ST2024002';  
SELECT @Student3 = student_id FROM Students WHERE student_code = 'ST2024003';
SELECT @Student4 = student_id FROM Students WHERE student_code = 'ST2024004';
SELECT @Student5 = student_id FROM Students WHERE student_code = 'ST2024005';

INSERT INTO HealthDeclarations (student_id, declaration_date, has_fever, has_cough, has_difficulty_breathing, has_sore_throat, has_headache, has_fatigue, has_nausea, has_allergies, allergy_details, current_medications, medical_conditions, emergency_contact_change, additional_notes, declaration_status, reviewed_by, reviewed_date) VALUES 
(@Student1, '2024-09-01', 0, 0, 0, 0, 0, 0, 0, 1, N'Dị ứng phấn hoa', N'Vitamin C hàng ngày', N'Không có bệnh lý mạn tính', NULL, N'Em có thể hắt hơi khi trời lạnh', 'Approved', 'nurse.johnson', '2024-09-02'),
(@Student2, '2024-09-01', 0, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, N'Cận thị nhẹ', NULL, N'Em đeo kính cận từ năm ngoái', 'Approved', 'nurse.johnson', '2024-09-02'),
(@Student3, '2024-09-01', 0, 1, 0, 0, 0, 0, 0, 0, NULL, N'Siro ho cho trẻ em', NULL, NULL, N'Em bị ho khan do thời tiết', 'Pending', NULL, NULL),
(@Student4, '2024-09-01', 0, 0, 0, 0, 0, 0, 0, 1, N'Dị ứng tôm cua', NULL, N'Hen phế quản nhẹ', NULL, N'Em cần tránh các món có hải sản', 'Approved', 'nurse.johnson', '2024-09-02'),
(@Student5, '2024-09-01', 0, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, N'Thay đổi số điện thoại khẩn cấp: 0999888777', N'Sức khỏe bình thường', 'Approved', 'nurse.johnson', '2024-09-02');

-- ===========================================
-- 12. Insert Student Health Checkups
-- ===========================================
DECLARE @HealthEvent1 INT, @CheckupType1 INT, @CheckupType2 INT, @Nurse1 INT;
SELECT @HealthEvent1 = event_id FROM HealthEvents WHERE event_name = N'Khám sức khỏe định kỳ học kỳ 1';
SELECT @CheckupType1 = type_id FROM HealthCheckupTypes WHERE type_name = N'Khám tổng quát';
SELECT @CheckupType2 = type_id FROM HealthCheckupTypes WHERE type_name = N'Đo chiều cao cân nặng';
SELECT @Nurse1 = nurse_id FROM Nurses WHERE nurse_code = 'NUR001';

INSERT INTO StudentHealthCheckups (student_id, event_id, checkup_type_id, checkup_date, performed_by, height_cm, weight_kg, blood_pressure_systolic, blood_pressure_diastolic, heart_rate_bpm, temperature_celsius, vision_left, vision_right, hearing_test_result, dental_condition, general_health_status, findings, recommendations, follow_up_required, next_checkup_date) VALUES 
(@Student1, @HealthEvent1, @CheckupType1, '2024-10-15', @Nurse1, 145.0, 38.5, 110, 70, 85, 36.5, '20/20', '20/25', N'Bình thường', N'Tốt', 'Normal', N'Sức khỏe tổng quát tốt, thị lực mắt phải hơi kém', N'Kiểm tra mắt chuyên khoa', 1, '2025-04-15'),
(@Student2, @HealthEvent1, @CheckupType1, '2024-10-15', @Nurse1, 142.0, 35.2, 108, 68, 88, 36.3, '20/40', '20/40', N'Bình thường', N'Tốt', 'Normal', N'Đã cận thị, cần theo dõi', N'Đeo kính đúng độ, hạn chế màn hình', 0, '2025-04-15'),
(@Student3, @HealthEvent1, @CheckupType1, '2024-10-15', @Nurse1, 148.0, 42.1, 115, 75, 90, 37.0, '20/20', '20/20', N'Bình thường', N'Khá', 'Normal', N'Có triệu chứng ho khan, nhiệt độ hơi cao', N'Nghỉ ngơi, uống nhiều nước', 1, '2025-04-15'),
(@Student4, @HealthEvent1, @CheckupType1, '2024-10-15', @Nurse1, 140.0, 33.8, 105, 65, 82, 36.2, '20/20', '20/20', N'Bình thường', N'Tốt', 'Normal', N'Sức khỏe ổn định, hen phế quản được kiểm soát', N'Tiếp tục thuốc theo chỉ định bác sĩ', 0, '2025-04-15'),
(@Student5, @HealthEvent1, @CheckupType1, '2024-10-15', @Nurse1, 146.0, 39.0, 112, 72, 86, 36.4, '20/20', '20/20', N'Bình thường', N'Tốt', 'Normal', N'Sức khỏe rất tốt', N'Duy trì lối sống lành mạnh', 0, '2025-04-15');

-- ===========================================
-- 13. Insert Student Vaccination Records
-- ===========================================
DECLARE @Vaccine1 INT, @Vaccine2 INT, @VaccEvent INT;
SELECT @Vaccine1 = vaccine_id FROM Vaccines WHERE vaccine_name = N'Vắc xin HPV';
SELECT @Vaccine2 = vaccine_id FROM Vaccines WHERE vaccine_name = N'Vắc xin Hepatitis B';
SELECT @VaccEvent = event_id FROM HealthEvents WHERE event_name = N'Tiêm vắc xin HPV cho nữ sinh lớp 6';

-- Only female grade 6 students get HPV vaccine
INSERT INTO StudentVaccinationRecords (student_id, vaccine_id, event_id, vaccination_date, administered_by, dose_number, batch_number, injection_site, adverse_reactions, next_dose_due, vaccination_status, notes) VALUES 
(@Student2, @Vaccine1, @VaccEvent, '2024-11-20', @Nurse1, 1, 'HPV2024A-001', N'Cánh tay trái', N'Không', '2025-05-20', 'Completed', N'Tiêm thành công, không có phản ứng phụ'),
(@Student4, @Vaccine1, @VaccEvent, '2024-11-20', @Nurse1, 1, 'HPV2024A-002', N'Cánh tay phải', N'Đau nhẹ tại chỗ tiêm', '2025-05-20', 'Completed', N'Có phản ứng nhẹ, đã hướng dẫn chăm sóc');

-- Hepatitis B for other students  
INSERT INTO StudentVaccinationRecords (student_id, vaccine_id, vaccination_date, administered_by, dose_number, batch_number, injection_site, adverse_reactions, vaccination_status, notes) VALUES 
(@Student1, @Vaccine2, '2024-09-15', @Nurse1, 1, 'HEP2024B-001', N'Cánh tay trái', N'Không', 'Completed', N'Mũi 1/3 vắc xin Hepatitis B'),
(@Student3, @Vaccine2, '2024-09-15', @Nurse1, 1, 'HEP2024B-002', N'Cánh tay phải', N'Sốt nhẹ', 'Completed', N'Mũi 1/3 vắc xin Hepatitis B, có sốt nhẹ 1 ngày'),
(@Student5, @Vaccine2, '2024-09-15', @Nurse1, 1, 'HEP2024B-003', N'Cánh tay trái', N'Không', 'Completed', N'Mũi 1/3 vắc xin Hepatitis B');

-- ===========================================
-- 14. Insert Medication Requests
-- ===========================================
DECLARE @Parent1 INT, @Parent2 INT, @Parent3 INT;
SELECT @Parent1 = parent_id FROM Parents WHERE parent_code = 'PAR001';
SELECT @Parent2 = parent_id FROM Parents WHERE parent_code = 'PAR003';
SELECT @Parent3 = parent_id FROM Parents WHERE parent_code = 'PAR005';

DECLARE @Med1 INT, @Med2 INT, @Med3 INT;
SELECT @Med1 = medication_id FROM Medications WHERE medication_name = N'Paracetamol';
SELECT @Med2 = medication_id FROM Medications WHERE medication_name = N'Cetirizine';
SELECT @Med3 = medication_id FROM Medications WHERE medication_name = N'Salbutamol';

INSERT INTO MedicationRequests (student_id, parent_id, medication_id, requested_quantity, dosage_instructions, reason_for_request, frequency, duration_days, special_instructions, request_status, requested_date, approved_by, approved_date, dispensed_by, dispensed_date, notes) VALUES 
(@Student1, @Parent1, @Med1, 10, N'1 viên khi sốt trên 38°C', N'Em bị sốt do cảm lạnh', N'Khi cần thiết', 5, N'Uống sau ăn, không quá 4 viên/ngày', 'Approved', '2024-10-20', 'nurse.johnson', '2024-10-21', 'nurse.johnson', '2024-10-21', N'Đã cấp thuốc cho phụ huynh'),
(@Student3, @Parent2, @Med2, 7, N'1/2 viên mỗi tối', N'Em bị dị ứng phấn hoa', N'Mỗi ngày 1 lần', 7, N'Uống vào buổi tối trước khi ngủ', 'Pending', '2024-10-22', NULL, NULL, NULL, NULL, N'Chờ y tá phê duyệt'),
(@Student5, @Parent3, @Med3, 1, N'2 xịt khi khó thở', N'Em có triệu chứng hen suyễn', N'Khi cần thiết', 30, N'Lắc đều trước khi sử dụng', 'Approved', '2024-10-18', 'nurse.johnson', '2024-10-19', 'nurse.johnson', '2024-10-19', N'Đã hướng dẫn cách sử dụng cho học sinh');

-- ===========================================
-- 15. Insert Blog Posts (Health Education Content)
-- ===========================================
INSERT INTO BlogPosts (title, content, author, category, tags, published_date, is_published, view_count, featured_image_url, summary) VALUES 
(N'Tầm quan trọng của việc rửa tay đúng cách', 
 N'Rửa tay là một trong những cách đơn giản nhất để ngăn ngừa sự lây lan của vi khuẩn và virus...', 
 'nurse.johnson', 'Health Tips', 'hygiene,handwashing,prevention', '2024-10-01', 1, 45, 
 '/images/handwashing.jpg', N'Hướng dẫn chi tiết về kỹ thuật rửa tay đúng cách'),

(N'Dinh dưỡng cân bằng cho học sinh', 
 N'Dinh dưỡng đóng vai trò quan trọng trong sự phát triển thể chất và trí tuệ của học sinh...', 
 'nurse.johnson', 'Nutrition', 'nutrition,healthy eating,students', '2024-10-05', 1, 67, 
 '/images/nutrition.jpg', N'Hướng dẫn xây dựng chế độ ăn uống lành mạnh cho trẻ em'),

(N'Phòng chống cận thị ở học sinh', 
 N'Tỷ lệ cận thị ở học sinh đang tăng cao. Dưới đây là những cách phòng ngừa hiệu quả...', 
 'nurse.johnson', 'Eye Health', 'vision,myopia,prevention,eye care', '2024-10-10', 1, 89, 
 '/images/eye-care.jpg', N'Các biện pháp bảo vệ thị lực cho học sinh'),

(N'Xử lý chấn thương thể thao ở trường học', 
 N'Hướng dẫn sơ cứu và xử lý các chấn thương thường gặp khi chơi thể thao...', 
 'nurse.johnson', 'Sports Medicine', 'sports,injury,first aid,safety', '2024-10-15', 1, 123, 
 '/images/sports-injury.jpg', N'Kỹ năng sơ cứu cơ bản cho chấn thương thể thao'),

(N'Tác hại của việc sử dụng thiết bị điện tử quá nhiều', 
 N'Việc sử dụng điện thoại, máy tính bảng quá nhiều có thể gây ra những tác hại gì?...', 
 'nurse.johnson', 'Digital Health', 'screen time,digital wellness,health', '2024-10-20', 1, 156, 
 '/images/screen-time.jpg', N'Hướng dẫn sử dụng thiết bị điện tử một cách an toàn');

-- ===========================================
-- 16. Insert Medication Inventory Transactions  
-- ===========================================
INSERT INTO MedicationInventoryTransactions (medication_id, transaction_type, quantity, unit_price, total_amount, transaction_date, reference_number, supplier_name, expiry_date, notes, performed_by) VALUES 
(@Med1, 'Purchase', 500, 2000.00, 1000000.00, '2024-09-01', 'PO2024001', N'Công ty Dược ABC', '2025-12-31', N'Mua bổ sung thuốc hạ sốt', 'nurse.johnson'),
(@Med2, 'Purchase', 200, 2500.00, 500000.00, '2024-09-05', 'PO2024002', N'Công ty Dược MNO', '2025-09-25', N'Mua thuốc chống dị ứng', 'nurse.johnson'),
(@Med3, 'Purchase', 50, 15000.00, 750000.00, '2024-09-10', 'PO2024003', N'Công ty Dược PQR', '2025-11-18', N'Mua thuốc xịt hen suyễn', 'nurse.johnson'),
(@Med1, 'Dispensed', -10, 2000.00, -20000.00, '2024-10-21', 'DISP2024001', NULL, NULL, N'Cấp thuốc cho học sinh ST2024001', 'nurse.johnson'),
(@Med2, 'Dispensed', -7, 2500.00, -17500.00, '2024-10-19', 'DISP2024002', NULL, NULL, N'Cấp thuốc cho học sinh ST2024003', 'nurse.johnson'),
(@Med3, 'Dispensed', -1, 15000.00, -15000.00, '2024-10-19', 'DISP2024003', NULL, NULL, N'Cấp thuốc cho học sinh ST2024005', 'nurse.johnson');

PRINT 'Additional health records data insertion completed!';
PRINT 'Additional records inserted:';
PRINT '- Health Declarations: 5';
PRINT '- Student Health Checkups: 5';
PRINT '- Student Vaccination Records: 5';
PRINT '- Medication Requests: 3';
PRINT '- Blog Posts: 5';
PRINT '- Medication Inventory Transactions: 6';
GO
