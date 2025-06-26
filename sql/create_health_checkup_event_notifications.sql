-- Tạo bảng liên kết giữa sự kiện và các lớp cần thông báo
CREATE TABLE health_checkup_event_notifications (
    id INT IDENTITY(1,1) PRIMARY KEY,
    event_id INT NOT NULL,
    class_id NVARCHAR(50) NOT NULL,
    notification_sent BIT DEFAULT 0,
    sent_date DATETIME NULL,
    CONSTRAINT FK_EventNotification_Event FOREIGN KEY (event_id) REFERENCES health_checkup_events(event_id) ON DELETE CASCADE
);

-- Tạo index để tăng tốc độ truy vấn
CREATE INDEX IX_health_checkup_event_notifications_event_id ON health_checkup_event_notifications(event_id);
CREATE INDEX IX_health_checkup_event_notifications_class_id ON health_checkup_event_notifications(class_id);
