@echo off
echo School Medical Management System - Quick Fix and Start
echo ================================================
echo.

REM First run the connection fix script
echo Step 1: Running connection fixes...
powershell -ExecutionPolicy Bypass -File .\fix-connection-issues.ps1
if %ERRORLEVEL% neq 0 (
    echo Error running fix-connection-issues.ps1
    pause
    exit /b 1
)

REM Kill any existing processes
echo.
echo Step 2: Killing any existing processes on relevant ports...
powershell -ExecutionPolicy Bypass -File .\kill-all-ports.ps1
if %ERRORLEVEL% neq 0 (
    echo Warning: Could not kill all processes. Some ports might still be in use.
)

REM Start backend in a new window
echo.
echo Step 3: Starting backend with Java 17+ (new window)...
start "School Health Management Backend" powershell -ExecutionPolicy Bypass -File .\start-with-java17.ps1

REM Wait for backend to start
echo Waiting 10 seconds for backend to initialize...
timeout /t 10 /nobreak > nul

REM Start frontend in a new window
echo.
echo Step 4: Starting frontend (new window)...
start "School Health Management Frontend" cmd /c cd frontend ^&^& npm start

echo.
echo All services should be starting. Please wait for the browser to open.
echo.
echo If you need to test the connection separately, run:
echo   powershell -ExecutionPolicy Bypass -File .\test-connection.ps1
echo.
echo Login credentials:
echo   Username: parent.smith
echo   Password: Password123
echo.
echo Press any key to exit...
pause > nul
