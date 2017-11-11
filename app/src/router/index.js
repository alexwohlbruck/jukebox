import Vue from 'vue'
import Router from 'vue-router'
import Library from '../components/views/Library'
import Album from '../components/views/Album'
import Artist from '../components/views/Artist'

Vue.use(Router)

export default new Router({
	routes: [{
		path: '/library',
		name: 'library',
		component: Library
	}, {
		path: '/album',
		name: 'album',
		component: Album
	}, {
		path: '/artist',
		name: 'artist',
		component: Artist
	}]
})