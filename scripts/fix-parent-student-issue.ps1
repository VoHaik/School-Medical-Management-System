# PowerShell script to analyze and fix parent-student relationships

$sqlScriptPath = "$PSScriptRoot\..\sql\analyze-fix-relationship-issue.sql"
$outputFile = "$PSScriptRoot\..\logs\relationship_analysis_$(Get-Date -Format 'yyyyMMdd_HHmmss').txt"

# Create logs directory if it doesn't exist
$logsDir = "$PSScriptRoot\..\logs"
if (-not (Test-Path $logsDir)) {
    New-Item -ItemType Directory -Path $logsDir | Out-Null
}

# Prompt for SQL Server connection info
$sqlServerInstance = Read-Host "Enter SQL Server instance (e.g., localhost\SQLEXPRESS)"
$databaseName = Read-Host "Enter database name"
$useIntegratedSecurity = Read-Host "Use Windows Authentication? (Y/N)"

$connectionParams = @{
    ServerInstance = $sqlServerInstance
    Database = $databaseName
}

if ($useIntegratedSecurity -eq "Y" -or $useIntegratedSecurity -eq "y") {
    $connectionParams.Add("TrustServerCertificate", $true)
} else {
    $sqlUsername = Read-Host "Enter SQL username"
    $sqlPassword = Read-Host -AsSecureString "Enter SQL password"
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($sqlPassword)
    $sqlPasswordText = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
    $connectionParams.Add("Username", $sqlUsername)
    $connectionParams.Add("Password", $sqlPasswordText)
    $connectionParams.Add("TrustServerCertificate", $true)
}

# Modify the SQL script with specific values from the log
$parentCode = Read-Host "Enter the parent_code from the logs (e.g., PAR001)"
$studentCode = Read-Host "Enter the student_code from the logs (e.g., STU001)"

# Read the SQL script and replace placeholder values
$sqlScript = Get-Content -Path $sqlScriptPath -Raw
$sqlScript = $sqlScript.Replace("@parentCode NVARCHAR(50) = 'PAR001'", "@parentCode NVARCHAR(50) = '$parentCode'")
$sqlScript = $sqlScript.Replace("@studentCode NVARCHAR(50) = 'STU001'", "@studentCode NVARCHAR(50) = '$studentCode'")

# Create temporary modified SQL script
$tempScriptPath = "$env:TEMP\temp_relationship_analysis.sql"
Set-Content -Path $tempScriptPath -Value $sqlScript

# Run the analysis script
Write-Host "Running database analysis..." -ForegroundColor Yellow
try {
    $result = Invoke-Sqlcmd @connectionParams -InputFile $tempScriptPath -OutputSqlErrors $true -Verbose
    
    # Save results to file
    $result | Format-Table -AutoSize | Out-File -FilePath $outputFile
    Write-Host "Analysis complete! Results saved to: $outputFile" -ForegroundColor Green
    
    # Display key findings
    Write-Host "`nKey findings summary:" -ForegroundColor Cyan
    
    # Check if the parent exists
    $parentExists = $result | Where-Object { $_.parent_code -eq $parentCode -and $_.TABLE_NAME -eq 'Parents' }
    if ($parentExists) {
        Write-Host "✓ Parent with code '$parentCode' exists in the database." -ForegroundColor Green
    } else {
        Write-Host "✗ Parent with code '$parentCode' NOT FOUND in the database!" -ForegroundColor Red
    }
    
    # Check if the student exists
    $studentExists = $result | Where-Object { $_.student_code -eq $studentCode -and $_.TABLE_NAME -eq 'Students' }
    if ($studentExists) {
        Write-Host "✓ Student with code '$studentCode' exists in the database." -ForegroundColor Green
    } else {
        Write-Host "✗ Student with code '$studentCode' NOT FOUND in the database!" -ForegroundColor Red
    }
    
    # Check if the relationship exists
    $relationshipExists = $result | Where-Object { $_.parent_code -eq $parentCode -and $_.student_code -eq $studentCode -and $_.TABLE_NAME -eq 'ParentStudentRelationships' }
    if ($relationshipExists) {
        Write-Host "✓ Relationship between parent '$parentCode' and student '$studentCode' exists." -ForegroundColor Green
    } else {
        Write-Host "✗ Relationship between parent '$parentCode' and student '$studentCode' NOT FOUND!" -ForegroundColor Red
        
        # Ask if user wants to fix it
        $createRelationship = Read-Host "`nDo you want to create this parent-student relationship? (Y/N)"
        if ($createRelationship -eq "Y" -or $createRelationship -eq "y") {
            $relationshipType = Read-Host "Enter relationship type (e.g., Parent, Guardian)"
            
            $createSql = @"
INSERT INTO ParentStudentRelationships (parent_code, student_code, relationship_type)
VALUES ('$parentCode', '$studentCode', '$relationshipType');
"@
            
            try {
                Invoke-Sqlcmd @connectionParams -Query $createSql -ErrorAction Stop
                Write-Host "✓ Relationship successfully created!" -ForegroundColor Green
            } catch {
                Write-Host "✗ Failed to create relationship: $_" -ForegroundColor Red
            }
        }
    }
    
    # Check for username/user_code mismatches
    $mismatches = $result | Where-Object { $_.username -ne $null -and $_.user_code -ne $null -and $_.username -ne $_.user_code }
    if ($mismatches) {
        Write-Host "`n! Found username/user_code mismatches:" -ForegroundColor Yellow
        $mismatches | Format-Table username, user_code, parent_code -AutoSize
        
        $fixMismatches = Read-Host "Do you want to fix these mismatches? (Y/N)"
        if ($fixMismatches -eq "Y" -or $fixMismatches -eq "y") {
            $updateType = Read-Host "Update username to match user_code (1) or update user_code to match username (2)?"
            
            if ($updateType -eq "1") {
                $updateSql = "UPDATE Users SET username = user_code WHERE username <> user_code;"
            } elseif ($updateType -eq "2") {
                $updateSql = "UPDATE Users SET user_code = username WHERE username <> user_code;"
            } else {
                Write-Host "Invalid option. Skipping." -ForegroundColor Yellow
                $updateSql = ""
            }
            
            if ($updateSql) {
                try {
                    Invoke-Sqlcmd @connectionParams -Query $updateSql -ErrorAction Stop
                    Write-Host "✓ Mismatches fixed successfully!" -ForegroundColor Green
                } catch {
                    Write-Host "✗ Failed to fix mismatches: $_" -ForegroundColor Red
                }
            }
        }
    }
    
} catch {
    Write-Host "Error running analysis: $_" -ForegroundColor Red
} finally {
    # Clean up temporary file
    if (Test-Path $tempScriptPath) {
        Remove-Item $tempScriptPath -Force
    }
}

Write-Host "`nScript complete!" -ForegroundColor Cyan
Write-Host "Full results are available in: $outputFile" -ForegroundColor Cyan
