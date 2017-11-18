<template lang="pug">
	div
		.md-headline Search for
			b &nbsp;{{this.$route.query.q}}

		albums-list(:albums='searchResults.albums')
		tracks-list(:tracks='searchResults.tracks')
</template>

<script>
	import TracksList from '../widgets/TracksList'
	import AlbumsList from '../widgets/AlbumsList'

	import { mapActions, mapGetters } from 'vuex'

	export default {
		created() {
			this.search(this.$route.query.q)
		},
		watch: {
			$route: 'search'
		},
		computed: {
			...mapGetters([
				'searchResults'
			])
		},
		methods: {
			...mapActions([
				'search'
			])
		},
		components: {
			TracksList,
			AlbumsList
		}
	}
</script>