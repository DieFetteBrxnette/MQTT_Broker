const mqttServer = require('mqtt');
module.exports = function(RED) {
    function Client(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        // Check if the required configuration is provided
        if (!config.mqttId || config.mqttId.length === 0) {
            node.error("Missing required configuration: Client ID");
            this.status({ fill: "red", shape: "ring", text: 'Configuration error' });
            return;
        }

        const clientId = config.mqttId.toString().trim().replaceAll(" ", "_");
        node.mqtt = connect(clientId)

        if (!node.mqtt) {
            node.error("Failed to connect to the MQTT broker");
            this.status({ fill: "red", shape: "ring", text: 'Connection error' });
            return;
        }

        node.mqtt.on('connect', function() {
            node.log(`Connected to MQTT broker at ${url}`);
        });
        node.mqtt.on('error', function(error) {
            node.error(`Connection error: ${error.message}`);
            disconnect();
        });

        // Connect to the MQTT broker and display the correct status
        isConnected(node);

        node.on('input', async function(msg) {
            node.log("Received message:", msg);
            node.send(msg);
        });
    }

    function connect(url, clientId) {
        node.status({ fill: "yellow", shape: "dot", text: 'connecting...' });
        try {
            const client = mqttServer.connect(url, {
                clientId: clientId + "-node",
                username: clientId,
                clean: true,
            });
            
            return client;
        } catch (error) {
            return null;
        }
    }

    function isConnected(node) {
        if (node.mqtt && node.mqtt.connected) {
            node.status({ fill: "green", shape: "dot", text: `connected` });
            return true;
        }
        else {
            node.status({ fill: "red", shape: "ring", text: `disconnected` });
            return false;
        }
    }

    function disconnect() {
    }

    RED.nodes.registerType("client", Client);
};