<template lang="pug">
	md-table(md-sort='date_added')
		md-table-header
			md-table-row
				md-table-head(md-sort-by='index') #
				md-table-head
				md-table-head(md-sort-by='name') Title
				md-table-head(md-sort-by='artists[0].name') Artist
				md-table-head(md-sort-by='album.name') Album
				md-table-head(md-sort-by='date_added')
					md-icon library_add
				md-table-head(md-sort-by='listens')
					md-icon music_note
				md-table-head(md-sort-by='duration_ms')
					md-icon access_time
				md-table-head

		md-table-body
			md-table-row(v-for='(track, index) in tracks', :key="index")
				md-table-cell {{++index}}
				md-table-cell
					md-button.md-icon-button
						md-icon add
				md-table-cell {{track.name}}
				md-table-cell {{track.artists[0].name}}
				md-table-cell {{track.album.name}}
				md-table-cell Test
				md-table-cell Test
				md-table-cell {{formatMilliseconds(track.duration_ms)}}
				md-table-cell
					md-menu(md-direction='bottom left')
						md-button.md-icon-button(md-menu-trigger)
							md-icon more_vert

						md-menu-content
							md-menu-item Add to queue
							md-menu-item Start radio
							md-divider
							md-menu-item Go to artist
							md-menu-item Go to album
							md-divider
							md-menu-item Remove from library
							md-menu-item Add to playlist
							md-divider
							md-menu-item Share	
</template>

<script>
	
	import { mapState } from 'vuex'

	export default {
		computed: {
			...mapState('library', {
				tracks: state => state.tracks
			})
		},
		methods: {
			formatMilliseconds(ms) {
				if (isNaN(ms)) return null
		
				ms = Math.floor(ms / 1000);
				var hours   = Math.floor(ms / 360)
				var minutes = Math.floor((ms - (hours * 360)) / 60)
				var seconds = ms - (hours * 360) - (minutes * 60)

				if (seconds < 10) { seconds = "0" + seconds }
				if (hours != 0 && minutes < 10) { minutes = "0" + minutes }
				return (hours == 0 ? '' : hours+':')+minutes+':'+seconds
			}
		}
	}
</script>