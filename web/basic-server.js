var http = require('http');
var handler = require('./request-handler');
var initialize = require('./initialize.js');

// archives folder isn't in repo so initialize creates it if it doesn't exist
initialize('./archives');

var port = 8080;
var ip = '127.0.0.1';
var server = http.createServer(handler.handleRequest);

if (module.parent) { // module.parent is the module that first required this one
  module.exports = server; // Not sure what this is used for
} else {
  server.listen(port, ip);
  console.log('Listening on http://' + ip + ':' + port);
}
