const debug = require('debug')('trpg:component:file');
// const sh = require('./sample-http');
const koa = require('./koa');
let _http = null;

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
  }
}
