const uuid = require('uuid/v1');

module.exports = function() {
  return async (ctx, next) => {
    let trpgapp = ctx.trpgapp;
    if(!ctx.player) {
      ctx.response.status = 403;
      ctx.response.body = '用户未找到，请检查登录状态';
      return;
    }

    let {filename, size, has_thumbnail, encoding, mimetype} = ctx.req.file;
    let db;
    try {
      db = await trpgapp.storage.connectAsync();
      let chatimg = await db.models.file_chatimg.createAsync({
        uuid: uuid(),
        name: filename,
        size,
        type: 'file',
        has_thumbnail,
        encoding,
        mimetype,
      })
      await chatimg.setOwnerAsync(ctx.player.user);
      ctx.chatimg = chatimg.getObject();
    } catch(e) {
      console.error(e);
    } finally {
      db.close();
      await next();
    }
  }
}
