@echo off
setlocal enabledelayedexpansion
echo Script Start
echo Current system JAVA_HOME environment variable: %JAVA_HOME%
echo.
echo DEBUG: Line A
REM Check if we can find a compatible Java version
echo DEBUG: Line B
set FOUND_JAVA17=false
echo DEBUG: Line C. Value: %FOUND_JAVA17%
set JAVA_PATH=
echo DEBUG: Line D. Value: "%JAVA_PATH%"
REM Check if JAVA_HOME points to Java 17+
echo DEBUG: Line E (About to check JAVA_HOME definition)
set TEST_BEFORE_IF=OK
echo DEBUG: Test var before if: %TEST_BEFORE_IF%

set java_home_defined_flag=0
if defined JAVA_HOME set java_home_defined_flag=1
echo DEBUG: java_home_defined_flag set to: %java_home_defined_flag%

if %java_home_defined_flag% equ 1 (
    echo DEBUG: Line F (JAVA_HOME IS DEFINED - Block Start)
    echo JAVA_HOME is defined: %JAVA_HOME%
    if exist "%JAVA_HOME%\bin\java.exe" (
        echo DEBUG: Line G (java.exe exists in JAVA_HOME - Block Start)
        echo Found java.exe at %JAVA_HOME%\bin\java.exe
        
        REM Check for Java 17
        echo DEBUG: Line H (Before Java 17 check)
        "%JAVA_HOME%\bin\java.exe" -version 2>&1 | findstr /i "version \"17\." > nul
        echo DEBUG: Line I (After Java 17 check. Errorlevel: %errorlevel%)
        if not errorlevel 1 (
            set FOUND_JAVA17=true
            set JAVA_PATH=%JAVA_HOME%\bin\java.exe
            echo Found Java 17+ at JAVA_HOME: %JAVA_PATH%
            goto :start_app_logic
        )
        
        REM Check for Java 18
        echo DEBUG: Line J (Before Java 18 check)
        "%JAVA_HOME%\bin\java.exe" -version 2>&1 | findstr /i "version \"18\." > nul
        echo DEBUG: Line K (After Java 18 check. Errorlevel: %errorlevel%)
        if not errorlevel 1 (
            set FOUND_JAVA17=true
            set JAVA_PATH=%JAVA_HOME%\bin\java.exe
            echo Found Java 18+ at JAVA_HOME: %JAVA_PATH%
            goto :start_app_logic
        )
        
        REM Check for Java 19
        echo DEBUG: Line L (Before Java 19 check)
        "%JAVA_HOME%\bin\java.exe" -version 2>&1 | findstr /i "version \"19\." > nul
        echo DEBUG: Line M (After Java 19 check. Errorlevel: %errorlevel%)
        if not errorlevel 1 (
            set FOUND_JAVA17=true
            set JAVA_PATH=%JAVA_HOME%\bin\java.exe
            echo Found Java 19+ at JAVA_HOME: %JAVA_PATH%
            goto :start_app_logic
        )
        
        REM Check for Java 20+ (e.g., 20, 21, 22, 23, 24, etc.)
        echo DEBUG: Line N (Before echo "--- Checking JAVA_HOME for Java 20+...")
        echo "--- Checking JAVA_HOME for Java 20+ (e.g., 24) ---"
        echo DEBUG: Line O (Before echo "Executing: %JAVA_HOME%\bin\java.exe -version")
        echo Executing: "%JAVA_HOME%\bin\java.exe" -version

        echo DEBUG: Capturing output of java -version for findstr processing:
        FOR /F "tokens=* delims=" %%L IN ('"%JAVA_HOME%\bin\java.exe" -version 2^>^&1') DO (
            echo DEBUG_JAVA_VERSION_OUTPUT_LINE: %%L
        )
        
        echo DEBUG: Line P (Before Java 20+ check command)
        "%JAVA_HOME%\bin\java.exe" -version 2>&1 | findstr /R /C:"version \"1[7-9]" /C:"version \"[2-9][0-9]" > nul
        echo DEBUG: Line Q (After Java 20+ check command. Errorlevel: %errorlevel%)
        echo DEBUG: Line R (Before echo "findstr errorlevel after checking for version 17-99...")
        echo findstr errorlevel after checking for "version 17-99": %errorlevel%
        if %errorlevel% equ 0 (
            echo Java 17+ ^(including 20+^) detected in JAVA_HOME.
            set "PREFERRED_JAVA_EXE=%JAVA_HOME%\bin\java.exe"
            echo PREFERRED_JAVA_EXE set to: !PREFERRED_JAVA_EXE!
            set "JAVA_PATH=!PREFERRED_JAVA_EXE!"
            set "FOUND_JAVA17=true"
            echo Successfully set PREFERRED_JAVA_EXE and updated JAVA_PATH/FOUND_JAVA17.
            goto :start_app_logic
        ) else (
            echo Java 17+ ^(including 20+^) NOT found in JAVA_HOME.
        )
        echo DEBUG: Line S (After Java 20+ check block)
        echo DEBUG: Line G END (java.exe exists in JAVA_HOME - Block End)
    ) else (
        echo DEBUG: Line T (JAVA_HOME defined, but %JAVA_HOME%\bin\java.exe not found)
        echo INFO: %JAVA_HOME%\bin\java.exe not found.
    )
    echo DEBUG: Line F END (JAVA_HOME IS DEFINED - Block End)
) else (
    echo DEBUG: Line V (JAVA_HOME IS NOT DEFINED - Block Start)
    echo INFO: JAVA_HOME environment variable is not defined.
    echo DEBUG: Line V END (JAVA_HOME IS NOT DEFINED - Block End)
)
echo DEBUG: Line W (After IF defined JAVA_HOME construct)

