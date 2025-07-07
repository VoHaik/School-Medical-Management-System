@echo off
echo Checking backend status and adding sample vaccines...

echo.
echo 1. Checking if backend is running...
powershell -Command "try { (Invoke-WebRequest -Uri 'http://localhost:8080/api/health' -UseBasicParsing).StatusCode } catch { 'Backend not running' }"

echo.
echo 2. If backend is running, you can run the SQL script manually:
echo    - Open your database management tool (SQL Server Management Studio, etc.)
echo    - Connect to your database
echo    - Run the script: sql/insert_sample_vaccines.sql

echo.
echo 3. After adding vaccines, test the Create Event form again
echo.

pause
