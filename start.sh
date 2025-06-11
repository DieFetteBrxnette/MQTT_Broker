#!/bin/bash

# Start Mosquitto using existing script (in background)
/start_mosquitto_linux.sh &

# Wait a moment to ensure Mosquitto is up
sleep 2

# Start Node-RED in foreground
npm start --prefix /usr/src/node-red