-- Script to ensure role name consistency for nurse accounts
-- This script makes sure roles have consistent prefixes with the ERole.java definitions
-- Date: June 22, 2025

USE [HealthSchoolDB];
GO

-- Show current role names
SELECT role_id, role_name, description FROM Roles;

-- Fix role names to match ERole.java enum names with ROLE_ prefix
-- Only update if the role names don't already have the ROLE_ prefix
UPDATE Roles SET role_name = 'ROLE_ADMIN' WHERE role_name = 'Admin';
UPDATE Roles SET role_name = 'ROLE_SCHOOLNURSE' WHERE role_name = 'SchoolNurse'; -- Important: Use ROLE_SCHOOLNURSE, not ROLE_NURSE
UPDATE Roles SET role_name = 'ROLE_PARENT' WHERE role_name = 'Parent';
UPDATE Roles SET role_name = 'ROLE_STUDENT' WHERE role_name = 'Student';

-- Show updated role names to confirm changes
SELECT role_id, role_name, description FROM Roles;
GO
