// This Node-RED node manages the creation and registration of clients in a flow.
// It listens for incoming messages, creates a new client node, and deploys the updated flow to the Node-RED server.

const { deployFlow, findAvailablePosition, getFlow } = require("../../utils");

// IMPORTANT: This code does NOT handle authentication or authorization for the Node-RED API,
// if your Node-RED server requires authentication, you will need to add the appropriate headers to the fetch requests.

module.exports = function(RED) {
    function ClientManager(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        node.status({ fill: "green", shape: "ring", text: "ready" });

        // Listen for new client to create
        node.on('input', async function(msg) {
            if (!msg || !msg.payload || typeof msg.payload !== "string" || msg.payload.length === 0) {
                node.warn("Received invalid message");
                return;
            }
            
            // Extract the client ID from the message and sanitize it
            const clientId = msg.payload.toString().trim().replaceAll(" ", "_");

            // Create a new client node with the given ID
            const newClient = {
                id: clientId,
                type: 'client',
                z: config.flow,
                name: clientId,
                mqttId: clientId,
                x: 150,
                y: 150,
                wires: [[]],
            }

            // Get all flows from the Node-RED server
            const flows = getFlow(RED);
            if (!flows) {
                node.error("Failed to fetch flows from the server");
                return;
            }

            // Find the flow by its ID
            let flow = flows.find(flow => flow.id === config.flow);

            // Check that the found flow is a tab type
            if (flow && flow.type !== "tab") {
                node.error(`Flow ${config.flow} is not a tab type`);
                return;
            }

            // Check if the flow is configured correctly
            if (flow) {
                // Check if the client is already registered
                const existingClient = flows.find(node => node.type === 'client' && (node.label === clientId || node.id === clientId) && node.z === config.flow && node.type === 'client');
                if (existingClient) {
                    node.warn(`Client ${clientId} already registered.`);
                    return;
                }
            } else {
                // If the flow is not found, create a new one with the new client
                flow = {
                    id: config.flow,
                    type: "tab",
                    label: config.flow,
                    disabled: false,
                    info: `Flow for connection management in the toCaro system (automatically created)`,
                };

                flows.push(flow);
            }

            // Find an available position for the new client node in the flow
            const position = findAvailablePosition(flows);
            if (position) {
                newClient.x = position.x;
                newClient.y = position.y;
            } else {
                node.error("Failed to find an available position for the new client node");
                return;
            }

            // Update the flow with the new client node and deploy it
            flows.push(newClient);
            await deployFlow(flows, config.url);

            // Log the successful registration of the new client
            node.log(`Client ${clientId} registered successfully.`);
            node.status({ fill: "green", shape: "dot", text: `client ${clientId} registered - Reload!` });
        });
    }
    
    RED.nodes.registerType("client-manager", ClientManager);
};