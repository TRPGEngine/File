const debug = require('debug')('trpg:component:file');
const fs = require('fs');
// const sh = require('./sample-http');
const koa = require('./koa');
const event = require('./event');
let _http = null;
function deleteall(path) {
  var files = [];
  if(fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach(function(file, index) {
      var curPath = path + "/" + file;
      if (fs.statSync(curPath).isDirectory()) { // recurse
        deleteall(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

module.exports = function (http = null) {
  _http = http;

  return function FileComponent(app) {
    app.storage.registerModel(require('./models/avatar.js'));
    app.on('initCompleted', function(app) {
      // 数据信息统计
      debug('storage has been load 1 file db model');
    });

    if(!_http) {
      koa(app, 23257);
    }else {
      debug('TODO');
    }

    app.on('resetStorage', function() {
      deleteall("./public/uploads");
      deleteall("./public/avatar");
      fs.mkdirSync('public/uploads');
      fs.mkdirSync('public/avatar');
      debug('file disk storage reset completed!');
    })

    app.registerEvent('file::bindAttachUUID', event.bindAttachUUID);
  }
}
