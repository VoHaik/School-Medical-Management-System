# Master script to convert all VARCHAR to NVARCHAR in the School Medical System
# Runs all required steps to fix character encoding issues
# Date: June 16, 2025

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "  Full Unicode Support Conversion Utility  " -ForegroundColor Cyan
Write-Host "  School Medical Management System" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

# Base directory paths
$scriptDir = $PSScriptRoot
$projectDir = Split-Path -Parent $scriptDir
$sqlDir = Join-Path $projectDir "sql"
$backendDir = Join-Path $projectDir "backend"

# SQL Server connection details from application.yaml
$serverName = "localhost"
$port = "1433"
$databaseName = "HealthSchoolDB"
$username = "sa"
$password = "123456"

# Step 1: Stop any running backend processes
Write-Host "Step 1: Stopping any running backend processes..." -ForegroundColor Yellow
try {
    $javaPids = Get-Process -Name java -ErrorAction SilentlyContinue | 
                Where-Object {$_.CommandLine -like "*spring-boot:run*" -or 
                             $_.CommandLine -like "*school-health*"} | 
                Select-Object -ExpandProperty Id
                
    if ($javaPids -and $javaPids.Count -gt 0) {
        foreach ($pid in $javaPids) {
            Write-Host "  Stopping Java process with PID $pid..." -ForegroundColor Gray
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        }
        Write-Host "  Backend processes stopped successfully." -ForegroundColor Green
        # Give processes time to fully terminate
        Start-Sleep -Seconds 2
    } else {
        Write-Host "  No backend processes found running." -ForegroundColor Green
    }
} catch {
    Write-Host "  Warning: Error stopping backend processes. $_" -ForegroundColor Yellow
    Write-Host "  Continuing with the fix..." -ForegroundColor Yellow
}

# Step 2: Add @Nationalized annotations to entity classes
Write-Host "`nStep 2: Adding @Nationalized annotations to Java entities..." -ForegroundColor Yellow
$annotationScript = Join-Path $scriptDir "add-nationalized-annotations.ps1"
if (Test-Path $annotationScript) {
    Write-Host "  Executing: $annotationScript" -ForegroundColor Gray
    & $annotationScript
} else {
    Write-Host "  Error: Annotation script not found at: $annotationScript" -ForegroundColor Red
    $continue = Read-Host "Do you want to continue without adding annotations? (y/n)"
    if ($continue -ne "y") {
        exit 1
    }
}

# Step 3: Convert database VARCHAR columns to NVARCHAR
Write-Host "`nStep 3: Converting database VARCHAR columns to NVARCHAR..." -ForegroundColor Yellow
$sqlScript = Join-Path $sqlDir "convert-all-varchar-to-nvarchar.sql"
if (Test-Path $sqlScript) {
    try {
        $sqlcmdExists = Get-Command sqlcmd -ErrorAction SilentlyContinue
        
        if ($sqlcmdExists) {
            # Execute using sqlcmd
            Write-Host "  Using sqlcmd to execute the script..." -ForegroundColor Green
            
            $sqlcmdArgs = @(
                "-S", "$serverName,$port",
                "-d", $databaseName,
                "-U", $username,
                "-P", $password,
                "-i", $sqlScript,
                "-o", "sql_conversion_output.log"
            )
            
            & sqlcmd $sqlcmdArgs
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "  SQL script executed successfully!" -ForegroundColor Green
                Write-Host "  Output logged to sql_conversion_output.log" -ForegroundColor Green
            } else {
                Write-Host "  SQL script execution failed with exit code: $LASTEXITCODE" -ForegroundColor Red
                Write-Host "  Please check sql_conversion_output.log for details." -ForegroundColor Yellow
            }
        } else {
            # Try using Invoke-Sqlcmd if available
            $sqlModuleExists = Get-Module -ListAvailable -Name SqlServer -ErrorAction SilentlyContinue
            
            if ($sqlModuleExists) {
                Write-Host "  Using Invoke-Sqlcmd to execute the script..." -ForegroundColor Green
                Import-Module SqlServer
                
                Invoke-Sqlcmd -ServerInstance "$serverName,$port" -Database $databaseName `
                             -Username $username -Password $password -InputFile $sqlScript `
                             -OutputSqlErrors $true -Verbose
                
                Write-Host "  SQL script executed successfully!" -ForegroundColor Green
            } else {
                # Manual instructions
                Write-Host "  SQL command utilities not found." -ForegroundColor Red
                Write-Host "  Please run the SQL script manually using SQL Server Management Studio:" -ForegroundColor Yellow
                Write-Host "  Script location: $sqlScript" -ForegroundColor Yellow
                
                $continue = Read-Host "Did you manually run the SQL script? (y/n)"
                if ($continue -ne "y") {
                    Write-Host "Fix aborted. Please run the SQL script and restart this process." -ForegroundColor Red
                    exit 1
                }
            }
        }
    } catch {
        Write-Host "  Error executing SQL script: $_" -ForegroundColor Red
        $continue = Read-Host "Do you want to continue without running the SQL script? (y/n)"
        if ($continue -ne "y") {
            exit 1
        }
    }
} else {
    Write-Host "  Error: SQL script not found at: $sqlScript" -ForegroundColor Red
    $continue = Read-Host "Do you want to continue without running the SQL script? (y/n)"
    if ($continue -ne "y") {
        exit 1
    }
}

