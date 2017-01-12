var archive = require('../helpers/archive-helpers');
var _ = require('underscore');

archive.readListOfUrls(archive.downloadUrls);

// archive.readListOfUrls(function(urls) {
//   var array = [];
//   _.each(urls, function(url) {
//     archive.isUrlArchived(url, function(found) {
//       if (!found) {
//         console.log('pushing to array');
//         array.push(url);
//       }
//     });
//   });

//   setTimeout(function() { archive.downloadUrls(array); }, 500);
// });

// Some variable (websitesToArchive)? to store array of websites to archive
//
// readListOfUrls...
//   for each url
//     isUrlArchived?
//       if !found
//         add to websitesToArchive
//
// downloadURLs using websitesToArchive
