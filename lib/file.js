const debug = require('debug')('trpg:component:file');
const sh = require('./sample-http');
let _http = null;

module.exports = function (http = null) {
  _http = http;

  return function FileComponent(app) {
    if(!_http) {
      sh.create(app);
    }else {
      debug('TODO');
    }
  }
}
