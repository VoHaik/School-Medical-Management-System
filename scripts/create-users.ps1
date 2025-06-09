# PowerShell script to create user accounts in the SQL Server database

# --- Configuration ---
# !! IMPORTANT !!: Review these settings carefully before running.
$SqlServerInstance = "." # Default SQL Server instance. Common values: ".", "localhost", "SQLEXPRESS", "YourServerName\YourInstance"
$DatabaseName    = "HealthSchoolDB"
$SqlUsername     = "sa"
$SqlPassword     = "123456" # Password for the SQL Server '$SqlUsername' account.
                           # Storing passwords in scripts is NOT recommended for production.
                           # Consider Windows Authentication or prompting for the password if this is a concern.

# Path to the SQL script that creates the users
$SqlScriptFile   = "create-user-accounts.sql"
# Construct the absolute path to the SQL script relative to this script's location
$PSScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
$SqlScriptPath   = Join-Path $PSScriptRoot "..\sql\$SqlScriptFile"

# --- Pre-flight checks ---
# Check if SQL script exists
If (-not (Test-Path $SqlScriptPath)) {
    Write-Error "SQL script not found at '$SqlScriptPath'. Please ensure the path is correct. Current PSScriptRoot: $PSScriptRoot"
    Exit 1
}

# Check if sqlcmd is available (basic check)
try {
    Get-Command sqlcmd -ErrorAction Stop | Out-Null
} catch {
    Write-Error "sqlcmd.exe not found. Please ensure SQL Server Command Line Utilities are installed and sqlcmd is in your system's PATH."
    Exit 1
}

Write-Host "--------------------------------------------------------------------"
Write-Host "Attempting to execute SQL script to create/update user accounts..."
Write-Host "--------------------------------------------------------------------"
Write-Host "Server Instance: $SqlServerInstance"
Write-Host "Database Name  : $DatabaseName"
Write-Host "SQL Username   : $SqlUsername"
Write-Host "SQL Script     : $SqlScriptPath"
Write-Host ""
Write-Host "You will be connecting to SQL Server as '$SqlUsername'."
Write-Host "The script '$SqlScriptFile' will be executed."
Write-Host "This script typically creates application users (e.g., parent.jones) with a password like 'Password123'."
Write-Host "--------------------------------------------------------------------"
# Uncomment the next line if you want a manual confirmation before running:
# Read-Host -Prompt "Press Enter to continue, or Ctrl+C to abort"

# --- Construct and Execute sqlcmd ---
try {
    Write-Host "Executing sqlcmd..."
    # -b: Exit on error
    # -S: Server instance
    # -U: SQL Username
    # -P: SQL Password
    # -d: Database name
    # -i: Input SQL file
    sqlcmd -b -S $SqlServerInstance -U $SqlUsername -P $SqlPassword -d $DatabaseName -i $SqlScriptPath
    
    If ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "--------------------------------------------------------------------"
        Write-Host "SUCCESS: SQL script executed successfully."
        Write-Host "User accounts defined in '$SqlScriptFile' should now be created/updated in the '$DatabaseName' database."
        Write-Host "Remember that the application users (e.g., parent.smith, parent.jones) are typically created with the password 'Password123' by the SQL script."
        Write-Host "--------------------------------------------------------------------"
    } Else {
        Write-Error "FAILURE: sqlcmd reported an error. Exit code: $LASTEXITCODE"
        Write-Host "Please review the output above for specific error messages from SQL Server or sqlcmd."
    }
} catch {
    Write-Error "An unexpected error occurred while trying to execute sqlcmd: $($_.Exception.Message)"
    Write-Host "Ensure SQL Server is running, the instance name ('$SqlServerInstance') is correct, credentials are valid, and sqlcmd is properly installed."
}

Write-Host ""
Write-Host "Script execution finished."