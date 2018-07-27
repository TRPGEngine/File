const Router = require('koa-router');

module.exports = function initFileService(app) {
  const webservice = app.webservice;
  const router = new Router();

  const avatar = require('./routers/avatar');
  const chatimg = require('./routers/chatimg');
  router.use('/file/avatar', avatar.routes());
  router.use('/file/chatimg', chatimg.routes());
  webservice.use(router.routes());
}
