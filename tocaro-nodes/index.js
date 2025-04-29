module.exports = function(RED) {
    console.log("Loading ToCaro nodes...");
    // Load all nodes
    require('./nodes/client-manager/client-manager.js')(RED);
    require('./client.js')(RED);
};