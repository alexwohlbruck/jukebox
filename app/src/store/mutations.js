export default {
	search (state, data) {
		state.searchResults = data.body
	},
	albumDetail (state, data) {
		console.log(data)
		state.albumDetail = data.body
	}
}