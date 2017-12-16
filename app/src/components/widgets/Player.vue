<template lang="pug">
div
	md-card.player.md-primary.md-elevation-4(:class='{hidden: !queueExists}')
		audio(
			:src='streamSource',
			type='audio/mpeg',
			ref='audio',
			autoplay, controls
		)

		md-button.md-icon-button.md-raised(@click='plause')
			md-icon {{player.playing ? 'pause' : 'play_arrow'}}

		div
			span Name: {{player.nowPlaying.name}}
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
	    	// transform: translateY(100%);
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
				if (!this.player.nowPlaying) return

				const artist = this.player.nowPlaying.artists[0].name
				const track = this.player.nowPlaying.name

				return '/stream?' + queryString.stringify({artist, track})
			},
			queueExists() {
				return !!this.player.nowPlaying
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
			'player.playing'() {
				console.log('test')
				const updatedToPlaying = this.player.playing,
					  audio = this.$refs.audio

				!updatedToPlaying ? audio.pause() : audio.play()
			}
		}
	}
</script>