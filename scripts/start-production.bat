@echo off
REM Production Startup Script for School Medical Management System (Windows)
REM =========================================================================

echo Starting School Medical Management System in Production Mode...

REM Set production environment variables
set SPRING_PROFILES_ACTIVE=production

REM Java options for production
set JAVA_OPTS=-Xms512m -Xmx2048m -XX:+UseG1GC -XX:+UseStringDeduplication -Djava.security.egd=file:/dev/./urandom

REM Application properties
set SERVER_PORT=8080
set DB_HOST=localhost
set DB_PORT=1433
set DB_NAME=HealthSchoolDB_PROD

REM CRITICAL: Set these environment variables before running in production!
REM set DB_USERNAME=your_db_username
REM set DB_PASSWORD=your_db_password
REM set JWT_SECRET=your_512_bit_jwt_secret

REM Validate required environment variables
if "%DB_USERNAME%"=="" (
    echo ERROR: DB_USERNAME environment variable is not set!
    pause
    exit /b 1
)

if "%DB_PASSWORD%"=="" (
    echo ERROR: DB_PASSWORD environment variable is not set!
    pause
    exit /b 1
)

if "%JWT_SECRET%"=="" (
    echo ERROR: JWT_SECRET environment variable is not set!
    pause
    exit /b 1
)

REM Create logs directory if it doesn't exist
if not exist logs mkdir logs

echo Environment: Production
echo Java Options: %JAVA_OPTS%
echo Server Port: %SERVER_PORT%
echo Database Host: %DB_HOST%:%DB_PORT%
echo Database Name: %DB_NAME%

REM Start the application
java %JAVA_OPTS% -jar target\SWP391-Project-1.0-SNAPSHOT.jar ^
    --spring.profiles.active=production ^
    --server.port=%SERVER_PORT% ^
    --spring.datasource.url="jdbc:sqlserver://%DB_HOST%:%DB_PORT%;databaseName=%DB_NAME%;encrypt=true;trustServerCertificate=false;characterEncoding=UTF-8;useUnicode=true" ^
    --spring.datasource.username=%DB_USERNAME% ^
    --spring.datasource.password=%DB_PASSWORD% ^
    --schoolhealth.app.jwtSecret=%JWT_SECRET%

pause
