# Script to run backend with Maven

Write-Host "Running Spring Boot application with Maven..."

# Navigate to the backend directory
Set-Location -Path (Join-Path $PSScriptRoot "..\backend")

# Check if Maven is installed
$mvnCommand = "mvn -v"
try {
    Invoke-Expression $mvnCommand | Out-Null
    Write-Host "Maven is installed correctly."
} catch {
    Write-Host "Error: Maven may not be installed or not in PATH." -ForegroundColor Red
    Write-Host "Please install Maven and make sure it's in your PATH."
    exit 1
}

# Run the Spring Boot application
Write-Host "Starting Spring Boot application..."
Write-Host "You can press Ctrl+C to stop the application."

# First clean and package
Invoke-Expression "mvn clean package -DskipTests"

# Then run
if ($LASTEXITCODE -eq 0) {
    Write-Host "Build successful! Starting application..."
    Invoke-Expression "mvn spring-boot:run"
} else {
    Write-Host "Build failed with exit code $LASTEXITCODE" -ForegroundColor Red
}
