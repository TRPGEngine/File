module.exports = function() {
  return async (ctx, next) => {
    let trpgapp = ctx.trpgapp;
    let user_uuid = ctx.request.header['user-uuid'];
    if(!user_uuid) {
      ctx.response.status = 403;
      ctx.response.body = '缺少必要参数'
      return;
    }

    let player = trpgapp.player.list.get(user_uuid);
    if(!player) {
      ctx.response.status = 403;
      ctx.response.body = '用户不存在，请检查登录状态'
    }else {
      ctx.player = player;
      await next();
    }
  }
}
