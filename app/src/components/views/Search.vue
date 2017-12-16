<template lang="pug">
	div
		div(style='padding: 20px')
			.md-headline Search for
				b &nbsp;{{this.$route.query.q}}
			br

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
			'$route.query.q': 'search'
		},
		computed: {
			...mapGetters([
				'searchResults'
			])
		},
		methods: {
			...mapActions([
				'search',
				'test'
			])
		},
		components: {
			TracksList,
			AlbumsList
		}
	}
</script>