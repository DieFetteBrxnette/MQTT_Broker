module.exports = function(RED) { 
    // Example usage
    function DeviceNode(config) {
        RED.nodes.createNode(this, config);
        const deviceInfo = {
            name: config.deviceName,
            id: config.deviceId
        };

        // Create the dynamic subflow
        const subflowId = createDynamicSubflow(deviceInfo);

        this.on('input', (msg) => {
            // Handle input for the dynamic device
        });
    }

    RED.nodes.registerType('dynamic-device', DeviceNode);

    return { 
        createClient: function() {
            // Generate a unique ID for the subflow
            const subflowId = RED.util.generateId();
            
            // Create the subflow definition
            const subflow = {
                id: subflowId,
                type: 'subflow',
                name: `Dynamic Device: test`,
                in: [
                    {
                        type: 'input',
                        x: 50,
                        y: 50,
                        wires: [
                            // Define internal wiring
                        ]
                    }
                ],
                out: [
                    {
                        type: 'output',
                        x: 200,
                        y: 50,
                        wires: [
                            // Define output connections
                        ]
                    }
                ],
                // Add custom properties specific to the device
            };

            // Add the subflow to Node-RED's internal registry
            RED.subflows.add(subflow);

            // Optionally, you can trigger a UI refresh
            RED.events.emit('runtime-change');

            return subflowId;
        }
    }
};