:path_checks
REM Check if we have Java 17+ in PATH
echo DEBUG: Before PATH checks. No jump to start_app_logic from JAVA_HOME checks occurred.
if "%FOUND_JAVA17%"=="true" (
    echo DEBUG: FOUND_JAVA17 is true from JAVA_HOME, skipping PATH checks.
    goto :start_app_logic
)

java -version 2>&1 | findstr /i "version \"17\." > nul
if not errorlevel 1 (
    set FOUND_JAVA17=true
    set JAVA_PATH=java
    echo Found Java 17+ in PATH
    goto :start_app_logic
)
java -version 2>&1 | findstr /i "version \"18\." > nul
if not errorlevel 1 (
    set FOUND_JAVA17=true
    set JAVA_PATH=java
    echo Found Java 18+ in PATH
    goto :start_app_logic
)
java -version 2>&1 | findstr /i "version \"19\." > nul
if not errorlevel 1 (
    set FOUND_JAVA17=true
    set JAVA_PATH=java
    echo Found Java 19+ in PATH
    goto :start_app_logic
)
java -version 2>&1 | findstr /R /C:"version \"1[7-9]" /C:"version \"[2-9][0-9]" > nul
if not errorlevel 1 (
    set FOUND_JAVA17=true
    set JAVA_PATH=java
    echo Found Java 20+ in PATH
    goto :start_app_logic
)
echo DEBUG: After PATH checks. No Java 17+ found in PATH by script.

REM If we reach here, we did not find Java 17+ (and it wasn't set by JAVA_HOME either)
echo WARNING: Java 17 or higher not found by script. This application requires Java 17+.
echo Your current Java version (if 'java' is in PATH):
java -version 2>&1
echo.
echo Please install Java 17 or higher and ensure it's in your PATH or JAVA_HOME.
echo Refer to:
echo - https://adoptium.net/
echo - https://www.oracle.com/java/technologies/downloads/
echo.
echo Press any key to try to start with current Java version (may fail if not 17+)...
pause > nul
REM Fall through to start_app_logic, which will use default 'java' if JAVA_PATH is still empty
goto :start_app_logic


:start_app_logic
echo DEBUG: Reached :start_app_logic
echo.
echo Navigating to backend directory...
echo DEBUG: Line PRE_CD. Current directory: %CD%
cd ..\backend
echo DEBUG: Line POST_CD. Errorlevel is now: %ERRORLEVEL%. Current directory is now: %CD%

if errorlevel 1 (
    echo DEBUG: Line ENTERING_IF_BLOCK ^(cd command likely failed^).
    echo ERROR: Could not change directory to ..\backend.
    echo Current directory at time of failure: %CD% ^(should be the 'scripts' directory if cd failed^)
    echo Please ensure this script ^(start-backend.bat^) is in the 'scripts' subdirectory of the project.
    pause
    exit /b 1
)
echo DEBUG: Line AFTER_IF_BLOCK ^(cd command was successful^).
echo Successfully changed directory to: %CD%
echo.

echo DEBUG: Line PRE_JAR_CHECK. Current directory: %CD%
set JAR_FILE=target\SWP391-Project-1.0-SNAPSHOT.jar
echo DEBUG: JAR_FILE is set to: "%JAR_FILE%"

echo Checking for JAR file: "%JAR_FILE%"
if not exist "%JAR_FILE%" (
    echo DEBUG: JAR_FILE_NOT_FOUND block entered.
    echo ERROR: JAR file not found at "%CD%\%JAR_FILE%"
    echo Please build the project first using 'mvn package' in this directory ^(%CD%^).
    pause
    exit /b 1
)
echo DEBUG: JAR_FILE_FOUND.
echo Found JAR file: "%JAR_FILE%"
echo.

echo Starting Spring Boot API using JAR...
if "%FOUND_JAVA17%"=="true" (
    if "%JAVA_PATH%"=="" set JAVA_PATH=java & echo DEBUG: JAVA_PATH was empty, defaulting to 'java'
    if "%JAVA_PATH%"=="java" (
        echo Using Java from PATH to run JAR...
        java -jar %JAR_FILE%
    ) else (
        echo Using Java from "%JAVA_PATH%" to run JAR...
        "%JAVA_PATH%" -jar %JAR_FILE%
    )
) else (
    echo WARNING: Java 17+ not confirmed by script. Attempting to run with default 'java' command.
    echo This might fail if the default Java is not version 17 or higher.
    java -jar %JAR_FILE%
)

echo.
echo Backend application process started. Check this window for logs.
echo If the application fails to start, check for errors above.
REM The 'java -jar' command will keep this window open.
REM A pause here would only execute if java -jar exits immediately (e.g. on error).
pause

echo End of script.