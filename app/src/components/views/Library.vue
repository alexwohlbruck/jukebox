<template lang="pug">
	md-tabs.md-transparent
		md-tab#songs(md-label='songs')
			tracks

		md-tab#albums(md-label='albums')
			albums
</template>

<script>
	import Tracks from '../widgets/Tracks'
	import Albums from '../widgets/Albums'

	export default {
		name: 'Library',
		data() {
			return {
				
			}
		},
		components: {
			Tracks,
			Albums
		}
	}
</script>