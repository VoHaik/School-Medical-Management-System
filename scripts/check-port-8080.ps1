# Check if anything is running on port 8080
Write-Host "Checking for processes using port 8080..."
$processes = netstat -ano | Select-String ":8080"

if ($processes) {
    Write-Host "Found processes using port 8080:"
    $processes

    # Extract the PIDs
    $pids = $processes | ForEach-Object {
        $line = $_ -replace '\s+', ' '
        $parts = $line.Split(' ')
        $parts[$parts.Count - 1]
    } | Select-Object -Unique

    Write-Host "`nProcess details:"
    foreach ($pid in $pids) {
        $processDetails = Get-Process -Id $pid -ErrorAction SilentlyContinue
        if ($processDetails) {
            Write-Host "PID: $pid - $($processDetails.ProcessName) - $($processDetails.Path)"
        }
    }

    Write-Host "`nTo kill a specific process, run: Stop-Process -Id <PID>"
    Write-Host "Example: Stop-Process -Id $($pids[0])"
    
    $choice = Read-Host "Do you want to kill all processes using port 8080? (Y/N)"
    if ($choice -eq "Y" -or $choice -eq "y") {
        foreach ($pid in $pids) {
            try {
                Stop-Process -Id $pid -Force
                Write-Host "Process with PID $pid has been terminated."
            } catch {
                Write-Host "Failed to terminate process with PID $pid: $_"
            }
        }
        Write-Host "All processes using port 8080 have been terminated."
    }
} else {
    Write-Host "No processes found using port 8080."
}
