var fs = require('fs');
var formidable = require('formidable');
var srtParse = require('srtParse');
var AdmZip = require('adm-zip');

function serveFile(file, request, response) {
    fs.readFile(file, function(error, body) {
        if(error) {
            return internalError(request, response);
        }
        response.writeHead(200, {"Content-Type": "text/html"});
    	response.write(body);
    	response.end();
    });
}

function generateSrt(data, filename, request, response) {
    if(!filename) {
        filename = "unknown-subs-resynced-at-bperki-com.srt";
    } else {
        filename = filename.split(".srt");
        filename.push("-resynced-at-bperki-com.srt");
        filename = filename.join("");
    }
    response.writeHead(200, {
        "Content-Type": "text/srt",
        "Content-Disposition": "attachment; filename=" + filename,
        "Content-Length": data.length,
    });
	response.write(data);
	response.end();
}

function generateZip(files, request, response) {
    var zip, buffer, filename;
    zip = new AdmZip();
    for(var i = 0; i < files.length; i++) {
        // Add each file to the zip
        filename = files[i].filename;        
        if(!filename) {
            filename = "unknown-subs-resynced-at-bperki-com.srt";
        } else {
            filename = filename.split(".srt");
            filename.push("-resynced-at-bperki-com.srt");
            filename = filename.join("");
        }
        zip.addFile(filename, new Buffer(files[i].print()));
    }
    
    buffer = zip.toBuffer();
    response.writeHead(200, {
        "Content-Type": "application/zip",
        "Content-Disposition": "attachment; filename=subtitles-resynced-at-bperki-com.zip",
        "Content-Length": buffer.length
    });
	response.end(buffer, "binary");
}

function start(request, response) {
    serveFile("index.html", request, response);
}

function sync(request, response) {
	var form;
	form = new formidable.IncomingForm();
	form.multiples = true;
	if(request.method.toLowerCase() === "post") {
// 		response.writeHead(200, {"Content-Type": "text/html"});
		form.parse(request, function(error, fields, files) {
    		var sourceFiles, destinationFiles, attemptedFileCount, file, scaleFactor;
    		// Even if only one file was uploaded, wrap it in an array for consistency
    		sourceFiles = (files.sourceFiles instanceof Array ? files.sourceFiles : [files.sourceFiles]);
    		// The finished/resynced files
    		destinationFiles = [];
    		// This could be different from destinationFiles.length if one or more files fails.
            // They won't be added to destinationFiles, but they have been attempted
    		attemptedFileCount = 0;
    		// Compute the offset and slope for the timestamp adjustments
    		scaleFactor = srtParse.computeScaleFactor(fields.sourceTimeA, fields.destinationTimeA, fields.sourceTimeB, fields.destinationTimeB);
    		for(var i = 0; i < sourceFiles.length; i++) {
        		file = sourceFiles[i];
        		srtParse.Srt(file.path, file.name, function(error, srt) {
            		destinationFiles.push(srtParse.adjustTimestamps(srt, scaleFactor));
            		attemptedFileCount++;
            		if(attemptedFileCount === sourceFiles.length) {
                		// If we're finished, send back the proper response
                        if(destinationFiles.length === 0) {
                            // Todo: Add error message
                            response.redirect("/");
                        } else if(destinationFiles.length === 1) {
                            return generateSrt(destinationFiles[0].print(), destinationFiles[0].filename, request, response);
                        } else {
                            return generateZip(destinationFiles, request, response);
                        }                            		
                    }
                });
            }
		});
	} else {
		response.writeHead(302, {'location': '/'});
		response.write('Invalid data');
		response.end();
	}
	
}

function internalError(request, response) {
    response.writeHead(500, {'Content-Type': 'text/html'});
	response.end();
}

function notFound(request, response) {
	response.writeHead(404, {'Content-Type': 'text/html'});
	response.write('404 not found!');
	response.end();
}

exports.handle = {
	'404': notFound,
	'/sync': sync,
	'/': start
}