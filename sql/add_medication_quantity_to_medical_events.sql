-- Script SQL để thêm cột medication_quantity vào bảng medical_events
USE [HealthSchoolDB]
GO

-- Kiểm tra xem cột đã tồn tại chưa
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[medical_events]') AND name = 'medication_quantity')
BEGIN
    -- Thêm cột medication_quantity
    ALTER TABLE [dbo].[medical_events]
    ADD [medication_quantity] INT NULL
    
    PRINT 'Đã thêm cột medication_quantity vào bảng medical_events'
END
ELSE
BEGIN
    PRINT 'Cột medication_quantity đã tồn tại trong bảng medical_events'
END
GO

-- Cập nhật giá trị mặc định cho cột medication_quantity
UPDATE [dbo].[medical_events]
SET [medication_quantity] = 1
WHERE [medication_given] IS NOT NULL AND [medication_given] <> '' AND [medication_quantity] IS NULL
GO
