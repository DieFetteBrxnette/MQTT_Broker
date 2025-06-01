// This Node-Red node is a dummy node that is used to represent a mqtt client in the Node-Red flow.
// This node is automatically created and configured by the client-manager node when a new mqtt client is registered.
// This node does not have any functionality, it is just a placeholder for the mqtt client.
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
    }

    RED.nodes.registerType("client", Client);
};