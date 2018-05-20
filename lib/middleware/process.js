const images = require("images");

module.exports = function() {
  return async (ctx, next) => {
    let {width, height} = ctx.header;
    if(width) {
      let {filename} = ctx.req.file;
      let path = `public/avatar/${filename}`;
      let thumbnailpath = `public/avatar/thumbnail/${filename}`;
      console.log(width, height);
      images(path)
        .resize(parseInt(width), parseInt(height))
        .save(thumbnailpath)
    }
    await next();
  }
}
