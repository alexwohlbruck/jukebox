export default {
	player: {
		queue: {
			tracks: [],
			source: {
				id: null,
				type: null
			}
		},
		nowPlaying: {
			index: 0,
			track: {
				artists: [],
				album: {}
			}
		},
		paused: true,
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