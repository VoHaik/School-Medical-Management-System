# Script to update role names for consistency
# This script runs the SQL script to update role names to match ERole.java

param (
    [string]$Server = "localhost",
    [string]$Database = "HealthSchoolDB",
    [string]$Username = "sa",
    [string]$Password = "123456"
)

# Path to the SQL script
$sqlScriptPath = "..\sql\fix-role-name-consistency.sql"

# Check if SQL script exists
if (-not (Test-Path $sqlScriptPath)) {
    Write-Host "Error: SQL script not found at $sqlScriptPath" -ForegroundColor Red
    exit 1
}

# Run the SQL script
Write-Host "Running script to update role names in the database..." -ForegroundColor Cyan
try {
    sqlcmd -S $Server -U $Username -P $Password -i $sqlScriptPath
    Write-Host "Role name update completed successfully!" -ForegroundColor Green
} catch {
    Write-Host "Error executing SQL script: $_" -ForegroundColor Red
}

# Create a file to indicate this fix has been applied
$markerFile = ".\fix-role-applied.txt"
$dateTime = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Set-Content -Path $markerFile -Value "Role name consistency fix applied on $dateTime"

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Restart the backend server to apply changes" -ForegroundColor Yellow
Write-Host "2. Log in with nurse.johnson account to verify access" -ForegroundColor Yellow
Write-Host ""
