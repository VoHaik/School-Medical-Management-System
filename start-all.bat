
@echo off
echo Starting School Health Management System...
echo.
echo This script will start all components of the application:
echo 1. Java Spring Boot API
echo 2. Node.js Backend Server
echo 3. React Frontend
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause > nul

echo.
echo Starting backend services...
start cmd /k "title Backend Services && start-backend.bat"

echo.
echo Starting frontend...
start cmd /k "title React Frontend && set PORT=3000 && start-frontend.bat"

echo.
echo All services are starting. Please wait a moment for them to initialize.
echo.
echo Access the application at:
echo - Frontend (development mode): http://localhost:3000
echo - Backend API: http://localhost:8080
echo - Node.js server: http://localhost:5000
echo.
echo Note: If you encounter "localhost refused to connect" error:
echo 1. Wait a bit longer for services to fully initialize
echo 2. Check the command windows for any error messages
echo 3. Try restarting the application if needed
echo.
echo Press any key to exit this window...
pause > nul
