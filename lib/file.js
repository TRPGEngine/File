const debug = require('debug')('trpg:component:file');
// const sh = require('./sample-http');
const koa = require('./koa');
let _http = null;

module.exports = function (http = null) {
  _http = http;

  return function FileComponent(app) {
    if(!_http) {
      koa(23257);
    }else {
      debug('TODO');
    }
  }
}
