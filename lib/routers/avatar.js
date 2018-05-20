const Router = require('koa-router');
const fs = require('fs-extra');
const upload = require('../middleware/upload');
const avatar = require('../middleware/avatar');
const avatarStorage = require('../middleware/storage')();
const avatarProcess = require('../middleware/process')();
const auth = require('../middleware/auth')();

let router = new Router();

router.post('/', auth, avatar.single('avatar'), avatarProcess, avatarStorage, async (ctx, next) => {
  let filename = ctx.req.file.filename;
  let size = ctx.req.file.size;
  ctx.body = {
    filename,
    url: '/avatar/thumbnail/' + filename,
    avatar: ctx.avatar,
    size,
  }
})

router.get('/list', async (ctx, next) => {
  ctx.body = 'list';
})

module.exports = router;
