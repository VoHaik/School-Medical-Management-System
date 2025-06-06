@echo off
echo Starting School Health Management System Backend...
echo.
echo 1. Starting Java Spring Boot API...
start cmd /k "mvn spring-boot:run"
echo.
echo 2. Starting Node.js Backend Server...
cd backend
echo Installing dependencies...
call npm install
echo.
echo Starting Node.js server...
call npm start
echo.
echo Backend services are now running.
echo - Java API: http://localhost:8080
echo - Node.js Server: http://localhost:5000