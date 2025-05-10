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
    }

    RED.nodes.registerType("client", Client);
};