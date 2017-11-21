<template lang="pug">
	md-card.player.md-primary.md-elevation-4(:class='{hidden: !queueExists}')
		audio(:src='streamSource', type='audio/mpeg', ref='audio', v-if='queueExists', autoplay, controls)

		md-button.md-icon-button.md-raised(@click='plause')
			md-icon {{player.paused ? 'play_arrow' : 'pause'}}

		div
			span {{player.nowPlaying.track.name}}
</template>

<style lang="scss" scoped>
	audio {
		display: none;
	}

	.player {
		position: fixed;
	    width: inherit;
	    bottom: 0;
	    z-index: 20;
	    height: 75px;

	    &.hidden {
	    	transform: translateY(100%);
	    }
	}
</style>

<script>
	import queryString from 'query-string'
	import { mapGetters, mapActions } from 'vuex'

	export default {
		name: 'player',
		computed: {
			streamSource() {
				const artist = this.player.nowPlaying.track.artists[0].name
				const track = this.player.nowPlaying.track.name
				return '/stream?' + queryString.stringify({artist, track})
			},
			queueExists() {
				return !!this.player.nowPlaying.track
			},
			...mapGetters([
				'player'
			])
		},
		methods: {
			...mapActions([
				'plause'
			])
		},
		watch: {
			'player.paused'() {
				const updatedToPaused = this.player.paused,
					  audio = this.$refs.audio

				updatedToPaused ? audio.pause() : audio.play()
			}
		}
	}
</script>