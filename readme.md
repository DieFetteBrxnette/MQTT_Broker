## Overview
Bachelor Thesis @ FAPS - FAU by Paul Marenbach

## Installation

### Manually
- Install Node.js with npm from https://nodejs.org/en/download for your machine
- Run `npm install` to install any dependencies for the server to run (like TypeScript and Node-RED)
- Install Mosquitto from https://mosquitto.org/download/ for your machine
- Get the MQTTBase.ino file from https://github.com/DieFetteBrxnette/MQTT_ESP32_Code
- Upload the MQTTBase.ino file to any and all ESP32 devices (preferably using Arduino IDE, make sure it is configured for the correct device type & model!)
### Docker
- Install Docker.
- Get the Image from https://hub.docker.com/r/paulmarenbach/nodered-mqtt

## Running the Mosquitto Server
You can easily start the MQTT Mosquitto server using the provided scripts for Windows or Linux. If you already have a process running on the required port, you can try to run the force_start scripts, which try to kill the processes on these ports. Mosquitto should log any and all events into the `/logs/mosquitto.log` file.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.