# Fix Login Issues Script
# This script helps fix common login issues with the School Medical Management System

Write-Host "School Medical Management System - Login Fix Utility" -ForegroundColor Cyan
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

# Step 2: Fix Role Names in database
Write-Host "`nFixing role names in database..." -ForegroundColor Yellow
try {
    $updateRolesQuery = @"
    UPDATE Roles SET role_name = 'ROLE_PARENT' WHERE role_name = 'Parent';
    UPDATE Roles SET role_name = 'ROLE_ADMIN' WHERE role_name = 'Admin';
    UPDATE Roles SET role_name = 'ROLE_NURSE' WHERE role_name = 'SchoolNurse' OR role_name = 'Nurse';
    UPDATE Roles SET role_name = 'ROLE_MANAGER' WHERE role_name = 'Manager';
    UPDATE Roles SET role_name = 'ROLE_STUDENT' WHERE role_name = 'Student';
"@
    
    sqlcmd -S localhost -U sa -P 123456 -d HealthSchoolDB -Q $updateRolesQuery
    Write-Host "Role names updated to match Spring Security conventions" -ForegroundColor Green
    
    # Verify roles
    $rolesQuery = "SELECT role_id, role_name FROM Roles;"
    Write-Host "`nCurrent roles in database:" -ForegroundColor Cyan
    sqlcmd -S localhost -U sa -P 123456 -d HealthSchoolDB -Q $rolesQuery
} catch {
    Write-Host "Error updating role names: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 3: Check specific user accounts
Write-Host "`nChecking parent.smith account..." -ForegroundColor Yellow
try {
    $userQuery = "SELECT u.id, u.username, u.password, r.role_name FROM Users u JOIN Roles r ON u.role_id = r.role_id WHERE username = 'parent.smith';"
    sqlcmd -S localhost -U sa -P 123456 -d HealthSchoolDB -Q $userQuery
} catch {
    Write-Host "Error checking parent.smith account: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 4: Kill any running backend processes and restart
Write-Host "`nRestarting backend server..." -ForegroundColor Yellow
try {
    # Kill any Java processes that might be running the backend
    Get-Process -Name "java" -ErrorAction SilentlyContinue | ForEach-Object {
        Write-Host "Stopping Java process (PID: $($_.Id))" -ForegroundColor Yellow
        Stop-Process -Id $_.Id -Force
    }
    
    # Start the backend using the VS Code task or directly
    Write-Host "Starting backend server..." -ForegroundColor Yellow
    Start-Process -FilePath "java" -ArgumentList "-jar", "backend/target/SWP391-Project-1.0-SNAPSHOT.jar" -WindowStyle Normal
    
    Write-Host "Backend server started. Please wait a few moments for it to initialize." -ForegroundColor Green
} catch {
    Write-Host "Error restarting backend: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 5: Instructions for testing login
Write-Host "`nTo test login:" -ForegroundColor Cyan
Write-Host "1. Wait about 30 seconds for the backend to fully start" -ForegroundColor White
Write-Host "2. Use the following credentials:" -ForegroundColor White
Write-Host "   Username: parent.smith" -ForegroundColor White
Write-Host "   Password: Password123" -ForegroundColor White
Write-Host "`nIf login still fails after this fix, check the application logs for more details." -ForegroundColor Yellow
