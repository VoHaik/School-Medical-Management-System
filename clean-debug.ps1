# Script to clean all debug code from frontend
param(
    [string]$Path = ".\frontend\src"
)

Write-Host "Cleaning debug code from frontend..."

# Get all JavaScript files
$jsFiles = Get-ChildItem -Path $Path -Filter "*.js" -Recurse

foreach ($file in $jsFiles) {
    Write-Host "Processing: $($file.FullName)"
    
    # Read file content
    $content = Get-Content $file.FullName -Raw
    
    # Remove console.log, console.debug, console.warn statements
    $cleanedContent = $content -replace 'console\.(log|debug|warn)\([^)]*\);\s*\r?\n?', ''
    
    # Remove single line comments that are debug related
    $cleanedContent = $cleanedContent -replace '^\s*//.*debug.*\r?\n', '', 'Multiline'
    $cleanedContent = $cleanedContent -replace '^\s*//.*Debug.*\r?\n', '', 'Multiline'
    $cleanedContent = $cleanedContent -replace '^\s*//.*DEBUG.*\r?\n', '', 'Multiline'
    $cleanedContent = $cleanedContent -replace '^\s*//.*test.*\r?\n', '', 'Multiline'
    $cleanedContent = $cleanedContent -replace '^\s*//.*Test.*\r?\n', '', 'Multiline'
    $cleanedContent = $cleanedContent -replace '^\s*//.*TEST.*\r?\n', '', 'Multiline'
    
    # Remove commented console statements
    $cleanedContent = $cleanedContent -replace '^\s*//\s*console\.(log|debug|warn).*\r?\n', '', 'Multiline'
    
    # Write back if content changed
    if ($content -ne $cleanedContent) {
        Set-Content -Path $file.FullName -Value $cleanedContent -NoNewline
        Write-Host "  - Cleaned"
    } else {
        Write-Host "  - No changes needed"
    }
}

Write-Host "Debug cleanup completed!"
