# PowerShell script to fix database varchar to NCHAR conversion issues

# Script details
$scriptName = "Fix Database VARCHAR to NCHAR Conversion Issues"
$scriptVersion = "1.0"
$scriptAuthor = "GitHub Copilot"

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "  $scriptName v$scriptVersion" -ForegroundColor Cyan
Write-Host "  Author: $scriptAuthor" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

# SQL Server connection details (from application.properties)
$serverName = "localhost"
$port = "1433"
$databaseName = "HealthSchoolDB"
$username = "sa"
$password = "123456"

# SQL script path
$scriptPath = Join-Path $PSScriptRoot "..\sql\fix-varchar-nchar-mismatch.sql"

# Check if SQL script exists
if (-not (Test-Path $scriptPath)) {
    Write-Host "SQL script not found at path: $scriptPath" -ForegroundColor Red
    Write-Host "Please make sure the fix-varchar-nchar-mismatch.sql file exists in the sql directory." -ForegroundColor Yellow
    exit 1
}

Write-Host "Attempting to execute SQL script to fix VARCHAR to NCHAR conversion issues..." -ForegroundColor Yellow

try {
    # Check if sqlcmd is available
    $sqlcmdExists = Get-Command sqlcmd -ErrorAction SilentlyContinue
    
    if ($sqlcmdExists) {
        # Execute using sqlcmd
        Write-Host "Using sqlcmd to execute the script..." -ForegroundColor Green
        
        $sqlcmdArgs = @(
            "-S", "$serverName,$port",
            "-d", $databaseName,
            "-U", $username,
            "-P", $password,
            "-i", $scriptPath,
            "-o", "sql_execution_output.log"
        )
        
        & sqlcmd $sqlcmdArgs
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "SQL script executed successfully!" -ForegroundColor Green
            Write-Host "Output logged to sql_execution_output.log" -ForegroundColor Green
        } else {
            Write-Host "SQL script execution failed with exit code: $LASTEXITCODE" -ForegroundColor Red
            Write-Host "Please check sql_execution_output.log for details." -ForegroundColor Yellow
        }
    } else {
        # Try using Invoke-Sqlcmd if available in SQL Server PowerShell module
        $sqlModuleExists = Get-Module -ListAvailable -Name SqlServer -ErrorAction SilentlyContinue
        
        if ($sqlModuleExists) {
            Write-Host "Using Invoke-Sqlcmd to execute the script..." -ForegroundColor Green
            Import-Module SqlServer
            
            Invoke-Sqlcmd -ServerInstance "$serverName,$port" -Database $databaseName -Username $username -Password $password -InputFile $scriptPath -OutputSqlErrors $true -Verbose
            
            Write-Host "SQL script executed successfully!" -ForegroundColor Green
        } else {
            # Manual instructions if automated execution is not possible
            Write-Host "SQL command utilities not found." -ForegroundColor Red
            Write-Host "Please run the SQL script manually using SQL Server Management Studio or another SQL client:" -ForegroundColor Yellow
            Write-Host "Script location: $scriptPath" -ForegroundColor Yellow
            
            # Show connection string for reference
            $connectionString = "Server=$serverName,$port;Database=$databaseName;User Id=$username;Password=$password;"
            Write-Host "Connection string: $connectionString" -ForegroundColor Cyan
        }
    }
    
    # Restart backend instructions
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Cyan
    Write-Host "1. Restart the backend service for changes to take effect" -ForegroundColor White
    Write-Host "2. Test the medication requests page to verify the issue is resolved" -ForegroundColor White

} catch {
    Write-Host "An error occurred: $_" -ForegroundColor Red
    exit 1
}
