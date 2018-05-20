const debug = require('debug')('trpg:component:file:process');
const images = require("images");
const fs = require('fs-extra');
const md5File = require('md5-file/promise')

module.exports = function() {
  return async (ctx, next) => {
    let {width, height} = ctx.header;
    let {filename} = ctx.req.file;
    let dir = './public/avatar';
    let ext = filename.split('.')[1];
    let hash = await md5File(`${dir}/${filename}`);
    if(await fs.pathExists(`${dir}/${hash}.${ext}`)) {
      debug(`file [${dir}/${hash}.${ext}] is exists! remove update file and return existsed file`);
      await fs.remove(`${dir}/${filename}`);
    }else {
      await fs.move(`${dir}/${filename}`, `${dir}/${hash}.${ext}`);
    }
    ctx.req.file.filename = `${hash}.${ext}`;
    filename = `${hash}.${ext}`;
    let path = `${dir}/${filename}`;


    if(width) {
      let thumbnailpath = `./public/avatar/thumbnail/${filename}`;
      console.log('generate thumbnail with size:', width, height);
      images(path)
        .resize(parseInt(width), parseInt(height))
        .save(thumbnailpath)
    }
    await next();
  }
}
