<template lang="pug">
	#app
		md-toolbar.md-transparent
			md-button.md-icon-button(@click='toggleLeftSidenav')
				md-icon menu

			h2.md-title(style='flex: 1') Music Library

			// Search bar here

			md-button.md-icon-button
				md-icon more_vert

		md-sidenav.md-left(ref='leftSidenav')
			md-toolbar
				md-button.md-icon-button(@click='toggleLeftSidenav')
					md-icon menu

			md-list
				md-list-item
					md-icon explore
					span Discover

				md-list-item
					router-link(to='library')
						md-icon library_music
						span Library

				md-list-item
					md-icon history
					span Recents

				md-list-item
					md-icon playlist_play
					span Playlists

					md-list-expand
						md-list
							md-list-item.md-inset
								md-icon wifi_tethering
								span Release Radar
							md-list-item.md-inset
								md-icon new_releases
								span Discover Weekly
							md-list-item.md-inset(v-for='playlist in [":D", "Chill", "Hype", "Sappy", "Sailing", "Beach"]', :key='playlist')
								span {{playlist}}
		router-view
</template>

<script>
	export default {
		name: 'app',
		methods: {
			toggleLeftSidenav() {
				this.$refs.leftSidenav.toggle()
			}
		}
	}
</script>