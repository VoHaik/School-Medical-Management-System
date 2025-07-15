@echo off
echo Killing all project-related ports...

echo Checking for processes on common development ports...
for %%p in (3000 3001 8080 8081 8082 5000 5173) do (
    echo Checking port %%p...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%%p "') do (
        if not "%%a"=="" (
            echo Killing process %%a on port %%p
            taskkill /F /PID %%a >nul 2>&1
        )
    )
)

echo Killing any Java processes...
taskkill /F /IM java.exe >nul 2>&1

echo Killing any Node.js processes...
taskkill /F /IM node.exe >nul 2>&1

echo All project ports have been cleared!
pause
