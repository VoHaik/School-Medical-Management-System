-- Script to fix the conversion issue from text to NCHAR
-- This script alters the target_grade_levels column to use NVARCHAR which better handles Unicode strings

-- First backup the existing data
SELECT * INTO health_checkup_events_backup FROM health_checkup_events;

-- Alter the column type
ALTER TABLE health_checkup_events
ALTER COLUMN target_grade_levels NVARCHAR(255);
