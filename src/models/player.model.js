// player-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
	const mongooseClient = app.get('mongooseClient');
	const { Schema } = mongooseClient;
	const player = new Schema({
		// owner: {type: Schema.Types.ObjectId, ref: 'User'},
		queue: {
			tracks: [{type: Schema.Types.Mixed}], // Array of track IDs
			context: {
				id: {type: String, default: null}, // Source ID
				type: {
					type: String,
					enum: [null, 'album', 'playlist', 'artist'],
					default: null
				}
			},
			index: {type: Number, default: 0}
		},
		playing: {type: Boolean, default: false},
		progress: {type: Number, default: 0},
	}, {
		timestamps: true
	});

	return mongooseClient.model('player', player);
};
