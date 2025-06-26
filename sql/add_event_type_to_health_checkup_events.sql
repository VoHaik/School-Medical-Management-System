-- Thêm trường event_type vào bảng health_checkup_events
ALTER TABLE health_checkup_events
ADD event_type VARCHAR(50) NOT NULL DEFAULT 'HEALTH_CHECKUP';

-- Cập nhật trường event_type để sử dụng NVARCHAR (hỗ trợ Unicode)
ALTER TABLE health_checkup_events ALTER COLUMN event_type NVARCHAR(50) NOT NULL;
