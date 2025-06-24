# Script to run the frontend application

Write-Host "Starting the frontend application..."

# Navigate to the frontend directory
Set-Location -Path (Join-Path $PSScriptRoot "..\frontend")

# Check if Node.js is installed
try {
    $nodeVersion = node -v
    Write-Host "Node.js is installed: $nodeVersion"
} catch {
    Write-Host "Error: Node.js may not be installed or not in PATH." -ForegroundColor Red
    Write-Host "Please install Node.js and make sure it's in your PATH."
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm -v
    Write-Host "npm is installed: $npmVersion"
} catch {
    Write-Host "Error: npm may not be installed or not in PATH." -ForegroundColor Red
    Write-Host "Please install npm and make sure it's in your PATH."
    exit 1
}

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..."
    Invoke-Expression "npm install"
}

# Start the frontend application
Write-Host "Starting the React application..."
Write-Host "The application will open in your default browser."
Write-Host "Press Ctrl+C in this terminal to stop the application."

Invoke-Expression "npm start"
