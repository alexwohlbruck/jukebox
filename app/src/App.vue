<template lang="pug">
	
	md-app#app(md-scrollbar, md-waterfall, md-mode='fixed')
		md-app-toolbar.md-primary
			.md-toolbar-row
				.md-toolbar-section-start
					md-button.md-icon-button(@click='toggleNav', v-if='!showFullNav')
						md-icon menu

					span.md-title {{this.$route.name | capitalize}}

				form.search(@submit.prevent='search')
					md-autocomplete(
						ref='searchBox',
						v-model='searchQuery',
						:md-options='["test"]',
						md-layout='box',
						:md-open-on-focus='false'
					)
						label Search music

				.md-toolbar-section-end
					md-button.md-icon-button(@click='showQueue = true')
						md-icon queue_music

					md-button.md-icon-button
						md-icon more_vert

		md-app-drawer.nav(:md-active.sync='showFullNav', md-persistent='mini')
			md-toolbar.md-transparent
				span Jukebox

				.md-toolbar-section-end
					md-button.md-icon-button.md-dense(@click='toggleNav')
						md-icon keyboard_arrow_left

			md-list
				md-list-item
					md-icon explore
					span.md-list-item-text Discover

				//- md-list-item
				//- 	router-link(to='library')
				//- 		md-icon library_music
				//- 		span.md-list-item-text Library

				md-list-item
					md-icon history
					span.md-list-item-text Recents

				md-list-item
					md-icon playlist_play
					span.md-list-item-text Playlists

					//- md-list-expand
						md-list
							md-list-item.md-inset
								md-icon wifi_tethering
								span Release Radar
							md-list-item.md-inset
								md-icon new_releases
								span Discover Weekly
							md-list-item.md-inset(v-for='playlist in [":D", "Chill", "Hype", "Sappy", "Sailing", "Beach"]', :key='playlist')
								span {{playlist}}

		md-app-content.main-view
			player
			router-view

		//- md-app-drawer.queue(:md-active.sync='showQueue', md-right)
			md-toolbar(md-elevation='0')
				.md-toolbar-row
					.md-toolbar-section-start
						md-tabs.md-transparent
							md-tab#tab-friends(md-label='Friends')
							md-tab#tab-queue(md-label='Play queue')

					.md-toolbar-section-end
						md-button.md-icon-button(@click='showQueue = false')
							md-icon keyboard_arrow_right

						md-button.md-icon-button
							md-icon more_vert

					
</template>

<style scoped lang="scss">
	#app {
		position: absolute;
		height: 100%;
		width: 100%;
	}

	.search {
		width: 45%;
	}

	.nav {
		width: 220px;
	}

	.main-view {
	    padding: 0;
	    padding-bottom: 75px;
	    width: 100%;
	}

	.queue {
		width: 350px;

		.md-tabs {
			padding-left: 0;
		}
	}
</style>

<script>
	import Player from './components/widgets/Player'

	export default {
		name: 'app',
		data: () => ({
			showFullNav: false,
			showQueue: false,
			searchQuery: ''
		}),
		filters: {
			capitalize(string) {
				return string ? string.charAt(0).toUpperCase() + string.slice(1) : ''
			}
		},
		methods: {
			toggleNav() {
				this.showFullNav = !this.showFullNav		
			},
			search() {
				const searchBox = this.$refs.searchBox
				this.$router.push({name: 'search', query: {q: searchBox.searchTerm}})

				// This is bullshit
				// Post an issue on Vue Material github to ask for native solution
				document.getElementById(searchBox.$children[0].$children[0].$children[0].id).blur()
			}
		},
		components: {
			Player
		}
	}
</script>
