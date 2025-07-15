-- Create junction table for many-to-many relationship between health_events and grade_levels
CREATE TABLE health_event_grade_levels (
    event_id INT NOT NULL,
    grade_id INT NOT NULL,
    
    PRIMARY KEY (event_id, grade_id),
    
    FOREIGN KEY (event_id) REFERENCES health_events(event_id) ON DELETE CASCADE,
    FOREIGN KEY (grade_id) REFERENCES grade_levels(grade_id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IX_health_event_grade_levels_event_id ON health_event_grade_levels(event_id);
CREATE INDEX IX_health_event_grade_levels_grade_id ON health_event_grade_levels(grade_id);
