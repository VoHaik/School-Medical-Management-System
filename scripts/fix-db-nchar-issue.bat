@echo off
REM Script to fix the target_grade_levels column type in the database

echo Fixing target_grade_levels column type...

REM Get database connection parameters
set /p DB_SERVER="Enter database server (default: localhost): " || set DB_SERVER=localhost
set /p DB_NAME="Enter database name (default: HealthSchoolDB): " || set DB_NAME=HealthSchoolDB
set /p DB_USER="Enter database user (default: sa): " || set DB_USER=sa
set /p DB_PASSWORD="Enter database password: "

REM Run the SQL script
sqlcmd -S %DB_SERVER% -d %DB_NAME% -U %DB_USER% -P %DB_PASSWORD% -i ..\sql\fix-target-grade-levels-column.sql

echo Database column fix script executed.
pause
