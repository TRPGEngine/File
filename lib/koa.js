const Koa = require('koa');
const logger = require('koa-logger');
const koaBody = require('koa-body');
const serve = require('koa-static');
const multer = require('koa-multer');//加载koa-multer模块
const Router = require('koa-router');
const cors = require('koa-cors');
const fs = require('fs');
const upload = require('./middleware/upload');
const avatar = require('./middleware/avatar');
const avatarStorage = require('./middleware/storage')();
const auth = require('./middleware/auth')();
const debug = require('debug')('trpg:component:file:koa');
//文件上传
// core is CoreComponent
module.exports = function (core, port) {
  let app = new Koa();
  let router = new Router();

  app.use(logger());
  app.use(serve('public'));
  app.use(cors());
  app.use(koaBody());
  app.use(async (ctx, next) => {
    ctx.core = core;
    await next();
  });

  if(!fs.existsSync('public')) {
    fs.mkdirSync('public');
  }
  if(!fs.existsSync('public/uploads')) {
    fs.mkdirSync('public/uploads');
  }
  if(!fs.existsSync('public/avatar')) {
    fs.mkdirSync('public/avatar');
  }

  // 暂时关闭
  // router.post('/upload', auth, upload.single('file'), async (ctx, next) => {
  //   let filename = ctx.req.file.filename;
  //   ctx.body = {
  //     filename,
  //     fullUrl: ctx.request.origin + '/uploads/' + filename
  //   }
  // })
  router.post('/avatar', auth, avatar.single('avatar'), avatarStorage, async (ctx, next) => {
    let filename = ctx.req.file.filename;
    ctx.body = {
      filename,
      url: ctx.request.origin + '/avatar/' + filename,
      avatar: ctx.avatar,
    }
  })

  app.use(router.routes());
  app.use(router.allowedMethods());

  app.listen(port);
  debug('file component listening on port %d', port);
}
