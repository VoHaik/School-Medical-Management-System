@echo off
echo ====================================
echo Swagger Integration Test Script
echo ====================================
echo.

echo Starting backend server...
cd /d "%~dp0backend"
start "Backend Server" cmd /c "mvn spring-boot:run"

echo Waiting for server to start (30 seconds)...
timeout /t 30 /nobreak > nul

echo.
echo Testing Swagger endpoints:
echo.

echo 1. Testing Swagger UI page:
curl -s -o nul -w "%%{http_code}" http://localhost:8080/swagger-ui/index.html
if %ERRORLEVEL%==0 (
    echo ✅ Swagger UI accessible
) else (
    echo ❌ Swagger UI not accessible
)

echo.
echo 2. Testing API docs JSON:
curl -s -o nul -w "%%{http_code}" http://localhost:8080/v3/api-docs
if %ERRORLEVEL%==0 (
    echo ✅ API docs JSON accessible
) else (
    echo ❌ API docs JSON not accessible
)

echo.
echo 3. Opening Swagger UI in browser...
start http://localhost:8080/swagger-ui/index.html

echo.
echo ====================================
echo Swagger Test Complete!
echo.
echo API Documentation URLs:
echo • Swagger UI: http://localhost:8080/swagger-ui/index.html
echo • OpenAPI JSON: http://localhost:8080/v3/api-docs
echo • OpenAPI YAML: http://localhost:8080/v3/api-docs.yaml
echo.
echo Main API Categories:
echo • Authentication & Authorization
echo • Student Management
echo • Health Checkups & Medical Events
echo • Vaccination Management
echo • Health Blog & Notifications
echo • Admin Management
echo.
echo JWT Token Required for Protected Endpoints:
echo 1. Login via /api/auth/signin
echo 2. Copy the JWT token from response
echo 3. Click "Authorize" in Swagger UI
echo 4. Enter: Bearer [your-jwt-token]
echo ====================================
pause
