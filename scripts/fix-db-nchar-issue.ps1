# Script to fix the target_grade_levels column type in the database

Write-Host "Fixing target_grade_levels column type..." -ForegroundColor Green

# Get database connection parameters
$DB_SERVER = Read-Host "Enter database server (default: localhost)"
if ([string]::IsNullOrWhiteSpace($DB_SERVER)) { $DB_SERVER = "localhost" }

$DB_NAME = Read-Host "Enter database name (default: HealthSchoolDB)"
if ([string]::IsNullOrWhiteSpace($DB_NAME)) { $DB_NAME = "HealthSchoolDB" }

$DB_USER = Read-Host "Enter database user (default: sa)"
if ([string]::IsNullOrWhiteSpace($DB_USER)) { $DB_USER = "sa" }

$DB_PASSWORD = Read-Host "Enter database password" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($DB_PASSWORD)
$PlainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# Run the SQL script
$sqlcmdPath = "sqlcmd"
try {
    & $sqlcmdPath -S $DB_SERVER -d $DB_NAME -U $DB_USER -P $PlainPassword -i ..\sql\fix-target-grade-levels-column.sql
    Write-Host "Database column fix script executed successfully." -ForegroundColor Green
} catch {
    Write-Host "Error executing SQL script: $_" -ForegroundColor Red
}

Read-Host "Press Enter to continue..."
