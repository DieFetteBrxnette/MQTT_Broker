const { getConnections } = require("../../utils");

module.exports = function(RED) {
    function Router(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', async function(msg) {
            if (!msg.topic || msg.topic.length === 0) {
                node.error("Missing required message element: Topic");
                this.status({ fill: "red", shape: "ring", text: 'Wrong message format.' });
                return;
            }

            const mqttId = msg.topic.split('/')[0];

            if (!mqttId || mqttId.length === 0) {
                node.error("Missing required message element: Client ID");
                this.status({ fill: "red", shape: "ring", text: 'Wrong message format.' });
                return;
            }

            const clientNodes = getConnections(RED, mqttId);

            if (!clientNodes) {
                this.status({ fill: "red", shape: "ring", text: 'No client found.' });
                return;
            }

            if (!clientNodes.length) {
                return;
            }

            clientNodes.forEach(clientNode => {
                const newMsg = { ...msg };
                newMsg.topic = msg.topic.replace(mqttId, clientNode.id);
                node.send(newMsg);
            });
        });
    }

    RED.nodes.registerType("router", Router);
};