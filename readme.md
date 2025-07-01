## Overview
Bachelor Thesis @ FAPS - FAU by Paul Marenbach

## Installation

Important: For both ways you need a MQTT Server installed on your machine or somewhere else. Read the section bellow about the Mosquitto Server for more info.

### Manually
- Install Node.js with npm from https://nodejs.org/en/download for your machine
- Run `npm install` to install any dependencies for the server to run (Node-RED)
- Install Mosquitto from https://mosquitto.org/download/ for your machine

### Docker
- Install Docker.
- Get the Image from https://hub.docker.com/r/paulmarenbach/nodered-mqtt
- Follow the instructions there.

## Setting up the Microcontroller
- Get the MQTTBase.ino file from https://github.com/paulmarenbach/MQTT_ESP32_Code
- Adjust the file to match your configuration and make sure to give each device a unique id.
- Expand to your needs.
- Upload the MQTTBase.ino file to any and all micocontrollers you want to use (preferably using Arduino IDE, make sure it is configured for the correct device type & model!)

## Running the Mosquitto Server
If you want to you can use the start scripts provided in this repo with the provided config, so you have all relevant info in one place for this project. You can however use your own config as always, remember to change the MQTT-Server in Node-Red, if you are not running it locally.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
