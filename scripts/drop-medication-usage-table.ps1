# PowerShell script to drop the medication_usage table

# Database connection parameters
$server = "(localdb)\MSSQLLocalDB"  # Adjust this to match your SQL Server instance
$database = "HealthSchoolDB"
$sqlFile = "$PSScriptRoot\..\sql\drop_medication_usage.sql"

# Check if the SQL file exists
if (-not (Test-Path -Path $sqlFile)) {
    Write-Error "SQL file not found: $sqlFile"
    exit 1
}

Write-Host "Dropping medication_usage table from database..." -ForegroundColor Yellow

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
        Write-Host "Table medication_usage has been successfully processed." -ForegroundColor Green
    } else {
        Write-Error "Error executing SQL script. Exit code: $LASTEXITCODE"
    }
} catch {
    Write-Error "An error occurred: $_"
}

Write-Host "Script completed." -ForegroundColor Yellow
