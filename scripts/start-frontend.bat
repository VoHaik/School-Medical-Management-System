@echo off
echo Starting School Health Management System Frontend...
echo.

REM Get the directory of the script itself
set SCRIPT_DIR=%~dp0

REM Navigate to the project root (one level up from scripts)
cd /D "%SCRIPT_DIR%..\"

echo Current directory after navigating to root: %CD%

cd frontend || (
    echo Error: Could not change directory to frontend from %CD%
    pause
    exit /b 1
)

echo Successfully changed to frontend directory: %CD%
echo Installing dependencies...
call npm install || (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)
echo.
echo Starting React development server...
echo.
echo If the browser doesn't open automatically, navigate to http://localhost:3000
echo.
echo Setting PORT environment variable to ensure React uses port 3000...
set PORT=3000
call npm start || (
    echo Error: Failed to start React development server
    pause
    exit /b 1
)
