const uuid = require('uuid/v1');

module.exports = function Avatar(orm, db) {
  let Avatar = db.define('file_chatimg', {
    uuid: {type: 'text'},
    name: {type: 'text', require: true},
    url: {type: 'text'},
    size: {type: 'number', require: true},
    width: {type: 'number'},
    height: {type: 'number'},
    type: {type: 'enum', values: ['file', 'url']},
    has_thumbnail: {type: 'boolean', defaultValue: false},
    createAt: {type: 'date', time: true},
    mimetype: {type: 'text'},
    encoding: {type: 'text'},
    ext: {type: 'object'}
  }, {
    hooks: {
      beforeCreate: function(next) {
        if (!this.uuid) {
  				this.uuid = uuid();
  			}
        if (!this.createAt) {
  				this.createAt = new Date();
  			}
  			return next();
      }
    },
    methods: {
      getObject: function() {
        return {
          uuid: this.uuid,
          name: this.name,
          url: this.url,
          createAt: this.createAt,
        }
      }
    }
  })

  let User = db.models.player_user;
  if(!!User) {
    Avatar.hasOne('owner', User, {reverse: 'chat_image'});
  }

  return Avatar;
}
