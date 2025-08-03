@echo off
echo.
echo =====================================
echo   🔧 Fixing Swagger UI Issue
echo =====================================
echo.

echo [INFO] Stopping existing Spring Boot processes...
taskkill /f /im java.exe 2>nul

echo [INFO] Waiting for processes to stop...
timeout /t 3 /nobreak >nul

echo [INFO] Navigating to backend directory...
cd backend

echo [INFO] Cleaning Maven project...
call mvn clean

echo [INFO] Compiling project...
call mvn compile

if %errorlevel% neq 0 (
    echo [ERROR] Maven compile failed!
    pause
    exit /b 1
)

echo [INFO] Starting Spring Boot application...
echo [INFO] Please wait for application to start...
echo.

start "Spring Boot Backend" cmd /k "mvn spring-boot:run"

echo [INFO] Waiting for application to initialize...
timeout /t 15 /nobreak >nul

echo.
echo =====================================
echo   🎯 Testing Swagger URLs
echo =====================================
echo.
echo 📍 Try these URLs in order:
echo.
echo 1. Main Swagger UI:
echo    http://localhost:8080/swagger-ui/index.html
echo.
echo 2. Alternative Swagger UI:
echo    http://localhost:8080/swagger-ui.html
echo.
echo 3. OpenAPI JSON:
echo    http://localhost:8080/v3/api-docs
echo.
echo 4. Health Check:
echo    http://localhost:8080/actuator/health
echo.

echo [INFO] Opening primary Swagger URL...
start http://localhost:8080/swagger-ui/index.html

echo.
echo [INFO] If the first URL doesn't work, try:
echo [INFO] http://localhost:8080/swagger-ui.html
echo.

echo Press any key to exit...
pause >nul
cd ..
