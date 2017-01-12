var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.serveAssets = function(res, asset, callback) {
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
  var indexPath = path.join(__dirname, '/public/index.html');
  fs.readFile(archive.paths.siteAssets + asset, function(err, data) {
    if (err) {
      fs.readFile(archive.paths.archivedSites + asset, function(err, data) {
        if (err) {
          console.log(err);
          res.writeHead(404, exports.headers);
          res.end();
        } else {
          res.writeHead(200, exports.headers);
          res.end(data);
        }
      });
      // If index.html or loading.html or styles.css
    } else {
      res.writeHead(200, exports.headers);
      res.end(data);
    }
  });
};



// As you progress, keep thinking about what helper functions you can put here!
