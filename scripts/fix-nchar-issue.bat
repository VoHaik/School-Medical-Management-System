@echo off
REM Batch script to fix NCHAR conversion issue
REM file: fix-nchar-issue.bat

echo Running PowerShell script to fix SQL NCHAR conversion issue...
powershell -ExecutionPolicy Bypass -File "%~dp0fix-nchar-issue.ps1"

if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to execute the PowerShell script.
    echo Please run the SQL command manually:
    echo ALTER TABLE health_checkup_events ALTER COLUMN target_grade_levels NVARCHAR(255);
    pause
    exit /b 1
)

echo.
echo Fix has been applied successfully!
echo Please restart your Spring Boot application.
pause
