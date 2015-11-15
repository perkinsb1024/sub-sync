var server = require('./server');
var router = require('./router');
var requestHandlers = require('./requestHandlers');
var port = 8080;

server.start(port, router.route, requestHandlers.handle);
console.log("Server running on " + port);