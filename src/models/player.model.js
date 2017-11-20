// player-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const player = new Schema({
  	// owner: {type: Schema.Types.ObjectId, ref: 'User'},
    nowPlaying: {
    	index: {type: Number, default: 0},
    	paused: {type: Boolean, default: true},
    	progress: {type: Number, default: 0},
    	track: Schema.Types.Mixed
    },
    tracks: [{type: String}], // Array of track IDs
    source: {
		id: {type: String, default: null}, // Source ID
		type: {
			type: String,
			enum: [null, 'album', 'playlist', 'artist'],
			default: null,
		}
	}
  }, {
    timestamps: true
  });

  return mongooseClient.model('player', player);
};
