# PowerShell script to build and start the application with Swagger
# Swagger Integration for School Medical Management System

Write-Host "=== School Medical Management System - Swagger Integration ===" -ForegroundColor Green
Write-Host ""

# Function to check if a port is in use
function Test-Port {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $true
    }
    catch {
        return $false
    }
}

# Function to start backend
function Start-Backend {
    Write-Host "🚀 Starting Spring Boot Backend..." -ForegroundColor Yellow
    
    # Check if port 8080 is available
    if (Test-Port 8080) {
        Write-Host "❌ Port 8080 is already in use. Please stop the existing service." -ForegroundColor Red
        return $false
    }
    
    # Navigate to backend directory
    Set-Location "backend"
    
    # Clean and build project
    Write-Host "📦 Building Maven project..." -ForegroundColor Blue
    mvn clean compile
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Maven build failed!" -ForegroundColor Red
        return $false
    }
    
    # Start Spring Boot application
    Write-Host "🔥 Starting Spring Boot application..." -ForegroundColor Green
    Start-Process -FilePath "mvn" -ArgumentList "spring-boot:run" -NoNewWindow
    
    # Wait for application to start
    Write-Host "⏳ Waiting for application to start..." -ForegroundColor Yellow
    $maxAttempts = 30
    $attempts = 0
    
    do {
        Start-Sleep 2
        $attempts++
        $isRunning = Test-Port 8080
        if ($isRunning) {
            Write-Host "✅ Backend started successfully!" -ForegroundColor Green
            return $true
        }
        Write-Host "   Attempt $attempts/$maxAttempts..." -ForegroundColor Gray
    } while ($attempts -lt $maxAttempts)
    
    Write-Host "❌ Backend failed to start within timeout!" -ForegroundColor Red
    return $false
}

# Function to start frontend
function Start-Frontend {
    Write-Host "🎨 Starting React Frontend..." -ForegroundColor Yellow
    
    # Check if port 3000 is available
    if (Test-Port 3000) {
        Write-Host "❌ Port 3000 is already in use. Please stop the existing service." -ForegroundColor Red
        return $false
    }
    
    # Navigate to frontend directory
    Set-Location "../frontend"
    
    # Install dependencies if node_modules doesn't exist
    if (!(Test-Path "node_modules")) {
        Write-Host "📦 Installing npm dependencies..." -ForegroundColor Blue
        npm install
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ npm install failed!" -ForegroundColor Red
            return $false
        }
    }
    
    # Start React application
    Write-Host "🔥 Starting React development server..." -ForegroundColor Green
    Start-Process -FilePath "npm" -ArgumentList "start" -NoNewWindow
    
    return $true
}

# Function to display Swagger URLs
function Show-SwaggerInfo {
    Write-Host ""
    Write-Host "=== 📚 Swagger Documentation URLs ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Swagger UI:           http://localhost:8080/swagger-ui.html" -ForegroundColor Cyan
    Write-Host "📄 OpenAPI JSON:        http://localhost:8080/api-docs" -ForegroundColor Cyan
    Write-Host "📄 OpenAPI YAML:        http://localhost:8080/api-docs.yaml" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "=== 🎯 Main Application URLs ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "🖥️  Frontend Application: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "🔧 Backend API:           http://localhost:8080/api" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "=== 🔑 Authentication Instructions ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "1. Login via the frontend at: http://localhost:3000/login" -ForegroundColor White
    Write-Host "2. Copy the JWT token from browser DevTools (Network tab)" -ForegroundColor White
    Write-Host "3. In Swagger UI, click 'Authorize' button" -ForegroundColor White
    Write-Host "4. Enter: Bearer <your-jwt-token>" -ForegroundColor White
    Write-Host "5. Now you can test protected endpoints" -ForegroundColor White
    Write-Host ""
    Write-Host "=== 📋 API Categories Available ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔐 Authentication:       Login, Registration, Profile Management" -ForegroundColor White
    Write-Host "🏥 Medical Events:       Medical incident recording and tracking" -ForegroundColor White
    Write-Host "💊 Medication Requests:  Parent medication request management" -ForegroundColor White
    Write-Host "👨‍🎓 Student Management:   Student profiles and health records" -ForegroundColor White
    Write-Host "👩‍⚕️  Nurse Dashboard:      Nurse specific functionalities" -ForegroundColor White
    Write-Host "👨‍👩‍👧‍👦 Parent Portal:        Parent-child relationship management" -ForegroundColor White
    Write-Host "🏛️  Admin Functions:     User management and system administration" -ForegroundColor White
    Write-Host ""
}

# Main execution
try {
    $originalLocation = Get-Location
    
    # Start backend
    $backendStarted = Start-Backend
    
    if ($backendStarted) {
        # Start frontend
        Start-Frontend
        
        # Show information
        Show-SwaggerInfo
        
        Write-Host "=== 🎉 Application Started Successfully! ===" -ForegroundColor Green
        Write-Host ""
        Write-Host "Press Ctrl+C to stop the services" -ForegroundColor Yellow
        Write-Host ""
        
        # Open Swagger UI in default browser
        Write-Host "🌐 Opening Swagger UI in your default browser..." -ForegroundColor Yellow
        Start-Process "http://localhost:8080/swagger-ui.html"
        
        # Keep script running
        Write-Host "Script will continue running. Press Ctrl+C to exit." -ForegroundColor Gray
        try {
            while ($true) {
                Start-Sleep 1
            }
        }
        catch [System.Management.Automation.PipelineStoppedException] {
            Write-Host ""
            Write-Host "🛑 Stopping services..." -ForegroundColor Yellow
        }
    }
    else {
        Write-Host "❌ Failed to start backend. Aborting..." -ForegroundColor Red
    }
}
catch {
    Write-Host "❌ An error occurred: $($_.Exception.Message)" -ForegroundColor Red
}
finally {
    # Return to original location
    Set-Location $originalLocation
    Write-Host "👋 Goodbye!" -ForegroundColor Green
}
