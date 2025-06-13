# Kill All Project Ports Script
# This script kills all processes running on ports commonly used by this project

Write-Host "Killing all project-related ports..." -ForegroundColor Yellow

# Define ports used by the project
$ports = @(3000, 3001, 8080, 8081, 8082, 5000, 5173)

foreach ($port in $ports) {
    Write-Host "Checking port $port..." -ForegroundColor Cyan
    
    # Find processes using the port
    $processes = netstat -ano | findstr ":$port " | ForEach-Object {
        $parts = $_ -split '\s+'
        if ($parts.Length -ge 5) {
            $parts[4]  # PID is typically the 5th column
        }
    }
    
    if ($processes) {
        foreach ($pid in $processes) {
            if ($pid -and $pid -match '^\d+$') {
                try {
                    $processInfo = Get-Process -Id $pid -ErrorAction SilentlyContinue
                    if ($processInfo) {
                        Write-Host "Killing process $($processInfo.ProcessName) (PID: $pid) on port $port" -ForegroundColor Red
                        taskkill /F /PID $pid
                    }
                }
                catch {
                    Write-Host "Could not kill process with PID $pid" -ForegroundColor Yellow
                }
            }
        }
    } else {
        Write-Host "No process found on port $port" -ForegroundColor Green
    }
}

# Also kill any Java processes that might be Spring Boot apps
Write-Host "`nKilling Java processes..." -ForegroundColor Yellow
$javaProcesses = Get-Process -Name "java" -ErrorAction SilentlyContinue
if ($javaProcesses) {
    foreach ($proc in $javaProcesses) {
        Write-Host "Killing Java process (PID: $($proc.Id))" -ForegroundColor Red
        taskkill /F /PID $proc.Id
    }
} else {
    Write-Host "No Java processes found" -ForegroundColor Green
}

# Also kill any Node.js processes that might be React apps
Write-Host "`nKilling Node.js processes..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    foreach ($proc in $nodeProcesses) {
        Write-Host "Killing Node.js process (PID: $($proc.Id))" -ForegroundColor Red
        taskkill /F /PID $proc.Id
    }
} else {
    Write-Host "No Node.js processes found" -ForegroundColor Green
}

Write-Host "`nAll project ports have been cleared!" -ForegroundColor Green
