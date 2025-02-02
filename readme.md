## Overview
Bachelor Thesis @ FAPS - FAU by Paul Marenbach

## Installation
- Install nodeJS with NPM from https://nodejs.org/en/download for your machine
- Run `npm install` to install any dependecies for the server to run (like TypeScript and nodeRed)
- Install Mosquitto from https://mosquitto.org/download/ for your machine
- Upload the MQTTBase.ino file to any and all ESP32 (preferably using Arduino IDE, make sure it is configured for the correct device type & model!)

## Running the Mosquitto server
You can easily start the MQTT Mosquitto server using the provided scripts for windows or linux. If you have already a process running on the required port, you can try to run the force_start scripts, which try to kill the processes on these ports. Mosquitto should log any and all events into the /logs/mosquitto.log file.
## License
tbd