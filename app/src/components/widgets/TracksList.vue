<template lang="pug">
div
	md-table
		md-table-row
			md-table-head #
			md-table-head
			md-table-head.stretch Title
			md-table-head(v-if='hide("artist")') Artist
			md-table-head(v-if='hide("album")') Album
			md-table-head
				md-icon library_add
			md-table-head
				md-icon music_note
			md-table-head
				md-icon access_time
			md-table-head

		md-table-row(
			v-for='(track, index) in tracks.items',
			:key='index',
			@click.native='setQueue({tracks: tracks.items, index, source})'
		)
			md-table-cell {{index + 1}}
			md-table-cell
				md-button.md-icon-button
					md-icon add
			md-table-cell {{track.name}}
			md-table-cell(v-if='hide("artist")') {{track.artists[0].name}}
			md-table-cell(v-if='hide("album")') {{track.album.name}}
			md-table-cell {{Math.floor(Math.random() * 7)}}d
			md-table-cell {{Math.floor(Math.random() * 100)}}
			md-table-cell {{formatMilliseconds(track.duration_ms)}}
			md-table-cell
				md-menu
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

<style lang='scss' scoped>
	.stretch {
		width: 100%;
	}
</style>

<script>
	
	import { mapActions } from 'vuex'

	export default {
		name: 'tracks-list',
		props: ['tracks', 'source', 'options'],
		data() {
			return {
				hover: false
			}
		},
		methods: {
			hide(type) {
				// Determine if a data type should be hidden in list
				if (!this.options || !this.options.hide) return false
				return !this.options.hide.includes(type)
			},
			formatMilliseconds(ms) {
				if (isNaN(ms)) return null
		
				ms = Math.floor(ms / 1000);
				var hours   = Math.floor(ms / 360)
				var minutes = Math.floor((ms - (hours * 360)) / 60)
				var seconds = ms - (hours * 360) - (minutes * 60)

				if (seconds < 10) { seconds = "0" + seconds }
				if (hours != 0 && minutes < 10) { minutes = "0" + minutes }
				return (hours == 0 ? '' : hours+':')+minutes+':'+seconds
			},
			...mapActions([
				'setQueue'
			])
		}
	}
</script>