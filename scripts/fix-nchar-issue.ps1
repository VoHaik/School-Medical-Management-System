# PowerShell Script to fix the NCHAR to NVARCHAR conversion issue
# File: fix-nchar-issue.ps1

Write-Host "Fixing SQL Text to NCHAR conversion issue..." -ForegroundColor Green

# Get the path to the SQL script from the parent directory
$sqlScriptPath = Join-Path -Path (Split-Path -Parent $PSScriptRoot) -ChildPath "sql\fix-target-grade-levels-column.sql"

if (-not (Test-Path $sqlScriptPath)) {
    Write-Host "Error: SQL script not found at: $sqlScriptPath" -ForegroundColor Red
    exit 1
}

Write-Host "SQL script found at: $sqlScriptPath" -ForegroundColor Cyan

# Execute SQL script using sqlcmd
# Note: You may need to modify the connection parameters based on your SQL Server configuration
# This example assumes Windows Authentication

try {
    Write-Host "Running SQL script to alter column type..." -ForegroundColor Yellow
    
    # For SQL Server with Windows Authentication
    sqlcmd -S localhost -d HealthSchoolDB -E -i $sqlScriptPath
    
    # For SQL Server with SQL Authentication (uncomment if needed)
    # sqlcmd -S localhost -d HealthSchoolDB -U username -P password -i $sqlScriptPath
    
    Write-Host "Column successfully altered from NCHAR to NVARCHAR!" -ForegroundColor Green
    Write-Host "The system should now properly handle both TEXT and Unicode string formats." -ForegroundColor Green
}
catch {
    Write-Host "Error executing SQL script: $_" -ForegroundColor Red
    
    # Provide alternative manual instructions
    Write-Host "`nManual fix instructions:" -ForegroundColor Yellow
    Write-Host "1. Open SQL Server Management Studio" -ForegroundColor White
    Write-Host "2. Connect to your database server" -ForegroundColor White
    Write-Host "3. Execute the following SQL command:" -ForegroundColor White
    Write-Host "   ALTER TABLE health_checkup_events ALTER COLUMN target_grade_levels NVARCHAR(255);" -ForegroundColor Cyan
    
    exit 1
}

Write-Host "`nNext Steps:" -ForegroundColor Magenta
Write-Host "1. Restart your Spring Boot application" -ForegroundColor White
Write-Host "2. Test creating a health checkup event with grade levels" -ForegroundColor White
Write-Host "3. Verify the event is saved successfully" -ForegroundColor White

Write-Host "`nScript execution completed." -ForegroundColor Green
