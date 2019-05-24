var express = require('express');
var app = express();
var requestHandlers = require('./requestHandlers');
var port = 8888;

// Middleware
app.use(express.static('public'));

// Get handlers
app.get("/", requestHandlers.handle.start);
app.get("404", requestHandlers.handle.notFound);

// Post handlers
app.post("/sync", requestHandlers.handle.sync);

// Start server
var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;
    
    console.log("Subtitle Sync running on port", port);
});
