const uuid = require('uuid/v1');

module.exports = function(isPersistence = false) {
  return async (ctx, next) => {
    let trpgapp = ctx.trpgapp;
    if(!ctx.player) {
      ctx.response.status = 403;
      ctx.response.body = '用户未找到，请检查登录状态';
      return;
    }

    let {filename, size, encoding, mimetype} = ctx.req.file;
    let db;
    try {
      db = await trpgapp.storage.connectAsync();

      let fileinfo = await db.models.file_file.createAsync({
        uuid: uuid(),
        name: filename,
        size,
        encoding,
        mimetype,
        type: 'file',
        is_persistence: isPersistence,
        owner_uuid: ctx.player.user.uuid,
        owner_id: ctx.player.user.id
      })
      ctx.fileinfo = fileinfo.getObject();
    } catch(e) {
      console.error(e);
    } finally {
      db.close();
      await next();
    }
  }
}
