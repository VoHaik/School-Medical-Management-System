# Script to ensure medication inventory NOT NULL constraints are applied

# Database connection parameters
$server = "(localdb)\MSSQLLocalDB"  # Adjust this to match your SQL Server instance
$database = "HealthSchoolDB"
$sqlFile = "$PSScriptRoot\..\sql\ensure_medication_inventory_constraints.sql"

# Check if the SQL file exists
if (-not (Test-Path -Path $sqlFile)) {
    Write-Error "SQL file not found: $sqlFile"
    exit 1
}

Write-Host "Ensuring NOT NULL constraints on medication_inventory table..." -ForegroundColor Yellow

try {
    # Execute the SQL script using sqlcmd
    $command = "sqlcmd -E -S `"$server`" -d $database -i `"$sqlFile`""
    
    # Display the command for debugging
    Write-Host "Executing: $command" -ForegroundColor Cyan
    
    # Execute the command
    $output = Invoke-Expression $command
    
    # Display the output
    $output | ForEach-Object { Write-Host $_ }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Constraints on medication_inventory table have been successfully verified and applied." -ForegroundColor Green
    } else {
        Write-Error "Error executing SQL script. Exit code: $LASTEXITCODE"
    }
} catch {
    Write-Error "An error occurred: $_"
}

Write-Host "Script completed." -ForegroundColor Yellow
