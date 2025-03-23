// client-hooks.js
module.exports = function(RED) {
    // Store registered client types to prevent duplication
    const registeredClients = new Set();
    
    // Initialize hook system if needed
    if (!RED.hooks) {
        RED.hooks = {
            _hooks: {},
            
            // Add a new hook
            add: function(name, callback) {
                if (!this._hooks[name]) {
                    this._hooks[name] = [];
                }
                this._hooks[name].push(callback);
            },
            
            // Trigger a hook with arguments
            trigger: function(name, ...args) {
                if (!this._hooks[name]) {
                    return null;
                }
                
                // Execute the last registered hook (most recent)
                const lastHook = this._hooks[name][this._hooks[name].length - 1];
                return lastHook(...args);
            }
        };
    }
    
    // Create a hook that runs when a new client is detected
    RED.hooks.add("onClientDetected", function(clientId) {
        // Skip if already registered
        if (registeredClients.has(clientId)) {
            return false;
        }
        
        // Register this client
        registeredClients.add(clientId);
        
        // Create node type name based on client ID
        const nodeType = `tocaro-client-${clientId}`;
        
        // Register the client node type
        registerClientNodeType(RED, nodeType, clientId);
        
        // Create a subflow for this client
        const subflowId = createClientSubflow(RED, nodeType, clientId);
        
        // Return the created subflow ID
        return subflowId;
    });
    
    // Helper function to register a client node type
    function registerClientNodeType(RED, nodeType, clientId) {
        function ClientNode(config) {
            RED.nodes.createNode(this, config);
            const node = this;
            
            // Handle incoming messages
            node.on('input', function(msg) {
                msg.clientId = clientId;
                node.send(msg);
            });
        }
        
        // Register the node type
        RED.nodes.registerType(nodeType, ClientNode);
    }
    
    // Helper function to create a client subflow
    function createClientSubflow(RED, nodeType, clientId) {
        const subflowId = RED.util.generateId();
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
        
        // Notify the editor
        RED.comms.publish("subflows", { subflows: [subflowId] });
        
        return subflowId;
    }
    
    // Public API
    return {
        triggerClientDetected: function(clientId) {
            return RED.hooks.trigger("onClientDetected", clientId);
        }
    };
};