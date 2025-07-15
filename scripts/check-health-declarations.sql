-- Query to check all health declarations
SELECT declaration_id, student_code, status, declaration_date, reviewed_at, reviewed_by_user_id, review_notes 
FROM health_declaration 
ORDER BY declaration_id;

-- Count health declarations by status
SELECT status, COUNT(*) as count 
FROM health_declaration 
GROUP BY status;

-- Check specifically for PENDING health declarations
SELECT declaration_id, student_code, status, declaration_date
FROM health_declaration 
WHERE status = 'PENDING'
ORDER BY declaration_date DESC;

-- Check health declarations for a specific student
-- Replace 'STU001' with the actual student code you want to check
SELECT declaration_id, status, declaration_date, reviewed_at, reviewed_by_user_id, review_notes
FROM health_declaration 
WHERE student_code = 'STU001'
ORDER BY declaration_date DESC;
