module.exports = function(RED) {
    const clientCreator = require('../create.js')(RED);
    
    function ClientManager(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        
        // Listen for new client connections
        node.on('input', function(msg) {
            if (!msg || !msg.payload || typeof msg.payload !== "string" || msg.payload.length === 0) {
                node.warn("Received invalid message");
                return;
            }
            
            // Extract the client ID from the message and sanitize it
            const clientId = msg.payload.toString().trim().replaceAll(" ", "_");
            console.log(`Received new client: ${clientId}`);
            
            try {
                const nodeType = `tocaro-client-${clientId}`;
                // Check if the client already exists
                if (RED.nodes.getNode(nodeType)) {
                    node.status({ fill: "yellow", shape: "ring", text: `Client already exists: ${clientId}` });
                    return;
                }
                
                // Create the client node
                const result = clientCreator.createClient(clientId);

                if (result) {
                    node.status({ fill: "green", shape: "dot", text: `Added client: ${clientId}` });
                } else {
                    node.status({ fill: "yellow", shape: "ring", text: `Client already exists: ${clientId}` });
                }
            } catch (error) {
                node.error(`Failed to create client: ${error.message}`, msg);
                node.status({ fill: "red", shape: "ring", text: "Creation failed" });
            }
        });
    }
    
    RED.nodes.registerType("client-manager", ClientManager);
};