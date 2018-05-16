module.exports = function Avatar(orm, db) {
  let Avatar = db.define('file_avatar', {
    uuid: {type: 'text'},
    name: {type: 'text', require: true},
    size: {type: 'number', require: true},
    width: {type: 'number'},
    height: {type: 'number'},
    type: {type: 'enum', values: ['actor', 'user', 'group']},
    createAt: {type: 'date', time: true},
    attach_uuid: {type: 'text'},
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
          type: this.type,
          createAt: this.createAt,
          attach_uuid: this.attach_uuid,
        }
      }
    }
  })

  let User = db.models.player_user;
  if(!!User) {
    Avatar.hasOne('owner', User, {reverse: 'avatar_file'});
  }

  return Avatar;
}
