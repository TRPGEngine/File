const uuid = require('uuid/v1');
const config = require('../config');

module.exports = function File(orm, db) {
  let File = db.define('file_file', {
    uuid: {type: 'text'},
    name: {type: 'text', require: true},
    originalname: {type: 'text', require: true},
    size: {type: 'number', require: true},
    encoding: {type: 'text'},
    mimetype: {type: 'text'},
    ext: {type: 'text'},
    type: {type: 'enum', values: ['file']},
    can_preview: {type:'boolean', defaultValue: false},
    is_persistence: {type:'boolean', defaultValue: false},
    is_expired: {type:'boolean', defaultValue: false},
    createAt: {type: 'date', time: true},
    owner_uuid: {type: 'text'},
  }, {
    hooks: {
      beforeCreate: function(next) {
        if (!this.uuid) {
  				this.uuid = uuid();
  			}
        if (!this.ext) {
          if(this.name.indexOf('.') >= 0) {
            let tmp = this.name.split('.');
            this.ext = tmp[tmp.length - 1];
          }else {
            this.ext = '';
          }
        }
        if (this.can_preview === undefined) {
  				this.can_preview = config.canPreviewExt.indexOf(this.ext) >= 0
  			}
        if (!this.createAt) {
  				this.createAt = new Date();
  			}
  			return next();
      }
    },
    methods: {
      getPreviewUrl: function(apihost) {
        if(['doc','docx','xls','xlsx','ppt','pptx'].indexOf(this.ext) >= 0) {
          // 是office文件
          return config.getOfficePreviewUrl(apihost + this.getDownloadUrl())
        }else if(['.pdf', 'jpg', 'png']) {
          return apihost + this.getDownloadUrl()
        }else {
          return ''
        }
      },
      getDownloadUrl: function() {
        return `/file/download/${this.uuid}/${this.originalname}`
      },
      getObject: function() {
        return {
          fileuuid: this.uuid,
          originalname: this.originalname,
          size: this.size,
          ext: this.ext,
          mimetype: this.mimetype,
          type: this.type,
          can_preview: this.can_preview,
          is_persistence: this.is_persistence,
          createAt: this.createAt,
          owner_uuid: this.owner_uuid,
        }
      }
    }
  })

  let User = db.models.player_user;
  if(!!User) {
    File.hasOne('owner', User);
  }

  return File;
}
