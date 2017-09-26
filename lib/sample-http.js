// 弃用。改用koa作为内置http核心

const debug = require('debug')('trpg:component:file:http');
const uuid = require('uuid/v1');
const formidable = require('formidable');
var http = require('http');
var url = require('url');
var fs = require('fs');
var util = require('util');
var path = require('path');
var mimetype = {
  'txt': 'text/plain',
  'html': 'text/html',
  'css': 'text/css',
  'xml': 'application/xml',
  'json': 'application/json',
  'js': 'application/javascript',
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'gif': 'image/gif',
  'png': 'image/png',
  'svg': 'image/svg+xml'
}
var page_404 = function(req, res, path) {
  res.writeHead(404, {
    'Content-Type': 'text/html'
  });
  res.write('<!doctype html>\n');
  res.write('<title>404 Not Found</title>\n');
  res.write('<h1>Not Found</h1>');
  res.write(
    '<p>The requested URL ' +
    path +
    ' was not found on this server.</p>'
  );
  res.end();
}
var page_500 = function(req, res, error) {
  res.writeHead(500, {
    'Content-Type': 'text/html'
  });
  res.write('<!doctype html>\n');
  res.write('<title>Internal Server Error</title>\n');
  res.write('<h1>Internal Server Error</h1>');
  res.write('<pre>' + util.inspect(error) + '</pre>');
}

var save_file = function(req, res) {
  var form = formidable.IncomingForm();
  form.encoding = 'utf-8';
  form.uploadDir = path.resolve(__dirname, '../static/');
  form.keepExtensions = true;
  // form.maxFieldsSize = 2 * 1024 * 1024; // 单位为byte

  form.on('progress', function(bytesReceived, bytesExpected) {
    var progressInfo = {
      value: bytesReceived,
      total: bytesExpected
    };
    console.log('[progress]: ' + JSON.stringify(progressInfo));
    res.write(JSON.stringify(progressInfo));
  });

  form.on('end', function() {
    console.log('end');
    res.end('success');
  });

  form.on('error', function(err) {
    console.error('upload failed', err.message);
    res.end();
  })

  form.parse(req, function(err, fields, files) {
    // console.log(err, fields, files);
    console.log('files', files);
  });
}

function createServer(app) {
  http.createServer(function(req, res) {
    var pathname = url.parse(req.url).pathname;

    if (pathname === '/upload') {
      if(req.method === 'GET') {
        res.writeHead(200, {'content-type': 'text/html'});
        res.end(
          '<form action="/upload" enctype="multipart/form-data" method="post">'+
          '<input type="text" name="title"><br>'+
          '<input type="file" name="upload" multiple="multiple"><br>'+
          '<input type="submit" value="Upload">'+
          '</form>'
        );
      }else if(req.method === 'POST') {
        return save_file.call(app, req, res);
      }
    } else {
      var realPath = path.resolve(__dirname, '../static' + pathname);
      debug('get file: %s', realPath);
      fs.exists(realPath, function(exists) {
        if (!exists) {
          return page_404(req, res, pathname);
        } else {
          var file = fs.createReadStream(realPath);

          res.writeHead(200, {
            'Content-Type': mimetype[realPath.split('.').pop()] || 'text/plain'
          });
          file.on('data', res.write.bind(res));
          file.on('close', res.end.bind(res));
          file.on('error', function(err) {
            return page_500(req, res, err);
          });
        }
      });
    }
  }).listen(23255);
  console.log('HTTP Server running at http://127.0.0.1:23255/');
}

exports.create = createServer;
