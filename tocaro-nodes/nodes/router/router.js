// This Node-Red node routes messages to all connected clients based on the MQTT client ID provided in the message topic.
const { getConnections } = require("../../utils");

module.exports = function(RED) {
    function Router(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', async function(msg) {
            // Check if the required message element is provided 
            if (!msg.topic || msg.topic.length === 0) {
                node.error("Missing required message element: Topic");
                this.status({ fill: "red", shape: "ring", text: 'Wrong message format.' });
                return;
            }

            const mqttId = msg.topic.split('/')[0];

            // Check if the mqttId is provided in the message topic, else log error
            if (!mqttId || mqttId.length === 0) {
                node.error("Missing required message element: Client ID");
                this.status({ fill: "red", shape: "ring", text: 'Wrong message format.' });
                return;
            }

            // Check that the signed mqttId is the same as the payload else return to avoid routing multiple messages
            const match = msg.payload.match(/^\[([^\]]+)\]/);
            const signature = match ? match[1] : null;
            if (signature !== mqttId) {
                return;
            }

            // Get all conntected nodes for the given mqttId
            const clientNodes = getConnections(RED, mqttId);
            // If the clientNodes is undefined log an error and return
            if (!clientNodes) {
                this.status({ fill: "red", shape: "ring", text: 'No client found.' });
                return;
            }

            // If there are no clientNodes return
            if (!clientNodes.length) {
                return;
            }

            // Forward the message to all clients that have a connection with the publisher
            clientNodes.forEach(clientNode => {
                const newMsg = { ...msg };
                newMsg.topic = msg.topic.replace(mqttId, clientNode.id);
                //node.log(`Routing message to client: ${clientNode.id} with topic: ${newMsg.topic} and payload: ${JSON.stringify(newMsg.payload)} from topic: ${msg.topic}`);
                node.send(newMsg);
            });
        });
    }

    RED.nodes.registerType("router", Router);
};