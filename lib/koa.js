const Koa = require('koa');
const logger = require('koa-logger');
const serve = require('koa-static');
const multer = require('koa-multer');//加载koa-multer模块
const Router = require('koa-router');
const fs = require('fs');
const upload = require('./middleware/upload');
const avatar = require('./middleware/avatar');
const debug = require('debug')('trpg:component:file:koa');
//文件上传
let app = new Koa();
let router = new Router();

app.use(logger());
app.use(serve('public'));

if(!fs.existsSync('public')) {
  fs.mkdirSync('public');
}
if(!fs.existsSync('public/uploads')) {
  fs.mkdirSync('public/uploads');
}
if(!fs.existsSync('public/avatar')) {
  fs.mkdirSync('public/avatar');
}

router.post('/upload', upload.single('file'), async (ctx, next) => {
  ctx.body = {
    filename: ctx.req.file.filename//返回文件名
  }
})
router.post('/avatar', avatar.single('avatar'), async (ctx, next) => {
  ctx.body = {
    filename: ctx.req.file.filename//返回文件名
  }
})

app.use(router.routes());
app.use(router.allowedMethods());

module.exports = function (port) {
  app.listen(port);
  debug('file component listening on port %d', port);
}
