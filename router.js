function route(pathname, handle, request, response) {
	var handlePath = handle[pathname];
	if(handlePath) {
		handlePath(request, response);
	} else {
		handle['404'](request, response);
	}
}

exports.route = route;