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
  let has_thumbnail = ctx.req.file.has_thumbnail;
  ctx.body = {
    filename,
    url: has_thumbnail ? '/avatar/thumbnail/' + filename : '/avatar/' + filename,
    avatar: ctx.avatar,
    size,
  }
})

module.exports = router;
