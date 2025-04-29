// This Node-RED node manages the creation and registration of clients in a flow.
// It listens for incoming messages, creates a new client node, and deploys the updated flow to the Node-RED server.
// It also handles the cleanup of existing clients if a new one with the same ID is received.

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
            const flows = await getFlow(config.url);
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
            await deploy(flows, config.url);

            // Log the successful registration of the new client
            node.log(`Client ${clientId} registered successfully.`);
            node.status({ fill: "green", shape: "dot", text: `client ${clientId} registered - Reload!` });
        });
    }

    // Function to find an available position for the new client node in the flow
    // This function checks the existing nodes in the flow and finds a position that does not overlap with them
    function findAvailablePosition(flow) {
        let x, y = 100;

        // Get all nodes in the flows that belong to this flow and have defined x and y coordinates
        const flowNodes = flow.filter(node => node.z === flow.id && node.x !== undefined && node.y !== undefined);
        
        // If no nodes exist in this flow, return default position
        if (!flowNodes || flowNodes.length === 0) {
            return { x, y };
        }

        // Find the maximum x and y coordinates of existing nodes in the flow
        const maxX = Math.max(...flow.map(node => node.x || 0));
        const maxY = Math.max(...flow.map(node => node.y || 0));

        // Start new row if the maximum x coordinate is greater than 500
        if (maxX < 500) {
            x = maxX + 100;
            y = maxY;
        } else {
            y = maxY + 50;
        }

        return { x, y };
    }

    // Function to fetch all flows from the Node-RED server
    // This function uses the Node-RED API to get the flows' configuration
    async function getFlow(url) {
        if (!url) {
            console.error("Invalid URL for fetching flows");
            return null;
        }

        try {
            // Make a GET request to the Node-RED API to fetch the flows
            if (!url.endsWith('/')) {
                url += '/';
            }
            const res = await fetch(`${url}flows`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!res.ok) {
                throw new Error(`Failed to fetch flows (${res.status}): ${res.statusText}`);
            }

            // If Status code is 204 No Content, so we need to check if the response is empty
            if (res.status === 204) {
                return [];
            }
            return await res.json();
        } catch (error) {
            console.error('Error fetching flows.', error);
            return null;
        }
    }

    // Function to deploy all flows to the Node-RED server
    // This function uses the Node-RED API to deploy the flows' configuration
    async function deploy(flows, url) {
        if (!flows || !url) {
            console.error("Invalid parameters for deployment");
            return null;
        }

        try {
            if (!url.endsWith('/')) {
                url += '/';
            }
            // Make a POST request to the Node-RED API to deploy the flows
            const res = await fetch(`${url}flows`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(flows),
            });

            if (!res.ok) {
                throw new Error(`Failed to deploy flows (${res.status}): ${res.statusText}`);
            }

            // If Status code is 204 No Content, so we need to check if the response is empty
            // In this case, we return true to indicate that the deployment was successful
            if (res.status === 204) {
                return true;
            }

            return await res.json();
        } catch (error) {
            console.error('Error deploying flows.', error);
            return null;
        }
    }
    
    RED.nodes.registerType("client-manager", ClientManager);
};