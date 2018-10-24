const Router = require('koa-router');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth')();
const fileStorage = require('../middleware/storage/file');
const fileProcess = require('../middleware/process');

let router = new Router();

let ret = async (ctx) => {
  ctx.body = {
    file:ctx.req.file,
    info: ctx.fileinfo,
  };
}

router.post('/upload/persistence', auth, upload(true).single('file'), fileProcess('./public/uploads/persistence', false), fileStorage(true), ret);
router.post('/upload/temporary', auth, upload(false).single('file'), fileProcess('./public/uploads/temporary', false), fileStorage(false), ret);

module.exports = router;
