<template lang="pug">
	md-tabs.md-transparent
		md-tab#songs(md-label='songs')
			tracks-list

		md-tab#albums(md-label='albums')
			albums-list
</template>

<script>
	import TracksList from '../widgets/TracksList'
	import AlbumsList from '../widgets/AlbumsList'

	export default {
		name: 'Library',
		data() {
			return {
				
			}
		},
		components: {
			TracksList,
			AlbumsList
		}
	}
</script>