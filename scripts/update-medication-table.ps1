# Script to update the medication_inventory table in the database

# Database connection parameters
$server = "(localdb)\MSSQLLocalDB" # Change to your server name
$database = "HealthSchoolDB"
$sqlScriptPath = "$PSScriptRoot\..\sql\update_medication_inventory.sql"

# Check if the SQL script exists
if (-not (Test-Path -Path $sqlScriptPath)) {
    Write-Error "SQL script file not found: $sqlScriptPath"
    exit 1
}

try {
    Write-Host "Executing SQL script to update medication_inventory table structure..."
    
    # Execute the SQL script using sqlcmd
    $command = "sqlcmd -S `"$server`" -d $database -i `"$sqlScriptPath`" -E"
    
    # Output the command for debugging
    Write-Host "Running command: $command"
    
    # Execute the command
    Invoke-Expression $command
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Database schema updated successfully."
    } else {
        Write-Error "Error executing SQL script. Exit code: $LASTEXITCODE"
        exit $LASTEXITCODE
    }
} catch {
    Write-Error "An error occurred: $_"
    exit 1
}

Write-Host "Done."
