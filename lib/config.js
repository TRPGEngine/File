const os = require('os');
const path = require('path');

module.exports = {
  limits: {
    fileSize: 8 * 1024 * 1024// 1MB
  },
  path: {
    chatimgDir: path.resolve(os.tmpdir(), './trpg-chat-image/')
  }
}
