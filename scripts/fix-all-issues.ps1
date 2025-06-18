# PowerShell script to fix all database conversion issues and restart the backend server

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "  Complete Database and Backend Fix Utility" -ForegroundColor Cyan
Write-Host "  Version 1.0" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Stop any running backend process
Write-Host "Step 1: Stopping any running backend processes..." -ForegroundColor Yellow
try {
    $javaPids = Get-Process -Name java -ErrorAction SilentlyContinue | Where-Object {$_.CommandLine -like "*spring-boot:run*" -or $_.CommandLine -like "*school-health*"} | Select-Object -ExpandProperty Id
    if ($javaPids -and $javaPids.Count -gt 0) {
        foreach ($pid in $javaPids) {
            Write-Host "  Stopping Java process with PID $pid..." -ForegroundColor Gray
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        }
        Write-Host "  Backend processes stopped successfully." -ForegroundColor Green
    } else {
        Write-Host "  No backend processes found running." -ForegroundColor Green
    }
} catch {
    Write-Host "  Warning: Error stopping backend processes. $_" -ForegroundColor Yellow
    Write-Host "  Continuing with the fix..." -ForegroundColor Yellow
}

# Step 2: Run the database fix script
Write-Host "`nStep 2: Running database fix script..." -ForegroundColor Yellow
$fixScriptPath = Join-Path $PSScriptRoot "fix-database-conversion-issues.ps1"
if (Test-Path $fixScriptPath) {
    Write-Host "  Executing $fixScriptPath..." -ForegroundColor Gray
    & $fixScriptPath
} else {
    Write-Host "  Error: Database fix script not found at: $fixScriptPath" -ForegroundColor Red
    Write-Host "  Please make sure the fix-database-conversion-issues.ps1 file exists in the scripts directory." -ForegroundColor Yellow
    $continue = Read-Host "Do you want to continue without fixing the database? (y/n)"
    if ($continue -ne "y") {
        Write-Host "Fix aborted by user." -ForegroundColor Red
        exit 1
    }
}

# Step 3: Restart the backend application
Write-Host "`nStep 3: Starting backend server..." -ForegroundColor Yellow
$backendDir = Join-Path $PSScriptRoot "..\backend"
if (Test-Path $backendDir) {
    # Check if spring-boot:run or java -jar is appropriate
    $jarFile = Get-ChildItem -Path (Join-Path $backendDir "target") -Filter "*.jar" | Where-Object { $_.Name -like "SWP391-Project*.jar" -and $_.Name -notlike "*.original" } | Select-Object -First 1
    
    Write-Host "  Changing to backend directory: $backendDir" -ForegroundColor Gray
    Set-Location -Path $backendDir
    
    if ($jarFile) {
        # Found a JAR file, start it directly
        $jarPath = Join-Path "target" $jarFile.Name
        Write-Host "  Starting backend using JAR file: $jarPath" -ForegroundColor Gray
        
        # Start in a new window so the script can continue
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "java -jar `"$jarPath`"" -WindowStyle Normal
    } else {
        # No JAR file, use Maven
        Write-Host "  Starting backend using Maven spring-boot:run" -ForegroundColor Gray
        
        # Start in a new window so the script can continue
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "mvn spring-boot:run" -WindowStyle Normal
    }
    
    Write-Host "  Backend server starting in a new window." -ForegroundColor Green
} else {
    Write-Host "  Error: Backend directory not found at: $backendDir" -ForegroundColor Red
    Write-Host "  Please make sure you're running this script from the 'scripts' directory of the project." -ForegroundColor Yellow
    exit 1
}

Write-Host "`nFix process completed successfully!" -ForegroundColor Green
Write-Host "Please wait a few moments for the backend server to fully start, then test the application." -ForegroundColor Cyan
Write-Host ""
Write-Host "Troubleshooting tips:" -ForegroundColor Yellow
Write-Host "1. If you still see database errors, try restarting the frontend application as well." -ForegroundColor White
Write-Host "2. Make sure all services are running on the expected ports (backend: 8080, frontend: 3000)." -ForegroundColor White
Write-Host "3. Check the SQL logs for any database errors that may need manual fixing." -ForegroundColor White
Write-Host ""
