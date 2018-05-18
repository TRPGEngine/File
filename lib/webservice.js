const Router = require('koa-router');

module.exports = function initFileService(app) {
  const webservice = app.webservice;
  const router = new Router();

  const avatar = require('./routers/avatar');
  router.use('/file/avatar', avatar.routes());
  webservice.use(router.routes());
}
