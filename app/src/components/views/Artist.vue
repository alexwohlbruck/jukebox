<template lang="pug">
	md-layout(md-align='center')
		md-card.card.header(md-column)
			md-card-header.title.md-flex
				md-card-header-text
					.md-display-1 Coast Modern
					.md-subheading
						span 6 albums &bull; 58,116 monthly listeners

				md-menu(md-size='4', md-direction='bottom left')
					md-button.md-icon-button(md-menu-trigger)
						md-icon more_vert

					md-menu-content
						md-menu-item
							span Start radio
						md-divider
						md-menu-item
							span Share

				md-button.shuffle.md-fab
					md-icon shuffle

			div
				.md-body-2.subtitle Popular songs
				tracks-list

			div
				.md-body-2.subtitle Albums
				albums-list.albums

			div
				.md-body-2.subtitle Related artists
				artists-list.artists
</template>

<style lang="scss" scoped>
	
	$padding: 32px;

	.card {
		min-width: 80%;

		.title {
			padding: $padding;
			position: relative;

			.shuffle {
				position: absolute;
				margin: 0;
				right: 0;
				bottom: 0;
				transform: translate(-20px, 100%)
			}
		}

		.subtitle {
			margin: 20px 0px 20px $padding;
		}

		.albums, .artists {
			padding-left: $padding / 2;
		}
	}

</style>

<script>
	import TracksList from '../widgets/TracksList'
	import AlbumsList from '../widgets/AlbumsList'
	import ArtistsList from '../widgets/ArtistsList'

	export default {
		components: {
			TracksList,
			AlbumsList,
			ArtistsList
		}
	}
</script>