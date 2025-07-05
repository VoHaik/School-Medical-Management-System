# Script to configure alternative port for Spring Boot application

Write-Host "Configuring alternative port for Spring Boot application..."

$configPath = "..\backend\src\main\resources\application.properties"
$fullPath = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot $configPath))

# Check if the file exists
if (Test-Path $fullPath) {
    $content = Get-Content $fullPath -Raw
    
    # Check if port is already configured
    if ($content -match "server\.port=") {
        $currentPort = [regex]::Match($content, "server\.port=(\d+)").Groups[1].Value
        Write-Host "Current port configuration found: $currentPort"
        
        $newPort = Read-Host "Enter new port number (leave empty to keep $currentPort)"
        if ([string]::IsNullOrWhiteSpace($newPort)) {
            $newPort = $currentPort
            Write-Host "Keeping current port: $newPort"
        } else {
            $content = $content -replace "server\.port=\d+", "server.port=$newPort"
            Set-Content -Path $fullPath -Value $content
            Write-Host "Port updated to: $newPort"
        }
    } else {
        $newPort = Read-Host "No port configuration found. Enter port number (default: 8081)"
        if ([string]::IsNullOrWhiteSpace($newPort)) {
            $newPort = "8081"
        }
        
        # Append the port configuration to the file
        $content += "`nserver.port=$newPort"
        Set-Content -Path $fullPath -Value $content
        Write-Host "Port configured to: $newPort"
    }
    
    Write-Host "`nTo run the application with this port, use:"
    Write-Host "cd ..\backend"
    Write-Host "mvn spring-boot:run"
    
    $runNow = Read-Host "Do you want to run the application now? (Y/N)"
    if ($runNow -eq "Y" -or $runNow -eq "y") {
        Set-Location -Path (Join-Path $PSScriptRoot "..\backend")
        Invoke-Expression "mvn spring-boot:run"
    }
} else {
    Write-Host "Error: Configuration file not found at $fullPath" -ForegroundColor Red
    Write-Host "Please make sure the path is correct and the application.properties file exists."
}
