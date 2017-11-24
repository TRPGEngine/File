const uuid = require('uuid/v1');

module.exports = function() {
  return async (ctx, next) => {
    let core = ctx.core;
    if(ctx.player) {
      let filename = ctx.req.file.filename;
      let size = ctx.req.file.size;
      let avatar_type = ctx.header['avatar-type'] || 'actor';
      let db = await core.storage.connectAsync();
      try {
        let attach_uuid = ctx.header['attach-uuid'] || null;
        if(attach_uuid) {
          // attach_uuid应唯一:一个用户只能有一个对应的头像文件、一个角色只能有一个对应的图片
          // 没有attach_uuid的文件会被删除
          // TODO:清理文件
          let oldAvatars = await db.models.file_avatar.findAsync({attach_uuid});
          for (let oldAvatar of oldAvatars) {
            oldAvatar.attach_uuid = null;
            await oldAvatar.saveAsync();
          }
        }
        let avatar = await db.models.file_avatar.createAsync({
          uuid: uuid(),
          name: filename,
          size,
          type: avatar_type,
          attach_uuid,
          createAt: new Date()
        })
        await avatar.setOwnerAsync(ctx.player.user);
        ctx.avatar = avatar.getObject();
      }catch(e) {
        console.error(e);
      }finally {
        db.close();
        await next();
      }
    }else {
      ctx.response.status = 403;
      ctx.response.body = '用户未找到，请检查登录状态'
    }
  }
}
