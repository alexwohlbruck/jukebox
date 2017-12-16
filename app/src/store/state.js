export default {
	player: {
		queue: {
			tracks: [],
			context: {
				id: null,
				type: null
			},
			index: 0
		},
		nowPlaying: {
			// Track
			artists: [],
			album: {}
		},
		playing: true,
		progress: 0
	},
	searchResults: {
		artists: [],
		albums: [],
		tracks: [],
		playlists: []
	},
	albumDetail: null
}