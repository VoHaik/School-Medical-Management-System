-- Add more test students for parent testing
INSERT INTO [students] ([student_code], [full_name], [first_name], [last_name], [gender], [date_of_birth], [grade_level_id])
VALUES 
('STU002', N'Emily Johnson', N'Emily', N'Johnson', 'Female', '2015-08-15', 1),
('STU003', N'Michael Johnson', N'Michael', N'Johnson', 'Male', '2017-12-03', 4);

-- Add parent-student relationships
INSERT INTO [parent_student_relationships] ([parent_code], [student_code], [relationship_type])
VALUES 
('PAR001', 'STU002', 'Parent'),
('PAR001', 'STU003', 'Parent');

-- Verify the students and relationships
SELECT s.[student_code], s.[full_name], s.[gender], gl.[grade_name], psr.[parent_code]
FROM [students] s
LEFT JOIN [grade_levels] gl ON s.[grade_level_id] = gl.[grade_id]
LEFT JOIN [parent_student_relationships] psr ON s.[student_code] = psr.[student_code]
WHERE psr.[parent_code] = 'PAR001'
ORDER BY s.[student_code];
