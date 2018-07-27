const debug = require('debug')('trpg:component:file');
const fs = require('fs-extra');
// const sh = require('./sample-http');
const event = require('./event');
const config = require('./config');

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

async function removeFileAsync(path) {
  let exists = await fs.pathExists(path);
  if(exists) {
    await fs.remove(path);
    debug('remove file:', path);
  }
}

function checkDir() {
  if(!fs.existsSync('public')) {
    fs.mkdirSync('public');
  }
  if(!fs.existsSync('public/uploads')) {
    fs.mkdirSync('public/uploads');
  }
  if(!fs.existsSync('public/avatar')) {
    fs.mkdirSync('public/avatar');
  }
  if(!fs.existsSync('public/avatar/thumbnail')) {
    fs.mkdirSync('public/avatar/thumbnail');
  }

  let chatimgDir = config.path.chatimgDir;
  debug('聊天图片文件夹路径:', chatimgDir);
  if(!fs.existsSync(chatimgDir)) {
    fs.mkdirSync(chatimgDir);
  }
}

module.exports = function (isStandalone = false) {
  return function FileComponent(app) {
    const orm = app.storage._orm;
    let httpserver;

    checkDir();// 创建上传文件夹
    app.storage.registerModel(require('./models/avatar.js'));
    app.storage.registerModel(require('./models/chatimg.js'));
    app.on('initCompleted', function(app) {
      // 数据信息统计
      debug('storage has been load 2 file db model');
    });

    if(isStandalone === true) {
      httpserver = require('./koa')(app, 23257);
    }else {
      require('./webservice')(app);
    }

    app.on('resetStorage', function() {
      deleteall("./public/uploads");
      deleteall("./public/avatar");
      checkDir();
      debug('file disk storage reset completed!');
    })

    app.on('close', function() {
      httpserver && httpserver.destroy();
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

          let isExistOther = await db.models.file_avatar.existsAsync({name: filename, attach_uuid: orm.ne(null)});
          if(!isExistOther) {
            await removeFileAsync(`./public/avatar/${filename}`);// remove origin image
            await removeFileAsync(`./public/avatar/thumbnail/${filename}`);// remove thumbnail image
          }else {
            debug('exist other file relation, only remove record:', filename);
          }

          await fi.removeAsync();
        }
        debug(`remove ${count} file record success!`);
      }catch(e) {
        console.error(e);
        db.close();
      }
    }, 1000 * 60 * 60 * 4);

    return {
      name: 'FileComponent',
      require: ['PlayerComponent']
    }
  }
}
