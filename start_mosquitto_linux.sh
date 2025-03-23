#!/bin/bash

echo "Checking for processes using port 1883..."
PIDS=$(lsof -ti :1883)

if [ -n "$PIDS" ]; then
    echo "Process(es) running on port 1883: $PIDS"
fi

echo "Starting Mosquitto... (check logs)"
mosquitto -v -c mosquitto.conf