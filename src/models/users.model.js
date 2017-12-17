// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const users = new mongooseClient.Schema({
    email: { type: String, unique: true },
	username: { type: String, unique: true },
    password: { type: String },
	photo: { type: String },
	spotify: {
		accessToken: { type: String },
		refreshToken: { type: String },
		profileUrl: { type: String }
	}
  }, {
    timestamps: true
  });

  return mongooseClient.model('users', users);
};
