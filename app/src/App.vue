<template lang="pug">
	md-app#app(md-scrollbar, md-waterfall, md-mode='fixed')
		md-app-toolbar.md-primary
			.md-toolbar-row
				.md-toolbar-section-start
					md-button.md-icon-button(@click='toggleNav', v-if='!showNav')
						md-icon menu

					span.md-title {{this.$route.name | capitalize}}

				md-autocomplete.search(v-model='searchQuery', :md-selected='search', :md-options='["test"]', md-layout='box')
					label Search music

				.md-toolbar-section-end
					md-button.md-icon-button
						md-icon more_vert

		md-app-drawer.nav(:md-active.sync='showNav', md-persistent='mini')
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
					//- 	md-list
					//- 		md-list-item.md-inset
					//- 			md-icon wifi_tethering
					//- 			span Release Radar
					//- 		md-list-item.md-inset
					//- 			md-icon new_releases
					//- 			span Discover Weekly
					//- 		md-list-item.md-inset(v-for='playlist in [":D", "Chill", "Hype", "Sappy", "Sailing", "Beach"]', :key='playlist')
					//- 			span {{playlist}}

		md-app-content
			router-view
				
</template>

<style scoped>
	#app {
		position: absolute;
		height: 100%;
		width: 100%;
	}

	.search {
		max-width: 45%;
	}

	.nav {
		width: 220px;
	}
</style>

<script>
	export default {
		name: 'app',
		data: () => ({
			showNav: false,
			searchQuery: ''
		}),
		filters: {
			capitalize(string) {
				return string//string.charAt(0).toUpperCase() + string.slice(1)
			}
		},
		methods: {
			toggleNav() {
				this.showNav = !this.showNav
			},
			search() {
				console.log('router')
				this.$route.router.push({name: 'search', query: {q: this.searchQuery}})
			}
		}
	}
</script>