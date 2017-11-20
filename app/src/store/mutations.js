export default {
	setQueue (state, data) {
		const {nowPlaying, source, tracks} = data
		state.player.queue = {nowPlaying, source, tracks}
	},
	search (state, data) {
		state.searchResults = data.body
	},
	albumDetail (state, data) {
		state.albumDetail = data.body
	}
}