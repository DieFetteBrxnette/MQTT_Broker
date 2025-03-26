// client-hooks.js
module.exports = function(RED) {
    // Store registered client types to prevent duplication
    const registeredClients = new Set();
    
    // Initialize hook system
    RED.hooks = RED.hooks ||	 {
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
    
    // Create hook for client detection
    RED.hooks.add("onClientDetected.tocaro", function(clientId) {
        console.log(`Creating client subflow: ${clientId}`);
        
        if (registeredClients.has(clientId)) {
            return false;
        }
        
        registeredClients.add(clientId);
        return createClientSubflow(RED, clientId);
    });

    function createClientSubflow(RED, clientId) {
        const subflowId = RED.util.generateId();
        const subflow = {
            id: subflowId,
            name: `ToCaro Client: ${clientId}`,
            type: "subflow",
            category: "ToCaro Clients",
            info: `Subflow for ToCaro client ${clientId}`,
            in: [{ x: 50, y: 30, wires: [{ id: "n1", port: 0 }] }],
            out: [{ x: 250, y: 30, wires: [{ id: "n1", port: 0 }] }],
            env: [{ name: 'clientId', type: 'str', value: clientId }],
            status: { x: 100, y: 100, scale: 1 },
            icon: "font-awesome/fa-microchip",
            color: "#E6E0F8",
            nodes: [
                {
                    id: "n1",
                    type: "function",
                    name: `Process ${clientId}`,
                    func: `msg.clientId = "${clientId}";\nreturn msg;`,
                    outputs: 1,
                    x: 150,
                    y: 30,
                    wires: [["n2"]]
                },
                {
                    id: "n2",
                    type: "debug",
                    name: `Debug ${clientId}`,
                    active: true,
                    tosidebar: true,
                    console: false,
                    complete: "true",
                    x: 350,
                    y: 30,
                    wires: []
                }
            ]
        };

        try {
            RED.nodes.registerSubflow(subflow);
            RED.comms.publish("subflows", { subflows: [subflowId] });
            return subflowId;
        } catch (error) {
            console.error(`Failed to create subflow: ${error.message}`);
            return null;
        }
    }

    return {
        triggerClientDetected: function(clientId) {
            return RED.hooks.trigger("onClientDetected.tocaro", clientId);
        }
    };
};