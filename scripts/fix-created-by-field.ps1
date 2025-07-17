# PowerShell script to fix the medication_inventory created_by and updated_by fields

# Database connection parameters
$server = "(localdb)\MSSQLLocalDB"  # Adjust this to match your SQL Server instance
$database = "HealthSchoolDB"
$sqlFile = "$PSScriptRoot\..\sql\fix_created_by_field.sql"

# Check if the SQL file exists
if (-not (Test-Path -Path $sqlFile)) {
    Write-Error "SQL file not found: $sqlFile"
    exit 1
}

Write-Host "Starting to fix the created_by and updated_by fields in medication_inventory table..." -ForegroundColor Yellow

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
        Write-Host "Fixed created_by and updated_by fields in medication_inventory successfully." -ForegroundColor Green
    } else {
        Write-Error "Error executing SQL script. Exit code: $LASTEXITCODE"
    }
} catch {
    Write-Error "An error occurred: $_"
}

Write-Host "Script completed." -ForegroundColor Yellow
