var path = require('path');
var url = require('url');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers.js');

exports.handleRequest = function(req, res) {
  // Parse url and set url path
  // GET
  if (req.method === 'GET') {
    var parsed = url.parse(req.url).pathname;
    var urlPath = parsed;

    if (parsed === '/') {
      urlPath = '/index.html';
    }

    httpHelpers.serveAssets(res, urlPath, function() {});
  }
  // Use serveAssets to grab sites
  // If it found the site on list and not yet archived
  // Redirect to loading
  // Else say it's not found


  // POST
  if (req.method === 'POST') {

  }
  // res.end(archive.paths.list);
};
