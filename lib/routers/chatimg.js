const Router = require('koa-router');
const fs = require('fs-extra');
const config= require('../config')
const chatimg = require('../middleware/tmpsave');
// const avatarStorage = require('../middleware/storage')();
const chatimgProcess = require('../middleware/process')(config.path.chatimgDir, false);
const auth = require('../middleware/auth')();

let router = new Router();

router.post('/', auth, chatimg.single('image'), chatimgProcess, async (ctx, next) => {
  let filename = ctx.req.file.filename;
  let size = ctx.req.file.size;
  let has_thumbnail = ctx.req.file.has_thumbnail;
  // ctx.body = {
  //   filename,
  //   url: has_thumbnail ? '/avatar/thumbnail/' + filename : '/avatar/' + filename,
  //   avatar: ctx.avatar,
  //   size,
  // }
  ctx.body = ctx.req.file;
})

router.get('/list', async (ctx, next) => {
  ctx.body = 'list';
})

module.exports = router;
