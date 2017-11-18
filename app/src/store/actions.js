import client from '../../feathers-client'
const search = client.service('search')
const album = client.service('album')

export default {
	search ({commit, state}, query) {
		search.find({query: {q: query}}).then(data => {
			commit('search', data)
		})
	},
	getAlbum ({commit, state}, id) {
		console.log('test')
		album.get(id).then(data => {
			commit('albumDetail', data)
		})
	}
}