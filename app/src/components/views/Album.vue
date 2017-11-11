<template lang="pug">
	md-layout(md-align='center')
		md-card.header
			md-layout(md-row, style='background-color: #9CE3FD')
				div.cover
					img(:src='album.images[0].url')

				md-layout(md-column)
					md-card-header.title.md-flex
						md-card-header-text
							.md-display-1 {{album.name}}
							.md-subheading
								router-link(to='artist') {{album.artists[0].name}}
								span &nbsp;&bull;&nbsp;
								span {{album.tracks.items.length}} {{album.tracks.items.length == 1 ? 'song' : 'songs'}}

						md-menu(md-size='4', md-direction='bottom left')
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

					md-button.shuffle.md-fab.md-clean
						md-icon shuffle

					.info
						.md-subheading {{album.release_date | formatDate}}

			//- form(@submit.stop.prevent='submit')
			//- 	md-input-container
			//- 		label Filter
			//- 		md-input(v-model='filterQuery')
			
			tracks

</template>

<style lang="scss" scoped>
	body {
		background-color: red !important;
	}
	.header {
		min-width: 80%;

		.cover {
			width: 300px;
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
	import Tracks from '../widgets/Tracks'

	export default {
		mounted() {
			// document.body.style.backgroundImage = `url('${this.album.images[0].url}')`
			// document.body.style.backgroundSize = 'cover'
		},
		data() {
			return {
				album: {
					"album_type" : "single",
					"artists" : [ {
						"external_urls" : {
							"spotify" : "https://open.spotify.com/artist/4wYk01oPJNfaEssVFL46oQ"
						},
						"href" : "https://api.spotify.com/v1/artists/4wYk01oPJNfaEssVFL46oQ",
						"id" : "4wYk01oPJNfaEssVFL46oQ",
						"name" : "Coast Modern",
						"type" : "artist",
						"uri" : "spotify:artist:4wYk01oPJNfaEssVFL46oQ"
					} ],
					"available_markets" : [ "AD", "AR", "AT", "AU", "BE", "BG", "BO", "BR", "CA", "CH", "CL", "CO", "CR", "CY", "CZ", "DE", "DK", "DO", "EC", "EE", "ES", "FI", "FR", "GB", "GR", "GT", "HK", "HN", "HU", "ID", "IE", "IS", "IT", "JP", "LI", "LT", "LU", "LV", "MC", "MT", "MX", "MY", "NI", "NL", "NO", "NZ", "PA", "PE", "PH", "PL", "PT", "PY", "SE", "SG", "SK", "SV", "TH", "TR", "TW", "US", "UY", "VN" ],
					"copyrights" : [ {
						"text" : "2016 300 Entertainment / +1 Records",
						"type" : "C"
					}, {
						"text" : "2016 300 Entertainment / +1 Records",
						"type" : "P"
					} ],
					"external_ids" : {
						"upc" : "814908021773"
					},
					"external_urls" : {
						"spotify" : "https://open.spotify.com/album/4VRfCkxgVua6OCPlTn1ubu"
					},
					"genres" : [ ],
					"href" : "https://api.spotify.com/v1/albums/4VRfCkxgVua6OCPlTn1ubu",
					"id" : "4VRfCkxgVua6OCPlTn1ubu",
					"images" : [ {
						"height" : 640,
						"url" : "https://i.scdn.co/image/8fd2367bb6719bf57bfad475ce4137bc66394b60",
						"width" : 640
					}, {
						"height" : 300,
						"url" : "https://i.scdn.co/image/98c6f3a35123b832bb7a5b7c2c415f35c1d4c46d",
						"width" : 300
					}, {
						"height" : 64,
						"url" : "https://i.scdn.co/image/cffc149fe21e9033d1d5b1f9b5e39961506772f8",
						"width" : 64
					} ],
					"label" : "300 Entertainment / +1 Records",
					"name" : "The Way It Was",
					"popularity" : 55,
					"release_date" : "2016-08-19",
					"release_date_precision" : "day",
					"tracks" : {
						"href" : "https://api.spotify.com/v1/albums/4VRfCkxgVua6OCPlTn1ubu/tracks?offset=0&limit=50",
						"items" : [ {
							"artists" : [ {
								"external_urls" : {
									"spotify" : "https://open.spotify.com/artist/4wYk01oPJNfaEssVFL46oQ"
								},
								"href" : "https://api.spotify.com/v1/artists/4wYk01oPJNfaEssVFL46oQ",
								"id" : "4wYk01oPJNfaEssVFL46oQ",
								"name" : "Coast Modern",
								"type" : "artist",
								"uri" : "spotify:artist:4wYk01oPJNfaEssVFL46oQ"
							} ],
							"available_markets" : [ "AD", "AR", "AT", "AU", "BE", "BG", "BO", "BR", "CA", "CH", "CL", "CO", "CR", "CY", "CZ", "DE", "DK", "DO", "EC", "EE", "ES", "FI", "FR", "GB", "GR", "GT", "HK", "HN", "HU", "ID", "IE", "IS", "IT", "JP", "LI", "LT", "LU", "LV", "MC", "MT", "MX", "MY", "NI", "NL", "NO", "NZ", "PA", "PE", "PH", "PL", "PT", "PY", "SE", "SG", "SK", "SV", "TH", "TR", "TW", "US", "UY", "VN" ],
							"disc_number" : 1,
							"duration_ms" : 229666,
							"explicit" : false,
							"external_urls" : {
								"spotify" : "https://open.spotify.com/track/1b91Hfg3v9vxqkAxRZCSEc"
							},
							"href" : "https://api.spotify.com/v1/tracks/1b91Hfg3v9vxqkAxRZCSEc",
							"id" : "1b91Hfg3v9vxqkAxRZCSEc",
							"name" : "The Way It Was",
							"preview_url" : "https://p.scdn.co/mp3-preview/0dd2203cc1456a8b8c187242c482f851d5ef4146?cid=8897482848704f2a8f8d7c79726a70d4",
							"track_number" : 1,
							"type" : "track",
							"uri" : "spotify:track:1b91Hfg3v9vxqkAxRZCSEc"
						} ],
						"limit" : 50,
						"next" : null,
						"offset" : 0,
						"previous" : null,
						"total" : 1
					},
					"type" : "album",
					"uri" : "spotify:album:4VRfCkxgVua6OCPlTn1ubu"
				}
			}
		},
		methods: {
			filterTracks() {
				return this.tracks.items.filter(track => {
					return track.name.toLowerCase().includes(this.filterQuery.toLowerCase())
				})
			}
		},
		filters: {
			formatDate(input) {
				const date = new Date(input)
				return moment(date).format('MMMM Do, YYYY')
			}
		},
		components: {
			Tracks
		}
	}
</script>