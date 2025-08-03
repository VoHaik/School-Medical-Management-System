    @echo off
title School Medical Management System - Swagger Integration

echo.
echo ===================================================
echo    School Medical Management System
echo    Swagger Integration - Quick Start
echo ===================================================
echo.

echo [INFO] Checking prerequisites...

:: Check if Maven is installed
where mvn >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Maven is not installed or not in PATH
    echo Please install Maven and try again
    pause
    exit /b 1
)

:: Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js and try again
    pause
    exit /b 1
)

:: Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed or not in PATH
    echo Please install Node.js (includes npm) and try again
    pause
    exit /b 1
)

echo [SUCCESS] All prerequisites found!
echo.

echo [INFO] Starting backend services...
echo.

:: Start backend in background
cd backend
echo [INFO] Building Maven project...
call mvn clean compile
if %errorlevel% neq 0 (
    echo [ERROR] Maven build failed!
    pause
    exit /b 1
)

echo [INFO] Starting Spring Boot application...
start "Backend Server" cmd /k "mvn spring-boot:run"

:: Wait a bit for backend to start
echo [INFO] Waiting for backend to initialize...
timeout /t 10 /nobreak >nul

:: Start frontend
cd ..\frontend
echo [INFO] Checking npm dependencies...
if not exist "node_modules\" (
    echo [INFO] Installing npm dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] npm install failed!
        pause
        exit /b 1
    )
)

echo [INFO] Starting React development server...
start "Frontend Server" cmd /k "npm start"

:: Wait a bit for frontend to start
echo [INFO] Waiting for frontend to initialize...
timeout /t 5 /nobreak >nul

:: Display information
echo.
echo ===================================================
echo    🎉 APPLICATION STARTED SUCCESSFULLY!
echo ===================================================
echo.
echo 📚 SWAGGER DOCUMENTATION:
echo    Swagger UI:      http://localhost:8080/swagger-ui.html
echo    OpenAPI JSON:    http://localhost:8080/api-docs
echo    OpenAPI YAML:    http://localhost:8080/api-docs.yaml
echo.
echo 🌐 APPLICATION URLS:
echo    Frontend App:    http://localhost:3000
echo    Backend API:     http://localhost:8080/api
echo.
echo 🔐 AUTHENTICATION GUIDE:
echo    1. Login at:     http://localhost:3000/login
echo    2. Get JWT token from browser DevTools (Network tab)
echo    3. In Swagger UI, click 'Authorize' button
echo    4. Enter:        Bearer ^<your-jwt-token^>
echo    5. Test protected endpoints
echo.
echo 📋 API CATEGORIES:
echo    🔐 Authentication       - Login, Registration
echo    🏥 Medical Events       - Medical incident management
echo    💊 Medication Requests  - Parent medication workflow
echo    👨‍🎓 Student Management   - Student profiles
echo    👩‍⚕️ Nurse Dashboard      - Nurse functionalities
echo    👨‍👩‍👧‍👦 Parent Portal       - Parent features
echo    🏛️ Admin Functions      - System administration
echo.
echo ===================================================

:: Open Swagger UI in default browser
echo [INFO] Opening Swagger UI in your default browser...
timeout /t 3 /nobreak >nul
start http://localhost:8080/swagger-ui.html

echo.
echo [INFO] Services are running in background windows
echo [INFO] Close those windows to stop the services
echo.
echo Press any key to exit this script...
pause >nul

cd ..
exit /b 0
