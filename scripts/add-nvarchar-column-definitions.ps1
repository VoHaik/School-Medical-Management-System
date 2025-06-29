# PowerShell script to add NVARCHAR column definition to Java entity classes
# This script processes all Java entity files in the model package
# Updated: June 2025 - To support Vietnamese characters

$scriptName = "Add NVARCHAR column definitions to Java Entities"
$scriptVersion = "1.0"

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "  $scriptName v$scriptVersion" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

# Setup paths
$modelPath = Join-Path $PSScriptRoot "..\backend\src\main\java\com\swp391_8\schoolhealth\model"
$backupPath = Join-Path $PSScriptRoot "..\backup\model-nvarchar-$(Get-Date -Format 'yyyyMMddHHmmss')"

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

# Function to update String fields with NVARCHAR column definition
function Add-NVarcharColumnDefinition {
    param (
        [string]$filePath
    )
    
    $fileName = Split-Path $filePath -Leaf
    Write-Host "Processing $fileName..." -ForegroundColor Yellow
    
    $content = Get-Content $filePath -Raw
    
    # Skip if not an entity class
    if ($content -notmatch '@Entity') {
        Write-Host "  Skipping $fileName - not an entity class" -ForegroundColor Gray
        return
    }
    
    # Count original String fields
    $stringFieldCount = ([regex]::Matches($content, "private\s+String\s+\w+;")).Count
    Write-Host "  Found $stringFieldCount String fields to process" -ForegroundColor Yellow
    
    $updatedCount = 0
    
    # Pattern 1: Column annotations without columnDefinition
    # Replace @Column(...) for String fields to include columnDefinition = "NVARCHAR"
    $pattern1 = '(@Column\s*\([^)]*?)(\)\s*\n\s*private\s+String\s+(\w+);)'
    
    $content = [regex]::Replace($content, $pattern1, {
        param($match)
        
        $columnAnnotation = $match.Groups[1].Value
        $closingParenAndField = $match.Groups[2].Value
        $fieldName = $match.Groups[3].Value
        
        # Skip if columnDefinition is already specified
        if ($columnAnnotation -match 'columnDefinition\s*=') {
            return $match.Value
        }
        
        # Add appropriate NVARCHAR type based on field name
        if ($fieldName -match '(description|notes|comment|reason|content|text|message|instructions|address|medicalNotes|actionTaken|symptoms|details)') {
            $newAnnotation = $columnAnnotation + ", columnDefinition = `"NVARCHAR(MAX)`""
        } else {
            $newAnnotation = $columnAnnotation + ", columnDefinition = `"NVARCHAR(255)`""
        }
        
        $updatedCount++
        return $newAnnotation + $closingParenAndField
    })
    
    # Pattern 2: String fields without Column annotation
    # Add @Column with columnDefinition for String fields without existing annotation
    $pattern2 = '(?<!@Column[^\n]*\n\s*)(private\s+String\s+(\w+);)'
    
    $content = [regex]::Replace($content, $pattern2, {
        param($match)
        
        $fieldDeclaration = $match.Groups[1].Value
        $fieldName = $match.Groups[2].Value
        
        # Skip certain fields that shouldn't have Column annotation
        if ($fieldName -match '^(serialVersionUID|LOGGER|log|logger|serialVersion|static)' -or $content -match "@Transient[^\n]*\n\s*$fieldDeclaration") {
            return $fieldDeclaration
        }
        
        # Add appropriate NVARCHAR type based on field name
        if ($fieldName -match '(description|notes|comment|reason|content|text|message|instructions|address|medicalNotes|actionTaken|symptoms|details)') {
            $columnDef = "@Column(columnDefinition = `"NVARCHAR(MAX)`")`n    "
        } else {
            $columnDef = "@Column(columnDefinition = `"NVARCHAR(255)`")`n    "
        }
        
        $updatedCount++
        return $columnDef + $fieldDeclaration
    })
    
    # Only save if changes were made
    if ($updatedCount -gt 0) {
        Set-Content -Path $filePath -Value $content
        Write-Host "  Updated $updatedCount fields in $fileName" -ForegroundColor Green
    } else {
        Write-Host "  No changes needed in $fileName" -ForegroundColor Gray
    }
}

# Process all entity files
$entityFiles = Get-ChildItem -Path $modelPath -Filter "*.java"
$entityCount = $entityFiles.Count
$processedCount = 0

Write-Host "Found $entityCount Java files to process" -ForegroundColor Yellow
foreach ($file in $entityFiles) {
    $processedCount++
    Write-Host "[$processedCount/$entityCount] " -NoNewline
    Add-NVarcharColumnDefinition -filePath $file.FullName
}

Write-Host "`nProcessing complete!" -ForegroundColor Green
Write-Host "1. Review the changes in your entity files." -ForegroundColor Yellow
Write-Host "2. Make sure to update your application.properties to include:" -ForegroundColor Yellow
Write-Host "   spring.jpa.properties.hibernate.connection.characterEncoding=UTF-8" -ForegroundColor Cyan
Write-Host "   spring.jpa.properties.hibernate.connection.useUnicode=true" -ForegroundColor Cyan
Write-Host "3. Database will need to be updated to support NVARCHAR columns." -ForegroundColor Yellow
Write-Host "`nBackups are available at: $backupPath" -ForegroundColor Green
