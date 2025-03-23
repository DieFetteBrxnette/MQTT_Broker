@echo off
setlocal EnableDelayedExpansion

:: Check for admin privileges
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo This script requires administrator privileges.
    echo Please run as administrator.
    pause
    exit /b 1
)

:: Kill all Mosquitto processes first
echo Killing all Mosquitto processes...
taskkill /F /IM mosquitto.exe /T 2>nul
timeout /t 2 /nobreak >nul

echo Stopping Mosquitto service if running...
net stop mosquitto 2>nul
timeout /t 2 /nobreak >nul

echo Checking for processes using port 1883...
FOR /F "tokens=5" %%P IN ('netstat -ano ^| find ":1883" ^| find "LISTENING"') DO (
    SET pid=%%P
    echo Found process with PID !pid! using port 1883
    
    :: Get process name for logging
    for /f "tokens=1" %%A in ('tasklist /FI "PID eq !pid!" /NH /FO CSV') do (
        set "procname=%%~A"
        echo Process name: !procname!
    )
    
    :: Try multiple ways to kill the process
    taskkill /F /PID !pid! /T 2>nul
    if !ERRORLEVEL! neq 0 (
        echo Attempting alternative method to kill process...
        powershell -Command "Stop-Process -Id !pid! -Force" 2>nul
    )
    timeout /t 2 /nobreak >nul
)

echo Waiting for port to be released...
timeout /t 5 /nobreak >nul

echo Verifying port 1883 is free...
netstat -ano | find ":1883" | find "LISTENING" >nul
if %ERRORLEVEL% EQU 0 (
    echo ERROR: Port 1883 is still in use.
    echo Running processes on port 1883:
    netstat -ano | find ":1883" | find "LISTENING"
    echo.
    echo Please close these processes manually or restart your system.
    pause
    exit /b 1
)

echo Starting Mosquitto...
mosquitto -v -c mosquitto.conf
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to start Mosquitto
    pause
    exit /b 1
)

endlocal