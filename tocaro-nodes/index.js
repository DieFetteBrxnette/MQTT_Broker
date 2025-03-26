module.exports = function(RED) {
    console.log("Loading ToCaro nodes...");
    // Load all nodes
    require('./nodes/client-manager/client-manager.js')(RED);
    require('./client.js')(RED);
    require('./lower-case.js')(RED);
    
    // Load hooks
    require('./hooks/creation-hook.js')(RED);
};