module.exports = function(RED) {
    const api = {};

    RED.httpAdmin.post("/tocaro/device/register", RED.auth.needsPermission("flows.write"), (req, res) => {

    });

    api.registerDevice = function() {
    };
}