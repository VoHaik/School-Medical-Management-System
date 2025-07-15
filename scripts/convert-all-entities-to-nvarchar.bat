@echo off
echo Converting all entities to use NVARCHAR and @Nationalized annotations
echo This script will:
echo 1. Add @Nationalized annotation to all String fields
echo 2. Update column definitions to NVARCHAR(255)
echo 3. Run SQL script to convert database columns

echo.
echo Running PowerShell script...
powershell -ExecutionPolicy Bypass -File "%~dp0convert-all-entities-to-nvarchar.ps1"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Error: Failed to execute the PowerShell script.
    echo.
    echo You can also run the SQL script manually:
    echo sqlcmd -S localhost -d HealthSchoolDB -E -i "%~dp0..\sql\convert-all-varchar-to-nvarchar.sql"
    echo.
    pause
    exit /b 1
)

echo.
echo Don't forget to rebuild the backend application:
echo cd backend
echo mvn clean package
echo.
echo And restart the application.
echo.
pause
