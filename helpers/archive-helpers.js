var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');
var Promise = require('bluebird');
Promise.promisifyAll(fs);

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

// __dirname is the directory name of the current module
// path.join() joins all given path segments together
exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

// Read file of the lists of sites, urls is an array
exports.readListOfUrls = function(callback) {
  var urls = [];
  fs.readFile(exports.paths.list, 'utf8', function(err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
      urls = data.toString().split('\n');
      callback(urls);
    }
  });
};

exports.readListOfUrlsAsync = function() {
  var urls = [];
  return new Promise(function(resolve, reject) {
    fs.readFileAsync(exports.paths.list, 'utf8', function(err, data) {
      if (err) {
        reject(err);
      } else {
        urls = data.toString().split('\n');
        resolve(urls);
      }
    });
  });
};

// Check if after reading list, the url is found or not
exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls(function(urls) {
    var found = _.contains(urls, url);
    callback(found);
  });
};

exports.isUrlInListAsync = function(url) {
  return new Promise(function(resolve, reject) {
    exports.readListOfUrlsAsync(function(urls) {
      var found = _.contains(urls, url);
      if (found) {
        resolve(found);
      } else {
        reject();
      }
    });
  });
};

// Append url to list of sites file
exports.addUrlToList = function(url, callback) {
  fs.appendFile(exports.paths.list, url + '\n', 'utf8', function(err, data) {
    if (err) {
      console.log(err);
    } else {
      callback(data);
    }
  });
};

exports.addUrlToListAsync = Promise.promisify(exports.addUrlToList);

//Check if URL is archived aka if file exists in archives/sites folder
exports.isUrlArchived = function(url, callback) {
  var site = path.join(exports.paths.archivedSites, url);
  fs.exists(site, function(found) {
    callback(found);
  });
};

exports.isUrlArchivedAsync = function(url) {
  return new Promise(function(resolve, reject) {
    var site = path.join(exports.paths.archivedSites, url);
    fs.existsAsync(site, function(found) {
      resolve(found);
    });
  });
};

//Used in htmlfetcher, downloads all pending urls in the list
exports.downloadUrls = function(urls) {
  // for each websiteURL in array urls
  _.each(urls, function(url) {
    if (!url) {
      return;
    } else {
      request(`http://${url}`).pipe(fs.createWriteStream(`${exports.paths.archivedSites}/${url}`));
    }
    return true;
  });
  //     send GET request using request() to websiteURL
  //       use fs.writeFile (utf8) to write body to
  //       exports.paths.archivedSites + /websiteURL
};

exports.downloadUrlsAsync = Promise.promisify(exports.downloadUrls);