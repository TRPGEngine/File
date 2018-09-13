const Router = require('koa-router');
const config= require('../config')
const chatimg = require('../middleware/tmpsave');
const chatimgProcess = require('../middleware/process')(config.path.chatimgDir, false);
const chatimgStorage = require('../middleware/storage/chatimg')();
const auth = require('../middleware/auth')();
const uuid = require('uuid/v1');

let router = new Router();

router.post('/upload', auth, chatimg.single('image'), chatimgProcess, chatimgStorage, async (ctx, next) => {
  let filename = ctx.req.file.filename;
  let size = ctx.req.file.size;
  let has_thumbnail = ctx.req.file.has_thumbnail;
  ctx.body = {
    filename,
    url: has_thumbnail ? '/trpg-chat-image/thumbnail/' + filename : '/trpg-chat-image/' + filename,
    size,
    chatimg: ctx.chatimg,
  }
});

// 基于https://sm.ms/api/upload接口的数据存储
router.post('/smms', auth, async (ctx, next) => {
  let {url, storename, width, height, size, hash, timestamp, ip} = ctx.request.body;
  let ext = {
    hash,
    timestamp,
    ip,
    delete: ctx.request.body.delete
  };

  let db;
  try {
    db = await ctx.trpgapp.storage.connectAsync();
    let chatimg = await db.models.file_chatimg.createAsync({
      uuid: uuid(),
      name: storename,
      url,
      size,
      width,
      height,
      type: 'url',
      has_thumbnail: false,
      ext,
      owner_id: ctx.player.user.id
    });
    ctx.body = {
      chatimg: chatimg.getObject()
    };
  } finally {
    db.close();
  }
});

module.exports = router;
