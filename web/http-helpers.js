var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var request = require('request');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

// Use this for worker to get sites
//
// exports.makeRequest = function(url, callback) {
//   request(url, function(err, resp, body) {
//     if (err) {
//       console.log(err);
//     } else {
//       callback(body);
//     }
//   });
// };

exports.redirect = function(response, location, statusCode) {
  statusCode = statusCode || 302;
  response.writeHead(statusCode, Object.assign({Location: location}, exports.headers));
  response.end();
};

exports.serveAssets = function(res, asset, callback) {
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
  fs.readFile(archive.paths.siteAssets + asset, function(err, data) {
    if (err) {
      // Looks in archivedSites if server can't find asset in siteAssets
      fs.readFile(archive.paths.archivedSites + asset, function(err, data) {
        if (err) {
          // Returns 404 if client was wrong
          console.log(err);
          res.writeHead(404, exports.headers);
          res.end();
        } else {
          // Serves found archived site
          res.writeHead(200, exports.headers);
          res.end(data);
        }
      });
    // Serves index.html or loading.html or styles.css
    } else {
      res.writeHead(200, exports.headers);
      res.end(data);
    }
  });
};



// As you progress, keep thinking about what helper functions you can put here!
