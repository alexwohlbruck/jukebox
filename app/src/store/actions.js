import client from '../../feathers-client'
const search = client.service('search')
const album = client.service('album')
const player = client.service('player')

export default {
	setQueue ({commit, state}, {tracks, index, source}) {

		if (source) {
			const {id, type} = source
		}
		const currentTrack = tracks[index]
		tracks = tracks.map(t => t.id)

		player.patch('5a12333efda702338969f7af', {
			nowPlaying: {
				index,
				paused: false,
				progress: 0,
				track: currentTrack
			},
			tracks: tracks,
			source: source ? {id, type} : null
		})
		.then(data => {
			commit('setQueue', data)
		})
	},

	search ({commit, state}, query) {
		search.find({query: {q: query}}).then(data => {
			commit('search', data)
		})
	},
	getAlbum ({commit, state}, id) {
		album.get(id).then(data => {
			commit('albumDetail', data)
		})
	}
}