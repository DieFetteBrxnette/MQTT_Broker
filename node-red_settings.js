module.exports = {
    // Port for the Node-RED server
    uiPort: process.env.PORT || 1880,

    // Disable the editor (useful if you only want to use the dashboard)
    disableEditor: false,

    // Flow-Files (Standard: `flows_<hostname>.json`)
    flowFile: "flows.json",
    userDir: "./data",

    // Logging
    logging: {
        console: {
            level: "info", // Level: trace, debug, info, warn, error
            metrics: false,
            audit: false
        }
    },

    // User Authentication
    //adminAuth: {
    //   type: "credentials",
    //    users: [{
    //        username: "admin",
    //        password: "admin.",
    //        permissions: "*"
    //    }]
    //},

    // Key for encrypting data. Must be 32 characters long
    credentialSecret: "secretKey1234567890123456789012345678",

    // HTTP-Root for Node-RED
    httpNodeRoot: "/",

    // HTTP-Root for admin interface
    httpAdminRoot: "/",
    // In case of HTTP auth
    //httpAdminAuth: { 
    //    user: "admin",
    //    pass: ""
    //},

    // HTTP-Root for API
    //httpNodeRoot: "/api",
    //httpNodeAuth: {
    //    user: "apiuser",
    //    pass: "APIPassword"
    //},

    // Reconnect time for MQTT in milliseconds
    mqttReconnectTime: 15000,

    // Serving static files
    //httpStatic: "/var/www/public",
    //httpStaticAuth: { user: "user", pass: "pass" },

    // Save context data to disk
    functionGlobalContext: {
        os: require("os"),
        moment: require("moment")
    },

    // Middleware for HTTP requests
    httpMiddleware: function(req, res, next) {
        console.log("HTTP request:", req.url);
        next();
    }
};
