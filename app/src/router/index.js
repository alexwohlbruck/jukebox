import Vue from 'vue'
import Router from 'vue-router'

import Library from '../components/views/Library'
import Album from '../components/views/Album'
import Artist from '../components/views/Artist'
import Search from '../components/views/Search'

Vue.use(Router)

export default new Router({
	routes: [{
		path: '/library',
		name: 'library',
		component: Library
	}, {
		path: '/album/:id',
		name: 'album',
		component: Album
	}, {
		path: '/artist',
		name: 'artist',
		component: Artist
	}, {
		path: '/search',
		name: 'search',
		component: Search
	}]
})