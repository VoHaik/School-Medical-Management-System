# PowerShell Script to verify user accounts creation and login functionality
# verify-user-accounts.ps1

Write-Host "School Medical Management System - User Account Verification" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if SQL Server is running
Write-Host "Checking SQL Server status..." -ForegroundColor Yellow
try {
    $sqlService = Get-Service -Name "MSSQLSERVER" -ErrorAction SilentlyContinue
    if ($null -eq $sqlService) {
        $sqlService = Get-Service -Name "MSSQL$*" -ErrorAction SilentlyContinue | Select-Object -First 1
    }

    if ($null -eq $sqlService) {
        Write-Host "SQL Server service not found. Make sure SQL Server is installed." -ForegroundColor Red
        exit 1
    }

    if ($sqlService.Status -ne 'Running') {
        Write-Host "SQL Server is not running. Starting service..." -ForegroundColor Yellow
        Start-Service -InputObject $sqlService
        Start-Sleep -Seconds 5
        if ($sqlService.Status -ne 'Running') {
            Write-Host "Failed to start SQL Server. Please start it manually." -ForegroundColor Red
            exit 1
        }
    }

    Write-Host "SQL Server is running: $($sqlService.DisplayName)" -ForegroundColor Green
} catch {
    Write-Host "Error checking SQL Server status: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 2: Check if database exists and create it if it doesn't
Write-Host "`nChecking database status..." -ForegroundColor Yellow

$databaseName = "HealthSchoolDB"  # Based on application.yaml
$serverName = "localhost"
$username = "sa"
$password = "123456"

try {
    # Check if the database exists
    $query = "SELECT COUNT(*) as Count FROM sys.databases WHERE name = '$databaseName'"
    $result = Invoke-Sqlcmd -ServerInstance $serverName -Username $username -Password $password -Query $query -ErrorAction Stop
    
    if ($result.Count -eq 0) {
        Write-Host "Database '$databaseName' does not exist. Creating database..." -ForegroundColor Yellow
        $createDBQuery = "CREATE DATABASE $databaseName"
        Invoke-Sqlcmd -ServerInstance $serverName -Username $username -Password $password -Query $createDBQuery -ErrorAction Stop
        Write-Host "Database '$databaseName' created successfully." -ForegroundColor Green
    } else {
        Write-Host "Database '$databaseName' already exists." -ForegroundColor Green
    }
} catch {
    Write-Host "Error checking/creating database: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Please make sure your SQL Server is configured correctly and the credentials are valid." -ForegroundColor Yellow
    exit 1
}

# Step 3: Create user accounts using the existing script
Write-Host "`nCreating user accounts..." -ForegroundColor Yellow
try {
    $createUsersScript = Join-Path $PSScriptRoot "create-users.ps1"
    if (Test-Path $createUsersScript) {
        & $createUsersScript
    } else {
        Write-Host "User creation script not found at: $createUsersScript" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Error creating user accounts: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 4: List the created user accounts
Write-Host "`nListing user accounts..." -ForegroundColor Yellow
try {
    $listUsersScript = Join-Path $PSScriptRoot "list-users.ps1"
    if (Test-Path $listUsersScript) {
        & $listUsersScript
    } else {
        Write-Host "User listing script not found at: $listUsersScript" -ForegroundColor Red
    }
} catch {
    Write-Host "Error listing user accounts: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 5: Test login API with created accounts
Write-Host "`nTesting login API with created accounts..." -ForegroundColor Yellow

# Function to test login for a user
function Test-UserLogin {
    param(
        [string]$username,
        [string]$password,
        [string]$role
    )
    
    Write-Host "`nTesting login for $role account ($username)..." -ForegroundColor Yellow
    
    try {
        # Prepare login request payload
        $body = @{
            username = $username
            password = $password
        } | ConvertTo-Json
        
        # API endpoint URL (assuming backend is running on port 8080)
        $url = "http://localhost:8080/api/auth/signin"
        
        # Send login request
        $response = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "application/json" -ErrorAction Stop
        
        # Display login result
        Write-Host "Login successful for $role account ($username)" -ForegroundColor Green
        Write-Host "User details:" -ForegroundColor Cyan
        Write-Host "  Full Name: $($response.fullName)" -ForegroundColor White
        Write-Host "  Email: $($response.email)" -ForegroundColor White
        Write-Host "  Roles: $($response.roles -join ', ')" -ForegroundColor White
        
        return $true
    } catch {
        Write-Host "Login failed for $role account ($username): $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $responseBody = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($responseBody)
            $responseText = $reader.ReadToEnd()
            Write-Host "Error details: $responseText" -ForegroundColor Red
        }
        return $false
    }
}

# Check if backend is running before testing login
$backendUrl = "http://localhost:8080/api/auth/me"
$backendRunning = $false

try {
    $null = Invoke-WebRequest -Uri $backendUrl -Method Get -TimeoutSec 5 -ErrorAction SilentlyContinue
    $backendRunning = $true
    Write-Host "Backend is running. Proceeding with login tests." -ForegroundColor Green
} catch {
    Write-Host "Backend server does not appear to be running on http://localhost:8080" -ForegroundColor Yellow
    Write-Host "Would you like to start the backend server now? (Y/N)" -ForegroundColor Yellow
    $startBackend = Read-Host
    
    if ($startBackend -eq 'Y' -or $startBackend -eq 'y') {
        Write-Host "Starting backend server..." -ForegroundColor Yellow
        
        # Start backend in a new PowerShell window
        $startCommand = "cd '$PSScriptRoot'; .\start-backend.bat; Read-Host 'Press Enter to close'"
        Start-Process powershell -ArgumentList "-NoExit", "-Command", $startCommand
        
        # Wait for backend to start
        Write-Host "Waiting for backend to start (30 seconds)..." -ForegroundColor Yellow
        $maxAttempts = 6
        $attempt = 0
        $backendRunning = $false
        
        while ($attempt -lt $maxAttempts -and -not $backendRunning) {
            Start-Sleep -Seconds 5
            $attempt++
            
            try {
                $null = Invoke-WebRequest -Uri $backendUrl -Method Get -TimeoutSec 5 -ErrorAction SilentlyContinue
                $backendRunning = true
                Write-Host "Backend server is now running!" -ForegroundColor Green
            } catch {
                Write-Host "Waiting for backend to start (attempt $attempt of $maxAttempts)..." -ForegroundColor Yellow
            }
        }
        
        if (-not $backendRunning) {
            Write-Host "Backend server did not start in time. You can try to run login tests later after the server starts." -ForegroundColor Red
        }
    } else {
        Write-Host "Skipping login tests since backend is not running." -ForegroundColor Yellow
    }
}

if ($backendRunning) {
    # Test login for all predefined accounts
    $accounts = @(
        @{username = "admin.user"; password = "Password123"; role = "Admin"},
        @{username = "nurse.johnson"; password = "Password123"; role = "School Nurse"},
        @{username = "manager.davis"; password = "Password123"; role = "Manager"},
        @{username = "parent.smith"; password = "Password123"; role = "Parent"}
    )
    
    $successCount = 0
    foreach ($account in $accounts) {
        $result = Test-UserLogin -username $account.username -password $account.password -role $account.role
        if ($result) {
            $successCount++
        }
    }
    
    # Display summary
    Write-Host "`nLogin Test Summary:" -ForegroundColor Cyan
    Write-Host "===================" -ForegroundColor Cyan
    Write-Host "Total accounts tested: $($accounts.Count)" -ForegroundColor White
    Write-Host "Successful logins: $successCount" -ForegroundColor White
    Write-Host "Failed logins: $($accounts.Count - $successCount)" -ForegroundColor White
    
    if ($successCount -eq $accounts.Count) {
        Write-Host "`n✓ All accounts were created successfully and can log in!" -ForegroundColor Green
    } else {
        Write-Host "`n⚠ Some accounts failed to log in. Please check the errors above." -ForegroundColor Yellow
    }
}

Write-Host "`nUser account verification completed." -ForegroundColor Cyan 