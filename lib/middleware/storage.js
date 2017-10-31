const uuid = require('uuid/v1');

module.exports = function() {
  return async (ctx, next) => {
    let core = ctx.core;
    if(ctx.player) {
      let filename = ctx.req.file.filename;
      let size = ctx.req.file.size;
      let avatar_type = ctx.header['avatar-type'] || 'actor';
      let db = await core.storage.connectAsync();
      let avatar = await db.models.file_avatar.createAsync({
        uuid: uuid(),
        name: filename,
        size,
        type: avatar_type,
        createAt: new Date()
      })
      await avatar.setOwnerAsync(ctx.player.user);
      ctx.avatar = avatar.getObject();
      db.close();
      await next();
    }else {
      ctx.response.status = 403;
      ctx.response.body = '用户未找到，请检查登录状态'
    }
  }
}
