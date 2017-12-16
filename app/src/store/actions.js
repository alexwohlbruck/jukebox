import client from '../../feathers-client'
const search = client.service('search')
const album = client.service('album')

const playerId = '5a28690c879535359101b2df'

const player = ({id, action, data}) => {
	return client.service('player/' + action).patch(id, data || {})
}

export default {
	setQueue ({commit, state}, {tracks, startIndex, context}) {
		console.log('test')
		player({id: playerId, action: 'setQueue', data: {
			tracks,
			startIndex,
			context
		}}).then(data => {
			// Data is not returned to app
			// Should happen over socket.io broadcast to all clients
			// or client should request data using api
			console.log(data) // undefined
			console.log({tracks, startIndex, context})
			commit('setQueue', {tracks, startIndex, context})
		})
	},
	plause ({commit, state}) {
		player({id: playerId, action: 'plause'/*, data: {
			playing: !state.player.playing
		}*/})
		.then(data => {
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
