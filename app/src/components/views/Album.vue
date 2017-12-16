<template lang="pug">
	md-card.header
		md-card-header
			md-card-media.cover
				img(:src='album.images[0].url' alt='album.name')

			md-card-header-text
				.md-display-1 {{album.name}} {{hover}}
				.md-subheading
					router-link(to='artist') {{album.artists[0].name}}
					span &nbsp;&bull;&nbsp;
					span {{album.tracks.items.length}} {{album.tracks.items.length == 1 ? 'song' : 'songs'}}

				.info
					.md-subheading {{album.release_date | formatDate}}

			md-menu(md-size='4')
				md-button.md-icon-button(md-menu-trigger)
					md-icon more_vert

				md-menu-content
					md-menu-item
						span Add to queue
					md-menu-item
						span Start radio
					md-menu-item
						span Go to Artist
					md-divider
					md-menu-item
						span Add to library
					md-menu-item
						span Add to playlist
					md-menu-item
						span Share

			//- md-button.shuffle.md-fab.md-clean
				md-icon shuffle

		//- form(@submit.stop.prevent='submit')
			md-input-container
				label Filter
				md-input(v-model='filterQuery')
		
		tracks-list(
			:tracks='album.tracks',
			:context='album',
			:options='{hide: ["album", "artist"]}'
		)

</template>

<style lang="scss" scoped>
	body {
		background-color: red !important;
	}

	.header {
		min-width: 80%;

		$coverSize: 250px;
	
		.cover {
			width: $coverSize;
			height: $coverSize;
			flex: 0 0 $coverSize;
		}

		.title {
			padding: 32px;
		}

		.shuffle {
			margin: 0;
			position: relative;
			transform: translate(calc(-100% - 32px), 50%);
			left: 100%;
		}

		.info {
			padding: 20px 32px;
			background-color: rgba(255, 255, 255, .3);
		}
	}
</style>

<script>
	import moment from 'moment'
	import TracksList from '../widgets/TracksList'

	import { mapGetters, mapActions } from 'vuex'

	export default {
		created() {
			// document.body.style.backgroundImage = `url('${this.album.images[0].url}')`
			// document.body.style.backgroundSize = 'cover'
			this.getAlbum(this.$route.params.id)
		},
		watch: {
			'$route.params.id': 'getAlbum'
		},
		computed: {
			...mapGetters({
				album: 'albumDetail'
			})
		},
		methods: {
			filterTracks() {
				return this.tracks.items.filter(track => {
					return track.name.toLowerCase().includes(this.filterQuery.toLowerCase())
				})
			},
			...mapActions([
				'getAlbum'
			])
		},
		filters: {
			formatDate(input) {
				const date = new Date(input)
				return moment(date).format('MMMM Do, YYYY')
			}
		},
		components: {
			TracksList
		}
	}
</script>