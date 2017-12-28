const debug = require('debug')('trpg:component:file');
const fs = require('fs-extra');
// const sh = require('./sample-http');
const event = require('./event');

let _http = null;
function deleteall(path) {
  var files = [];
  if(fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach(function(file, index) {
      var curPath = path + "/" + file;
      if (fs.statSync(curPath).isDirectory()) { // recurse
        deleteall(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

module.exports = function (http = null) {
  _http = http;

  return function FileComponent(app) {
    const orm = app.storage._orm;
    let httpserver;
    app.storage.registerModel(require('./models/avatar.js'));
    app.on('initCompleted', function(app) {
      // 数据信息统计
      debug('storage has been load 1 file db model');
    });

    if(!_http) {
      httpserver = require('./koa')(app, 23257);
    }else {
      console.error('TODO');
    }

    app.on('resetStorage', function() {
      deleteall("./public/uploads");
      deleteall("./public/avatar");
      fs.mkdirSync('public/uploads');
      fs.mkdirSync('public/avatar');
      debug('file disk storage reset completed!');
    })

    app.on('close', function() {
      httpserver.destroy();
      console.log("file server closed!");
    })

    app.registerEvent('file::bindAttachUUID', event.bindAttachUUID);

    // Timer
    app.registerTimer(async function saveChat() {
      debug("start clear no-attach file...");
      // event.saveChatLog.call(app);
      let db = await app.storage.connectAsync();
      try {
        let gtdate = new Date(new Date().setTime(new Date().getTime() - 1000 * 60 * 60 * 1));// 只找一小时内没有绑定关联uuid的
        let list = await db.models.file_avatar.findAsync({attach_uuid: null, createAt: orm.lt(gtdate)});
        let count = list.length;
        for (let fi of list) {
          let filename = fi.name;
          let path = `./public/avatar/${filename}`;
          let exists = await fs.pathExists(path);
          if(exists) {
            await fs.remove(path);
          }
          await fi.removeAsync();
        }
        debug(`remove ${count} file success!`);
      }catch(e) {
        console.error(e);
        db.close();
      }
    }, 1000 * 60 * 60 * 4);
  }
}
