var path = require('path');
var url = require('url');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers.js');
var Promise = require('bluebird');

exports.handleRequest = function(req, res) {
  // GET
  if (req.method === 'GET') {
    // Parse url and set url path
    var parsed = url.parse(req.url).pathname;
    var urlPath = parsed;
    //console.log('urlPath is', urlPath);
    // Serves index.html at root
    if (parsed === '/') {
      urlPath = '/index.html';
    }
    //urlPath includes / at the front
    // Serve static assets
    httpHelpers.serveAssets(res, urlPath, function() {
    //Check this later
    //Check if url in list, if it is, redirect loading, else 404
    });
  }

  // POST
  if (req.method === 'POST') {
    var body = '';
    req.on('data', function(chunk) {
      body += chunk;
    });
    //body is currently url=www.something.com
    req.on('end', function() {
      //Get just the url
      body = body.split('=')[1];
      console.log(`POST body > ${body}`);
      archive.isUrlInList(body, function(found) {
        if (found) {
          archive.isUrlArchived(body, function(found) {
            if (!found) {
              // serve loading.html
              console.log(`${body} not found`);
              httpHelpers.redirect(res, 'loading.html');
            } else {
              // serve site
              httpHelpers.redirect(res, body);
            }
          });
        } else {
          archive.addUrlToList(body, function() {
            // serve loading.html
            httpHelpers.redirect(res, 'loading.html');
          });
        }
      });
    });
  }
  // res.end(archive.paths.list);
};


exports.handleRequestAsync = function(req, res) {
  // GET
  if (req.method === 'GET') {
    // Parse url and set url path
    var parsed = url.parse(req.url).pathname;
    var urlPath = parsed;
    //console.log('urlPath is', urlPath);
    // Serves index.html at root
    if (parsed === '/') {
      urlPath = '/index.html';
    }
    //urlPath includes / at the front
    // Serve static assets
    httpHelpers.serveAssets(res, urlPath, function() {
    //Check this later
    //Check if url in list, if it is, redirect loading, else 404
    });
  }

  // POST
  if (req.method === 'POST') {
    var body = '';
    req.on('data', function(chunk) {
      body += chunk;
    });
    //body is currently url=www.something.com
    req.on('end', function() {
      //Get just the url
      body = body.split('=')[1];
      console.log(`POST body > ${body}`);
      archive.isUrlInListAsync(body)
        .then(archive.isUrlArchivedAsync(body)
          .catch(httpHelpers.redirect(res, 'loading.html'))
          .then(httpHelpers.redirect(res, body)))
        .catch(archive.addUrlToListAsync(body))
          .then(httpHelpers.redirect(res, 'loading.html'));
      // archive.isUrlInList(body, function(found) {
      //   if (found) {
      //     archive.isUrlArchived(body, function(found) {
      //       if (!found) {
      //         // serve loading.html
      //         console.log(`${body} not found`);
      //         httpHelpers.redirect(res, 'loading.html');
      //       } else {
      //         // serve site
      //         httpHelpers.redirect(res, body);
      //       }
      //     });
      //   } else {
      //     archive.addUrlToList(body, function() {
      //       // serve loading.html
      //       httpHelpers.redirect(res, 'loading.html');
      //     });
      //   }
      // });
    });
  }
  // res.end(archive.paths.list);
};