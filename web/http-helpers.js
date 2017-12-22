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
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
  // res.end(homepage) => what we'll provide to the client
  fs.readFile(archive.paths.siteAssets + asset, (err, data) => {
    if (err) {
      fs.readFile(archive.paths.archivedSites + asset, (err, data) => {
        if (err) {
          callback ? callback() : exports.sendResponse(res, '404: Page Not Found', 404);
        } else {
          exports.sendResponse(res, data);
        }
      });
    } else {
      exports.sendResponse(res, data);
    }
    // console.log('This is the data --------->', data.toString());
    // res.end(data);
  });
};

exports.sendRedirect = (res, location, statusCode = 302) => {
  res.writeHead(statusCode, {Location: location});
  res.end();
};

exports.sendResponse = (res, data, statusCode = 200) => {
  res.writeHead(statusCode, exports.headers);
  res.end(data);
};

exports.collectData = function(request, callback) {
  var data = '';
  request.on('data', function(chunk) {
    data += chunk;
  });
  request.on('end', function() {
    callback(data);
  });
};


// As you progress, keep thinking about what helper functions you can put here!
//sendResponse
//