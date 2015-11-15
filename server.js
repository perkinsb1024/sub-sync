var http = require('http');
var url = require('url');

function start(port, route, handle) {
	function onRequest(request, response) {
		var pathname = url.parse(request.url).pathname;
		console.log('Request received for ' + pathname);
		
		route(pathname, handle, request, response);
	}
	http.createServer(onRequest).listen(port);
}

exports.start = start;