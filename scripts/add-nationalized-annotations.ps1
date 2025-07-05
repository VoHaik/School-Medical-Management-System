# PowerShell script to add @Nationalized annotations to Java entity string fields
# For School Medical Management System
# Date: June 16, 2025

$scriptName = "Add @Nationalized to Java Entities"
$scriptVersion = "1.0"

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "  $scriptName v$scriptVersion" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

# Setup paths
$modelPath = Join-Path $PSScriptRoot "..\backend\src\main\java\com\swp391_8\schoolhealth\model"
$backupPath = Join-Path $PSScriptRoot "..\backup\model-$(Get-Date -Format 'yyyyMMddHHmmss')"

# Check if model directory exists
if (-not (Test-Path $modelPath)) {
    Write-Host "Model directory not found at: $modelPath" -ForegroundColor Red
    exit 1
}

# Create backup directory
Write-Host "Creating backup of original model files..." -ForegroundColor Yellow
if (-not (Test-Path $backupPath)) {
    New-Item -ItemType Directory -Path $backupPath -Force | Out-Null
}

# Copy all Java files to backup location
Get-ChildItem -Path $modelPath -Filter "*.java" | ForEach-Object {
    Copy-Item $_.FullName -Destination $backupPath
}
Write-Host "Backup created at: $backupPath" -ForegroundColor Green

# Function to add @Nationalized annotation to string fields
function Add-NationalizedAnnotation {
    param (
        [string]$filePath
    )
    
    $fileName = Split-Path $filePath -Leaf
    Write-Host "Processing $fileName..." -ForegroundColor Yellow
    
    $content = Get-Content $filePath -Raw
    $originalContent = $content
    
    # Check if we need to add the import statement
    if ($content -notmatch "import\s+org\.hibernate\.annotations\.Nationalized;") {
        $content = $content -replace "(package.*?;)([\r\n]+import.*?;)*", "`$1`r`n`r`nimport org.hibernate.annotations.Nationalized;`$2"
    }
    
    # Find String fields that don't already have @Nationalized
    $pattern = "(?<!@Nationalized[\s\r\n]+)(?:private|protected|public)\s+String\s+(\w+);"
      # Count how many matches we have
    $regexMatches = [regex]::Matches($content, $pattern)
    $replacementCount = 0
    
    # Replace String fields with @Nationalized annotation
    $content = [regex]::Replace(
        $content, 
        $pattern, 
        {
            param($match)
            $replacementCount++
            return "@Nationalized`r`n    " + $match.Value
        }
    )
    
    # Only save if we made changes
    if ($content -ne $originalContent) {
        Set-Content -Path $filePath -Value $content
        Write-Host "  Added @Nationalized to $replacementCount field(s)" -ForegroundColor Green
        return $replacementCount
    }
    else {
        Write-Host "  No changes needed" -ForegroundColor Gray
        return 0
    }
}

# Process all Java files in the model directory
$totalFiles = 0
$totalFields = 0

Get-ChildItem -Path $modelPath -Filter "*.java" | ForEach-Object {
    $totalFiles++
    $fieldsUpdated = Add-NationalizedAnnotation -filePath $_.FullName
    $totalFields += $fieldsUpdated
}

Write-Host "`nSummary:" -ForegroundColor Cyan
Write-Host "  Processed $totalFiles files" -ForegroundColor Cyan
Write-Host "  Added @Nationalized annotation to $totalFields field(s)" -ForegroundColor Cyan

Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Run the SQL script to convert database columns from VARCHAR to NVARCHAR:" -ForegroundColor White
Write-Host "   sql\convert-all-varchar-to-nvarchar.sql" -ForegroundColor White
Write-Host "2. Rebuild the backend application:" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor White
Write-Host "   mvn clean package" -ForegroundColor White
Write-Host "3. Restart the application" -ForegroundColor White
Write-Host "`nNote: If you encounter any issues, your original files are backed up at:" -ForegroundColor White
Write-Host "$backupPath" -ForegroundColor White
