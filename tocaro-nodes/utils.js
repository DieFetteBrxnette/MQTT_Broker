// Function to fetch all flows from the Node-RED server
// This function uses the Node-RED API to get the flows' configuration
function getFlow(RED) {
    const allNodes = [];
    RED.nodes.eachNode(n => {
        allNodes.push(n);
    });
    return allNodes;
}

function getClientNodes(RED) {
    const clientNodes = [];
    RED.nodes.eachNode(n => {
        if (n.type === 'client') {
            clientNodes.push(n);
        }
    });
    return clientNodes;
}

// Function to deploy all flows to the Node-RED server
// This function uses the Node-RED API to deploy the flows' configuration
async function deployFlow(flows, url) {
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

function getConnections(RED, mqttId) {
    const clientNodes = getClientNodes(RED);
    const senderNodes = clientNodes.filter(node => node.mqttId === mqttId);

    if (!clientNodes || clientNodes.length === 0) {
        return null;
    }

    const connections = [];

    senderNodes.forEach(node => {
        node.wires[0].forEach(wire => {
            const targetNode = clientNodes.find(n => n.id === wire);
            if (targetNode) {
                connections.push(targetNode);
            }
        });
    });

    return connections;
}

module.exports = {
    getFlow,
    deployFlow,
    findAvailablePosition,
    getConnections,
}