import client from '../../feathers-client'
const search = client.service('search')
const album = client.service('album')
const player = client.service('player')

const playerID = '5a1371844d4eb07eb9cf002e'

export default {
	setQueue ({commit, state}, {tracks, index, source}) {
		if (source) {
			const {id, type} = source
		}
		const currentTrack = tracks[index]
		tracks = tracks.map(t => t.id)

		player.patch(playerID, {
			queue: {
				tracks: tracks,
				source: source ? {id, type} : null
			},
			nowPlaying: {
				index,
				track: currentTrack
			},
			paused: false,
			progress: 0,
		})
		.then(data => {
			commit('setQueue', data)
		})
	},
	plause ({commit, state}) {
		player.patch(playerID, {
			paused: !state.player.paused
		})
		.then(data => {
			console.log('action', data)
			commit('plause', data)
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