@echo off
setlocal

echo Checking for processes using port 1883...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :1883') do (
    echo Processes running on port 1883: %%a . Exiting...
    exit 1
)

echo Starting Mosquitto... (check logs)
mosquitto -v -c mosquitto.conf

endlocal