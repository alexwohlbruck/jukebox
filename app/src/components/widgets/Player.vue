<template lang="pug">
	md-card.player.md-primary.md-elevation-4(:class='{hidden: !queueExists}')
		audio(:src='streamSource' type='audio/mpeg', v-if='queueExists', autoplay, controls)

		md-button.md-icon-button.md-raised(@click='plause')
			md-icon {{paused ? 'play_arrow' : 'pause'}}

		p {{player.queue.nowPlaying.track.name}}
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
	import { mapGetters } from 'vuex'

	export default {
		name: 'player',
		data() {
			return {
				paused: true
			}
		},
		computed: {
			streamSource() {
				const artist = this.player.queue.nowPlaying.track.artists[0].name
				const track = this.player.queue.nowPlaying.track.name
				console.log('/stream?' + queryString.stringify({artist, track}))
				return '/stream?' + queryString.stringify({artist, track})
			},
			queueExists() {
				return !!this.player.queue.nowPlaying.track
			},
			...mapGetters([
				'player'
			])
		},
		methods: {
			plause() {
				this.paused = !this.paused
			}
		}
	}
</script>