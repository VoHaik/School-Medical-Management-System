# Restart backend with security fixes applied

Write-Host "Stopping any existing Spring Boot processes..." -ForegroundColor Yellow
# Find any running Spring Boot processes
$springProcesses = Get-Process | Where-Object { $_.CommandLine -like "*spring-boot*" -or $_.CommandLine -like "*SWP391-Project*.jar" } | Select-Object -Property Id, ProcessName, CommandLine

if ($springProcesses) {
    foreach ($process in $springProcesses) {
        Write-Host "Stopping process ID $($process.Id) - $($process.ProcessName)" -ForegroundColor Cyan
        Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
    }
    Write-Host "Waiting 3 seconds for processes to stop completely..." -ForegroundColor Yellow
    Start-Sleep -Seconds 3
}

# Switch to the backend directory
$backendDir = Join-Path $PSScriptRoot ".." "backend"
Set-Location -Path $backendDir

# Build the project
Write-Host "Building the project..." -ForegroundColor Yellow
try {
    mvn clean package -DskipTests
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Maven build failed with exit code $LASTEXITCODE" -ForegroundColor Red
        exit $LASTEXITCODE
    }
    Write-Host "Build successful!" -ForegroundColor Green
} catch {
    Write-Host "Error building project: $_" -ForegroundColor Red
    exit 1
}

# Run the backend service
Write-Host "Starting Spring Boot application with enhanced security logging..." -ForegroundColor Yellow
Write-Host "The application will start with DEBUG level logging for security checks." -ForegroundColor Cyan

$jarPath = Join-Path $backendDir "target" "SWP391-Project-1.0-SNAPSHOT.jar"

if (Test-Path $jarPath) {
    # Start Spring Boot with extra logging for security
    java -jar $jarPath `
        --logging.level.com.swp391_8.schoolhealth.service.SecurityService=DEBUG `
        --logging.level.com.swp391_8.schoolhealth.controller.HealthDeclarationController=DEBUG

    # Command will block until the user stops the process
    Write-Host "Application stopped." -ForegroundColor Yellow
} else {
    Write-Host "Error: JAR file not found at $jarPath" -ForegroundColor Red
    exit 1
}
