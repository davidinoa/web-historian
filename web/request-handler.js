var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers');
var url = require('url');
var fs = require('fs');
// require more modules/folders here!

var actions = {
  'GET': function (req, res) {
    var urlPath = url.parse(req.url).pathname;
// console.log('urlPath =========>', urlPath);
// console.log('Request URL =======>', req);
    if (urlPath === '/') {
      urlPath = '/index.html';
    }
    helpers.serveAssets(res, urlPath, function(){
      if (urlPath[0] === '/') {
        urlPath = urlPath.slice(1);
      }
      archive.isUrlInList(urlPath, function (found) {
        if (found) {
          helpers.sendRedirect(response, '/loading.html');
        } else {
          helpers.sendResponse(res, req.url, 404);
        }
      });
    });
    // helpers.sendResponse(res, req.url, 404);
  },
  'POST': function (req, res) {

    helpers.collectData(req, function(data) {
      var url = data.split('=')[1].replace('http://', '');
      archive.isUrlInList(url, function(found) {
        if (found) {
          archive.isUrlArchived(url, function(exists) {
            if (exists) {
              helpers.sendRedirect(res, '/' + url);
            } else {
              helpers.sendRedirect(res, '/loading.html');
            }
          });
        } else {
          archive.addUrlToList(url, function() {
            helpers.sendRedirect(res, '/loading.html');
          });
        }
      });
    });

    // var body = [];
    // req.on('data', chunck => {

    //   body.push(chunck);
    //   body = Buffer.concat(body).toString();

    // }).on('end', () => {

    //   res.writeHead(302, helpers.headers);
    //   //
    //   fs.appendFile(archive.paths.list, body.substr(4) + '\n', function () {
    //     res.end();

    //   });

    // });
  }
};

archive.isUrlArchived('www.google.com', () => {});

exports.handleRequest = function (req, res) {
  if ( actions[req.method] ) {
    actions[req.method](req, res);
  } else {
    res.sendResponse(res, '404: Page Not Found', 404);
  }
  // res.end(archive.paths.list);

};

//res.end(archive.paths.list);