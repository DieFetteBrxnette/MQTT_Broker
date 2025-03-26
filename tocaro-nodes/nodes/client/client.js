module.exports = function(RED) {
    // Store registered client types to prevent duplication
    const registeredClients = new Set();
    
    // Base node type to be extended
    function BaseClientNode(config) {
        console.log(config);
        RED.nodes.createNode(this, config);
    }
    
    // Public API
    return {
        createClient: function(clientId) {
            // Skip if already registered
            if (registeredClients.has(clientId)) {
                console.log(`Client ${clientId} already registered, cleaning up...`);
                try {
                    // Remove from registered set
                    registeredClients.delete(clientId);
                    // Force refresh the editor
                    RED.comms.publish("nodes/refresh", {});
                } catch (err) {
                    console.error(`Cleanup failed: ${err.message}`);
                }
            }
            
            // Create a unique node type name
            const nodeType = `tocaro-client-${clientId}`;
            
            // Create a specific client node by extending the base node
            function SpecificClientNode(config) {
                BaseClientNode.call(this, config);
                const node = this;
                
                // Handle incoming messages
                node.on('input', function(msg) {
                    msg.clientId = clientId;
                    node.send(msg);
                });
            }
            
            // Inherit from BaseClientNode
            SpecificClientNode.prototype = Object.create(BaseClientNode.prototype);
            SpecificClientNode.prototype.constructor = SpecificClientNode;
            
            try {
                // Register the node type
                RED.nodes.registerType(nodeType, SpecificClientNode);
                console.log(`Successfully registered node type: ${nodeType}`);
            
                // Create a subflow for this client
                const subflowId = RED.util.generateId();
                console.log(subflowId);
                const subflow = {
                    id: subflowId,
                    name: `Client: ${clientId}`,
                    info: `Subflow for client ${clientId}`,
                    type: "subflow",
                    category: "Tocaro devices",
                    in: [{ x: 50, y: 30, wires: [{ id: "n1", port: 0 }] }],
                    out: [{ x: 250, y: 30, wires: [{ id: "n1", port: 0 }] }],
                    env: [{ name: 'client', type: 'str', value: clientId }],
                    status: { x: 100, y: 100, scale: 1 },
                    icon: "bridge.svg",
                    color: "#a6bbcf",
                    nodes: [
                        {
                            id: "n1",
                            type: nodeType,
                            name: `Client ${clientId}`,
                            x: 150,
                            y: 30,
                            wires: [["n2"]]
                        },
                        {
                            id: "n2",
                            type: "debug",
                            name: `Client ${clientId} Debug`,
                            active: true,
                            tosidebar: true,
                            console: true,
                            tostatus: false,
                            complete: "payload",
                            x: 350,
                            y: 30,
                            wires: []
                        }
                    ]
                };
                
                // Register the subflow
                RED.nodes.registerSubflow(subflow);
                console.log(`Registered subflow with ID: ${subflowId}`);
                
                // Notify the editor
                RED.comms.publish("nodes/refresh", {});
                RED.comms.publish("subflows", { subflows: [subflowId] });
                
                // Mark this client as registered
                registeredClients.add(clientId);
                
                return subflowId;
            } catch (error) {
                console.error(`Failed to create client: ${error.message}`);
                return error;
            }
        }
    };
};