module.exports = function Avatar(orm, db) {
  let Avatar = db.define('file_avatar', {
    uuid: {type: 'text'},
    name: {type: 'text', require: true},
    size: {type: 'number', require: true},
    type: {type: 'enum', values: ['actor', 'user', 'group']},
    createAt: {type: 'date'},
    attach_uuid: {type: 'text'},
  }, {
    hooks: {
      beforeCreate: function(next) {
        if (!this.uuid) {
  				this.uuid = uuid();
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
