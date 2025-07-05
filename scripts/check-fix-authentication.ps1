# Quick script to check the current user authentication and relationship details

$sqlServerInstance = Read-Host "Enter SQL Server instance (e.g., localhost\SQLEXPRESS)"
$databaseName = Read-Host "Enter database name"

$username = Read-Host "Enter parent username from the error logs (e.g., parent.smith)"
$studentCode = Read-Host "Enter student code from the error logs (e.g., STU001)"

$scriptPath = "$PSScriptRoot\..\sql\diagnose-fix-authentication.sql"

# Create a temporary modified script with the specific parent and student details
$sqlScript = Get-Content -Path $scriptPath -Raw
$sqlScript = $sqlScript.Replace("DECLARE @parentUsername NVARCHAR(50) = 'parent.smith'", "DECLARE @parentUsername NVARCHAR(50) = '$username'")
$sqlScript = $sqlScript.Replace("DECLARE @studentCode NVARCHAR(50) = 'STU001'", "DECLARE @studentCode NVARCHAR(50) = '$studentCode'")

$tempScriptPath = "$env:TEMP\temp_diagnose_auth.sql"
Set-Content -Path $tempScriptPath -Value $sqlScript

Write-Host "Running diagnosis for parent '$username' and student '$studentCode'..." -ForegroundColor Yellow

try {
    $results = Invoke-Sqlcmd -ServerInstance $sqlServerInstance -Database $databaseName -InputFile $tempScriptPath -OutputAs DataTables
    
    # Display the results in a more readable format
    foreach ($table in $results) {
        Write-Host "`n==============================================" -ForegroundColor Cyan
        $table | Format-Table -AutoSize
    }
    
    # Check if we found a parent with this username
    $parentTable = $results | Where-Object { $_.Columns -contains "parent_name" -and $_.Columns -contains "username" }
    if ($parentTable -and $parentTable.Rows.Count -eq 0) {
        Write-Host "`nPROBLEM DETECTED: Parent with username '$username' was not found!`n" -ForegroundColor Red
        
        # Offer to check if parent exists with different username
        $checkOtherParents = Read-Host "Would you like to see all parents in the system? (y/n)"
        if ($checkOtherParents -eq 'y') {
            $parentsQuery = "SELECT p.parent_id, p.parent_code, p.full_name, u.username, u.user_code FROM Parents p LEFT JOIN Users u ON p.parent_code = u.user_code"
            $allParents = Invoke-Sqlcmd -ServerInstance $sqlServerInstance -Database $databaseName -Query $parentsQuery
            
            Write-Host "`nAll Parents in the system:" -ForegroundColor Green
            $allParents | Format-Table -AutoSize
        }
    }
    
    # Check if we found a relationship
    $relationshipTable = $results | Where-Object { $_.Columns -contains "relationship_id" -and $_.Columns -contains "relationship_type" }
    if ($relationshipTable -and $relationshipTable.Rows.Count -eq 0) {
        Write-Host "`nPROBLEM DETECTED: No relationship found between parent '$username' and student '$studentCode'!`n" -ForegroundColor Red
        
        # Offer to add the relationship
        $parentDetailsQuery = "SELECT p.parent_code FROM Parents p JOIN Users u ON p.parent_code = u.user_code WHERE u.username = '$username'"
        $studentExistsQuery = "SELECT 1 FROM Students WHERE student_code = '$studentCode'"
        
        $parentCode = Invoke-Sqlcmd -ServerInstance $sqlServerInstance -Database $databaseName -Query $parentDetailsQuery
        $studentExists = Invoke-Sqlcmd -ServerInstance $sqlServerInstance -Database $databaseName -Query $studentExistsQuery
        
        if ($parentCode -and $studentExists) {
            $addRelationship = Read-Host "Would you like to add the missing relationship? (y/n)"
            if ($addRelationship -eq 'y') {
                $relationshipType = Read-Host "Enter relationship type (e.g., Parent, Father, Mother, Guardian)"
                
                $addQuery = @"
INSERT INTO ParentStudentRelationships (parent_code, student_code, relationship_type, created_at)
VALUES ('$($parentCode.parent_code)', '$studentCode', '$relationshipType', GETDATE());
"@
                try {
                    Invoke-Sqlcmd -ServerInstance $sqlServerInstance -Database $databaseName -Query $addQuery
                    Write-Host "`nRelationship successfully added!" -ForegroundColor Green
                } catch {
                    Write-Host "`nError adding relationship: $_" -ForegroundColor Red
                }
            }
        }
    }
    
    # Check for username/user_code mismatches
    $mismatchTable = $results | Where-Object { $_.Columns -contains "status" -and ($_.Rows | Where-Object { $_["status"].ToString().Contains("MISMATCH") }) }
    if ($mismatchTable -and $mismatchTable.Rows.Count -gt 0) {
        Write-Host "`nPROBLEM DETECTED: Found username/user_code mismatches!`n" -ForegroundColor Red
        
        # Offer to fix the mismatches
        $fixMismatches = Read-Host "Would you like to fix these mismatches? (y/n)"
        if ($fixMismatches -eq 'y') {
            $fixType = Read-Host "Fix by updating: (1) user_code to match username, or (2) username to match user_code?"
            
            if ($fixType -eq '1') {
                $fixQuery = @"
UPDATE u
SET u.user_code = u.username
FROM Users u
JOIN Parents p ON u.user_id = (SELECT user_id FROM Users WHERE user_code = p.parent_code)
WHERE u.username <> u.user_code;
"@
            } elseif ($fixType -eq '2') {
                $fixQuery = @"
UPDATE u
SET u.username = u.user_code
FROM Users u
JOIN Parents p ON u.user_id = (SELECT user_id FROM Users WHERE user_code = p.parent_code)
WHERE u.username <> u.user_code;
"@
            } else {
                Write-Host "Invalid option selected. No changes made." -ForegroundColor Yellow
                $fixQuery = $null
            }
            
            if ($fixQuery) {
                try {
                    Invoke-Sqlcmd -ServerInstance $sqlServerInstance -Database $databaseName -Query $fixQuery
                    Write-Host "`nMismatches fixed successfully!" -ForegroundColor Green
                } catch {
                    Write-Host "`nError fixing mismatches: $_" -ForegroundColor Red
                }
            }
        }
    }
    
} catch {
    Write-Host "Error running diagnosis: $_" -ForegroundColor Red
} finally {
    # Clean up temporary file
    if (Test-Path $tempScriptPath) {
        Remove-Item $tempScriptPath -Force
    }
}

Write-Host "`nDiagnosis complete. Don't forget to rebuild and restart the application if you made any changes." -ForegroundColor Cyan
