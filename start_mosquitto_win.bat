@echo off
setlocal

echo Checking for processes using port 1883...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :1883') do (
    echo Processes running on port: %%a
    exit 1
)


echo Starting Mosquitto...
mosquitto -v -c mosquitto.conf

endlocal