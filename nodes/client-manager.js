// client-manager.js
module.exports = function(RED) {
    // Import the client hook manager
    const clientHooks = require('./hooks/creation-hook.js')(RED);
    const api = require('./apis/node-register-api.js')(RED);
    
    function ClientManager(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        
        // Listen for new client connections
        node.on('input', function(msg) {
            if (!msg || !msg.payload) {
                node.warn("Received invalid message");
                return;
            }
            
            const clientId = msg.payload.toString();
            console.log(`Received new client: ${clientId}`);
            
            try {
                // Trigger the hook to create the client node
                const result = clientHooks.triggerClientDetected(clientId);
                
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
}