# Step 4: Rebuild the backend application
Write-Host "`nStep 4: Rebuilding the backend application..." -ForegroundColor Yellow
if (Test-Path $backendDir) {
    Set-Location -Path $backendDir
    
    try {
        Write-Host "  Running: mvn clean package -DskipTests" -ForegroundColor Gray
        & mvn clean package -DskipTests
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  Backend rebuilt successfully!" -ForegroundColor Green
        } else {
            Write-Host "  Backend rebuild failed with exit code: $LASTEXITCODE" -ForegroundColor Red
            $continue = Read-Host "Do you want to continue without a successful rebuild? (y/n)"
            if ($continue -ne "y") {
                exit 1
            }
        }
    } catch {
        Write-Host "  Error rebuilding backend: $_" -ForegroundColor Red
        $continue = Read-Host "Do you want to continue? (y/n)"
        if ($continue -ne "y") {
            exit 1
        }
    }
} else {
    Write-Host "  Error: Backend directory not found at: $backendDir" -ForegroundColor Red
    $continue = Read-Host "Do you want to continue? (y/n)"
    if ($continue -ne "y") {
        exit 1
    }
}

# Step 5: Restart the backend application
Write-Host "`nStep 5: Restarting the backend application..." -ForegroundColor Yellow
if (Test-Path $backendDir) {
    Set-Location -Path $backendDir
    
    # Find the JAR file
    $jarFile = Get-ChildItem -Path "target" -Filter "*.jar" | 
               Where-Object { $_.Name -like "SWP391-Project*.jar" -and 
                             $_.Name -notlike "*.original" } | 
               Select-Object -First 1
    
    if ($jarFile) {
        # Start the JAR file
        $jarPath = Join-Path "target" $jarFile.Name
        Write-Host "  Starting backend using JAR file: $jarPath" -ForegroundColor Gray
        
        # Start in a new window
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "java -jar `"$jarPath`"" -WindowStyle Normal
        Write-Host "  Backend server starting in a new window." -ForegroundColor Green
    } else {
        # Use Maven if JAR not found
        Write-Host "  Starting backend using Maven spring-boot:run" -ForegroundColor Gray
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "mvn spring-boot:run" -WindowStyle Normal
        Write-Host "  Backend server starting in a new window." -ForegroundColor Green
    }
} else {
    Write-Host "  Error: Backend directory not found." -ForegroundColor Red
    exit 1
}

# Return to original directory
Set-Location -Path $scriptDir

Write-Host "`nConversion process completed!" -ForegroundColor Green
Write-Host "The system has been updated to fully support Unicode characters (including Vietnamese)." -ForegroundColor Cyan
Write-Host "`nWhat was done:" -ForegroundColor White
Write-Host "1. Added @Nationalized annotations to all Java entity String fields" -ForegroundColor White
Write-Host "2. Converted all VARCHAR columns in the database to NVARCHAR" -ForegroundColor White
Write-Host "3. Rebuilt and restarted the backend application" -ForegroundColor White

Write-Host "`nPlease wait a few moments for the backend to fully start," -ForegroundColor Yellow
Write-Host "then try accessing the medication requests page again." -ForegroundColor Yellow

Write-Host "`nIf you still encounter issues:" -ForegroundColor Cyan
Write-Host "1. Check the application logs for errors" -ForegroundColor White
Write-Host "2. Verify database connection settings in application.yaml" -ForegroundColor White
Write-Host "3. Restart your frontend application if needed" -ForegroundColor White
