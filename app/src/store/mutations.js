export default {
	setQueue (state, data) {
		state.player = data
	},
	plause (state, data) {
		console.log('mut', data.paused)
		state.player.paused = data.paused
	},
	search (state, data) {
		state.searchResults = data.body
	},
	albumDetail (state, data) {
		state.albumDetail = data.body
	}
}