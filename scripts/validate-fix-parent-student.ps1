# PowerShell script to validate and fix parent-student relationships

# Configuration
$sqlServerInstance = Read-Host "Enter SQL Server instance (e.g., localhost\SQLEXPRESS)"
$databaseName = Read-Host "Enter database name"
$validationScriptPath = "$PSScriptRoot\..\sql\validate-parent-student-relationships.sql"
$fixScriptPath = "$PSScriptRoot\..\sql\fix-parent-student-relationships.sql"
$outputFolder = "$PSScriptRoot\..\logs"

# Create logs folder if it doesn't exist
if (-not (Test-Path $outputFolder)) {
    New-Item -ItemType Directory -Path $outputFolder | Out-Null
    Write-Host "Created logs directory: $outputFolder" -ForegroundColor Green
}

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$validationOutputFile = "$outputFolder\parent_student_validation_$timestamp.txt"
$fixOutputFile = "$outputFolder\parent_student_fix_$timestamp.txt"

# Function to run SQL scripts
function Run-SqlScript {
    param(
        [string]$scriptPath,
        [string]$outputFile
    )
    
    if (-not (Test-Path $scriptPath)) {
        Write-Host "Error: Script file not found at $scriptPath" -ForegroundColor Red
        return $false
    }
    
    try {
        Write-Host "Running script: $scriptPath" -ForegroundColor Yellow
        $result = Invoke-Sqlcmd -ServerInstance $sqlServerInstance -Database $databaseName -InputFile $scriptPath -OutputSqlErrors $true
        
        if ($result) {
            $result | Format-Table -AutoSize | Out-File -FilePath $outputFile
            Write-Host "Script executed successfully. Results saved to: $outputFile" -ForegroundColor Green
            return $true
        } else {
            Write-Host "Script executed without results." -ForegroundColor Yellow
            return $true
        }
    } catch {
        Write-Host "Error executing SQL script: $_" -ForegroundColor Red
        return $false
    }
}

# Step 1: Run validation script
Write-Host "`nStep 1: Validating parent-student relationships" -ForegroundColor Cyan
$validationSuccess = Run-SqlScript -scriptPath $validationScriptPath -outputFile $validationOutputFile

if (-not $validationSuccess) {
    Write-Host "Validation failed. Exiting..." -ForegroundColor Red
    exit 1
}

# Step 2: Ask user if they want to run the fix script
Write-Host "`nStep 2: Apply fixes?" -ForegroundColor Cyan
Write-Host "The validation results have been saved to: $validationOutputFile" -ForegroundColor Yellow
Write-Host "Review the results to determine if fixes are needed." -ForegroundColor Yellow

$confirmFix = Read-Host "Would you like to run the fix script? (y/N)"
if ($confirmFix -eq "y" -or $confirmFix -eq "Y") {
    # Run the fix script
    Write-Host "`nRunning fix script..." -ForegroundColor Yellow
    $fixSuccess = Run-SqlScript -scriptPath $fixScriptPath -outputFile $fixOutputFile
    
    if ($fixSuccess) {
        Write-Host "Fix script completed. Results saved to: $fixOutputFile" -ForegroundColor Green
    } else {
        Write-Host "Fix script failed." -ForegroundColor Red
    }
    
    # Re-run validation to confirm fixes
    Write-Host "`nRe-validating after fixes..." -ForegroundColor Yellow
    $revalidationOutputFile = "$outputFolder\parent_student_revalidation_$timestamp.txt"
    $revalidationSuccess = Run-SqlScript -scriptPath $validationScriptPath -outputFile $revalidationOutputFile
    
    if ($revalidationSuccess) {
        Write-Host "Re-validation complete. Results saved to: $revalidationOutputFile" -ForegroundColor Green
    }
} else {
    Write-Host "Fix script was not run." -ForegroundColor Yellow
}

Write-Host "`nProcess completed." -ForegroundColor Cyan
Write-Host "Remember to restart the backend application after making database changes." -ForegroundColor Yellow
