# Java Version Fix and Backend Start Script
# This script checks for Java 17 (or higher) and uses it to start the Spring Boot backend

Write-Host "Java Version Fix and Backend Start Script" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# First, check if Java 17+ is available
$foundJava17 = $false
$javaPath = $null

# Function to test Java version
function Test-JavaVersion($path) {
    try {
        $versionOutput = & $path -version 2>&1
        $versionString = $versionOutput | Select-String -Pattern "version" | Select-Object -First 1
        
        if ($versionString -match "version `"(\d+)") {
            $majorVersion = [int]$Matches[1]
            if ($majorVersion -ge 17) {
                return $true
            }
        } elseif ($versionString -match "version `"1\.(\d+)") {
            $majorVersion = [int]$Matches[1]
            if ($majorVersion -ge 17) {
                return $true
            }
        }
    } catch {
        # Ignore errors
    }
    return $false
}

# Check if JAVA_HOME points to Java 17+
if ($env:JAVA_HOME -and (Test-Path "$env:JAVA_HOME\bin\java.exe")) {
    if (Test-JavaVersion "$env:JAVA_HOME\bin\java.exe") {
        $foundJava17 = $true
        $javaPath = "$env:JAVA_HOME\bin\java.exe"
        Write-Host "Found Java 17+ at JAVA_HOME: $javaPath" -ForegroundColor Green
    }
}

# Check common locations if JAVA_HOME doesn't have Java 17+
if (-not $foundJava17) {
    $possiblePaths = @(
        "C:\Program Files\Java\jdk-17*\bin\java.exe",
        "C:\Program Files\Eclipse Adoptium\jdk-17*\bin\java.exe",
        "C:\Program Files\Eclipse Foundation\jdk-17*\bin\java.exe",
        "C:\Program Files\BellSoft\LibericaJDK-17*\bin\java.exe",
        "C:\Program Files\Amazon Corretto\jdk17*\bin\java.exe",
        "C:\Program Files\Java\jdk-21*\bin\java.exe"
    )
    
    foreach ($path in $possiblePaths) {
        $resolved = Resolve-Path $path -ErrorAction SilentlyContinue
        if ($resolved) {
            foreach ($p in $resolved.Path) {
                if (Test-JavaVersion $p) {
                    $foundJava17 = $true
                    $javaPath = $p
                    Write-Host "Found Java 17+ at: $javaPath" -ForegroundColor Green
                    break
                }
            }
        }
        if ($foundJava17) { break }
    }
}

# If we found Java 17+, use it to start the application
if ($foundJava17) {
    Write-Host "`nStarting Spring Boot backend with Java 17+..." -ForegroundColor Yellow
    
    # Kill any existing processes on ports 8080 and 8081
    Write-Host "Checking for processes on ports 8080 and 8081..." -ForegroundColor Yellow
    $processes = netstat -ano | findstr ":8080|:8081" | ForEach-Object {
        $parts = $_ -split '\s+'
        if ($parts.Length -ge 5) {
            $parts[4] # Extract PID
        }
    }
    
    foreach ($pid in $processes) {
        if ($pid -and $pid -match '^\d+$') {
            Write-Host "Killing process with PID $pid..." -ForegroundColor Yellow
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        }
    }
    
    # Get the directory of the JAR file
    $jarFile = "backend/target/SWP391-Project-1.0-SNAPSHOT.jar"
    $jarFileFullPath = Join-Path $PWD $jarFile
    
    if (Test-Path $jarFileFullPath) {
        Write-Host "Starting Spring Boot application: $jarFileFullPath" -ForegroundColor Green
        
        # Start the process
        & $javaPath -jar $jarFileFullPath
    } else {
        Write-Host "Error: JAR file not found at $jarFileFullPath" -ForegroundColor Red
    }
} else {
    Write-Host "`nError: Could not find Java 17 or higher" -ForegroundColor Red
    Write-Host "Your application was compiled with Java 17+, but you have Java 8 installed." -ForegroundColor Red
    Write-Host "Please install Java 17 or higher to run this application." -ForegroundColor Red
    
    Write-Host "`nYou can download Java 17 from:" -ForegroundColor Yellow
    Write-Host "- Eclipse Temurin (OpenJDK): https://adoptium.net/" -ForegroundColor Yellow
    Write-Host "- Oracle JDK: https://www.oracle.com/java/technologies/downloads/" -ForegroundColor Yellow
}
