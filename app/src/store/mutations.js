export default {
	setQueue (state, queue) {
		state.player.queue = queue
		state.player.nowPlaying = queue.tracks[queue.startIndex]
		state.player.playing = true
	},
	plause (state, data) {
		console.log(data)
		state.player.playing = data.playing;
		console.log(state.player.playing, data.playing)
	},
	search (state, data) {
		state.searchResults = data.body
	},
	albumDetail (state, data) {
		state.albumDetail = data.body
	}
}