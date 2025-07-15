# Simple script to remove console.log statements
Get-ChildItem -Path ".\frontend\src" -Filter "*.js" -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName -Raw -ErrorAction SilentlyContinue
    if ($content) {
        # Remove console.log statements
        $cleanContent = $content -replace 'console\.log\([^)]*\);\s*\r?\n?', ''
        $cleanContent = $cleanContent -replace '\s*console\.log\([^)]*\)\s*', ''
        $cleanContent = $cleanContent -replace '\{\s*console\.log\([^)]*\)\s*\}', ''
        
        if ($content -ne $cleanContent) {
            Set-Content -Path $_.FullName -Value $cleanContent -NoNewline
            Write-Host "Cleaned: $($_.Name)"
        }
    }
}
