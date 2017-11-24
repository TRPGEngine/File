exports.bindAttachUUID = function(data, cb) {
  let app = this.app;
  let socket = this.socket;

  try {
    let player = app.player.list.find(socket);
    if(!player) {
      cb({result: false, msg: '用户不存在，请检查登录状态'});
      return;
    }

    let avatar_uuid = data.avatar_uuid;
    let attach_uuid = data.attach_uuid;

    let db = await app.storage.connectAsync();
    let avatar = await db.models.file_avatar.oneAsync({uuid: avatar_uuid});
    avatar.attach_uuid = attach_uuid;
    await avatar.saveAsync();
    cb({result: true, avatar: avatar.getObject()})
    db.close();
  }catch(err) {
    cb({result: false, msg: err.toString()})
  }
}
