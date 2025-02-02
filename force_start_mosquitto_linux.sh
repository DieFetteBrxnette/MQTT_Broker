#!/bin/bash

echo "Checking for processes using port 1883..."
PIDS=$(lsof -ti :1883)

if [ -n "$PIDS" ]; then
    echo "Killing process(es) on port 1883: $PIDS"
    kill -9 $PIDS
fi

echo "Starting Mosquitto..."
mosquitto -v -c mosquitto.conf